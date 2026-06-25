import fs from 'fs';
import XLSX from 'xlsx-js-style';
import { ICHA_CATALOG } from './src/data/icha_data.js';

const wb = XLSX.readFile('./ICHA_PROFILES.xls');
const sheet = wb.Sheets['Alas Iguales'];
const json = XLSX.utils.sheet_to_json(sheet, {header: 1});

const lSeries = ICHA_CATALOG['L'].profiles;
let missingInDB = 0;
let mismatchCount = 0;
let totalChecked = 0;

console.log('Comparing "Alas Iguales" with L series in DB:');

let currentBase = '';
let currentB = 0;

for (let i = 11; i < json.length; i++) {
  const row = json[i];
  if (!row) continue;
  
  if (row[0] && row[0].toString().includes('L ')) {
    currentBase = row[0].toString().replace('*', '').trim();
    currentB = parseFloat(row[2]);
  }
  
  if (!currentBase) continue;
  
  const weight = parseFloat(row[1]);
  if (isNaN(weight)) continue;
  
  const designation = currentBase + 'x' + weight;
  const e = parseFloat(row[3]);
  const A = parseFloat(row[4]);
  const iv_cm = parseFloat(row[10]);

  const dbProfile = lSeries.find(p => p.designation === designation || p.designation === designation.replace(',', '.'));
  
  if (!dbProfile) {
    console.log(`[MISSING IN DB] ${designation}`);
    missingInDB++;
    continue;
  }
  
  totalChecked++;
  const mismatches = [];
  
  if (Math.abs(dbProfile.weight - weight) > 0.01) mismatches.push(`Weight: DB=${dbProfile.weight}, XL=${weight}`);
  if (Math.abs(dbProfile.e_mm - e) > 0.01) mismatches.push(`e_mm: DB=${dbProfile.e_mm}, XL=${e}`);
  if (Math.abs(dbProfile['A_cm²'] - A) > 0.01) mismatches.push(`A_cm²: DB=${dbProfile['A_cm²']}, XL=${A}`);
  
  if (mismatches.length > 0) {
    console.log(`[MISMATCH] ${dbProfile.designation} -> ` + mismatches.join(' | '));
    mismatchCount++;
  }
}

console.log(`\nComparison complete.`);
console.log(`Checked: ${totalChecked}`);
console.log(`Missing in DB: ${missingInDB}`);
console.log(`Mismatches: ${mismatchCount}`);
