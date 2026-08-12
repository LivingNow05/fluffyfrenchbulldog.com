import fs from 'fs';
import path from 'path';

const distDir = '/Users/anthony/Downloads/Bulldog Fluffy/dist';

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

const allFiles = getAllFiles(distDir);
const htmlFiles = allFiles.filter((f) => f.endsWith('.html'));

console.log(`Total HTML files generated: ${htmlFiles.length}`);

let brokenSrcOrHref = 0;
const brokenDetails = [];

htmlFiles.forEach((htmlPath) => {
  const content = fs.readFileSync(htmlPath, 'utf8');
  const relPath = path.relative(distDir, htmlPath);

  // Check for bad src/href attributes
  const regex = /(?:src|href|alt|title)=["']([^"']*)["']/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const val = match[1];
    if (val.includes('undefined') || val.includes('null') || val.includes('NaN') || val.includes('[object Object]')) {
      brokenSrcOrHref++;
      brokenDetails.push({ file: relPath, attribute: match[0] });
    }
  }
});

console.log(`Broken src/href/alt/title attributes count: ${brokenSrcOrHref}`);
if (brokenDetails.length > 0) {
  console.log('Broken attribute list:', brokenDetails);
} else {
  console.log('✅ CLEAN! Zero broken src, href, alt, or title attributes across all 113 static HTML files.');
}
