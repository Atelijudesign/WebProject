import SectionWrapper from "../hoc/SectionWrapper";
import { BeforeAfterSlider } from "./ui/BeforeAfterSlider";
import { SpotlightCard } from "./ui/SpotlightCard";
import { useTranslation } from "../context/LanguageContext";

export const BimComparisonSection = () => {
  const { t } = useTranslation();

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
          {t("bim_desc") || "Compara en tiempo real la diferencia crítica entre planos tradicionales propensos a colisiones y la precisión milimétrica de un modelo estructural 3D listo para fabricación."}
        </p>
      </div>

      {/* Grid: Comparador + Tarjetas de Impacto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Principal: Slider Comparativo */}
        <div className="lg:col-span-8">
          <BeforeAfterSlider
            beforeImage="assets/img/amb_pl1.webp"
            afterImage="assets/img/amb_00.webp"
            beforeBadge={t("bim_before_badge") || "AutoCAD 2D (Planos Tradicionales)"}
            afterBadge={t("bim_after_badge") || "Revit & Tekla 3D (Coordinación BIM)"}
            beforeMetric={t("bim_before_metric") || "Riesgo de colisiones & RFI"}
            afterMetric={t("bim_after_metric") || "0 Clashes & Cubicaciones Exactas"}
          />
        </div>

        {/* Columna Lateral: Tarjetas de Métricas & Beneficios */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <SpotlightCard
            className="p-5 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl"
            spotlightColor="rgba(245, 158, 11, 0.12)"
            spotlightBorderColor="rgba(245, 158, 11, 0.4)"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm">
                <i className="fa-solid fa-triangle-exclamation" />
              </div>
              <h4 className="text-sm font-bold text-white">{t("bim_card1_title") || "El Problema del CAD 2D"}</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t("bim_card1_desc") || "Las interferencias entre especialidades (Estructuras, Cañerías, HVAC) se descubren tarde en el montaje de obra, generando sobrecostos millonarios."}
            </p>
          </SpotlightCard>

          <SpotlightCard
            className="p-5 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl"
            spotlightColor="rgba(6, 182, 212, 0.14)"
            spotlightBorderColor="rgba(56, 189, 248, 0.45)"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm">
                <i className="fa-solid fa-shield-halved" />
              </div>
              <h4 className="text-sm font-bold text-white">{t("bim_card2_title") || "La Solución BIM + Código"}</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {t("bim_card2_desc") || "Modelado paramétrico con detección de interferencias automatizada en Python y pyRevit antes de emitir cualquier plano a taller."}
            </p>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-emerald-400">
              <span>{t("bim_card2_metric1") || "✓ -85% Errores en Taller"}</span>
              <span>{t("bim_card2_metric2") || "✓ 100% Trazabilidad"}</span>
            </div>
          </SpotlightCard>

          <SpotlightCard
            className="p-5 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl"
            spotlightColor="rgba(16, 185, 129, 0.12)"
            spotlightBorderColor="rgba(52, 211, 153, 0.4)"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm">
                <i className="fa-solid fa-file-excel" />
              </div>
              <h4 className="text-sm font-bold text-white">{t("bim_card3_title") || "Extracción Automática"}</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t("bim_card3_desc") || "Cubicaciones por elemento, peso de acero, perfiles y listados de pernos generados en segundos directamente desde el modelo."}
            </p>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(BimComparisonSection, "bim-comparison");
