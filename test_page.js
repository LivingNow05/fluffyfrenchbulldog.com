import { chromium } from 'playwright';

(async () => {
  console.log('Iniciando prueba headless con Playwright en http://localhost:4321/...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });

  // Hacer scroll para activar IntersectionObserver / reveal
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(800);

  const title = await page.textContent('#variedades');
  console.log('Título de la sección:', title?.trim());

  const cards = await page.$$eval('#variedades ~ .grid .card', (elements) => {
    return elements.map((el) => {
      const style = window.getComputedStyle(el);
      return {
        h3: el.querySelector('h3')?.textContent?.trim(),
        desde: el.querySelector('.desde')?.textContent?.trim(),
        opacity: style.opacity,
        visibility: style.visibility,
        display: style.display,
        height: el.clientHeight,
        width: el.clientWidth
      };
    });
  });

  console.log('--- AUDITORÍA PLAYWRIGHT DE VARIEDADES ---');
  console.log(JSON.stringify(cards, null, 2));

  await browser.close();
})();
