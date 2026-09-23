import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { PROFILE_CALCULATORS } from "../utils/profileCalculations";
import { ICHA_CATALOG } from "../data/icha_data.js";
import { useTranslation } from "../context/LanguageContext";
import { generateTakeoffPdf } from "../utils/pdfExportUtils";
import { generateTakeoffExcel } from "../utils/excelExportUtils";

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

function buildHSvg(h, b, s, t1, t2, unequal = false, b1, b2, gramil = null) {
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
    dims += dimLine(x - B1 / 2, y - H / 2, x + B1 / 2, y - H / 2, `b1=${b1}`, -14);
    dims += `<text x="${x + B1 / 2 + 6}" y="${y - H / 2 + T1 / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">t1=${t1}</text>`;
    dims += `<text x="${x + B2 / 2 + 6}" y="${y + H / 2 - T2 / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">t2=${t2}</text>`;
  } else {
    dims += `<text x="${x + B1 / 2 + 6}" y="${y - H / 2 + T1 / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">t=${t1}</text>`;
  }

  let gl = "";
  if (gramil) {
    const G = gramil * sc;
    gl += `<line x1="${x - G / 2}" y1="${y - H / 2}" x2="${x - G / 2}" y2="${y + H / 2}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<line x1="${x + G / 2}" y1="${y - H / 2}" x2="${x + G / 2}" y2="${y + H / 2}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<circle cx="${x - G / 2}" cy="${y - H / 2 + T1 / 2}" r="2" fill="#f97316"/>`;
    gl += `<circle cx="${x + G / 2}" cy="${y - H / 2 + T1 / 2}" r="2" fill="#f97316"/>`;
    gl += `<circle cx="${x - G / 2}" cy="${y + H / 2 - T2 / 2}" r="2" fill="#f97316"/>`;
    gl += `<circle cx="${x + G / 2}" cy="${y + H / 2 - T2 / 2}" r="2" fill="#f97316"/>`;
    gl += `<text x="${x}" y="${y - H / 2 - 8}" fill="#f97316" font-size="8" font-family="Inter" font-weight="600" text-anchor="middle">g=${gramil}</text>`;
  }

  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}${gl}</svg>`;
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

function buildCASvg(v, gramil = null) {
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

  let gl = "";
  if (gramil) {
    const G = gramil * sc;
    gl += `<line x1="${left + G}" y1="${top}" x2="${left + G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<circle cx="${left + G}" cy="${top + T / 2}" r="2" fill="#f97316"/>`;
    gl += `<circle cx="${left + G}" cy="${top + H - T / 2}" r="2" fill="#f97316"/>`;
    gl += `<text x="${left + G + 6}" y="${top + H / 2 + 4}" fill="#f97316" font-size="8" font-family="Inter" font-weight="600">g=${gramil}</text>`;
  }

  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}${gl}</svg>`;
}

function buildICASvg(v, gramil = null) {
  const bw = (v.b || 100) / 2;
  const sc = Math.min((SZ - 2 * PAD) / v.h, (SZ - 2 * PAD) / (v.b || 100));
  const H = v.h * sc, T = Math.max(v.t * sc, 3), BW = bw * sc, C = Math.max((v.c || 0) * sc, 4);
  const leftC_right = CX, rightC_left = CX;
  const top = CY - H / 2;
  const pts = `0,0 ${BW},0 ${BW},${C} ${BW-T},${C} ${BW-T},${T} ${T},${T} ${T},${H-T} ${BW-T},${H-T} ${BW-T},${H-C} ${BW},${H-C} ${BW},${H} 0,${H}`;
  const shape = `<g transform="translate(${rightC_left}, ${top})">
                   <polygon points="${pts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>
                 </g>
                 <g transform="translate(${leftC_right}, ${top}) scale(-1, 1)">
                   <polygon points="${pts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>
                 </g>`;
  let dims = dimLine(leftC_right - BW, top, leftC_right - BW, top + H, `h=${v.h}`, -20);
  dims += dimLine(leftC_right - BW, top + H + 12, rightC_left + BW, top + H + 12, `b=${v.b}`, 16);
  dims += `<text x="${leftC_right - T - 6}" y="${top + T + 12}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600" text-anchor="end">t=${v.t}</text>`;
  if (v.c > 0) dims += `<text x="${leftC_right - BW - 6}" y="${top + H - C + 3}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600" text-anchor="end">c=${v.c}</text>`;

  let gl = "";
  if (gramil) {
    const G = gramil * sc;
    gl += `<line x1="${leftC_right - G}" y1="${top}" x2="${leftC_right - G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<line x1="${rightC_left + G}" y1="${top}" x2="${rightC_left + G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<circle cx="${leftC_right - G}" cy="${top + T / 2}" r="2" fill="#f97316"/>`;
    gl += `<circle cx="${rightC_left + G}" cy="${top + T / 2}" r="2" fill="#f97316"/>`;
    gl += `<text x="${rightC_left + G + 6}" y="${top + H / 2 + 4}" fill="#f97316" font-size="8" font-family="Inter" font-weight="600">g=${gramil}</text>`;
  }

  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}${gl}</svg>`;
}

function buildCSvg(v, unequal = false, gramil = null) {
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

  let gl = "";
  if (gramil) {
    const G = gramil * sc;
    gl += `<line x1="${x - G}" y1="${top}" x2="${x - G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<circle cx="${x - G}" cy="${top + T / 2}" r="2" fill="#f97316"/>`;
    gl += `<circle cx="${x - G}" cy="${top + H - T / 2}" r="2" fill="#f97316"/>`;
    gl += `<text x="${x - G - 6}" y="${top + H / 2 + 4}" fill="#f97316" font-size="8" font-family="Inter" font-weight="600" text-anchor="end">g=${gramil}</text>`;
  }

  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}${gl}</svg>`;
}

function buildICSvg(v, gramil = null) {
  const bc = (v.b || 100) / 2;
  const sc = Math.min((SZ - 2 * PAD) / v.h, (SZ - 2 * PAD) / (v.b || 100));
  const H = v.h * sc, T = Math.max(v.t * sc, 3), BW = bc * sc;
  const leftC_right = CX, rightC_left = CX;
  const top = CY - H / 2;
  const ptsL = `${leftC_right - BW},${top} ${leftC_right},${top} ${leftC_right},${top + H} ${leftC_right - BW},${top + H} ${leftC_right - BW},${top + H - T} ${leftC_right - T},${top + H - T} ${leftC_right - T},${top + T} ${leftC_right - BW},${top + T}`;
  const ptsR = `${rightC_left},${top} ${rightC_left + BW},${top} ${rightC_left + BW},${top + T} ${rightC_left + T},${top + T} ${rightC_left + T},${top + H - T} ${rightC_left + BW},${top + H - T} ${rightC_left + BW},${top + H} ${rightC_left},${top + H}`;
  const shape = `<polygon points="${ptsL}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>
                 <polygon points="${ptsR}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;
  let dims = dimLine(leftC_right - BW, top, leftC_right - BW, top + H, `h=${v.h}`, -20);
  dims += dimLine(leftC_right - BW, top + H + 12, rightC_left + BW, top + H + 12, `b=${v.b}`, 16);
  dims += `<text x="${leftC_right - T - 6}" y="${top + T + 12}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600" text-anchor="end">t=${v.t}</text>`;

  let gl = "";
  if (gramil) {
    const G = gramil * sc;
    gl += `<line x1="${leftC_right - G}" y1="${top}" x2="${leftC_right - G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<line x1="${rightC_left + G}" y1="${top}" x2="${rightC_left + G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<circle cx="${leftC_right - G}" cy="${top + T / 2}" r="2" fill="#f97316"/>`;
    gl += `<circle cx="${rightC_left + G}" cy="${top + T / 2}" r="2" fill="#f97316"/>`;
    gl += `<text x="${rightC_left + G + 6}" y="${top + H / 2 + 4}" fill="#f97316" font-size="8" font-family="Inter" font-weight="600">g=${gramil}</text>`;
  }

  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}${gl}</svg>`;
}

function buildLSvg(v, gramil = null) {
  const maxD = Math.max(v.h, v.b);
  const sc = (SZ - 2 * PAD) / maxD;
  const H = v.h * sc, B = v.b * sc, T = Math.max(v.t * sc, 3);
  const x = CX - B / 2, top = CY - H / 2;
  const pts = `${x},${top} ${x + T},${top} ${x + T},${top + H - T} ${x + B},${top + H - T} ${x + B},${top + H} ${x},${top + H}`;
  const shape = `<polygon points="${pts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;
  let dims = dimLine(x, top, x, top + H, `h=${v.h}`, -20);
  dims += dimLine(x, top + H, x + B, top + H, `b=${v.b}`, 16);
  dims += `<text x="${x + T + 6}" y="${top + 20}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">t=${v.t}</text>`;

  let gl = "";
  if (gramil) {
    const G = gramil * sc;
    gl += `<line x1="${x + G}" y1="${top}" x2="${x + G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<line x1="${x}" y1="${top + H - G}" x2="${x + B}" y2="${top + H - G}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<circle cx="${x + G}" cy="${top + H - G}" r="2" fill="#f97316"/>`;
    gl += `<text x="${x + G + 6}" y="${top + H - G - 4}" fill="#f97316" font-size="8" font-family="Inter" font-weight="600">g=${gramil}</text>`;
  }

  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}${gl}</svg>`;
}

function buildTLSvg(v, gramil = null) {
  const bw = (v.b || 100) / 2;
  const maxD = Math.max(v.h, v.b);
  const sc = (SZ - 2 * PAD) / maxD;
  const H = v.h * sc, T = Math.max(v.t * sc, 3), BW = bw * sc;
  const gap = 4;
  const leftL_right = CX - gap / 2;
  const rightL_left = CX + gap / 2;
  const top = CY - H / 2;
  const ptsL = `${leftL_right - BW},${top + H - T} ${leftL_right - T},${top + H - T} ${leftL_right - T},${top} ${leftL_right},${top} ${leftL_right},${top + H} ${leftL_right - BW},${top + H}`;
  const ptsR = `${rightL_left},${top} ${rightL_left + T},${top} ${rightL_left + T},${top + H - T} ${rightL_left + BW},${top + H - T} ${rightL_left + BW},${top + H} ${rightL_left},${top + H}`;
  const shape = `<polygon points="${ptsL}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>
                 <polygon points="${ptsR}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;
  let dims = dimLine(leftL_right - BW, top, leftL_right - BW, top + H, `h=${v.h}`, -20);
  dims += dimLine(leftL_right - BW, top + H, rightL_left + BW, top + H, `b=${v.b}`, 16);
  dims += `<text x="${leftL_right - T - 6}" y="${top + 20}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600" text-anchor="end">t=${v.t}</text>`;

  let gl = "";
  if (gramil) {
    const G = gramil * sc;
    gl += `<line x1="${leftL_right - BW}" y1="${top + H - G}" x2="${rightL_left + BW}" y2="${top + H - G}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<line x1="${leftL_right - G}" y1="${top}" x2="${leftL_right - G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<line x1="${rightL_left + G}" y1="${top}" x2="${rightL_left + G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<circle cx="${leftL_right - G}" cy="${top + H - G}" r="2" fill="#f97316"/>`;
    gl += `<circle cx="${rightL_left + G}" cy="${top + H - G}" r="2" fill="#f97316"/>`;
    gl += `<text x="${rightL_left + G + 6}" y="${top + H - G - 4}" fill="#f97316" font-size="8" font-family="Inter" font-weight="600">g=${gramil}</text>`;
  }

  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}${gl}</svg>`;
}

function buildXLSvg(v, gramil = null) {
  const totalMax = Math.max(v.h, v.b);
  const sc = (SZ - 2 * PAD) / totalMax;
  const H_half = (v.h / 2) * sc;
  const B_half = (v.b / 2) * sc;
  const T = Math.max(v.t * sc, 3);
  const ax = CX, ay = CY;
  const aPts = `${ax},${ay} ${ax},${ay - H_half} ${ax - T},${ay - H_half} ${ax - T},${ay - T} ${ax - B_half},${ay - T} ${ax - B_half},${ay}`;
  const bx = CX, by = CY;
  const bPts = `${bx},${by} ${bx},${by + H_half} ${bx + T},${by + H_half} ${bx + T},${by + T} ${bx + B_half},${by + T} ${bx + B_half},${by}`;
  const axes = `<line x1="${CX}" y1="${PAD}" x2="${CX}" y2="${SZ - PAD}" stroke="#475569" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.5"/>
                <line x1="${PAD}" y1="${CY}" x2="${SZ - PAD}" y2="${CY}" stroke="#475569" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.5"/>`;

  const shape = `${axes}
                <polygon points="${aPts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2" stroke-linejoin="round"/>
                <polygon points="${bPts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2" stroke-linejoin="round"/>`;
  let dims = dimLine(ax - B_half - 12, ay - H_half, ax - B_half - 12, by + H_half, `h=${v.h}`, -18);
  dims += dimLine(ax - B_half, by + H_half + 12, bx + B_half, by + H_half + 12, `b=${v.b}`, 16);
  dims += `<text x="${ax - B_half + 6}" y="${ay - H_half + 14}" fill="#60a5fa" font-size="9" font-family="Inter" font-weight="600">t=${v.t}</text>`;

  let gl = "";
  if (gramil) {
    const G = gramil * sc;
    gl += `<line x1="${ax - G}" y1="${ay - H_half}" x2="${ax - G}" y2="${ay}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<line x1="${ax - B_half}" y1="${ay - G}" x2="${ax}" y2="${ay - G}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<line x1="${bx + G}" y1="${by}" x2="${bx + G}" y2="${by + H_half}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<line x1="${bx}" y1="${by + G}" x2="${bx + B_half}" y2="${by + G}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gl += `<circle cx="${ax - G}" cy="${ay - T / 2}" r="2" fill="#f97316"/>`;
    gl += `<circle cx="${bx + G}" cy="${by + T / 2}" r="2" fill="#f97316"/>`;
    gl += `<text x="${bx + G + 6}" y="${by + H_half - 4}" fill="#f97316" font-size="8" font-family="Inter" font-weight="600">g=${gramil}</text>`;
  }

  return `<svg viewBox="0 0 ${SZ} ${SZ}" class="w-full h-full max-w-[240px]">${shape}${dims}${gl}</svg>`;
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

// ==================== PROFILE DEFINITIONS & ICHA MAPPING ====================
const ICHA_SERIES_MAP = {
  H: ["HN", "IN", "IP", "PH"],
  CA: ["CA"],
  ICA: ["ICA"],
  C: ["C"],
  IC: ["IC"],
  L: ["L", "L_desig"],
  TL: ["TL"],
  XL: ["XL"],
  PROF: ["CAJON"],
};

const PROFILES = {
  H: {
    name: "H / Viga Soldada", label: "H / W", icon: "fa-solid fa-h", subtitle: "HN · IN · IP · PH",
    inputs: [
      { id: "h", label: "h (altura total)", unit: "mm", default: 200 },
      { id: "b", label: "b (ancho ala)", unit: "mm", default: 100 },
      { id: "s", label: "s / t (alma)", unit: "mm", default: 6 },
      { id: "t", label: "t / e (ala)", unit: "mm", default: 12 },
    ],
    calc(v) { return PROFILE_CALCULATORS.H(v); },
    svg(v, g) { return buildHSvg(v.h, v.b, v.s, v.t, v.t, false, null, null, g); },
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
    calc(v) { return PROFILE_CALCULATORS.HE(v); },
    svg(v) { return buildHSvg(v.h, Math.max(v.b1, v.b2), v.s, v.t1, v.t2, true, v.b1, v.b2); },
  },
  T: {
    name: "T Profile", label: "T", icon: "fa-solid fa-t", subtitle: "Perfil T",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 175 },
      { id: "b", label: "b (ancho ala)", unit: "mm", default: 250 },
      { id: "t", label: "t (ala)", unit: "mm", default: 18 },
      { id: "s", label: "s (alma)", unit: "mm", default: 12 },
    ],
    calc(v) { return PROFILE_CALCULATORS.T(v); },
    svg(v) { return buildTSvg(v); },
  },
  CA: {
    name: "CA Profile", label: "CA", icon: "fa-solid fa-c", subtitle: "Canal Atiesado ICHA",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 280 },
      { id: "b", label: "b (ancho ala)", unit: "mm", default: 100 },
      { id: "c", label: "c (labio / pestaña)", unit: "mm", default: 35 },
      { id: "t", label: "t / e (espesor)", unit: "mm", default: 5 },
    ],
    calc(v) { return PROFILE_CALCULATORS.CA(v); },
    svg(v, g) { return buildCASvg(v, g); },
  },
  ICA: {
    name: "ICA Profile", label: "ICA", icon: "fa-solid fa-arrows-left-right-to-line", subtitle: "Doble Canal Atiesada",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 280 },
      { id: "b", label: "b (ancho total 2 alas)", unit: "mm", default: 200 },
      { id: "c", label: "c (labio)", unit: "mm", default: 35 },
      { id: "t", label: "t / e (espesor)", unit: "mm", default: 5 },
    ],
    calc(v) { return PROFILE_CALCULATORS.ICA(v); },
    svg(v, g) { return buildICASvg(v, g); },
  },
  C: {
    name: "C Profile", label: "C", icon: "fa-solid fa-c", subtitle: "Canal Estándar ICHA",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 250 },
      { id: "b", label: "b (ancho ala)", unit: "mm", default: 50 },
      { id: "t", label: "t / e (espesor)", unit: "mm", default: 6 },
    ],
    calc(v) { return PROFILE_CALCULATORS.C(v); },
    svg(v, g) { return buildCSvg(v, false, g); },
  },
  IC: {
    name: "IC Profile", label: "IC", icon: "fa-solid fa-arrows-left-right", subtitle: "Doble Canal ICHA",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 250 },
      { id: "b", label: "b (ancho total 2 alas)", unit: "mm", default: 100 },
      { id: "t", label: "t / e (espesor)", unit: "mm", default: 6 },
    ],
    calc(v) { return PROFILE_CALCULATORS.IC(v); },
    svg(v, g) { return buildICSvg(v, g); },
  },
  CE: {
    name: "CE Profile", label: "CE", icon: "fa-solid fa-c", subtitle: "Alas Desiguales",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 200 },
      { id: "b1", label: "b1 (ala sup.)", unit: "mm", default: 75 },
      { id: "b2", label: "b2 (ala inf.)", unit: "mm", default: 75 },
      { id: "t", label: "t (espesor)", unit: "mm", default: 6 },
    ],
    calc(v) { return PROFILE_CALCULATORS.CE(v); },
    svg(v) { return buildCSvg(v, true); },
  },
  L: {
    name: "L Profile", label: "L", icon: "fa-solid fa-l", subtitle: "Ángulo ICHA",
    inputs: [
      { id: "h", label: "h (ala mayor)", unit: "mm", default: 80 },
      { id: "b", label: "b (ala menor)", unit: "mm", default: 80 },
      { id: "t", label: "t / e (espesor)", unit: "mm", default: 6 },
    ],
    calc(v) { return PROFILE_CALCULATORS.L(v); },
    svg(v, g) { return buildLSvg(v, g); },
  },
  TL: {
    name: "TL Profile", label: "TL", icon: "fa-solid fa-cubes", subtitle: "Doble Ángulo T",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 100 },
      { id: "b", label: "b (ancho total 2 alas)", unit: "mm", default: 200 },
      { id: "t", label: "t / e (espesor)", unit: "mm", default: 8 },
    ],
    calc(v) { return PROFILE_CALCULATORS.TL(v); },
    svg(v, g) { return buildTLSvg(v, g); },
  },
  XL: {
    name: "XL Profile", label: "XL", icon: "fa-solid fa-xmark", subtitle: "Ángulo en Cruz",
    inputs: [
      { id: "h", label: "h (ala mayor)", unit: "mm", default: 200 },
      { id: "b", label: "b (ala menor)", unit: "mm", default: 150 },
      { id: "t", label: "t / e (espesor)", unit: "mm", default: 4 },
    ],
    calc(v) { return PROFILE_CALCULATORS.XL(v); },
    svg(v, g) { return buildXLSvg(v, g); },
  },
  PROF: {
    name: "Cajón / Tubo", label: "TUBULAR", icon: "fa-regular fa-square", subtitle: "Cajón ICHA",
    inputs: [
      { id: "h", label: "h (altura)", unit: "mm", default: 100 },
      { id: "b", label: "b (ancho)", unit: "mm", default: 100 },
      { id: "t", label: "t / e (espesor)", unit: "mm", default: 5 },
    ],
    calc(v) { return PROFILE_CALCULATORS.PROF(v); },
    svg(v) { return buildTubeSvg(v); },
  },
  PL: {
    name: "Plate", label: "PL", icon: "fa-solid fa-square", subtitle: "Plancha / Placa",
    inputs: [
      { id: "h", label: "h (largo placa)", unit: "mm", default: 100 },
      { id: "b", label: "b (ancho)", unit: "mm", default: 100 },
      { id: "t", label: "t (espesor)", unit: "mm", default: 10 },
    ],
    calc(v) { return PROFILE_CALCULATORS.PL(v); },
    svg(v) { return buildPlateSvg(v); },
  },
  PIPE: {
    name: "Piping", label: "PIPE", icon: "fa-solid fa-circle-notch", subtitle: "Tubo Circular",
    inputs: [
      { id: "dia", label: "Diámetro Ext.", unit: "mm", default: 152.4 },
      { id: "thick", label: "Espesor", unit: "mm", default: 7.11 },
    ],
    calc(v) { return PROFILE_CALCULATORS.PIPE(v); },
    svg(v) { return buildPipeSvg(v); },
  },
  RB: {
    name: "Round Bar", label: "RB", icon: "fa-solid fa-circle", subtitle: "Barra Redonda",
    inputs: [{ id: "dia", label: "Diámetro", unit: "mm", default: 40 }],
    calc(v) { return PROFILE_CALCULATORS.RB(v); },
    svg(v) { return buildRBSvg(v); },
  },
};

export default function ProfileCalculator() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [currentProfile, setCurrentProfile] = useState("H");
  const [inputValues, setInputValues] = useState({});
  const [list, setList] = useState([]);
  
  // ICHA Catalog Selection State
  const [selectedIchaKey, setSelectedIchaKey] = useState("");
  const [selectedIchaProfile, setSelectedIchaProfile] = useState(null);
  const [isCustomized, setIsCustomized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Quick adds
  const [quickMark, setQuickMark] = useState("");
  const [quickLen, setQuickLen] = useState(6);
  const [quickQty, setQuickQty] = useState(1);

  // Flattened ICHA profiles list for search
  const allIchaProfiles = useMemo(() => {
    const arr = [];
    Object.entries(ICHA_CATALOG).forEach(([sKey, sVal]) => {
      if (sVal.profiles) {
        sVal.profiles.forEach((p) => {
          arr.push({
            ...p,
            seriesKey: sKey,
            seriesName: sVal.name,
            fullLabel: `${p.designation} (${sVal.name})`
          });
        });
      }
    });
    return arr;
  }, []);

  // Filtered profiles for global quick search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase().trim();
    return allIchaProfiles
      .filter((p) => p.designation.toLowerCase().includes(q) || p.seriesKey.toLowerCase().includes(q) || p.seriesName.toLowerCase().includes(q))
      .slice(0, 10);
  }, [searchQuery, allIchaProfiles]);

  // ICHA series associated with the current profile
  const currentIchaSeriesKeys = useMemo(() => {
    return ICHA_SERIES_MAP[currentProfile] || [];
  }, [currentProfile]);

  // Available ICHA profiles for current profile family
  const availableIchaProfiles = useMemo(() => {
    const list = [];
    currentIchaSeriesKeys.forEach((sKey) => {
      const s = ICHA_CATALOG[sKey];
      if (s && s.profiles) {
        s.profiles.forEach((p) => {
          list.push({ ...p, seriesKey: sKey, seriesName: s.name });
        });
      }
    });
    return list;
  }, [currentIchaSeriesKeys]);

  // Initialize defaults on profile load
  useEffect(() => {
    const prof = PROFILES[currentProfile];
    if (prof) {
      const defaults = {};
      prof.inputs.forEach((inp) => {
        defaults[inp.id] = inp.default;
      });
      setInputValues(defaults);
      setSelectedIchaKey("");
      setSelectedIchaProfile(null);
      setIsCustomized(false);
    }
  }, [currentProfile]);

  // Sincronizar el largo predeterminado en metros (quickLen) cuando el perfil es PL
  useEffect(() => {
    if (currentProfile === "PL" && inputValues.h !== undefined) {
      setQuickLen(inputValues.h / 1000);
    } else if (currentProfile !== "PL") {
      setQuickLen(6);
    }
  }, [currentProfile, inputValues.h]);

  const handleInputChange = (id, val) => {
    setInputValues((prev) => ({ ...prev, [id]: parseFloat(val) || 0 }));
    if (selectedIchaProfile) {
      setIsCustomized(true);
    }
  };

  // Carga de perfil estándar ICHA
  const handleSelectIchaProfile = (designation) => {
    if (!designation) {
      setSelectedIchaKey("");
      setSelectedIchaProfile(null);
      setIsCustomized(false);
      return;
    }

    const p = availableIchaProfiles.find((item) => item.designation === designation) ||
              allIchaProfiles.find((item) => item.designation === designation);

    if (!p) return;

    setSelectedIchaKey(p.designation);
    setSelectedIchaProfile(p);
    setIsCustomized(false);

    // Mapear dimensiones según la serie
    const newVals = {};
    if (["HN", "IN", "IP", "PH"].includes(p.seriesKey)) {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.s = p.t_mm || 0; // alma
      newVals.t = p.e_mm || 0; // ala
    } else if (["L", "L_desig"].includes(p.seriesKey)) {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.t = p.e_mm || 0;
    } else if (p.seriesKey === "TL") {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.t = p.e_mm || 0;
    } else if (p.seriesKey === "XL") {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.t = p.e_mm || 0;
    } else if (p.seriesKey === "C") {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.t = p.e_mm || 0;
    } else if (p.seriesKey === "IC") {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.t = p.e_mm || 0;
    } else if (p.seriesKey === "CA") {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.c = p.C_mm || 0;
      newVals.t = p.e_mm || 0;
    } else if (p.seriesKey === "ICA") {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.c = p.C_mm || 0;
      newVals.t = p.e_mm || 0;
    } else if (p.seriesKey === "CAJON") {
      newVals.h = p.H_mm || 0;
      newVals.b = p.B_mm || 0;
      newVals.t = p.e_mm || 0;
    }

    setInputValues(newVals);
  };

  // Carga directa desde búsqueda global
  const handleSelectFromGlobalSearch = (p) => {
    let targetCategory = "H";
    if (["HN", "IN", "IP", "PH"].includes(p.seriesKey)) targetCategory = "H";
    else if (["L", "L_desig"].includes(p.seriesKey)) targetCategory = "L";
    else if (p.seriesKey === "TL") targetCategory = "TL";
    else if (p.seriesKey === "XL") targetCategory = "XL";
    else if (p.seriesKey === "C") targetCategory = "C";
    else if (p.seriesKey === "IC") targetCategory = "IC";
    else if (p.seriesKey === "CA") targetCategory = "CA";
    else if (p.seriesKey === "ICA") targetCategory = "ICA";
    else if (p.seriesKey === "CAJON") targetCategory = "PROF";

    setCurrentProfile(targetCategory);
    setSearchQuery("");
    setShowSearchResults(false);

    // Seleccionar el perfil en el siguiente tick
    setTimeout(() => {
      handleSelectIchaProfile(p.designation);
    }, 50);
  };

  const results = useMemo(() => {
    const p = PROFILES[currentProfile];
    if (!p) return null;
    try {
      const hasZero = Object.values(inputValues).some((v) => isNaN(v) || v < 0);
      if (hasZero) return { error: true };
      
      const r = p.calc(inputValues);
      const gramilVal = selectedIchaProfile?.gramil_mm || null;
      const svgHTML = p.svg(inputValues, gramilVal);

      let finalDesig = r.desig;
      if (selectedIchaProfile) {
        finalDesig = isCustomized ? `${selectedIchaProfile.designation} (Modificado)` : `${selectedIchaProfile.designation}`;
      }

      return { ...r, desig: finalDesig, svgHTML, error: false };
    } catch {
      return { error: true };
    }
  }, [currentProfile, inputValues, selectedIchaProfile, isCustomized]);

  const addToList = () => {
    if (!results || results.error) return;
    
    const isIcha = selectedIchaProfile && !isCustomized;
    const profileLabel = isIcha ? `${selectedIchaProfile.designation} [ICHA]` : results.desig;

    const newItem = {
      id: Date.now(),
      mark: quickMark || "-",
      qty: quickQty,
      profile: profileLabel,
      length: quickLen,
      weightUnit: results.weight,
      weightTotal: results.weight * quickLen * quickQty,
      isIcha: !!isIcha,
      ichaData: isIcha ? selectedIchaProfile : null
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

  const [extraPct, setExtraPct] = useState(5);

  const subtotalWeight = useMemo(() => list.reduce((acc, item) => acc + item.weightTotal, 0), [list]);
  const extraWeight = useMemo(() => subtotalWeight * (extraPct / 100), [subtotalWeight, extraPct]);
  const grandTotal = useMemo(() => subtotalWeight + extraWeight, [subtotalWeight, extraWeight]);

  // Export functions
  const exportToExcel = async () => {
    if (!list.length) return alert("No hay perfiles en la lista de cubicación.");

    await generateTakeoffExcel({
      sheetName: "Cubicación Perfiles",
      title: "Resumen de Cubicación de Perfiles de Acero",
      subtitle: "Calculadora de Perfiles Estructurales & Catálogo ICHA Oficial",
      standardTag: "CÁLCULO ESTRUCTURAL · ICHA",
      columns: [
        { header: "Marca", key: "mark", width: 14, align: "center" },
        { header: "Cantidad", key: "qty", width: 12, align: "center", numFmt: '#,##0' },
        { header: "Perfil", key: "profile", width: 28, align: "left" },
        { header: "Largo (m)", key: "length", width: 15, align: "right", numFmt: '#,##0.00' },
        { header: "Peso Unit. (kg/m)", key: "weightUnit", width: 18, align: "right", numFmt: '#,##0.00' },
        { header: "Peso Total (kg)", key: "weightTotal", width: 20, align: "right", numFmt: '#,##0.00' },
        { header: "Norma / Origen", key: "norm", width: 18, align: "center" },
      ],
      data: list.map((item) => ({
        mark: item.mark,
        qty: item.qty,
        profile: item.profile,
        length: item.length,
        weightUnit: item.weightUnit,
        weightTotal: item.weightTotal,
        norm: item.isIcha ? "ICHA Oficial" : "Personalizado",
      })),
      summary: {
        subtotal: subtotalWeight,
        extraPct: extraPct,
        extraWeight: extraWeight,
        grandTotal: grandTotal,
        tonTotal: grandTotal / 1000,
        unitLabel: "kg",
        tonUnitLabel: "Ton",
      },
      filename: "cubicacion_perfiles_acero.xlsx",
    });
  };

  const exportToPDF = () => {
    if (!list.length) return alert("No hay perfiles en la lista de cubicación.");

    generateTakeoffPdf({
      title: "Resumen de Cubicación de Perfiles de Acero",
      subtitle: "Calculadora de Perfiles Estructurales & Catálogo ICHA Oficial",
      standardTag: "CÁLCULO ESTRUCTURAL · ICHA",
      headers: ["Marca", "Cant.", "Perfil", "Largo (m)", "Peso Unit. (kg/m)", "Peso Total (kg)", "Norma"],
      rows: list.map((item) => [
        item.mark,
        item.qty,
        item.profile,
        item.length.toFixed(2),
        item.weightUnit.toFixed(2),
        item.weightTotal.toFixed(2),
        item.isIcha ? "ICHA" : "Personalizado",
      ]),
      summary: {
        subtotal: subtotalWeight,
        extraPct: extraPct,
        extraWeight: extraWeight,
        grandTotal: grandTotal,
        tonTotal: grandTotal / 1000,
        unitLabel: "kg",
        tonUnitLabel: "Ton",
      },
      columnAlignments: {
        0: "center",
        1: "center",
        2: "left",
        3: "right",
        4: "right",
        5: "right",
        6: "center",
      },
      filename: "cubicacion_perfiles_acero.pdf",
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-bim-dark text-gray-900 dark:text-gray-300 font-sans min-h-screen pt-24 pb-12 transition-colors duration-300">
      <SEOHead
        title="Calculadora de Propiedades Geométricas de Perfiles de Acero"
        description="Calcula momentos de inercia (Ix, Iy), módulos de sección (Wx, Wy), radios de giro (ix, iy) y peso lineal de perfiles paramétricos I, H, Cajón, Tubos y C de acero."
        path="/herramientas/perfiles"
        keywords="Calculadora de perfiles de acero, inercia perfiles estructurales, módulo resistente sección, peso por metro perfil metálico, perfil H, perfil tubular"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Calculadora de Propiedades Geométricas de Perfiles de Acero",
          "applicationCategory": "EngineeringApplication",
          "operatingSystem": "All",
          "url": "https://atelijudesign.com/herramientas/perfiles",
          "description": "Herramienta online para el cálculo de propiedades mecánicas y geométricas de perfiles de acero estructural paramétricos.",
          "inLanguage": "es"
        }}
      />
      <div className="max-w-7xl mx-auto px-4 mb-6 flex items-center justify-between flex-wrap gap-3">
        <Link to="/herramientas" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm group">
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> {isEn ? "Back to Tools" : "Volver a Herramientas"}
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/herramientas/icha" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm">
            <i className="fa-solid fa-book"></i> {isEn ? "Full ICHA Catalog" : "Catálogo ICHA Completo"}
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700/50 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm">
            <i className="fa-solid fa-house"></i> {isEn ? "Home" : "Inicio"}
          </Link>
        </div>
      </div>

      {/* Title & Quick ICHA Search Header */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <h1 className="text-center text-4xl font-black mb-3 font-grotesk text-white">
          {isEn ? (
            <>Steel & <span className="text-transparent bg-clip-text bg-gradient-to-r from-bim-blue via-cyan-400 to-indigo-400">ICHA Profiles Calculator</span></>
          ) : (
            <>Calculadora de <span className="text-transparent bg-clip-text bg-gradient-to-r from-bim-blue via-cyan-400 to-indigo-400">Aceros & Perfiles ICHA</span></>
          )}
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto mb-6">
          {isEn
            ? "Compute parametric geometric properties or directly load any of the 660+ official Chilean ICHA steel profiles."
            : "Calcula propiedades de secciones geométricas libres o carga directamente cualquiera de los 660+ perfiles oficiales de la norma chilena ICHA."}
        </p>

        {/* Global ICHA Search Box */}
        <div className="max-w-xl mx-auto relative z-30">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"></i>
            <input
              type="text"
              placeholder="Buscar en Catálogo ICHA (ej: HN 30, IN 40x80, CA 150, L 100x10, IC 250)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full bg-slate-900/90 border border-slate-700 hover:border-cyan-500 focus:border-cyan-400 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none shadow-xl transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setShowSearchResults(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-left max-h-72 overflow-y-auto">
              <div className="p-2 text-[11px] font-bold text-cyan-400 bg-slate-950/80 border-b border-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Perfiles ICHA Encontrados</span>
                <span className="text-slate-500">{searchResults.length} resultados</span>
              </div>
              {searchResults.map((p) => (
                <button
                  key={`${p.seriesKey}-${p.designation}`}
                  onClick={() => handleSelectFromGlobalSearch(p)}
                  className="w-full px-4 py-2.5 hover:bg-cyan-950/40 border-b border-slate-800/40 flex items-center justify-between text-left transition-colors group"
                >
                  <div>
                    <span className="font-bold text-white group-hover:text-cyan-300 text-sm block">
                      {p.designation}
                    </span>
                    <span className="text-xs text-slate-400">
                      {p.seriesName} · {p.weight} kg/m · H:{p.H_mm}mm B:{p.B_mm}mm
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-slate-800 text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                    Cargar
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Category Selector Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-15 gap-2 mb-8">
          {Object.entries(PROFILES).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setCurrentProfile(key)}
              className={`rounded-xl p-2.5 flex flex-col items-center justify-center text-center transition-all bg-slate-900 border ${key === currentProfile ? 'border-bim-blue shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-bim-blue/10 text-white' : 'border-slate-700/50 hover:bg-slate-800 text-slate-400'}`}
              title={p.name}
            >
              <i className={`${p.icon} text-base mb-1 ${key === currentProfile ? 'text-bim-blue' : 'text-gray-400'}`}></i>
              <span className={`text-xs font-bold ${key === currentProfile ? 'text-white' : 'text-gray-400'}`}>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Main Interface Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.75fr_1.15fr] gap-6">
          
          {/* SVG Diagram Center */}
          <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[380px] relative">
            <div className="w-full flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center">
                <i className="fa-solid fa-vector-square mr-2 text-bim-blue"></i> Sección Transversal
              </h3>
              {selectedIchaProfile && (
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${isCustomized ? 'bg-amber-950/60 text-amber-300 border-amber-800/80' : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/80'}`}>
                  <i className="fa-solid fa-certificate mr-1"></i>
                  {isCustomized ? 'Base ICHA (Modificado)' : 'Norma ICHA'}
                </span>
              )}
            </div>
            
            <div className="flex-1 flex items-center justify-center w-full drop-shadow-[0_0_8px_rgba(59,130,246,0.2)] my-2">
              {results && !results.error && (
                <div dangerouslySetInnerHTML={{ __html: results.svgHTML }} className="w-full h-full flex items-center justify-center" />
              )}
            </div>
            
            <div className="mt-2 text-center">
              <span className="text-2xl font-black text-white tracking-tight">
                {results && !results.error ? results.desig : "—"}
              </span>
              {selectedIchaProfile?.gramil_mm && (
                <div className="text-xs text-orange-400 font-semibold mt-1 flex items-center justify-center gap-1.5">
                  <i className="fa-solid fa-circle-dot text-[10px]"></i>
                  <span>Gramil estándar ICHA: <strong>g = {selectedIchaProfile.gramil_mm} mm</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Configuration Inputs & ICHA Catalog Selector */}
          <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 relative flex flex-col justify-between">
             <div>
               <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                    <i className="fa-solid fa-sliders mr-2 text-bim-blue"></i> Dimensiones
                 </h3>
                 {selectedIchaProfile && (
                   <button
                     onClick={() => handleSelectIchaProfile("")}
                     className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                     title="Volver a dimensiones por defecto"
                   >
                     <i className="fa-solid fa-rotate-left mr-1"></i> Reset
                   </button>
                 )}
               </div>

               {/* Dropdown Selector para Perfiles ICHA de esta familia */}
               {availableIchaProfiles.length > 0 && (
                 <div className="mb-5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                   <label className="text-xs font-bold text-cyan-400 mb-1.5 flex items-center justify-between">
                     <span><i className="fa-solid fa-book-bookmark mr-1"></i> Perfil Estándar ICHA ({availableIchaProfiles.length}):</span>
                   </label>
                   <select
                     value={selectedIchaKey}
                     onChange={(e) => handleSelectIchaProfile(e.target.value)}
                     className="w-full bg-slate-900 border border-slate-700 hover:border-cyan-500 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
                   >
                     <option value="">— Seleccionar del Catálogo ICHA —</option>
                     {availableIchaProfiles.map((p) => (
                       <option key={`${p.seriesKey}-${p.designation}`} value={p.designation}>
                         {p.designation} ({p.weight} kg/m)
                       </option>
                     ))}
                   </select>
                   {selectedIchaProfile && isCustomized && (
                     <p className="text-[11px] text-amber-400 mt-1.5">
                       <i className="fa-solid fa-triangle-exclamation mr-1"></i> Has modificado las dimensiones originales de la norma.
                     </p>
                   )}
                 </div>
               )}

               {/* Inputs de dimensiones numéricas */}
               <div className="space-y-3.5">
                  {PROFILES[currentProfile]?.inputs.map(inp => (
                    <div key={inp.id}>
                      <label className="text-xs font-semibold text-slate-400 mb-1 block">{inp.label}</label>
                      <div className="flex items-center gap-2">
                          <input 
                             type="number" step="any" min="0"
                             value={inputValues[inp.id] !== undefined ? inputValues[inp.id] : inp.default}
                             onChange={e => handleInputChange(inp.id, e.target.value)}
                             className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-base focus:outline-none focus:border-bim-blue" />
                          <span className="text-xs text-slate-500 w-8">{inp.unit}</span>
                      </div>
                    </div>
                  ))}
               </div>

               {results && results.error && (
                  <div className="mt-4 p-3 rounded-lg bg-rose-900/30 border border-rose-500/50 text-rose-400 text-sm font-medium">
                     Ingresa solo valores numéricos positivos.
                  </div>
               )}
             </div>

             <div className="text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span>Densidad acero: <strong>7,850 kg/m³</strong></span>
                <span>Unidades: <strong>SI (Métrico)</strong></span>
             </div>
          </div>

          {/* Results Panel & Technical Sheet */}
          <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                 <i className="fa-solid fa-calculator mr-2 text-bim-blue"></i> Propiedades de Sección
              </h3>
              
              <div className="space-y-3 mb-5">
                 <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 flex justify-between items-center transition-colors hover:border-bim-blue/50">
                    <span className="text-slate-400 text-sm font-bold">Área sección</span>
                    <span className="text-xl font-bold text-white">
                       {results && !results.error ? results.area.toFixed(2) : "0.00"} <span className="text-xs text-slate-500">cm²</span>
                    </span>
                 </div>
                 <div className="bg-bim-blue/10 border border-bim-blue/30 rounded-xl p-3.5 flex justify-between items-center transition-colors hover:border-bim-blue/70 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <span className="text-slate-300 text-sm font-bold">Peso Lineal</span>
                    <span className="text-xl font-bold text-bim-blue">
                       {results && !results.error ? results.weight.toFixed(2) : "0.00"} <span className="text-xs text-slate-400">kg/m</span>
                    </span>
                 </div>
                 <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 flex justify-between items-center transition-colors hover:border-bim-blue/50">
                    <span className="text-slate-400 text-sm font-bold">Área Cobertura</span>
                    <span className="text-xl font-bold text-white">
                       {results && !results.error ? results.cover.toFixed(3) : "0.000"} <span className="text-xs text-slate-500">m²/m</span>
                    </span>
                 </div>
              </div>

              {/* Ficha Técnica Oficial ICHA (si hay perfil ICHA activo) */}
              {selectedIchaProfile && (
                <div className="mb-5 p-4 rounded-xl bg-slate-950/80 border border-cyan-900/60 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-certificate"></i> Ficha Oficial: {selectedIchaProfile.designation}
                    </span>
                    <Link
                      to="/herramientas/icha"
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1"
                    >
                      Ver en catálogo <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Ix (cm⁴)</div>
                      <div className="font-bold text-white">{selectedIchaProfile["Ix_cm⁴"] || "—"}</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Iy (cm⁴)</div>
                      <div className="font-bold text-white">{selectedIchaProfile["Iy_cm⁴"] || "—"}</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Wx (cm³)</div>
                      <div className="font-bold text-white">{selectedIchaProfile["Wx_cm³"] || "—"}</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Wy (cm³)</div>
                      <div className="font-bold text-white">{selectedIchaProfile["Wy_cm³"] || "—"}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick List Addition */}
            <div className="border-t border-slate-800 pt-4">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Agregar a Cubicación</h4>
               <div className="flex gap-2">
                  <input type="text" placeholder="Marca (ej. V-1)" value={quickMark} onChange={e=>setQuickMark(e.target.value)} className="w-1/3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
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
                 className="w-full mt-3 bg-bim-blue hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                 <i className="fa-solid fa-plus mr-2"></i> Añadir a Tabla de Cubicación
               </button>
            </div>
          </div>
        </div>

        {/* List Section */}
        {list.length > 0 && (
          <div className="mt-8 bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4 flex-wrap gap-3">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                 <i className="fa-solid fa-list-check mr-2 text-bim-blue"></i> Resumen de Cubicación de Perfiles ({list.length})
              </h3>
              <div className="flex gap-2">
                  <button onClick={exportToExcel} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow hover:shadow-emerald-500/20 flex items-center gap-1.5">
                     <i className="fa-solid fa-file-excel"></i> Exportar Excel (.xlsx)
                  </button>
                  <button onClick={exportToPDF} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow hover:shadow-rose-500/20 flex items-center gap-1.5">
                     <i className="fa-solid fa-file-pdf"></i> PDF
                  </button>
                  <button onClick={clearList} className="bg-slate-800 hover:bg-slate-700 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                     Limpiar Todo
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
                      <th className="py-3 px-4 text-center">Norma</th>
                      <th className="py-3 px-4 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {list.map(item => (
                       <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-white">{item.mark}</td>
                          <td className="py-3 px-4 text-center font-mono">{item.qty}</td>
                          <td className="py-3 px-4 font-semibold text-cyan-300">{item.profile}</td>
                          <td className="py-3 px-4 text-right font-mono">{item.length.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-mono">{item.weightUnit.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-bold text-white font-mono text-base">{item.weightTotal.toFixed(2)}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.isIcha ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                              {item.isIcha ? 'ICHA' : 'Custom'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                             <button onClick={() => deleteFromList(item.id)} className="text-slate-500 hover:text-rose-400 transition-colors" title="Eliminar fila">
                               <i className="fa-solid fa-trash-can"></i>
                             </button>
                          </td>
                       </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-700 bg-slate-800/10">
                      <td colSpan="5" className="py-2.5 px-4 text-right font-medium text-slate-400">
                         Subtotal Peso Estructural
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-white font-mono">
                         {subtotalWeight.toFixed(2)} <span className="text-xs font-normal text-slate-500">kg</span>
                      </td>
                      <td colSpan="2"></td>
                    </tr>
                    <tr className="border-t border-slate-800 bg-slate-800/20">
                      <td colSpan="5" className="py-2.5 px-4 text-right">
                         <div className="flex items-center justify-end gap-2 text-slate-400">
                            <span className="font-medium text-xs">Margen Conexiones / Despunte:</span>
                            <input
                              type="number"
                              min="0"
                              max="50"
                              step="0.5"
                              value={extraPct}
                              onChange={(e) => setExtraPct(parseFloat(e.target.value) || 0)}
                              className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white text-center font-mono focus:border-cyan-400 focus:outline-none"
                            />
                            <span className="text-xs font-bold text-cyan-400">%</span>
                         </div>
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-cyan-300 font-mono">
                         +{extraWeight.toFixed(2)} <span className="text-xs font-normal text-slate-500">kg</span>
                      </td>
                      <td colSpan="2"></td>
                    </tr>
                    <tr className="border-t-2 border-slate-700 bg-slate-900/80">
                      <td colSpan="5" className="py-4 px-4 text-right font-black text-emerald-400 uppercase">
                         Peso Total Estimado
                      </td>
                      <td className="py-4 px-4 text-right font-black text-emerald-400 text-xl font-mono">
                         {grandTotal.toFixed(2)} <span className="text-xs font-normal text-slate-400">kg</span>
                         <span className="block text-xs text-slate-400 font-semibold font-mono">({(grandTotal / 1000).toFixed(3)} Ton)</span>
                      </td>
                      <td colSpan="2"></td>
                    </tr>
                  </tfoot>
               </table>
            </div>
          </div>
        )}

      </div>

      {/* Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <Link to="/herramientas" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors group">
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Volver a Herramientas
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span>Instituto Chileno del Acero (ICHA)</span>
          <span>·</span>
          <span>NCh427 / ASTM</span>
        </div>
      </div>
    </div>
  );
}
