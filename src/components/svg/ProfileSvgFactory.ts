/**
 * Factory Method & Helper de Geometría SVG para Secciones Estructurales
 * Centraliza la generación técnica SVG de perfiles ICHA, AISC y Calculadora Paramétrica.
 */

export const CANVAS_SIZE = 240;
export const CANVAS_CENTER = CANVAS_SIZE / 2;
export const CANVAS_PADDING = 45;

export interface DimLineOptions {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly label: string;
  readonly offset?: number;
  readonly color?: string;
  readonly canvasSize?: number;
}

export function dimLine(
  x1OrOpts: number | DimLineOptions,
  y1?: number,
  x2?: number,
  y2?: number,
  label?: string,
  offset = 0,
  color = "#60a5fa",
  canvasSize = CANVAS_SIZE
): string {
  let finalX1: number;
  let finalY1: number;
  let finalX2: number;
  let finalY2: number;
  let finalLabel: string;
  let finalOffset = offset;
  let finalColor = color;
  let finalSize = canvasSize;

  if (typeof x1OrOpts === "object" && x1OrOpts !== null) {
    finalX1 = x1OrOpts.x1;
    finalY1 = x1OrOpts.y1;
    finalX2 = x1OrOpts.x2;
    finalY2 = x1OrOpts.y2;
    finalLabel = x1OrOpts.label;
    finalOffset = x1OrOpts.offset ?? 0;
    finalColor = x1OrOpts.color ?? "#60a5fa";
    finalSize = x1OrOpts.canvasSize ?? CANVAS_SIZE;
  } else {
    finalX1 = typeof x1OrOpts === "number" ? x1OrOpts : 0;
    finalY1 = y1 ?? 0;
    finalX2 = x2 ?? 0;
    finalY2 = y2 ?? 0;
    finalLabel = label ?? "";
  }

  const isVertical = Math.abs(finalX1 - finalX2) < 2;
  const offsetX = isVertical ? finalOffset : 0;
  const offsetY = isVertical ? 0 : finalOffset;
  const midX = (finalX1 + finalX2) / 2 + offsetX;
  const midY = (finalY1 + finalY2) / 2 + offsetY;

  const textOffsetX = isVertical ? (finalOffset > 0 ? 8 : -8) : 0;
  const textOffsetY = isVertical ? 0 : finalOffset > 0 ? 12 : -6;

  const targetX = Math.max(24, Math.min(finalSize - 24, midX + textOffsetX));
  const targetY = Math.max(10, Math.min(finalSize - 4, midY + textOffsetY));

  return `<line x1="${finalX1 + offsetX}" y1="${finalY1 + offsetY}" x2="${finalX2 + offsetX}" y2="${finalY2 + offsetY}" stroke="${finalColor}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.7"/>
          <text x="${targetX}" y="${targetY}" fill="${finalColor}" font-size="10" font-family="Inter, sans-serif" font-weight="600" text-anchor="middle">${finalLabel}</text>`;
}

// ------------------------- H / I SECTION -------------------------

export interface HSectionConfig {
  readonly h: number;
  readonly b: number;
  readonly s: number;
  readonly t1: number;
  readonly t2?: number;
  readonly isUnequal?: boolean;
  readonly b1?: number;
  readonly b2?: number;
  readonly gramil?: number | null;
  readonly unitSuffix?: string;
  readonly labelH?: string;
  readonly labelB?: string;
  readonly labelS?: string;
  readonly labelT?: string;
  readonly canvasSize?: number;
}

export function buildHSvg(
  configOrH: number | HSectionConfig,
  bArg?: number,
  sArg?: number,
  t1Arg?: number,
  t2Arg?: number,
  unequalArg = false,
  b1Arg?: number | null,
  b2Arg?: number | null,
  gramilArg: number | null = null
): string {
  let cfg: HSectionConfig;
  if (typeof configOrH === "object" && configOrH !== null) {
    cfg = configOrH;
  } else {
    cfg = {
      h: typeof configOrH === "number" ? configOrH : 200,
      b: bArg ?? 100,
      s: sArg ?? 6,
      t1: t1Arg ?? 10,
      t2: t2Arg ?? t1Arg ?? 10,
      isUnequal: unequalArg,
      b1: b1Arg ?? bArg ?? 100,
      b2: b2Arg ?? bArg ?? 100,
      gramil: gramilArg,
    };
  }

  const canvasSize = cfg.canvasSize ?? CANVAS_SIZE;
  const bTop = cfg.isUnequal && cfg.b1 ? cfg.b1 : cfg.b;
  const bBot = cfg.isUnequal && cfg.b2 ? cfg.b2 : cfg.b;
  const maxB = Math.max(bTop, bBot);
  const scale = Math.min((canvasSize - 2 * CANVAS_PADDING) / cfg.h, (canvasSize - 2 * CANVAS_PADDING) / maxB);

  const H = cfg.h * scale;
  const B1 = bTop * scale;
  const B2 = bBot * scale;
  const S = Math.max(cfg.s * scale, 4);
  const T1 = Math.max(cfg.t1 * scale, 4);
  const T2 = Math.max((cfg.t2 ?? cfg.t1) * scale, 4);
  const cx = canvasSize / 2;
  const cy = canvasSize / 2;
  const unitSuffix = cfg.unitSuffix ?? "";

  const points = [
    `${cx - B1 / 2},${cy - H / 2}`,
    `${cx + B1 / 2},${cy - H / 2}`,
    `${cx + B1 / 2},${cy - H / 2 + T1}`,
    `${cx + S / 2},${cy - H / 2 + T1}`,
    `${cx + S / 2},${cy + H / 2 - T2}`,
    `${cx + B2 / 2},${cy + H / 2 - T2}`,
    `${cx + B2 / 2},${cy + H / 2}`,
    `${cx - B2 / 2},${cy + H / 2}`,
    `${cx - B2 / 2},${cy + H / 2 - T2}`,
    `${cx - S / 2},${cy + H / 2 - T2}`,
    `${cx - S / 2},${cy - H / 2 + T1}`,
    `${cx - B1 / 2},${cy - H / 2 + T1}`,
  ].join(" ");

  const shape = `<polygon points="${points}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;

  let dims = dimLine({
    x1: cx - B1 / 2,
    y1: cy - H / 2,
    x2: cx - B1 / 2,
    y2: cy + H / 2,
    label: `${cfg.labelH ?? "h"}=${cfg.h}${unitSuffix}`,
    offset: -22,
    canvasSize,
  });

  const bottomLabel = cfg.isUnequal ? `b°=${bBot}${unitSuffix}` : `${cfg.labelB ?? "b"}=${cfg.b}${unitSuffix}`;
  dims += dimLine({
    x1: cx - B1 / 2,
    y1: cy + H / 2,
    x2: cx + B2 / 2,
    y2: cy + H / 2,
    label: bottomLabel,
    offset: 18,
    canvasSize,
  });

  dims += `<text x="${cx + S / 2 + 6}" y="${cy + 4}" fill="#60a5fa" font-size="9" font-family="Inter, sans-serif" font-weight="600">${cfg.labelS ?? "s"}=${cfg.s}${unitSuffix}</text>`;

  if (cfg.isUnequal) {
    dims += dimLine({
      x1: cx - B1 / 2,
      y1: cy - H / 2,
      x2: cx + B1 / 2,
      y2: cy - H / 2,
      label: `b1=${cfg.b1}${unitSuffix}`,
      offset: -14,
      canvasSize,
    });
    dims += `<text x="${cx + B1 / 2 + 6}" y="${cy - H / 2 + T1 / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter, sans-serif" font-weight="600">t1=${cfg.t1}${unitSuffix}</text>`;
    dims += `<text x="${cx + B2 / 2 + 6}" y="${cy + H / 2 - T2 / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter, sans-serif" font-weight="600">t2=${cfg.t2 ?? cfg.t1}${unitSuffix}</text>`;
  } else {
    dims += `<text x="${cx + B1 / 2 + 6}" y="${cy - H / 2 + T1 / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter, sans-serif" font-weight="600">${cfg.labelT ?? "t"}=${cfg.t1}${unitSuffix}</text>`;
  }

  let gramilSvg = "";
  if (cfg.gramil && cfg.gramil > 0) {
    const G = cfg.gramil * scale;
    gramilSvg += `<line x1="${cx - G / 2}" y1="${cy - H / 2}" x2="${cx - G / 2}" y2="${cy + H / 2}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<line x1="${cx + G / 2}" y1="${cy - H / 2}" x2="${cx + G / 2}" y2="${cy + H / 2}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<circle cx="${cx - G / 2}" cy="${cy - H / 2 + T1 / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<circle cx="${cx + G / 2}" cy="${cy - H / 2 + T1 / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<circle cx="${cx - G / 2}" cy="${cy + H / 2 - T2 / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<circle cx="${cx + G / 2}" cy="${cy + H / 2 - T2 / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<text x="${cx}" y="${cy - H / 2 - 8}" fill="#f97316" font-size="8" font-family="Inter, sans-serif" font-weight="600" text-anchor="middle">g=${cfg.gramil}</text>`;
  }

  return `<svg viewBox="0 0 ${canvasSize} ${canvasSize}" class="w-full h-full max-w-[240px]">${shape}${dims}${gramilSvg}</svg>`;
}

// ------------------------- T SECTION -------------------------

export function buildTSvg(
  vOrH: Record<string, number> | number,
  bArg?: number,
  sArg?: number,
  tArg?: number,
  unitSuffix = "",
  canvasSize = CANVAS_SIZE
): string {
  const h = typeof vOrH === "object" ? vOrH.h : vOrH;
  const b = typeof vOrH === "object" ? vOrH.b : bArg ?? 100;
  const s = typeof vOrH === "object" ? vOrH.s : sArg ?? 6;
  const t = typeof vOrH === "object" ? vOrH.t : tArg ?? 10;

  const scale = Math.min((canvasSize - 2 * CANVAS_PADDING) / h, (canvasSize - 2 * CANVAS_PADDING) / b);
  const H = h * scale;
  const B = b * scale;
  const T = Math.max(t * scale, 4);
  const S = Math.max(s * scale, 4);
  const cx = canvasSize / 2;
  const top = canvasSize / 2 - H / 2;

  const points = [
    `${cx - B / 2},${top}`,
    `${cx + B / 2},${top}`,
    `${cx + B / 2},${top + T}`,
    `${cx + S / 2},${top + T}`,
    `${cx + S / 2},${top + H}`,
    `${cx - S / 2},${top + H}`,
    `${cx - S / 2},${top + T}`,
    `${cx - B / 2},${top + T}`,
  ].join(" ");

  const shape = `<polygon points="${points}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;

  let dims = dimLine({
    x1: cx - B / 2,
    y1: top,
    x2: cx - B / 2,
    y2: top + H,
    label: `h=${h}${unitSuffix}`,
    offset: -22,
    canvasSize,
  });

  dims += dimLine({
    x1: cx - B / 2,
    y1: top,
    x2: cx + B / 2,
    y2: top,
    label: `b=${b}${unitSuffix}`,
    offset: -14,
    canvasSize,
  });

  dims += `<text x="${cx + B / 2 + 6}" y="${top + T / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter, sans-serif" font-weight="600">t=${t}${unitSuffix}</text>`;
  dims += `<text x="${cx + S / 2 + 6}" y="${top + T + 20}" fill="#60a5fa" font-size="9" font-family="Inter, sans-serif" font-weight="600">s=${s}${unitSuffix}</text>`;

  return `<svg viewBox="0 0 ${canvasSize} ${canvasSize}" class="w-full h-full max-w-[240px]">${shape}${dims}</svg>`;
}

// ------------------------- C CHANNEL -------------------------

export function buildCSvg(
  vOrH: Record<string, number> | number,
  unequalOrB?: boolean | number,
  gramilOrS?: number | null,
  tArg?: number,
  unitSuffix = "",
  canvasSize = CANVAS_SIZE
): string {
  let h: number;
  let b: number;
  let t: number;
  let isUnequal = false;
  let b1 = 75;
  let b2 = 75;
  let gramil: number | null = null;

  if (typeof vOrH === "object") {
    h = vOrH.h;
    b = vOrH.b || 50;
    t = vOrH.t || 6;
    isUnequal = Boolean(unequalOrB);
    b1 = vOrH.b1 || b;
    b2 = vOrH.b2 || b;
    gramil = (gramilOrS as number | null) ?? null;
  } else {
    h = vOrH;
    b = typeof unequalOrB === "number" ? unequalOrB : 50;
    t = tArg ?? 6;
    gramil = (gramilOrS as number | null) ?? null;
  }

  const bVal = isUnequal ? Math.max(b1, b2) : b;
  const scale = Math.min((canvasSize - 2 * CANVAS_PADDING) / h, (canvasSize - 2 * CANVAS_PADDING) / (bVal * 2));
  const H = h * scale;
  const B = bVal * scale;
  const T = Math.max(t * scale, 3);
  const cx = canvasSize / 2;
  const top = canvasSize / 2 - H / 2;

  const points = `${cx - B},${top} ${cx},${top} ${cx},${top + T} ${cx - B + T},${top + T} ${cx - B + T},${top + H - T} ${cx},${top + H - T} ${cx},${top + H} ${cx - B},${top + H}`;
  const shape = `<polygon points="${points}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;

  let dims = dimLine({
    x1: cx + 4,
    y1: top,
    x2: cx + 4,
    y2: top + H,
    label: `h=${h}${unitSuffix}`,
    offset: 14,
    canvasSize,
  });

  if (isUnequal) {
    dims += dimLine({
      x1: cx - B,
      y1: top,
      x2: cx,
      y2: top,
      label: `b1=${b1}${unitSuffix}`,
      offset: -14,
      canvasSize,
    });
    dims += dimLine({
      x1: cx - B,
      y1: top + H,
      x2: cx,
      y2: top + H,
      label: `b2=${b2}${unitSuffix}`,
      offset: 16,
      canvasSize,
    });
  } else {
    dims += dimLine({
      x1: cx - B,
      y1: top + H,
      x2: cx,
      y2: top + H,
      label: `b=${b}${unitSuffix}`,
      offset: 16,
      canvasSize,
    });
  }

  dims += `<text x="${cx + 6}" y="${top + T + 12}" fill="#60a5fa" font-size="9" font-family="Inter, sans-serif" font-weight="600">t=${t}${unitSuffix}</text>`;

  let gramilSvg = "";
  if (gramil && gramil > 0) {
    const G = gramil * scale;
    gramilSvg += `<line x1="${cx - G}" y1="${top}" x2="${cx - G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<circle cx="${cx - G}" cy="${top + T / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<circle cx="${cx - G}" cy="${top + H - T / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<text x="${cx - G - 6}" y="${top + H / 2 + 4}" fill="#f97316" font-size="8" font-family="Inter, sans-serif" font-weight="600" text-anchor="end">g=${gramil}</text>`;
  }

  return `<svg viewBox="0 0 ${canvasSize} ${canvasSize}" class="w-full h-full max-w-[240px]">${shape}${dims}${gramilSvg}</svg>`;
}

// ------------------------- CA STIFFENED CHANNEL -------------------------

export function buildCASvg(
  v: Record<string, number>,
  gramil: number | null = null,
  unitSuffix = "",
  canvasSize = CANVAS_SIZE
): string {
  const h = v.h;
  const b = v.b || 50;
  const t = v.t || 5;
  const c = v.c || 0;

  const scale = Math.min((canvasSize - 2 * CANVAS_PADDING) / h, (canvasSize - 2 * CANVAS_PADDING) / (b * 2 || 100));
  const H = h * scale;
  const B = Math.max(b * scale, 8);
  const T = Math.max(t * scale, 3);
  const C = c ? Math.max(c * scale, 4) : 0;
  const left = canvasSize / 2 - B / 2;
  const top = canvasSize / 2 - H / 2;

  let points: string;
  if (C > 0) {
    points = `${left},${top} ${left + B},${top} ${left + B},${top + C} ${left + B - T},${top + C} ${left + B - T},${top + T} ${left + T},${top + T} ${left + T},${top + H - T} ${left + B - T},${top + H - T} ${left + B - T},${top + H - C} ${left + B},${top + H - C} ${left + B},${top + H} ${left},${top + H}`;
  } else {
    points = `${left},${top} ${left + B},${top} ${left + B},${top + T} ${left + T},${top + T} ${left + T},${top + H - T} ${left + B},${top + H - T} ${left + B},${top + H} ${left},${top + H}`;
  }

  const shape = `<polygon points="${points}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;

  let dims = dimLine({
    x1: left + B + 4,
    y1: top,
    x2: left + B + 4,
    y2: top + H,
    label: `h=${h}${unitSuffix}`,
    offset: 16,
    canvasSize,
  });

  dims += dimLine({
    x1: left,
    y1: top + H,
    x2: left + B,
    y2: top + H,
    label: `b=${b}${unitSuffix}`,
    offset: 16,
    canvasSize,
  });

  dims += `<text x="${left + B + 6}" y="${top + T / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter, sans-serif" font-weight="600">t=${t}${unitSuffix}</text>`;

  if (C > 0) {
    dims += `<text x="${left + B + 6}" y="${top + H - C / 2 + 3}" fill="#60a5fa" font-size="9" font-family="Inter, sans-serif" font-weight="600">c=${c}${unitSuffix}</text>`;
  }

  let gramilSvg = "";
  if (gramil && gramil > 0) {
    const G = gramil * scale;
    gramilSvg += `<line x1="${left + G}" y1="${top}" x2="${left + G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<circle cx="${left + G}" cy="${top + T / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<circle cx="${left + G}" cy="${top + H - T / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<text x="${left + G + 6}" y="${top + H / 2 + 4}" fill="#f97316" font-size="8" font-family="Inter, sans-serif" font-weight="600">g=${gramil}</text>`;
  }

  return `<svg viewBox="0 0 ${canvasSize} ${canvasSize}" class="w-full h-full max-w-[240px]">${shape}${dims}${gramilSvg}</svg>`;
}

// ------------------------- ICA DOUBLE STIFFENED CHANNEL -------------------------

export function buildICASvg(
  v: Record<string, number>,
  gramil: number | null = null,
  unitSuffix = "",
  canvasSize = CANVAS_SIZE
): string {
  const h = v.h;
  const b = v.b || 100;
  const t = v.t || 5;
  const c = v.c || 0;
  const bw = b / 2;

  const scale = Math.min((canvasSize - 2 * CANVAS_PADDING) / h, (canvasSize - 2 * CANVAS_PADDING) / b);
  const H = h * scale;
  const T = Math.max(t * scale, 3);
  const BW = bw * scale;
  const C = Math.max(c * scale, 4);
  const cx = canvasSize / 2;
  const top = canvasSize / 2 - H / 2;

  const points = `0,0 ${BW},0 ${BW},${C} ${BW - T},${C} ${BW - T},${T} ${T},${T} ${T},${H - T} ${BW - T},${H - T} ${BW - T},${H - C} ${BW},${H - C} ${BW},${H} 0,${H}`;
  const shape = `<g transform="translate(${cx}, ${top})">
                   <polygon points="${points}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>
                 </g>
                 <g transform="translate(${cx}, ${top}) scale(-1, 1)">
                   <polygon points="${points}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>
                 </g>`;

  let dims = dimLine({
    x1: cx - BW,
    y1: top,
    x2: cx - BW,
    y2: top + H,
    label: `h=${h}${unitSuffix}`,
    offset: -20,
    canvasSize,
  });

  dims += dimLine({
    x1: cx - BW,
    y1: top + H + 12,
    x2: cx + BW,
    y2: top + H + 12,
    label: `b=${b}${unitSuffix}`,
    offset: 16,
    canvasSize,
  });

  dims += `<text x="${cx - T - 6}" y="${top + T + 12}" fill="#60a5fa" font-size="9" font-family="Inter, sans-serif" font-weight="600" text-anchor="end">t=${t}${unitSuffix}</text>`;

  if (c > 0) {
    dims += `<text x="${cx - BW - 6}" y="${top + H - C + 3}" fill="#60a5fa" font-size="9" font-family="Inter, sans-serif" font-weight="600" text-anchor="end">c=${c}${unitSuffix}</text>`;
  }

  let gramilSvg = "";
  if (gramil && gramil > 0) {
    const G = gramil * scale;
    gramilSvg += `<line x1="${cx - G}" y1="${top}" x2="${cx - G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<line x1="${cx + G}" y1="${top}" x2="${cx + G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<circle cx="${cx - G}" cy="${top + T / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<circle cx="${cx + G}" cy="${top + T / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<circle cx="${cx - G}" cy="${top + H - T / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<circle cx="${cx + G}" cy="${top + H - T / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<text x="${cx + G + 6}" y="${top + H / 2 + 4}" fill="#f97316" font-size="8" font-family="Inter, sans-serif" font-weight="600">g=${gramil}</text>`;
  }

  return `<svg viewBox="0 0 ${canvasSize} ${canvasSize}" class="w-full h-full max-w-[240px]">${shape}${dims}${gramilSvg}</svg>`;
}

// ------------------------- IC DOUBLE CHANNEL -------------------------

export function buildICSvg(
  v: Record<string, number>,
  gramil: number | null = null,
  unitSuffix = "",
  canvasSize = CANVAS_SIZE
): string {
  const h = v.h;
  const b = v.b || 100;
  const t = v.t || 6;
  const bc = b / 2;

  const scale = Math.min((canvasSize - 2 * CANVAS_PADDING) / h, (canvasSize - 2 * CANVAS_PADDING) / b);
  const H = h * scale;
  const T = Math.max(t * scale, 3);
  const BW = bc * scale;
  const cx = canvasSize / 2;
  const top = canvasSize / 2 - H / 2;

  const pointsLeft = `${cx - BW},${top} ${cx},${top} ${cx},${top + H} ${cx - BW},${top + H} ${cx - BW},${top + H - T} ${cx - T},${top + H - T} ${cx - T},${top + T} ${cx - BW},${top + T}`;
  const pointsRight = `${cx},${top} ${cx + BW},${top} ${cx + BW},${top + T} ${cx + T},${top + T} ${cx + T},${top + H - T} ${cx + BW},${top + H - T} ${cx + BW},${top + H} ${cx},${top + H}`;

  const shape = `<polygon points="${pointsLeft}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>
                 <polygon points="${pointsRight}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;

  let dims = dimLine({
    x1: cx - BW,
    y1: top,
    x2: cx - BW,
    y2: top + H,
    label: `h=${h}${unitSuffix}`,
    offset: -20,
    canvasSize,
  });

  dims += dimLine({
    x1: cx - BW,
    y1: top + H + 12,
    x2: cx + BW,
    y2: top + H + 12,
    label: `b=${b}${unitSuffix}`,
    offset: 16,
    canvasSize,
  });

  dims += `<text x="${cx - T - 6}" y="${top + T + 12}" fill="#60a5fa" font-size="9" font-family="Inter, sans-serif" font-weight="600" text-anchor="end">t=${t}${unitSuffix}</text>`;

  let gramilSvg = "";
  if (gramil && gramil > 0) {
    const G = gramil * scale;
    gramilSvg += `<line x1="${cx - G}" y1="${top}" x2="${cx - G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<line x1="${cx + G}" y1="${top}" x2="${cx + G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<circle cx="${cx - G}" cy="${top + T / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<circle cx="${cx + G}" cy="${top + T / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<circle cx="${cx - G}" cy="${top + H - T / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<circle cx="${cx + G}" cy="${top + H - T / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<text x="${cx + G + 6}" y="${top + H / 2 + 4}" fill="#f97316" font-size="8" font-family="Inter, sans-serif" font-weight="600">g=${gramil}</text>`;
  }

  return `<svg viewBox="0 0 ${canvasSize} ${canvasSize}" class="w-full h-full max-w-[240px]">${shape}${dims}${gramilSvg}</svg>`;
}

// ------------------------- L SINGLE ANGLE -------------------------

export function buildLSvg(
  v: Record<string, number>,
  gramil: number | null = null,
  unitSuffix = "",
  canvasSize = CANVAS_SIZE
): string {
  const h = v.h;
  const b = v.b;
  const t = v.t || 6;

  const maxDim = Math.max(h, b);
  const scale = (canvasSize - 2 * CANVAS_PADDING) / maxDim;
  const H = h * scale;
  const B = b * scale;
  const T = Math.max(t * scale, 3);
  const x = canvasSize / 2 - B / 2;
  const top = canvasSize / 2 - H / 2;

  const points = `${x},${top} ${x + T},${top} ${x + T},${top + H - T} ${x + B},${top + H - T} ${x + B},${top + H} ${x},${top + H}`;
  const shape = `<polygon points="${points}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;

  let dims = dimLine({
    x1: x,
    y1: top,
    x2: x,
    y2: top + H,
    label: `h=${h}${unitSuffix}`,
    offset: -20,
    canvasSize,
  });

  dims += dimLine({
    x1: x,
    y1: top + H,
    x2: x + B,
    y2: top + H,
    label: `b=${b}${unitSuffix}`,
    offset: 16,
    canvasSize,
  });

  dims += `<text x="${x + T + 6}" y="${top + 20}" fill="#60a5fa" font-size="9" font-family="Inter, sans-serif" font-weight="600">t=${t}${unitSuffix}</text>`;

  let gramilSvg = "";
  if (gramil && gramil > 0) {
    const G = gramil * scale;
    gramilSvg += `<line x1="${x + G}" y1="${top}" x2="${x + G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<line x1="${x}" y1="${top + H - G}" x2="${x + B}" y2="${top + H - G}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<circle cx="${x + G}" cy="${top + H - G}" r="2" fill="#f97316"/>`;
    gramilSvg += `<text x="${x + G + 6}" y="${top + H - G - 4}" fill="#f97316" font-size="8" font-family="Inter, sans-serif" font-weight="600">g=${gramil}</text>`;
  }

  return `<svg viewBox="0 0 ${canvasSize} ${canvasSize}" class="w-full h-full max-w-[240px]">${shape}${dims}${gramilSvg}</svg>`;
}

// ------------------------- TL DOUBLE ANGLE -------------------------

export function buildTLSvg(
  v: Record<string, number>,
  gramil: number | null = null,
  unitSuffix = "",
  canvasSize = CANVAS_SIZE
): string {
  const h = v.h;
  const b = v.b || 100;
  const t = v.t || 8;
  const bw = b / 2;

  const maxDim = Math.max(h, b);
  const scale = (canvasSize - 2 * CANVAS_PADDING) / maxDim;
  const H = h * scale;
  const T = Math.max(t * scale, 3);
  const BW = bw * scale;
  const gap = 4;
  const cx = canvasSize / 2;
  const leftL_right = cx - gap / 2;
  const rightL_left = cx + gap / 2;
  const top = canvasSize / 2 - H / 2;

  const pointsLeft = `${leftL_right - BW},${top + H - T} ${leftL_right - T},${top + H - T} ${leftL_right - T},${top} ${leftL_right},${top} ${leftL_right},${top + H} ${leftL_right - BW},${top + H}`;
  const pointsRight = `${rightL_left},${top} ${rightL_left + T},${top} ${rightL_left + T},${top + H - T} ${rightL_left + BW},${top + H - T} ${rightL_left + BW},${top + H} ${rightL_left},${top + H}`;

  const shape = `<polygon points="${pointsLeft}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>
                 <polygon points="${pointsRight}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>`;

  let dims = dimLine({
    x1: leftL_right - BW,
    y1: top,
    x2: leftL_right - BW,
    y2: top + H,
    label: `h=${h}${unitSuffix}`,
    offset: -20,
    canvasSize,
  });

  dims += dimLine({
    x1: leftL_right - BW,
    y1: top + H,
    x2: rightL_left + BW,
    y2: top + H,
    label: `b=${b}${unitSuffix}`,
    offset: 16,
    canvasSize,
  });

  dims += `<text x="${leftL_right - T - 6}" y="${top + 20}" fill="#60a5fa" font-size="9" font-family="Inter, sans-serif" font-weight="600" text-anchor="end">t=${t}${unitSuffix}</text>`;

  let gramilSvg = "";
  if (gramil && gramil > 0) {
    const G = gramil * scale;
    gramilSvg += `<line x1="${leftL_right - BW}" y1="${top + H - G}" x2="${rightL_left + BW}" y2="${top + H - G}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<line x1="${leftL_right - G}" y1="${top}" x2="${leftL_right - G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<line x1="${rightL_left + G}" y1="${top}" x2="${rightL_left + G}" y2="${top + H}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<circle cx="${leftL_right - G}" cy="${top + H - G}" r="2" fill="#f97316"/>`;
    gramilSvg += `<circle cx="${rightL_left + G}" cy="${top + H - G}" r="2" fill="#f97316"/>`;
    gramilSvg += `<text x="${rightL_left + G + 6}" y="${top + H - G - 4}" fill="#f97316" font-size="8" font-family="Inter, sans-serif" font-weight="600">g=${gramil}</text>`;
  }

  return `<svg viewBox="0 0 ${canvasSize} ${canvasSize}" class="w-full h-full max-w-[240px]">${shape}${dims}${gramilSvg}</svg>`;
}

// ------------------------- XL STAR ANGLE -------------------------

export function buildXLSvg(
  v: Record<string, number>,
  gramil: number | null = null,
  unitSuffix = "",
  canvasSize = CANVAS_SIZE
): string {
  const h = v.h;
  const b = v.b;
  const t = v.t || 4;

  const totalMax = Math.max(h, b);
  const scale = (canvasSize - 2 * CANVAS_PADDING) / totalMax;
  const H_half = (h / 2) * scale;
  const B_half = (b / 2) * scale;
  const T = Math.max(t * scale, 3);
  const cx = canvasSize / 2;
  const cy = canvasSize / 2;

  const aPts = `${cx},${cy} ${cx},${cy - H_half} ${cx - T},${cy - H_half} ${cx - T},${cy - T} ${cx - B_half},${cy - T} ${cx - B_half},${cy}`;
  const bPts = `${cx},${cy} ${cx},${cy + H_half} ${cx + T},${cy + H_half} ${cx + T},${cy + T} ${cx + B_half},${cy + T} ${cx + B_half},${cy}`;

  const axes = `<line x1="${cx}" y1="${CANVAS_PADDING}" x2="${cx}" y2="${canvasSize - CANVAS_PADDING}" stroke="#475569" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.5"/>
                <line x1="${CANVAS_PADDING}" y1="${cy}" x2="${canvasSize - CANVAS_PADDING}" y2="${cy}" stroke="#475569" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.5"/>`;

  const shape = `${axes}
                <polygon points="${aPts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2" stroke-linejoin="round"/>
                <polygon points="${bPts}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2" stroke-linejoin="round"/>`;

  let dims = dimLine({
    x1: cx - B_half - 12,
    y1: cy - H_half,
    x2: cx - B_half - 12,
    y2: cy + H_half,
    label: `h=${h}${unitSuffix}`,
    offset: -18,
    canvasSize,
  });

  dims += dimLine({
    x1: cx - B_half,
    y1: cy + H_half + 12,
    x2: cx + B_half,
    y2: cy + H_half + 12,
    label: `b=${b}${unitSuffix}`,
    offset: 16,
    canvasSize,
  });

  dims += `<text x="${cx - B_half + 6}" y="${cy - H_half + 14}" fill="#60a5fa" font-size="9" font-family="Inter, sans-serif" font-weight="600">t=${t}${unitSuffix}</text>`;

  let gramilSvg = "";
  if (gramil && gramil > 0) {
    const G = gramil * scale;
    gramilSvg += `<line x1="${cx - G}" y1="${cy - H_half}" x2="${cx - G}" y2="${cy}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<line x1="${cx - B_half}" y1="${cy - G}" x2="${cx}" y2="${cy - G}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<line x1="${cx + G}" y1="${cy}" x2="${cx + G}" y2="${cy + H_half}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<line x1="${cx}" y1="${cy + G}" x2="${cx + B_half}" y2="${cy + G}" stroke="#f97316" stroke-width="0.8" stroke-dasharray="4,2" opacity="0.6"/>`;
    gramilSvg += `<circle cx="${cx - G}" cy="${cy - T / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<circle cx="${cx - T / 2}" cy="${cy - G}" r="2" fill="#f97316"/>`;
    gramilSvg += `<circle cx="${cx + G}" cy="${cy + T / 2}" r="2" fill="#f97316"/>`;
    gramilSvg += `<circle cx="${cx + T / 2}" cy="${cy + G}" r="2" fill="#f97316"/>`;
    gramilSvg += `<text x="${cx + G + 6}" y="${cy + H_half - 4}" fill="#f97316" font-size="8" font-family="Inter, sans-serif" font-weight="600">g=${gramil}</text>`;
  }

  return `<svg viewBox="0 0 ${canvasSize} ${canvasSize}" class="w-full h-full max-w-[240px]">${shape}${dims}${gramilSvg}</svg>`;
}

// ------------------------- TUBES / BOX / PLATES -------------------------

export function buildTubeSvg(
  v: Record<string, number>,
  unitSuffix = "",
  canvasSize = CANVAS_SIZE
): string {
  const h = v.h;
  const b = v.b;
  const t = v.t || 5;

  const scale = Math.min((canvasSize - 2 * CANVAS_PADDING) / h, (canvasSize - 2 * CANVAS_PADDING) / b);
  const H = h * scale;
  const B = b * scale;
  const T = Math.max(t * scale, 3);
  const cx = canvasSize / 2;
  const cy = canvasSize / 2;
  const x = cx - B / 2;
  const y = cy - H / 2;

  const outer = `<rect x="${x}" y="${y}" width="${B}" height="${H}" fill="none" stroke="#3b82f6" stroke-width="2" rx="3"/>`;
  const inner = `<rect x="${x + T}" y="${y + T}" width="${B - 2 * T}" height="${H - 2 * T}" fill="rgba(11,18,32,0.9)" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,2" rx="1"/>`;
  const fill = `<rect x="${x}" y="${y}" width="${B}" height="${H}" fill="rgba(59,130,246,0.12)" rx="3"/>`;
  const innerClear = `<rect x="${x + T}" y="${y + T}" width="${B - 2 * T}" height="${H - 2 * T}" fill="rgba(11,18,32,0.85)" rx="1"/>`;

  let dims = dimLine({
    x1: x,
    y1: y,
    x2: x,
    y2: y + H,
    label: `h=${h}${unitSuffix}`,
    offset: -22,
    canvasSize,
  });

  dims += dimLine({
    x1: x,
    y1: y + H,
    x2: x + B,
    y2: y + H,
    label: `b=${b}${unitSuffix}`,
    offset: 16,
    canvasSize,
  });

  dims += `<text x="${cx}" y="${cy + 4}" fill="#60a5fa" font-size="10" font-family="Inter, sans-serif" font-weight="600" text-anchor="middle">t=${t}${unitSuffix}</text>`;

  return `<svg viewBox="0 0 ${canvasSize} ${canvasSize}" class="w-full h-full max-w-[240px]">${fill}${innerClear}${outer}${inner}${dims}</svg>`;
}

export function buildPipeSvg(
  v: Record<string, number>,
  unitSuffix = "",
  canvasSize = CANVAS_SIZE
): string {
  const dia = v.dia;
  const thick = v.thick || 5;

  const scale = (canvasSize - 2 * CANVAS_PADDING) / dia;
  const R = (dia * scale) / 2;
  const r = ((dia - 2 * thick) * scale) / 2;
  const cx = canvasSize / 2;
  const cy = canvasSize / 2;

  const shape = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#3b82f6" stroke-width="2"/>
                 <circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(11,18,32,0.9)" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,2"/>
                 <path d="M${cx - R},${cy} A${R},${R} 0 0,1 ${cx + R},${cy}" fill="rgba(59,130,246,0.12)"/>
                 <path d="M${cx - r},${cy} A${r},${r} 0 0,1 ${cx + r},${cy}" fill="rgba(11,18,32,0.9)"/>`;

  let dims = dimLine({
    x1: cx,
    y1: cy,
    x2: cx + R,
    y2: cy,
    label: `Ø=${dia}${unitSuffix}`,
    offset: -14,
    canvasSize,
  });

  dims += `<text x="${cx}" y="${cy + R + 16}" fill="#60a5fa" font-size="9" font-family="Inter, sans-serif" font-weight="600" text-anchor="middle">e=${thick}${unitSuffix}</text>`;

  return `<svg viewBox="0 0 ${canvasSize} ${canvasSize}" class="w-full h-full max-w-[240px]">${shape}${dims}</svg>`;
}

export function buildPlateSvg(
  v: Record<string, number>,
  unitSuffix = "",
  canvasSize = CANVAS_SIZE
): string {
  const h = v.h;
  const b = v.b;
  const t = v.t || 10;

  const scale = Math.min((canvasSize - 2 * CANVAS_PADDING) / h, (canvasSize - 2 * CANVAS_PADDING) / b);
  const H = h * scale;
  const B = b * scale;
  const cx = canvasSize / 2;
  const cy = canvasSize / 2;
  const x = cx - B / 2;
  const y = cy - H / 2;

  const shape = `<rect x="${x}" y="${y}" width="${B}" height="${H}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2" rx="2"/>`;

  let dims = dimLine({
    x1: x,
    y1: y,
    x2: x,
    y2: y + H,
    label: `h=${h}${unitSuffix}`,
    offset: -22,
    canvasSize,
  });

  dims += dimLine({
    x1: x,
    y1: y + H,
    x2: x + B,
    y2: y + H,
    label: `b=${b}${unitSuffix}`,
    offset: 16,
    canvasSize,
  });

  dims += `<text x="${cx}" y="${cy + 4}" fill="#60a5fa" font-size="10" font-family="Inter, sans-serif" font-weight="600" text-anchor="middle">t=${t}${unitSuffix}</text>`;

  return `<svg viewBox="0 0 ${canvasSize} ${canvasSize}" class="w-full h-full max-w-[240px]">${shape}${dims}</svg>`;
}

export function buildRBSvg(
  v: Record<string, number>,
  unitSuffix = "",
  canvasSize = CANVAS_SIZE
): string {
  const dia = v.dia;
  const scale = (canvasSize - 2 * CANVAS_PADDING) / dia;
  const R = (dia * scale) / 2;
  const cx = canvasSize / 2;
  const cy = canvasSize / 2;

  const shape = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="2"/>
                 <line x1="${cx}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="#60a5fa" stroke-width="1" stroke-dasharray="3,2"/>`;

  const dims = `<text x="${cx + R / 2}" y="${cy - 8}" fill="#60a5fa" font-size="11" font-family="Inter, sans-serif" font-weight="700" text-anchor="middle">Ø=${dia}${unitSuffix}</text>`;

  return `<svg viewBox="0 0 ${canvasSize} ${canvasSize}" class="w-full h-full max-w-[240px]">${shape}${dims}</svg>`;
}

// ------------------------- DISPATCHERS DE ALTO NIVEL -------------------------

export function buildIchaProfileSvg(profile: Record<string, unknown> | null, series: string): string {
  if (!profile) return "";
  const h = Number(profile.H_mm) || 0;
  const b = Number(profile.B_mm) || 0;
  const e = Number(profile.e_mm) || 0;
  const t = Number(profile.t_mm) || e;
  const c = Number(profile.C_mm) || 0;
  const g = typeof profile.gramil_mm === "number" ? profile.gramil_mm : null;

  if (h <= 0) return "";

  if (["IN", "IP", "HN", "PH"].includes(series)) {
    return buildHSvg({ h, b, s: t, t1: e, t2: e, gramil: g, labelS: "t", labelT: "e" });
  }

  if (series === "L" || series === "L_desig") {
    return buildLSvg({ h, b, t: e }, g);
  }

  if (series === "TL") {
    return buildTLSvg({ h, b, t: e }, g);
  }

  if (series === "XL") {
    return buildXLSvg({ h, b, t: e }, g);
  }

  if (series === "C") {
    return buildCSvg({ h, b, t: e }, false, g);
  }

  if (series === "IC") {
    return buildICSvg({ h, b, t: e }, g);
  }

  if (series === "CA") {
    return buildCASvg({ h, b, t: e, c }, g);
  }

  if (series === "ICA") {
    return buildICASvg({ h, b, t: e, c }, g);
  }

  if (series === "CAJON") {
    return buildTubeSvg({ h, b, t: e });
  }

  return "";
}

export function buildAiscProfileSvg(profile: Record<string, unknown> | null, unitSys: "metric" | "imperial" | string): string {
  if (!profile) return "";
  const isImperial = unitSys === "imperial";
  const unitSuffix = isImperial ? '"' : " mm";

  const d = Number(isImperial ? profile.d_in : profile.d_mm)
    || Number(isImperial ? profile.OD_in : profile.OD_mm)
    || Number(isImperial ? profile.Ht_in : profile.Ht_mm)
    || 10;

  const bf = Number(isImperial ? profile.bf_in : profile.bf_mm)
    || Number(isImperial ? profile.B_in : profile.B_mm)
    || Number(isImperial ? profile.b_in : profile.b_mm)
    || d;

  const tw = Number(isImperial ? profile.tw_in : profile.tw_mm)
    || Number(isImperial ? profile.t_in : profile.t_mm)
    || Number(isImperial ? profile.tdes_in : profile.tdes_mm)
    || d * 0.05;

  const tf = Number(isImperial ? profile.tf_in : profile.tf_mm)
    || Number(isImperial ? profile.t_in : profile.t_mm)
    || Number(isImperial ? profile.tdes_in : profile.tdes_mm)
    || d * 0.08;

  const series = String(profile.type || profile.Type || "");

  if (["W", "M", "S", "HP"].includes(series)) {
    return buildHSvg({
      h: d,
      b: bf,
      s: tw,
      t1: tf,
      t2: tf,
      unitSuffix,
      labelH: "d",
      labelB: "bf",
      labelS: "tw",
      labelT: "tf",
    });
  }

  if (["WT", "MT", "ST"].includes(series)) {
    return buildTSvg(d, bf, tw, tf, unitSuffix);
  }

  if (["C", "MC"].includes(series)) {
    return buildCSvg({ h: d, b: bf, t: tf }, false, null, tf, unitSuffix);
  }

  if (series === "L") {
    return buildLSvg({ h: d, b: bf, t: tf }, null, unitSuffix);
  }

  if (series === "2L") {
    return buildTLSvg({ h: d, b: bf * 2, t: tf }, null, unitSuffix);
  }

  if (series === "PIPE" || (series === "HSS" && profile.OD_in)) {
    const od = Number(isImperial ? profile.OD_in : profile.OD_mm) || d;
    return buildPipeSvg({ dia: od, thick: tw }, unitSuffix);
  }

  if (series === "HSS") {
    return buildTubeSvg({ h: d, b: bf, t: tw }, unitSuffix);
  }

  return "";
}
