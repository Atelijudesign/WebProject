import { asset } from "../utils/asset";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { ProjectsDashboard } from "../components/ProjectsDashboard";
import { AffiliateBanner } from "../components/AffiliateBanner";
import { ToolsLeadCapture } from "../components/ToolsLeadCapture";
import projectsData from "../data/proyectos.json";
import { useTranslation } from "../context/LanguageContext";

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

  const softLower = software.toLowerCase();
  let icon = "fa-laptop-code";
  let styleClass = "from-cyan-500/20 via-sky-500/20 to-blue-600/20 border-cyan-400/50 text-cyan-300 shadow-cyan-500/10";
  let badgeLabel = software;

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
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold bg-gradient-to-r border backdrop-blur-md shadow-md transition-all group-hover:scale-105 ${styleClass}`}>
      <i className={`fa-solid ${icon} text-[11px]`}></i>
      <span>{badgeLabel}</span>
    </span>
  );
}

export default function ProjectsCatalog() {
  const { t, language } = useTranslation();
  const isEn = language === "en";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedCompany, setSelectedCompany] = useState("Todas");
  const [selectedSoftware, setSelectedSoftware] = useState("Todos");
  const [selectedMaterial, setSelectedMaterial] = useState("Todos");

  useEffect(() => {
    async function loadProjects() {
      try {
        let data = null;
        if (window.location.hostname === 'localhost') {
          try {
            const res = await fetch('http://localhost:3001/api/projects');
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

        // Sort by project_id desc
        const sortedData = [...data].sort((a, b) => b.project_id.localeCompare(a.project_id));
        setProjects(sortedData);
      } catch (e) {
        console.error(e);
        setProjects(projectsData.value || []);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  // Dynamic filter options extracted from dataset
  const projectTypes = useMemo(() => {
    const set = new Set(projects.map(p => p.project_type).filter(Boolean));
    return ["Todos", ...Array.from(set).sort()];
  }, [projects]);

  const companies = useMemo(() => {
    const set = new Set(projects.map(p => p.company).filter(Boolean));
    return ["Todas", ...Array.from(set).sort()];
  }, [projects]);

  const softwares = useMemo(() => {
    const set = new Set(projects.map(p => p.software).filter(Boolean));
    return ["Todos", ...Array.from(set).sort()];
  }, [projects]);

  const materials = useMemo(() => {
    const set = new Set(projects.map(p => p.material).filter(Boolean));
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

      const matchesType = selectedType === "Todos" || p.project_type === selectedType;
      const matchesCompany = selectedCompany === "Todas" || p.company === selectedCompany;
      const matchesSoftware = selectedSoftware === "Todos" || p.software === selectedSoftware;
      const matchesMaterial = selectedMaterial === "Todos" || p.material === selectedMaterial;

      return matchesSearch && matchesType && matchesCompany && matchesSoftware && matchesMaterial;
    });
  }, [projects, search, selectedType, selectedCompany, selectedSoftware, selectedMaterial]);

  const hasActiveFilters = search || selectedType !== "Todos" || selectedCompany !== "Todas" || selectedSoftware !== "Todos" || selectedMaterial !== "Todos";

  const resetFilters = () => {
    setSearch("");
    setSelectedType("Todos");
    setSelectedCompany("Todas");
    setSelectedSoftware("Todos");
    setSelectedMaterial("Todos");
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
          "url": "https://atelijudesign.com/proyectos-bim",
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
            {t("catalog_title") || (isEn ? "BIM Projects Database" : "Base de Datos de Proyectos BIM")}
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            {t("catalog_subtitle") || (isEn ? "Explore the detailed structural portfolio featuring 40+ internationally executed projects." : "Explora el portafolio estructural detallado con más de 40 proyectos ejecutados a nivel internacional.")}
          </p>
        </div>

        {/* Analytics & Metrics Dashboard */}
        {!loading && projects.length > 0 && (
          <ProjectsDashboard
            projects={projects}
            selectedType={selectedType}
            selectedSoftware={selectedSoftware}
            selectedMaterial={selectedMaterial}
            onSelectType={(type) => setSelectedType(type)}
            onSelectSoftware={(soft) => setSelectedSoftware(soft)}
            onSelectMaterial={(mat) => setSelectedMaterial(mat)}
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
              placeholder={t("catalog_search_placeholder") || (isEn ? "Search by project name, client, ID or keyword..." : "Buscar por nombre de proyecto, cliente, ID o palabra clave...")} 
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
              {t("catalog_filter_type") || (isEn ? "Project Type:" : "Tipo de Proyecto:")}
            </label>
            <div className="flex flex-wrap gap-2">
              {projectTypes.map((type) => {
                const displayTypeLabel = isEn && TYPE_TRANSLATIONS[type] ? TYPE_TRANSLATIONS[type] : type;

                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      selectedType === type
                        ? "bg-bim-blue text-white border-bim-blue shadow-md shadow-blue-500/20"
                        : "bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-700/60 hover:text-white"
                    }`}
                  >
                    {displayTypeLabel}
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
                    <span className="card-id bg-bim-blue/10 border border-bim-blue/20 text-bim-blue text-xs font-bold px-3 py-1 rounded-lg">
                      {p.project_id}
                    </span>
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
                  
                  <div className="card-meta flex flex-wrap items-center gap-2 mb-4 mt-auto border-b border-slate-700/50 pb-4">
                    {displayType && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 border border-slate-700/80 text-slate-300 text-[11px] font-semibold rounded-md">
                        <i className="fa-solid fa-layer-group text-[10px] text-slate-400"></i>
                        {displayType}
                      </span>
                    )}
                    {displayMaterial && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 border border-slate-700/80 text-slate-300 text-[11px] font-semibold rounded-md">
                        <i className="fa-solid fa-shapes text-[10px] text-slate-400"></i>
                        {displayMaterial}
                      </span>
                    )}
                    <SoftwareBadge software={p.software} />
                  </div>
                  
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-indigo-400 text-xs font-bold flex items-center gap-1.5">
                      <i className="fa-solid fa-building"></i>{displayCompany}
                    </span>
                    <Link to={`/project/${p.project_id}`} className="text-white hover:text-bim-blue transition-colors px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-xs font-bold">
                      {isEn ? "View Details" : "Ver Detalles"}
                    </Link>
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
      </main>
    </div>
  );
}
