import { NumberTicker } from "./ui/NumberTicker";
import { SpotlightCard } from "./ui/SpotlightCard";
import { useTranslation } from "../context/LanguageContext";

export const KeyMetricsBar = () => {
  const { t } = useTranslation();

  const metrics = [
    {
      value: 15,
      suffix: "+",
      label: t("metric_exp_label") || "Años de Trayectoria",
      detail: t("metric_exp_detail") || "Especialista en Minería, Salud & Estructuras",
      icon: "fa-solid fa-medal",
      color: "text-amber-400",
      borderGlow: "rgba(245, 158, 11, 0.4)",
      spotlight: "rgba(245, 158, 11, 0.12)",
    },
    {
      value: 2130,
      suffix: "+",
      label: t("metric_profiles_label") || "Perfiles Estructurales",
      detail: t("metric_profiles_detail") || "Manuales AISC v15 & Catálogos ICHA",
      icon: "fa-solid fa-cubes",
      color: "text-cyan-400",
      borderGlow: "rgba(6, 182, 212, 0.45)",
      spotlight: "rgba(6, 182, 212, 0.14)",
    },
    {
      value: 120000,
      suffix: "+",
      label: t("metric_steel_label") || "Toneladas de Acero",
      detail: t("metric_steel_detail") || "Modeladas y cubicadas sin desfases",
      icon: "fa-solid fa-industry",
      color: "text-emerald-400",
      borderGlow: "rgba(16, 185, 129, 0.45)",
      spotlight: "rgba(16, 185, 129, 0.12)",
    },
    {
      value: 95,
      suffix: "%",
      label: t("metric_time_label") || "Ahorro de Tiempo",
      detail: t("metric_time_detail") || "Mediante scripts en pyRevit, C# y Dynamo",
      icon: "fa-solid fa-bolt",
      color: "text-violet-400",
      borderGlow: "rgba(167, 139, 250, 0.45)",
      spotlight: "rgba(167, 139, 250, 0.12)",
    },
  ];

  return (
    <section className="py-10 px-4 bg-[#030712] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((metric, idx) => (
            <SpotlightCard
              key={idx}
              className="p-6 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl"
              spotlightColor={metric.spotlight}
              spotlightBorderColor={metric.borderGlow}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg group-hover/spotlight:scale-110 transition-transform">
                  <i className={`${metric.icon} ${metric.color}`} />
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                  // METRIC 0{idx + 1}
                </span>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                  <NumberTicker
                    value={metric.value}
                    suffix={metric.suffix}
                    delay={idx * 0.1}
                  />
                </div>
                <h4 className="text-sm font-bold text-slate-200 mb-1 group-hover/spotlight:text-cyan-300 transition-colors">
                  {metric.label}
                </h4>
                <p className="text-xs font-mono text-slate-400">
                  {metric.detail}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};
