import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProjectsCatalog() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const SUPABASE_URL = "https://lhorekdbwnrrjtgzipgs.supabase.co";
  const SUPABASE_KEY = "sb_publishable_kfHl7UUtWD4REHOuiWdpqA_wdHWdl62";

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/proyectos?select=*&order=project_id.desc`, {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`
          }
        });
        
        if (!res.ok) throw new Error("Supabase Fetch Failed");
        const data = await res.json();
        setProjects(data);
      } catch (e) {
        console.error(e);
        // Fallback data if Supabase fails
        setProjects([
          { project_id: "P-046", name: "Proyecto Atrio Sur", company: "BIOS MI", project_type: "Edificación / Comercial", material: "Acero Estructural", status: "Completado", description: "Fabricación de estructuras metálicas para Atrio Sur." },
          { project_id: "P-045", name: "Proyecto Desaladora Santo Domingo", company: "BIOS MI", project_type: "Industrial", material: "Acero + Hormigón", status: "En Curso", description: "Ingeniería de detalles estanques GRP planta desaladora." }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    (p.name?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (p.company?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <div className="projects-bim-page min-h-screen">
      <div className="bg-mesh" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />
      
      <main className="container pt-32 pb-20 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold font-grotesk tracking-tight gradient-text mb-6">Base de Datos de Proyectos BIM</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Explora el portafolio estructural detallado con más de 40 proyectos ejecutados a nivel internacional.</p>
        </div>

        <div className="filters-bar mb-8 p-6 bg-slate-900/60 border border-slate-700/50 rounded-2xl backdrop-blur-md">
          <input 
            type="text" 
            placeholder="Buscar proyectos por nombre o empresa..." 
            className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-bim-blue"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 projects-grid">
            {filteredProjects.map((p) => (
              <div key={p.project_id} className="project-card bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col hover:-translate-y-2 transition-all hover:border-bim-blue">
                <div className="flex justify-between items-start mb-4">
                  <span className="card-id bg-bim-blue/10 border border-bim-blue/20 text-bim-blue text-xs font-bold px-3 py-1 rounded-lg">
                    {p.project_id}
                  </span>
                  <span className={`card-status text-xs font-bold px-3 py-1 rounded-lg ${p.status === "Completado" ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" : "text-amber-400 bg-amber-400/10 border border-amber-400/20"}`}>
                    {p.status || "Terminado"}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold font-grotesk text-white mb-2 leading-tight">
                  {p.name}
                </h3>
                
                <p className="card-description text-sm text-slate-400 mb-6 flex-grow" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.description || "Sin descripción disponible."}
                </p>
                
                <div className="card-meta flex flex-wrap gap-2 mb-4 mt-auto border-b border-slate-700/50 pb-4">
                  {p.project_type && <span className="meta-tag">{p.project_type}</span>}
                  {p.material && <span className="meta-tag">{p.material}</span>}
                </div>
                
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-indigo-400"><i className="fa-solid fa-building mr-2"></i>{p.company || "Independiente"}</span>
                  <Link to={`/project/${p.project_id}`} className="text-white hover:text-bim-blue transition-colors px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700">Ver Detalles</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
