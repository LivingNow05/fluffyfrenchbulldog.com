import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const ARTIFACT_DIR = '/Users/anthony/.gemini/antigravity/brain/f58f7a5e-0d73-47b0-adb0-f6849e3c62c9';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(DIST_DIR, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(4321, async () => {
  console.log('Servidor QA corriendo en http://localhost:4321');
  const browser = await chromium.launch({ headless: true });

  const urlsToTest = [
    { name: 'Lima', url: 'http://localhost:4321/bulldog-frances-fluffy-lima/' },
    { name: 'Bogotá', url: 'http://localhost:4321/bulldog-frances-fluffy-bogota/' },
    { name: 'CDMX', url: 'http://localhost:4321/bulldog-frances-fluffy-cdmx/' },
  ];

  let allTestsPassed = true;

  console.log('\n--- 1. VERIFICACIÓN DE RUTAS DE CIUDADES (LIMA, BOGOTÁ, CDMX) ---');
  for (const item of urlsToTest) {
    const page = await browser.newPage();
    const response = await page.goto(item.url, { waitUntil: 'networkidle' });
    const status = response?.status();
    const h1 = await page.textContent('h1');
    console.log(`[${item.name}] URL: ${item.url} | Status: ${status} | H1: "${h1?.trim()}"`);

    if (status !== 200) {
      console.error(`❌ Fallo en ${item.name}: Código de estado ${status}`);
      allTestsPassed = false;
    }

    // EEAT Section check - check for EEAT text in page
    const eeatCount = await page.locator('text=EEAT').count();
    const hasEeat = eeatCount > 0;
    console.log(`[${item.name}] Sección EEAT presente (${eeatCount} coincidencias): ${hasEeat ? '✅ SÍ' : '❌ NO'}`);
    if (!hasEeat) allTestsPassed = false;

    // Color cards links check
    const colorCardHrefs = await page.$$eval('.grid a.card', (cards) =>
      cards.map((c) => c.getAttribute('href'))
    );
    const validColorLinks = colorCardHrefs.filter((href) => href && href.startsWith('/colores/'));
    console.log(`[${item.name}] Enlaces de tarjetas de color a /colores/: ${validColorLinks.length}/${colorCardHrefs.length} (${validColorLinks.join(', ')})`);
    if (validColorLinks.length === 0) {
      console.error(`❌ No se encontraron enlaces /colores/ en ${item.name}`);
      allTestsPassed = false;
    }

    // Reviews marquee check
    const marqueeExists = (await page.$('.marquee-container')) !== null;
    console.log(`[${item.name}] Marquesina de opiniones (Reviews Marquee): ${marqueeExists ? '✅ SÍ' : '❌ NO'}`);
    if (!marqueeExists) allTestsPassed = false;

    await page.close();
  }

  console.log('\n--- 2. CAPTURAS Y AUDITORÍA DETALLADA PARA LIMA (DESKTOP & MOBILE, CLARO & OSCURO) ---');
  const limaUrl = 'http://localhost:4321/bulldog-frances-fluffy-lima/';

  const configurations = [
    { mode: 'desktop', theme: 'light', width: 1280, height: 800, file: 'screenshot_lima_desktop_light.png' },
    { mode: 'desktop', theme: 'dark', width: 1280, height: 800, file: 'screenshot_lima_desktop_dark.png' },
    { mode: 'mobile', theme: 'light', width: 390, height: 844, file: 'screenshot_lima_mobile_light.png' },
    { mode: 'mobile', theme: 'dark', width: 390, height: 844, file: 'screenshot_lima_mobile_dark.png' },
  ];

  for (const config of configurations) {
    const page = await browser.newPage({
      viewport: { width: config.width, height: config.height },
      colorScheme: config.theme
    });

    await page.goto(limaUrl, { waitUntil: 'networkidle' });

    if (config.theme === 'light') {
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

    // Scroll slightly to trigger IntersectionObserver animations
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(500);

    // Scroll to top for full page screenshot
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    // Check for horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    console.log(`[Lima - ${config.mode.toUpperCase()} ${config.theme.toUpperCase()}] Scroll horizontal: ${hasHorizontalOverflow ? '⚠️ ALERTA DESBORDE' : '✅ OK (0px)'}`);
    if (hasHorizontalOverflow) allTestsPassed = false;

    // Save locally & to Artifacts
    const localPath = path.resolve(config.file);
    const artifactPath = path.join(ARTIFACT_DIR, config.file);

    await page.screenshot({ path: localPath, fullPage: true });
    try {
      fs.copyFileSync(localPath, artifactPath);
    } catch (e) {
      console.error('Error copying to artifact:', e);
    }

    console.log(`📸 Captura guardada: ${config.file} (${fs.statSync(localPath).size} bytes)`);

    await page.close();
  }

  await browser.close();

  server.close(() => {
    console.log('\n--- RESULTADO FINAL DE QA AUTOMATION ---');
    if (allTestsPassed) {
      console.log('✅ TODAS LAS PRUEBAS PASARON EXITOSAMENTE. ESTADO: APROBADO.');
      process.exit(0);
    } else {
      console.error('❌ HUBO ERRORES EN LAS PRUEBAS.');
      process.exit(1);
    }
  });
});
