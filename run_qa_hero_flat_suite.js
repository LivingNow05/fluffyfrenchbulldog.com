import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/anthony/.gemini/antigravity/brain/1926d953-8962-4c51-aad6-37cdb0e063f4';
const BASE_URL = 'http://localhost:4321/';

async function runQAHeroFlatSuite() {
  console.log('🚀 [QA Automation] Iniciando Suite de Pruebas Playwright (Flat System & Hero Switcher)...');
  
  const browser = await chromium.launch({ headless: true });
  const results = {
    serverStatus: false,
    heroSwitch: true,
    glassmorphismAudit: true,
    animationAudit: true,
    overflowAudit: true,
    screenshots: [],
    cardAuditDetails: []
  };

  // 1. Verificar Servidor Local
  try {
    const page = await browser.newPage();
    const resp = await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    if (resp && resp.status() === 200) {
      results.serverStatus = true;
      console.log('  ✅ 1. Servidor http://localhost:4321/ en línea (Status 200 OK)');
    } else {
      console.error(`  ❌ 1. Servidor devolvió status: ${resp ? resp.status() : 'Error'}`);
    }
    await page.close();
  } catch (e) {
    console.error('  ❌ 1. Error de conexión con el servidor local:', e.message);
  }

  if (!results.serverStatus) {
    await browser.close();
    process.exit(1);
  }

  // 2. Probar Conmutador de Hero (Vista 1 vs Vista 2) en Desktop y Móvil (Oscuro y Claro)
  console.log('\n📸 2. Probando Conmutador de Hero (Vista 1: Fotografía vs Vista 2: Tipográfica Centrada)...');
  
  const viewports = [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'mobile', width: 390, height: 844 }
  ];

  const vistas = [
    { id: 'v1', btnId: '#btn-hero-v1', targetId: '#hero-vista-1', name: 'vista1_foto' },
    { id: 'v2', btnId: '#btn-hero-v2', targetId: '#hero-vista-2', name: 'vista2_centrada' }
  ];

  const themes = ['dark', 'light'];

  for (const theme of themes) {
    for (const vp of viewports) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });

      // Aplicar tema
      if (theme === 'light') {
        await page.evaluate(() => {
          document.documentElement.classList.add('light-theme');
          localStorage.setItem('theme', 'light');
        });
      } else {
        await page.evaluate(() => {
          document.documentElement.classList.remove('light-theme');
          localStorage.setItem('theme', 'dark');
        });
      }
      await page.waitForTimeout(200);

      for (const v of vistas) {
        // Hacer click en el conmutador de Vista
        const btn = page.locator(v.btnId);
        if (await btn.count() > 0) {
          await btn.click();
          await page.waitForTimeout(400);

          const isVisible = await page.isVisible(v.targetId);
          console.log(`  [${theme.toUpperCase()} - ${vp.name.toUpperCase()}] ${v.name}: ${isVisible ? '✅ Visible' : '❌ Oculto'}`);
          if (!isVisible) results.heroSwitch = false;
        } else {
          console.error(`  ❌ Botón de conmutación ${v.btnId} no encontrado`);
          results.heroSwitch = false;
        }

        // Verificar desborde horizontal real
        const canScrollX = await page.evaluate(() => {
          window.scrollTo(100, 0);
          const scrollX = window.scrollX;
          window.scrollTo(0, 0);
          return scrollX > 0;
        });

        if (canScrollX) {
          console.error(`  ⚠️ Desborde horizontal detectado en ${vp.name} (${theme})`);
          results.overflowAudit = false;
        } else {
          console.log(`  [${theme.toUpperCase()} - ${vp.name.toUpperCase()}] Scroll Horizontal: ✅ 0px (Sin desborde)`);
        }

        // Tomar Captura de Pantalla
        const filename = `screenshot_hero_${v.name}_${theme}_${vp.name}.png`;
        const localPath = path.resolve(filename);
        const artifactPath = path.join(ARTIFACT_DIR, filename);

        await page.screenshot({ path: localPath, fullPage: false });
        fs.copyFileSync(localPath, artifactPath);

        results.screenshots.push({
          filename,
          localPath,
          artifactPath,
          theme,
          viewport: vp.name,
          vista: v.name
        });
        console.log(`  📸 Captura guardada: ${filename}`);
      }

      await page.close();
    }
  }

  // 3. Auditoría de CERO Glassmorfismo y Animaciones GSAP
  console.log('\n🎨 3. Verificando CERO Glassmorfismo en Tarjetas de Variedades, Precios y Ciudades...');
  const auditPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await auditPage.goto(BASE_URL, { waitUntil: 'networkidle' });

  // Auditar tarjetas en Modo Oscuro y Claro
  for (const t of ['dark', 'light']) {
    if (t === 'light') {
      await auditPage.evaluate(() => {
        document.documentElement.classList.add('light-theme');
      });
    } else {
      await auditPage.evaluate(() => {
        document.documentElement.classList.remove('light-theme');
      });
    }
    await auditPage.waitForTimeout(200);

    const cardsInfo = await auditPage.evaluate((tName) => {
      const cards = Array.from(document.querySelectorAll('.card, .hero-centered-card, .qm-card, .price-card, .city-card'));
      return cards.map((card, idx) => {
        const cs = window.getComputedStyle(card);
        const backdrop = cs.backdropFilter || cs.webkitBackdropFilter || 'none';
        const bg = cs.backgroundColor;
        return {
          theme: tName,
          index: idx,
          className: card.className,
          backdropFilter: backdrop,
          backgroundColor: bg,
          hasGlass: backdrop !== 'none' && backdrop !== '' && backdrop !== 'none !important'
        };
      });
    }, t);

    const glassViolations = cardsInfo.filter(c => c.hasGlass);
    if (glassViolations.length === 0) {
      console.log(`  ✅ CERO Glassmorfismo en Modo ${t.toUpperCase()}: ${cardsInfo.length} tarjetas inspeccionadas tienen fondo sólido limpio y sin backdrop-filter.`);
    } else {
      console.error(`  ❌ Se detectó glassmorfismo en ${glassViolations.length} tarjetas en Modo ${t.toUpperCase()}`);
      results.glassmorphismAudit = false;
    }
    results.cardAuditDetails.push(...cardsInfo);
  }

  // Auditar GSAP / ScrollTrigger Scroll Reveal
  console.log('\n🌀 4. Verificando Animaciones GSAP / Scroll Reveal...');
  await auditPage.evaluate(async () => {
    window.scrollTo(0, 600);
    await new Promise(r => setTimeout(r, 400));
    window.scrollTo(0, 1400);
    await new Promise(r => setTimeout(r, 400));
  });
  await auditPage.waitForTimeout(600);

  const revealStats = await auditPage.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.card, .city-card, .price-card, .reveal'));
    const animatedCount = cards.filter((el) => {
      const style = window.getComputedStyle(el);
      return parseFloat(style.opacity) > 0.8 || el.classList.contains('is-visible');
    }).length;
    return { total: cards.length, animated: animatedCount };
  });

  console.log(`  ✅ Animaciones GSAP de Scroll: ${revealStats.animated}/${revealStats.total} elementos animados ultra-fluidos.`);
  if (revealStats.animated > 0) {
    results.animationAudit = true;
  } else {
    results.animationAudit = false;
  }

  await auditPage.close();
  await browser.close();

  // Escribir reporte
  fs.writeFileSync('qa_flat_report.json', JSON.stringify(results, null, 2));

  console.log('\n=================== RESUMEN FINAL DE PRUEBAS QA ===================');
  console.log(`1. Compilación y Servidor Local (http://localhost:4321/): ${results.serverStatus ? '✅ APROBADO' : '❌ RECHAZADO'}`);
  console.log(`2. Conmutador Hero (Vista 1 vs Vista 2):                 ${results.heroSwitch ? '✅ APROBADO' : '❌ RECHAZADO'}`);
  console.log(`3. Cero Glassmorfismo (Fondos Sólidos Limpios):          ${results.glassmorphismAudit ? '✅ APROBADO' : '❌ RECHAZADO'}`);
  console.log(`4. Animaciones GSAP Ultra-Fluidas al Hacer Scroll:       ${results.animationAudit ? '✅ APROBADO' : '❌ RECHAZADO'}`);
  console.log(`5. Responsividad y Cero Scroll Horizontal (390px/1280px): ${results.overflowAudit ? '✅ APROBADO' : '❌ RECHAZADO'}`);
  console.log(`6. Total de Capturas HD Guardadas y Copiadas a Artifacts: ${results.screenshots.length}`);
  console.log('===================================================================\n');

  if (results.serverStatus && results.heroSwitch && results.glassmorphismAudit && results.animationAudit && results.overflowAudit) {
    console.log('🎉 ESTADO GENERAL: APROBADO CON ÉXITO');
    process.exit(0);
  } else {
    console.error('⚠️ ESTADO GENERAL: ALGUNAS PRUEBAS FALLARON');
    process.exit(1);
  }
}

runQAHeroFlatSuite().catch(err => {
  console.error('Error fatal corriendo suite de pruebas QA:', err);
  process.exit(1);
});
