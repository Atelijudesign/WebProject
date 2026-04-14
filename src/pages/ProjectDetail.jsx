import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const SUPABASE_URL = "https://lhorekdbwnrrjtgzipgs.supabase.co";
  const SUPABASE_KEY = "sb_publishable_kfHl7UUtWD4REHOuiWdpqA_wdHWdl62";

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/proyectos?project_id=eq.${id}&select=*`, {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`
          }
        });
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        if (data.length > 0) setProject(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Cargando datos del proyecto...</div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Proyecto no encontrado.</div>;

  return (
    <div className="bg-gray-50 dark:bg-bim-dark min-h-screen transition-colors duration-300">
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900 shadow-inner"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
          <span className="inline-block py-1 px-4 rounded-full bg-bim-blue/20 border border-bim-blue text-bim-blue text-sm font-bold mb-6 tracking-wider uppercase">
            {project.project_type || "Proyecto Estructural"}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight font-grotesk">
            {project.name}
          </h1>
          <p className="text-xl text-gray-300 font-light max-w-3xl mx-auto">
            {project.description}
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 font-grotesk">
              Detalles de Ingeniería
            </h2>
            <div className="prose prose-lg text-gray-600 dark:text-gray-400 mb-12">
              <p>Actividades ejecutadas: {project.activities || "Detalles no disponibles."}</p>
            </div>
            
            <Link to="/proyectos-bim" className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-bold group">
              <i className="fa-solid fa-arrow-left mr-3 group-hover:-translate-x-1 transition-transform"></i>
              Volver al Catálogo
            </Link>
          </div>

          {/* Sidebar Tech Specs */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl p-8 sticky top-24 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-8 font-grotesk flex items-center gap-3">
                <i className="fa-solid fa-clipboard-list text-bim-blue"></i>
                Ficha Técnica
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-800 p-3 rounded-lg text-bim-blue"><i className="fa-solid fa-building"></i></div>
                  <div>
                    <span className="block text-xs uppercase text-slate-400 font-bold mb-1">Cliente / Empresa</span>
                    <span className="text-white font-medium">{project.company} {project.client ? `(${project.client})` : ""}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-slate-800 p-3 rounded-lg text-bim-blue"><i className="fa-solid fa-calendar-days"></i></div>
                  <div>
                    <span className="block text-xs uppercase text-slate-400 font-bold mb-1">Periodo</span>
                    <span className="text-white font-medium">{project.period}</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-slate-800 p-3 rounded-lg text-bim-blue"><i className="fa-solid fa-location-dot"></i></div>
                  <div>
                    <span className="block text-xs uppercase text-slate-400 font-bold mb-1">Ubicación</span>
                    <span className="text-white font-medium">{project.city}, {project.country}</span>
                  </div>
                </div>
              </div>
              
              <div className="my-8 border-t border-slate-700/50"></div>

              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-grotesk">
                Materialidad
              </h4>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 bg-bim-blue/10 text-bim-blue text-xs rounded-lg font-semibold border border-bim-blue/20">
                  {project.material}
                </span>
                {project.steel_weight && <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded-lg font-semibold border border-indigo-500/20">{project.steel_weight} TON Acero</span>}
                {project.concrete_volume && <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-lg font-semibold border border-amber-500/20">{project.concrete_volume} m³ Hormigón</span>}
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
