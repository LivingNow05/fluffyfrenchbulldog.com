import { chromium } from 'playwright';

(async () => {
  console.log('Iniciando verificación de componentes FLAT y Hero Switcher con Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });

  // Verify Vista 1 is visible initially
  const v1Visible = await page.isVisible('#hero-vista-1');
  const v2Visible = await page.isVisible('#hero-vista-2');
  console.log(`Vista 1 visible inicialmente: ${v1Visible}`);
  console.log(`Vista 2 visible inicialmente: ${v2Visible}`);

  // Screenshot Vista 1 (Dark Mode)
  await page.screenshot({ path: 'screenshot_hero_vista1_dark.png' });

  // Test Switcher: Click Vista 2
  await page.click('#btn-hero-v2');
  await page.waitForTimeout(500);

  const v1VisibleAfter = await page.isVisible('#hero-vista-1');
  const v2VisibleAfter = await page.isVisible('#hero-vista-2');
  console.log(`Vista 1 visible tras click en Vista 2: ${v1VisibleAfter}`);
  console.log(`Vista 2 visible tras click en Vista 2: ${v2VisibleAfter}`);

  // Screenshot Vista 2 (Dark Mode)
  await page.screenshot({ path: 'screenshot_hero_vista2_dark.png' });

  // Check Card FLAT Styles: verify backdrop-filter is none or zero blur
  const cardStyle = await page.$eval('.hero-centered-card', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      backgroundColor: cs.backgroundColor,
      border: cs.border,
      borderRadius: cs.borderRadius,
      backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter
    };
  });
  console.log('--- ESTILOS FLAT DE HERO CENTRADO (MODO OSCURO) ---');
  console.log(cardStyle);

  // Switch to Light Mode
  await page.evaluate(() => {
    document.documentElement.classList.add('light-theme');
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'screenshot_hero_vista2_light.png' });

  // Switch back to Vista 1 in Light Mode
  await page.click('#btn-hero-v1');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot_hero_vista1_light.png' });

  const gridCardStyle = await page.$eval('.card', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      backgroundColor: cs.backgroundColor,
      border: cs.border,
      borderRadius: cs.borderRadius,
      backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter
    };
  });
  console.log('--- ESTILOS FLAT DE TARJETA GRID .card (MODO CLARO) ---');
  console.log(gridCardStyle);

  await browser.close();
  console.log('Verificación Playwright completada con éxito!');
})();
