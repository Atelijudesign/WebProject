import { useState, useEffect, useMemo, useRef } from "react";
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// ==================== SVG BUILDERS ====================
const SZ = 240, CX = SZ / 2, CY = SZ / 2, PAD = 45;

function dimLine(x1, y1, x2, y2, label, offset = 0, color = "#60a5fa") {
  const isV = Math.abs(x1 - x2) < 2;
  const ox = isV ? offset : 0, oy = isV ? 0 : offset;
  const mx = (x1 + x2) / 2 + ox, my = (y1 + y2) / 2 + oy;
  const tox = isV ? (offset > 0 ? 8 : -8) : 0;
  const toy = isV ? 0 : offset > 0 ? 12 : -6;
  const tx = Math.max(24, Math.min(SZ - 24, mx + tox));
  const ty = Math.max(10, Math.min(SZ - 4, my + toy));
  return `<line x1="${x1 + ox}" y1="${y1 + oy}" x2="${x2 + ox}" y2="${y2 + oy}" stroke="${color}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.7"/>
          <text x="${tx}" y="${ty}" fill="${color}" font-size="10" font-family="Inter" font-weight="600" text-anchor="middle">${label}</text>`;
}

function buildHSvg(h, b, s, t1, t2, unequal = false, b1, b2) {
  const bTop = unequal ? b1 : b, bBot = unequal ? b2 : b;
  const maxB = Math.max(bTop, bBot);
  const sc = Math.min((SZ - 2 * PAD) / h, (SZ - 2 * PAD) / maxB);
  const H = h * sc, B1 = bTop * sc, B2 = bBot * sc, S = Math.max(s * sc, 4), T1 = Math.max(t1 * sc, 4), T2 = Math.max(t2 * sc, 4);
  const x = CX, y = CY;
  const shape = `<polygon points="${x - B1 / 2},${y - H / 2} ${x + B1 / 2},${y - H / 2} ${x + B1 / 2},${y - H / 2 + T1} ${x + S / 2},${y - H / 2 + T1} ${x + S / 2},${y + H / 2 - T2} ${x + B2 / 2},${y + H / 2 - T2} ${x + B2 / 2},${y + H / 2} ${x - B2 / 2},${y + H / 2} ${x - B2 / 2},${y + H / 2 - T2} ${x - S / 2},${y + H / 2 - T2} ${x - S / 2},${y - H / 2 + T1} ${x - B1 / 2},${y - H / 2 + T1}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;
  let dims = dimLine(x - B1 / 2, y - H / 2, x - B1 / 2, y + H / 2, `h=${h}`, -22);
  dims += dimLine(x - B1 / 2, y + H / 2, x + B2 / 2, y + H / 2, unequal ? `b°=${b2}` : `b=${b}`, 18);
  dims += `<text x="${x + S / 2 + 6}" y="${y + 4}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">s=${s}</text>`;
  if (unequal) {
    dims += dimLine(x - B1 / 2, y - H / 2, x + B1 / 2, y - H / 2, `b°=${b1}`, `b1=${b1}`, -14);
    dims += `<text x="${x + B1 / 2 + 6}" y="${y - H / 2 + T1 / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">t1=${t1}</text>`;
    dims += `<text x="${x + B2 / 2 + 6}" y="${y + H / 2 - T2 / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">t2=${t2}</text>`;
  } else {
    dims += `<text x="${x + B1 / 2 + 6}" y="${y - H / 2 + T1 / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">t1=${t1}</text>`;
  }
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}</svg>`;
}

function buildTSvg(v) {
  const sc = Math.min((SZ - 2 * PAD) / v.h, (SZ - 2 * PAD) / v.b);
  const H = v.h * sc, B = v.b * sc, T = Math.max(v.t * sc, 4), S = Math.max(v.s * sc, 4);
  const x = CX, top = CY - H / 2;
  const shape = `<polygon points="${x - B / 2},${top} ${x + B / 2},${top} ${x + B / 2},${top + T} ${x + S / 2},${top + T} ${x + S / 2},${top + H} ${x - S / 2},${top + H} ${x - S / 2},${top + T} ${x - B / 2},${top + T}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;
  let dims = dimLine(x - B / 2, top, x - B / 2, top + H, `h=${v.h}`, -22);
  dims += dimLine(x - B / 2, top, x + B / 2, top, `b=${v.b}`, -14);
  dims += `<text x="${x + B / 2 + 6}" y="${top + T / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">t=${v.t}</text>`;
  dims += `<text x="${x + S / 2 + 6}" y="${top + T + 20}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">s=${v.s}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}</svg>`;
}

function buildCASvg(v, isProf = false) {
  const sc = Math.min((SZ - 2 * PAD) / v.h, (SZ - 2 * PAD) / (v.b * 2 || 100));
  const H = v.h * sc, B = Math.max((v.b || 50) * sc, 8), T = Math.max(v.t * sc, 3), C = v.c ? Math.max(v.c * sc, 6) : 0;
  const left = CX - B / 2, top = CY - H / 2;
  let pts;
  if (C > 0) {
    pts = `${left},${top} ${left + B},${top} ${left + B},${top + C} ${left + B - T},${top + C} ${left + B - T},${top + T} ${left + T},${top + T} ${left + T},${top + H - T} ${left + B - T},${top + H - T} ${left + B - T},${top + H - C} ${left + B},${top + H - C} ${left + B},${top + H} ${left},${top + H}`;
  } else {
    pts = `${left},${top} ${left + B},${top} ${left + B},${top + T} ${left + T},${top + T} ${left + T},${top + H - T} ${left + B},${top + H - T} ${left + B},${top + H} ${left},${top + H}`;
  }
  const shape = `<polygon points="${pts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;
  let dims = dimLine(left + B + 4, top, left + B + 4, top + H, `h=${v.h}`, 16);
  dims += dimLine(left, top + H, left + B, top + H, `b=${v.b || 50}`, 16);
  dims += `<text x="${left + B + 6}" y="${top + T / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">t=${v.t}</text>`;
  if (C > 0) dims += `<text x="${left + B + 6}" y="${top + H - C / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">c=${v.c}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}</svg>`;
}

function buildCSvg(v, unequal = false) {
  const bVal = unequal ? Math.max(v.b1 || 75, v.b2 || 75) : v.b;
  const sc = Math.min((SZ - 2 * PAD) / v.h, (SZ - 2 * PAD) / (bVal * 2));
  const H = v.h * sc, B = bVal * sc, T = Math.max(v.t * sc, 3);
  const x = CX, top = CY - H / 2;
  const pts = `${x - B},${top} ${x},${top} ${x},${top + T} ${x - B + T},${top + T} ${x - B + T},${top + H - T} ${x},${top + H - T} ${x},${top + H} ${x - B},${top + H}`;
  const shape = `<polygon points="${pts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;
  let dims = dimLine(x + 4, top, x + 4, top + H, `h=${v.h}`, 14);
  if (unequal) {
    dims += dimLine(x - B, top, x, top, `b1=${v.b1}`, -14);
    dims += dimLine(x - B, top + H, x, top + H, `b2=${v.b2}`, 16);
  } else {
    dims += dimLine(x - B, top + H, x, top + H, `b=${v.b}`, 16);
  }
  dims += `<text x="${x + 6}" y="${top + T + 12}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">t=${v.t}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}</svg>`;
}

function buildLSvg(v) {
  const maxD = Math.max(v.h, v.b);
  const sc = (SZ - 2 * PAD) / maxD;
  const H = v.h * sc, B = v.b * sc, T = Math.max(v.t * sc, 3);
  const x = CX - B / 2, top = CY - H / 2;
  const pts = `${x},${top} ${x + T},${top} ${x + T},${top + H - T} ${x + B},${top + H - T} ${x + B},${top + H} ${x},${top + H}`;
  const shape = `<polygon points="${pts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;
  let dims = dimLine(x, top, x, top + H, `h=${v.h}`, -20);
  dims += dimLine(x, top + H, x + B, top + H, `b=${v.b}`, 16);
  dims += `<text x="${x + T + 6}" y="${top + 20}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">t=${v.t}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}</svg>`;
}

function buildXLSvg(v) {
  const maxD = Math.max(v.h, v.b);
  const sc = ((SZ - 2 * PAD) / maxD) * 0.7;
  const H = v.h * sc, B = v.b * sc, T = Math.max(v.t * sc, 3);
  const gap = 6;
  const ax = CX - gap / 2, ay = CY - gap / 2;
  const aPts = `${ax},${ay} ${ax},${ay - H} ${ax - T},${ay - H} ${ax - T},${ay - T} ${ax - B},${ay - T} ${ax - B},${ay}`;
  const bx = CX + gap / 2, by = CY + gap / 2;
  const bPts = `${bx},${by} ${bx},${by + H} ${bx + T},${by + H} ${bx + T},${by + T} ${bx + B},${by + T} ${bx + B},${by}`;
  const shape = `<polygon points="${aPts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2" stroke-linejoin="round"/>
                  <polygon points="${bPts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2" stroke-linejoin="round"/>`;
  let dims = dimLine(ax - T, ay - H, ax - T, ay, `h=${v.h}`, -18);
  dims += dimLine(ax - B, ay, ax, ay, `b=${v.b}`, 16);
  dims += `<text x="${ax + 8}" y="${ay - H + 14}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">t=${v.t}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}</svg>`;
}

function buildPlateSvg(v) {
  const sc = Math.min((SZ - 2 * PAD) / v.h, (SZ - 2 * PAD) / v.b);
  const H = v.h * sc, B = v.b * sc;
  const x = CX - B / 2, y = CY - H / 2;
  const shape = `<rect x="${x}" y="${y}" width="${B}" height="${H}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2" rx="2"/>`;
  let dims = dimLine(x, y, x, y + H, `h=${v.h}`, -22);
  dims += dimLine(x, y + H, x + B, y + H, `b=${v.b}`, 16);
  dims += `<text x="${CX}" y="${CY + 4}" fill="#60a5fa" font-size="10" font-family="Inter" font-weight="600" text-anchor="middle">t=${v.t}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}</svg>`;
}

function buildPipeSvg(v) {
  const sc = (SZ - 2 * PAD) / v.dia;
  const R = (v.dia * sc) / 2, r = ((v.dia - 2 * v.thick) * sc) / 2;
  const shape = `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#3b82f6" stroke-width="2"/>
                  <circle cx="${CX}" cy="${CY}" r="${r}" fill="rgba(11,18,32,0.9)" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,2"/>
                  <path d="M${CX - R},${CY} A${R},${R} 0 0,1 ${CX + R},${CY}" fill="rgba(59,130,246,0.12)"/>
                  <path d="M${CX - r},${CY} A${r},${r} 0 0,1 ${CX + r},${CY}" fill="rgba(11,18,32,0.9)"/>`;
  let dims = dimLine(CX, CY, CX + R, CY, `Ø=${v.dia}`, -14);
  dims += `<text x="${CX}" y="${CY + R + 16}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600" text-anchor="middle">e=${v.thick}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}</svg>`;
}

function buildTubeSvg(v) {
  const sc = Math.min((SZ - 2 * PAD) / v.h, (SZ - 2 * PAD) / v.b);
  const H = v.h * sc, B = v.b * sc, T = Math.max(v.t * sc, 3);
  const x = CX - B / 2, y = CY - H / 2;
  const outer = `<rect x="${x}" y="${y}" width="${B}" height="${H}" fill="none" stroke="#3b82f6" stroke-width="2" rx="3"/>`;
  const inner = `<rect x="${x + T}" y="${y + T}" width="${B - 2 * T}" height="${H - 2 * T}" fill="rgba(11,18,32,0.9)" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,2" rx="1"/>`;
  const fill = `<rect x="${x}" y="${y}" width="${B}" height="${H}" fill="rgba(59,130,246,0.12)" rx="3"/>`;
  const innerClear = `<rect x="${x + T}" y="${y + T}" width="${B - 2 * T}" height="${H - 2 * T}" fill="rgba(11,18,32,0.85)" rx="1"/>`;
  let dims = dimLine(x, y, x, y + H, `h=${v.h}`, -22);
  dims += dimLine(x, y + H, x + B, y + H, `b=${v.b}`, 16);
  dims += `<text x="${CX}" y="${CY + 4}" fill="#60a5fa" font-size="10" font-family="Inter" font-weight="600" text-anchor="middle">t=${v.t}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${fill}${innerClear}${outer}${inner}${dims}</svg>`;
}

function buildRBSvg(v) {
  const sc = (SZ - 2 * PAD) / v.dia;
  const R = (v.dia * sc) / 2;
  const shape = `<circle cx="${CX}" cy="${CY}" r="${R}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>
                  <line x1="${CX}" y1="${CY}" x2="${CX + R}" y2="${CY}" stroke="#60a5fa" stroke-width="1" stroke-dasharray="3,2"/>`;
  let dims = `<text x="${CX + R / 2}" y="${CY - 8}" fill="#60a5fa" font-size="11" font-family="Inter" font-weight="700" text-anchor="middle">Ø=${v.dia}</text>`;
  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}</svg>`;
}

// ==================== PROFILE DEFINITIONS ====================
const PROFILES = {
  H: {
    name: "H Profile", label: "H", icon: "fa-solid fa-h",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 200 },
      { id: "b", label: "b (ancho)", unit: "mm", default: 100 },
      { id: "s", label: "s (alma)", unit: "mm", default: 6 },
      { id: "t", label: "t (ala)", unit: "mm", default: 12 },
    ],
    calc(v) {
      const area = (v.b * v.t + v.b * v.t + (v.h - v.t - v.t) * v.s) / 100;
      const weight = area * 0.00785 * 100;
      const cover = (2 * v.b - v.s + (2 * v.b - v.s) + 2 * v.h) / 1000;
      const desig = `H ${(v.h * 0.1).toFixed(0)} × ${weight.toFixed(2)}`;
      const hw = v.h - 2 * v.t;
      const Ix = (v.b * Math.pow(v.h, 3) - (v.b - v.s) * Math.pow(hw, 3)) / 12 / 10000;
      const Iy = (2 * v.t * Math.pow(v.b, 3) + hw * Math.pow(v.s, 3)) / 12 / 10000;
      const Wx = Ix / (v.h / 2 / 10);
      const Wy = Iy / (v.b / 2 / 10);
      return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
    },
    svg(v) { return buildHSvg(v.h, v.b, v.s, v.t, v.t, false); },
  },
  HE: {
    name: "HE Profile", label: "HE", icon: "fa-solid fa-h", subtitle: "Alas Desiguales",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 250 },
      { id: "b1", label: "b1 (ala sup.)", unit: "mm", default: 200 },
      { id: "b2", label: "b2 (ala inf.)", unit: "mm", default: 200 },
      { id: "t1", label: "t1 (ala sup.)", unit: "mm", default: 14 },
      { id: "t2", label: "t2 (ala inf.)", unit: "mm", default: 14 },
      { id: "s", label: "s (alma)", unit: "mm", default: 6 },
    ],
    calc(v) {
      const area = (v.b1 * v.t1 + v.b2 * v.t2 + (v.h - v.t1 - v.t2) * v.s) / 100;
      const weight = area * 0.00785 * 100;
      const cover = (2 * v.b1 - v.s + (2 * v.b2 - v.s) + 2 * v.h) / 1000;
      const desig = `HE ${(v.h * 0.1).toFixed(0)} × ${weight.toFixed(2)}`;
      const hw = v.h - v.t1 - v.t2;
      const A = v.b1 * v.t1 + v.b2 * v.t2 + hw * v.s;
      const ybar = (v.b1 * v.t1 * (v.h - v.t1 / 2) + hw * v.s * (v.t2 + hw / 2) + v.b2 * v.t2 * (v.t2 / 2)) / A;
      const Ix = ((v.b1 * Math.pow(v.t1, 3)) / 12 + v.b1 * v.t1 * Math.pow(v.h - v.t1 / 2 - ybar, 2) + (v.s * Math.pow(hw, 3)) / 12 + v.s * hw * Math.pow(v.t2 + hw / 2 - ybar, 2) + (v.b2 * Math.pow(v.t2, 3)) / 12 + v.b2 * v.t2 * Math.pow(v.t2 / 2 - ybar, 2)) / 10000;
      const bmax = Math.max(v.b1, v.b2);
      const Iy = (v.t1 * Math.pow(v.b1, 3) + hw * Math.pow(v.s, 3) + v.t2 * Math.pow(v.b2, 3)) / 12 / 10000;
      const Wx = Ix / (Math.max(ybar, v.h - ybar) / 10);
      const Wy = Iy / (bmax / 2 / 10);
      return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
    },
    svg(v) { return buildHSvg(v.h, Math.max(v.b1, v.b2), v.s, v.t1, v.t2, true, v.b1, v.b2); },
  },
  T: {
    name: "T Profile", label: "T", icon: "fa-solid fa-t",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 175 },
      { id: "b", label: "b (ancho ala)", unit: "mm", default: 250 },
      { id: "t", label: "t (ala)", unit: "mm", default: 18 },
      { id: "s", label: "s (alma)", unit: "mm", default: 12 },
    ],
    calc(v) {
      const area = (v.b * v.t + (v.h - v.t) * v.s) / 100;
      const weight = area * 0.00785 * 100;
      const cover = (2 * v.h + 2 * v.b) / 1000;
      const desig = `T ${(v.h * 0.1).toFixed(1)} × ${weight.toFixed(2)}`;
      const A = v.b * v.t + (v.h - v.t) * v.s;
      const ybar = (v.b * v.t * (v.h - v.t / 2) + (v.h - v.t) * v.s * ((v.h - v.t) / 2)) / A;
      const Ix = ((v.b * Math.pow(v.t, 3)) / 12 + v.b * v.t * Math.pow(v.h - v.t / 2 - ybar, 2) + (v.s * Math.pow(v.h - v.t, 3)) / 12 + v.s * (v.h - v.t) * Math.pow((v.h - v.t) / 2 - ybar, 2)) / 10000;
      const Iy = (v.t * Math.pow(v.b, 3) + (v.h - v.t) * Math.pow(v.s, 3)) / 12 / 10000;
      const Wx = Ix / (Math.max(ybar, v.h - ybar) / 10);
      const Wy = Iy / (v.b / 2 / 10);
      return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
    },
    svg(v) { return buildTSvg(v); },
  },
  CA: {
    name: "CA Profile", label: "CA", icon: "fa-solid fa-c", subtitle: "Canal Atiesado",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 280 },
      { id: "b", label: "b (ancho ala)", unit: "mm", default: 100 },
      { id: "c", label: "c (labio)", unit: "mm", default: 35 },
      { id: "t", label: "t (espesor)", unit: "mm", default: 5 },
    ],
    calc(v) {
      const area = ((v.h + 2 * v.b + 2 * v.c - 6.5752 * v.t) * v.t) / 100;
      const weight = area * 0.00785 * 100;
      const cover = (2 * v.h + 4 * v.b + 4 * v.c - 4 * v.t) / 1000;
      const desig = `CA ${(v.h * 0.1).toFixed(0)} × ${weight.toFixed(2)}`;
      const hw = v.h - 2 * v.t;
      const Ix = ((2 * v.b * Math.pow(v.t, 3)) / 12 + 2 * v.b * v.t * Math.pow(v.h / 2 - v.t / 2, 2) + (v.t * Math.pow(hw, 3)) / 12 + (2 * v.c * Math.pow(v.t, 3)) / 12) / 10000;
      const A_t = (v.h + 2 * v.b + 2 * v.c - 6.5752 * v.t) * v.t;
      const ybar_y = (2 * ((v.b * v.t * v.b) / 2) + (hw * v.t * v.t) / 2 + 2 * v.c * v.t * (v.b - v.t / 2)) / A_t;
      const Iy = ((2 * v.t * Math.pow(v.b, 3)) / 12 + 2 * v.b * v.t * Math.pow(v.b / 2 - ybar_y, 2) + (hw * Math.pow(v.t, 3)) / 12 + hw * v.t * Math.pow(v.t / 2 - ybar_y, 2) + (2 * v.t * Math.pow(v.c, 3)) / 12) / 10000;
      const Wx = Ix / (v.h / 2 / 10);
      const Wy = Iy / (Math.max(ybar_y, v.b + v.c - ybar_y) / 10);
      return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
    },
    svg(v) { return buildCASvg(v); },
  },
  C: {
    name: "C Profile", label: "C", icon: "fa-solid fa-c",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 250 },
      { id: "b", label: "b (ancho ala)", unit: "mm", default: 50 },
      { id: "t", label: "t (espesor)", unit: "mm", default: 6 },
    ],
    calc(v) {
      const area = ((v.h + 2 * v.b - 3.2876 * v.t) * v.t) / 100;
      const weight = area * 0.00785 * 100;
      const cover = (2 * v.h + 4 * v.b - 2 * v.t) / 1000;
      const desig = `C ${(v.h * 0.1).toFixed(0)} × ${weight.toFixed(2)}`;
      const hw = v.h - 2 * v.t;
      const Ix = ((2 * v.b * Math.pow(v.t, 3)) / 12 + 2 * v.b * v.t * Math.pow(v.h / 2 - v.t / 2, 2) + (v.t * Math.pow(hw, 3)) / 12) / 10000;
      const A_c = (v.h + 2 * v.b - 3.2876 * v.t) * v.t;
      const ybar = (2 * v.b * v.t * (v.b / 2) + hw * v.t * (v.t / 2)) / A_c;
      const Iy = ((2 * v.t * Math.pow(v.b, 3)) / 12 + 2 * v.b * v.t * Math.pow(v.b / 2 - ybar, 2) + (hw * Math.pow(v.t, 3)) / 12 + hw * v.t * Math.pow(v.t / 2 - ybar, 2)) / 10000;
      const Wx = Ix / (v.h / 2 / 10);
      const Wy = Iy / (Math.max(ybar, v.b - ybar) / 10);
      return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
    },
    svg(v) { return buildCSvg(v); },
  },
  CE: {
    name: "CE Profile", label: "CE", icon: "fa-solid fa-c", subtitle: "Alas Desiguales",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 200 },
      { id: "b1", label: "b1 (ala sup.)", unit: "mm", default: 75 },
      { id: "b2", label: "b2 (ala inf.)", unit: "mm", default: 75 },
      { id: "t", label: "t (espesor)", unit: "mm", default: 6 },
    ],
    calc(v) {
      const area = ((v.b1 + v.b2 + v.h - 3.2876 * v.t) * v.t) / 100;
      const weight = area * 0.00785 * 100;
      const cover = (2 * v.h + 2 * v.b1 + 2 * v.b2 - 2 * v.t) / 1000;
      const desig = `CE ${(v.h * 0.1).toFixed(0)} × ${weight.toFixed(2)}`;
      const hw = v.h - 2 * v.t;
      const Ix = ((v.b1 * Math.pow(v.t, 3)) / 12 + v.b1 * v.t * Math.pow(v.h / 2 - v.t / 2, 2) + (v.b2 * Math.pow(v.t, 3)) / 12 + v.b2 * v.t * Math.pow(v.h / 2 - v.t / 2, 2) + (v.t * Math.pow(hw, 3)) / 12) / 10000;
      const A_c = (v.b1 + v.b2 + v.h - 3.2876 * v.t) * v.t;
      const ybar = (v.b1 * v.t * (v.b1 / 2) + v.b2 * v.t * (v.b2 / 2) + hw * v.t * (v.t / 2)) / A_c;
      const bmax = Math.max(v.b1, v.b2);
      const Iy = ((v.t * Math.pow(v.b1, 3)) / 12 + v.b1 * v.t * Math.pow(v.b1 / 2 - ybar, 2) + (v.t * Math.pow(v.b2, 3)) / 12 + v.b2 * v.t * Math.pow(v.b2 / 2 - ybar, 2) + (hw * Math.pow(v.t, 3)) / 12 + hw * v.t * Math.pow(v.t / 2 - ybar, 2)) / 10000;
      const Wx = Ix / (v.h / 2 / 10);
      const Wy = Iy / (Math.max(ybar, bmax - ybar) / 10);
      return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
    },
    svg(v) { return buildCSvg(v, true); },
  },
  XL: {
    name: "XL Profile", label: "XL", icon: "fa-solid fa-xmark", subtitle: "Doble Ángulo",
    inputs: [
      { id: "h", label: "h (ala mayor)", unit: "mm", default: 200 },
      { id: "b", label: "b (ala menor)", unit: "mm", default: 150 },
      { id: "t", label: "t (espesor)", unit: "mm", default: 4 },
    ],
    calc(v) {
      const area = ((v.h + v.b - 1.6438 * v.t) * v.t * 2) / 100;
      const weight = area * 0.00785 * 100;
      const cover = ((2 * v.h + 2 * v.b - v.t) * 2) / 1000;
      const desig = `XL ${((v.h + v.b) * 0.1).toFixed(0)} × ${weight.toFixed(2)}`;
      const A1 = (v.h + v.b - 1.6438 * v.t) * v.t;
      const ybar1 = (v.h * v.t * (v.h / 2) + (v.b - v.t) * v.t * (v.t / 2)) / A1;
      const Ix1 = (v.t * Math.pow(v.h, 3)) / 12 + v.h * v.t * Math.pow(v.h / 2 - ybar1, 2) + ((v.b - v.t) * Math.pow(v.t, 3)) / 12 + (v.b - v.t) * v.t * Math.pow(v.t / 2 - ybar1, 2);
      const Ix = (2 * Ix1) / 10000;
      const Iy1 = (v.h * Math.pow(v.t, 3)) / 12 + (v.b - v.t) * v.t * Math.pow(v.b / 2, 2) + (v.t * Math.pow(v.b - v.t, 3)) / 12;
      const Iy = (2 * Iy1) / 10000;
      const Wx = Ix / (Math.max(ybar1, v.h - ybar1) / 10);
      const Wy = Iy / (v.b / 10);
      return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
    },
    svg(v) { return buildXLSvg(v); },
  },
  L: {
    name: "L Profile", label: "L", icon: "fa-solid fa-l",
    inputs: [
      { id: "h", label: "h (ala mayor)", unit: "mm", default: 80 },
      { id: "b", label: "b (ala menor)", unit: "mm", default: 80 },
      { id: "t", label: "t (espesor)", unit: "mm", default: 6 },
    ],
    calc(v) {
      const area = ((v.h + v.b - 1.6438 * v.t) * v.t) / 100;
      const weight = area * 0.00785 * 100;
      const cover = (2 * v.h + 2 * v.b - v.t) / 1000;
      const desig = `L ${(v.h * 0.1).toFixed(0)} × ${weight.toFixed(2)}`;
      const A_L = (v.h + v.b - 1.6438 * v.t) * v.t;
      const ybar = (v.h * v.t * (v.h / 2) + (v.b - v.t) * v.t * (v.t / 2)) / A_L;
      const xbar = (v.h * v.t * (v.t / 2) + (v.b - v.t) * v.t * ((v.b - v.t) / 2 + v.t)) / A_L;
      const Ix = ((v.t * Math.pow(v.h, 3)) / 12 + v.h * v.t * Math.pow(v.h / 2 - ybar, 2) + ((v.b - v.t) * Math.pow(v.t, 3)) / 12 + (v.b - v.t) * v.t * Math.pow(v.t / 2 - ybar, 2)) / 10000;
      const Iy = ((v.h * Math.pow(v.t, 3)) / 12 + v.h * v.t * Math.pow(v.t / 2 - xbar, 2) + (v.t * Math.pow(v.b - v.t, 3)) / 12 + (v.b - v.t) * v.t * Math.pow((v.b - v.t) / 2 + v.t - xbar, 2)) / 10000;
      const Wx = Ix / (Math.max(ybar, v.h - ybar) / 10);
      const Wy = Iy / (Math.max(xbar, v.b - xbar) / 10);
      return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
    },
    svg(v) { return buildLSvg(v); },
  },
  PL: {
    name: "Plate", label: "PL", icon: "fa-solid fa-square",
    inputs: [
      { id: "h", label: "h (alto)", unit: "mm", default: 100 },
      { id: "b", label: "b (ancho)", unit: "mm", default: 100 },
      { id: "t", label: "t (espesor)", unit: "mm", default: 10 },
    ],
    calc(v) {
      const area = (v.h * v.b * v.t) / 1000;
      const weight = (v.h * v.b * v.t * 0.000785) / 100;
      const cover = (2 * v.b + 2 * v.t) / 1000;
      const desig = `PL ${v.h} × ${v.b} × ${v.t}`;
      const Ix = (v.b * Math.pow(v.t, 3)) / 12 / 10000;
      const Iy = (v.t * Math.pow(v.b, 3)) / 12 / 10000;
      const Wx = Ix / (v.t / 2 / 10);
      const Wy = Iy / (v.b / 2 / 10);
      return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
    },
    svg(v) { return buildPlateSvg(v); },
  },
  PIPE: {
    name: "Piping", label: "PIPE", icon: "fa-solid fa-circle-notch",
    inputs: [
      { id: "dia", label: "Diámetro Ext.", unit: "mm", default: 152.4 },
      { id: "thick", label: "Espesor", unit: "mm", default: 7.11 },
    ],
    calc(v) {
      const ro = v.dia / 2;
      const ri = (v.dia - 2 * v.thick) / 2;
      const area = (3.14 * (ro * ro - ri * ri)) / 100;
      const weight = (area * 1000 * 0.00786) / 10;
      const cover = (3.14 * v.dia) / 1000;
      const desig = `PIPE Ø${v.dia} × ${v.thick}`;
      const Ix = (Math.PI * (Math.pow(ro, 4) - Math.pow(ri, 4))) / 4 / 10000;
      const Iy = Ix;
      const Wx = Ix / (ro / 10);
      const Wy = Iy / (ro / 10);
      return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
    },
    svg(v) { return buildPipeSvg(v); },
  },
  PROF: {
    name: "Tubo Rectangular", label: "TUBULAR", icon: "fa-regular fa-square", subtitle: "Tubular",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 100 },
      { id: "b", label: "b (ancho)", unit: "mm", default: 100 },
      { id: "t", label: "t (espesor)", unit: "mm", default: 5 },
    ],
    calc(v) {
      const area = ((v.h * 2 + 2 * v.b - 6.5752 * v.t) * v.t) / 100;
      const weight = area * 0.00785 * 100;
      const cover = ((2 * v.h + 4 * v.b - 2 * v.t) * 2) / 1000;
      const desig = `CJ ${(v.h * 0.1).toFixed(0)} × ${weight.toFixed(2)}`;
      const hw = v.h - 2 * v.t, bw = v.b - 2 * v.t;
      const Ix = (v.b * Math.pow(v.h, 3) - bw * Math.pow(hw, 3)) / 12 / 10000;
      const Iy = (v.h * Math.pow(v.b, 3) - hw * Math.pow(bw, 3)) / 12 / 10000;
      const Wx = Ix / (v.h / 2 / 10);
      const Wy = Iy / (v.b / 2 / 10);
      return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
    },
    svg(v) { return buildTubeSvg(v); },
  },
  RB: {
    name: "Round Bar", label: "RB", icon: "fa-solid fa-circle",
    inputs: [{ id: "dia", label: "Diámetro", unit: "mm", default: 40 }],
    calc(v) {
      const area = v.dia * v.dia * 0.00785;
      const weight = (v.dia * v.dia * 1000 * 0.000616) / 100;
      const cover = (2 * 3.14 * (v.dia / 2)) / 1000;
      const desig = `ARMADURA Ø${v.dia}`;
      const r = v.dia / 2;
      const Ix = (Math.PI * Math.pow(r, 4)) / 4 / 10000;
      const Iy = Ix;
      const Wx = Ix / (r / 10);
      const Wy = Iy / (r / 10);
      return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
    },
    svg(v) { return buildRBSvg(v); },
  },
};

export default function ProfileCalculator() {
  const [currentProfile, setCurrentProfile] = useState("H");
  const [inputValues, setInputValues] = useState({});
  const [list, setList] = useState([]);
  
  // Quick adds
  const [quickMark, setQuickMark] = useState("");
  const [quickLen, setQuickLen] = useState(6);
  const [quickQty, setQuickQty] = useState(1);

  // Initialize defaults on profile load
  useEffect(() => {
    const prof = PROFILES[currentProfile];
    if (prof) {
      const defaults = {};
      prof.inputs.forEach((inp) => {
        defaults[inp.id] = inp.default;
      });
      setInputValues(defaults);
    }
  }, [currentProfile]);

  const handleInputChange = (id, val) => {
    setInputValues((prev) => ({ ...prev, [id]: parseFloat(val) || 0 }));
  };

  const results = useMemo(() => {
    const p = PROFILES[currentProfile];
    if (!p) return null;
    try {
      // Validate inputs
      const hasZero = Object.values(inputValues).some((v) => isNaN(v) || v < 0);
      if (hasZero) return { error: true };
      
      const r = p.calc(inputValues);
      const svgHTML = p.svg(inputValues);
      return { ...r, svgHTML, error: false };
    } catch (e) {
      return { error: true };
    }
  }, [currentProfile, inputValues]);

  const addToList = () => {
    if (!results || results.error) return;
    
    const newItem = {
      id: Date.now(),
      mark: quickMark || "-",
      qty: quickQty,
      profile: results.desig,
      length: quickLen,
      weightUnit: results.weight,
      weightTotal: results.weight * quickLen * quickQty
    };
    
    setList([...list, newItem]);
    setQuickMark("");
  };

  const deleteFromList = (id) => {
    setList(list.filter(item => item.id !== id));
  };

  const clearList = () => {
    setList([]);
  };

  const grandTotal = useMemo(() => list.reduce((acc, item) => acc + item.weightTotal, 0), [list]);

  // Export functions reusing similar structure from admin dashboard
  const exportToExcel = async () => {
    const wb = new ExcelJS.Workbook();
    const sheet = wb.addWorksheet("Resumen Perfiles");
    
    sheet.columns = [
      { header: 'Marca', key: 'mark', width: 15 },
      { header: 'Cantidad', key: 'qty', width: 10 },
      { header: 'Perfil', key: 'profile', width: 30 },
      { header: 'Largo (m)', key: 'length', width: 15 },
      { header: 'Peso Unit. (kg/m)', key: 'weightUnit', width: 20 },
      { header: 'Peso Total (kg)', key: 'weightTotal', width: 20 },
    ];
    
    list.forEach(item => sheet.addRow(item));
    sheet.addRow({ weightUnit: "TOTAL", weightTotal: grandTotal });
    
    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cubicacion_perfiles.xlsx";
    a.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Resumen de Cubicacion de Perfiles", 14, 15);
    
    const tableData = list.map(item => [
      item.mark, item.qty, item.profile, item.length.toFixed(2), item.weightUnit.toFixed(2), item.weightTotal.toFixed(2)
    ]);
    
    tableData.push(["", "", "", "", "TOTAL:", grandTotal.toFixed(2)]);
    
    doc.autoTable({
      head: [['Marca', 'Cant.', 'Perfil', 'Largo (m)', 'Peso U. (kg/m)', 'Peso Total (kg)']],
      body: tableData,
      startY: 25,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    doc.save("cubicacion_perfiles.pdf");
  };

  return (
    <div className="bg-gray-50 dark:bg-bim-dark text-gray-900 dark:text-gray-300 font-sans min-h-screen pt-24 pb-12 transition-colors duration-300">
      {/* Title */}
      <h1 className="text-center text-4xl font-black mb-4 font-grotesk text-white">
        Calculadora de <span className="text-transparent bg-clip-text bg-gradient-to-r from-bim-blue to-indigo-400">Aceros</span>
      </h1>
      
      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Selector Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2 mb-8">
          {Object.entries(PROFILES).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setCurrentProfile(key)}
              className={`rounded-lg p-3 flex flex-col items-center justify-center text-center transition-all bg-slate-900 border ${key === currentProfile ? 'border-bim-blue shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-bim-blue/10' : 'border-slate-700/50 hover:bg-slate-800'}`}
            >
              <i className={`${p.icon} text-lg mb-1 ${key === currentProfile ? 'text-bim-blue' : 'text-gray-400'}`}></i>
              <span className={`text-xs font-bold ${key === currentProfile ? 'text-white' : 'text-gray-500'}`}>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Main Interface Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.7fr_1.2fr] gap-6">
          
          {/* SVG Diagram Center */}
          <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[350px]">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 self-start flex items-center">
              <i className="fa-solid fa-vector-square mr-2 text-bim-blue"></i> Sección Transversal
            </h3>
            
            <div className="flex-1 flex items-center justify-center w-full drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]">
              {results && !results.error && (
                <div dangerouslySetInnerHTML={{ __html: results.svgHTML }} className="w-full h-full flex items-center justify-center" />
              )}
            </div>
            
            <div className="mt-4 text-center h-8">
              <span className="text-2xl font-extrabold text-white">
                {results && !results.error ? results.desig : "—"}
              </span>
            </div>
          </div>

          {/* Configuration Inputs */}
          <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                <i className="fa-solid fa-sliders mr-2 text-bim-blue"></i> Dimensiones
             </h3>
             <div className="space-y-4">
                {PROFILES[currentProfile]?.inputs.map(inp => (
                  <div key={inp.id}>
                    <label className="text-xs font-semibold text-slate-400 mb-1 block">{inp.label}</label>
                    <div className="flex items-center gap-2">
                        <input 
                           type="number" step="any" min="0"
                           value={inputValues[inp.id] !== undefined ? inputValues[inp.id] : inp.default}
                           onChange={e => handleInputChange(inp.id, e.target.value)}
                           className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold text-lg focus:outline-none focus:border-bim-blue" />
                        <span className="text-xs text-slate-500 w-8">{inp.unit}</span>
                    </div>
                  </div>
                ))}
             </div>
             {results && results.error && (
                <div className="mt-4 p-3 rounded-lg bg-rose-900/30 border border-rose-500/50 text-rose-400 text-sm font-medium">
                   Sólo valores positivos.
                </div>
             )}
          </div>

          {/* Results Panel */}
          <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
               <i className="fa-solid fa-calculator mr-2 text-bim-blue"></i> Propiedades
            </h3>
            
            <div className="space-y-3 mb-6">
               <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex justify-between items-center transition-colors hover:border-bim-blue/50">
                  <span className="text-slate-400 text-sm font-bold">Área sección</span>
                  <span className="text-2xl font-bold text-white">
                     {results && !results.error ? results.area.toFixed(2) : "0.00"} <span className="text-xs text-slate-500">cm²</span>
                  </span>
               </div>
               <div className="bg-bim-blue/10 border border-bim-blue/30 rounded-xl p-4 flex justify-between items-center transition-colors hover:border-bim-blue/70 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <span className="text-slate-300 text-sm font-bold">Peso Lineal</span>
                  <span className="text-2xl font-bold text-bim-blue">
                     {results && !results.error ? results.weight.toFixed(2) : "0.00"} <span className="text-xs text-slate-400">kg/m</span>
                  </span>
               </div>
               <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex justify-between items-center transition-colors hover:border-bim-blue/50">
                  <span className="text-slate-400 text-sm font-bold">Área Cobertura</span>
                  <span className="text-2xl font-bold text-white">
                     {results && !results.error ? results.cover.toFixed(3) : "0.000"} <span className="text-xs text-slate-500">m²/m</span>
                  </span>
               </div>
            </div>

            {/* Quick List Addition */}
            <div className="border-t border-slate-800 pt-4">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Agregar a Cubicación</h4>
               <div className="flex gap-2">
                  <input type="text" placeholder="Marca" value={quickMark} onChange={e=>setQuickMark(e.target.value)} className="w-1/3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                  <div className="relative w-1/3">
                    <input type="number" step="0.1" title="Largo" value={quickLen} onChange={e=>setQuickLen(parseFloat(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white text-center" />
                    <span className="absolute right-2 top-2.5 text-[10px] text-slate-500">m</span>
                  </div>
                  <div className="relative w-1/3">
                    <input type="number" step="1" title="Cantidad" value={quickQty} onChange={e=>setQuickQty(parseFloat(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white text-center" />
                    <span className="absolute right-2 top-2.5 text-[10px] text-slate-500">un</span>
                  </div>
               </div>
               <button 
                 onClick={addToList}
                 disabled={!results || results.error}
                 className="w-full mt-3 bg-bim-blue hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                 <i className="fa-solid fa-plus mr-2"></i> Añadir a Tabla
               </button>
            </div>
          </div>
        </div>

        {/* List Section */}
        {list.length > 0 && (
          <div className="mt-8 bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center">
                 <i className="fa-solid fa-list-check mr-2 text-bim-blue"></i> Resumen de Perfiles
              </h3>
              <div className="flex gap-2">
                  <button onClick={exportToExcel} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded disabled:opacity-50 text-xs font-bold transition-colors">
                     <i className="fa-solid fa-file-excel mr-1"></i> Excel
                  </button>
                  <button onClick={exportToPDF} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded disabled:opacity-50 text-xs font-bold transition-colors">
                     <i className="fa-solid fa-file-pdf mr-1"></i> PDF
                  </button>
                  <button onClick={clearList} className="bg-slate-700 hover:bg-slate-600 text-rose-400 px-3 py-1.5 rounded disabled:opacity-50 text-xs font-bold transition-colors">
                      Limpiar
                  </button>
              </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-slate-300 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase">
                      <th className="py-3 px-4">Marca</th>
                      <th className="py-3 px-4 text-center">Cant.</th>
                      <th className="py-3 px-4">Perfil</th>
                      <th className="py-3 px-4 text-right">Largo <span className="normal-case">(m)</span></th>
                      <th className="py-3 px-4 text-right">Peso Unit. <span className="normal-case">(kg/m)</span></th>
                      <th className="py-3 px-4 text-right">Peso Total <span className="normal-case">(kg)</span></th>
                      <th className="py-3 px-4 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {list.map(item => (
                       <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-white">{item.mark}</td>
                          <td className="py-3 px-4 text-center">{item.qty}</td>
                          <td className="py-3 px-4">{item.profile}</td>
                          <td className="py-3 px-4 text-right">{item.length.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right">{item.weightUnit.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-bold text-white text-base">{item.weightTotal.toFixed(2)}</td>
                          <td className="py-3 px-4 text-center">
                             <button onClick={() => deleteFromList(item.id)} className="text-slate-500 hover:text-rose-400 transition-colors">
                               <i className="fa-solid fa-trash-can"></i>
                             </button>
                          </td>
                       </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-700 bg-slate-800/20">
                      <td colSpan="5" className="py-4 px-4 text-right font-bold text-slate-400 uppercase pt-5">
                         Total General
                      </td>
                      <td className="py-4 px-4 text-right font-black text-bim-blue text-xl pt-5">
                         {grandTotal.toFixed(2)} <span className="text-xs font-normal text-slate-500">kg</span>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
               </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
