const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGET_IMAGE_PATH = '/Users/anthony/.gemini/antigravity/brain/9131b649-ddad-4d6b-9ff0-c2fca4719441/quiz_modal_dark_fixed.png';
const SUBAGENT_IMAGE_PATH = '/Users/anthony/.gemini/antigravity/brain/c82806ee-ca94-4a1a-ab46-c64e55e57631/quiz_modal_dark_fixed.png';

function parseRgb(colorStr) {
  if (!colorStr) return null;
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: match[4] !== undefined ? parseFloat(match[4]) : 1.0
  };
}

(async () => {
  console.log('🚀 QA Playwright: Iniciando verificación del Quiz Modal en Tema Oscuro (Dark Theme)...');

  // Asegurar directorios de destino
  [TARGET_IMAGE_PATH, SUBAGENT_IMAGE_PATH].forEach(p => {
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 850 },
    colorScheme: 'dark'
  });

  const page = await context.newPage();

  try {
    // 1. Cargar página principal
    console.log('📡 Conectando a http://localhost:4321/...');
    const response = await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
    
    if (response?.status() !== 200) {
      throw new Error(`Respuesta fallida del servidor: ${response?.status()}`);
    }

    // 2. Garantizar Tema Oscuro (Dark Theme)
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.remove('light-theme');
    });
    await page.waitForTimeout(300);

    // 3. Abrir Quiz Modal (simulando clic o invocando window.openQuizModal)
    console.log('🔘 Abriendo Quiz Modal...');
    await page.evaluate(() => {
      if (typeof window.openQuizModal === 'function') {
        window.openQuizModal();
      } else {
        const link = document.querySelector('a[href*="wa.me"]');
        if (link) link.click();
      }
    });

    const overlay = page.locator('#qm-overlay');
    await overlay.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ Quiz Modal abierto correctamente');

    // 4. Responder preguntas de forma interactiva
    console.log('📝 Respondiendo al Quiz de forma interactiva...');

    let stepCount = 0;
    while (stepCount < 10) {
      stepCount++;
      // Verificar si estamos en la pantalla de resultados
      if (await page.locator('#qm-steps .qm-result').isVisible()) {
        console.log('  🎉 Pantalla de resultados alcanzada');
        break;
      }

      // Verificar si hay input de ciudad
      const ciudadInput = page.locator('#qm-ciudad-input');
      if (await ciudadInput.isVisible()) {
        console.log('  -> Completando input de Ciudad ("Lima")...');
        await ciudadInput.fill('Lima');
        await page.locator('#qm-ciudad-btn').click({ force: true });
        await page.waitForTimeout(600);
        continue;
      }

      // Verificar si hay opciones de respuesta (.qm-opt)
      const opt = page.locator('#qm-steps .qm-opt').first();
      if (await opt.isVisible()) {
        const text = await opt.locator('.qm-opt-label').innerText().catch(() => 'Opción');
        console.log(`  -> Paso ${stepCount}: Seleccionando "${text}"...`);
        await opt.click({ force: true });
        await page.waitForTimeout(600);
        continue;
      }

      await page.waitForTimeout(300);
    }

    // 5. Esperar la pantalla de resultados
    const resultsContainer = page.locator('#qm-steps .qm-result');
    await resultsContainer.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ Pantalla de resultados confirmada visible en modo oscuro');

    // 6. Tomar captura de pantalla del modal en modo oscuro
    await page.screenshot({ path: TARGET_IMAGE_PATH });
    fs.copyFileSync(TARGET_IMAGE_PATH, SUBAGENT_IMAGE_PATH);
    console.log(`📸 Captura del modal en Tema Oscuro guardada exitosamente en:\n   ${TARGET_IMAGE_PATH}`);

    // 7. Inspeccionar y verificar las tarjetas de recomendación (.qm-rec-name, .qm-rec-tag, .qm-rec-price)
    console.log('\n🔍 Verificando legibilidad y estilos en Tema Oscuro (.qm-rec-name, .qm-rec-tag, .qm-rec-price):');

    const elementsData = await page.evaluate(() => {
      const recs = document.querySelectorAll('#qm-steps .qm-result .qm-rec');
      const results = [];

      recs.forEach((rec, idx) => {
        const nameEl = rec.querySelector('.qm-rec-name');
        const tagEl = rec.querySelector('.qm-rec-tag');
        const priceEl = rec.querySelector('.qm-rec-price');
        const priceStrongEl = rec.querySelector('.qm-rec-price strong');

        const getMetrics = (el) => {
          if (!el) return null;
          const cs = window.getComputedStyle(el);
          return {
            text: el.innerText.trim().replace(/\n/g, ' '),
            color: cs.color,
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
            opacity: cs.opacity,
            visibility: cs.visibility,
            display: cs.display
          };
        };

        results.push({
          cardIndex: idx + 1,
          name: getMetrics(nameEl),
          tag: getMetrics(tagEl),
          price: getMetrics(priceEl),
          priceStrong: getMetrics(priceStrongEl)
        });
      });

      return results;
    });

    let allClear = true;

    elementsData.forEach(card => {
      console.log(`\n--- Tarjeta de Recomendación #${card.cardIndex} ---`);

      // Verificar .qm-rec-name
      if (card.name) {
        const rgb = parseRgb(card.name.color);
        console.log(`  [.qm-rec-name] Texto: "${card.name.text}" | Color: ${card.name.color}`);
        if (rgb && rgb.r < 180 && rgb.g < 180 && rgb.b < 180) {
          console.error(`  ❌ ERROR: .qm-rec-name es oscuro/negro (${card.name.color})`);
          allClear = false;
        } else {
          console.log(`  ✅ .qm-rec-name: Blanco nítido (${card.name.color})`);
        }
      } else {
        console.error(`  ❌ ERROR: No se encontró .qm-rec-name`);
        allClear = false;
      }

      // Verificar .qm-rec-tag
      if (card.tag) {
        const rgb = parseRgb(card.tag.color);
        console.log(`  [.qm-rec-tag] Texto: "${card.tag.text}" | Color: ${card.tag.color}`);
        if (rgb && rgb.r < 150 && rgb.g < 150 && rgb.b < 150) {
          console.error(`  ❌ ERROR: .qm-rec-tag es oscuro/negro (${card.tag.color})`);
          allClear = false;
        } else {
          console.log(`  ✅ .qm-rec-tag: Claro y legible (${card.tag.color})`);
        }
      } else {
        console.error(`  ❌ ERROR: No se encontró .qm-rec-tag`);
        allClear = false;
      }

      // Verificar .qm-rec-price
      if (card.price) {
        const rgbPrice = parseRgb(card.price.color);
        console.log(`  [.qm-rec-price] Texto: "${card.price.text}" | Color: ${card.price.color}`);
        if (rgbPrice && rgbPrice.r < 150 && rgbPrice.g < 150 && rgbPrice.b < 150) {
          console.error(`  ❌ ERROR: .qm-rec-price es oscuro/negro (${card.price.color})`);
          allClear = false;
        } else {
          console.log(`  ✅ .qm-rec-price: Claro y legible (${card.price.color})`);
        }
      }

      // Verificar .qm-rec-price strong (Dorado/Amber)
      if (card.priceStrong) {
        const rgbStrong = parseRgb(card.priceStrong.color);
        console.log(`  [.qm-rec-price strong] Texto: "${card.priceStrong.text}" | Color: ${card.priceStrong.color}`);
        if (rgbStrong && rgbStrong.r < 180) {
          console.error(`  ❌ ERROR: .qm-rec-price strong no es dorado (${card.priceStrong.color})`);
          allClear = false;
        } else {
          console.log(`  ✅ .qm-rec-price strong: Dorado brillante (${card.priceStrong.color})`);
        }
      } else {
        console.error(`  ❌ ERROR: No se encontró .qm-rec-price strong`);
        allClear = false;
      }
    });

    if (allClear) {
      console.log('\n✨ RESULTADO FINAL QA AUTOMATION: APROBADO');
      console.log('✅ Todos los textos de las tarjetas (.qm-rec-name, .qm-rec-tag, .qm-rec-price) son blanco/dorado con legibilidad cristalina.');
      process.exit(0);
    } else {
      console.error('\n❌ RESULTADO FINAL QA AUTOMATION: RECHAZADO');
      process.exit(1);
    }

  } catch (err) {
    console.error('❌ Error durante la ejecución del QA test:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
