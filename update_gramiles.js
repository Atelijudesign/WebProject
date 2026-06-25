import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx-js-style';
import { ICHA_CATALOG } from './src/data/icha_data.js';

const wb = XLSX.readFile('./ICHA_PROFILES.xls');
const sheet = wb.Sheets['Gramiles'];
const json = XLSX.utils.sheet_to_json(sheet, {header: 1});

const gramilTable = [];
for (let i = 10; i <= 27; i++) {
  const row = json[i];
  if (!row) continue;
  const h_or_b = row[0];
  const g = row[3];
  if (h_or_b && g && g !== '-') {
    gramilTable.push({ val: parseFloat(h_or_b), g: parseFloat(g) });
  }
}

function getExactGramil(val) {
  const match = gramilTable.find(item => item.val === val);
  return match ? match.g : undefined;
}

let updated = 0;

for (const series of ['IC', 'ICA']) {
  const s = ICHA_CATALOG[series];
  if (!s) continue;
  for (const p of s.profiles) {
    if (p.B_mm) {
      const g = getExactGramil(p.B_mm / 2);
      if (g) {
        p.gramil_mm = g;
        updated++;
      }
    }
  }
}

for (const series of ['TL', 'XL']) {
  const s = ICHA_CATALOG[series];
  if (!s) continue;
  for (const p of s.profiles) {
    if (p.H_mm) {
      const g = getExactGramil(p.H_mm);
      if (g) {
        p.gramil_mm = g;
        updated++;
      }
    }
  }
}

console.log(`Assigned gramil_mm to ${updated} profiles.`);

const finalStr = 'export const ICHA_CATALOG = ' + JSON.stringify(ICHA_CATALOG, null, 2) + ';\n';
fs.writeFileSync('./src/data/icha_data.js', finalStr, 'utf8');
console.log('Saved to icha_data.js');
