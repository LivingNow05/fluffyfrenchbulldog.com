import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const ARTIFACT_DIR = '/Users/anthony/.gemini/antigravity/brain/16b1d29d-4562-4b5e-9a72-9c974ab182bb';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

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
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  let filePath = path.join(DIST_DIR, reqPath);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath += '.html';
  }
  if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
    filePath = path.join(filePath, 'index.html');
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

const PORT = 43288;

server.listen(PORT, async () => {
  console.log(`🚀 QA Server running on http://localhost:${PORT}`);
  const browser = await chromium.launch({ headless: true });
  let allPassed = true;

  try {
    const configurations = [
      { mode: 'desktop', theme: 'dark', width: 1280, height: 800 },
      { mode: 'desktop', theme: 'light', width: 1280, height: 800 },
      { mode: 'mobile', theme: 'dark', width: 390, height: 844 },
      { mode: 'mobile', theme: 'light', width: 390, height: 844 }
    ];

    for (const config of configurations) {
      console.log(`\n==================================================`);
      console.log(`🧪 TESTING QUIZ MODAL [${config.mode.toUpperCase()} - ${config.theme.toUpperCase()}] (${config.width}x${config.height})`);
      console.log(`==================================================`);

      const context = await browser.newContext({
        viewport: { width: config.width, height: config.height },
        colorScheme: config.theme
      });
      const page = await context.newPage();

      // Go to homepage
      const response = await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
      if (response?.status() !== 200) {
        console.error(`❌ Error loading page status: ${response?.status()}`);
        allPassed = false;
        continue;
      }

      if (config.theme === 'light') {
        await page.evaluate(() => {
          document.documentElement.classList.add('light-theme');
        });
      } else {
        await page.evaluate(() => {
          document.documentElement.classList.remove('light-theme');
        });
      }

      // Step 0: Open Modal by triggering click event or window.openQuizModal
      await page.evaluate(() => {
        const link = document.querySelector('a[href*="wa.me"]');
        if (link) link.click();
        else if (window.openQuizModal) window.openQuizModal();
      });

      // Wait for modal overlay to be visible
      const modalOverlay = page.locator('#qm-overlay');
      await modalOverlay.waitFor({ state: 'visible', timeout: 5000 });
      console.log('✅ Quiz Modal opened successfully');

      // Screenshot Step 1 (Vivienda)
      const ss1Name = `screenshot_quiz_step1_${config.mode}_${config.theme}.png`;
      await page.screenshot({ path: ss1Name });
      fs.copyFileSync(ss1Name, path.join(ARTIFACT_DIR, ss1Name));
      console.log(`📸 Screenshot saved: ${ss1Name}`);

      // Answer 1: Vivienda (Apartamento / Casa)
      await page.locator('#qm-steps .qm-opt').first().click({ force: true });
      await page.waitForTimeout(400);

      // Screenshot Step 2 (Actividad)
      const ss2Name = `screenshot_quiz_step2_${config.mode}_${config.theme}.png`;
      await page.screenshot({ path: ss2Name });
      fs.copyFileSync(ss2Name, path.join(ARTIFACT_DIR, ss2Name));
      console.log(`📸 Screenshot saved: ${ss2Name}`);

      // Answer 2: Actividad
      await page.locator('#qm-steps .qm-opt').first().click({ force: true });
      await page.waitForTimeout(400);

      // Screenshot Step 3 (Niños)
      const ss3Name = `screenshot_quiz_step3_${config.mode}_${config.theme}.png`;
      await page.screenshot({ path: ss3Name });
      fs.copyFileSync(ss3Name, path.join(ARTIFACT_DIR, ss3Name));
      console.log(`📸 Screenshot saved: ${ss3Name}`);

      // Answer 3: Niños
      await page.locator('#qm-steps .qm-opt').first().click({ force: true });
      await page.waitForTimeout(400);

      // Screenshot Step 4 (Presupuesto)
      const ss4Name = `screenshot_quiz_step4_${config.mode}_${config.theme}.png`;
      await page.screenshot({ path: ss4Name });
      fs.copyFileSync(ss4Name, path.join(ARTIFACT_DIR, ss4Name));
      console.log(`📸 Screenshot saved: ${ss4Name}`);

      // Answer 4: Presupuesto
      await page.locator('#qm-steps .qm-opt').first().click({ force: true });
      await page.waitForTimeout(400);

      // Screenshot Step 5 (Sexo)
      const ss5Name = `screenshot_quiz_step5_${config.mode}_${config.theme}.png`;
      await page.screenshot({ path: ss5Name });
      fs.copyFileSync(ss5Name, path.join(ARTIFACT_DIR, ss5Name));
      console.log(`📸 Screenshot saved: ${ss5Name}`);

      // Answer 5: Sexo
      await page.locator('#qm-steps .qm-opt').first().click({ force: true });
      await page.waitForTimeout(400);

      // Step 6: Ciudad
      const ciudadInput = page.locator('#qm-ciudad-input');
      if (await ciudadInput.isVisible()) {
        await ciudadInput.fill('Lima');
        console.log('✅ Ciudad typed: "Lima"');

        const ss6Name = `screenshot_quiz_step6_${config.mode}_${config.theme}.png`;
        await page.screenshot({ path: ss6Name });
        fs.copyFileSync(ss6Name, path.join(ARTIFACT_DIR, ss6Name));
        console.log(`📸 Screenshot saved: ${ss6Name}`);

        await page.locator('#qm-ciudad-btn').click({ force: true });
        await page.waitForTimeout(500);
      }

      // Step Results: Verification
      const ssResName = `screenshot_quiz_results_${config.mode}_${config.theme}.png`;
      await page.screenshot({ path: ssResName });
      fs.copyFileSync(ssResName, path.join(ARTIFACT_DIR, ssResName));
      console.log(`📸 Screenshot saved: ${ssResName}`);

      // Check results card and COP/USD prices
      const resultsContainer = page.locator('#qm-steps .qm-result');
      const hasResults = await resultsContainer.isVisible();
      console.log(`[${config.mode}-${config.theme}] Resultados visibles: ${hasResults ? '✅ SÍ' : '❌ NO'}`);
      if (!hasResults) allPassed = false;

      const pricesContent = await page.locator('#qm-steps').textContent();
      const containsCOP = pricesContent.includes('COP');
      const containsUSD = pricesContent.includes('USD');

      console.log(`[${config.mode}-${config.theme}] Precios en COP: ${containsCOP ? '✅ SÍ' : '❌ NO'}`);
      console.log(`[${config.mode}-${config.theme}] Precios en USD: ${containsUSD ? '✅ SÍ' : '❌ NO'}`);

      if (!containsCOP || !containsUSD) allPassed = false;

      // Verify WhatsApp URL message
      let popupUrl = '';
      const [popup] = await Promise.all([
        page.waitForEvent('popup', { timeout: 4000 }).catch(() => null),
        page.locator('#qm-wa-btn').click({ force: true })
      ]);

      if (popup) {
        popupUrl = popup.url();
      }

      console.log(`[${config.mode}-${config.theme}] URL de WhatsApp generada: ${popupUrl}`);
      const decoded = decodeURIComponent(popupUrl);
      console.log(`[${config.mode}-${config.theme}] Mensaje decodificado: ${decoded}`);

      const hasVivienda = decoded.includes('Vivienda');
      const hasCaracter = decoded.includes('Carácter');
      const hasNinos = decoded.includes('Niños');
      const hasPresupuesto = decoded.includes('Presupuesto');
      const hasSexo = decoded.includes('Sexo');
      const hasLima = decoded.includes('Lima');

      console.log(`[${config.mode}-${config.theme}] WhatsApp Msg Vivienda: ${hasVivienda ? '✅' : '❌'}`);
      console.log(`[${config.mode}-${config.theme}] WhatsApp Msg Carácter: ${hasCaracter ? '✅' : '❌'}`);
      console.log(`[${config.mode}-${config.theme}] WhatsApp Msg Niños: ${hasNinos ? '✅' : '❌'}`);
      console.log(`[${config.mode}-${config.theme}] WhatsApp Msg Presupuesto: ${hasPresupuesto ? '✅' : '❌'}`);
      console.log(`[${config.mode}-${config.theme}] WhatsApp Msg Sexo: ${hasSexo ? '✅' : '❌'}`);
      console.log(`[${config.mode}-${config.theme}] WhatsApp Msg Ciudad (Lima): ${hasLima ? '✅' : '❌'}`);

      if (!hasVivienda || !hasCaracter || !hasNinos || !hasPresupuesto || !hasSexo || !hasLima) {
        console.error('❌ La URL de WhatsApp no contiene el expediente completo cualificado.');
        allPassed = false;
      }

      await page.close();
      await context.close();
    }
  } catch (err) {
    console.error('❌ Error executing QA test:', err);
    allPassed = false;
  } finally {
    await browser.close();
    server.close(() => {
      console.log('\n==================================================');
      if (allPassed) {
        console.log('✅ RESULTADO DE QA AUTOMATION: APROBADO');
        process.exit(0);
      } else {
        console.log('❌ RESULTADO DE QA AUTOMATION: RECHAZADO');
        process.exit(1);
      }
    });
  }
});
