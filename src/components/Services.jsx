import { services } from "../constants";
import SectionWrapper from "../hoc/SectionWrapper";
import { SpotlightCard } from "./ui/SpotlightCard";
import { useTranslation } from "../hooks/useTranslation";

export const Services = () => {
  const { t, language } = useTranslation();

  const handleContactScroll = (e) => {
    e.preventDefault();
    const contactSection = document.querySelector("#contact");
    if (!contactSection) return;
    contactSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="py-12 md:py-16">
      <div className="mb-10">
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
          {t("svc_tag")}
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {t("svc_title")}
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          {t("svc_desc")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => {
          const isEn = language === "en";
          const displayTitle = isEn && svc.title_en ? svc.title_en : svc.title;
          const displayDesc = isEn && svc.description_en ? svc.description_en : svc.description;

          return (
            <SpotlightCard
              key={svc.title}
              className="p-6 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl"
              spotlightColor="rgba(6, 182, 212, 0.14)"
              spotlightBorderColor="rgba(56, 189, 248, 0.45)"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xl mb-4 group-hover/spotlight:scale-110 transition-transform">
                  <i className={svc.icon} />
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
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 btn-tactile"
                  onClick={handleContactScroll}
                >
                  {t("svc_quote") || (isEn ? "Request a quote" : "Solicitar cotización")} <i className="fa-solid fa-arrow-right text-[10px]" />
                </a>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
};

export default SectionWrapper(Services, "services");
