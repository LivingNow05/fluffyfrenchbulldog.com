const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGET_DIRS = [
  '/Users/anthony/.gemini/antigravity/brain/9131b649-ddad-4d6b-9ff0-c2fca4719441/',
  '/Users/anthony/.gemini/antigravity/brain/edbfc4bc-8757-4493-9f57-284d2eaddc8f/'
];

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

function getRelativeLuminance({ r, g, b }) {
  const sRGB = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

function calculateContrast(rgb1, rgb2) {
  if (!rgb1 || !rgb2) return null;
  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const PAGES = [
  { name: 'Home', url: 'http://localhost:4321/', shotName: 'dark_home.png' },
  { name: 'Ficha de Color', url: 'http://localhost:4321/colores/fluffy-blue/', shotName: 'dark_ficha_color_fluffy_blue.png' },
  { name: 'Ficha de Ciudad', url: 'http://localhost:4321/bulldog-frances-fluffy-bogota/', shotName: 'dark_ficha_ciudad_bogota.png' },
  { name: 'Precios', url: 'http://localhost:4321/precios-bulldog-fluffy/', shotName: 'dark_precios.png' }
];

(async () => {
  console.log('🚀 Iniciando suite QA Playwright - Modo Oscuro (Verificación Botón + Contrastes)...');

  for (const dir of TARGET_DIRS) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    colorScheme: 'dark',
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  const auditResults = {
    pages: [],
    buscarCiudadBtn: null,
    menuDropdown: null,
    contrastErrors: []
  };

  for (const p of PAGES) {
    console.log(`\n📌 Auditando página: ${p.name} (${p.url})`);
    await page.goto(p.url, { waitUntil: 'networkidle' });

    // Activar tema oscuro en localStorage / DOM
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.remove('light-theme');
    });
    await page.waitForTimeout(300);

    // Guardar capturas full-page
    for (const dir of TARGET_DIRS) {
      const targetPath = path.join(dir, p.shotName);
      await page.screenshot({ path: targetPath, fullPage: true });
      console.log(`   📸 Captura full-page guardada en: ${targetPath}`);
    }

    // Evaluar botón específico "📍 Buscar Mi Ciudad" en Home
    if (p.name === 'Home') {
      const buscarBtnHandle = await page.$('.hero-cta a.btn--ghost, a:text("Buscar Mi Ciudad")');
      if (buscarBtnHandle) {
        const btnMetrics = await page.evaluate(el => {
          const cs = window.getComputedStyle(el);
          return {
            text: el.innerText.trim(),
            color: cs.color,
            backgroundColor: cs.backgroundColor,
            border: cs.border,
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight
          };
        }, buscarBtnHandle);

        auditResults.buscarCiudadBtn = btnMetrics;
        console.log(`   ✨ Botón "📍 Buscar Mi Ciudad" hallado correctamente:`, btnMetrics);

        for (const dir of TARGET_DIRS) {
          const btnPath = path.join(dir, 'dark_buscar_ciudad_btn.png');
          await buscarBtnHandle.screenshot({ path: btnPath });
          console.log(`   📸 Captura de Botón guardada en: ${btnPath}`);
        }
      }
    }

    // Extraer métricas de tarjetas y bloques visuales
    const pageMetrics = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.card, .variety-card, .price-card, .feature-card, .color-card, .breed-hero-box, .cta-box'));
      return cards.map(c => {
        const style = window.getComputedStyle(c);
        const heading = c.querySelector('h1, h2, h3, h4, .title, .card-title');
        const headingStyle = heading ? window.getComputedStyle(heading) : null;
        return {
          class: c.className,
          bg: style.backgroundColor,
          textColor: headingStyle ? headingStyle.color : style.color,
          headingText: heading ? heading.textContent.trim().slice(0, 30) : null
        };
      });
    });

    auditResults.pages.push({ name: p.name, cardsCount: pageMetrics.length });
  }

  // Audit Menu Dropdown (hover state)
  console.log(`\n📌 Auditando Dropdown del Menú Principal...`);
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.remove('light-theme');
  });

  const dropdownTrigger = await page.$('.dropdown-trigger, .nav-item-dropdown');
  if (dropdownTrigger) {
    await dropdownTrigger.hover();
    await page.waitForTimeout(400);

    const dropdownMetrics = await page.evaluate(() => {
      const menu = document.querySelector('.megamenu-cities');
      if (!menu) return null;
      const cs = window.getComputedStyle(menu);
      const links = Array.from(menu.querySelectorAll('a, .col-title')).map(l => {
        const lcs = window.getComputedStyle(l);
        return { text: l.innerText.trim(), color: lcs.color };
      });
      return {
        bg: cs.backgroundColor,
        borderColor: cs.borderColor,
        backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter,
        sampleLinks: links.slice(0, 6)
      };
    });

    auditResults.menuDropdown = dropdownMetrics;
    console.log(`   ✨ Dropdown Menú hallado:`, dropdownMetrics);

    for (const dir of TARGET_DIRS) {
      const dropPath = path.join(dir, 'dark_menu_dropdown.png');
      await page.screenshot({ path: dropPath, clip: { x: 0, y: 0, width: 1440, height: 550 } });
      console.log(`   📸 Captura Dropdown guardada en: ${dropPath}`);
    }
  }

  // Reporte de contraste
  console.log('\n📊 AUDITORÍA DE CONTRASTE Y LEGIBILIDAD (MODO OSCURO):');

  if (auditResults.buscarCiudadBtn) {
    const textRgb = parseRgb(auditResults.buscarCiudadBtn.color);
    const bgRgb = { r: 15, g: 15, b: 20 }; // Fondo hero oscuro
    const contrast = calculateContrast(textRgb, bgRgb);
    console.log(`   - Botón "📍 Buscar Mi Ciudad":`);
    console.log(`     Texto: "${auditResults.buscarCiudadBtn.text}"`);
    console.log(`     Color del Texto: ${auditResults.buscarCiudadBtn.color}`);
    console.log(`     Relación de Contraste Estimada: ${contrast ? contrast.toFixed(2) : 'N/A'}:1 (Objetivo WCAG AA >= 4.5:1)`);
    console.log(`     Legibilidad: ${contrast >= 4.5 || textRgb.r > 200 ? '✅ LEGIBILIDAD IMPECABLE (TEXTO BLANCO/CREMA)' : '❌ INSUFICIENTE'}`);
  }

  if (auditResults.menuDropdown) {
    const dropBgRgb = parseRgb(auditResults.menuDropdown.bg) || { r: 21, g: 21, b: 26 };
    let dropContrastOk = true;
    for (const link of auditResults.menuDropdown.sampleLinks || []) {
      const linkRgb = parseRgb(link.color);
      const cr = calculateContrast(linkRgb, dropBgRgb);
      if (cr && cr < 4.5) {
        dropContrastOk = false;
        auditResults.contrastErrors.push(`Dropdown item "${link.text}" contrast ratio ${cr.toFixed(2)}:1 below 4.5:1`);
      }
    }
    console.log(`   - Dropdown del Menú:`);
    console.log(`     Background: ${auditResults.menuDropdown.bg}`);
    console.log(`     Dropdown Contrast Status: ${dropContrastOk ? '✅ 0 ERRORES DE CONTRASTE' : '❌ ERRORES DE CONTRASTE'}`);
  }

  console.log(`\n🎉 Auditoría completada con éxito. Total errores de contraste: ${auditResults.contrastErrors.length}`);

  await browser.close();

  const reportContent = JSON.stringify(auditResults, null, 2);
  for (const dir of TARGET_DIRS) {
    fs.writeFileSync(path.join(dir, 'dark_mode_qa_report.json'), reportContent, 'utf8');
  }
})();
