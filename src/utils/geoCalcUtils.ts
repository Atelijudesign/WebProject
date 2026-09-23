// ============================================================================
// geoCalcUtils.ts — Geometria & Trigonometria para Ingenieria / Proyectos
// Basado en: Prontuario de Maquinas, N. Larburu (13a Ed.), Seccion I, pag. 9-44
// ============================================================================

const DEG = Math.PI / 180;

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS PUBLICOS
// ─────────────────────────────────────────────────────────────────────────────

export interface RightTriangleResult {
  a: number;
  b: number;
  c: number;
  A: number;
  B: number;
  C: number;
  area: number;
  perimeter: number;
  isValid: boolean;
  error?: string;
}

export interface ObliqueTriangleResult {
  a: number;
  b: number;
  c: number;
  A: number;
  B: number;
  C: number;
  area: number;
  perimeter: number;
  isValid: boolean;
  error?: string;
}

export interface TrigFunctions {
  angleDeg: number;
  angleRad: number;
  sin: number;
  cos: number;
  tan: number;
  cot: number;
  sec: number;
  csc: number;
}

export interface QuadraticResult {
  x1: number | null;
  x2: number | null;
  discriminant: number;
  type: "two_real" | "one_real" | "complex";
  isValid: boolean;
}

export interface AngleConversion {
  degrees: number;
  radians: number;
  gradians: number;
  dms: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────────────────────────────────────

const round = (v: number, decimals = 6) =>
  isFinite(v) ? parseFloat(v.toFixed(decimals)) : v;

const isPos = (v: number) => isFinite(v) && v > 0;

// ─────────────────────────────────────────────────────────────────────────────
// 1. TRIANGULO RECTANGULO
// ─────────────────────────────────────────────────────────────────────────────

export const rightTriangle_hypAngle = (c: number, A: number): RightTriangleResult => {
  if (!isPos(c) || A <= 0 || A >= 90)
    return { a: 0, b: 0, c, A, B: 0, C: 90, area: 0, perimeter: 0, isValid: false, error: "Valores fuera de rango" };
  const B = 90 - A;
  const a = round(c * Math.sin(A * DEG));
  const b = round(c * Math.cos(A * DEG));
  return { a, b, c: round(c), A, B, C: 90, area: round(a * b / 2), perimeter: round(a + b + c), isValid: true };
};

export const rightTriangle_hypLeg = (c: number, a: number): RightTriangleResult => {
  if (!isPos(c) || !isPos(a) || a >= c)
    return { a, b: 0, c, A: 0, B: 0, C: 90, area: 0, perimeter: 0, isValid: false, error: "El cateto debe ser menor que la hipotenusa" };
  const B = round(Math.asin(a / c) / DEG);
  const A = round(90 - B);
  const b = round(Math.sqrt(c * c - a * a));
  return { a: round(a), b, c: round(c), A, B, C: 90, area: round(a * b / 2), perimeter: round(a + b + c), isValid: true };
};

export const rightTriangle_legAngle = (b: number, B: number): RightTriangleResult => {
  if (!isPos(b) || B <= 0 || B >= 90)
    return { a: 0, b, c: 0, A: 0, B, C: 90, area: 0, perimeter: 0, isValid: false, error: "Valores fuera de rango" };
  const A = round(90 - B);
  const a = round(b * Math.tan(B * DEG));
  const c = round(b / Math.cos(B * DEG));
  return { a, b: round(b), c, A, B, C: 90, area: round(a * b / 2), perimeter: round(a + b + c), isValid: true };
};

export const rightTriangle_twoLegs = (a: number, b: number): RightTriangleResult => {
  if (!isPos(a) || !isPos(b))
    return { a, b, c: 0, A: 0, B: 0, C: 90, area: 0, perimeter: 0, isValid: false, error: "Ambos catetos deben ser positivos" };
  const c = round(Math.sqrt(a * a + b * b));
  const A = round(Math.atan(a / b) / DEG);
  const B = round(90 - A);
  return { a: round(a), b: round(b), c, A, B, C: 90, area: round(a * b / 2), perimeter: round(a + b + c), isValid: true };
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. TRIANGULO OBLICUANGULO
// ─────────────────────────────────────────────────────────────────────────────

const obliqueResult = (a: number, b: number, c: number, A: number, B: number, C: number): ObliqueTriangleResult => {
  if (!isPos(a) || !isPos(b) || !isPos(c) || A <= 0 || B <= 0 || C <= 0)
    return { a, b, c, A, B, C, area: 0, perimeter: 0, isValid: false, error: "Resultado invalido" };
  const s = (a + b + c) / 2;
  const areaVal = s * (s - a) * (s - b) * (s - c);
  const area = areaVal > 0 ? round(Math.sqrt(areaVal)) : 0;
  return { a: round(a), b: round(b), c: round(c), A: round(A), B: round(B), C: round(C), area, perimeter: round(a + b + c), isValid: true };
};

export const obliqueTriangle_sideAngles = (a: number, B: number, C: number): ObliqueTriangleResult => {
  const A = 180 - B - C;
  if (!isPos(a) || A <= 0)
    return { a, b: 0, c: 0, A, B, C, area: 0, perimeter: 0, isValid: false, error: "Los angulos deben sumar < 180" };
  const b = a * Math.sin(B * DEG) / Math.sin(A * DEG);
  const c = a * Math.sin(C * DEG) / Math.sin(A * DEG);
  return obliqueResult(a, b, c, A, B, C);
};

export const obliqueTriangle_twoSidesAngle = (a: number, b: number, C: number): ObliqueTriangleResult => {
  if (!isPos(a) || !isPos(b) || C <= 0 || C >= 180)
    return { a, b, c: 0, A: 0, B: 0, C, area: 0, perimeter: 0, isValid: false, error: "Valores fuera de rango" };
  const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C * DEG));
  const A = Math.acos((b * b + c * c - a * a) / (2 * b * c)) / DEG;
  const B = 180 - A - C;
  return obliqueResult(a, b, c, A, B, C);
};

export const obliqueTriangle_threeSides = (a: number, b: number, c: number): ObliqueTriangleResult => {
  if (!isPos(a) || !isPos(b) || !isPos(c))
    return { a, b, c, A: 0, B: 0, C: 0, area: 0, perimeter: 0, isValid: false, error: "Todos los lados deben ser positivos" };
  const cosA = (b * b + c * c - a * a) / (2 * b * c);
  if (Math.abs(cosA) > 1)
    return { a, b, c, A: 0, B: 0, C: 0, area: 0, perimeter: 0, isValid: false, error: "Los lados no forman un triangulo valido" };
  const A = Math.acos(cosA) / DEG;
  const B = Math.acos((a * a + c * c - b * b) / (2 * a * c)) / DEG;
  const C = 180 - A - B;
  return obliqueResult(a, b, c, A, B, C);
};

export const obliqueTriangle_twoSidesOppAngle = (b: number, c: number, B: number): ObliqueTriangleResult => {
  if (!isPos(b) || !isPos(c) || B <= 0 || B >= 180)
    return { a: 0, b, c, A: 0, B, C: 0, area: 0, perimeter: 0, isValid: false, error: "Valores fuera de rango" };
  const sinC = c * Math.sin(B * DEG) / b;
  if (sinC > 1)
    return { a: 0, b, c, A: 0, B, C: 0, area: 0, perimeter: 0, isValid: false, error: "No existe solucion real" };
  const C = Math.asin(sinC) / DEG;
  const A = 180 - B - C;
  const a = b * Math.sin(A * DEG) / Math.sin(B * DEG);
  return obliqueResult(a, b, c, A, B, C);
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. FUNCIONES TRIGONOMETRICAS
// ─────────────────────────────────────────────────────────────────────────────

export const calcTrigFunctions = (angleDeg: number): TrigFunctions => {
  const angleRad = angleDeg * DEG;
  const s = Math.sin(angleRad);
  const c = Math.cos(angleRad);
  const t = Math.tan(angleRad);
  return {
    angleDeg: round(angleDeg, 4),
    angleRad: round(angleRad, 8),
    sin: round(s, 8),
    cos: round(c, 8),
    tan: Math.abs(t) > 1e10 ? Infinity : round(t, 8),
    cot: Math.abs(s) < 1e-10 ? Infinity : round(c / s, 8),
    sec: Math.abs(c) < 1e-10 ? Infinity : round(1 / c, 8),
    csc: Math.abs(s) < 1e-10 ? Infinity : round(1 / s, 8),
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. AREAS DE FIGURAS GEOMETRICAS
// ─────────────────────────────────────────────────────────────────────────────

export type ShapeId =
  | "circle" | "sector" | "segment" | "crown"
  | "triangle" | "rectangle" | "trapezoid" | "polygon"
  | "ellipse";

export interface ShapeInputDef {
  id: string;
  label: string;
  symbol: string;
  description: string;
}

export interface ShapeCalcResult {
  area: number;
  perimeter?: number;
  extras: { label: string; value: number }[];
}

export interface ShapeDef {
  id: ShapeId;
  nameEs: string;
  nameEn: string;
  icon: string;
  formulaEs: string;
  inputs: ShapeInputDef[];
  calc: (inputs: Record<string, number>) => ShapeCalcResult;
}

export const SHAPE_DEFINITIONS: ShapeDef[] = [
  {
    id: "circle",
    nameEs: "Circulo",
    nameEn: "Circle",
    icon: "fa-circle",
    formulaEs: "A = pi * r^2 = 0.7854 * d^2",
    inputs: [{ id: "r", label: "Radio", symbol: "r", description: "Radio del circulo" }],
    calc: ({ r }) => ({
      area: round(Math.PI * r * r),
      perimeter: round(2 * Math.PI * r),
      extras: [{ label: "Diametro", value: round(2 * r) }],
    }),
  },
  {
    id: "sector",
    nameEs: "Sector Circular",
    nameEn: "Circular Sector",
    icon: "fa-chart-pie",
    formulaEs: "A = pi * r^2 * alpha / 360",
    inputs: [
      { id: "r", label: "Radio", symbol: "r", description: "Radio" },
      { id: "alpha", label: "Angulo", symbol: "a (deg)", description: "Angulo central en grados" },
    ],
    calc: ({ r, alpha }) => ({
      area: round(Math.PI * r * r * alpha / 360),
      perimeter: round(2 * r + alpha * DEG * r),
      extras: [{ label: "Longitud arco", value: round(alpha * DEG * r) }],
    }),
  },
  {
    id: "segment",
    nameEs: "Segmento Circular",
    nameEn: "Circular Segment",
    icon: "fa-circle-half-stroke",
    formulaEs: "A = (r*(arco-cuerda) + cuerda*flecha) / 2",
    inputs: [
      { id: "r", label: "Radio", symbol: "r", description: "Radio del circulo" },
      { id: "alpha", label: "Angulo", symbol: "a (deg)", description: "Angulo central en grados" },
    ],
    calc: ({ r, alpha }) => {
      const arc = alpha * DEG * r;
      const chord = 2 * r * Math.sin((alpha / 2) * DEG);
      const arrow = r - r * Math.cos((alpha / 2) * DEG);
      return {
        area: round((r * (arc - chord) + chord * arrow) / 2),
        extras: [
          { label: "Cuerda", value: round(chord) },
          { label: "Flecha", value: round(arrow) },
        ],
      };
    },
  },
  {
    id: "crown",
    nameEs: "Corona Circular",
    nameEn: "Annulus",
    icon: "fa-ring",
    formulaEs: "A = pi * (R^2 - r^2)",
    inputs: [
      { id: "R", label: "Radio exterior", symbol: "R", description: "Radio exterior" },
      { id: "r", label: "Radio interior", symbol: "r", description: "Radio interior (< R)" },
    ],
    calc: ({ R, r }) => ({
      area: round(Math.PI * (R * R - r * r)),
      perimeter: round(2 * Math.PI * (R + r)),
      extras: [{ label: "Ancho corona", value: round(R - r) }],
    }),
  },
  {
    id: "triangle",
    nameEs: "Triangulo (base x altura)",
    nameEn: "Triangle",
    icon: "fa-play",
    formulaEs: "A = b * h / 2",
    inputs: [
      { id: "b", label: "Base", symbol: "b", description: "Base del triangulo" },
      { id: "h", label: "Altura", symbol: "h", description: "Altura perpendicular a la base" },
    ],
    calc: ({ b, h }) => ({ area: round(b * h / 2), extras: [] }),
  },
  {
    id: "rectangle",
    nameEs: "Rectangulo / Cuadrado",
    nameEn: "Rectangle",
    icon: "fa-rectangle-landscape",
    formulaEs: "A = a * b",
    inputs: [
      { id: "a", label: "Largo", symbol: "a", description: "Dimension mayor" },
      { id: "b", label: "Ancho", symbol: "b", description: "Dimension menor" },
    ],
    calc: ({ a, b }) => ({
      area: round(a * b),
      perimeter: round(2 * (a + b)),
      extras: [{ label: "Diagonal", value: round(Math.sqrt(a * a + b * b)) }],
    }),
  },
  {
    id: "trapezoid",
    nameEs: "Trapecio",
    nameEn: "Trapezoid",
    icon: "fa-filter",
    formulaEs: "A = (a + b) * h / 2",
    inputs: [
      { id: "a", label: "Base mayor", symbol: "a", description: "Base mayor" },
      { id: "b", label: "Base menor", symbol: "b", description: "Base menor" },
      { id: "h", label: "Altura", symbol: "h", description: "Altura perpendicular" },
    ],
    calc: ({ a, b, h }) => ({ area: round((a + b) * h / 2), extras: [] }),
  },
  {
    id: "polygon",
    nameEs: "Poligono Regular",
    nameEn: "Regular Polygon",
    icon: "fa-hexagon",
    formulaEs: "A = (n * L^2) / (4 * tan(pi/n))",
    inputs: [
      { id: "n", label: "N lados", symbol: "n", description: "Numero de lados (3, 4, 5, 6...)" },
      { id: "L", label: "Lado", symbol: "L", description: "Longitud de cada lado" },
    ],
    calc: ({ n, L }) => ({
      area: round((n * L * L) / (4 * Math.tan(Math.PI / n))),
      perimeter: round(n * L),
      extras: [{ label: "Radio inscrito", value: round(L / (2 * Math.tan(Math.PI / n))) }],
    }),
  },
  {
    id: "ellipse",
    nameEs: "Elipse",
    nameEn: "Ellipse",
    icon: "fa-circle",
    formulaEs: "A = pi * a * b",
    inputs: [
      { id: "a", label: "Semieje mayor", symbol: "a", description: "Semieje mayor" },
      { id: "b", label: "Semieje menor", symbol: "b", description: "Semieje menor" },
    ],
    calc: ({ a, b }) => ({
      area: round(Math.PI * a * b),
      perimeter: round(Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)))),
      extras: [{ label: "Excentricidad", value: round(Math.sqrt(1 - (b * b) / (a * a))) }],
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. ECUACION CUADRATICA
// ─────────────────────────────────────────────────────────────────────────────

export const solveQuadratic = (a: number, b: number, c: number): QuadraticResult => {
  if (a === 0) return { x1: null, x2: null, discriminant: 0, type: "complex", isValid: false };
  const disc = b * b - 4 * a * c;
  if (disc > 0) {
    return {
      x1: round((-b + Math.sqrt(disc)) / (2 * a)),
      x2: round((-b - Math.sqrt(disc)) / (2 * a)),
      discriminant: round(disc),
      type: "two_real",
      isValid: true,
    };
  }
  if (disc === 0) {
    return { x1: round(-b / (2 * a)), x2: round(-b / (2 * a)), discriminant: 0, type: "one_real", isValid: true };
  }
  return { x1: null, x2: null, discriminant: round(disc), type: "complex", isValid: true };
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. CONVERSION ANGULAR
// ─────────────────────────────────────────────────────────────────────────────

export const convertAngle = (value: number, from: "degrees" | "radians" | "gradians"): AngleConversion => {
  let deg: number;
  if (from === "degrees") deg = value;
  else if (from === "radians") deg = value / DEG;
  else deg = value * 0.9;

  const totalSec = Math.round(Math.abs(deg) * 3600);
  const dmsD = Math.floor(totalSec / 3600);
  const dmsM = Math.floor((totalSec % 3600) / 60);
  const dmsS = totalSec % 60;
  const sign = deg < 0 ? "-" : "";

  return {
    degrees: round(deg, 6),
    radians: round(deg * DEG, 8),
    gradians: round(deg / 0.9, 6),
    dms: sign + dmsD + "deg " + dmsM + "min " + dmsS + "sec",
  };
};
