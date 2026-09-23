import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { useTranslation } from "../context/LanguageContext";
import {
  generateEquivalenceTable,
  convertFootInchToMm,
  convertMmToFootInch,
  ENGINEERING_UNIT_CATEGORIES,
  convertMultiUnit,
  exportUnitConverterToExcel,
  FractionEntry,
  FootInchResult,
  UnitCategory,
  ConversionHistoryItem,
  // ─ Dibujo ─
  DRAWING_SCALE_PRESETS,
  PAPER_SIZES,
  calcScaleRule,
  calcRealFromPaper,
  calcDimscale,
  calcSlope,
  convertTemperature,
  ScaleResult,
  DimscaleResult,
  SlopeResult,
  TemperatureResult,
} from "../utils/unitConverterUtils";

// Opciones de fracciones comunes de 1/16" para selección rápida
const COMMON_FRACTIONS = [
  { label: '0"', value: 0 },
  { label: '1/16"', value: 1 / 16 },
  { label: '1/8"', value: 2 / 16 },
  { label: '3/16"', value: 3 / 16 },
  { label: '1/4"', value: 4 / 16 },
  { label: '5/16"', value: 5 / 16 },
  { label: '3/8"', value: 6 / 16 },
  { label: '7/16"', value: 7 / 16 },
  { label: '1/2"', value: 8 / 16 },
  { label: '9/16"', value: 9 / 16 },
  { label: '5/8"', value: 10 / 16 },
  { label: '11/16"', value: 11 / 16 },
  { label: '3/4"', value: 12 / 16 },
  { label: '13/16"', value: 13 / 16 },
  { label: '7/8"', value: 14 / 16 },
  { label: '15/16"', value: 15 / 16 },
];

export const UnitConverter: React.FC = () => {
  const { language } = useTranslation();
  const isEn = language === "en";

  // ─── Pestaña Activa: "foot-inch" | "engineering" | "drawing" ───
  const [activeTab, setActiveTab] = useState<"foot-inch" | "engineering" | "drawing">("foot-inch");

  // ─── Estado Sección 1: Inch to Millimeters ───
  // Valores iniciales tomados directamente de la imagen del usuario: 1 foot, 3 inch, 0 fraction
  const [footInput, setFootInput] = useState<number>(1);
  const [inchInput, setInchInput] = useState<number>(3);
  const [fractionInput, setFractionInput] = useState<number>(0);
  const [fractionTextCustom, setFractionTextCustom] = useState<string>("0");

  // ─── Estado Sección 2: Millimeters to Inch ───
  // Valor inicial tomado de la imagen del usuario: 1600 mm
  const [mmInput, setMmInput] = useState<number>(1600);
  const [precisionDenominator, setPrecisionDenominator] = useState<number>(16);

  // ─── Estado Sección 3: Tabla de Equivalencias ───
  const [tableDenominator, setTableDenominator] = useState<number>(16);
  const [tableSearchQuery, setTableSearchQuery] = useState<string>("");

  // ─── Estado Sección 4: Convertidor Multidimensional ───
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("linear_mass");
  const [multiUnitValue, setMultiUnitValue] = useState<number>(90); // default ej: W14x90 -> 90 lb/ft
  const [sourceUnitId, setSourceUnitId] = useState<string>("lb_ft");

  // ─── Estado Pestaña Drawing: Regla de Escala ───
  const [scaleMode, setScaleMode] = useState<"real-to-paper" | "paper-to-real">("real-to-paper");
  const [scaleRealInput, setScaleRealInput] = useState<number>(5400); // en la unidad seleccionada
  const [scalePaperInput, setScalePaperInput] = useState<number>(108); // en mm siempre (papel)
  const [scaleInputUnit, setScaleInputUnit] = useState<"mm" | "cm" | "m">("mm");
  const [selectedScaleFactor, setSelectedScaleFactor] = useState<number>(50);
  const [customScaleFactor, setCustomScaleFactor] = useState<string>("");

  // ─── Estado Pestaña Drawing: Pendientes ───
  const [slopeInputType, setSlopeInputType] = useState<"percent" | "degrees" | "ratio_hv">("percent");
  const [slopeValue, setSlopeValue] = useState<number>(2);

  // ─── Estado Pestaña Drawing: Temperatura ───
  const [tempValue, setTempValue] = useState<number>(20);
  const [tempFrom, setTempFrom] = useState<"celsius" | "fahrenheit" | "kelvin">("celsius");

  // ─── Feedback y Copiado ───
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExportingExcel, setIsExportingExcel] = useState<boolean>(false);

  // ─── Historial de Conversiones Recientes ───
  const [conversionHistory, setConversionHistory] = useState<ConversionHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("unit-converter-history");
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignorar error de JSON parse
    }
    return [];
  });

  // Guardar historial en localStorage
  useEffect(() => {
    try {
      localStorage.setItem("unit-converter-history", JSON.stringify(conversionHistory.slice(0, 10)));
    } catch {
      // Ignorar cuota excedida
    }
  }, [conversionHistory]);

  const addHistoryEntry = (
    type: "foot-inch-to-mm" | "mm-to-foot-inch" | "multi-unit",
    inputDisplay: string,
    resultDisplay: string,
    category?: string
  ) => {
    const newItem: ConversionHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      type,
      inputDisplay,
      resultDisplay,
      category,
    };
    setConversionHistory((prev) => [newItem, ...prev.filter((p) => p.inputDisplay !== inputDisplay)].slice(0, 8));
  };

  const clearHistory = () => {
    setConversionHistory([]);
    try {
      localStorage.removeItem("unit-converter-history");
    } catch {
      // noop
    }
  };

  // ─── Cálculos Sección 1: Foot-Inch a Milímetros ───
  const footInchResult = useMemo(() => {
    return convertFootInchToMm(footInput, inchInput, fractionInput);
  }, [footInput, inchInput, fractionInput]);

  // ─── Cálculos Sección 2: Milímetros a Foot-Inch ───
  const mmResult: FootInchResult = useMemo(() => {
    return convertMmToFootInch(mmInput, precisionDenominator);
  }, [mmInput, precisionDenominator]);

  // ─── Generación de Tabla de Equivalencias ───
  const equivalenceTable: FractionEntry[] = useMemo(() => {
    return generateEquivalenceTable(tableDenominator);
  }, [tableDenominator]);

  const filteredEquivalenceTable = useMemo(() => {
    if (!tableSearchQuery.trim()) return equivalenceTable;
    const q = tableSearchQuery.toLowerCase().trim();
    return equivalenceTable.filter((row) => {
      const matchBase = row.baseFraction.toLowerCase().includes(q);
      const matchSimple = row.simplifiedFraction.toLowerCase().includes(q);
      const matchInch = row.decimalInch.toFixed(4).includes(q);
      const matchMm = row.decimalMm.toFixed(2).includes(q);
      return matchBase || matchSimple || matchInch || matchMm;
    });
  }, [equivalenceTable, tableSearchQuery]);

  // ─── Cálculos Convertidor Multidimensional ───
  const currentCategory: UnitCategory = useMemo(() => {
    const found = ENGINEERING_UNIT_CATEGORIES.find((c) => c.id === selectedCategoryId);
    return found || ENGINEERING_UNIT_CATEGORIES[0];
  }, [selectedCategoryId]);

  // Asegurar que sourceUnitId sea válido al cambiar categoría
  useEffect(() => {
    const hasUnit = currentCategory.units.some((u) => u.id === sourceUnitId);
    if (!hasUnit && currentCategory.units.length > 0) {
      setSourceUnitId(currentCategory.units[0].id);
    }
  }, [selectedCategoryId, currentCategory, sourceUnitId]);

  const multiUnitResults = useMemo(() => {
    return convertMultiUnit(multiUnitValue, sourceUnitId, currentCategory);
  }, [multiUnitValue, sourceUnitId, currentCategory]);

  // ─── Cálculos Pestaña Drawing ───
  const effectiveScaleFactor = useMemo(() => {
    const custom = parseFloat(customScaleFactor);
    return !isNaN(custom) && custom > 0 ? custom : selectedScaleFactor;
  }, [customScaleFactor, selectedScaleFactor]);

  const scaleInputToMm = useMemo(() => {
    if (scaleInputUnit === "cm") return scaleRealInput * 10;
    if (scaleInputUnit === "m")  return scaleRealInput * 1000;
    return scaleRealInput;
  }, [scaleRealInput, scaleInputUnit]);

  const scaleResult: ScaleResult = useMemo(() => {
    if (scaleMode === "real-to-paper") return calcScaleRule(scaleInputToMm, effectiveScaleFactor);
    return calcRealFromPaper(scalePaperInput, effectiveScaleFactor);
  }, [scaleMode, scaleInputToMm, scalePaperInput, effectiveScaleFactor]);

  const dimscaleResult: DimscaleResult = useMemo(() => calcDimscale(effectiveScaleFactor), [effectiveScaleFactor]);

  const slopeResult: SlopeResult = useMemo(() => calcSlope(slopeValue, slopeInputType), [slopeValue, slopeInputType]);

  const tempResult: TemperatureResult = useMemo(() => convertTemperature(tempValue, tempFrom), [tempValue, tempFrom]);

  // ─── Manejador de Copiado al Portapapeles ───
  const handleCopyText = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ─── Manejador Exportar a Excel ───
  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      await exportUnitConverterToExcel(
        {
          feet: footInput,
          inches: inchInput,
          fractionText: fractionTextCustom,
        },
        {
          totalInches: footInchResult.totalInches,
          totalMm: footInchResult.totalMm,
          totalCm: footInchResult.totalCm,
          totalMeters: footInchResult.totalMeters,
          architectural: footInchResult.architecturalString,
        },
        mmInput,
        mmResult,
        equivalenceTable
      );
    } catch (err) {
      console.error("Error al exportar a Excel:", err);
    } finally {
      setIsExportingExcel(false);
    }
  };

  // ─── Transferir selección de la tabla a los inputs ───
  const handleSelectFractionFromTable = (row: FractionEntry) => {
    setFractionInput(row.decimalInch);
    setFractionTextCustom(row.simplifiedFraction);
  };

  // ─── Regla / Visualizador Gráfico Escala Arquitectónica ───
  const targetTotalInches = activeTab === "foot-inch" ? footInchResult.totalInches : mmResult.totalInches;
  const targetTotalMm = activeTab === "foot-inch" ? footInchResult.totalMm : mmInput;

  return (
    <div className="bg-[#080c14] min-h-screen pt-24 pb-16">
      <SEOHead
        title={
          isEn
            ? "Foot-Inch to Millimeters & Engineering Unit Converter"
            : "Convertidor Pie-Pulgada a mm & Unidades de Ingeniería Estructural"
        }
        description={
          isEn
            ? "Interactive engineering converter: Foot, Inch and fractions to millimeters, mm to imperial, fraction equivalence tables, and steel profile takeoff units."
            : "Convertidor interactivo de ingeniería: Pies, pulgadas y fracciones a milímetros, mm a pies-pulgadas, tabla de equivalencias de 1/16 y unidades de perfiles estructurales."
        }
        path="/herramientas/convertidor-unidades"
        keywords="convertidor pie pulgada a mm, inch to mm converter, tabla equivalencias fracciones pulgada, calculador fracciones a decimales, unidades ingenieria civil estructural"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: isEn
            ? "Foot-Inch to Millimeters & Structural Engineering Unit Converter"
            : "Convertidor Pie-Pulgada a Milímetros & Unidades Estructurales",
          applicationCategory: "EngineeringApplication",
          operatingSystem: "Web Browser",
          description: isEn
            ? "Precision bidirectional converter between imperial architectural dimensions (feet-inch-fraction) and metric units (mm, cm, m), plus structural engineering units."
            : "Convertidor de precisión bidireccional entre dimensiones arquitectónicas imperiales (pie-pulgada-fracción) y métricas (mm, cm, m), más unidades de ingeniería estructural.",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navegación Superior Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            to="/herramientas"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700/50 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm group"
          >
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform" />
            {isEn ? "Back to Tools Catalog" : "Volver a Herramientas"}
          </Link>

          {/* Botones Rápidos de Acción */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={isExportingExcel}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-3.5 py-2 rounded-xl transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50"
              title="Descargar reporte en formato Microsoft Excel"
            >
              <i className={`fa-solid ${isExportingExcel ? "fa-spinner fa-spin" : "fa-file-excel"}`} />
              {isExportingExcel ? (isEn ? "Exporting..." : "Exportando...") : (isEn ? "Export Excel" : "Exportar Excel")}
            </button>
          </div>
        </div>

        {/* Encabezado Principal */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold mb-4 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            // {isEn ? "STRUCTURAL & BIM DIMENSIONS" : "DIMENSIONAMIENTO ESTRUCTURAL & BIM"}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-grotesk tracking-tight mb-4">
            {isEn ? "Foot-Inch & " : "Convertidor "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">
              {isEn ? "Metric Converter" : "Pie-Pulgada a Milímetros"}
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "Accurate conversion between imperial architectural feet-inches-fractions, metric millimeters, fraction lookup tables, and structural engineering units."
              : "Conversión de alta precisión entre cotas imperiales (pie, pulgada y fracciones), milímetros, tabla de equivalencias de 1/16 y unidades de perfiles de acero."}
          </p>

          {/* Selector de Pestañas de Modo */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <button
                type="button"
                onClick={() => setActiveTab("foot-inch")}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "foot-inch"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <i className="fa-solid fa-ruler" />
                {isEn ? "Foot-Inch ↔ Millimeters (Excel Mode)" : "Pie-Pulgada ↔ Milímetros (Lámina Excel)"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("engineering")}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "engineering"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <i className="fa-solid fa-shapes" />
                {isEn ? "Multi-Unit Engineering & Steel" : "Unidades de Ingeniería & Acero"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("drawing")}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "drawing"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <i className="fa-solid fa-pencil-ruler" />
                {isEn ? "Drawing & Scale Tools" : "Herramientas de Dibujo"}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PESTAÑA 1: MODO PRINCIPAL PIE-PULGADA ↔ MM (REPLICA EXACTA Y MEJORADA DEL EXCEL) */}
        {/* ========================================================================= */}
        {activeTab === "foot-inch" && (
          <div className="space-y-8">
            
            {/* Bento Grid Principal: 2 Secciones de Conversión Bidireccional */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ─────────────────────────────────────────────────────────────
                  TARJETA 1: INCH TO MILLIMETERS (Pie/Pulgada a Milímetros)
                  Reproduce exactamente el primer bloque de la imagen del usuario
                 ───────────────────────────────────────────────────────────── */}
              <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/90 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <i className="fa-solid fa-arrow-right-arrow-left" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                          // SECCIÓN 1 · ENTRADA IMPERIAL
                        </span>
                        <h2 className="text-xl font-black text-white font-grotesk">
                          Inch to Millimeters
                        </h2>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800/60">
                      Imperial → Métrico
                    </span>
                  </div>

                  {/* Fila de Entradas: foot | inch | fraction (exacto al recuadro rojo de la imagen) */}
                  <div className="mb-6">
                    <div className="grid grid-cols-3 gap-3 mb-2 text-center text-xs font-mono font-bold uppercase text-slate-400">
                      <div>foot (pies)</div>
                      <div>inch (pulgadas)</div>
                      <div>fracción</div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-2 rounded-xl bg-slate-950 border-2 border-red-500/80 shadow-lg shadow-red-500/5">
                      {/* Input Foot */}
                      <div className="relative">
                        <input
                          id="input-foot"
                          type="number"
                          step="any"
                          value={isNaN(footInput) ? "" : footInput}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setFootInput(val);
                            addHistoryEntry(
                              "foot-inch-to-mm",
                              `${val || 0}' - ${inchInput}"`,
                              `${((val || 0) * 12 + inchInput) * 25.4} mm`
                            );
                          }}
                          className="w-full bg-slate-900 text-blue-400 font-mono font-extrabold text-2xl text-center py-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                          placeholder="1"
                        />
                        <label htmlFor="input-foot" className="sr-only">Pies (Foot)</label>
                      </div>

                      {/* Input Inch */}
                      <div className="relative">
                        <input
                          id="input-inch"
                          type="number"
                          step="any"
                          value={isNaN(inchInput) ? "" : inchInput}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setInchInput(val);
                            addHistoryEntry(
                              "foot-inch-to-mm",
                              `${footInput}' - ${val || 0}"`,
                              `${(footInput * 12 + (val || 0)) * 25.4} mm`
                            );
                          }}
                          className="w-full bg-slate-900 text-blue-400 font-mono font-extrabold text-2xl text-center py-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                          placeholder="3"
                        />
                        <label htmlFor="input-inch" className="sr-only">Pulgadas (Inch)</label>
                      </div>

                      {/* Selector de Fracción de Pulgada */}
                      <div className="relative">
                        <select
                          id="select-fraction"
                          value={fractionInput}
                          onChange={(e) => {
                            const numVal = parseFloat(e.target.value);
                            setFractionInput(numVal);
                            const matched = COMMON_FRACTIONS.find((f) => Math.abs(f.value - numVal) < 0.0001);
                            setFractionTextCustom(matched ? matched.label.replace('"', "") : `${numVal}`);
                          }}
                          className="w-full bg-slate-900 text-blue-400 font-mono font-extrabold text-lg text-center py-3 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                          {COMMON_FRACTIONS.map((f) => (
                            <option key={f.label} value={f.value} className="bg-slate-900 text-slate-200">
                              {f.label}
                            </option>
                          ))}
                        </select>
                        <label htmlFor="select-fraction" className="sr-only">Fracción de Pulgada</label>
                      </div>
                    </div>

                    {/* Chips de selección rápida de fracción */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      <span className="text-[11px] font-mono text-slate-500 mr-1">Rápido:</span>
                      {COMMON_FRACTIONS.slice(0, 9).map((f) => (
                        <button
                          key={f.label}
                          type="button"
                          onClick={() => {
                            setFractionInput(f.value);
                            setFractionTextCustom(f.label.replace('"', ""));
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                            Math.abs(fractionInput - f.value) < 0.0001
                              ? "bg-blue-600 text-white font-bold"
                              : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resultados Destacados (Total inch y Total mm en recuadros negros/rojos como en la imagen) */}
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    
                    {/* total inch */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                          total:
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-5 py-2 rounded-lg bg-slate-900 border-2 border-slate-700 font-mono font-black text-2xl text-red-500 tracking-wider shadow-inner">
                          {footInchResult.totalInches % 1 === 0
                            ? footInchResult.totalInches.toFixed(0)
                            : footInchResult.totalInches.toFixed(4)}
                        </div>
                        <span className="font-mono text-sm font-bold text-slate-300 w-12">
                          inch
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText(
                              `${footInchResult.totalInches.toFixed(4)} in`,
                              "copy-inch"
                            )
                          }
                          className="text-slate-500 hover:text-white p-2 transition-colors"
                          title="Copiar pulgadas"
                        >
                          <i className={`fa-solid ${copiedKey === "copy-inch" ? "fa-check text-emerald-400" : "fa-copy"}`} />
                        </button>
                      </div>
                    </div>

                    {/* total mm */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                          total:
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-5 py-2 rounded-lg bg-slate-900 border-2 border-slate-700 font-mono font-black text-2xl text-red-500 tracking-wider shadow-inner">
                          {footInchResult.totalMm % 1 === 0
                            ? footInchResult.totalMm.toFixed(0)
                            : footInchResult.totalMm.toFixed(2)}
                        </div>
                        <span className="font-mono text-sm font-bold text-slate-300 w-12">
                          mm.
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText(
                              `${footInchResult.totalMm.toFixed(2)} mm`,
                              "copy-mm"
                            )
                          }
                          className="text-slate-500 hover:text-white p-2 transition-colors"
                          title="Copiar milímetros"
                        >
                          <i className={`fa-solid ${copiedKey === "copy-mm" ? "fa-check text-emerald-400" : "fa-copy"}`} />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Sub-valores de Ingeniería Complementarios */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/50">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Centímetros</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-200">
                      {footInchResult.totalCm.toFixed(2)} cm
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/50">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Metros (Cota)</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-cyan-400">
                      {footInchResult.totalMeters.toFixed(3)} m
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/50">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Notación Cota</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-amber-400">
                      {footInchResult.architecturalString}
                    </span>
                  </div>
                </div>

              </div>

              {/* ─────────────────────────────────────────────────────────────
                  TARJETA 2: MILLIMETERS TO INCH (Milímetros a Pulgadas/Pies)
                  Reproduce exactamente el segundo bloque de la imagen del usuario
                 ───────────────────────────────────────────────────────────── */}
              <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/90 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <i className="fa-solid fa-arrows-split-up-and-left" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                          // SECCIÓN 2 · ENTRADA MÉTRICA
                        </span>
                        <h2 className="text-xl font-black text-white font-grotesk">
                          Millimeters to Inch
                        </h2>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                      Métrico → Imperial
                    </span>
                  </div>

                  {/* Fila de Entradas: mm. (recuadro rojo de la imagen) */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold uppercase text-slate-400">
                        mm. (Milímetros de entrada)
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono text-slate-500">Resolución:</span>
                        {[16, 32, 64].map((den) => (
                          <button
                            key={den}
                            type="button"
                            onClick={() => setPrecisionDenominator(den)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                              precisionDenominator === den
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            1/{den}"
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-950 border-2 border-red-500/80 shadow-lg shadow-red-500/5">
                      <div className="relative">
                        <input
                          id="input-mm"
                          type="number"
                          step="any"
                          value={isNaN(mmInput) ? "" : mmInput}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setMmInput(val);
                            const converted = convertMmToFootInch(val, precisionDenominator);
                            addHistoryEntry(
                              "mm-to-foot-inch",
                              `${val || 0} mm`,
                              `${converted.feet}' - ${converted.nominalInchesRounded}"`
                            );
                          }}
                          className="w-full bg-slate-900 text-red-500 font-mono font-extrabold text-3xl text-center py-3 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                          placeholder="1600"
                        />
                        <label htmlFor="input-mm" className="sr-only">Milímetros (mm)</label>
                      </div>
                    </div>

                    {/* Botones de prueba rápida (Presets de taller) */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      <span className="text-[11px] font-mono text-slate-500 mr-1">Típicos:</span>
                      {[100, 381, 600, 1000, 1200, 1600, 2440, 3000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setMmInput(preset)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                            mmInput === preset
                              ? "bg-emerald-600 text-white font-bold"
                              : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                          }`}
                        >
                          {preset} mm
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resultados Destacados (foot | inch en recuadro negro como en la imagen) */}
                  <div className="pt-4 border-t border-slate-800">
                    <div className="grid grid-cols-2 gap-3 mb-2 text-center text-xs font-mono font-bold uppercase text-slate-400">
                      <div>foot (pies)</div>
                      <div>inch (pulgadas redondeadas)</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950 border-2 border-slate-700 shadow-inner">
                      <div className="text-center font-mono font-black text-3xl text-red-500 py-1">
                        {mmResult.feet}
                      </div>
                      <div className="text-center font-mono font-black text-3xl text-red-500 py-1">
                        {mmResult.nominalInchesRounded}
                      </div>
                    </div>

                    {/* Desglose de Alta Precisión Fraccional (Ingeniería de Taller) */}
                    <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 block uppercase">
                          Notación Exacta con Fracción (1/{precisionDenominator}")
                        </span>
                        <div className="font-mono text-lg font-bold text-white mt-0.5">
                          {mmResult.architecturalString}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">
                          Error Residual (Δ)
                        </span>
                        <span
                          className={`font-mono text-xs font-bold ${
                            Math.abs(mmResult.residualErrorMm) < 0.5
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }`}
                        >
                          {mmResult.residualErrorMm >= 0 ? "+" : ""}
                          {mmResult.residualErrorMm.toFixed(3)} mm
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Sub-valores de Ingeniería Complementarios */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/50">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Total Decimal</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-200">
                      {mmResult.totalInches.toFixed(4)}"
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/50">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Metros Exactos</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400">
                      {mmResult.totalMeters.toFixed(3)} m
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/50">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Pies Decimales</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-blue-400">
                      {(mmResult.totalInches / 12).toFixed(3)} ft
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* ─────────────────────────────────────────────────────────────
                TARJETA 3: REGLA ARQUITECTÓNICA & VISUALIZADOR INTERACTIVO
                Muestra visualmente la cota sobre una cinta métrica graduada
               ───────────────────────────────────────────────────────────── */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/90 shadow-2xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <i className="fa-solid fa-tape" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-grotesk">
                      {isEn ? "Visual Architectural Tape Scale" : "Regla Visual de Taller (Escala Dual in / mm)"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isEn
                        ? "Real-time alignment between inches and millimeters"
                        : "Alineación gráfica directa entre subdivisiones imperiales y milímetros"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-cyan-400">
                    {targetTotalInches.toFixed(2)}" ≈ {targetTotalMm.toFixed(1)} mm
                  </div>
                </div>
              </div>

              {/* Contenedor SVG de la cinta métrica */}
              <div className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto">
                <svg
                  viewBox="0 0 800 120"
                  className="w-full min-w-[700px] h-28 select-none"
                  aria-label="Escala gráfica de cinta métrica"
                >
                  {/* Fondo de la cinta métrica */}
                  <rect x="10" y="20" width="780" height="80" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  
                  {/* Escala Superior: Pulgadas (Inches) */}
                  {Array.from({ length: 17 }).map((_, inchIdx) => {
                    const x = 30 + inchIdx * 45;
                    return (
                      <g key={`inch-${inchIdx}`}>
                        {/* Marca principal de pulgada */}
                        <line x1={x} y1="20" x2={x} y2="52" stroke="#e2e8f0" strokeWidth="2" />
                        <text x={x} y="62" fill="#cbd5e1" fontSize="10" fontFamily="Fira Code" textAnchor="middle" fontWeight="bold">
                          {inchIdx}"
                        </text>
                        {/* Subdivisión de 1/2 */}
                        <line x1={x + 22.5} y1="20" x2={x + 22.5} y2="44" stroke="#94a3b8" strokeWidth="1.5" />
                        {/* Subdivisiones de 1/4 */}
                        <line x1={x + 11.25} y1="20" x2={x + 11.25} y2="36" stroke="#64748b" strokeWidth="1" />
                        <line x1={x + 33.75} y1="20" x2={x + 33.75} y2="36" stroke="#64748b" strokeWidth="1" />
                      </g>
                    );
                  })}

                  {/* Escala Inferior: Milímetros (mm) */}
                  {Array.from({ length: 9 }).map((_, mmIdx) => {
                    const mmVal = mmIdx * 50; // cada 50 mm
                    const inchEquiv = mmVal / 25.4;
                    const x = 30 + inchEquiv * 45;
                    if (x > 770) return null;
                    return (
                      <g key={`mm-${mmIdx}`}>
                        <line x1={x} y1="100" x2={x} y2="76" stroke="#38bdf8" strokeWidth="1.5" />
                        <text x={x} y="72" fill="#38bdf8" fontSize="9" fontFamily="Fira Code" textAnchor="middle">
                          {mmVal}
                        </text>
                      </g>
                    );
                  })}

                  {/* Indicador de Cota Actual (Cursor Rojo) */}
                  {(() => {
                    const relativeInch = targetTotalInches % 16;
                    const needleX = Math.min(765, Math.max(30, 30 + relativeInch * 45));
                    return (
                      <g>
                        <line
                          x1={needleX}
                          y1="12"
                          x2={needleX}
                          y2="108"
                          stroke="#ef4444"
                          strokeWidth="2.5"
                          strokeDasharray="3 2"
                        />
                        <polygon
                          points={`${needleX - 6},12 ${needleX + 6},12 ${needleX},22`}
                          fill="#ef4444"
                        />
                        <polygon
                          points={`${needleX - 6},108 ${needleX + 6},108 ${needleX},98`}
                          fill="#ef4444"
                        />
                      </g>
                    );
                  })()}
                </svg>

                <div className="flex justify-between items-center px-4 mt-2 text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-slate-300 inline-block" /> Escala Superior: Pulgadas (1/16")
                  </span>
                  <span className="text-red-400 font-bold">
                    ▲ Cursor Rojo: Posición Actual ({targetTotalInches.toFixed(2)}")
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-sky-400 inline-block" /> Escala Inferior: Milímetros (mm)
                  </span>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                TARJETA 4: TABLA DE EQUIVALENCIAS (EQUIVALENCE)
                Reproduce exactamente la tabla de la imagen del usuario
               ───────────────────────────────────────────────────────────── */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/90 shadow-2xl relative">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <i className="fa-solid fa-table-list" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white font-grotesk">
                        Equivalence (Tabla de Equivalencias)
                      </h3>
                      <p className="text-xs text-slate-400">
                        {isEn
                          ? "Standard fractional inch to decimal inch, millimeters, and centimeters"
                          : "Equivalencia estándar de fracciones a decimales, milímetros y centímetros"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Filtro y Selector de Denominador */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500" />
                    <input
                      type="text"
                      value={tableSearchQuery}
                      onChange={(e) => setTableSearchQuery(e.target.value)}
                      placeholder={isEn ? "Filter fraction..." : "Filtrar (ej: 3/8, 0.25)..."}
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800">
                    {[16, 32, 64].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setTableDenominator(d)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          tableDenominator === d
                            ? "bg-purple-600 text-white shadow"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        1/{d}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tabla con estilo arquitectónico idéntico al recuadro de la imagen */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-xs font-mono font-bold text-slate-300">
                      <th className="py-3 px-4 border-r border-slate-800/80">
                        Fracción Base (/{tableDenominator})
                      </th>
                      <th className="py-3 px-4 border-r border-slate-800/80 text-red-500">
                        Fracción Simplificada
                      </th>
                      <th className="py-3 px-4 border-r border-slate-800/80">
                        Pulgada Decimal (in)
                      </th>
                      <th className="py-3 px-4 border-r border-slate-800/80 text-cyan-400">
                        Milímetros (mm)
                      </th>
                      <th className="py-3 px-4">
                        Centímetros (cm)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                    {filteredEquivalenceTable.map((row) => {
                      const isSelected = Math.abs(fractionInput - row.decimalInch) < 0.0001;
                      return (
                        <tr
                          key={row.baseFraction}
                          onClick={() => handleSelectFractionFromTable(row)}
                          className={`transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-blue-950/60 text-white font-bold"
                              : "hover:bg-slate-800/50 text-slate-300"
                          }`}
                          title="Haz clic para cargar esta fracción en el convertidor"
                        >
                          <td className="py-2.5 px-4 border-r border-slate-800/80 text-slate-400">
                            {row.baseFraction}
                          </td>
                          <td className="py-2.5 px-4 border-r border-slate-800/80 font-bold text-red-500">
                            {row.simplifiedFraction}
                          </td>
                          <td className="py-2.5 px-4 border-r border-slate-800/80">
                            {row.decimalInch.toFixed(4).replace(".", ",")}
                          </td>
                          <td className="py-2.5 px-4 border-r border-slate-800/80 font-bold text-cyan-300">
                            {row.decimalMm.toFixed(4).replace(".", ",")}
                          </td>
                          <td className="py-2.5 px-4 text-slate-400">
                            {row.decimalCm.toFixed(4).replace(".", ",")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-3 text-[11px] font-mono text-slate-500">
                <span>* Haz clic en cualquier fila para transferir la fracción directamente al convertidor</span>
                <span>{filteredEquivalenceTable.length} filas mostradas</span>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 2: CONVERTIDOR MULTIDIMENSIONAL DE INGENIERÍA ESTRUCTURAL & BIM */}
        {/* ========================================================================= */}
        {activeTab === "engineering" && (
          <div className="space-y-8">
            
            {/* Selector de Categoría de Ingeniería */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {ENGINEERING_UNIT_CATEGORIES.map((cat) => {
                const isSelected = cat.id === selectedCategoryId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`p-3.5 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                      isSelected
                        ? "bg-slate-800 border-cyan-500/60 shadow-lg shadow-cyan-500/10 text-white"
                        : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    <i className={`${cat.icon} text-lg ${isSelected ? "text-cyan-400" : "text-slate-500"}`} />
                    <span className="text-[11px] font-bold leading-tight">
                      {isEn ? cat.nameEn : cat.nameEs}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tarjeta de Entrada y Conversión Multilateral */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/90 shadow-2xl">
              <div className="max-w-2xl mx-auto mb-8 text-center">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
                  // {isEn ? "CURRENT CATEGORY" : "CATEGORÍA ACTIVA"}
                </span>
                <h3 className="text-2xl font-black text-white font-grotesk">
                  {isEn ? currentCategory.nameEn : currentCategory.nameEs}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isEn ? currentCategory.descriptionEn : currentCategory.descriptionEs}
                </p>

                {/* Input y Unidad de Origen */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 p-2 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="sm:col-span-2">
                    <input
                      id="multi-unit-input"
                      type="number"
                      step="any"
                      value={isNaN(multiUnitValue) ? "" : multiUnitValue}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setMultiUnitValue(val);
                      }}
                      className="w-full bg-slate-900 text-white font-mono font-black text-2xl text-center sm:text-left px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                      placeholder="90"
                    />
                    <label htmlFor="multi-unit-input" className="sr-only">Valor a convertir</label>
                  </div>
                  <div>
                    <select
                      id="multi-unit-select"
                      value={sourceUnitId}
                      onChange={(e) => setSourceUnitId(e.target.value)}
                      className="w-full h-full bg-slate-900 text-cyan-400 font-mono font-bold text-sm px-3 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      {currentCategory.units.map((u) => (
                        <option key={u.id} value={u.id} className="bg-slate-900 text-slate-200">
                          {u.symbol} — {isEn ? u.nameEn : u.nameEs}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="multi-unit-select" className="sr-only">Unidad de origen</label>
                  </div>
                </div>
              </div>

              {/* Grid de Salidas Simultáneas en Todas las Unidades */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {multiUnitResults.map((item) => {
                  const isCurrentSource = item.unit.id === sourceUnitId;
                  const formatted =
                    Math.abs(item.value) >= 10000 || (Math.abs(item.value) < 0.001 && item.value !== 0)
                      ? item.value.toExponential(4)
                      : item.value.toLocaleString(undefined, { maximumFractionDigits: 4 });

                  return (
                    <div
                      key={item.unit.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrentSource
                          ? "bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-500/5"
                          : "bg-slate-950/70 border-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {isEn ? item.unit.nameEn : item.unit.nameEs}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(`${item.value} ${item.unit.symbol}`, item.unit.id)}
                          className="text-slate-500 hover:text-white p-1"
                          title="Copiar resultado"
                        >
                          <i className={`fa-solid ${copiedKey === item.unit.id ? "fa-check text-emerald-400" : "fa-copy"}`} />
                        </button>
                      </div>

                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-mono text-xl font-black text-white tracking-wide">
                          {formatted}
                        </span>
                        <span className="font-mono text-xs font-bold text-cyan-400">
                          {item.unit.symbol}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            PESTAÑA 3: HERRAMIENTAS DE DIBUJO & ESCALA (Dibujantes, Detalladores CAD)
           ========================================================================= */}
        {activeTab === "drawing" && (
          <div className="space-y-8">

            {/* ── BENTO GRID SUPERIOR: Escala de Lámina + DIMSCALE ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ── CARD 1: Regla de Escala Bidireccional ── */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <i className="fa-solid fa-ruler" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">// SECCIÓN 1 · ESCALA</span>
                    <h2 className="text-xl font-black text-white font-grotesk">{isEn ? "Scale Rule" : "Regla de Escala"}</h2>
                  </div>
                </div>

                {/* Toggle modo */}
                <div className="flex rounded-xl overflow-hidden border border-slate-700 mb-5">
                  <button
                    type="button"
                    onClick={() => setScaleMode("real-to-paper")}
                    className={`flex-1 py-2 text-xs font-bold transition-all ${scaleMode === "real-to-paper" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400 hover:text-white"}`}
                  >
                    {isEn ? "Real → Paper" : "Real → Papel"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setScaleMode("paper-to-real")}
                    className={`flex-1 py-2 text-xs font-bold transition-all ${scaleMode === "paper-to-real" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400 hover:text-white"}`}
                  >
                    {isEn ? "Paper → Real" : "Papel → Real"}
                  </button>
                </div>

                {/* Presets de escala */}
                <div className="mb-4">
                  <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-2">{isEn ? "Scale Preset" : "Escala Preestablecida"}</label>
                  <div className="flex flex-wrap gap-1.5">
                    {DRAWING_SCALE_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => { setSelectedScaleFactor(preset.factor); setCustomScaleFactor(""); }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                          effectiveScaleFactor === preset.factor && customScaleFactor === ""
                            ? "bg-amber-500 text-slate-950 border-amber-500"
                            : "bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-500/50"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Escala personalizada */}
                <div className="mb-5 flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">1:</span>
                  <input
                    id="custom-scale"
                    type="number"
                    min="1"
                    placeholder={isEn ? "Custom scale (e.g. 75)" : "Escala custom (ej. 75)"}
                    value={customScaleFactor}
                    onChange={(e) => setCustomScaleFactor(e.target.value)}
                    className="flex-1 bg-slate-950 text-amber-400 font-mono font-bold text-sm px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>

                {/* Input principal con selector de unidad */}
                <div className="mb-6">
                  {scaleMode === "real-to-paper" ? (
                    <div>
                      {/* Selector de unidad de entrada */}
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="scale-real-input" className="text-xs font-mono font-bold uppercase text-slate-400">
                          {isEn ? "Real Dimension" : "Dimensión Real"}
                        </label>
                        <div className="flex rounded-lg overflow-hidden border border-slate-700">
                          {(["mm", "cm", "m"] as const).map((unit) => (
                            <button
                              key={unit}
                              type="button"
                              onClick={() => {
                                // Convierte el valor actual a la nueva unidad al cambiar
                                if (unit === "cm" && scaleInputUnit === "mm") setScaleRealInput(v => parseFloat((v / 10).toFixed(4)));
                                else if (unit === "m"  && scaleInputUnit === "mm") setScaleRealInput(v => parseFloat((v / 1000).toFixed(6)));
                                else if (unit === "mm" && scaleInputUnit === "cm") setScaleRealInput(v => parseFloat((v * 10).toFixed(2)));
                                else if (unit === "m"  && scaleInputUnit === "cm") setScaleRealInput(v => parseFloat((v / 100).toFixed(6)));
                                else if (unit === "mm" && scaleInputUnit === "m")  setScaleRealInput(v => parseFloat((v * 1000).toFixed(2)));
                                else if (unit === "cm" && scaleInputUnit === "m")  setScaleRealInput(v => parseFloat((v * 100).toFixed(4)));
                                setScaleInputUnit(unit);
                              }}
                              className={`px-3 py-1 text-[10px] font-black font-mono transition-all ${
                                scaleInputUnit === unit
                                  ? "bg-amber-500 text-slate-950"
                                  : "bg-slate-800 text-slate-400 hover:text-white"
                              }`}
                            >
                              {unit}
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        id="scale-real-input"
                        type="number"
                        step="any"
                        value={isNaN(scaleRealInput) ? "" : scaleRealInput}
                        onChange={(e) => setScaleRealInput(parseFloat(e.target.value))}
                        className="w-full bg-slate-950 text-amber-400 font-mono font-extrabold text-3xl text-center py-3 rounded-xl border-2 border-amber-500/50 focus:outline-none focus:border-amber-400 transition-all"
                      />
                      {/* Conversión automática a otras unidades */}
                      <div className="flex justify-center gap-4 mt-2 text-xs font-mono text-slate-500">
                        {scaleInputUnit !== "mm" && <span><span className="text-slate-400">{scaleInputToMm.toFixed(2)}</span> mm</span>}
                        {scaleInputUnit !== "cm" && <span><span className="text-slate-400">{(scaleInputToMm / 10).toFixed(4)}</span> cm</span>}
                        {scaleInputUnit !== "m"  && <span><span className="text-slate-400">{(scaleInputToMm / 1000).toFixed(6)}</span> m</span>}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="scale-paper-input" className="block text-xs font-mono font-bold uppercase text-slate-400 mb-2">
                        {isEn ? "Paper Dimension (mm)" : "Dimensión en Papel (mm)"}
                      </label>
                      <input
                        id="scale-paper-input"
                        type="number"
                        step="any"
                        value={isNaN(scalePaperInput) ? "" : scalePaperInput}
                        onChange={(e) => setScalePaperInput(parseFloat(e.target.value))}
                        className="w-full bg-slate-950 text-amber-400 font-mono font-extrabold text-3xl text-center py-3 rounded-xl border-2 border-amber-500/50 focus:outline-none focus:border-amber-400 transition-all"
                      />
                    </div>
                  )}
                </div>

                {/* Resultados multi-unidad */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Resultado en papel — siempre mm */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/20">
                    <p className="text-[10px] font-mono text-amber-400 uppercase tracking-wider mb-1">{isEn ? "Paper" : "En Papel"}</p>
                    <p className="text-2xl font-black text-white font-mono">{scaleResult.paperMm.toFixed(2)} <span className="text-base font-bold text-amber-400/70">mm</span></p>
                    <div className="mt-1.5 space-y-0.5">
                      <p className="text-xs font-mono text-slate-500">{(scaleResult.paperMm / 10).toFixed(3)} cm</p>
                      <p className="text-xs font-mono text-slate-500">{(scaleResult.paperMm / 1000).toFixed(5)} m</p>
                    </div>
                  </div>
                  {/* Resultado real — 3 unidades */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/20">
                    <p className="text-[10px] font-mono text-blue-400 uppercase tracking-wider mb-1">{isEn ? "Real" : "Real"}</p>
                    <p className="text-2xl font-black text-white font-mono">{scaleResult.realMm.toFixed(1)} <span className="text-base font-bold text-blue-400/70">mm</span></p>
                    <div className="mt-1.5 space-y-0.5">
                      <p className="text-xs font-mono text-slate-500">{(scaleResult.realMm / 10).toFixed(2)} cm</p>
                      <p className="text-xs font-mono text-slate-500">{(scaleResult.realMm / 1000).toFixed(4)} m</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── CARD 2: DIMSCALE / AutoCAD ── */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <i className="fa-solid fa-drafting-compass" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider">// SECCIÓN 2 · CAD</span>
                    <h2 className="text-xl font-black text-white font-grotesk">DIMSCALE · AutoCAD</h2>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                  {isEn
                    ? "Scale factor determines DIMSCALE, LTSCALE and text heights for model space in AutoCAD and Revit annotation styles."
                    : "El factor de escala determina DIMSCALE, LTSCALE y alturas de texto en espacio modelo para AutoCAD y estilos de anotación de Revit."}
                </p>

                {/* Escala activa display */}
                <div className="mb-6 p-3 rounded-xl bg-slate-950 border border-orange-500/20 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">{isEn ? "Active scale:" : "Escala activa:"}</span>
                  <span className="text-lg font-black text-orange-400 font-mono">1 : {effectiveScaleFactor}</span>
                </div>

                {/* Grid de valores DIMSCALE */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "DIMSCALE / LTSCALE", value: dimscaleResult.dimscale.toFixed(0), color: "text-orange-400", border: "border-orange-500/30" },
                    { label: isEn ? "Arrow Size (model)" : "Flechas (modelo)", value: `${dimscaleResult.arrowSize.toFixed(1)} u`, color: "text-amber-400", border: "border-amber-500/20" },
                    { label: isEn ? "Text 2.5mm → model" : "Texto 2.5mm → modelo", value: `${dimscaleResult.textHeight25mm.toFixed(1)} u`, color: "text-cyan-400", border: "border-cyan-500/20" },
                    { label: isEn ? "Text 3.5mm → model" : "Texto 3.5mm → modelo", value: `${dimscaleResult.textHeight35mm.toFixed(1)} u`, color: "text-cyan-400", border: "border-cyan-500/20" },
                    { label: isEn ? "Text 5.0mm → model" : "Texto 5.0mm → modelo", value: `${dimscaleResult.textHeight5mm.toFixed(1)} u`, color: "text-blue-400", border: "border-blue-500/20" },
                    { label: isEn ? "Viewport scale" : "Escala de viewport", value: `1/${effectiveScaleFactor}`, color: "text-emerald-400", border: "border-emerald-500/20" },
                  ].map((item) => (
                    <div key={item.label} className={`p-3 rounded-xl bg-slate-950 border ${item.border}`}>
                      <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1 leading-tight">{item.label}</p>
                      <p className={`text-xl font-black font-mono ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Tip AutoCAD */}
                <div className="mt-4 p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-300 font-mono">
                  <i className="fa-solid fa-terminal mr-2 text-blue-400" />
                  <span className="font-bold">DIMSCALE {dimscaleResult.dimscale}</span>
                  <span className="text-slate-500"> · </span>
                  <span className="font-bold">LTSCALE {dimscaleResult.dimscale}</span>
                  <span className="text-slate-500"> · </span>
                  <span className="font-bold">MSLTSCALE 1</span>
                </div>
              </div>
            </div>

            {/* ── BENTO GRID INFERIOR: Pendientes + Temperatura + Papel ISO ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* ── CARD 3: Convertidor de Pendientes ── */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-800">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-sm">
                    <i className="fa-solid fa-chart-line" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">// PENDIENTES</span>
                    <h3 className="text-base font-black text-white font-grotesk">{isEn ? "Slope Converter" : "Pendientes"}</h3>
                  </div>
                </div>

                {/* Tipo de entrada */}
                <div className="flex rounded-lg overflow-hidden border border-slate-700 mb-4">
                  {(["percent", "degrees", "ratio_hv"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSlopeInputType(type)}
                      className={`flex-1 py-1.5 text-[10px] font-bold transition-all ${
                        slopeInputType === type ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {type === "percent" ? "%" : type === "degrees" ? "°" : "X:1"}
                    </button>
                  ))}
                </div>

                <input
                  id="slope-input"
                  type="number"
                  step="any"
                  min="0"
                  value={isNaN(slopeValue) ? "" : slopeValue}
                  onChange={(e) => setSlopeValue(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 text-emerald-400 font-mono font-extrabold text-3xl text-center py-3 rounded-xl border-2 border-emerald-500/40 focus:outline-none focus:border-emerald-400 transition-all mb-4"
                />

                <div className="space-y-2">
                  {[
                    { label: "%", value: `${slopeResult.percent.toFixed(3)} %`, color: "text-emerald-400" },
                    { label: "°", value: `${slopeResult.degrees.toFixed(4)}°`, color: "text-yellow-400" },
                    { label: "rad", value: slopeResult.radians.toFixed(6), color: "text-slate-300" },
                    { label: isEn ? "Ratio (H:1V)" : "Relación (H:1V)", value: slopeResult.ratioText, color: "text-cyan-400" },
                    { label: isEn ? "V rise per m run" : "Elevación por m", value: `${(slopeResult.ratioVH * 1000).toFixed(1)} mm/m`, color: "text-orange-400" },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{r.label}</span>
                      <span className={`text-sm font-black font-mono ${r.color}`}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── CARD 4: Temperatura ── */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-800">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-sm">
                    <i className="fa-solid fa-temperature-half" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-red-400 font-bold uppercase tracking-wider">// TEMPERATURA</span>
                    <h3 className="text-base font-black text-white font-grotesk">{isEn ? "Temperature" : "Temperatura"}</h3>
                  </div>
                </div>

                {/* Tipo de entrada */}
                <div className="flex rounded-lg overflow-hidden border border-slate-700 mb-4">
                  {(["celsius", "fahrenheit", "kelvin"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTempFrom(type)}
                      className={`flex-1 py-1.5 text-[10px] font-bold transition-all ${
                        tempFrom === type ? "bg-red-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {type === "celsius" ? "°C" : type === "fahrenheit" ? "°F" : "K"}
                    </button>
                  ))}
                </div>

                <input
                  id="temp-input"
                  type="number"
                  step="any"
                  value={isNaN(tempValue) ? "" : tempValue}
                  onChange={(e) => setTempValue(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 text-red-400 font-mono font-extrabold text-3xl text-center py-3 rounded-xl border-2 border-red-500/40 focus:outline-none focus:border-red-400 transition-all mb-4"
                />

                <div className="space-y-2">
                  {[
                    { label: "Celsius (°C)", value: `${tempResult.celsius.toFixed(2)} °C`, color: "text-red-400" },
                    { label: "Fahrenheit (°F)", value: `${tempResult.fahrenheit.toFixed(2)} °F`, color: "text-orange-400" },
                    { label: "Kelvin (K)", value: `${tempResult.kelvin.toFixed(3)} K`, color: "text-blue-400" },
                    { label: "Rankine (°R)", value: `${tempResult.rankine.toFixed(3)} °R`, color: "text-slate-400" },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{r.label}</span>
                      <span className={`text-sm font-black font-mono ${r.color}`}>{r.value}</span>
                    </div>
                  ))}
                </div>

                {/* Referencia de hormigón */}
                <div className="mt-4 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[9px] font-mono text-slate-500 leading-relaxed">
                  <span className="text-yellow-400 font-bold">Ref Hormigón:</span> Fraguado óptimo 15–25°C · Curado mín. 10°C · Max 32°C
                </div>
              </div>

              {/* ── CARD 5: Papel ISO / ANSI ── */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl overflow-hidden">
                <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-800">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 text-sm">
                    <i className="fa-regular fa-file" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-violet-400 font-bold uppercase tracking-wider">// PAPEL ISO & ANSI</span>
                    <h3 className="text-base font-black text-white font-grotesk">{isEn ? "Paper Sizes" : "Tamaños de Lámina"}</h3>
                  </div>
                </div>

                <div className="space-y-1.5 overflow-y-auto max-h-[380px] pr-1">
                  {PAPER_SIZES.map((paper) => (
                    <div
                      key={paper.name}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-violet-500/30 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Ícono proporcional */}
                        <div
                          className="bg-violet-500/20 border border-violet-500/30 rounded-sm flex-shrink-0"
                          style={{
                            width: Math.round(12 * (paper.widthMm / Math.max(paper.widthMm, paper.heightMm))),
                            height: Math.round(16 * (paper.heightMm / Math.max(paper.widthMm, paper.heightMm))),
                            minWidth: 8,
                            minHeight: 8,
                          }}
                        />
                        <div>
                          <span className="text-xs font-black text-white">{paper.name}</span>
                          <p className="text-[9px] font-mono text-slate-500">{paper.area}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono font-bold text-violet-400">{paper.widthMm} × {paper.heightMm}</p>
                        <p className="text-[9px] font-mono text-slate-500">{paper.widthIn}" × {paper.heightIn}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            SECCIÓN INFERIOR: HISTORIAL DE CONVERSIONES RECIENTES
           ───────────────────────────────────────────────────────────── */}
        {conversionHistory.length > 0 && (
          <div className="mt-8 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-blue-400" />
                {isEn ? "Recent Conversions History" : "Historial de Conversiones Recientes"}
              </span>
              <button
                type="button"
                onClick={clearHistory}
                className="text-xs font-mono text-slate-500 hover:text-red-400 transition-colors"
              >
                {isEn ? "Clear History" : "Limpiar Historial"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {conversionHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono flex items-center justify-between"
                >
                  <span className="text-slate-300 font-bold">{item.inputDisplay}</span>
                  <i className="fa-solid fa-arrow-right text-[10px] text-slate-600 mx-2" />
                  <span className="text-emerald-400 font-bold">{item.resultDisplay}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
