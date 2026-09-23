import { skills, featuredProjects } from "../constants";
import SectionWrapper from "../hoc/SectionWrapper";
import { SpotlightCard } from "./ui/SpotlightCard";
import { useTranslation } from "../hooks/useTranslation";

export const About = () => {
  const { t, language } = useTranslation();

  return (
    <div className="py-12 md:py-16">
      <div className="mb-10">
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
          {t("about_tag")}
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {t("about_title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Perfil & Bio */}
        <SpotlightCard
          className="md:col-span-2 p-5 sm:p-6 md:p-8 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col md:flex-row gap-6 items-start"
          spotlightColor="rgba(6, 182, 212, 0.12)"
          spotlightBorderColor="rgba(56, 189, 248, 0.4)"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start w-full">
            <div className="relative shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-cyan-500/40 p-1 bg-slate-950 shadow-xl">
                <img
                  src="assets/img/profile.webp"
                  className="w-full h-full object-cover rounded-xl"
                  alt="Andrés Gallo P. — Proyectista Estructural BIM"
                  width="120"
                  height="120"
                  loading="lazy"
                />
              </div>
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold">
                {t("about_years_badge")}
              </span>
            </div>

            <div className="space-y-4 text-slate-300 text-sm leading-relaxed flex-1">
              <p dangerouslySetInnerHTML={{ __html: t("about_bio1") }} />
              <p>{t("about_bio2")}</p>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-2">
                <i className="fa-solid fa-code text-cyan-400" />
                <span dangerouslySetInnerHTML={{ __html: t("about_diff") }} />
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 2: Proyectos Emblemáticos */}
        <SpotlightCard
          className="p-6 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col justify-between"
          spotlightColor="rgba(16, 185, 129, 0.12)"
          spotlightBorderColor="rgba(52, 211, 153, 0.4)"
        >
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block mb-3">
              {t("about_featured_tag")}
            </span>
            <div className="space-y-3">
              {featuredProjects.map((proj) => {
                const isEn = language === "en";
                const displayTitle = isEn && proj.name_en ? proj.name_en : proj.name;
                const displayDetail = isEn && proj.detail_en ? proj.detail_en : proj.detail;

                return (
                  <div
                    key={proj.name}
                    className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center gap-3 hover:border-slate-700 transition-colors btn-tactile"
                  >
                    <img
                      src={`assets/img/flags/${proj.flag}.webp`}
                      width="24"
                      height="18"
                      alt={proj.flag === "cl" ? "Chile" : "México"}
                      className="rounded-sm shadow-sm shrink-0"
                    />
                    <div>
                      <div className="font-bold text-white text-xs">{displayTitle}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{displayDetail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SpotlightCard>

        {/* Card 3: Stack Técnico */}
        <SpotlightCard
          className="md:col-span-3 p-6 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl"
          spotlightColor="rgba(56, 189, 248, 0.12)"
          spotlightBorderColor="rgba(56, 189, 248, 0.35)"
        >
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-4">
            {t("about_stack_tag")}
          </span>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all btn-tactile ${
                  skill.highlight
                    ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-md shadow-cyan-500/10"
                    : "bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
