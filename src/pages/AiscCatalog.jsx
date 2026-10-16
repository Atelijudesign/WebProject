import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";
import SEOHead from "../components/SEOHead";
import { AISC_CATALOG } from "../data/aisc_data.js";
import { ExportService, ExcelTakeoffStrategy, PdfTakeoffStrategy } from "../core/export";
import { ProfileSearchEngine } from "../core/calculators";
import { useTranslation } from "../context/LanguageContext";

// ==================== PROPERTY LABELS & UNITS ====================
const PROP_LABELS = {
  // Dimensions
  "d": { name: "Alto / Profundidad (d)", nameEs: "Alto / Profundidad (d)", nameEn: "Depth / Height (d)", icon: "fa-arrows-up-down", impUnit: "in", metUnit: "mm" },
  "bf": { name: "Ancho de Ala (bf)", nameEs: "Ancho de Ala (bf)", nameEn: "Flange Width (bf)", icon: "fa-arrows-left-right", impUnit: "in", metUnit: "mm" },
  "B": { name: "Ancho (B)", nameEs: "Ancho (B)", nameEn: "Width (B)", icon: "fa-arrows-left-right", impUnit: "in", metUnit: "mm" },
  "b": { name: "Ancho de Ala / Cota (b)", nameEs: "Ancho de Ala / Cota (b)", nameEn: "Flange Width / Leg (b)", icon: "fa-arrows-left-right", impUnit: "in", metUnit: "mm" },
  "OD": { name: "Diámetro Exterior (OD)", nameEs: "Diámetro Exterior (OD)", nameEn: "Outside Diameter (OD)", icon: "fa-circle-dot", impUnit: "in", metUnit: "mm" },
  "tw": { name: "Espesor de Alma (tw)", nameEs: "Espesor de Alma (tw)", nameEn: "Web Thickness (tw)", icon: "fa-ruler-vertical", impUnit: "in", metUnit: "mm" },
  "tf": { name: "Espesor de Ala (tf)", nameEs: "Espesor de Ala (tf)", nameEn: "Flange Thickness (tf)", icon: "fa-ruler-horizontal", impUnit: "in", metUnit: "mm" },
  "t": { name: "Espesor de Pared / Ala (t)", nameEs: "Espesor de Pared / Ala (t)", nameEn: "Wall / Flange Thickness (t)", icon: "fa-ruler", impUnit: "in", metUnit: "mm" },
  "kdes": { name: "Cota de Diseño (kdes)", nameEs: "Cota de Diseño (kdes)", nameEn: "Design Distance (kdes)", icon: "fa-ruler-combined", impUnit: "in", metUnit: "mm" },
  "kdet": { name: "Cota de Detallado (kdet)", nameEs: "Cota de Detallado (kdet)", nameEn: "Detailing Distance (kdet)", icon: "fa-ruler-combined", impUnit: "in", metUnit: "mm" },
  "k1": { name: "Distancia Alma-Ala (k1)", nameEs: "Distancia Alma-Ala (k1)", nameEn: "Web-to-Flange Dist. (k1)", icon: "fa-ruler-combined", impUnit: "in", metUnit: "mm" },
  "x": { name: "Centroide X (x)", nameEs: "Centroide X (x)", nameEn: "Centroid X (x)", icon: "fa-crosshairs", impUnit: "in", metUnit: "mm" },
  "y": { name: "Centroide Y (y)", nameEs: "Centroide Y (y)", nameEn: "Centroid Y (y)", icon: "fa-crosshairs", impUnit: "in", metUnit: "mm" },

  // Structural properties
  "A": { name: "Área de Sección (A)", nameEs: "Área de Sección (A)", nameEn: "Cross-Section Area (A)", icon: "fa-vector-square", impUnit: "in²", metUnit: "mm²" },
  "W": { name: "Peso Nominal (W)", nameEs: "Peso Nominal (W)", nameEn: "Nominal Weight (W)", icon: "fa-weight-hanging", impUnit: "lb/ft", metUnit: "kg/m" },
  "Ix": { name: "Inercia Eje X (Ix)", nameEs: "Inercia Eje X (Ix)", nameEn: "Moment of Inertia X (Ix)", icon: "fa-rotate", impUnit: "in⁴", metUnit: "cm⁴" },
  "Zx": { name: "Módulo Plástico X (Zx)", nameEs: "Módulo Plástico X (Zx)", nameEn: "Plastic Modulus X (Zx)", icon: "fa-cube", impUnit: "in³", metUnit: "cm³" },
  "Sx": { name: "Módulo Elástico X (Sx)", nameEs: "Módulo Elástico X (Sx)", nameEn: "Elastic Modulus X (Sx)", icon: "fa-cubes", impUnit: "in³", metUnit: "cm³" },
  "rx": { name: "Radio Giro X (rx)", nameEs: "Radio Giro X (rx)", nameEn: "Radius of Gyration X (rx)", icon: "fa-circle-dot", impUnit: "in", metUnit: "mm" },
  "Iy": { name: "Inercia Eje Y (Iy)", nameEs: "Inercia Eje Y (Iy)", nameEn: "Moment of Inertia Y (Iy)", icon: "fa-rotate", impUnit: "in⁴", metUnit: "cm⁴" },
  "Zy": { name: "Módulo Plástico Y (Zy)", nameEs: "Módulo Plástico Y (Zy)", nameEn: "Plastic Modulus Y (Zy)", icon: "fa-cube", impUnit: "in³", metUnit: "cm³" },
  "Sy": { name: "Módulo Elástico Y (Sy)", nameEs: "Módulo Elástico Y (Sy)", nameEn: "Elastic Modulus Y (Sy)", icon: "fa-cubes", impUnit: "in³", metUnit: "cm³" },
  "ry": { name: "Radio Giro Y (ry)", nameEs: "Radio Giro Y (ry)", nameEn: "Radius of Gyration Y (ry)", icon: "fa-circle-dot", impUnit: "in", metUnit: "mm" },
  "J": { name: "Constante Torsional (J)", nameEs: "Constante Torsional (J)", nameEn: "Torsional Constant (J)", icon: "fa-bolt", impUnit: "in⁴", metUnit: "cm⁴" },
  "Cw": { name: "Constante Alabeo (Cw)", nameEs: "Constante Alabeo (Cw)", nameEn: "Warping Constant (Cw)", icon: "fa-shield", impUnit: "in⁶", metUnit: "cm⁶" },
  "rts": { name: "Radio Giro Efec. (rts)", nameEs: "Radio Giro Efec. (rts)", nameEn: "Effective Radius (rts)", icon: "fa-circle-dot", impUnit: "in", metUnit: "mm" },
  "ho": { name: "Dist. Centroides Ala (ho)", nameEs: "Dist. Centroides Ala (ho)", nameEn: "Flange Centroid Dist. (ho)", icon: "fa-arrows-up-down", impUnit: "in", metUnit: "mm" },
};

import { buildAiscProfileSvg as buildAiscSvg } from "../components/svg/ProfileSvgFactory";
import { ProfileSectionViewer } from "../components/svg/ProfileSectionViewer";

// ==================== MAIN COMPONENT ====================
export default function AiscCatalog() {
  const { language } = useTranslation();
  const isEn = language === "en";

  // Unit System State: "metric" (mm, kg/m, cm4) is DEFAULT, "imperial" (in, lb/ft, in4) is secondary option
  const [unitSys, setUnitSys] = useState(localStorage.getItem("aisc-unit-sys") || "metric");

  const [currentSeries, setCurrentSeries] = useState("W");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileList, setProfileList] = useState([]);

  // Advanced Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterIx, setFilterIx] = useState("");
  const [filterMinW, setFilterMinW] = useState("");
  const [filterMaxW, setFilterMaxW] = useState("");
  const [filterH, setFilterH] = useState("");

  // Take-off Form States (Default 6m for Metric, 20ft for Imperial)
  const [mark, setMark] = useState("");
  const [lengthParam, setLengthParam] = useState(unitSys === "metric" ? 6 : 20);
  const [qtyParam, setQtyParam] = useState(1);
  const [connectionsPct, setConnectionsPct] = useState(10);

  // References
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  // Save unit choice and adjust length default
  const handleUnitChange = (sys) => {
    setUnitSys(sys);
    setLengthParam(sys === "metric" ? 6 : 20);
  };

  useEffect(() => {
    localStorage.setItem("aisc-unit-sys", unitSys);
  }, [unitSys]);

  // Load Take-off List from local storage
  useEffect(() => {
    const saved = localStorage.getItem("aisc-project-takeoff-list");
    if (saved) {
      try {
        setProfileList(JSON.parse(saved));
      } catch {
        console.error("Failed to parse AISC takeoff list");
      }
    }
  }, []);

  // Sync takeoff list to local storage
  useEffect(() => {
    localStorage.setItem("aisc-project-takeoff-list", JSON.stringify(profileList));
  }, [profileList]);

  // Derived filtered profiles mediante ProfileSearchEngine
  const filteredProfiles = useMemo(() => {
    if (!currentSeries || !AISC_CATALOG[currentSeries]) return [];
    const profiles = AISC_CATALOG[currentSeries].profiles;

    return ProfileSearchEngine.filterProfiles(profiles, {
      searchQuery,
      unitSys,
      minIx: parseFloat(filterIx) || 0,
      minWeight: parseFloat(filterMinW) || 0,
      maxWeight: parseFloat(filterMaxW) || Infinity,
      maxDepth: parseFloat(filterH) || Infinity,
    });
  }, [currentSeries, searchQuery, filterIx, filterMinW, filterMaxW, filterH, unitSys]);

  // Auto-select first profile when series changes
  useEffect(() => {
    if (filteredProfiles.length > 0 && !selectedProfile) {
      setSelectedProfile(filteredProfiles[0]);
    }
  }, [currentSeries, filteredProfiles, selectedProfile]);

  // Add Item to Take-off
  const addToList = () => {
    if (!selectedProfile) return;
    const isImp = unitSys === "imperial";
    const unitWeight = isImp ? selectedProfile.W_lb : selectedProfile.W_kg;
    const l = parseFloat(lengthParam) || (isImp ? 20 : 6);
    const c = parseInt(qtyParam) || 1;

    if (!unitWeight) return alert(isEn ? "The selected profile has no recorded weight." : "El perfil seleccionado no posee peso registrado.");

    const desigPrimary = isImp ? selectedProfile.designation : selectedProfile.metricDesignation;
    const desigSecondary = isImp ? selectedProfile.metricDesignation : selectedProfile.designation;

    setProfileList([
      ...profileList,
      {
        ...selectedProfile,
        id: Date.now(),
        mark: mark.trim() || "—",
        qty: c,
        length: l,
        unitSys,
        unitWeight,
        totalWeight: c * l * unitWeight,
        displayLabel: desigPrimary,
        secondaryLabel: desigSecondary
      }
    ]);
    setMark(""); // Clear input mark
  };

  const removeFromList = (idx) => {
    const updated = [...profileList];
    updated.splice(idx, 1);
    setProfileList(updated);
  };

  const handleClear = () => {
    if (window.confirm(isEn ? "Are you sure you want to reset the project takeoff list?" : "¿Seguro que deseas reiniciar la lista de cubicación del proyecto?")) {
      setProfileList([]);
    }
  };

  // Calculations for chart and totals
  const takeoffSummary = useMemo(() => {
    let totalWeight = 0;
    const byType = {};

    profileList.forEach((item) => {
      totalWeight += item.totalWeight;
      const tKey = item.type || "Otros";
      byType[tKey] = (byType[tKey] || 0) + item.totalWeight;
    });

    const connWeight = totalWeight * (connectionsPct / 100);
    const grandTotal = totalWeight + connWeight;

    return { totalWeight, connWeight, grandTotal, byType };
  }, [profileList, connectionsPct]);

  // Chart Rendering
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const { byType, totalWeight, connWeight } = takeoffSummary;
    if (totalWeight === 0) return;

    const labels = Object.keys(byType).map((type) => {
      const w = byType[type];
      const pct = ((w / (totalWeight + connWeight)) * 100).toFixed(1);
      return `${type} (${pct}%)`;
    });

    if (connWeight > 0) {
      const pct = ((connWeight / (totalWeight + connWeight)) * 100).toFixed(1);
      labels.push(`Conexiones (${pct}%)`);
    }

    const dataVals = [...Object.values(byType)];
    if (connWeight > 0) dataVals.push(connWeight);

    const colors = ["#3b82f6", "#06b6d4", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#6366f1"];

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: dataVals,
            backgroundColor: colors.slice(0, dataVals.length),
            borderColor: "#0f172a",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right", labels: { color: "#94a3b8", font: { size: 10 } } },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [takeoffSummary]);

  // Excel Export
  const handleExportExcel = async () => {
    if (!profileList.length) return alert(isEn ? "No data in the takeoff list." : "No hay datos en la lista de cubicación.");

    const isImp = unitSys === "imperial";
    const unitLabel = isImp ? "lb/ft" : "kg/m";
    const totalUnitLabel = isImp ? "lbs" : "kg";
    const lenLabel = isImp ? (isEn ? "Length (ft)" : "Largo (ft)") : (isEn ? "Length (m)" : "Largo (m)");
    const tonUnit = isImp ? "US Tons" : "Ton";
    const tonValue = isImp ? takeoffSummary.grandTotal / 2000 : takeoffSummary.grandTotal / 1000;

    await ExportService.executeExport(new ExcelTakeoffStrategy(), {
      sheetName: isEn ? `AISC Takeoff (${unitSys.toUpperCase()})` : `Cubicación AISC (${unitSys.toUpperCase()})`,
      title: isEn ? "Steel Takeoff Summary - AISC v15.0 Catalog" : "Resumen de Cubicación - Catálogo AISC v15.0",
      subtitle: isEn
        ? `American Institute of Steel Construction · ${isImp ? "US Customary Imperial" : "Metric SI"} Database`
        : `American Institute of Steel Construction · Base de Datos ${isImp ? "Imperial US Customary" : "Métrico SI"}`,
      standardTag: isEn ? "STANDARD AISC v15.0" : "NORMA AISC v15.0",
      columns: [
        { header: isEn ? "Mark / Tag" : "Marca / Tag", key: "mark", width: 14, align: "center" },
        { header: isEn ? "Quantity" : "Cantidad", key: "qty", width: 12, align: "center", numFmt: '#,##0' },
        { header: isEn ? "Primary Profile" : "Perfil Principal", key: "displayLabel", width: 24, align: "left" },
        { header: isEn ? "Equivalent Profile" : "Perfil Equivalente", key: "secondaryLabel", width: 22, align: "left" },
        { header: isEn ? "Type" : "Tipo", key: "type", width: 12, align: "center" },
        { header: lenLabel, key: "length", width: 15, align: "right", numFmt: '#,##0.00' },
        { header: `${isEn ? "Unit Wt." : "Peso Unit."} (${unitLabel})`, key: "unitWeight", width: 18, align: "right", numFmt: '#,##0.00' },
        { header: `${isEn ? "Total Wt." : "Peso Total"} (${totalUnitLabel})`, key: "totalWeight", width: 20, align: "right", numFmt: '#,##0.00' },
      ],
      data: profileList.map((p) => ({
        mark: p.mark,
        qty: p.qty,
        displayLabel: p.displayLabel,
        secondaryLabel: p.secondaryLabel || "—",
        type: p.type,
        length: typeof p.length === "number" ? p.length : parseFloat(p.length) || 0,
        unitWeight: typeof p.unitWeight === "number" ? p.unitWeight : parseFloat(p.unitWeight) || 0,
        totalWeight: typeof p.totalWeight === "number" ? p.totalWeight : parseFloat(p.totalWeight) || 0,
      })),
      summary: {
        subtotal: takeoffSummary.totalWeight,
        extraPct: connectionsPct,
        extraWeight: takeoffSummary.connWeight,
        grandTotal: takeoffSummary.grandTotal,
        tonTotal: tonValue,
        unitLabel: totalUnitLabel,
        tonUnitLabel: tonUnit,
      },
      filename: `cubicacion-aisc-v150-${unitSys}.xlsx`,
    });
  };

  // PDF Export
  const handleExportPdf = async () => {
    if (!profileList.length) return alert(isEn ? "No data in the takeoff list." : "No hay datos en la lista de cubicación.");

    const isImp = unitSys === "imperial";
    const unitLabel = isImp ? "lb/ft" : "kg/m";
    const totalUnitLabel = isImp ? "lbs" : "kg";
    const lenLabel = isImp ? (isEn ? "Length (ft)" : "Largo (ft)") : (isEn ? "Length (m)" : "Largo (m)");
    const tonUnit = isImp ? "US Tons" : "Ton";
    const tonValue = isImp ? takeoffSummary.grandTotal / 2000 : takeoffSummary.grandTotal / 1000;

    await ExportService.executeExport(new PdfTakeoffStrategy(), {
      title: isEn ? "Steel Takeoff Summary - AISC v15.0 Catalog" : "Resumen de Cubicación - Catálogo AISC v15.0",
      subtitle: isEn
        ? `American Institute of Steel Construction · ${isImp ? "US Customary Imperial" : "Metric SI"} Database`
        : `American Institute of Steel Construction · Base de Datos ${isImp ? "Imperial US Customary" : "Métrico SI"}`,
      standardTag: isEn ? "STANDARD AISC v15.0" : "NORMA AISC v15.0",
      headers: [
        isEn ? "Mark / Tag" : "Marca / Tag",
        isEn ? "Qty" : "Cant.",
        isEn ? "AISC Shape" : "Perfil AISC",
        isEn ? "Equivalent" : "Equivalente",
        lenLabel,
        `${isEn ? "Unit Wt." : "Peso U."} (${unitLabel})`,
        `${isEn ? "Total Wt." : "Peso Total"} (${totalUnitLabel})`
      ],
      rows: profileList.map((p) => [
        p.mark,
        p.qty,
        p.displayLabel,
        p.secondaryLabel || "—",
        typeof p.length === "number" ? p.length.toFixed(2) : p.length,
        typeof p.unitWeight === "number" ? p.unitWeight.toFixed(2) : p.unitWeight,
        roundVal(p.totalWeight),
      ]),
      summary: {
        subtotal: takeoffSummary.totalWeight,
        extraPct: connectionsPct,
        extraWeight: takeoffSummary.connWeight,
        grandTotal: takeoffSummary.grandTotal,
        tonTotal: tonValue,
        unitLabel: totalUnitLabel,
        tonUnitLabel: tonUnit,
      },
      columnAlignments: {
        0: "center",
        1: "center",
        2: "left",
        3: "left",
        4: "right",
        5: "right",
        6: "right",
      },
      filename: `cubicacion-aisc-v150-${unitSys}.pdf`,
    });
  };

  const roundVal = (v) => (typeof v === "number" ? Math.round(v * 100) / 100 : v);
  const isImp = unitSys === "imperial";

  return (
    <div className="bg-[#080c14] text-slate-300 font-sans min-h-screen pt-24 pb-12">
      <SEOHead
        title={isEn ? "AISC v15.0 Steel Profiles Catalog Online · Structural Steel Shapes" : "Catálogo AISC v15.0 Online · Buscador de Perfiles de Acero Estructural"}
        description={isEn ? "Interactive database with 2,100+ AISC v15.0 structural steel shapes (W, S, M, HP, C, MC, HSS, L, WT). Metric SI and US Imperial customary properties, 2D diagrams, and steel takeoff calculator." : "Buscador interactivo con 2,100+ perfiles de acero estructural de la AISC v15.0 (W, S, M, HP, C, MC, HSS, L, WT). Propiedades mecánicas en sistema Métrico e Imperial, cotas 2D y cubicador."}
        path="/herramientas/aisc"
        keywords={isEn ? "AISC v15.0 catalog, AISC steel shapes online, W beams, HSS tubular, structural steel profiles, American Institute of Steel Construction, AISC steel takeoff" : "Catálogo AISC v15.0, perfiles AISC online, W beams, HSS tubular, perfiles estructurales acero, American Institute of Steel Construction, cubicación acero AISC"}
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": isEn ? "AISC v15.0 Steel Shapes Catalog & Takeoff Calculator" : "Catálogo AISC v15.0 Online y Cubicador de Acero",
          "applicationCategory": "EngineeringApplication",
          "operatingSystem": "All",
          "url": "https://www.andresgallop.com/herramientas/aisc",
          "description": isEn ? "AISC v15.0 certified database and explorer with 2,100+ structural profiles, 2D parametric dimensions and unit converter." : "Base de datos y explorador normado AISC v15.0 con 2,100+ perfiles estructurales, cotas paramétricas 2D y conversor de unidades.",
          "inLanguage": isEn ? "en" : "es",
          "author": {
            "@type": "Person",
            "name": "Andrés Gallo P."
          }
        }}
      />
      
      {/* Navigation Header */}
      <div className="sticky top-20 z-40 bg-[#080c14]/90 backdrop-blur-md pb-4 pt-4 border-b border-white/10 mb-6 -mt-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-3">
          <Link
            to="/herramientas"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-white/[0.07] hover:bg-white/10 border border-white/15 px-4 py-2 rounded-lg transition-all duration-300 group"
          >
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> {isEn ? "Back to Tools" : "Volver a Herramientas"}
          </Link>

          {/* Prominent Dual System Unit Switcher */}
          <div className="flex items-center gap-1 bg-[#0d1420] border border-white/10 rounded-xl p-1.5 shadow-xl">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline-block">
              <i className="fa-solid fa-ruler-combined text-[#60a5fa] mr-1.5"></i>{isEn ? "Unit System:" : "Sistema de Unidades:"}
            </span>
            <button
              onClick={() => handleUnitChange("metric")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 border ${
                unitSys === "metric"
                  ? "bg-[#3b82f6] border-transparent text-white shadow-lg shadow-[#3b82f6]/25 hover:bg-[#60a5fa]"
                  : "border-transparent text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <i className="fa-solid fa-ruler"></i> {isEn ? "Metric SI (mm / kg / cm⁴)" : "Métrico SI (mm / kg / cm⁴)"}
            </button>
            <button
              onClick={() => handleUnitChange("imperial")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 border ${
                unitSys === "imperial"
                  ? "bg-[#3b82f6] border-transparent text-white shadow-lg shadow-[#3b82f6]/25 hover:bg-[#60a5fa]"
                  : "border-transparent text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <i className="fa-solid fa-flag-usa"></i> {isEn ? "US Imperial (in / lb / in⁴)" : "Imperial US (in / lb / in⁴)"}
            </button>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-white/[0.07] hover:bg-white/10 border border-white/15 px-4 py-2 rounded-lg transition-all duration-300"
          >
            <i className="fa-solid fa-house"></i> {isEn ? "Back to Home" : "Volver al Inicio"}
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <section className="relative overflow-hidden mb-8">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#60a5fa] text-xs font-mono font-bold mb-4 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
            // {isEn ? "International Standard · AISC v15.0 Database" : "Norma Internacional · AISC v15.0 Database"}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-4 font-head tracking-tight text-white">
            {isEn ? "AISC v15.0 " : "Catálogo de Perfiles "}<span className="text-[#60a5fa]">{isEn ? "Steel Profiles Catalog" : "AISC v15.0"}</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {isEn
              ? "Explore over 2,100 standard structural steel shapes certified by the American Institute of Steel Construction. Inspect properties in Metric SI (mm, kg/m) or US Imperial (inches, lb/ft), view 2D cross-section dimensions, and compute steel takeoffs for your project."
              : "Explora más de 2,100 perfiles estructurales normados por el American Institute of Steel Construction. Consulta propiedades en Sistema Métrico SI (mm, kg/m) o Imperial (pulgadas, lb/ft), visualiza cotas en 2D y estima la cubicaciones de acero de tu proyecto."}
          </p>
        </div>
      </section>

      {/* Series Match Buttons */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span><i className="fa-solid fa-shapes mr-2 text-[#60a5fa]"></i>{isEn ? "Section Family / Shape Type" : "Familia / Tipo de Sección"}</span>
          <span className="text-slate-500">{AISC_CATALOG[currentSeries]?.profiles.length || 0} {isEn ? "Profiles" : "Perfiles"}</span>
        </h2>
        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(68px, 1fr))" }}>
          {Object.entries(AISC_CATALOG).map(([key, series]) => (
            <button
              key={key}
              onClick={() => {
                setCurrentSeries(key);
                setSelectedProfile(null);
                setSearchQuery("");
              }}
              className={`flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all duration-200 ${
                currentSeries === key
                  ? "bg-[#3b82f6]/15 border-[#3b82f6] text-[#60a5fa] shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  : "bg-white/[0.03] border-white/10 text-slate-400 hover:border-[#3b82f6]/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <i className={`${series.icon} text-base mb-1`}></i>
              <span className="text-xs font-black">{key}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Explorer & Details */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* SEARCH & PROFILE LIST PANEL */}
          <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 lg:col-span-1 flex flex-col h-[680px]">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span><i className="fa-solid fa-magnifying-glass mr-2 text-bim-blue"></i>{isEn ? "Profile Search" : "Buscador de Perfil"}</span>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                  showFilters ? "bg-bim-blue/20 border-bim-blue text-bim-blue" : "border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <i className="fa-solid fa-sliders"></i> {isEn ? "Filters" : "Filtros"}
              </button>
            </h3>

            {/* Input Search */}
            <div className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? `Search in ${currentSeries} (e.g. ${unitSys === 'metric' ? 'W360X134 or W14X90' : 'W14X90 or W360X134'})...` : `Buscar en ${currentSeries} (ej. ${unitSys === 'metric' ? 'W360X134 o W14X90' : 'W14X90 o W360X134'})...`}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:border-bim-blue text-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* Filter Drawer */}
            {showFilters && (
              <div className="grid grid-cols-2 gap-2 mb-3 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">{isEn ? "Min Ix" : "Ix Mín"} ({isImp ? "in⁴" : "cm⁴"})</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                    value={filterIx}
                    onChange={(e) => setFilterIx(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">{isEn ? "Max Depth" : "Depth/Alto Máx"} ({isImp ? 'in' : 'mm'})</label>
                  <input
                    type="number"
                    placeholder={isEn ? "Max" : "Máx"}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                    value={filterH}
                    onChange={(e) => setFilterH(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">{isEn ? "Min Weight" : "Peso Mín"} ({isImp ? "lb/ft" : "kg/m"})</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                    value={filterMinW}
                    onChange={(e) => setFilterMinW(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">{isEn ? "Max Weight" : "Peso Máx"} ({isImp ? "lb/ft" : "kg/m"})</label>
                  <input
                    type="number"
                    placeholder={isEn ? "Max" : "Máx"}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                    value={filterMaxW}
                    onChange={(e) => setFilterMaxW(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Scrollable Profiles List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((p, idx) => {
                  const isSelected = selectedProfile?.designation === p.designation;
                  const primaryLabel = unitSys === "metric" ? (p.metricDesignation || p.designation) : p.designation;
                  const secondaryLabel = unitSys === "metric" ? p.designation : p.metricDesignation;
                  
                  const primaryWeight = unitSys === "metric" ? `${p.W_kg} kg/m` : `${p.W_lb} lb/ft`;
                  const secondaryWeight = unitSys === "metric" ? `${p.W_lb} lb/ft` : `${p.W_kg} kg/m`;

                  const depthLabel = unitSys === "metric" ? `d=${p.d_mm || p.OD_mm || 0} mm` : `d=${p.d_in || p.OD_in || 0}"`;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedProfile(p)}
                      className={`w-full flex justify-between items-center p-3 rounded-xl text-left transition-all border ${
                        isSelected
                          ? "bg-bim-blue/20 text-bim-blue border-bim-blue shadow-sm"
                          : "bg-slate-800/40 text-slate-300 border-slate-700/40 hover:bg-slate-800 hover:border-slate-600"
                      }`}
                    >
                      <div>
                        <span className="font-bold block text-sm text-white flex items-center gap-2">
                          {primaryLabel}
                          <span className="text-[10px] text-slate-400 font-normal">({secondaryLabel})</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{depthLabel}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-900/80 rounded-lg text-emerald-400 block font-mono">
                          {primaryWeight}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {secondaryWeight}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  <i className="fa-solid fa-circle-exclamation text-2xl mb-2 block text-slate-600"></i>
                  {isEn ? "No steel profiles match the selected criteria." : "No se encontraron perfiles con los criterios seleccionados."}
                </div>
              )}
            </div>
          </div>

          {/* PROFILE DETAIL & SVG VIEWPORT PANEL */}
          <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 lg:col-span-2 flex flex-col justify-between">
            {selectedProfile ? (
              <div>
                {/* Header Profile Title */}
                <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-4">
                  <div>
                    <span className="text-xs font-bold text-bim-blue uppercase tracking-wider">
                      {isEn ? "Section" : "Sección"} {selectedProfile.type} · AISC v15.0
                    </span>
                    <h2 className="text-3xl font-black text-white font-grotesk flex items-center gap-3">
                      {unitSys === "metric" ? selectedProfile.metricDesignation : selectedProfile.designation}
                      <span className="text-xs font-semibold text-emerald-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                        {isEn ? "Equiv:" : "Equiv:"} {unitSys === "metric" ? selectedProfile.designation : selectedProfile.metricDesignation}
                      </span>
                    </h2>
                  </div>

                  {/* Add to Take-off Form Controls */}
                  <div className="flex items-center gap-2 flex-wrap bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                    <input
                      type="text"
                      placeholder={isEn ? "Mark (e.g. C-01)" : "Marca (ej. C-01)"}
                      value={mark}
                      onChange={(e) => setMark(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white w-28 placeholder:text-slate-500 focus:outline-none focus:border-bim-blue"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">{isEn ? "Length:" : "Largo:"}</span>
                      <input
                        type="number"
                        min="1"
                        value={lengthParam}
                        onChange={(e) => setLengthParam(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white w-14 text-center font-bold"
                      />
                      <span className="text-xs text-slate-400 font-mono">{unitSys === "metric" ? "m" : "ft"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">{isEn ? "Qty:" : "Cant:"}</span>
                      <input
                        type="number"
                        min="1"
                        value={qtyParam}
                        onChange={(e) => setQtyParam(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white w-12 text-center"
                      />
                    </div>
                    <button
                      onClick={addToList}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <i className="fa-solid fa-plus"></i> {isEn ? "Add" : "Agregar"}
                    </button>
                  </div>
                </div>

                {/* SVG Visualizer + Quick Properties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* SVG Container */}
                  <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 flex flex-col items-center justify-between min-h-[270px]">
                    <div className="w-full flex items-center justify-between border-b border-slate-800/60 pb-2 mb-1">
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                        <i className="fa-solid fa-compass-drafting text-bim-blue"></i>
                        {isEn ? "Schematic Diagram" : "Diagrama Esquemático"} ({unitSys === 'metric' ? (isEn ? 'Dimensions in mm' : 'Cotas en mm') : (isEn ? 'Dimensions in in' : 'Cotas en in')})
                      </span>
                    </div>
                    <ProfileSectionViewer
                      aiscProfile={selectedProfile}
                      aiscUnitSys={unitSys}
                      profileName={selectedProfile?.AISC_Manual_Label || "Perfil AISC"}
                      className="w-full flex items-center justify-center my-auto py-2"
                    />
                  </div>

                  {/* Summary Dual Properties Card */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
                      <span className="text-slate-400 block mb-1"><i className="fa-solid fa-weight-hanging mr-1 text-bim-blue"></i>{isEn ? "Nominal Weight" : "Peso Nominal"}</span>
                      <div className="font-mono">
                        <span className={`text-base font-bold ${isImp ? 'text-blue-400' : 'text-emerald-400'} block`}>
                          {isImp ? `${selectedProfile.W_lb} lb/ft` : `${selectedProfile.W_kg} kg/m`}
                        </span>
                        <span className="text-xs text-slate-400 block">
                          ({isImp ? `${selectedProfile.W_kg} kg/m` : `${selectedProfile.W_lb} lb/ft`})
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
                      <span className="text-slate-400 block mb-1"><i className="fa-solid fa-vector-square mr-1 text-indigo-400"></i>{isEn ? "Section Area" : "Área de Sección"}</span>
                      <div className="font-mono">
                        <span className="text-base font-bold text-white block">
                          {isImp ? `${selectedProfile.A_in2} in²` : `${selectedProfile.A_mm2} mm²`}
                        </span>
                        <span className="text-xs text-slate-400 block">
                          ({isImp ? `${selectedProfile.A_mm2} mm²` : `${selectedProfile.A_in2} in²`})
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
                      <span className="text-slate-400 block mb-1"><i className="fa-solid fa-rotate mr-1 text-emerald-400"></i>{isEn ? "Inertia Ix" : "Inercia Ix"}</span>
                      <div className="font-mono">
                        <span className="text-base font-bold text-white block">
                          {isImp ? `${selectedProfile.Ix_in4} in⁴` : `${selectedProfile.Ix_cm4} cm⁴`}
                        </span>
                        <span className="text-xs text-slate-400 block">
                          ({isImp ? `${selectedProfile.Ix_cm4} cm⁴` : `${selectedProfile.Ix_in4} in⁴`})
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
                      <span className="text-slate-400 block mb-1"><i className="fa-solid fa-rotate mr-1 text-orange-400"></i>{isEn ? "Inertia Iy" : "Inercia Iy"}</span>
                      <div className="font-mono">
                        <span className="text-base font-bold text-white block">
                          {isImp ? `${selectedProfile.Iy_in4} in⁴` : `${selectedProfile.Iy_cm4} cm⁴`}
                        </span>
                        <span className="text-xs text-slate-400 block">
                          ({isImp ? `${selectedProfile.Iy_cm4} cm⁴` : `${selectedProfile.Iy_in4} in⁴`})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Complete Dual Properties Table Grid */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span><i className="fa-solid fa-list-check mr-2 text-bim-blue"></i>{isEn ? "Structural Properties" : "Propiedades Estructurales"} ({isImp ? (isEn ? "US Customary Imperial" : "Imperial US Customary") : (isEn ? "Metric SI" : "Métrico SI")})</span>
                    <span className="text-emerald-400 text-[11px] font-normal">
                      {isImp ? (isEn ? "Primary: US Imperial (in / lb) · Secondary: Metric SI (mm / kg)" : "Primario: Imperial (in / lb) · Secundario: Métrico (mm / kg)") : (isEn ? "Primary: Metric SI (mm / kg) · Secondary: US Imperial (in / lb)" : "Primario: Métrico (mm / kg) · Secundario: Imperial (in / lb)")}
                    </span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                    {Object.entries(PROP_LABELS).map(([propKey, meta]) => {
                      const impVal = selectedProfile[`${propKey}_in`] || selectedProfile[`${propKey}_in2`] || selectedProfile[`${propKey}_in3`] || selectedProfile[`${propKey}_in4`] || selectedProfile[`${propKey}_in6`] || selectedProfile[propKey] || selectedProfile[`${propKey}_lb`];
                      const metVal = selectedProfile[`${propKey}_mm`] || selectedProfile[`${propKey}_mm2`] || selectedProfile[`${propKey}_cm3`] || selectedProfile[`${propKey}_cm4`] || selectedProfile[`${propKey}_cm6`] || selectedProfile[propKey] || selectedProfile[`${propKey}_kg`];

                      if (impVal === undefined && metVal === undefined) return null;

                      const primaryVal = isImp ? impVal : metVal;
                      const primaryUnit = isImp ? meta.impUnit : meta.metUnit;
                      const secondaryVal = isImp ? metVal : impVal;
                      const secondaryUnit = isImp ? meta.metUnit : meta.impUnit;

                      return (
                        <div key={propKey} className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50 flex flex-col justify-between">
                          <span className="text-slate-400 text-[11px] flex items-center gap-1.5 truncate">
                            <i className={`fa-solid ${meta.icon} text-bim-blue text-[10px]`}></i> {isEn ? meta.nameEn : (meta.nameEs || meta.name)}
                          </span>
                          <div className="mt-1 font-mono">
                            <span className="text-sm font-bold text-white block">
                              {primaryVal ?? "—"} <span className={`text-[10px] ${isImp ? 'text-blue-400' : 'text-emerald-400'} font-normal`}>{primaryUnit}</span>
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              {secondaryVal ?? "—"} <span className="text-[10px] text-slate-500 font-normal">{secondaryUnit}</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 text-slate-500">
                <i className="fa-solid fa-arrow-left text-3xl mb-3"></i>
                <p>{isEn ? "Select a profile from the left list to view its properties." : "Selecciona un perfil de la lista izquierda para consultar sus propiedades."}</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* PROJECT TAKEOFF & CUBICADOR SECTION */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-xl">
          
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {isEn ? "Materials Takeoff Module" : "Módulo de Cómputo de Materiales"}
              </span>
              <h2 className="text-2xl font-black text-white font-grotesk flex items-center gap-2">
                <i className="fa-solid fa-[#10b981] fa-calculator text-emerald-400"></i> {isEn ? "Project Steel Takeoff" : "Cubicador de Proyecto"}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportExcel}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <i className="fa-solid fa-file-excel text-sm"></i> {isEn ? "Export to Excel (.xlsx)" : "Exportar a Excel (.xlsx)"}
              </button>
              <button
                onClick={handleExportPdf}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <i className="fa-solid fa-file-pdf text-sm"></i> {isEn ? "Export to PDF (.pdf)" : "Exportar a PDF (.pdf)"}
              </button>
              <button
                onClick={handleClear}
                className="bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition-all flex items-center gap-1"
              >
                <i className="fa-solid fa-trash-can"></i> {isEn ? "Clear" : "Limpiar"}
              </button>
            </div>
          </div>

          {/* Grid: Take-off Table + Weight Breakdown Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Table Column (2 cols) */}
            <div className="lg:col-span-2 overflow-x-auto">
              {profileList.length > 0 ? (
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-3">{isEn ? "Mark / Tag" : "Marca / Tag"}</th>
                      <th className="py-3 px-3">{isEn ? "Qty" : "Cant"}</th>
                      <th className="py-3 px-3">{isEn ? "AISC Profile" : "Perfil AISC"}</th>
                      <th className="py-3 px-3">{isEn ? "Length" : "Largo"} ({isImp ? "ft" : "m"})</th>
                      <th className="py-3 px-3">{isEn ? "Unit Weight" : "Peso Unit"} ({isImp ? "lb/ft" : "kg/m"})</th>
                      <th className="py-3 px-3">{isEn ? "Total Weight" : "Peso Total"} ({isImp ? "lbs" : "kg"})</th>
                      <th className="py-3 px-3 text-right">{isEn ? "Action" : "Acción"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {profileList.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-bim-blue">{item.mark}</td>
                        <td className="py-2.5 px-3">{item.qty}</td>
                        <td className="py-2.5 px-3 font-bold text-white">
                          {item.displayLabel}
                          {item.secondaryLabel && (
                            <span className="text-[10px] text-slate-400 font-normal block">({item.secondaryLabel})</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">{item.length}</td>
                        <td className="py-2.5 px-3">{item.unitWeight}</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-400">{roundVal(item.totalWeight)}</td>
                        <td className="py-2.5 px-3 text-right font-sans">
                          <button
                            onClick={() => removeFromList(idx)}
                            className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                            title={isEn ? "Delete" : "Eliminar"}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500">
                  <i className="fa-solid fa-box-open text-3xl mb-2 text-slate-600 block"></i>
                  {isEn ? "No profiles added to the takeoff list. Select a profile above and click " : "No has agregado perfiles a la lista de cubicación. Selecciona un perfil arriba y haz clic en "}<strong>{isEn ? "\"+ Add\"" : "\"+ Agregar\""}</strong>.
                </div>
              )}
            </div>

            {/* Summary Cards & Doughnut Chart Column (1 col) */}
            <div className="flex flex-col justify-between gap-4">
              
              {/* Summary Cards */}
              <div className="space-y-3">
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{isEn ? "Structural Weight Subtotal" : "Subtotal Peso Estructural"}</span>
                  <span className="text-lg font-bold text-white font-mono">
                    {roundVal(takeoffSummary.totalWeight)} <span className="text-xs text-slate-400 font-normal">{isImp ? "lbs" : "kg"}</span>
                  </span>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">{isEn ? "Connections Margin" : "Margen Conexiones"}</span>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={connectionsPct}
                      onChange={(e) => setConnectionsPct(parseFloat(e.target.value) || 0)}
                      className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-white w-12 text-center"
                    />
                    <span className="text-xs text-slate-400">%</span>
                  </div>
                  <span className="text-sm font-bold text-slate-300 font-mono">
                    +{roundVal(takeoffSummary.connWeight)} {isImp ? "lbs" : "kg"}
                  </span>
                </div>

                <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 p-4 rounded-xl border border-emerald-500/40 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{isEn ? "Estimated Total Weight" : "Peso Total Estimado"}</span>
                  <span className="text-2xl font-black text-white font-mono">
                    {isImp
                      ? `${roundVal(takeoffSummary.grandTotal / 2000)} Tons (${roundVal(takeoffSummary.grandTotal)} lbs)`
                      : `${roundVal(takeoffSummary.grandTotal / 1000)} Ton (${roundVal(takeoffSummary.grandTotal)} kg)`}
                  </span>
                </div>
              </div>

              {/* Chart Container */}
              {profileList.length > 0 && (
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 h-[220px] relative">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
                    {isEn ? "Distribution by Shape Family" : "Distribución por Familia"}
                  </span>
                  <div className="h-[170px]">
                    <canvas ref={canvasRef} />
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
