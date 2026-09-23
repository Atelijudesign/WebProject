export const AffiliateBanner = ({
  type = "konstruedu",
  customTitle,
  customSubtitle,
  ctaText,
  ctaUrl,
  badgeText = "Recomendación Técnica",
  className = "",
}) => {
  // Preset Configurations
  const configs = {
    konstruedu: {
      badge: "Formación Certificada BIM",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      title: "Especialización Profesional en Modelado BIM con Autodesk Revit",
      subtitle: "Aprende modelado de estructuras complejas, coordinación interdisciplinaria y estándares PlanBIM con certificación internacional.",
      cta: "Ver Especialización en Konstruedu",
      url: "https://konstruedu.com/es/especializacion/modelado-de-proyectos-bim-con-revit-31290?utm_source=atelijudesign&utm_medium=banner&utm_campaign=revit_course",
      icon: "fa-graduation-cap",
      accentBorder: "hover:border-sky-500/40",
      btnClass: "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20",
    },
    "amazon-setup": {
      badge: "Workstation & Periféricos BIM",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      title: "Estación de Trabajo y Hardware Recomendado para Modelado 3D",
      subtitle: "Ratones 3Dconnexion SpaceMouse, monitores ultrawide y componentes de alto rendimiento para proyectos de ingeniería pesada.",
      cta: "Ver Equipamiento Recomendado",
      url: "https://www.amazon.com/s?k=3dconnexion+spacemouse+revit&tag=atelijudesign-20",
      icon: "fa-laptop-code",
      accentBorder: "hover:border-amber-500/40",
      btnClass: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold shadow-amber-500/20",
    },
    "revit-pack": {
      badge: "Recursos Digitales Pro",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      title: "Pack de Familias Revit Paramétricas & Tablas de Enfierradura",
      subtitle: "Descarga familias estructurales de escaleras metálicas, placas base y tablas dinámicas de cubicación de acero listas para producción.",
      cta: "Descargar Pack Pro",
      url: "/herramientas",
      icon: "fa-cube",
      accentBorder: "hover:border-purple-500/40",
      btnClass: "bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/20",
    },
  };

  const selected = configs[type] || configs.konstruedu;

  const finalTitle = customTitle || selected.title;
  const finalSubtitle = customSubtitle || selected.subtitle;
  const finalCta = ctaText || selected.cta;
  const finalUrl = ctaUrl || selected.url;
  const finalBadge = badgeText || selected.badge;

  return (
    <div
      className={`my-8 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl transition-all duration-300 relative overflow-hidden group ${selected.accentBorder} ${className}`}
    >
      {/* Decorative Glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${selected.badgeColor}`}
            >
              <i className={`fa-solid ${selected.icon} mr-1.5`}></i>
              {finalBadge}
            </span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              Alianza Afiliada
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-grotesk text-white tracking-tight leading-snug mb-2 group-hover:text-sky-300 transition-colors">
            {finalTitle}
          </h3>

          <p className="text-sm text-slate-400 leading-relaxed">
            {finalSubtitle}
          </p>
        </div>

        <div className="flex-shrink-0 w-full sm:w-auto">
          <a
            href={finalUrl}
            target={finalUrl.startsWith("http") ? "_blank" : "_self"}
            rel={finalUrl.startsWith("http") ? "noopener noreferrer sponsored" : ""}
            className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg hover:scale-105 ${selected.btnClass}`}
          >
            <span>{finalCta}</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[11px]"></i>
          </a>
        </div>
      </div>
    </div>
  );
};
