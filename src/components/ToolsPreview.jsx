import { toolsPreview } from "../constants";
import SectionWrapper from "../hoc/SectionWrapper";
import { SpotlightCard } from "./ui/SpotlightCard";
import { useTranslation } from "../context/LanguageContext";

const EN_TOOLS = {
  "/herramientas/icha": {
    title: "ICHA Digital Catalog",
    description: "Interactive search engine for structural steel profiles with complete mechanical properties, project takeoff, profile comparator and Excel/PDF export. Chilean Standard.",
  },
  "/herramientas/aisc": {
    title: "AISC v15.0 Catalog",
    description: "AISC standard database with 2,100+ steel profiles, 2D dimensions, unit converter (Imperial / Metric) and steel takeoff.",
  },
  "/blog": {
    title: "BIM Technical Blog",
    description: "Articles on automation, BIM workflows and engineering tools for structural designers.",
  },
};

export const ToolsPreview = () => {
  const { t, language } = useTranslation();

  return (
    <div className="py-12 md:py-16">
      <div className="mb-10">
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
          {t("tools_tag") || "// SUITE DE HERRAMIENTAS WEB TÉCNICAS"}
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {t("tools_title") || "No solo diseño — también creo las herramientas"}
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          {t("tools_desc") || "Calculadoras y catálogos online gratuitos para proyectistas estructurales, desarrollados con la precisión de la ingeniería real."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {toolsPreview.map((tool) => {
          const isEn = language === "en";
          const enInfo = EN_TOOLS[tool.link];
          const displayTitle = isEn && enInfo ? enInfo.title : tool.title;
          const displayDesc = isEn && enInfo ? enInfo.description : tool.description;

          return (
            <SpotlightCard
              key={tool.title}
              className={`p-6 border backdrop-blur-xl shadow-xl ${
                tool.featured
                  ? "bg-slate-900/80 border-cyan-500/50 hover:border-cyan-400 shadow-cyan-500/10"
                  : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
              }`}
              spotlightColor={tool.featured ? "rgba(6, 182, 212, 0.18)" : "rgba(56, 189, 248, 0.12)"}
              spotlightBorderColor={tool.featured ? "rgba(6, 182, 212, 0.6)" : "rgba(56, 189, 248, 0.35)"}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xl group-hover/spotlight:scale-110 transition-transform">
                    <i className={tool.icon} />
                  </div>
                  {tool.featured && (
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono font-bold">
                      {t("tools_featured_badge") || "Destacada"}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover/spotlight:text-cyan-300 transition-colors">
                  {displayTitle}
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-6">
                  {displayDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <a
                  href={tool.link}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 btn-tactile"
                >
                  {tool.featured
                    ? (t("tools_btn_use") || "Usar herramienta online")
                    : (t("tools_btn_read") || "Leer el artículo")}{" "}
                  <i className="fa-solid fa-arrow-right text-[10px]" />
                </a>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
};

export default SectionWrapper(ToolsPreview, "tools-preview");
