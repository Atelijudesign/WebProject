import ExcelJS from "exceljs";

// ============================================================================
// Tipos e Interfaces Estrictas (TypeScript puro - Sin 'any')
// ============================================================================

export interface FractionEntry {
  numerator16: number;
  baseFraction: string;       // ej: "4/16"
  simplifiedFraction: string; // ej: "1/4"
  decimalInch: number;        // ej: 0.2500
  decimalMm: number;          // ej: 6.3500
  decimalCm: number;          // ej: 0.6350
}

export interface FootInchResult {
  feet: number;
  inches: number;
  fractionNumerator: number;
  fractionDenominator: number;
  fractionText: string;
  nominalInchesRounded: number; // Redondeado entero ej: 3 (como en Excel del usuario)
  totalInches: number;
  totalMm: number;
  totalCm: number;
  totalMeters: number;
  architecturalString: string;  // ej: 5'-2 15/16" o 1'-3"
  residualErrorMm: number;      // Error residual en mm respecto al fraccional
  residualErrorInches: number;
}

export interface UnitCategory {
  id: string;
  nameEs: string;
  nameEn: string;
  icon: string;
  descriptionEs: string;
  descriptionEn: string;
  units: UnitDefinition[];
}

export interface UnitDefinition {
  id: string;
  symbol: string;
  nameEs: string;
  nameEn: string;
  toBaseFactor: number; // Multiplicador para llevar a la unidad base del grupo
  description?: string;
}

export interface ConversionHistoryItem {
  id: string;
  timestamp: number;
  type: "foot-inch-to-mm" | "mm-to-foot-inch" | "multi-unit";
  inputDisplay: string;
  resultDisplay: string;
  category?: string;
}

// ============================================================================
// Utilidades Matemáticas de Fracciones
// ============================================================================

/**
 * Máximo Común Divisor (Euclides)
 */
export const gcd = (a: number, b: number): number => {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
};

/**
 * Simplifica una fracción
 */
export const simplifyFraction = (
  numerator: number,
  denominator: number
): { num: number; den: number; text: string } => {
  if (numerator === 0 || denominator === 0) {
    return { num: 0, den: 1, text: "0" };
  }
  const divisor = gcd(numerator, denominator);
  const num = numerator / divisor;
  const den = denominator / divisor;
  if (num === den) {
    return { num: 1, den: 1, text: "1\"" };
  }
  return { num, den, text: `${num}/${den}` };
};

/**
 * Parsea un string fraccionario o decimal a número float en pulgadas.
 * Soporta formatos: "0", "1/16", "3/8", "1 1/2", "0.25", "5/32", "63/64".
 */
export const parseFractionString = (input: string): number => {
  if (!input) return 0;
  const trimmed = input.trim();
  if (!trimmed || trimmed === "0") return 0;

  // Caso: Decimal directo
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const val = parseFloat(trimmed);
    return isNaN(val) ? 0 : val;
  }

  // Caso: Mixto "1 1/2" o "2-3/4"
  if (trimmed.includes(" ") || trimmed.includes("-")) {
    const parts = trimmed.split(/[\s-]+/);
    if (parts.length === 2) {
      const whole = parseFloat(parts[0]);
      const fracVal = parseFractionString(parts[1]);
      return (isNaN(whole) ? 0 : whole) + fracVal;
    }
  }

  // Caso: Fracción simple "a/b"
  if (trimmed.includes("/")) {
    const [numStr, denStr] = trimmed.split("/");
    const num = parseFloat(numStr);
    const den = parseFloat(denStr);
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      return num / den;
    }
  }

  const fallback = parseFloat(trimmed);
  return isNaN(fallback) ? 0 : fallback;
};

// ============================================================================
// Generador de la Tabla de Equivalencias (1/16, 1/32, 1/64)
// ============================================================================

export const generateEquivalenceTable = (
  maxDenominator: number = 16
): FractionEntry[] => {
  const table: FractionEntry[] = [];
  for (let i = 1; i <= maxDenominator; i++) {
    const simplified = simplifyFraction(i, maxDenominator);
    const decimalInch = i / maxDenominator;
    const decimalMm = decimalInch * 25.4;
    const decimalCm = decimalMm / 10;

    table.push({
      numerator16: i,
      baseFraction: `${i}/${maxDenominator}`,
      simplifiedFraction: simplified.text,
      decimalInch,
      decimalMm,
      decimalCm,
    });
  }
  return table;
};

// ============================================================================
// Conversor Bidireccional Pie-Pulgada ↔ Milímetros
// ============================================================================

/**
 * Convierte Pies + Pulgadas + Fracción a Milímetros y métrico
 */
export const convertFootInchToMm = (
  feet: number,
  inches: number,
  fractionInch: number
): {
  totalInches: number;
  totalMm: number;
  totalCm: number;
  totalMeters: number;
  totalFeet: number;
  architecturalString: string;
} => {
  const safeFeet = isNaN(feet) ? 0 : feet;
  const safeInches = isNaN(inches) ? 0 : inches;
  const safeFraction = isNaN(fractionInch) ? 0 : fractionInch;

  const totalInches = safeFeet * 12 + safeInches + safeFraction;
  const totalMm = totalInches * 25.4;
  const totalCm = totalMm / 10;
  const totalMeters = totalMm / 1000;
  const totalFeet = totalInches / 12;

  // Fracción reducida para la visualización arquitectónica
  let fracText = "";
  if (safeFraction > 0.0001) {
    // Buscar la mejor aproximación a 64avos
    const bestNumerator = Math.round(safeFraction * 64);
    if (bestNumerator > 0 && bestNumerator < 64) {
      fracText = ` ${simplifyFraction(bestNumerator, 64).text}`;
    }
  }

  const architecturalString = `${Math.floor(safeFeet)}'-${Math.floor(safeInches)}${fracText}"`;

  return {
    totalInches,
    totalMm,
    totalCm,
    totalMeters,
    totalFeet,
    architecturalString,
  };
};

/**
 * Convierte Milímetros a Pies + Pulgadas + Fracción
 * @param mm Milímetros de entrada (ej: 1600)
 * @param precision Denominador máximo para fracción (16, 32, 64, 128)
 */
export const convertMmToFootInch = (
  mm: number,
  precision: number = 16
): FootInchResult => {
  const safeMm = isNaN(mm) || mm < 0 ? 0 : mm;
  const totalInches = safeMm / 25.4;
  const totalMeters = safeMm / 1000;
  const totalCm = safeMm / 10;

  // Pies enteros
  const feet = Math.floor(totalInches / 12);
  const remainingInches = totalInches - feet * 12;

  // Redondeo nominal a pulgada entera (como en la hoja Excel del usuario: 1600 mm -> 5 ft 3 in)
  const nominalInchesRounded = Math.round(remainingInches);

  // Pulgadas enteras de la descomposición con fracción
  let wholeInches = Math.floor(remainingInches);
  const fractionalPart = remainingInches - wholeInches;

  // Fracción a la precisión solicitada
  let fractionNumerator = Math.round(fractionalPart * precision);
  let fractionDenominator = precision;

  // Si la fracción redondeada suma al entero siguiente
  if (fractionNumerator === precision) {
    wholeInches += 1;
    fractionNumerator = 0;
  }

  let finalFeet = feet;
  if (wholeInches === 12) {
    finalFeet += 1;
    wholeInches = 0;
  }

  let fractionText = "";
  if (fractionNumerator > 0) {
    const simplified = simplifyFraction(fractionNumerator, fractionDenominator);
    fractionText = simplified.text;
  }

  // Notación arquitectónica
  const archFraction = fractionText ? ` ${fractionText}` : "";
  const architecturalString = `${finalFeet}'-${wholeInches}${archFraction}"`;

  // Error residual (diferencia entre el valor fraccionario nominal y el exacto)
  const nominalInchesWithFrac =
    finalFeet * 12 + wholeInches + fractionNumerator / fractionDenominator;
  const residualErrorInches = nominalInchesWithFrac - totalInches;
  const residualErrorMm = residualErrorInches * 25.4;

  return {
    feet: finalFeet,
    inches: wholeInches,
    fractionNumerator,
    fractionDenominator,
    fractionText,
    nominalInchesRounded,
    totalInches,
    totalMm: safeMm,
    totalCm,
    totalMeters,
    architecturalString,
    residualErrorMm,
    residualErrorInches,
  };
};

// ============================================================================
// Categorías Multidimensionales de Ingeniería Estructural & BIM
// ============================================================================

export const ENGINEERING_UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: "length",
    nameEs: "Longitud & Dimensión",
    nameEn: "Length & Dimension",
    icon: "fa-solid fa-ruler-combined",
    descriptionEs: "Conversión de cotas, despieces de taller y planos estructurales.",
    descriptionEn: "Drawings, shop detailing dimensions, and structural lengths.",
    units: [
      { id: "mm", symbol: "mm", nameEs: "Milímetros", nameEn: "Millimeters", toBaseFactor: 0.001 },
      { id: "cm", symbol: "cm", nameEs: "Centímetros", nameEn: "Centimeters", toBaseFactor: 0.01 },
      { id: "m", symbol: "m", nameEs: "Metros", nameEn: "Meters", toBaseFactor: 1 },
      { id: "in", symbol: "in (\")", nameEs: "Pulgadas", nameEn: "Inches", toBaseFactor: 0.0254 },
      { id: "ft", symbol: "ft (')", nameEs: "Pies", nameEn: "Feet", toBaseFactor: 0.3048 },
      { id: "yd", symbol: "yd", nameEs: "Yardas", nameEn: "Yards", toBaseFactor: 0.9144 },
      { id: "mil", symbol: "mil / thou", nameEs: "Milésimas de pulgada", nameEn: "Mils (thou)", toBaseFactor: 0.0000254 },
      { id: "km", symbol: "km", nameEs: "Kilómetros", nameEn: "Kilometers", toBaseFactor: 1000 },
    ],
  },
  {
    id: "linear_mass",
    nameEs: "Peso Lineal de Perfiles (Masa/Longitud)",
    nameEn: "Linear Weight (Per Foot / Meter)",
    icon: "fa-solid fa-weight-hanging",
    descriptionEs: "Equivalencia fundamental para cubicación de perfiles ICHA y AISC (plf a kg/m).",
    descriptionEn: "Essential for ICHA & AISC steel shapes takeoffs (lb/ft to kg/m).",
    units: [
      { id: "kg_m", symbol: "kg/m", nameEs: "Kilogramos por metro (Métrico)", nameEn: "Kilograms per meter", toBaseFactor: 1 },
      { id: "lb_ft", symbol: "lb/ft (plf)", nameEs: "Libras por pie (AISC Standard)", nameEn: "Pounds per foot (plf)", toBaseFactor: 1.48816394 },
      { id: "kg_cm", symbol: "kg/cm", nameEs: "Kilogramos por centímetro", nameEn: "Kilograms per centimeter", toBaseFactor: 100 },
      { id: "t_m", symbol: "ton/m", nameEs: "Toneladas por metro", nameEn: "Metric tons per meter", toBaseFactor: 1000 },
    ],
  },
  {
    id: "stress_pressure",
    nameEs: "Tensión, Esfuerzo & Presión (Fy, Fu, f'c)",
    nameEn: "Stress, Yield Strength & Pressure",
    icon: "fa-solid fa-gauge-high",
    descriptionEs: "Límites de fluencia de aceros (A36, A572, ASTM) y resistencia de hormigones (H25, H30).",
    descriptionEn: "Steel yield strength (Fy, Fu) and concrete compressive strength (f'c).",
    units: [
      { id: "mpa", symbol: "MPa (N/mm²)", nameEs: "Megapascales", nameEn: "Megapascals", toBaseFactor: 1000000 },
      { id: "kgf_cm2", symbol: "kgf/cm²", nameEs: "Kilogramos fuerza por cm² (Chile/Latam)", nameEn: "Kilograms-force/cm²", toBaseFactor: 98066.5 },
      { id: "ksi", symbol: "ksi (kips/in²)", nameEs: "Kips por pulgada² (AISC)", nameEn: "Kips per square inch", toBaseFactor: 6894757.29 },
      { id: "psi", symbol: "psi (lb/in²)", nameEs: "Libras por pulgada²", nameEn: "Pounds per square inch", toBaseFactor: 6894.75729 },
      { id: "bar", symbol: "bar", nameEs: "Bares", nameEn: "Bars", toBaseFactor: 100000 },
      { id: "kpa", symbol: "kPa (kN/m²)", nameEs: "Kilopascales", nameEn: "Kilopascals", toBaseFactor: 1000 },
      { id: "pa", symbol: "Pa (N/m²)", nameEs: "Pascales", nameEn: "Pascals", toBaseFactor: 1 },
    ],
  },
  {
    id: "force",
    nameEs: "Fuerza Estructural (Axial, Corte)",
    nameEn: "Structural Force (Axial, Shear)",
    icon: "fa-solid fa-arrows-to-dot",
    descriptionEs: "Cargas de diseño, reacciones de vigas, axiales de columnas y sismo.",
    descriptionEn: "Design loads, beam shear, column axial, and seismic forces.",
    units: [
      { id: "kn", symbol: "kN", nameEs: "Kilonewtons (SI)", nameEn: "Kilonewtons", toBaseFactor: 1000 },
      { id: "kgf", symbol: "kgf", nameEs: "Kilogramos fuerza", nameEn: "Kilograms force", toBaseFactor: 9.80665 },
      { id: "tonf", symbol: "tonf", nameEs: "Toneladas fuerza", nameEn: "Metric ton force", toBaseFactor: 9806.65 },
      { id: "kip", symbol: "kip (k)", nameEs: "Kips (1,000 lbf - AISC)", nameEn: "Kips (1,000 lbf)", toBaseFactor: 4448.2216 },
      { id: "lbf", symbol: "lbf", nameEs: "Libras fuerza", nameEn: "Pounds force", toBaseFactor: 4.4482216 },
      { id: "n", symbol: "N", nameEs: "Newtons", nameEn: "Newtons", toBaseFactor: 1 },
    ],
  },
  {
    id: "bending_moment",
    nameEs: "Momentos Flectores & Torsores",
    nameEn: "Bending Moment & Torque",
    icon: "fa-solid fa-rotate",
    descriptionEs: "Momentos últimos Mu y resistentes Mn para dimensionamiento de vigas.",
    descriptionEn: "Ultimate and nominal bending moments for steel/concrete design.",
    units: [
      { id: "kn_m", symbol: "kN·m", nameEs: "Kilonewton metro (SI)", nameEn: "Kilonewton meter", toBaseFactor: 1000 },
      { id: "tonf_m", symbol: "tonf·m", nameEs: "Tonelada fuerza metro", nameEn: "Metric ton-force meter", toBaseFactor: 9806.65 },
      { id: "kgf_m", symbol: "kgf·m", nameEs: "Kilogramo fuerza metro", nameEn: "Kilogram-force meter", toBaseFactor: 9.80665 },
      { id: "kip_ft", symbol: "kip·ft", nameEs: "Kip pie (AISC)", nameEn: "Kip foot", toBaseFactor: 1355.8179 },
      { id: "kip_in", symbol: "kip·in", nameEs: "Kip pulgada", nameEn: "Kip inch", toBaseFactor: 112.9848 },
      { id: "n_m", symbol: "N·m", nameEs: "Newton metro", nameEn: "Newton meter", toBaseFactor: 1 },
      { id: "lbf_ft", symbol: "lbf·ft", nameEs: "Libra fuerza pie", nameEn: "Pound-force foot", toBaseFactor: 1.3558179 },
    ],
  },
  {
    id: "inertia",
    nameEs: "Momento de Inercia de Secciones (I)",
    nameEn: "Moment of Inertia (I)",
    icon: "fa-solid fa-shapes",
    descriptionEs: "Propiedades elásticas de inercia Ix, Iy en tablas de perfiles de acero.",
    descriptionEn: "Cross-section moment of inertia Ix, Iy from steel shape handbooks.",
    units: [
      { id: "cm4", symbol: "cm⁴", nameEs: "Centímetros a la cuarta (ICHA)", nameEn: "Centimeters^4 (ICHA)", toBaseFactor: 0.00000001 },
      { id: "in4", symbol: "in⁴", nameEs: "Pulgadas a la cuarta (AISC)", nameEn: "Inches^4 (AISC)", toBaseFactor: 0.0000004162314256 },
      { id: "mm4", symbol: "mm⁴", nameEs: "Milímetros a la cuarta", nameEn: "Millimeters^4", toBaseFactor: 0.000000000001 },
      { id: "m4", symbol: "m⁴", nameEs: "Metros a la cuarta", nameEn: "Meters^4", toBaseFactor: 1 },
    ],
  },
  {
    id: "section_modulus",
    nameEs: "Módulo de Sección Elástico & Plástico (S, Z)",
    nameEn: "Section Modulus (S, Z)",
    icon: "fa-solid fa-cube",
    descriptionEs: "Módulo resistente para cálculo a flexión en perfiles ICHA y AISC.",
    descriptionEn: "Elastic and plastic section modulus for flexural member sizing.",
    units: [
      { id: "cm3", symbol: "cm³", nameEs: "Centímetros cúbicos (ICHA)", nameEn: "Cubic centimeters (ICHA)", toBaseFactor: 0.000001 },
      { id: "in3", symbol: "in³", nameEs: "Pulgadas cúbicas (AISC)", nameEn: "Cubic inches (AISC)", toBaseFactor: 0.000016387064 },
      { id: "mm3", symbol: "mm³", nameEs: "Milímetros cúbicos", nameEn: "Cubic millimeters", toBaseFactor: 0.000000001 },
      { id: "m3", symbol: "m³", nameEs: "Metros cúbicos", nameEn: "Cubic meters", toBaseFactor: 1 },
    ],
  },
  {
    id: "area",
    nameEs: "Área de Sección & Superficie",
    nameEn: "Cross Section & Surface Area",
    icon: "fa-solid fa-border-all",
    descriptionEs: "Área de perfiles de acero, pintura y superficies de losas.",
    descriptionEn: "Steel profile cross-section area, paint coverage, and slab areas.",
    units: [
      { id: "cm2", symbol: "cm²", nameEs: "Centímetros cuadrados (ICHA)", nameEn: "Square centimeters", toBaseFactor: 0.0001 },
      { id: "mm2", symbol: "mm²", nameEs: "Milímetros cuadrados", nameEn: "Square millimeters", toBaseFactor: 0.000001 },
      { id: "m2", symbol: "m²", nameEs: "Metros cuadrados", nameEn: "Square meters", toBaseFactor: 1 },
      { id: "in2", symbol: "in²", nameEs: "Pulgadas cuadradas (AISC)", nameEn: "Square inches", toBaseFactor: 0.00064516 },
      { id: "ft2", symbol: "ft²", nameEs: "Pies cuadrados", nameEn: "Square feet", toBaseFactor: 0.09290304 },
    ],
  },
  {
    id: "distributed_load",
    nameEs: "Cargas Distribuidas (kN/m², kgf/cm², psf)",
    nameEn: "Distributed Loads & Pressures",
    icon: "fa-solid fa-layer-group",
    descriptionEs: "Sobrecargas de uso, viento y nieve según NCh 1537, ASCE 7 y Eurocódigo.",
    descriptionEn: "Live loads, wind and snow pressures from NCh 1537, ASCE 7 and Eurocode.",
    units: [
      { id: "kn_m2",  symbol: "kN/m²",      nameEs: "Kilonewton por m² (SI / Eurocódigo)", nameEn: "kN/m²",                 toBaseFactor: 1000 },
      { id: "kpa",    symbol: "kPa",          nameEs: "Kilopascales (= kN/m²)",             nameEn: "Kilopascals",           toBaseFactor: 1000 },
      { id: "pa",     symbol: "Pa",           nameEs: "Pascales",                            nameEn: "Pascals",               toBaseFactor: 1 },
      { id: "kgf_m2",symbol: "kgf/m²",       nameEs: "Kilogramos fuerza por m² (NCh/Latam)",nameEn: "kgf/m²",              toBaseFactor: 9.80665 },
      { id: "kgf_cm2",symbol: "kgf/cm²",     nameEs: "Kilogramos fuerza por cm²",           nameEn: "kgf/cm²",             toBaseFactor: 98066.5 },
      { id: "tf_m2",  symbol: "tf/m²",        nameEs: "Toneladas fuerza por m²",             nameEn: "tf/m²",               toBaseFactor: 9806.65 },
      { id: "psf",    symbol: "lb/ft² (psf)", nameEs: "Libras por pie² (ASCE 7)",           nameEn: "Pounds per sq foot",   toBaseFactor: 47.8803 },
      { id: "psi",    symbol: "psi",          nameEs: "Libras por pulgada²",                 nameEn: "psi",                  toBaseFactor: 6894.76 },
      { id: "ksf",    symbol: "ksf",          nameEs: "Kips por pie²",                       nameEn: "Kips per sq foot",     toBaseFactor: 47880.26 },
    ],
  },
  {
    id: "volume",
    nameEs: "Volumen (Hormigón, Áridos)",
    nameEn: "Volume (Concrete, Aggregates)",
    icon: "fa-solid fa-box",
    descriptionEs: "Cálculo de volúmenes para cubicación de hormigón, áridos y rellenos.",
    descriptionEn: "Concrete, aggregate, and fill volume estimation.",
    units: [
      { id: "m3",     symbol: "m³",   nameEs: "Metros cúbicos",        nameEn: "Cubic meters",    toBaseFactor: 1 },
      { id: "cm3",    symbol: "cm³",  nameEs: "Centímetros cúbicos",   nameEn: "Cubic cm",        toBaseFactor: 0.000001 },
      { id: "mm3",    symbol: "mm³",  nameEs: "Milímetros cúbicos",    nameEn: "Cubic mm",        toBaseFactor: 0.000000001 },
      { id: "l",      symbol: "L",    nameEs: "Litros",                nameEn: "Liters",          toBaseFactor: 0.001 },
      { id: "ft3",    symbol: "ft³",  nameEs: "Pies cúbicos",          nameEn: "Cubic feet",      toBaseFactor: 0.0283168 },
      { id: "in3",    symbol: "in³",  nameEs: "Pulgadas cúbicas",      nameEn: "Cubic inches",    toBaseFactor: 0.0000163871 },
      { id: "yd3",    symbol: "yd³",  nameEs: "Yardas cúbicas",        nameEn: "Cubic yards",     toBaseFactor: 0.764555 },
      { id: "gal_us",symbol: "gal",  nameEs: "Galones (US)",           nameEn: "US Gallons",      toBaseFactor: 0.00378541 },
    ],
  },
  {
    id: "mass_weight",
    nameEs: "Masa & Peso (Hormigón, Acero)",
    nameEn: "Mass & Weight",
    icon: "fa-solid fa-scale-balanced",
    descriptionEs: "Peso de vigas, pilares y cubicación de acero estructural.",
    descriptionEn: "Weight of beams, columns and steel takeoffs.",
    units: [
      { id: "kg",   symbol: "kg",    nameEs: "Kilogramos",      nameEn: "Kilograms",       toBaseFactor: 1 },
      { id: "t_met",symbol: "ton",   nameEs: "Toneladas métricas",nameEn: "Metric tons",     toBaseFactor: 1000 },
      { id: "g",    symbol: "g",     nameEs: "Gramos",           nameEn: "Grams",           toBaseFactor: 0.001 },
      { id: "lb",   symbol: "lb",    nameEs: "Libras masa",      nameEn: "Pounds (mass)",   toBaseFactor: 0.453592 },
      { id: "kip_m",symbol: "kip",   nameEs: "Kips (masa)",      nameEn: "Kips (mass)",     toBaseFactor: 453.592 },
      { id: "oz",   symbol: "oz",    nameEs: "Onzas",            nameEn: "Ounces",          toBaseFactor: 0.0283495 },
      { id: "short_ton",symbol:"US ton",nameEs: "Tonelada corta US",nameEn:"Short ton",     toBaseFactor: 907.185 },
    ],
  },
];

/**
 * Convierte un valor de una unidad origen a todas las unidades de su categoría
 */
export const convertMultiUnit = (
  value: number,
  sourceUnitId: string,
  category: UnitCategory
): Array<{ unit: UnitDefinition; value: number }> => {
  const sourceUnit = category.units.find((u) => u.id === sourceUnitId);
  if (!sourceUnit || isNaN(value)) {
    return category.units.map((u) => ({ unit: u, value: 0 }));
  }

  // Convertir a base
  const baseValue = value * sourceUnit.toBaseFactor;

  // Convertir de base a cada unidad
  return category.units.map((targetUnit) => {
    const converted = baseValue / targetUnit.toBaseFactor;
    return {
      unit: targetUnit,
      value: converted,
    };
  });
};

// ============================================================================
// Exportador Profesional a Excel (ExcelJS)
// ============================================================================

export const exportUnitConverterToExcel = async (
  footInchInput: { feet: number; inches: number; fractionText: string },
  footInchResult: {
    totalInches: number;
    totalMm: number;
    totalCm: number;
    totalMeters: number;
    architectural: string;
  },
  mmInput: number,
  mmResult: FootInchResult,
  equivalenceData: FractionEntry[]
): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Andrés Gallo P. · BIM Developer";
  workbook.created = new Date();

  // Hoja 1: Conversor Pie-Pulgada a Milímetros
  const sheet1 = workbook.addWorksheet("Pie-Pulgada ↔ Milímetros", {
    views: [{ showGridLines: true }],
  });

  // Estilos de cabecera
  sheet1.columns = [
    { header: "PARÁMETRO", key: "param", width: 30 },
    { header: "VALOR", key: "val", width: 22 },
    { header: "UNIDAD", key: "unit", width: 18 },
    { header: "NOTAS DE INGENIERÍA", key: "notes", width: 45 },
  ];

  // Header principal
  sheet1.mergeCells("A1:D1");
  const titleCell = sheet1.getCell("A1");
  titleCell.value = "MEMORIA DE CONVERSIÓN DE UNIDADES · ATELIJUDESIGN";
  titleCell.font = { name: "Arial", size: 14, bold: true, color: { argb: "FFFFFFFF" } };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0F172A" },
  };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  sheet1.getRow(1).height = 35;

  // Subtítulo Sección 1: Inch to Millimeters
  sheet1.addRow([]);
  const sec1 = sheet1.addRow([
    "1. CONVERSIÓN: PULGADA/PIE A MILÍMETROS (Inch to Millimeters)",
  ]);
  sec1.font = { bold: true, color: { argb: "FF2563EB" }, size: 11 };

  sheet1.addRow(["Pies (Foot)", footInchInput.feet, "ft", "Pies enteros o decimales"]);
  sheet1.addRow(["Pulgadas (Inch)", footInchInput.inches, "in", "Pulgadas enteras"]);
  sheet1.addRow(["Fracción de pulgada", footInchInput.fractionText || "0", "in", "Subdivisión de pulgada"]);
  sheet1.addRow(["TOTAL PULGADAS (total inch)", footInchResult.totalInches, "inch", "Pulgadas totales calculadas"]);
  sheet1.addRow(["TOTAL MILÍMETROS (total mm)", footInchResult.totalMm, "mm", "Milímetros exactos (factor 25.4)"]);
  sheet1.addRow(["Total Centímetros", footInchResult.totalCm, "cm", "Milímetros / 10"]);
  sheet1.addRow(["Total Metros", footInchResult.totalMeters, "m", "Cota en metros para planos"]);
  sheet1.addRow(["Notación Arquitectónica", footInchResult.architectural, "-", "Estándar BIM / Revit"]);

  // Subtítulo Sección 2: Millimeters to Inch
  sheet1.addRow([]);
  const sec2 = sheet1.addRow([
    "2. CONVERSIÓN: MILÍMETROS A PULGADA/PIE (Millimeters to Inch)",
  ]);
  sec2.font = { bold: true, color: { argb: "FF0D9488" }, size: 11 };

  sheet1.addRow(["Entrada Milímetros (mm)", mmInput, "mm", "Valor métrico de entrada"]);
  sheet1.addRow(["Pies (Foot)", mmResult.feet, "ft", "Pies enteros resultantes"]);
  sheet1.addRow(["Pulgadas (Inch - Nominal)", mmResult.nominalInchesRounded, "in", "Pulgadas redondeadas (como en Excel)"]);
  sheet1.addRow(["Pulgadas (Enteras fraccionadas)", mmResult.inches, "in", "Pulgadas enteras sin fracción"]);
  sheet1.addRow(["Fracción más cercana", mmResult.fractionText || "0", "in", "Aproximación por denominador seleccionado"]);
  sheet1.addRow(["Notación Arquitectónica Completa", mmResult.architecturalString, "-", "Cota estándar imperial"]);
  sheet1.addRow(["Total en Pulgadas Decimales", mmResult.totalInches, "in", "Valor decimal exacto"]);
  sheet1.addRow(["Error Residual de Fracción", mmResult.residualErrorMm.toFixed(3), "mm", "Desviación nominal de la fracción"]);

  // Hoja 2: Tabla de Equivalencias (Equivalence Table)
  const sheet2 = workbook.addWorksheet("Tabla de Equivalencias", {
    views: [{ showGridLines: true }],
  });

  sheet2.columns = [
    { header: "FRACCIÓN BASE (/16)", key: "base", width: 22 },
    { header: "FRACCIÓN SIMPLIFICADA", key: "simplified", width: 25 },
    { header: "PULGADA DECIMAL (in)", key: "dec_in", width: 24 },
    { header: "MILÍMETROS (mm)", key: "mm", width: 20 },
    { header: "CENTÍMETROS (cm)", key: "cm", width: 20 },
  ];

  sheet2.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet2.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E293B" },
  };

  equivalenceData.forEach((row) => {
    sheet2.addRow([
      row.baseFraction,
      row.simplifiedFraction,
      row.decimalInch.toFixed(4),
      row.decimalMm.toFixed(4),
      row.decimalCm.toFixed(4),
    ]);
  });

  // Generar Buffer y Descargar
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Conversion_Unidades_Pie_Pulgada_mm_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// ============================================================================
// ─── HERRAMIENTAS DE DIBUJO Y ESCALA ─────────────────────────────────────────
// ============================================================================

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface ScaleResult {
  /** Medida en papel (mm) */
  paperMm: number;
  /** Medida real (mm) */
  realMm: number;
  /** Factor de escala numérico (ej. 50 para 1:50) */
  scaleFactor: number;
}

export interface DimscaleResult {
  /** Valor de DIMSCALE / LTSCALE recomendado */
  dimscale: number;
  /** Altura de texto en espacio modelo para leer 2.5mm en papel */
  textHeight25mm: number;
  /** Altura de texto en espacio modelo para leer 3.5mm en papel */
  textHeight35mm: number;
  /** Altura de texto en espacio modelo para leer 5mm en papel */
  textHeight5mm: number;
  /** Tamaño de flecha en espacio modelo */
  arrowSize: number;
  /** Factor de escala de la escala de dibujo (denominador de 1:N) */
  scaleFactor: number;
}

export interface SlopeResult {
  /** Porcentaje (%) */
  percent: number;
  /** Grados decimales */
  degrees: number;
  /** Radianes */
  radians: number;
  /** Relación H:V (horizontal por cada 1 vertical), ej: 10 para pendiente 1:10 */
  ratioHV: number;
  /** Relación V:H (vertical por cada 1 horizontal), ej: 0.1 para 10% */
  ratioVH: number;
  /** Texto descriptivo relación, ej: "1:10" */
  ratioText: string;
}

export interface TemperatureResult {
  celsius: number;
  fahrenheit: number;
  kelvin: number;
  rankine: number;
}

export interface PaperSize {
  name: string;
  widthMm: number;
  heightMm: number;
  widthIn: number;
  heightIn: number;
  area: string;
}

export interface DrawingScalePreset {
  label: string;
  factor: number;
}

// ─── Escalas Estándar de Dibujo ─────────────────────────────────────────────

export const DRAWING_SCALE_PRESETS: DrawingScalePreset[] = [
  { label: "1:1",    factor: 1 },
  { label: "1:2",    factor: 2 },
  { label: "1:5",    factor: 5 },
  { label: "1:10",   factor: 10 },
  { label: "1:20",   factor: 20 },
  { label: "1:25",   factor: 25 },
  { label: "1:33",   factor: 33 },
  { label: "1:40",   factor: 40 },
  { label: "1:50",   factor: 50 },
  { label: "1:75",   factor: 75 },
  { label: "1:100",  factor: 100 },
  { label: "1:125",  factor: 125 },
  { label: "1:150",  factor: 150 },
  { label: "1:200",  factor: 200 },
  { label: "1:250",  factor: 250 },
  { label: "1:400",  factor: 400 },
  { label: "1:500",  factor: 500 },
  { label: "1:1000", factor: 1000 },
];

// ─── Tamaños de Papel ISO & ANSI ────────────────────────────────────────────

export const PAPER_SIZES: PaperSize[] = [
  { name: "A0",       widthMm: 841,  heightMm: 1189, widthIn: 33.11, heightIn: 46.81, area: "1.189 m²" },
  { name: "A1",       widthMm: 594,  heightMm: 841,  widthIn: 23.39, heightIn: 33.11, area: "0.500 m²" },
  { name: "A2",       widthMm: 420,  heightMm: 594,  widthIn: 16.54, heightIn: 23.39, area: "0.250 m²" },
  { name: "A3",       widthMm: 297,  heightMm: 420,  widthIn: 11.69, heightIn: 16.54, area: "0.125 m²" },
  { name: "A4",       widthMm: 210,  heightMm: 297,  widthIn: 8.27,  heightIn: 11.69, area: "0.063 m²" },
  { name: "A5",       widthMm: 148,  heightMm: 210,  widthIn: 5.83,  heightIn: 8.27,  area: "0.031 m²" },
  { name: "ANSI A",   widthMm: 216,  heightMm: 279,  widthIn: 8.5,   heightIn: 11.0,  area: "0.060 m²" },
  { name: "ANSI B",   widthMm: 279,  heightMm: 432,  widthIn: 11.0,  heightIn: 17.0,  area: "0.121 m²" },
  { name: "ANSI C",   widthMm: 432,  heightMm: 559,  widthIn: 17.0,  heightIn: 22.0,  area: "0.241 m²" },
  { name: "ANSI D",   widthMm: 559,  heightMm: 864,  widthIn: 22.0,  heightIn: 34.0,  area: "0.483 m²" },
  { name: "ANSI E",   widthMm: 864,  heightMm: 1118, widthIn: 34.0,  heightIn: 44.0,  area: "0.965 m²" },
];

// ─── Funciones de Cálculo ────────────────────────────────────────────────────

/**
 * Convierte medida real a medida en papel y viceversa
 * @param realMm - Dimensión en el mundo real (mm)
 * @param scaleFactor - Denominador de la escala (ej. 50 para 1:50)
 */
export const calcScaleRule = (realMm: number, scaleFactor: number): ScaleResult => {
  const isValid = !isNaN(realMm) && !isNaN(scaleFactor) && scaleFactor > 0;
  return {
    paperMm: isValid ? realMm / scaleFactor : 0,
    realMm: isValid ? realMm : 0,
    scaleFactor,
  };
};

/**
 * Obtiene dimensión real desde una medida en papel
 */
export const calcRealFromPaper = (paperMm: number, scaleFactor: number): ScaleResult => {
  const isValid = !isNaN(paperMm) && !isNaN(scaleFactor) && scaleFactor > 0;
  return {
    paperMm: isValid ? paperMm : 0,
    realMm: isValid ? paperMm * scaleFactor : 0,
    scaleFactor,
  };
};

/**
 * Calcula DIMSCALE, LTSCALE, alturas de texto y tamaño de flechas para AutoCAD / Revit
 * @param scaleFactor - Denominador de la escala (ej. 50 para 1:50)
 */
export const calcDimscale = (scaleFactor: number): DimscaleResult => {
  const isValid = !isNaN(scaleFactor) && scaleFactor > 0;
  const f = isValid ? scaleFactor : 1;
  return {
    dimscale: f,
    textHeight25mm: 2.5 * f,
    textHeight35mm: 3.5 * f,
    textHeight5mm: 5 * f,
    arrowSize: 2.5 * f,
    scaleFactor: f,
  };
};

/**
 * Convierte pendiente entre %, grados, radianes y relación X:Y
 * @param value - Valor numérico de la pendiente
 * @param inputType - Tipo de entrada: "percent" | "degrees" | "ratio_hv"
 */
export const calcSlope = (
  value: number,
  inputType: "percent" | "degrees" | "ratio_hv"
): SlopeResult => {
  if (isNaN(value) || value < 0) {
    return { percent: 0, degrees: 0, radians: 0, ratioHV: 0, ratioVH: 0, ratioText: "1:∞" };
  }

  let radians = 0;

  if (inputType === "percent") {
    radians = Math.atan(value / 100);
  } else if (inputType === "degrees") {
    radians = (value * Math.PI) / 180;
  } else if (inputType === "ratio_hv") {
    // ratio_hv: horizontal por cada 1 vertical, ej: 10 = 1:10 = 10%
    radians = value > 0 ? Math.atan(1 / value) : Math.PI / 2;
  }

  const tan = Math.tan(radians);
  const percent = tan * 100;
  const degrees = (radians * 180) / Math.PI;
  const ratioHV = tan > 0 ? 1 / tan : Infinity;
  const ratioVH = tan;

  let ratioText: string;
  if (ratioHV === Infinity || tan === 0) {
    ratioText = "Horizontal (0%°)";
  } else if (ratioHV < 100) {
    ratioText = `1:${ratioHV.toFixed(1)}`;
  } else {
    ratioText = `1:${Math.round(ratioHV)}`;
  }

  return { percent, degrees, radians, ratioHV, ratioVH, ratioText };
};

/**
 * Convierte temperatura entre Celsius, Fahrenheit, Kelvin y Rankine
 */
export const convertTemperature = (value: number, from: "celsius" | "fahrenheit" | "kelvin"): TemperatureResult => {
  if (isNaN(value)) {
    return { celsius: 0, fahrenheit: 32, kelvin: 273.15, rankine: 491.67 };
  }

  let celsius: number;

  if (from === "celsius") {
    celsius = value;
  } else if (from === "fahrenheit") {
    celsius = (value - 32) * (5 / 9);
  } else {
    celsius = value - 273.15;
  }

  return {
    celsius,
    fahrenheit: celsius * (9 / 5) + 32,
    kelvin: celsius + 273.15,
    rankine: (celsius + 273.15) * (9 / 5),
  };
};
