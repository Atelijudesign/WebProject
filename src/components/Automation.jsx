import { automations } from "../constants";
import SectionWrapper from "../hoc/SectionWrapper";
import { BimAutomationPipeline } from "./BimAutomationPipeline";
import { useTranslation } from "../hooks/useTranslation";

export const Automation = () => {
  const { t, language } = useTranslation();
  const isEn = language === "en";

  return (
    <div className="py-12 md:py-16">
      {/* Título de la Sección */}
      <div className="mb-10">
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
          {t("auto_tag")}
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {t("auto_title")}
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          {t("auto_desc")}
        </p>
      </div>

      {/* ─── COMPONENTE ANIMATED BEAM: PIPELINE DE AUTOMATIZACIÓN ─── */}
      <BimAutomationPipeline />

      {/* Grid de Automatizaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automations.map((item) => {
          const displayTitle = isEn && item.title_en ? item.title_en : item.title;
          const displayDesc = isEn && item.description_en ? item.description_en : item.description;
          const displayResult = isEn && item.result_en ? item.result_en : item.result;
          const displayLinkText = isEn && item.link?.text_en ? item.link.text_en : item.link?.text;

          return (
            <div
              key={item.title}
              className="rounded-3xl p-6 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-cyan-500/40 hover:shadow-cyan-500/5 transition-all duration-300 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
                    {item.tech}
                  </span>
                  {displayResult && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                      ⚡ {displayResult}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {displayTitle}
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  {displayDesc}
                </p>
              </div>

              {item.link && (
                <div className="pt-4 border-t border-slate-800/80 mt-2">
                  <a
                    href={item.link.url}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 btn-tactile"
                  >
                    {displayLinkText} <i className="fa-solid fa-arrow-right text-[10px]" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionWrapper(Automation, "automation");
