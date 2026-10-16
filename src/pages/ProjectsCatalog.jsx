import { asset } from "../utils/asset";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";
import { ProjectsDashboard } from "../components/ProjectsDashboard";
import { AffiliateBanner } from "../components/AffiliateBanner";
import { ToolsLeadCapture } from "../components/ToolsLeadCapture";
import { useTranslation } from "../context/LanguageContext";
import { useProjectsData } from "../context/ProjectsContext";
import { createProject, setProjectFeatured } from "../services/projectsApi";
import { formatProjectType, getProjectTypeIcon } from "../utils/projectTypeHelpers";
import { MultiTagInput } from "../components/MultiTagInput";

const SECTOR_PRESETS = [
  "Minería",
  "Infraestructura",
  "Industrial",
  "Edificación",
  "Habitacional / Residencial",
  "Comercial",
  "Salud",
  "Educación / Institucional",
  "Energía",
  "Ferroviario",
  "Vial / Puentes",
  "Marítimo / Portuario",
  "Civil"
];

const MATERIAL_PRESETS = [
  "Hormigón Armado",
  "Acero Estructural",
  "Geoceldas & Geocompuestos",
  "HDPE / Geomembranas",
  "Albañilería Confinada",
  "Madera Laminada",
  "Estructuras Mixtas"
];

const ROLE_PRESETS = [
  "Diseñador Estructural Senior",
  "Diseñador de Arquitectura",
  "Modelador BIM Arquitectura",
  "Modelador BIM Estructuras",
  "Diseñador Estructural",
  "Diseñador Civil",
  "Coordinador BIM",
  "Visualizador 3D / Renderista",
  "Detallador de Armaduras",
  "Ingeniero de Proyectos",
  "Asesor Técnico"
];

const SOFTWARE_PRESETS = [
  "Revit Structure",
  "Revit Architecture",
  "AutoCAD",
  "Navisworks",
  "Tekla Structures",
  "Autodesk Civil 3D",
  "Lumion",
  "Enscape",
  "Twinmotion",
  "SketchUp",
  "3ds Max",
  "Photoshop",
  "Dynamo",
  "pyRevit",
  "Bluebeam"
];

const TYPE_TRANSLATIONS = {
  "Todos": "All",
  "Minería": "Mining",
  "Infraestructura": "Infrastructure",
  "Industrial": "Industrial",
  "Salud": "Healthcare",
  "Comercial": "Commercial",
  "Educacional": "Educational",
  "Habitacional": "Residential",
  "Marítimo": "Maritime",
  "Energía": "Energy",
  "Estructural": "Structural",
  "Civil": "Civil",
};

function SoftwareBadge({ software }) {
  if (!software) return null;
  const items = String(software)
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  if (items.length === 0) return null;

  return (
    <>
      {items.map((item) => {
        const softLower = item.toLowerCase();
        let icon = "fa-laptop-code";
        let styleClass = "from-cyan-500/20 via-sky-500/20 to-blue-600/20 border-cyan-400/50 text-cyan-300 shadow-cyan-500/10";

        if (softLower.includes("revit")) {
          icon = "fa-cube";
          styleClass = "from-sky-500/25 via-blue-600/25 to-indigo-600/25 border-sky-400/60 text-sky-300 shadow-sky-500/20";
        } else if (softLower.includes("tekla")) {
          icon = "fa-cubes";
          styleClass = "from-indigo-500/25 via-purple-600/25 to-violet-600/25 border-indigo-400/60 text-indigo-300 shadow-indigo-500/20";
        } else if (softLower.includes("autocad") || softLower.includes("lisp")) {
          icon = "fa-compass-drafting";
          styleClass = "from-amber-500/25 via-orange-600/25 to-red-600/25 border-amber-400/60 text-amber-300 shadow-amber-500/20";
        } else if (softLower.includes("civil")) {
          icon = "fa-route";
          styleClass = "from-emerald-500/25 via-teal-600/25 to-cyan-600/25 border-emerald-400/60 text-emerald-300 shadow-emerald-500/20";
        } else if (softLower.includes("navisworks")) {
          icon = "fa-eye";
          styleClass = "from-purple-500/25 via-fuchsia-600/25 to-pink-600/25 border-purple-400/60 text-purple-300 shadow-purple-500/20";
        } else if (softLower.includes("lumion") || softLower.includes("enscape") || softLower.includes("twinmotion") || softLower.includes("render") || softLower.includes("3ds") || softLower.includes("v-ray") || softLower.includes("vray")) {
          icon = "fa-image";
          styleClass = "from-emerald-500/25 via-teal-600/25 to-cyan-600/25 border-emerald-400/60 text-emerald-300 shadow-emerald-500/20";
        } else if (softLower.includes("sketchup")) {
          icon = "fa-shapes";
          styleClass = "from-rose-500/25 via-red-600/25 to-amber-600/25 border-rose-400/60 text-rose-300 shadow-rose-500/20";
        } else if (softLower.includes("photoshop")) {
          icon = "fa-wand-magic-sparkles";
          styleClass = "from-blue-600/25 via-sky-600/25 to-indigo-600/25 border-blue-400/60 text-blue-300 shadow-blue-500/20";
        }

        return (
          <span
            key={item}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-gradient-to-r border backdrop-blur-md shadow-md transition-all group-hover:scale-105 ${styleClass}`}
          >
            <i className={`fa-solid ${icon} text-[10px]`}></i>
            <span>{item}</span>
          </span>
        );
      })}
    </>
  );
}

export default function ProjectsCatalog() {
  const { t, language } = useTranslation();
  const { projects: databaseProjects, loading: databaseLoading, apiAvailable, refresh } = useProjectsData();
  const isEn = language === "en";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null); // Tracks which project is being toggled
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProjData, setNewProjData] = useState({
    name: "",
    name_en: "",
    company: "GHD",
    client: "",
    project_type: "Minería",
    material: "Acero Estructural",
    role: "Diseñador Estructural",
    software: "Revit Structure, Navisworks",
    year_start: 2026,
    year_end: 2026,
    description: "",
    description_en: "",
    image_url: "",
    featured: true,
  });

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedCompany, setSelectedCompany] = useState("Todas");
  const [selectedSoftware, setSelectedSoftware] = useState("Todos");
  const [selectedMaterial, setSelectedMaterial] = useState("Todos");

  useEffect(() => {
    const sortedData = [...databaseProjects].sort((a, b) => {
      const yB = b.year_end || b.year_start || 0;
      const yA = a.year_end || a.year_start || 0;
      if (yB !== yA) return yB - yA;
      return String(b.project_id || '').localeCompare(String(a.project_id || ''));
    });
    setProjects(sortedData);
    setLoading(databaseLoading);
  }, [databaseProjects, databaseLoading]);

  const handleToggleFeatured = async (projectId, currentFeatured) => {
    const newFeatured = !currentFeatured;
    setTogglingId(projectId);

    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) => p.project_id === projectId ? { ...p, featured: newFeatured } : p)
    );

    try {
      await setProjectFeatured(projectId, newFeatured);
      await refresh({ silent: true });
    } catch (err) {
      console.error("Error updating featured:", err);
      // Revert on error
      setProjects((prev) =>
        prev.map((p) => p.project_id === projectId ? { ...p, featured: currentFeatured } : p)
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjData.name.trim()) return;
    setIsSubmitting(true);
    try {
      const result = await createProject(newProjData);
      if (result.project) {
        await refresh({ silent: true });
        setIsCreateModalOpen(false);
        setNewProjData({
          name: "",
          name_en: "",
          company: "GHD",
          client: "",
          project_type: "Minería",
          material: "Acero Estructural",
          role: "Diseñador Estructural",
          software: "Revit Structure, Navisworks",
          year_start: 2026,
          year_end: 2026,
          description: "",
          description_en: "",
          image_url: "",
          featured: true,
        });
      } else {
        alert(isEn ? "Error creating project on local API" : "Error al crear proyecto en la API local");
      }
    } catch (err) {
      console.error("Error creating project:", err);
      alert(isEn ? "Connection error with local API server" : "Error de conexión con el servidor API local");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic filter options extracted from dataset (splitting comma-separated tags)
  const projectTypes = useMemo(() => {
    const set = new Set();
    projects.forEach(p => {
      if (!p.project_type) return;
      p.project_type.split(",").forEach(item => {
        const trimmed = item.trim();
        if (trimmed) set.add(trimmed);
      });
    });
    return ["Todos", ...Array.from(set).sort()];
  }, [projects]);

  const companies = useMemo(() => {
    const set = new Set(projects.map(p => p.company).filter(Boolean));
    return ["Todas", ...Array.from(set).sort()];
  }, [projects]);

  const softwares = useMemo(() => {
    const set = new Set();
    projects.forEach(p => {
      if (!p.software) return;
      p.software.split(",").forEach(item => {
        const trimmed = item.trim();
        if (trimmed) set.add(trimmed);
      });
    });
    return ["Todos", ...Array.from(set).sort()];
  }, [projects]);

  const materials = useMemo(() => {
    const set = new Set();
    projects.forEach(p => {
      if (!p.material) return;
      p.material.split(",").forEach(item => {
        const trimmed = item.trim();
        if (trimmed) set.add(trimmed);
      });
    });
    return ["Todos", ...Array.from(set).sort()];
  }, [projects]);

  // Combined Filter logic
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const searchLower = search.toLowerCase();
      const matchesSearch = !search || 
        (p.name?.toLowerCase() || "").includes(searchLower) || 
        (p.name_en?.toLowerCase() || "").includes(searchLower) ||
        (p.company?.toLowerCase() || "").includes(searchLower) ||
        (p.client?.toLowerCase() || "").includes(searchLower) ||
        (p.project_id?.toLowerCase() || "").includes(searchLower) ||
        (p.description?.toLowerCase() || "").includes(searchLower) ||
        (p.description_en?.toLowerCase() || "").includes(searchLower);

      const matchesType = selectedType === "Todos" ||
        (p.project_type && p.project_type.split(",").map(s => s.trim().toLowerCase()).includes(selectedType.toLowerCase()));
      const matchesCompany = selectedCompany === "Todas" || p.company === selectedCompany;
      const matchesSoftware = selectedSoftware === "Todos" ||
        (p.software && p.software.split(",").map(s => s.trim().toLowerCase()).includes(selectedSoftware.toLowerCase()));
      const matchesMaterial = selectedMaterial === "Todos" ||
        (p.material && p.material.split(",").map(s => s.trim().toLowerCase()).includes(selectedMaterial.toLowerCase()));
      const matchesFeatured = !onlyFeatured || p.featured === true;

      return matchesSearch && matchesType && matchesCompany && matchesSoftware && matchesMaterial && matchesFeatured;
    });
  }, [projects, search, selectedType, selectedCompany, selectedSoftware, selectedMaterial, onlyFeatured]);

  const hasActiveFilters = search || selectedType !== "Todos" || selectedCompany !== "Todas" || selectedSoftware !== "Todos" || selectedMaterial !== "Todos" || onlyFeatured;

  const resetFilters = () => {
    setSearch("");
    setSelectedType("Todos");
    setSelectedCompany("Todas");
    setSelectedSoftware("Todos");
    setSelectedMaterial("Todos");
    setOnlyFeatured(false);
  };

  return (
    <div className="projects-bim-page min-h-screen">
      <SEOHead
        title={isEn ? "BIM & Structural Projects Portfolio · Mining, Airports & Healthcare" : "Portafolio de Proyectos BIM & Estructurales · Minería, Aeropuertos y Salud"}
        description={isEn ? "Database and portfolio of BIM projects in mining, airports, hospitals and industrial facilities in Chile, Mexico and Uruguay. Engineered in Revit, Tekla and Navisworks." : "Base de datos y portafolio de proyectos BIM en minería, aeropuertos, hospitales y plantas industriales en Chile, México y Uruguay. Diseñado en Revit, Tekla y Navisworks."}
        path="/proyectos-bim"
        keywords="Proyectos BIM Chile, portafolio diseño estructural, modelado Revit minería, estructuras hospitalarias Tekla, Navisworks clash detection"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": isEn ? "BIM & Structural Projects Database" : "Base de Datos de Proyectos BIM & Estructurales",
          "url": "https://www.andresgallop.com/proyectos-bim",
          "description": isEn ? "Comprehensive portfolio with 40+ structural and BIM projects developed by Andrés Gallo P." : "Portafolio exhaustivo con más de 40 proyectos estructurales y BIM desarrollados por Andrés Gallo P."
        }}
      />
      <div className="bg-mesh" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />
      
      <main className="container pt-32 pb-20 relative z-10">
        {/* Top Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700/50 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm group"
          >
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> {isEn ? "Back to Home" : "Volver al Inicio"}
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold font-grotesk tracking-tight gradient-text mb-4">
            {t("catalog_title", isEn ? "BIM Projects Database" : "Base de Datos de Proyectos BIM")}
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            {t("catalog_subtitle", isEn ? "Explore the detailed structural portfolio featuring 40+ internationally executed projects." : "Explora el portafolio estructural detallado con más de 40 proyectos ejecutados a nivel internacional.")}
          </p>
        </div>

        {/* API & Portfolio Status Bar */}
        {!loading && (
          <div className={`mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-xl border text-xs font-mono ${
            apiAvailable
              ? "bg-emerald-500/8 border-emerald-500/25 text-emerald-400"
              : "bg-amber-500/8 border-amber-500/25 text-amber-400"
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${apiAvailable ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              {apiAvailable ? (
                <span>
                  {isEn ? "Live editing mode — changes persist to" : "Modo edición en vivo — cambios se guardan en"}{" "}
                  <code className="opacity-75">SQLite · atelijudesign.db</code>
                </span>
              ) : (
                <span>
                  {isEn
                    ? "Read-only mode. To enable editing, run: "
                    : "Modo solo lectura. Para editar, ejecuta: "}
                  <code className="bg-amber-500/15 px-1.5 py-0.5 rounded">npm run server</code>
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Quick filter toggle: All vs Portfolio Only */}
              <button
                type="button"
                onClick={() => setOnlyFeatured(!onlyFeatured)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                  onlyFeatured
                    ? "bg-amber-500/25 border-amber-500/60 text-amber-300 shadow-sm"
                    : "bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600"
                }`}
                title={isEn ? "Filter only featured projects in portfolio" : "Filtrar solo proyectos destacados en portafolio"}
              >
                <i className="fa-solid fa-star text-[10px] text-amber-400" />
                <span>{onlyFeatured ? (isEn ? "Showing Portfolio Only" : "Viendo Solo Portfolio") : (isEn ? "Filter Portfolio" : "Filtrar Portfolio")}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-[10px] text-amber-300">
                  {projects.filter(p => p.featured).length}
                </span>
              </button>

              {/* Create new project button (enabled in API mode) */}
              {apiAvailable && (
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
                  title={isEn ? "Create new project in database" : "Crear nuevo proyecto en la base de datos"}
                >
                  <i className="fa-solid fa-plus text-[10px]" />
                  <span>{isEn ? "New Project" : "Nuevo Proyecto"}</span>
                </button>
              )}

              <span className="flex items-center gap-1 text-slate-400 px-2 py-1">
                <i className="fa-solid fa-database text-[10px]" />
                {projects.length} {isEn ? "projects" : "proyectos"}
              </span>

              <a
                href="/#portfolio"
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors px-2 py-1"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                {isEn ? "View Portfolio" : "Ver Portfolio"}
              </a>
            </div>
          </div>
        )}

        {/* Analytics & Metrics Dashboard */}
        {!loading && projects.length > 0 && (
          <ProjectsDashboard
            allProjects={projects}
            filteredProjects={filteredProjects}
            projects={projects}
            selectedType={selectedType}
            selectedSoftware={selectedSoftware}
            selectedMaterial={selectedMaterial}
            selectedCompany={selectedCompany}
            onSelectType={(type) => setSelectedType(type)}
            onSelectSoftware={(soft) => setSelectedSoftware(soft)}
            onSelectMaterial={(mat) => setSelectedMaterial(mat)}
            onSelectCompany={(comp) => setSelectedCompany(comp)}
            onResetFilters={resetFilters}
          />
        )}

        {/* Filter Panel */}
        <div className="filters-bar mb-8 p-6 bg-slate-900/70 border border-slate-700/60 rounded-2xl backdrop-blur-md shadow-xl">
          {/* Main Search Input */}
          <div className="relative mb-6">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input 
              type="text" 
              placeholder={t("catalog_search_placeholder", isEn ? "Search by project name, client, ID or keyword..." : "Buscar por nombre de proyecto, cliente, ID o palabra clave...")} 
              className="w-full bg-slate-800/70 border border-slate-700 text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-bim-blue focus:ring-1 focus:ring-bim-blue transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch("")} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                {isEn ? "✕ Clear" : "✕ Limpiar"}
              </button>
            )}
          </div>

          {/* Type/Category Pills */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {t("catalog_filter_type", isEn ? "Project Type:" : "Tipo de Proyecto:")}
            </label>
            <div className="flex flex-wrap gap-2">
              {projectTypes.map((type) => {
                const displayTypeLabel = formatProjectType(type, isEn, false);
                const typeIcon = getProjectTypeIcon(type);
                const isSelected = selectedType === type;

                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors border flex items-center gap-1.5 select-none ${
                      isSelected
                        ? "text-white border-cyan-400/40"
                        : "bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-700/60 hover:text-white"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="activeProjectTypePill"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md shadow-cyan-500/25 -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      />
                    )}
                    <i className={`fa-solid ${typeIcon} text-[10px] relative z-10`}></i>
                    <span className="relative z-10">{displayTypeLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            {/* Company Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-building text-indigo-400 text-xs"></i> {isEn ? "Company / Firm" : "Empresa / Especialista"}
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-bim-blue"
              >
                {companies.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-slate-200">
                    {c === "Todas" ? (isEn ? "All companies" : "Todas las empresas") : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Software Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-laptop-code text-cyan-400 text-xs"></i> {isEn ? "BIM Software" : "Software BIM"}
              </label>
              <select
                value={selectedSoftware}
                onChange={(e) => setSelectedSoftware(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-bim-blue"
              >
                {softwares.map((s) => (
                  <option key={s} value={s} className="bg-slate-900 text-slate-200">
                    {s === "Todos" ? (isEn ? "All software" : "Todos los softwares") : s}
                  </option>
                ))}
              </select>
            </div>

            {/* Material Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-cubes text-emerald-400 text-xs"></i> {isEn ? "Material" : "Material"}
              </label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-bim-blue"
              >
                {materials.map((m) => (
                  <option key={m} value={m} className="bg-slate-900 text-slate-200">
                    {m === "Todos" ? (isEn ? "All materials" : "Todos los materiales") : m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>
              {isEn ? (
                <>Showing <strong className="text-white font-bold">{filteredProjects.length}</strong> of <strong className="text-slate-300">{projects.length}</strong> projects</>
              ) : (
                <>Mostrando <strong className="text-white font-bold">{filteredProjects.length}</strong> de <strong className="text-slate-300">{projects.length}</strong> proyectos</>
              )}
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-bim-blue hover:text-blue-400 font-bold transition-colors flex items-center gap-1"
              >
                <i className="fa-solid fa-rotate-left"></i> {isEn ? "Reset Filters" : "Restablecer Filtros"}
              </button>
            )}
          </div>
        </div>

        {/* Content Loading or Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 projects-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="project-card bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-6 w-16 bg-slate-800 rounded-lg"></div>
                  <div className="h-6 w-20 bg-slate-800 rounded-lg"></div>
                </div>
                <div className="h-6 w-3/4 bg-slate-800 rounded-lg mb-4"></div>
                <div className="h-16 w-full bg-slate-800 rounded-lg mb-6 flex-grow"></div>
                <div className="flex gap-2 mb-4 mt-auto border-b border-slate-700/50 pb-4">
                  <div className="h-5 w-20 bg-slate-800 rounded-lg"></div>
                  <div className="h-5 w-24 bg-slate-800 rounded-lg"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-slate-800 rounded-lg"></div>
                  <div className="h-8 w-24 bg-slate-800 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/30 border border-slate-800 border-dashed rounded-2xl">
            <div className="w-16 h-16 bg-slate-800/60 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-slate-500">
              🔍
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-grotesk">{isEn ? "No projects found" : "No se encontraron proyectos"}</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              {isEn ? "Try changing your search or resetting filters to see more results." : "Prueba cambiando la búsqueda o restableciendo los filtros para ver más resultados."}
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-bim-blue text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
            >
              {isEn ? "Reset All Filters" : "Restablecer Todos los Filtros"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 projects-grid">
            {filteredProjects.map((p) => {
              const displayStatus = isEn
                ? (p.status_en || (p.status === "Completado" ? "Completed" : "Finished"))
                : (p.status || "Terminado");
              const displayName = isEn && p.name_en ? p.name_en : p.name;
              const displayDesc = isEn && p.description_en ? p.description_en : (p.description || (isEn ? "No description available." : "Sin descripción disponible."));
              const displayType = isEn && p.project_type_en ? p.project_type_en : p.project_type;
              const displayMaterial = isEn && p.material_en ? p.material_en : p.material;
              const displayCompany = p.company || (isEn ? "Independent" : "Independiente");

              return (
                <div key={p.project_id} className="project-card bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col hover:-translate-y-2 transition-all hover:border-bim-blue group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="card-id bg-bim-blue/10 border border-bim-blue/20 text-bim-blue text-xs font-bold px-3 py-1 rounded-lg">
                        {p.project_id}
                      </span>
                      {p.featured && (
                        <span
                          className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/35 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md"
                          title={isEn ? "Active in Portfolio (/#portfolio)" : "Activo en Portfolio (/#portfolio)"}
                        >
                          <i className="fa-solid fa-star text-[9px]" />
                          Portfolio
                        </span>
                      )}
                    </div>
                    <span className={`card-status text-xs font-bold px-3 py-1 rounded-lg ${p.status === "Completado" ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" : "text-amber-400 bg-amber-400/10 border border-amber-400/20"}`}>
                      {displayStatus}
                    </span>
                  </div>
                  
                  {p.image_url && (
                    <div className="w-full h-40 mb-4 rounded-xl overflow-hidden bg-slate-800/80 border border-slate-700/60 relative">
                      <img
                        src={asset(`/${p.image_url}`)}
                        alt={displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none" />
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold font-grotesk text-white mb-2 leading-tight group-hover:text-bim-blue transition-colors">
                    {displayName}
                  </h3>
                  
                  <p className="card-description text-sm text-slate-400 mb-6 flex-grow" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {displayDesc}
                  </p>
                  
                  <div className="card-meta flex flex-wrap items-center gap-1.5 mb-4 mt-auto border-b border-slate-700/50 pb-4">
                    {displayType && displayType.split(",").map(item => item.trim()).filter(Boolean).map(item => (
                      <span key={item} className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-500/10 border border-sky-500/25 text-sky-300 text-[11px] font-semibold rounded-md">
                        <i className="fa-solid fa-layer-group text-[9px] text-sky-400"></i>
                        {item}
                      </span>
                    ))}
                    {displayMaterial && displayMaterial.split(",").map(item => item.trim()).filter(Boolean).map(item => (
                      <span key={item} className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px] font-semibold rounded-md">
                        <i className="fa-solid fa-shapes text-[9px] text-emerald-400"></i>
                        {item}
                      </span>
                    ))}
                    {p.role && p.role.split(",").map(item => item.trim()).filter(Boolean).slice(0, 2).map(item => (
                      <span key={item} className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 border border-purple-500/25 text-purple-300 text-[10px] font-medium rounded-md">
                        <i className="fa-solid fa-user-gear text-[9px] text-purple-400"></i>
                        {item}
                      </span>
                    ))}
                    <SoftwareBadge software={p.software} />
                  </div>
                  
                  <div className="flex justify-between items-center text-sm font-medium gap-2">
                    <span className="text-indigo-400 text-xs font-bold flex items-center gap-1.5 min-w-0 truncate">
                      <i className="fa-solid fa-building shrink-0"></i>{displayCompany}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Toggle Featured / Portfolio */}
                      {apiAvailable && (
                        <button
                          id={`featured-toggle-${p.project_id}`}
                          title={p.featured
                            ? (isEn ? "Remove from Portfolio" : "Quitar del Portfolio")
                            : (isEn ? "Add to Portfolio" : "Agregar al Portfolio")}
                          onClick={() => handleToggleFeatured(p.project_id, p.featured)}
                          disabled={togglingId === p.project_id}
                          className={`relative group/star flex items-center gap-1 px-2.5 py-2 rounded-lg text-[11px] font-bold border transition-all duration-200 ${
                            p.featured
                              ? "bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25 hover:border-amber-400/60"
                              : "bg-slate-800/60 border-slate-700/50 text-slate-500 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/10"
                          } ${togglingId === p.project_id ? "opacity-50 cursor-wait" : ""}`}
                          aria-label={p.featured ? "Quitar del portfolio" : "Agregar al portfolio"}
                        >
                          <i className={`fa-star text-[11px] transition-all ${
                            p.featured ? "fa-solid" : "fa-regular group-hover/star:fa-solid"
                          } ${togglingId === p.project_id ? "animate-spin" : ""}`} />
                          <span className="hidden sm:inline">
                            {p.featured
                              ? (isEn ? "Featured" : "Destacado")
                              : (isEn ? "Portfolio" : "Portfolio")}
                          </span>
                        </button>
                      )}
                      <Link to={`/project/${p.project_id}`} className="text-white hover:text-bim-blue transition-colors px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-xs font-bold">
                        {isEn ? "View Details" : "Ver Detalles"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Lead Capture & B2B Quotation Section */}
        <ToolsLeadCapture toolName={isEn ? "BIM Projects Portfolio" : "Portafolio de Proyectos BIM"} className="mt-16" />

        {/* Affiliate Recommended Partner Banner */}
        <AffiliateBanner type="konstruedu" className="mt-8" />

        {/* Modal: Crear Nuevo Proyecto BIM */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div>
                  <h2 className="text-xl font-bold font-grotesk text-white flex items-center gap-2">
                    <i className="fa-solid fa-folder-plus text-bim-blue" />
                    {isEn ? "Add New BIM Project" : "Agregar Nuevo Proyecto BIM"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isEn
                      ? "Create a new entry in SQLite and choose whether to feature it in Portfolio."
                      : "Crea una nueva ficha en SQLite y decide si se muestra en el Portafolio."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                {/* Opción Destacado / Portfolio */}
                <div
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    newProjData.featured
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                      : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600"
                  }`}
                  onClick={() => setNewProjData((d) => ({ ...d, featured: !d.featured }))}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="modal-featured-checkbox"
                      checked={newProjData.featured}
                      onChange={(e) => setNewProjData((d) => ({ ...d, featured: e.target.checked }))}
                      className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700 cursor-pointer"
                    />
                    <div>
                      <label
                        htmlFor="modal-featured-checkbox"
                        className="font-bold text-xs flex items-center gap-1.5 cursor-pointer text-white"
                      >
                        <i className={`fa-star text-xs ${newProjData.featured ? "fa-solid text-amber-400" : "fa-regular text-slate-400"}`} />
                        {isEn
                          ? "Show as Featured in Portfolio (/#portfolio)"
                          : "Mostrar como Destacado en Portafolio (/#portfolio)"}
                      </label>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {isEn
                          ? "If checked, this project will appear in the home page portfolio with its cover image."
                          : "Si está marcado, este proyecto aparecerá en la sección de proyectos destacados de la portada con su imagen de portada."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isEn ? "Project Name (ES) *" : "Nombre del Proyecto (ES) *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={newProjData.name}
                      onChange={(e) => setNewProjData((d) => ({ ...d, name: e.target.value }))}
                      placeholder="ej: Planta Concentradora Minera"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-bim-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isEn ? "English Name (EN)" : "Nombre en Inglés (EN)"}
                    </label>
                    <input
                      type="text"
                      value={newProjData.name_en}
                      onChange={(e) => setNewProjData((d) => ({ ...d, name_en: e.target.value }))}
                      placeholder="e.g.: Mining Concentrator Facility"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-bim-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isEn ? "Company / Firm" : "Empresa / Especialista"}
                    </label>
                    <input
                      type="text"
                      value={newProjData.company}
                      onChange={(e) => setNewProjData((d) => ({ ...d, company: e.target.value }))}
                      placeholder="GHD, Arcadis, AFRY..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-bim-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isEn ? "Client / Owner" : "Cliente / Mandante"}
                    </label>
                    <input
                      type="text"
                      value={newProjData.client}
                      onChange={(e) => setNewProjData((d) => ({ ...d, client: e.target.value }))}
                      placeholder="Codelco, Lundin Mining, BHP..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-bim-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MultiTagInput
                    label={isEn ? "Sector(s) / Industry" : "Sector(es) / Industria(s)"}
                    value={newProjData.project_type || ''}
                    onChange={(val) => setNewProjData((d) => ({ ...d, project_type: val }))}
                    presets={SECTOR_PRESETS}
                    placeholder={isEn ? "+ add sector (e.g. Mining)..." : "+ agregar sector (ej. Minería)..."}
                    colorTheme="blue"
                  />
                  <MultiTagInput
                    label={isEn ? "Material(s)" : "Material(es)"}
                    value={newProjData.material || ''}
                    onChange={(val) => setNewProjData((d) => ({ ...d, material: val }))}
                    presets={MATERIAL_PRESETS}
                    placeholder={isEn ? "+ add material (e.g. Structural Steel)..." : "+ agregar material (ej. Acero Estructural)..."}
                    colorTheme="emerald"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MultiTagInput
                    label={isEn ? "Role(s)" : "Rol(es)"}
                    value={newProjData.role || ''}
                    onChange={(val) => setNewProjData((d) => ({ ...d, role: val }))}
                    presets={ROLE_PRESETS}
                    placeholder={isEn ? "+ add role (e.g. BIM Modeler)..." : "+ agregar rol (ej. Modelador BIM)..."}
                    colorTheme="purple"
                  />
                  <MultiTagInput
                    label={isEn ? "BIM Software" : "Software BIM"}
                    value={newProjData.software || ''}
                    onChange={(val) => setNewProjData((d) => ({ ...d, software: val }))}
                    presets={SOFTWARE_PRESETS}
                    placeholder={isEn ? "+ add software (e.g. Revit Structure)..." : "+ agregar software (ej. Revit Structure)..."}
                    colorTheme="amber"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isEn ? "Start Year" : "Año Inicio"}
                    </label>
                    <input
                      type="number"
                      value={newProjData.year_start}
                      onChange={(e) => setNewProjData((d) => ({ ...d, year_start: parseInt(e.target.value) || 2026 }))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-bim-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isEn ? "End Year" : "Año Término"}
                    </label>
                    <input
                      type="number"
                      value={newProjData.year_end}
                      onChange={(e) => setNewProjData((d) => ({ ...d, year_end: parseInt(e.target.value) || 2026 }))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-bim-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isEn ? "Cover Image URL" : "Imagen de Portada"}
                    </label>
                    <input
                      type="text"
                      value={newProjData.image_url}
                      onChange={(e) => setNewProjData((d) => ({ ...d, image_url: e.target.value }))}
                      placeholder="assets/img/portada.webp"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-bim-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isEn ? "Project Description" : "Descripción del Proyecto"}
                  </label>
                  <textarea
                    rows="3"
                    value={newProjData.description}
                    onChange={(e) => setNewProjData((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Alcance estructural, modelado BIM y especificaciones..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-bim-blue resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    {isEn ? "Cancel" : "Cancelar"}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin" />
                        {isEn ? "Saving..." : "Guardando..."}
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-check" />
                        {isEn ? "Save Project" : "Guardar Proyecto"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
