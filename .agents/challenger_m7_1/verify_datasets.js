import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');

console.log('=== DATASET INTEGRITY VERIFICATION ===\n');

let allPassed = true;

// 1. Verify src/data/fluffy.json
const fluffyPath = path.join(projectRoot, 'src/data/fluffy.json');
try {
  const raw = fs.readFileSync(fluffyPath, 'utf8');
  const json = JSON.parse(raw);
  console.log(`[PASS] src/data/fluffy.json is valid JSON.`);
  
  if (json.site && json.variedades && json.testimonios) {
    console.log(`  - Top-level keys: site, variedades (${json.variedades.length} items), testimonios (${json.testimonios.length} items)`);
    let invalidVars = 0;
    json.variedades.forEach((v, idx) => {
      if (!v.slug || !v.nombre || !v.nombreCorto || !v.variantes || !Array.isArray(v.variantes)) {
        console.error(`  - Variety #${idx} missing required fields:`, v);
        invalidVars++;
      } else {
        v.variantes.forEach(variant => {
          if (!variant.tipo || !variant.precioUSD || !variant.precioMXN) {
            console.error(`  - Variant in ${v.slug} missing pricing fields:`, variant);
            invalidVars++;
          }
        });
      }
    });
    if (invalidVars === 0) {
      console.log(`  - All ${json.variedades.length} varieties and their pricing variants are valid.`);
    } else {
      allPassed = false;
    }
  } else {
    console.error(`[FAIL] src/data/fluffy.json missing required top-level keys.`);
    allPassed = false;
  }
} catch (e) {
  console.error(`[FAIL] src/data/fluffy.json failed:`, e.message);
  allPassed = false;
}

// 2. Verify src/data/faqs.json
const faqsPath = path.join(projectRoot, 'src/data/faqs.json');
try {
  const raw = fs.readFileSync(faqsPath, 'utf8');
  const json = JSON.parse(raw);
  console.log(`\n[PASS] src/data/faqs.json is valid JSON.`);
  
  if (json.general && json.variedades) {
    console.log(`  - General FAQs: ${json.general.length} items`);
    const varKeys = Object.keys(json.variedades);
    console.log(`  - Variedades FAQ categories (${varKeys.length}): ${varKeys.join(', ')}`);
    
    let totalVarFaqs = 0;
    varKeys.forEach(k => {
      totalVarFaqs += json.variedades[k].length;
    });
    
    let emptyFaqs = 0;
    json.general.forEach(faq => {
      if (!faq.q || !faq.a) emptyFaqs++;
    });
    
    varKeys.forEach(k => {
      json.variedades[k].forEach(faq => {
        if (!faq.q || !faq.a) emptyFaqs++;
      });
    });

    if (emptyFaqs === 0) {
      console.log(`  - All ${json.general.length + totalVarFaqs} FAQ items have non-empty Q&A strings.`);
    } else {
      console.error(`  - Found ${emptyFaqs} empty FAQ items!`);
      allPassed = false;
    }
  } else {
    console.error(`[FAIL] src/data/faqs.json missing required top-level keys.`);
    allPassed = false;
  }
} catch (e) {
  console.error(`[FAIL] src/data/faqs.json failed:`, e.message);
  allPassed = false;
}

// 3. Verify dataset_fluffy_stories.csv
const csvPath = path.join(projectRoot, 'dataset_fluffy_stories.csv');
try {
  const raw = fs.readFileSync(csvPath, 'utf8');
  const lines = raw.trim().split('\n');
  console.log(`\n[PASS] dataset_fluffy_stories.csv exists.`);
  console.log(`  - Header: ${lines[0]}`);
  
  const expectedCols = ['Dominio', 'Categoría', 'URL Final (Slug)', 'H1 Título', 'Meta Descripción', 'Moneda', 'País', 'Aeropuerto', 'Historia Local'];
  const hasAllCols = expectedCols.every(col => lines[0].includes(col));
  if (hasAllCols) {
    console.log(`  - All expected columns present.`);
  } else {
    console.error(`[FAIL] CSV missing columns.`);
    allPassed = false;
  }
  
  console.log(`  - Total data rows: ${lines.length - 1}`);
  if (lines.length - 1 === 100) {
    console.log(`  - Exactly 100 city story data rows confirmed.`);
  } else {
    console.warn(`  - Row count is ${lines.length - 1} (expected 100).`);
  }
} catch (e) {
  console.error(`[FAIL] dataset_fluffy_stories.csv failed:`, e.message);
  allPassed = false;
}

console.log(`\nDataset Integrity Summary: ${allPassed ? 'ALL PASSED (100% Integrity)' : 'FAILED'}`);
