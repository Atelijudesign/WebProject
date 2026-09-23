import { experiences, certifications, education } from "../constants";
import SectionWrapper from "../hoc/SectionWrapper";
import { useTranslation } from "../context/LanguageContext";

function Experience() {
  const { t, language } = useTranslation();
  const isEn = language === "en";

  const sortedCerts = [...certifications].sort((a, b) => b.year - a.year);
  const visibleExperiences = experiences.filter((exp) => !exp.hidden);

  return (
    <div className="py-12 md:py-16">
      <div className="mb-10">
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
          {t("exp_tag") || "// TRAYECTORIA PROFESIONAL & CREDENCIALES"}
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {t("exp_title") || "Experiencia, Certificaciones y Formación"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block mb-4">
            {t("exp_timeline") || "Línea de Tiempo Profesional"}
          </span>
          <div className="space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
            {visibleExperiences.map((exp) => {
              const displayPeriod = isEn && exp.period_en ? exp.period_en : (isEn ? exp.period.replace("Abr", "Apr").replace("Presente", "Present") : exp.period);
              const displayRole = isEn && exp.role_en ? exp.role_en : (isEn && exp.role === "Proyectista Estructural" ? "Senior Structural BIM Modeler" : exp.role);
              const displayDesc = isEn && exp.description_en ? exp.description_en : exp.description;

              return (
                <div
                  key={exp.company + exp.period}
                  className="pl-10 relative rounded-2xl p-6 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-300 shadow-xl"
                >
                  <div
                    className={`absolute left-2.5 top-6 w-3.5 h-3.5 rounded-full border-2 bg-slate-950 ${
                      exp.active ? "border-cyan-400 shadow-[0_0_10px_#06b6d4]" : "border-slate-600"
                    }`}
                  />
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{exp.company}</h3>
                      {exp.active && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
                          {isEn ? "Current Position" : "Trabajo Actual"}
                        </span>
                      )}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-xs font-bold">
                      {displayPeriod}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-cyan-300 font-bold mb-2">{displayRole}</div>
                  <p className="text-slate-300 text-xs leading-relaxed">{displayDesc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certifications & Education Column (1 col) */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block mb-4">
              {t("exp_certs") || "Certificaciones Internacionales"}
            </span>
            <div className="space-y-3">
              {sortedCerts.map((cert) => {
                const displayCertName = isEn && cert.name_en ? cert.name_en : cert.name;

                return (
                  <a
                    key={cert.name}
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-300 flex items-center gap-3 block shadow-md group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                      {cert.icon.startsWith("fa-") ? <i className={cert.icon} /> : cert.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {displayCertName}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                        {cert.org} · {cert.year}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block mb-4">
              {t("exp_education") || "Formación Académica"}
            </span>
            <div className="space-y-3">
              {education.map((edu) => {
                const displayEduName = isEn && edu.name_en ? edu.name_en : (isEn
                  ? (edu.name === "Ingeniería en Construcción" ? "Construction Engineering" : edu.name === "Dibujante Técnico" ? "Technical Drafter" : edu.name)
                  : edu.name);
                const displayEduPeriod = isEn && edu.period_en ? edu.period_en : (isEn ? edu.period.replace("Presente", "Present") : edu.period);

                return (
                  <div
                    key={edu.name}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-3 shadow-md"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-lg shrink-0">
                      <i className={edu.icon} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{displayEduName}</h4>
                      <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                        {edu.org} · {displayEduPeriod}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SectionWrapper(Experience, "experience");
