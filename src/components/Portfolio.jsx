import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioFilters, portfolioProjects } from "../constants";
import SectionWrapper from "../hoc/SectionWrapper";
import projectsData from "../data/proyectos.json";
import { SpotlightCard } from "./ui/SpotlightCard";
import { useTranslation } from "../context/LanguageContext";

const EN_CATEGORIES = {
  "Energía": "Energy",
  "Infraestructura": "Infrastructure",
  "Industrial": "Industrial",
  "Salud": "Healthcare",
  "Civil": "Civil",
  "Minería": "Mining",
  "Hidráulica": "Hydraulics",
  "Estructural": "Structural",
};

const EN_PROJECTS = {
  "Proyecto Hidroeléctrico Los Cóndores": {
    title: "Los Cóndores Hydroelectric Plant",
    description: "Run-of-the-river hydroelectric power plant. Water intake tunnels and underground powerhouse in the Andes mountain range.",
  },
  "Aeropuerto AMB": {
    title: "AMB Santiago International Airport",
    description: "Terminal 2, Pier concourses and multi-level parking. Comprehensive interdisciplinary BIM coordination.",
  },
  "Máquina Papelera MP05": {
    title: "MP05 Tissue Paper Machine",
    description: "Detailed engineering for ABSORMEX in Mexico. Heavy structural conversion framework and foundations.",
  },
  "Hospital Marga Marga": {
    title: "Marga Marga Hospital Complex",
    description: "Full reinforced concrete BIM model. Advanced interdisciplinary hospital coordination.",
  },
  "Paso Fronterizo Los Libertadores": {
    title: "Los Libertadores Border Complex",
    description: "Main structures for the international border crossing facilities at 3,200 m high mountain altitude.",
  },
  "Proyecto Arqueros": {
    title: "Arqueros Mining Project",
    description: "Structural design of the primary crusher station and critical auxiliary facilities.",
  },
  "Planta Desalinizadora Santo Domingo": {
    title: "Santo Domingo Desalination Plant",
    description: "Seawater intake sump, electrical room and reverse osmosis plant. Integral reinforced concrete modeling.",
  },
};

function PortfolioCard({ project, index }) {
  const { t, language } = useTranslation();
  const isEn = language === "en";

  const enData = EN_PROJECTS[project.title];
  const displayTitle = isEn ? (project.title_en || (enData ? enData.title : project.title)) : project.title;
  const displayDesc = isEn ? (project.description_en || (enData ? enData.description : project.description)) : project.description;
  const displayCategory = isEn ? (project.category_en || (EN_CATEGORIES[project.category] || project.category)) : project.category;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <SpotlightCard
        className="h-full overflow-hidden bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl"
        spotlightColor="rgba(6, 182, 212, 0.14)"
        spotlightBorderColor="rgba(56, 189, 248, 0.45)"
      >
        <div>
          <div className="relative h-48 overflow-hidden bg-slate-950">
            {project.confidential ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-950/80 text-amber-400 font-mono text-xs font-bold gap-2">
                <i className="fa-solid fa-lock" /> {t("portfolio_confidential") || "Proyecto Confidencial"}
              </div>
            ) : (
              <img
                src={project.image}
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
              {project.yearDisplay || project.year}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-2 group-hover/spotlight:text-cyan-300 transition-colors">
              {displayTitle}
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed mb-4">
              {displayDesc}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.map((tag) => (
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
          {project.link ? (
            <Link
              to={project.link}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 btn-tactile"
            >
              {t("portfolio_see_details") || "Ver detalles del proyecto"} <i className="fa-solid fa-arrow-right text-[10px]" />
            </Link>
          ) : (
            <span className="text-[11px] font-mono text-slate-500">
              {t("portfolio_nda") || "Detalles bajo NDA / Restringidos"}
            </span>
          )}
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

export const Portfolio = () => {
  const { t, language } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [dbFeatured, setDbFeatured] = useState([]);

  useEffect(() => {
    async function loadDbFeatured() {
      try {
        let data = null;
        if (window.location.hostname === "localhost") {
          try {
            const res = await fetch("http://localhost:3001/api/projects");
            if (res.ok) {
              const json = await res.json();
              data = json.value;
            }
          } catch (e) {
            console.warn("Local API server not running, using static JSON", e);
          }
        }

        if (!data) {
          data = projectsData.value;
        }

        const featuredList = (data || [])
          .filter((p) => p.featured === true)
          .map((p) => ({
            image: p.image_url || "assets/img/amb_00.webp",
            category: p.project_type || "Estructural",
            category_en: p.project_type_en || p.project_type || "Structural",
            title: p.name,
            title_en: p.name_en || p.name,
            year: String(p.year_end || p.year_start || p.period || ""),
            tags: p.software ? p.software.split(",").map((s) => s.trim()) : ["Revit"],
            description: p.description || "",
            description_en: p.description_en || p.description || "",
            link: `/project/${p.project_id}`,
          }));

        setDbFeatured(featuredList);
      } catch (err) {
        console.error("Error loading featured projects from DB:", err);
      }
    }
    loadDbFeatured();
  }, []);

  const sortedProjects = useMemo(() => {
    const combined = [...portfolioProjects, ...dbFeatured];
    return combined.sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      return yearB - yearA;
    });
  }, [dbFeatured]);

  const filtered = useMemo(() => {
    if (activeFilter === "Todos") return sortedProjects;
    return sortedProjects.filter((p) => p.tags.includes(activeFilter));
  }, [activeFilter, sortedProjects]);

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
          {t("portfolio_desc") || "Una selección de mis trabajos en minería masiva, hospitales, aeropuertos y estructuras complejas."}
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
        {portfolioFilters.map((filter) => {
          const displayLabel = filter === "Todos" && language === "en" ? "All" : filter;

          return (
            <button
              key={filter}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono transition-all btn-tactile ${
                activeFilter === filter
                  ? "bg-cyan-600 text-white font-bold shadow-md shadow-cyan-500/20"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {displayLabel}
            </button>
          );
        })}
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <PortfolioCard key={project.title} project={project} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SectionWrapper(Portfolio, "portfolio");
