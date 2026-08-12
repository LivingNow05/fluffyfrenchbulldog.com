import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../../dist');

function getHtmls(dir, list = []) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) getHtmls(full, list);
    else if (f.endsWith('.html')) list.push(path.relative(distDir, full));
  }
  return list;
}

const htmls = getHtmls(distDir);
console.log('Total HTML pages in dist:', htmls.length);

const categories = {
  home: htmls.filter(p => p === 'index.html'),
  destinosIndex: htmls.filter(p => p === 'destinos/index.html' || p === 'destinos.html'),
  precios: htmls.filter(p => p.includes('precios')),
  sobreNosotros: htmls.filter(p => p.includes('sobre-nosotros')),
  blogIndex: htmls.filter(p => p === 'blog/index.html'),
  blogPosts: htmls.filter(p => p.startsWith('blog/') && p !== 'blog/index.html'),
  colores: htmls.filter(p => p.startsWith('colores/')),
  cityPages: htmls.filter(p => p.startsWith('bulldog-frances-fluffy-'))
};

console.log('\nCategory Breakdown:');
for (const [cat, items] of Object.entries(categories)) {
  console.log(`  - ${cat}: ${items.length}`);
}

const totalCategorized = Object.values(categories).reduce((acc, arr) => acc + arr.length, 0);
console.log('Total categorized:', totalCategorized);
