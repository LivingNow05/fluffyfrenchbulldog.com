import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

// Servidor estático ultra rápido en Node.js para dist/
const DIST_DIR = path.resolve('dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2'
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

server.listen(43210, async () => {
  console.log('Servidor de prueba corriendo en http://localhost:43210');
  const browser = await chromium.launch();

  const viewports = [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'tablet_860', width: 860, height: 800 },
    { name: 'mobile_640', width: 640, height: 800 },
    { name: 'mobile_480', width: 480, height: 800 },
    { name: 'mobile_360', width: 360, height: 800 }
  ];

  const themes = ['dark', 'light'];

  for (const theme of themes) {
    for (const vp of viewports) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await page.goto('http://localhost:43210/', { waitUntil: 'networkidle' });

      if (theme === 'light') {
        await page.evaluate(() => {
          document.documentElement.classList.add('light-theme');
          localStorage.setItem('theme', 'light');
        });
      }

      await page.waitForTimeout(300);

      // Chequear desbordamiento horizontal (horizontal overflow)
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      // Chequear dimensiones del header
      const headerBox = await page.evaluate(() => {
        const header = document.querySelector('.site-header');
        if (!header) return null;
        const rect = header.getBoundingClientRect();
        return {
          width: rect.width,
          left: rect.left,
          right: rect.right,
          windowWidth: window.innerWidth,
          overflows: rect.left < 0 || rect.right > window.innerWidth
        };
      });

      console.log(`[${theme.toUpperCase()} - ${vp.name} (${vp.width}px)] Horizontal Scroll: ${hasHorizontalScroll} | Header Overflows: ${headerBox?.overflows} (Header Width: ${headerBox?.width}px)`);

      await page.screenshot({
        path: `screenshot_audit_${theme}_${vp.name}.png`,
        fullPage: false
      });

      await page.close();
    }
  }

  await browser.close();
  server.close(() => {
    console.log('Servidor finalizado.');
    process.exit(0);
  });
});
