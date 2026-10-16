import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";
import SEOHead from "../components/SEOHead";
import { ToolsLeadCapture } from "../components/ToolsLeadCapture";
import { ICHA_CATALOG } from "../data/icha_data.js";
import { useTranslation } from "../context/LanguageContext";
import { ExportService, ExcelTakeoffStrategy, PdfTakeoffStrategy } from "../core/export";
import { trackToolInteraction } from "../utils/analytics";

// ==================== PROPERTY LABELS ====================
const PROP_LABELS = {
  "weight": { i18n: "prop_weight", unit: "kg/m", icon: "fa-weight-hanging" },
  "gramil_mm": { i18n: "prop_g", unit: "mm", icon: "fa-circle-dot" },
  "H_mm": { i18n: "prop_h", unit: "mm", icon: "fa-arrows-up-down" },
  "B_mm": { i18n: "prop_b", unit: "mm", icon: "fa-arrows-left-right" },
  "e_mm": { i18n: "prop_e", unit: "mm", icon: "fa-ruler" },
  "t_mm": { i18n: "prop_t", unit: "mm", icon: "fa-ruler" },
  "C_mm": { i18n: "prop_c", unit: "mm", icon: "fa-ruler" },
  "A_cm²": { i18n: "prop_area", unit: "cm²", icon: "fa-vector-square" },
  "Ix_cm⁴": { i18n: "prop_ix", unit: "cm⁴", icon: "fa-rotate" },
  "Wx_cm³": { i18n: "prop_wx", unit: "cm³", icon: "fa-cube" },
  "ix_cm": { i18n: "prop_ix_rad", unit: "cm", icon: "fa-circle-dot" },
  "Iy_cm⁴": { i18n: "prop_iy", unit: "cm⁴", icon: "fa-rotate" },
  "Wy_cm³": { i18n: "prop_wy", unit: "cm³", icon: "fa-cube" },
  "iy_cm": { i18n: "prop_iy_rad", unit: "cm", icon: "fa-circle-dot" },
  "xy_cm": { i18n: "prop_xy", unit: "cm", icon: "fa-crosshairs" },
  "x_cm": { i18n: "prop_x", unit: "cm", icon: "fa-crosshairs" },
  "y_cm": { i18n: "prop_y", unit: "cm", icon: "fa-crosshairs" },
  "X_cm": { i18n: "prop_X", unit: "cm", icon: "fa-crosshairs" },
  "iu_cm": { i18n: "prop_iu", unit: "cm", icon: "fa-circle-dot" },
  "iv_cm": { i18n: "prop_iv", unit: "cm", icon: "fa-circle-dot" },
};

import { buildIchaProfileSvg as buildProfileSvg } from "../components/svg/ProfileSvgFactory";
import { ProfileSectionViewer } from "../components/svg/ProfileSectionViewer";

export default function IchaCatalog() {
  const { language: lang, t } = useTranslation();

  const [currentSeries, setCurrentSeries] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileList, setProfileList] = useState([]);
  
  // Advanced filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterIx, setFilterIx] = useState("");
  const [filterMinW] = useState("");
  const [filterMaxW] = useState("");
  const [filterH, setFilterH] = useState("");

  // Add Item States
  const [mark, setMark] = useState("");
  const [lengthParam, setLengthParam] = useState(6);
  const [qtyParam, setQtyParam] = useState(1);
  const [connectionsPct, setConnectionsPct] = useState(10);

  // References
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  // Derived filtered profiles
  const filteredProfiles = useMemo(() => {
    if (!currentSeries) return [];
    let profiles = ICHA_CATALOG[currentSeries].profiles;
    let results = [];

    const minIxVal = parseFloat(filterIx) || 0;
    const minWVal = parseFloat(filterMinW) || 0;
    const maxWVal = parseFloat(filterMaxW) || Infinity;
    const maxHVal = parseFloat(filterH) || Infinity;
    const q = searchQuery.toLowerCase().replace(/\s+/g, "");

    for (let p of profiles) {
      const desig = p.designation.toLowerCase().replace(/\s+/g, "");
      const matchesSearch = desig.includes(q);
      const profileH = p.H_mm || 0;
      
      const matchesIx = (p["Ix_cm⁴"] || 0) >= minIxVal;
      const matchesWeight = p.weight >= minWVal && p.weight <= maxWVal;
      const matchesH = profileH <= maxHVal;

      if (matchesSearch && matchesIx && matchesWeight && matchesH) {
        results.push(p);
      }
    }
    return results;
  }, [currentSeries, searchQuery, filterIx, filterMinW, filterMaxW, filterH]);

  useEffect(() => {
    // Initial loaded list
    const saved = localStorage.getItem("bim-catalogo-icha-list");
    if (saved) {
      try {
        setProfileList(JSON.parse(saved));
      } catch {
        console.error("Failed to parse list");
      }
    }
  }, []);

  const addToList = () => {
    if (!selectedProfile) return;
    const unitWeight = selectedProfile.weight;
    const l = parseFloat(lengthParam) || 6;
    const c = parseInt(qtyParam) || 1;
    
    setProfileList([
      ...profileList,
      {
        ...selectedProfile,
        mark: mark || " — ",
        qty: c,
        length: l,
        unitWeight,
        totalWeight: c * l * unitWeight
      }
    ]);
    setMark(""); // clear mark
  };

  const removeFromList = (idx) => {
    const updated = [...profileList];
    updated.splice(idx, 1);
    setProfileList(updated);
  };

  // Datos de clasificación memoizados (solo recalcula cuando cambian datos o idioma)
  const classData = useMemo(() => {
    const categories = [
      { name: t("cat_light"), min: 0, max: 25 },
      { name: t("cat_medium"), min: 25, max: 50 },
      { name: t("cat_heavy"), min: 50, max: 100 },
      { name: t("cat_extra"), min: 100, max: Infinity },
    ];
    let catWeights = [0, 0, 0, 0];

    profileList.forEach(item => {
      for (let i = 0; i < categories.length; i++) {
        if (item.unitWeight >= categories[i].min && item.unitWeight < categories[i].max) {
          catWeights[i] += item.totalWeight;
          break;
        }
      }
    });

    const totalWeight = catWeights.reduce((a, b) => a + b, 0);
    const connectionTotal = totalWeight * (connectionsPct / 100);
    const grandTotal = totalWeight + connectionTotal;

    return { categories, catWeights, connectionTotal, totalWeight, grandTotal };
  }, [profileList, connectionsPct, lang]);

  // Guardar en localStorage cuando cambia la lista
  useEffect(() => {
    localStorage.setItem("bim-catalogo-icha-list", JSON.stringify(profileList));
  }, [profileList]);

  // Actualizar gráfico cuando cambian datos o idioma (separado para evitar resets innecesarios)
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const { catWeights, connectionTotal } = classData;
    const sum = catWeights.reduce((a, b) => a + b, 0) + connectionTotal;
    if (sum === 0) return;

    const labels = [
      t("chart_light"),
      t("chart_medium"),
      t("chart_heavy"),
      t("chart_extra"),
      t("chart_conns")
    ].map((l, i) => {
      const data = i === 4 ? connectionTotal : catWeights[i];
      const pct = sum > 0 ? ((data / sum) * 100).toFixed(1) : "0.0";
      return `${l} (${pct}%)`;
    });

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data: [...catWeights, connectionTotal],
          backgroundColor: ["#3b82f6", "#06b6d4", "#f59e0b", "#ef4444", "#8b5cf6"],
          borderColor: "#111827",
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right", labels: { color: "#9ca3af", font: { size: 10 } } }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [classData, lang]);

  // Export functions
  const handleExportExcel = async () => {
    if(!profileList.length) return alert(t("msg_no_data"));

    trackToolInteraction("icha_catalog", "export_excel");

    await ExportService.executeExport(new ExcelTakeoffStrategy(), {
      sheetName: lang === "en" ? "ICHA Takeoff" : "Cubicación ICHA",
      title: lang === "en" ? "Takeoff Summary - ICHA Catalog" : "Resumen de Cubicación - Catálogo ICHA",
      subtitle: lang === "en" ? "Chilean Steel Institute (ICHA) · Official Standards & Sections" : "Instituto Chileno del Acero · Especificaciones y Perfiles Oficiales",
      standardTag: lang === "en" ? "OFFICIAL ICHA STANDARD" : "NORMA ICHA OFICIAL",
      columns: [
        { header: t("th_mark"), key: "mark", width: 14, align: "center" },
        { header: t("th_qty"), key: "qty", width: 12, align: "center", numFmt: '#,##0' },
        { header: t("th_profile"), key: "designation", width: 26, align: "left" },
        { header: `${t("th_len")} (m)`, key: "length", width: 15, align: "right", numFmt: '#,##0.00' },
        { header: `${t("th_unit_weight")} (kg/m)`, key: "unitWeight", width: 18, align: "right", numFmt: '#,##0.00' },
        { header: `${t("th_total_weight")} (kg)`, key: "totalWeight", width: 20, align: "right", numFmt: '#,##0.00' },
      ],
      data: profileList.map((p) => ({
        mark: p.mark,
        qty: p.qty,
        designation: p.designation,
        length: p.length,
        unitWeight: p.unitWeight,
        totalWeight: p.totalWeight,
      })),
      summary: {
        subtotal: classData.totalWeight,
        extraPct: connectionsPct,
        extraWeight: classData.connectionTotal,
        grandTotal: classData.grandTotal,
        tonTotal: classData.grandTotal / 1000,
        unitLabel: "kg",
        tonUnitLabel: "Ton",
      },
      filename: lang === "en" ? "icha-catalog-takeoff.xlsx" : "cubicacion-catalogo-icha.xlsx",
    });
  };

  const handleExportPdf = async () => {
    if(!profileList.length) return alert(t("msg_no_data"));

    trackToolInteraction("icha_catalog", "export_pdf");

    await ExportService.executeExport(new PdfTakeoffStrategy(), {
      title: lang === "en" ? "Takeoff Summary - ICHA Catalog" : "Resumen de Cubicación - Catálogo ICHA",
      subtitle: lang === "en" ? "Chilean Steel Institute (ICHA) · Official Standards & Sections" : "Instituto Chileno del Acero · Especificaciones y Perfiles Oficiales",
      standardTag: lang === "en" ? "OFFICIAL ICHA STANDARD" : "NORMA ICHA OFICIAL",
      headers: [t("th_mark"), t("th_qty"), t("th_profile"), `${t("th_len")} (m)`, `${t("th_unit_weight")} (kg/m)`, `${t("th_total_weight")} (kg)`],
      rows: profileList.map((p) => [
        p.mark,
        p.qty,
        p.designation,
        p.length.toFixed(2),
        p.unitWeight.toFixed(2),
        p.totalWeight.toFixed(2),
      ]),
      summary: {
        subtotal: classData.totalWeight,
        extraPct: connectionsPct,
        extraWeight: classData.connectionTotal,
        grandTotal: classData.grandTotal,
        tonTotal: classData.grandTotal / 1000,
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
      },
      filename: lang === "en" ? "icha-catalog-takeoff.pdf" : "cubicacion-catalogo-icha.pdf",
    });
  };

  const handleClear = () => {
    if(window.confirm(t("msg_confirm_clear"))){
      setProfileList([]);
    }
  };

  // View Renderings

  return (
    <div className="bg-gray-50 dark:bg-bim-dark text-gray-900 dark:text-gray-300 font-sans min-h-screen pt-24 pb-12 transition-colors duration-300">
      <SEOHead
        title={lang === "en" ? "Digital ICHA Catalog · Steel Profiles & Structural Takeoff Calculator" : "Catálogo ICHA Digital · Perfiles de Acero y Cubicador Estructural"}
        description={lang === "en" ? "Interactive search and viewer for Chilean Steel Institute (ICHA) structural profiles. Mechanical properties, 2D dimensions, takeoff, and Excel/PDF export." : "Buscador y visor interactivo de perfiles de acero estructural del Instituto Chileno del Acero (ICHA). Tablas de propiedades mecánicas, cotas 2D, cubicación y exportación Excel/PDF."}
        path="/herramientas/icha"
        keywords={lang === "en" ? "ICHA Catalog, Chile steel profiles, Chilean Steel Institute, structural steel takeoff, H-beams, channels, hollow structural sections, steel geometric properties" : "Catálogo ICHA, perfiles de acero Chile, Instituto Chileno del Acero, cubicador perfiles metálicos, vigas H, canales C, tubulares, propiedades geométricas acero"}
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": lang === "en" ? "Digital ICHA Catalog & Profile Takeoff Calculator" : "Catálogo ICHA Digital y Cubicador de Perfiles",
          "applicationCategory": "EngineeringApplication",
          "operatingSystem": "All",
          "url": "https://www.andresgallop.com/herramientas/icha",
          "description": lang === "en" ? "Online tool for structural designers and engineers featuring official ICHA steel profile catalog and automatic material takeoff." : "Herramienta online para diseñadores estructurales e ingenieros con catálogo normado ICHA de perfiles de acero estructural y cubicador automático.",
          "inLanguage": lang,
          "author": {
            "@type": "Person",
            "name": "Andrés Gallo P."
          }
        }}
      />
      <div className="max-w-7xl mx-auto px-4 mb-6 pt-4 flex items-center justify-between flex-wrap gap-3">
        <Link to="/herramientas" className="inline-flex items-center gap-2 text-sm font-bold text-bim-blue bg-bim-blue/10 hover:bg-bim-blue/20 border border-bim-blue/30 hover:border-bim-blue/50 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-bim-blue/20 group">
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> {lang === "en" ? "Back to Tools" : "Volver a Herramientas"}
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700/50 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm">
          <i className="fa-solid fa-house"></i> {lang === "en" ? "Back to Home" : "Volver al Inicio"}
        </Link>
      </div>
      
      {/* Hero */}
      <section className="relative overflow-hidden mb-8">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold mb-4 tracking-wider uppercase">
            {t("cat_hero_tag")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 font-grotesk text-white">
            <span>{t("cat_hero_title_prefix")}</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bim-blue to-cyan-400">{t("cat_hero_title_suffix")}</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t("cat_hero_desc")}
          </p>
        </div>
      </section>

      {/* Series Match */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4"><i className="fa-solid fa-shapes mr-2"></i>{t("sect_select_series")}</h2>
        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(76px, 1fr))" }}>
          {Object.entries(ICHA_CATALOG).map(([key, series]) => (
            <button
              key={key}
              onClick={() => {
                setCurrentSeries(key);
                setSelectedProfile(null);
                setSearchQuery("");
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${currentSeries === key ? 'bg-bim-blue/20 border-bim-blue text-bim-blue' : 'bg-slate-900/60 border-slate-700/50 text-gray-400 hover:border-bim-blue/50'}`}
            >
              <i className={`${series.icon} text-lg mb-1`}></i>
              <span className="text-xs font-bold">{key.replace("_desig", "")}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* SEARCH PANEL */}
          <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 lg:col-span-1">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4"><i className="fa-solid fa-magnifying-glass mr-2"></i>{t("sect_search_profile")}</h3>
            <div className="relative mb-4">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentSeries ? `${t("search_placeholder_prefix")} ${ICHA_CATALOG[currentSeries].name}` : t("lbl_search_placeholder")} 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 placeholder:text-slate-500 focus:outline-none focus:border-bim-blue text-white"
                disabled={!currentSeries}
              />
              <button onClick={() => setShowFilters(!showFilters)} className="absolute right-3 top-3.5 text-slate-400 hover:text-white">
                <i className="fa-solid fa-sliders"></i>
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-slate-800 rounded-lg">
                <input type="number" placeholder="Ix Mín" className="bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white" value={filterIx} onChange={e=>setFilterIx(e.target.value)} />
                <input type="number" placeholder="H Máx" className="bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white" value={filterH} onChange={e=>setFilterH(e.target.value)} />
              </div>
            )}

            <div className="max-h-[300px] overflow-y-auto space-y-1 pr-2 custom-scrollbar">
              {currentSeries && filteredProfiles.length > 0 ? (
                filteredProfiles.map((p, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedProfile(p)}
                    className="w-full flex justify-between items-center p-3 rounded-lg bg-slate-800/50 hover:bg-bim-blue/20 hover:text-bim-blue text-left transition-colors border border-transparent hover:border-bim-blue/30"
                  >
                    <span className="font-bold text-white text-sm">{p.designation}</span>
                    <span className="text-xs text-slate-400">{p.weight.toFixed(1)} kg/m</span>
                  </button>
                ))
              ) : (
                <div className="text-center p-4 text-slate-500 text-sm">
                  {!currentSeries ? t("msg_select_series_first") : t("msg_no_results")}
                </div>
              )}
            </div>
          </div>

          {/* PROPERTIES PANEL */}
          <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 lg:col-span-2">
             {selectedProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                
                {/* Visualizer */}
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4"><i className="fa-solid fa-vector-square mr-2"></i>{t("sect_cross_section")}</h3>
                  <div className="flex-1 bg-slate-800/30 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center p-6 min-h-[320px]">
                    <ProfileSectionViewer
                      ichaProfile={selectedProfile}
                      ichaSeries={currentSeries}
                      profileName={selectedProfile.designation}
                      className="mb-4 flex items-center justify-center w-full h-[200px]"
                    />
                    <h2 className="text-2xl font-bold text-white mb-1 font-mono tracking-tighter text-center">{selectedProfile.designation}</h2>
                    <p className="text-xs text-slate-400 mb-5 font-bold text-center">{ICHA_CATALOG[currentSeries].name}</p>
                     
                     <div className="flex gap-4">
                       <div className="text-center p-3 bg-slate-800 rounded-lg min-w-[100px] border border-slate-700">
                         <span className="block text-xs uppercase text-slate-500 font-bold mb-1">{t("res_weight")}</span>
                         <span className="text-xl font-bold text-bim-blue">{selectedProfile.weight.toFixed(1)}<span className="text-xs text-slate-400 ml-1">kg/m</span></span>
                       </div>
                       <div className="text-center p-3 bg-slate-800 rounded-lg min-w-[100px] border border-slate-700">
                         <span className="block text-xs uppercase text-slate-500 font-bold mb-1">{t("res_area")}</span>
                         <span className="text-xl font-bold text-white">{(selectedProfile["A_cm²"] || 0).toFixed(1)}<span className="text-xs text-slate-400 ml-1">cm²</span></span>
                       </div>
                     </div>
                  </div>

                  {/* Add to list controls */}
                  <div className="mt-4 p-4 border border-slate-700/50 bg-slate-800/50 rounded-xl space-y-3">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">{t("lbl_add_list")}</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder={t("lbl_mark")} className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={mark} onChange={e=>setMark(e.target.value)} />
                      <input type="number" value={lengthParam} onChange={e=>setLengthParam(e.target.value)} className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white text-center" title={t("lbl_len")} />
                      <input type="number" value={qtyParam} onChange={e=>setQtyParam(e.target.value)} className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white text-center" title={t("lbl_qty")} />
                      <button onClick={addToList} className="bg-bim-blue hover:bg-blue-600 text-white rounded-lg px-4 font-bold text-sm transition-colors flex items-center gap-2">
                        <i className="fa-solid fa-plus"></i> {t("btn_add")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Properties Grid */}
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4"><i className="fa-solid fa-table-list mr-2"></i>{t("sect_properties")}</h3>
                  <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                    {Object.keys(PROP_LABELS).map(key => {
                      if(selectedProfile[key] === undefined) return null;
                      const meta = PROP_LABELS[key];
                      const isHighlighted = ["weight", "H_mm", "B_mm", "e_mm", "t_mm", "gramil_mm"].includes(key);
                      const bgClass = isHighlighted ? "bg-bim-blue/10 border-bim-blue/50" : "bg-slate-800/50 border-slate-700/50";
                      const textClass = isHighlighted ? "text-blue-400" : "text-white";
                      const labelClass = isHighlighted ? "text-blue-300" : "text-gray-400";
                      const iconClass = isHighlighted ? "text-blue-400" : "text-gray-500";
                      
                      return (
                        <div key={key} className={`rounded-lg p-3 border ${bgClass} transition-colors`}>
                           <div className="flex items-center gap-2 mb-1">
                             <i className={`fa-solid ${meta.icon} text-[10px] ${iconClass}`}></i>
                             <span className={`text-xs font-bold ${labelClass}`}>{t(meta.i18n)}</span>
                           </div>
                           <span className={`text-lg font-bold ${textClass}`}>{selectedProfile[key].toLocaleString("es-CL")} <span className="text-[10px] font-normal opacity-70">{meta.unit}</span></span>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 py-20">
                  <i className="fa-solid fa-arrow-left text-4xl"></i>
                  <p>{t("properties_placeholder")}</p>
                </div>
             )}
          </div>
        </div>

        {/* SUMMARY LIST */}
        {profileList.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Table */}
            <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider"><i className="fa-solid fa-list-check mr-2"></i>{t("sect_summary")}</h3>
                <div className="flex gap-2">
                  <button onClick={handleExportExcel} className="bg-emerald-600/20 text-emerald-500 border border-emerald-600/50 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"><i className="fa-solid fa-file-excel"></i> Excel</button>
                  <button onClick={handleExportPdf} className="bg-rose-600/20 text-rose-500 border border-rose-600/50 hover:bg-rose-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"><i className="fa-solid fa-file-pdf"></i> PDF</button>
                  <button onClick={handleClear} className="text-red-400 hover:text-red-300 text-xs font-bold px-2 py-1"><i className="fa-solid fa-trash-can"></i> Limpiar</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 text-xs text-gray-400 uppercase tracking-wider">
                      <th className="py-2">{t("th_mark")}</th>
                      <th className="py-2 text-center">{t("th_qty")}</th>
                      <th className="py-2">{t("th_profile")}</th>
                      <th className="py-2 text-right">{t("th_len")} (m)</th>
                      <th className="py-2 text-right">{t("th_total_weight")} (kg)</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300 divide-y divide-gray-800">
                    {profileList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="py-2 font-bold text-white">{item.mark}</td>
                        <td className="py-2 text-center">{item.qty}</td>
                        <td className="py-2 text-bim-blue">{item.designation}</td>
                        <td className="py-2 text-right">{item.length.toFixed(1)}</td>
                        <td className="py-2 text-right font-bold text-white">{item.totalWeight.toFixed(2)}</td>
                        <td className="py-2 text-center text-red-500">
                          <button onClick={() => removeFromList(idx)} className="hover:text-white transition-colors"><i className="fa-solid fa-xmark"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Classification & Chart */}
            <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 lg:col-span-1">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4"><i className="fa-solid fa-weight-hanging mr-2"></i>{t("sect_classification")}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <label className="text-xs text-gray-400">{t("lbl_connections")}</label>
                  <input type="number" value={connectionsPct} onChange={e=>setConnectionsPct(e.target.value)} className="w-16 bg-slate-800 border border-slate-700 text-white rounded text-center text-sm py-1" />
                  <span className="text-xs text-gray-500">%</span>
                </div>
                
                {classData.totalWeight > 0 && (
                  <div className="h-[200px] mb-4">
                    <canvas ref={canvasRef}></canvas>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                   <span className="text-sm font-bold text-white">{t("cls_total_steel")}</span>
                   <span className="text-2xl font-black text-bim-blue">{classData.grandTotal.toLocaleString("es-CL", {maximumFractionDigits:1})} <span className="text-xs font-normal text-gray-500">kg</span></span>
                </div>
            </div>
          </div>
        )}

        {/* Lead Capture & Technical Resources */}
        <ToolsLeadCapture toolName="Catálogo ICHA y Cubicaciones" className="mt-14" />
      </div>

      {/* Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <Link to="/herramientas" className="inline-flex items-center gap-2 text-sm font-bold text-bim-blue hover:text-blue-400 transition-colors group">
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> {lang === "en" ? "Back to Tools" : "Volver a Herramientas"}
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <i className="fa-solid fa-house"></i> {lang === "en" ? "Back to Home" : "Volver al Inicio"}
        </Link>
      </div>
    </div>
  );
}
