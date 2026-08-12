import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../../dist');

function getAllHtmlFiles(dir, list = []) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) getAllHtmlFiles(full, list);
    else if (f.endsWith('.html')) list.push(full);
  }
  return list;
}

const htmlFiles = getAllHtmlFiles(distDir);
let totalSchemas = 0;
let validSchemas = 0;
let invalidSchemas = 0;
const typeCounts = {};

const pageSchemasMap = new Map();

htmlFiles.forEach(filePath => {
  const relPath = path.relative(distDir, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let match;
  let pageCount = 0;

  while ((match = regex.exec(content)) !== null) {
    totalSchemas++;
    try {
      const parsed = JSON.parse(match[1]);
      validSchemas++;
      pageCount++;
      const type = parsed['@type'] || (parsed['@graph'] ? 'Graph' : 'Unknown');
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    } catch (err) {
      invalidSchemas++;
      console.error(`ERROR parsing schema in ${relPath}: ${err.message}`);
    }
  }
  pageSchemasMap.set(relPath, pageCount);
});

console.log(`=== JSON-LD AUDIT REPORT ===`);
console.log(`Total HTML files scanned: ${htmlFiles.length}`);
console.log(`Total JSON-LD schemas found: ${totalSchemas}`);
console.log(`Valid JSON-LD schemas: ${validSchemas}`);
console.log(`Invalid JSON-LD schemas: ${invalidSchemas}`);
console.log(`\nSchema Type Distribution:`);
for (const [type, count] of Object.entries(typeCounts)) {
  console.log(`  - ${type}: ${count}`);
}

const isExactTarget = totalSchemas === 646 && invalidSchemas === 0;
console.log(`\nVerdict on JSON-LD requirement (646 valid schemas): ${isExactTarget ? 'PASSED (100% Match)' : 'FAILED'}`);
