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

console.log("Sample of fixed profiles:");
console.log(cajon.profiles.slice(0, 10).map(p => ({
  designation: p.designation,
  weight: p.weight,
  H_mm: p.H_mm,
  B_mm: p.B_mm,
  e_mm: p.e_mm
})));

// Generate updated icha_data.js content
let content = fs.readFileSync('./src/data/icha_data.js', 'utf-8');

// Replace the CAJON series part
// Since it's large, we can regex replace the profiles array for CAJON
// Actually, it's safer to just overwrite the file by dumping ICHA_CATALOG
// Wait, ICHA_CATALOG has functions or is it purely JSON? It's pure JSON except for the export const.

// For now, let's just log and verify before writing
