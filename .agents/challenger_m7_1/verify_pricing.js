import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');
const distDir = path.join(projectRoot, 'dist');
const srcDir = path.join(projectRoot, 'src');

console.log('=== PRICING & FLIGHT NANNY VERIFICATION ===\n');

// 1. Check fluffy.json pricing data
const fluffyPath = path.join(srcDir, 'data/fluffy.json');
const fluffyData = JSON.parse(fs.readFileSync(fluffyPath, 'utf8'));

let minUSD = Infinity;
let maxUSD = -Infinity;

fluffyData.variedades.forEach(v => {
  v.variantes.forEach(variant => {
    if (variant.precioUSD < minUSD) minUSD = variant.precioUSD;
    if (variant.precioUSD > maxUSD) maxUSD = variant.precioUSD;
  });
});

console.log(`fluffy.json minimum price USD: $${minUSD.toLocaleString()} USD`);
console.log(`fluffy.json maximum price USD: $${maxUSD.toLocaleString()} USD`);

const pricesMatchDataset = minUSD === 2300 && maxUSD === 6800;
console.log(`Dataset pricing range ($2,300 to $6,800 USD): ${pricesMatchDataset ? 'VERIFIED (PASS)' : 'FAILED'}`);

// 2. Check source files for pricing and $1,000 flight nanny notice
console.log('\n--- Source Code Pricing & Flight Nanny Search ---');
let flightNannyFoundInSrc = false;
let rangeFoundInSrc = false;

function scanSrc(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) scanSrc(full);
    else if (f.endsWith('.astro') || f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.js')) {
      const text = fs.readFileSync(full, 'utf8');
      if (text.includes('2,300') || text.includes('2300') || text.includes('6,800') || text.includes('6800')) {
        console.log(`  Found price range reference in src file: ${path.relative(projectRoot, full)}`);
        rangeFoundInSrc = true;
      }
      if (text.includes('1,000') || text.includes('1000') || text.toLowerCase().includes('flight nanny') || text.toLowerCase().includes('nanny') || text.toLowerCase().includes('pet nanny')) {
        if (/1[,.]?000/.test(text) || /nanny/i.test(text)) {
          console.log(`  Found nanny/flight reference in src file: ${path.relative(projectRoot, full)}`);
          flightNannyFoundInSrc = true;
        }
      }
    }
  }
}
scanSrc(srcDir);

// 3. Search dist/ static HTML pages for $2,300, $6,800, and $1,000 flight nanny
console.log('\n--- Static HTML Output Search ---');
let dist2300Count = 0;
let dist6800Count = 0;
let dist1000NannyCount = 0;

function getAllHtmlFiles(dir, list = []) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) getAllHtmlFiles(full, list);
    else if (f.endsWith('.html')) list.push(full);
  }
  return list;
}

const htmlFiles = getAllHtmlFiles(distDir);
htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('2,300') || content.includes('2.300') || content.includes('2300')) dist2300Count++;
  if (content.includes('6,800') || content.includes('6.800') || content.includes('6800')) dist6800Count++;
  if ((content.includes('1,000') || content.includes('1.000') || content.includes('1000')) && (content.toLowerCase().includes('nanny') || content.toLowerCase().includes('envío') || content.toLowerCase().includes('envio') || content.toLowerCase().includes('vuelo'))) dist1000NannyCount++;
});

console.log(`Pages mentioning $2,300 USD: ${dist2300Count}`);
console.log(`Pages mentioning $6,800 USD: ${dist6800Count}`);
console.log(`Pages mentioning $1,000 USD flight nanny/shipping: ${dist1000NannyCount}`);

// Inspect ShippingAccordion or Shipping component specifically
const shippingCompPath = path.join(srcDir, 'components/ShippingAccordion.astro');
if (fs.existsSync(shippingCompPath)) {
  console.log(`\nContents of ShippingAccordion.astro:`);
  console.log(fs.readFileSync(shippingCompPath, 'utf8'));
}
