import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:4321';
const OUTPUT_DIR = path.join(process.cwd(), 'scratch', 'qa_screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const routes = [
  { name: 'home', path: '/' },
  { name: 'destinos', path: '/destinos/' },
  { name: 'colores', path: '/colores/' },
  { name: 'precios', path: '/precios-bulldog-fluffy/' },
  { name: 'sobre_nosotros', path: '/sobre-nosotros/' },
  { name: 'blog', path: '/blog/' },
  { name: 'color_lilac', path: '/colores/fluffy-lilac/' }
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 }
];

(async () => {
  console.log('🚀 Iniciando auditoría visual Playwright con trailing slashes...');
  const browser = await chromium.launch({ headless: true });

  const results = [];

  for (const vp of viewports) {
    for (const route of routes) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height }
      });
      const page = await context.newPage();

      const pageUrl = `${BASE_URL}${route.path}`;
      console.log(`📸 Capturando [${vp.name}] ${route.name} (${pageUrl})...`);

      try {
        await page.goto(pageUrl, { waitUntil: 'networkidle', timeout: 15000 });
        // Scroll down to load all Aceternity UI components & images
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 300;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if (totalHeight >= scrollHeight) {
                clearInterval(timer);
                window.scrollTo(0, 0);
                resolve();
              }
            }, 100);
          });
        });
        await page.waitForTimeout(1000);

        const filename = `qa_${route.name}_${vp.name}.png`;
        const filepath = path.join(OUTPUT_DIR, filename);
        await page.screenshot({ path: filepath, fullPage: false });

        const fullFilename = `qa_${route.name}_${vp.name}_full.png`;
        const fullFilepath = path.join(OUTPUT_DIR, fullFilename);
        await page.screenshot({ path: fullFilepath, fullPage: true });

        results.push({
          route: route.name,
          viewport: vp.name,
          status: 'SUCCESS',
          path: filepath,
          fullPath: fullFilepath
        });
      } catch (err) {
        console.error(`❌ Error en ${route.name} (${vp.name}):`, err.message);
        results.push({
          route: route.name,
          viewport: vp.name,
          status: 'ERROR',
          error: err.message
        });
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();
  console.log('✅ Captura finalizada. Generando reporte...');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'report.json'), JSON.stringify(results, null, 2));
  console.log('📊 Reporte guardado en', path.join(OUTPUT_DIR, 'report.json'));
})();
