import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');
const distDir = path.join(projectRoot, 'dist');
const baseAstroPath = path.join(projectRoot, 'src/layouts/Base.astro');

const fluffyData = JSON.parse(fs.readFileSync(path.join(projectRoot, 'src/data/fluffy.json'), 'utf8'));

// Extract nav links from Base.astro
const baseAstroContent = fs.readFileSync(baseAstroPath, 'utf8');

const navLinks = [
  // Header Main
  { id: 1, label: 'Logo', href: '/' },
  { id: 2, label: 'Header: Precios', href: '/precios-bulldog-fluffy/' },
  { id: 3, label: 'Header: Variedades Anchor', href: '/#variedades' },
  { id: 4, label: 'Header: Destinos Trigger', href: '/destinos/' },
  
  // Header Megamenu
  { id: 5, label: 'Megamenu: Bogotá', href: '/bulldog-frances-fluffy-bogota/' },
  { id: 6, label: 'Megamenu: Medellín', href: '/bulldog-frances-fluffy-medellin/' },
  { id: 7, label: 'Megamenu: Cali', href: '/bulldog-frances-fluffy-cali/' },
  { id: 8, label: 'Megamenu: Barranquilla', href: '/bulldog-frances-fluffy-barranquilla/' },
  { id: 9, label: 'Megamenu: CDMX', href: '/bulldog-frances-fluffy-cdmx/' },
  { id: 10, label: 'Megamenu: Guadalajara', href: '/bulldog-frances-fluffy-guadalajara/' },
  { id: 11, label: 'Megamenu: Monterrey', href: '/bulldog-frances-fluffy-monterrey/' },
  { id: 12, label: 'Megamenu: Querétaro', href: '/bulldog-frances-fluffy-queretaro/' },
  { id: 13, label: 'Megamenu: Lima', href: '/bulldog-frances-fluffy-lima/' },
  { id: 14, label: 'Megamenu: Arequipa', href: '/bulldog-frances-fluffy-arequipa/' },
  { id: 15, label: 'Megamenu: Santiago', href: '/bulldog-frances-fluffy-santiago/' },
  { id: 16, label: 'Megamenu: Valparaíso', href: '/bulldog-frances-fluffy-valparaiso/' },
  { id: 17, label: 'Megamenu: Ver 100+ Ciudades', href: '/destinos/' },
  
  // Header End
  { id: 18, label: 'Header: Blog', href: '/blog/' },
  { id: 19, label: 'Header: Criadero', href: '/sobre-nosotros/' },
  { id: 20, label: 'Header: WhatsApp CTA', href: 'https://wa.me/573000000000' },
  
  // Footer Column 1: Variedades (5 dynamically loaded)
  ...fluffyData.variedades.map((v, i) => ({
    id: 21 + i,
    label: `Footer: Variedad ${v.nombreCorto}`,
    href: `/colores/${v.slug}/`
  })),
  
  // Footer Column 2: Envíos e Historias
  { id: 26, label: 'Footer: Ver 100+ Ciudades', href: '/destinos/' },
  { id: 27, label: 'Footer: Bogotá', href: '/bulldog-frances-fluffy-bogota/' },
  { id: 28, label: 'Footer: Medellín', href: '/bulldog-frances-fluffy-medellin/' },
  { id: 29, label: 'Footer: CDMX', href: '/bulldog-frances-fluffy-cdmx/' },
  { id: 30, label: 'Footer: Buenos Aires', href: '/bulldog-frances-fluffy-buenos-aires/' },
  
  // Footer Column 3: Empresa y Guías
  { id: 31, label: 'Footer: Precios y Genética 2026', href: '/precios-bulldog-fluffy/' },
  { id: 32, label: 'Footer: Blog y Cuidados Fluffy', href: '/blog/' },
  { id: 33, label: 'Footer: Garantías y Metodología', href: '/sobre-nosotros/' }
];

console.log(`Checking total navigation links: ${navLinks.length}`);

let validCount = 0;
let invalidCount = 0;

navLinks.forEach(link => {
  if (link.href.startsWith('http') || link.href.startsWith('https://wa.me')) {
    console.log(`[PASS] Link #${link.id}: ${link.label} -> ${link.href} (External/Protocol)`);
    validCount++;
    return;
  }
  
  const cleanPath = link.href.split('#')[0];
  let diskPath = path.join(distDir, cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath);
  
  let exists = false;
  if (fs.existsSync(diskPath) && fs.statSync(diskPath).isFile()) {
    exists = true;
  } else if (fs.existsSync(path.join(diskPath, 'index.html'))) {
    exists = true;
  } else if (fs.existsSync(diskPath + '.html')) {
    exists = true;
  }
  
  if (exists) {
    console.log(`[PASS] Link #${link.id}: ${link.label} -> ${link.href} (Static file confirmed on disk)`);
    validCount++;
  } else {
    console.error(`[FAIL] Link #${link.id}: ${link.label} -> ${link.href} (NOT FOUND on disk: ${diskPath})`);
    invalidCount++;
  }
});

console.log(`\nNav Link Verification Summary: ${validCount} VALID / ${invalidCount} INVALID out of ${navLinks.length} total links.`);
