import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../../');
const distDir = path.join(projectRoot, 'dist');
const srcDir = path.join(projectRoot, 'src');

console.log(`[VERIFICATION ENGINE] Project Root: ${projectRoot}`);

// Helper to recursively find all .html files in dist
function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// 1. Inspect dist/ directory for HTML page count
const htmlFiles = getAllHtmlFiles(distDir);
console.log(`\n=== 1. DIST HTML PAGE COUNT ===`);
console.log(`Total HTML files found in dist/: ${htmlFiles.length}`);

// 2. Validate Navigation Links
// We want to extract links from Header/Navbar, Footer, or scan HTML files
console.log(`\n=== 2. NAVIGATION LINKS VALIDATION ===`);
// Let's inspect Base.astro or layout header/footer for nav links
const baseAstroPath = path.join(srcDir, 'layouts/Base.astro');
let baseAstroContent = '';
if (fs.existsSync(baseAstroPath)) {
  baseAstroContent = fs.readFileSync(baseAstroPath, 'utf8');
}

// Gather all hrefs in static HTML index.html or Base.astro
const indexHtmlPath = path.join(distDir, 'index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

// Extract all href values from index.html nav/header/footer
const hrefRegex = /href=["']([^"']+)["']/g;
const uniqueHrefs = new Set();
let match;
while ((match = hrefRegex.exec(indexHtmlContent)) !== null) {
  uniqueHrefs.add(match[1]);
}

console.log(`Total unique hrefs found on home index.html: ${uniqueHrefs.size}`);

// Verify if links exist in dist
const hrefsArray = Array.from(uniqueHrefs);
const linkVerificationResults = [];
hrefsArray.forEach(href => {
  if (href.startsWith('http') || href.startsWith('https') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('https://wa.me')) {
    linkVerificationResults.push({ href, type: 'external/protocol', valid: true });
    return;
  }
  
  // Clean fragment / query
  const cleanPath = href.split('#')[0].split('?')[0];
  if (!cleanPath || cleanPath === '/') {
    linkVerificationResults.push({ href, type: 'internal', valid: fs.existsSync(path.join(distDir, 'index.html')) });
    return;
  }
  
  let targetPath = path.join(distDir, cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath);
  let isValid = false;
  
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
    isValid = true;
  } else if (fs.existsSync(path.join(targetPath, 'index.html'))) {
    isValid = true;
  } else if (fs.existsSync(targetPath + '.html')) {
    isValid = true;
  }
  
  linkVerificationResults.push({ href, cleanPath, targetPath, valid: isValid });
});

// 3. Verify JSON-LD Schemas in static HTML
console.log(`\n=== 3. JSON-LD SCHEMAS VERIFICATION ===`);
let totalSchemasFound = 0;
let invalidSchemasFound = 0;
const schemaTypeCounts = {};

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const schemaRegex = /<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let schemaMatch;
  while ((schemaMatch = schemaRegex.exec(content)) !== null) {
    totalSchemasFound++;
    try {
      const jsonContent = JSON.parse(schemaMatch[1]);
      const type = jsonContent['@type'] || (Array.isArray(jsonContent['@graph']) ? 'Graph' : 'Unknown');
      schemaTypeCounts[type] = (schemaTypeCounts[type] || 0) + 1;
    } catch (e) {
      invalidSchemasFound++;
      console.error(`INVALID JSON-LD in ${file}:`, e.message);
    }
  }
});

console.log(`Total JSON-LD schemas found across all static HTML pages: ${totalSchemasFound}`);
console.log(`Invalid JSON-LD schemas: ${invalidSchemasFound}`);
console.log(`Schema Types breakdown:`, schemaTypeCounts);

// 4. Verify Integrity of Loaded Datasets
console.log(`\n=== 4. DATASET INTEGRITY VERIFICATION ===`);
const fluffyJsonPath = path.join(srcDir, 'data/fluffy.json');
const faqsJsonPath = path.join(srcDir, 'data/faqs.json');
const storiesCsvPath = path.join(srcDir, 'data/dataset_fluffy_stories.csv');

console.log(`fluffy.json exists: ${fs.existsSync(fluffyJsonPath)}`);
if (fs.existsSync(fluffyJsonPath)) {
  const fluffyData = JSON.parse(fs.readFileSync(fluffyJsonPath, 'utf8'));
  console.log(`  - fluffy.json keys/items count: ${Array.isArray(fluffyData) ? fluffyData.length : Object.keys(fluffyData).length}`);
}

console.log(`faqs.json exists: ${fs.existsSync(faqsJsonPath)}`);
if (fs.existsSync(faqsJsonPath)) {
  const faqsData = JSON.parse(fs.readFileSync(faqsJsonPath, 'utf8'));
  console.log(`  - faqs.json count: ${Array.isArray(faqsData) ? faqsData.length : Object.keys(faqsData).length}`);
}

console.log(`dataset_fluffy_stories.csv exists: ${fs.existsSync(storiesCsvPath)}`);
if (fs.existsSync(storiesCsvPath)) {
  const csvContent = fs.readFileSync(storiesCsvPath, 'utf8');
  const lines = csvContent.trim().split('\n');
  console.log(`  - dataset_fluffy_stories.csv row count: ${lines.length - 1} (excluding header)`);
}

// 5. Verify Pricing Figures ($2,300 to $6,800 USD) and Flight Nanny Notice ($1,000 USD)
console.log(`\n=== 5. PRICING VERIFICATION ===`);
// Check in precios page source and dist HTML
const preciosPageSrc = path.join(srcDir, 'pages/precios-bulldog-fluffy.astro');
if (fs.existsSync(preciosPageSrc)) {
  const content = fs.readFileSync(preciosPageSrc, 'utf8');
  console.log(`precios-bulldog-fluffy.astro mentions $2,300 or 2,300: ${/2[,.]?300/.test(content)}`);
  console.log(`precios-bulldog-fluffy.astro mentions $6,800 or 6,800: ${/6[,.]?800/.test(content)}`);
  console.log(`precios-bulldog-fluffy.astro mentions $1,000 or 1,000 (flight nanny): ${/1[,.]?000/.test(content)}`);
}

// 6. Verify Math Formulas
console.log(`\n=== 6. MATH FORMULAS VERIFICATION ===`);
// Check source files for CalculadoraComida, CalculadoraEdad, QuizModal
const calculadoraComidaPath = path.join(srcDir, 'components/CalculadoraComida.astro');
const calculadoraComidaReact = path.join(srcDir, 'components/CalculadoraComida.tsx');
const calculadoraEdadPath = path.join(srcDir, 'components/CalculadoraEdad.astro');
const calculadoraEdadReact = path.join(srcDir, 'components/CalculadoraEdad.tsx');
const quizModalPath = path.join(srcDir, 'components/QuizModal.astro');
const quizModalReact = path.join(srcDir, 'components/QuizModal.tsx');

// Search for formulas across all src files
function searchInSrc(regex, label) {
  console.log(`Searching for ${label}:`);
  function scan(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) scan(full);
      else {
        const text = fs.readFileSync(full, 'utf8');
        if (regex.test(text)) {
          console.log(`  FOUND in: ${path.relative(projectRoot, full)}`);
          const matches = text.match(regex);
          console.log(`  Matches:`, matches);
        }
      }
    }
  }
  scan(srcDir);
}

searchInSrc(/70\s*\*\s*Math\.pow\([^)]+0\.75\)/g, 'RER Food Math: 70 * Math.pow(weight, 0.75)');
searchInSrc(/16\s*\*\s*Math\.log\([^)]+\)\s*\+\s*31/g, 'Age Math: 16 * Math.log(humanAge) + 31');
searchInSrc(/score|puntuacion|quiz/gi, 'Quiz Scoring Logic');

