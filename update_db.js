import fs from 'fs';
import { ICHA_CATALOG } from './src/data/icha_data.js';

let currentH = 0;
let currentB = 0;

const cajon = ICHA_CATALOG["CAJON"];
cajon.profiles.forEach(p => {
  const base = p.base;
  
  if (base.includes('Cuad.')) {
    // e.g. "Cuad.25*25"
    const match = base.match(/Cuad\.(\d+)\*(\d+)/);
    if (match) {
      currentH = parseInt(match[1]) * 10;
      currentB = parseInt(match[2]) * 10;
    }
  } else if (base && base.trim() !== '') {
    // e.g. "20"
    const val = parseInt(base);
    if (!isNaN(val)) {
      currentB = val * 10;
    }
  }
  
  p.H_mm = currentH;
  p.B_mm = currentB;
  p.designation = `CAJON ${p.H_mm}x${p.B_mm}x${p.e_mm}`;
});

const newContent = `export const ICHA_CATALOG = ${JSON.stringify(ICHA_CATALOG, null, 2)};\n`;
fs.writeFileSync('./src/data/icha_data.js', newContent);
console.log("DB updated successfully!");
