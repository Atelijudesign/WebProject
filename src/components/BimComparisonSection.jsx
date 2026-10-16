import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "../hoc/SectionWrapper";
import { BeforeAfterSlider } from "./ui/BeforeAfterSlider";
import { useTranslation } from "../context/LanguageContext";

export const BimComparisonSection = () => {
  const { t, language } = useTranslation();
  const isEn = language === "en";
  const [expandedIndex, setExpandedIndex] = useState(1); // Segundo item (Solución BIM) abierto por defecto

  const comparisonItems = [
    {
      id: "cad",
      title: isEn ? "Traditional 2D CAD Drawbacks" : "El Problema del CAD 2D",
      icon: "fa-solid fa-triangle-exclamation",
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      accentBorder: "border-amber-500/40",
      summary: isEn
        ? "Interferences between specialties (Structure, Piping, HVAC) are discovered late during on-site erection, causing high rework costs."
        : "Las interferencias entre especialidades (Estructuras, Cañerías, HVAC) se descubren tarde en el montaje de obra, generando sobrecostos millonarios.",
      metrics: [
        { label: isEn ? "Clash Risk" : "Riesgo de Clashes", val: isEn ? "High (> 15% RFIs)" : "Alto (> 15% RFIs)", isNegative: true },
        { label: isEn ? "Takeoff Time" : "Tiempo de Cubicaciones", val: isEn ? "2-3 Manual Days" : "2-3 Días Manuales", isNegative: true },
        { label: isEn ? "Traceability" : "Trazabilidad", val: isEn ? "Fragmented in DWGs" : "Fragmentada en DWGs", isNegative: true },
      ],
    },
    {
      id: "bim",
      title: isEn ? "BIM + Code Solution" : "La Solución BIM + Código",
      icon: "fa-solid fa-shield-halved",
      iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      accentBorder: "border-cyan-500/50",
      summary: isEn
        ? "Parametric modeling with automated clash detection in Python and pyRevit before issuing fabrication drawings to shop floor."
        : "Modelado paramétrico con detección de interferencias automatizada en Python y pyRevit antes de emitir cualquier plano a taller.",
      metrics: [
        { label: isEn ? "Shop Errors" : "Errores en Taller", val: "-85%", isNegative: false },
        { label: isEn ? "Model LOD" : "Nivel de Detalle", val: "LOD 400 (Fabricación)", isNegative: false },
        { label: isEn ? "Automation" : "Automatización", val: "pyRevit + C# .NET", isNegative: false },
      ],
    },
    {
      id: "takeoff",
      title: isEn ? "Automated Extraction" : "Extracción Automática",
      icon: "fa-solid fa-file-excel",
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      accentBorder: "border-emerald-500/40",
      summary: isEn
        ? "Element schedules, steel weights, profile types, and bolt counts generated in seconds directly from the 3D model."
        : "Cubicaciones por elemento, peso de acero, perfiles y listados de pernos generados en segundos directamente desde el modelo.",
      metrics: [
        { label: isEn ? "Generation Time" : "Tiempo de Generación", val: "< 5 Segundos", isNegative: false },
        { label: isEn ? "Export Formats" : "Exportación Directa", val: "Excel / CSV / IFC", isNegative: false },
        { label: isEn ? "Data Accuracy" : "Precisión Numérica", val: "100% Sin Desfase", isNegative: false },
      ],
    },
  ];

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="py-12 md:py-16">
      {/* Encabezado */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
          {t("bim_tag") || "// TRANSFORMACIÓN DIGITAL EN INGENIERÍA"}
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {t("bim_title") || "De Planos 2D Dispersos a Modelos BIM Coordinados"}
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          {t("bim_desc") ||
            "Compara en tiempo real la diferencia crítica entre planos tradicionales propensos a colisiones y la precisión milimétrica de un modelo estructural 3D listo para fabricación."}
        </p>
      </div>

      {/* Grid: Comparador + Kinetic Accordion Lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Principal: Slider Comparativo */}
        <div className="lg:col-span-7 xl:col-span-8">
          <BeforeAfterSlider
            beforeImage="assets/img/amb_pl1.webp"
            afterImage="assets/img/amb_00.webp"
            beforeBadge={t("bim_before_badge") || "AutoCAD 2D (Planos Tradicionales)"}
            afterBadge={t("bim_after_badge") || "Revit & Tekla 3D (Coordinación BIM)"}
            beforeMetric={t("bim_before_metric") || "Riesgo de colisiones & RFI"}
            afterMetric={t("bim_after_metric") || "0 Clashes & Cubicaciones Exactas"}
          />
        </div>

        {/* Columna Lateral: Acordeón Kinético Interactivo */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-3.5">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
              // COMPARATIVA TÉCNICA
            </span>
            <span className="text-[11px] font-mono text-cyan-400">
              {isEn ? "Click card to expand" : "Clic para expandir"}
            </span>
          </div>

          {comparisonItems.map((item, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <motion.div
                key={item.id}
                layout
                onClick={() => handleToggle(index)}
                className={`cursor-pointer rounded-2xl p-5 border backdrop-blur-xl transition-all duration-300 shadow-xl ${
                  isExpanded
                    ? `bg-slate-900/90 ${item.accentBorder} shadow-[0_0_20px_rgba(6,182,212,0.12)]`
                    : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70"
                }`}
              >
                {/* Header del Item */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm shrink-0 ${item.iconColor}`}
                    >
                      <i className={item.icon} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        // SPEC 0{index + 1}
                      </span>
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="text-slate-400 text-xs w-6 h-6 rounded-lg bg-slate-800/60 flex items-center justify-center shrink-0"
                  >
                    <i className="fa-solid fa-chevron-down" />
                  </motion.div>
                </div>

                {/* Resumen siempre visible */}
                <p className="text-xs text-slate-300 leading-relaxed mt-3">
                  {item.summary}
                </p>

                {/* Contenido Expandible con Métricas Técnicas */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      layout
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-3 border-t border-slate-800/80 space-y-2">
                        {item.metrics.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800/70 text-xs font-mono"
                          >
                            <span className="text-slate-400">{m.label}:</span>
                            <span
                              className={`font-bold ${
                                m.isNegative ? "text-amber-400" : "text-emerald-400"
                              }`}
                            >
                              {m.val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(BimComparisonSection, "bim-comparison");
