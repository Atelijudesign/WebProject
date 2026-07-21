/**
 * Structural Steel Profile Calculation Utilities
 * Calculates geometric and mechanical section properties for standard profiles.
 */

// Density of structural steel (kg/cm3 approx -> 7850 kg/m3)
const STEEL_DENSITY_KG_CM3 = 0.00785;

/**
 * H Profile (I-beam / Wide Flange)
 * @param {{h: number, b: number, s: number, t: number}} v
 */
export function calcH(v) {
  const area = (v.b * v.t + v.b * v.t + (v.h - v.t - v.t) * v.s) / 100;
  const weight = area * STEEL_DENSITY_KG_CM3 * 100;
  const cover = (2 * v.b - v.s + (2 * v.b - v.s) + 2 * v.h) / 1000;
  const desig = `H ${(v.h * 0.1).toFixed(0)} × ${weight.toFixed(2)}`;
  const hw = v.h - 2 * v.t;
  const Ix = (v.b * Math.pow(v.h, 3) - (v.b - v.s) * Math.pow(hw, 3)) / 12 / 10000;
  const Iy = (2 * v.t * Math.pow(v.b, 3) + hw * Math.pow(v.s, 3)) / 12 / 10000;
  const Wx = Ix / (v.h / 2 / 10);
  const Wy = Iy / (v.b / 2 / 10);
  return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
}

/**
 * HE Profile (Unequal Flanges)
 * @param {{h: number, b1: number, b2: number, t1: number, t2: number, s: number}} v
 */
export function calcHE(v) {
  const area = (v.b1 * v.t1 + v.b2 * v.t2 + (v.h - v.t1 - v.t2) * v.s) / 100;
  const weight = area * STEEL_DENSITY_KG_CM3 * 100;
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
}

/**
 * T Profile (T-section)
 * @param {{h: number, b: number, t: number, s: number}} v
 */
export function calcT(v) {
  const area = (v.b * v.t + (v.h - v.t) * v.s) / 100;
  const weight = area * STEEL_DENSITY_KG_CM3 * 100;
  const cover = (2 * v.h + 2 * v.b) / 1000;
  const desig = `T ${(v.h * 0.1).toFixed(1)} × ${weight.toFixed(2)}`;
  const A = v.b * v.t + (v.h - v.t) * v.s;
  const ybar = (v.b * v.t * (v.h - v.t / 2) + (v.h - v.t) * v.s * ((v.h - v.t) / 2)) / A;
  const Ix = ((v.b * Math.pow(v.t, 3)) / 12 + v.b * v.t * Math.pow(v.h - v.t / 2 - ybar, 2) + (v.s * Math.pow(v.h - v.t, 3)) / 12 + v.s * (v.h - v.t) * Math.pow((v.h - v.t) / 2 - ybar, 2)) / 10000;
  const Iy = (v.t * Math.pow(v.b, 3) + (v.h - v.t) * Math.pow(v.s, 3)) / 12 / 10000;
  const Wx = Ix / (Math.max(ybar, v.h - ybar) / 10);
  const Wy = Iy / (v.b / 2 / 10);
  return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
}

/**
 * CA Profile (Stiffened Channel / Canal Atiesado)
 * @param {{h: number, b: number, c: number, t: number}} v
 */
export function calcCA(v) {
  const area = ((v.h + 2 * v.b + 2 * v.c - 6.5752 * v.t) * v.t) / 100;
  const weight = area * STEEL_DENSITY_KG_CM3 * 100;
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
}

/**
 * C Profile (Standard Channel / Canal)
 * @param {{h: number, b: number, t: number}} v
 */
export function calcC(v) {
  const area = ((v.h + 2 * v.b - 3.2876 * v.t) * v.t) / 100;
  const weight = area * STEEL_DENSITY_KG_CM3 * 100;
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
}

/**
 * CE Profile (Unequal Flange Channel)
 * @param {{h: number, b1: number, b2: number, t: number}} v
 */
export function calcCE(v) {
  const area = ((v.b1 + v.b2 + v.h - 3.2876 * v.t) * v.t) / 100;
  const weight = area * STEEL_DENSITY_KG_CM3 * 100;
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
}

/**
 * XL Profile (Double Angle / Doble Ángulo)
 * @param {{h: number, b: number, t: number}} v
 */
export function calcXL(v) {
  const area = ((v.h + v.b - 1.6438 * v.t) * v.t * 2) / 100;
  const weight = area * STEEL_DENSITY_KG_CM3 * 100;
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
}

/**
 * L Profile (Angle / Ángulo)
 * @param {{h: number, b: number, t: number}} v
 */
export function calcL(v) {
  const area = ((v.h + v.b - 1.6438 * v.t) * v.t) / 100;
  const weight = area * STEEL_DENSITY_KG_CM3 * 100;
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
}

/**
 * Plate (Plancha / Placa)
 * @param {{h: number, b: number, t: number}} v
 */
export function calcPL(v) {
  const area = (v.b * v.t) / 100;
  const weight = (v.b * v.t * STEEL_DENSITY_KG_CM3);
  const cover = (2 * v.b + 2 * v.t) / 1000;
  const desig = `PL ${v.h} × ${v.b} × ${v.t}`;
  const Ix = (v.b * Math.pow(v.t, 3)) / 12 / 10000;
  const Iy = (v.t * Math.pow(v.b, 3)) / 12 / 10000;
  const Wx = Ix / (v.t / 2 / 10);
  const Wy = Iy / (v.b / 2 / 10);
  return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
}

/**
 * Pipe (Circular Hollow Section)
 * @param {{dia: number, thick: number}} v
 */
export function calcPipe(v) {
  const ro = v.dia / 2;
  const ri = (v.dia - 2 * v.thick) / 2;
  const area = (Math.PI * (ro * ro - ri * ri)) / 100;
  const weight = (area * 1000 * 0.00786) / 10;
  const cover = (Math.PI * v.dia) / 1000;
  const desig = `PIPE Ø${v.dia} × ${v.thick}`;
  const Ix = (Math.PI * (Math.pow(ro, 4) - Math.pow(ri, 4))) / 4 / 10000;
  const Iy = Ix;
  const Wx = Ix / (ro / 10);
  const Wy = Iy / (ro / 10);
  return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
}

/**
 * Tube / PROF (Rectangular/Square Hollow Section)
 * @param {{h: number, b: number, t: number}} v
 */
export function calcTube(v) {
  const area = ((v.h * 2 + 2 * v.b - 6.5752 * v.t) * v.t) / 100;
  const weight = area * STEEL_DENSITY_KG_CM3 * 100;
  const cover = ((2 * v.h + 4 * v.b - 2 * v.t) * 2) / 1000;
  const desig = `CJ ${(v.h * 0.1).toFixed(0)} × ${weight.toFixed(2)}`;
  const hw = v.h - 2 * v.t, bw = v.b - 2 * v.t;
  const Ix = (v.b * Math.pow(v.h, 3) - bw * Math.pow(hw, 3)) / 12 / 10000;
  const Iy = (v.h * Math.pow(v.b, 3) - hw * Math.pow(bw, 3)) / 12 / 10000;
  const Wx = Ix / (v.h / 2 / 10);
  const Wy = Iy / (v.b / 2 / 10);
  return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
}

/**
 * RB (Round Bar / Barra Redonda)
 * @param {{dia: number}} v
 */
export function calcRB(v) {
  const area = v.dia * v.dia * STEEL_DENSITY_KG_CM3;
  const weight = (v.dia * v.dia * 1000 * 0.000616) / 100;
  const cover = (2 * Math.PI * (v.dia / 2)) / 1000;
  const desig = `ARMADURA Ø${v.dia}`;
  const r = v.dia / 2;
  const Ix = (Math.PI * Math.pow(r, 4)) / 4 / 10000;
  const Iy = Ix;
  const Wx = Ix / (r / 10);
  const Wy = Iy / (r / 10);
  return { area, weight, cover, desig, Ix, Iy, Wx, Wy };
}

export const PROFILE_CALCULATORS = {
  H: calcH,
  HE: calcHE,
  T: calcT,
  CA: calcCA,
  C: calcC,
  CE: calcCE,
  XL: calcXL,
  L: calcL,
  PL: calcPL,
  PIPE: calcPipe,
  PROF: calcTube,
  RB: calcRB,
};
