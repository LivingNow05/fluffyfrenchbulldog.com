import fs from 'node:fs';
import path from 'node:path';

function checkPage(filePath, pageName) {
  console.log(`\n=== Checking ${pageName} (${filePath}) ===`);
  if (!fs.existsSync(filePath)) {
    console.error(`ERROR: ${filePath} does not exist!`);
    return null;
  }
  const html = fs.readFileSync(filePath, 'utf-8');

  // Check hydration & astro-island
  const islandMatches = html.match(/<astro-island/g) || [];
  console.log(`Found ${islandMatches.length} <astro-island> tags.`);

  // Check hydration client script tags
  const clientScriptMatches = html.match(/astro:scripts/g) || html.match(/<script/g) || [];
  console.log(`Found ${clientScriptMatches.length} <script> tags.`);

  // Check JSON-LD scripts
  const ldJsonRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let match;
  let jsonCount = 0;
  const parsedSchemas = [];
  while ((match = ldJsonRegex.exec(html)) !== null) {
    jsonCount++;
    try {
      const parsed = JSON.parse(match[1]);
      parsedSchemas.push(parsed);
      const schemaType = Array.isArray(parsed)
        ? parsed.map(s => s['@type']).join(', ')
        : parsed['@type'];
      console.log(`  JSON-LD #${jsonCount} valid JSON! @type: ${schemaType}`);
    } catch (err) {
      console.error(`  JSON-LD #${jsonCount} INVALID JSON: ${err.message}`);
    }
  }
  console.log(`Total JSON-LD schemas parsed: ${jsonCount}`);
  return { html, islandCount: islandMatches.length, schemas: parsedSchemas };
}

console.log('--- INDIVIDUAL PAGE CHECKS ---');
const blueResult = checkPage('dist/colores/fluffy-blue/index.html', 'Colores: Fluffy Blue');
const bogotaResult = checkPage('dist/bulldog-frances-fluffy-bogota/index.html', 'Ciudad: Bogotá');

console.log('\n--- SYSTEM-WIDE ALL COLOR PAGES CHECK ---');
const colorSlugs = ['fluffy-blue', 'fluffy-visual-isabella', 'fluffy-lilac', 'fluffy-fluffy-cocoa', 'fluffy-merle'];
let colorSuccess = 0;
for (const slug of colorSlugs) {
  const p = path.join('dist', 'colores', slug, 'index.html');
  if (fs.existsSync(p)) {
    colorSuccess++;
  } else {
    console.error(`Missing color page: ${p}`);
  }
}
console.log(`Color pages present: ${colorSuccess} / ${colorSlugs.length}`);

console.log('\n--- SYSTEM-WIDE ALL CITY PAGES CHECK ---');
const distDirs = fs.readdirSync('dist');
const cityDirs = distDirs.filter(d => d.startsWith('bulldog-frances-fluffy-') && fs.statSync(path.join('dist', d)).isDirectory());
let citySuccess = 0;
let validSchemasTotal = 0;
let invalidSchemasTotal = 0;

for (const dir of cityDirs) {
  const p = path.join('dist', dir, 'index.html');
  if (fs.existsSync(p)) {
    citySuccess++;
    const html = fs.readFileSync(p, 'utf-8');
    const ldJsonRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = ldJsonRegex.exec(html)) !== null) {
      try {
        JSON.parse(match[1]);
        validSchemasTotal++;
      } catch (err) {
        invalidSchemasTotal++;
        console.error(`Invalid JSON-LD in ${p}: ${err.message}`);
      }
    }
  }
}
console.log(`City pages present: ${citySuccess} / ${cityDirs.length}`);
console.log(`Total valid JSON-LD schemas across city pages: ${validSchemasTotal}`);
console.log(`Total invalid JSON-LD schemas across city pages: ${invalidSchemasTotal}`);
