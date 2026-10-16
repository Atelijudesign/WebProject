import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { asset } from "../utils/asset";
import SectionWrapper from "../hoc/SectionWrapper";
import { Tilt3DCard } from "./ui/Tilt3DCard";
import { useTranslation } from "../context/LanguageContext";
import { useProjectsData } from "../context/ProjectsContext";

const FALLBACK_IMAGES = {
  "Minería": "assets/img/arq_00.webp",
  "Mining": "assets/img/arq_00.webp",
  "Infraestructura / Puente Vial": "assets/img/pfll_00.webp",
  "Infrastructure / Road Bridge": "assets/img/pfll_00.webp",
  "Industrial": "assets/img/absormex_portada.webp",
  "Energía": "assets/img/phelc_portada.webp",
  "Energy": "assets/img/phelc_portada.webp",
  "Salud": "assets/img/hmm_portada.webp",
  "Healthcare": "assets/img/hmm_portada.webp",
  "Civil": "assets/img/pfll_00.webp",
  "default": "assets/img/amb_00.webp",
};

function getProjectImage(project) {
  if (project.image_url) return project.image_url;
  return FALLBACK_IMAGES[project.project_type] || FALLBACK_IMAGES["default"];
}

function PortfolioCard({ project, index }) {
  const { t, language } = useTranslation();
  const isEn = language === "en";

  const displayTitle = isEn ? (project.name_en || project.name) : project.name;
  const displayDesc = isEn ? (project.description_en || project.description) : project.description;
  const displayCategory = isEn ? (project.project_type_en || project.project_type) : project.project_type;
  const displayYear = String(project.year_end || project.year_start || project.period || "");
  const isConfidential = !project.image_url;
  const imageUrl = getProjectImage(project);
  const tags = project.software ? project.software.split(",").map((s) => s.trim()) : ["Revit"];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Tilt3DCard
        maxTilt={6}
        perspective={950}
        className="h-full overflow-hidden bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col justify-between"
        glareColor="rgba(6, 182, 212, 0.14)"
        spotlightBorderColor="rgba(56, 189, 248, 0.45)"
      >
        <div>
          <div className="relative h-48 overflow-hidden bg-slate-950">
            {isConfidential ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-amber-400 font-mono text-xs font-bold gap-2">
                <i className="fa-solid fa-image text-2xl text-slate-700 mb-1" />
                <span className="text-slate-600 text-[10px]">
                  {isEn ? "Image not available" : "Imagen no disponible"}
                </span>
              </div>
            ) : (
              <img
                src={asset(`/${imageUrl}`)}
                alt={displayTitle}
                className="w-full h-full object-cover group-hover/spotlight:scale-105 transition-transform duration-500"
                loading="lazy"
                width="800"
                height="500"
              />
            )}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 backdrop-blur-md text-cyan-400 font-mono text-[11px] font-bold">
              {displayCategory}
            </div>
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 backdrop-blur-md text-slate-300 font-mono text-[11px]">
              {displayYear}
            </div>
            {project.featured && (
              <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
                <i className="fa-solid fa-star text-amber-400 text-[10px]" />
              </div>
            )}
          </div>

          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-2 group-hover/spotlight:text-cyan-300 transition-colors line-clamp-2">
              {displayTitle}
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed mb-4 line-clamp-3">
              {displayDesc}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-0">
          <Link
            to={`/project/${project.project_id}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 btn-tactile"
          >
            {t("portfolio_see_details") || "Ver detalles del proyecto"}{" "}
            <i className="fa-solid fa-arrow-right text-[10px]" />
          </Link>
        </div>
      </Tilt3DCard>
    </motion.div>
  );
}

export const Portfolio = () => {
  const { t, language } = useTranslation();
  const isEn = language === "en";
  const [activeFilter, setActiveFilter] = useState("Todos");
  const { projects: databaseProjects } = useProjectsData();
  const projects = useMemo(
    () => databaseProjects.filter((project) => project.featured === true),
    [databaseProjects],
  );

  // Extraer filtros únicos de software (tags) de los proyectos featured
  const availableTags = useMemo(() => {
    const tagSet = new Set();
    projects.forEach((p) => {
      (p.software || "").split(",").forEach((s) => {
        const t = s.trim();
        if (t) tagSet.add(t);
      });
    });
    return ["Todos", ...Array.from(tagSet).sort()];
  }, [projects]);

  const filtered = useMemo(() => {
    const sorted = [...projects].sort((a, b) => {
      const yearA = parseInt(String(a.year_end || a.year_start || 0));
      const yearB = parseInt(String(b.year_end || b.year_start || 0));
      return yearB - yearA;
    });
    if (activeFilter === "Todos") return sorted;
    return sorted.filter((p) =>
      (p.software || "")
        .split(",")
        .map((s) => s.trim())
        .includes(activeFilter)
    );
  }, [projects, activeFilter]);

  return (
    <div className="py-12 md:py-16">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
          {t("portfolio_tag") || "// PORTAFOLIO DE INGENIERÍA"}
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {t("portfolio_title") || "Proyectos Destacados"}
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          {t("portfolio_desc") ||
            "Una selección de mis trabajos en minería masiva, hospitales, aeropuertos y estructuras complejas."}
        </p>
        {projects.length > 0 && (
          <p className="text-slate-600 text-xs mt-1 font-mono">
            {isEn
              ? `${projects.length} featured projects · Manage from `
              : `${projects.length} proyectos destacados · Administra desde `}
            <Link
              to="/proyectos-bim"
              className="text-cyan-600 hover:text-cyan-400 underline underline-offset-2"
            >
              /proyectos-bim
            </Link>
          </p>
        )}
      </div>

      {/* Filter Buttons — tags dinámicos desde proyectos featured */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
        {availableTags.map((filter) => {
          const displayLabel = filter === "Todos" && language === "en" ? "All" : filter;
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              className={`relative px-4 py-1.5 rounded-xl text-xs font-mono transition-all btn-tactile ${
                isActive
                  ? "text-white font-bold"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {isActive && (
                <motion.span
                  layoutId="activePortfolioFilterPill"
                  className="absolute inset-0 bg-cyan-600 rounded-xl -z-10 shadow-md shadow-cyan-500/25"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              <span className="relative z-10">{displayLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <PortfolioCard key={project.project_id} project={project} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500 text-sm font-mono">
          {isEn
            ? "No featured projects yet. Add them from /proyectos-bim ★"
            : "Sin proyectos destacados aún. Agrégalos desde /proyectos-bim ★"}
        </div>
      )}
    </div>
  );
};

export default SectionWrapper(Portfolio, "portfolio");
