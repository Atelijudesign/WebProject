import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import projectsData from "../data/proyectos.json";
import { portfolioProjects } from "../constants";
import featuredDetails from "../data/featured_details.json";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  useEffect(() => {
    async function loadProject() {
      try {
        let matchedProject = null;

        // 1. Check if ID matches a static slug in featuredDetails
        const featuredData = featuredDetails[id];
        if (featuredData) {
          const staticMatch = portfolioProjects.find(p => p.link && p.link.endsWith(`/${id}`)) || {};
          matchedProject = {
            project_id: id,
            name: staticMatch.title || featuredData.slug.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()),
            project_type: staticMatch.category || (featuredData.specs.find(s => s.label === 'Categoría') || {}).value || "Proyecto Estructural",
            description: staticMatch.description || featuredData.description_paragraphs[0] || "",
            description_paragraphs: featuredData.description_paragraphs,
            gallery_images: featuredData.gallery_images,
            specs: featuredData.specs,
            technologies: featuredData.technologies,
            image_url: staticMatch.image || (featuredData.gallery_images && featuredData.gallery_images[0])
          };
        }

        // 2. If not a static project, check the database (JSON/API)
        if (!matchedProject) {
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

          // Search by project_id (e.g. P-044) or by UUID id
          matchedProject = data.find(p => p.project_id === id || p.id === id);
        }

        setProject(matchedProject);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

  useEffect(() => {
    if (activeImageIndex === null || !project || !project.gallery_images) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) =>
          prev === 0 ? project.gallery_images.length - 1 : prev - 1
        );
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) =>
          prev === project.gallery_images.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "Escape") {
        setActiveImageIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeImageIndex, project]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    if (!project || !project.gallery_images) return;
    setActiveImageIndex((prev) =>
      prev === 0 ? project.gallery_images.length - 1 : prev - 1
    );
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    if (!project || !project.gallery_images) return;
    setActiveImageIndex((prev) =>
      prev === project.gallery_images.length - 1 ? 0 : prev + 1
    );
  };

  const handleClose = (e) => {
    if (e) e.stopPropagation();
    setActiveImageIndex(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Cargando datos del proyecto...</div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Proyecto no encontrado.</div>;

  return (
    <div className="bg-bim-dark min-h-screen text-slate-100">
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#080c14]">
          {project.image_url && (
            <img 
              src={`/${project.image_url}`} 
              alt={project.name} 
              className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-[1px]" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bim-dark shadow-inner"></div>
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
            <h2 className="text-3xl font-bold text-white mb-6 font-grotesk">
              {project.description_paragraphs ? "Descripción del Proyecto" : "Detalles de Ingeniería"}
            </h2>
            
            {project.description_paragraphs ? (
              <div className="prose prose-lg text-slate-300 space-y-6 mb-12">
                {project.description_paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            ) : (
              <div className="prose prose-lg text-slate-300 mb-12">
                <p>Actividades ejecutadas: {project.activities || "Detalles no disponibles."}</p>
              </div>
            )}

            {/* Gallery Section */}
            {project.gallery_images && project.gallery_images.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-white mb-6 font-grotesk">
                  Galería de Imágenes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {project.gallery_images.map((img, idx) => (
                    <div key={idx} className="glass-card rounded-xl overflow-hidden h-48 group border border-slate-700/30 relative">
                      <img
                        src={`/${img}`}
                        alt={`Imagen ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                        loading="lazy"
                        decoding="async"
                        onClick={() => setActiveImageIndex(idx)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-12">
              <Link to="/#portfolio" className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-bold group">
                <i className="fa-solid fa-arrow-left mr-3 group-hover:-translate-x-1 transition-transform"></i>
                Volver a Proyectos Destacados
              </Link>
            </div>
          </div>

          {/* Sidebar Tech Specs */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl p-8 sticky top-24 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-8 font-grotesk flex items-center gap-3">
                <i className="fa-solid fa-clipboard-list text-bim-blue"></i>
                Ficha Técnica
              </h3>
              
              {project.specs ? (
                <div className="space-y-6">
                  {project.specs.map((spec, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="bg-slate-800 p-3 rounded-lg text-bim-blue">
                        <i className={spec.icon}></i>
                      </div>
                      <div>
                        <span className="block text-xs uppercase text-slate-400 font-bold mb-1">{spec.label}</span>
                        <span className="text-white font-medium">{spec.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
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
              )}
              
              {project.technologies ? (
                <>
                  <div className="my-8 border-t border-slate-700/50"></div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-grotesk">
                    Tecnologías Utilizadas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 bg-bim-blue/10 text-bim-blue text-xs rounded-lg font-semibold border border-bim-blue/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeImageIndex !== null && project && project.gallery_images && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[1000] flex flex-col items-center justify-center animate-fade-in"
          onClick={handleClose}
        >
          {/* Close button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl focus:outline-none transition-colors duration-200 z-[1010] cursor-pointer bg-transparent border-0"
            onClick={handleClose}
            aria-label="Cerrar modal"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          {/* Left Navigation */}
          <button 
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl p-4 focus:outline-none transition-colors duration-200 z-[1010] cursor-pointer bg-transparent border-0"
            onClick={handlePrev}
            aria-label="Imagen anterior"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          {/* Centered Image Container */}
          <div 
            className="max-w-4xl max-h-[80vh] w-full flex items-center justify-center p-4 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              key={activeImageIndex}
              src={`/${project.gallery_images[activeImageIndex]}`} 
              alt={`Imagen de galería ${activeImageIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl transition-all duration-300 animate-zoom-in"
            />
          </div>

          {/* Right Navigation */}
          <button 
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl p-4 focus:outline-none transition-colors duration-200 z-[1010] cursor-pointer bg-transparent border-0"
            onClick={handleNext}
            aria-label="Siguiente imagen"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>

          {/* Page indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-semibold tracking-wider bg-slate-900/60 py-1.5 px-4 rounded-full border border-slate-700/50 backdrop-blur-sm text-sm">
            {activeImageIndex + 1} / {project.gallery_images.length}
          </div>
        </div>
      )}
    </div>
  );
}

