import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import projectsData from "../data/proyectos.json";

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
        (p.company?.toLowerCase() || "").includes(searchLower) ||
        (p.client?.toLowerCase() || "").includes(searchLower) ||
        (p.project_id?.toLowerCase() || "").includes(searchLower) ||
        (p.description?.toLowerCase() || "").includes(searchLower);

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
      <div className="bg-mesh" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />
      
      <main className="container pt-32 pb-20 relative z-10">
        {/* Top Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700/50 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm group"
          >
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Volver al Inicio
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold font-grotesk tracking-tight gradient-text mb-4">Base de Datos de Proyectos BIM</h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">Explora el portafolio estructural detallado con más de 40 proyectos ejecutados a nivel internacional.</p>
        </div>

        {/* Filter Panel */}
        <div className="filters-bar mb-8 p-6 bg-slate-900/70 border border-slate-700/60 rounded-2xl backdrop-blur-md shadow-xl">
          {/* Main Search Input */}
          <div className="relative mb-6">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input 
              type="text" 
              placeholder="Buscar por nombre de proyecto, cliente, ID o palabra clave..." 
              className="w-full bg-slate-800/70 border border-slate-700 text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-bim-blue focus:ring-1 focus:ring-bim-blue transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch("")} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕ Limpiar
              </button>
            )}
          </div>

          {/* Type/Category Pills */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Tipo de Proyecto:
            </label>
            <div className="flex flex-wrap gap-2">
              {projectTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedType === type
                      ? "bg-bim-blue text-white border-bim-blue shadow-md shadow-blue-500/20"
                      : "bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-700/60 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            {/* Company Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-building text-indigo-400 text-xs"></i> Empresa / Especialista
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-bim-blue"
              >
                {companies.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-slate-200">
                    {c === "Todas" ? "Todas las empresas" : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Software Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-laptop-code text-cyan-400 text-xs"></i> Software BIM
              </label>
              <select
                value={selectedSoftware}
                onChange={(e) => setSelectedSoftware(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-bim-blue"
              >
                {softwares.map((s) => (
                  <option key={s} value={s} className="bg-slate-900 text-slate-200">
                    {s === "Todos" ? "Todos los softwares" : s}
                  </option>
                ))}
              </select>
            </div>

            {/* Material Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-cubes text-emerald-400 text-xs"></i> Material
              </label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-bim-blue"
              >
                {materials.map((m) => (
                  <option key={m} value={m} className="bg-slate-900 text-slate-200">
                    {m === "Todos" ? "Todos los materiales" : m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>
              Mostrando <strong className="text-white font-bold">{filteredProjects.length}</strong> de <strong className="text-slate-300">{projects.length}</strong> proyectos
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-bim-blue hover:text-blue-400 font-bold transition-colors flex items-center gap-1"
              >
                <i className="fa-solid fa-rotate-left"></i> Restablecer Filtros
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
            <h3 className="text-xl font-bold text-white mb-2 font-grotesk">No se encontraron proyectos</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              Prueba cambiando la búsqueda o restableciendo los filtros para ver más resultados.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-bim-blue text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
            >
              Restablecer Todos los Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 projects-grid">
            {filteredProjects.map((p) => (
              <div key={p.project_id} className="project-card bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col hover:-translate-y-2 transition-all hover:border-bim-blue group">
                <div className="flex justify-between items-start mb-4">
                  <span className="card-id bg-bim-blue/10 border border-bim-blue/20 text-bim-blue text-xs font-bold px-3 py-1 rounded-lg">
                    {p.project_id}
                  </span>
                  <span className={`card-status text-xs font-bold px-3 py-1 rounded-lg ${p.status === "Completado" ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" : "text-amber-400 bg-amber-400/10 border border-amber-400/20"}`}>
                    {p.status || "Terminado"}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold font-grotesk text-white mb-2 leading-tight group-hover:text-bim-blue transition-colors">
                  {p.name}
                </h3>
                
                <p className="card-description text-sm text-slate-400 mb-6 flex-grow" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.description || "Sin descripción disponible."}
                </p>
                
                <div className="card-meta flex flex-wrap items-center gap-2 mb-4 mt-auto border-b border-slate-700/50 pb-4">
                  {p.project_type && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 border border-slate-700/80 text-slate-300 text-[11px] font-semibold rounded-md">
                      <i className="fa-solid fa-layer-group text-[10px] text-slate-400"></i>
                      {p.project_type}
                    </span>
                  )}
                  {p.material && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 border border-slate-700/80 text-slate-300 text-[11px] font-semibold rounded-md">
                      <i className="fa-solid fa-shapes text-[10px] text-slate-400"></i>
                      {p.material}
                    </span>
                  )}
                  <SoftwareBadge software={p.software} />
                </div>
                
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-indigo-400 text-xs font-bold flex items-center gap-1.5">
                    <i className="fa-solid fa-building"></i>{p.company || "Independiente"}
                  </span>
                  <Link to={`/project/${p.project_id}`} className="text-white hover:text-bim-blue transition-colors px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-xs font-bold">
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
