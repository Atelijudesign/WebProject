import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../context/LanguageContext";
import { asset } from "../utils/asset";

const COMMAND_ITEMS = [
  // ─── HERRAMIENTAS TÉCNICAS ───
  {
    id: "tool-icha",
    title: "Catálogo de Perfiles ICHA",
    title_en: "Digital ICHA Profiles Catalog",
    desc: "Calculadora de perfiles de acero chilenos y cubicación",
    desc_en: "Chilean steel profiles calculator and material takeoff",
    category: "Herramientas Técnicas",
    category_en: "Technical Tools",
    icon: "fa-solid fa-cube",
    color: "text-cyan-400",
    path: "/herramientas/icha",
  },
  {
    id: "tool-aisc",
    title: "Catálogo AISC v15.0 Online",
    title_en: "AISC v15.0 Online Catalog",
    desc: "Base de datos con 2,130+ perfiles estructurales de acero",
    desc_en: "Database with 2,130+ structural steel shapes",
    category: "Herramientas Técnicas",
    category_en: "Technical Tools",
    icon: "fa-solid fa-database",
    color: "text-amber-400",
    path: "/herramientas/aisc",
  },
  {
    id: "tool-stairs",
    title: "Calculadora de Escaleras Metálicas",
    title_en: "Steel Staircase Calculator",
    desc: "Diseño paramétrico según Ley de Blondel y Canal C250",
    desc_en: "Parametric design using Blondel's rule and C250 channel",
    category: "Herramientas Técnicas",
    category_en: "Technical Tools",
    icon: "fa-solid fa-stairs",
    color: "text-emerald-400",
    path: "/herramientas/escaleras",
  },
  {
    id: "tool-profiles",
    title: "Calculador de Propiedades Geométricas",
    title_en: "Geometric Properties Calculator",
    desc: "Inercias, áreas y módulos elásticos de secciones",
    desc_en: "Inertias, areas, and elastic section moduli",
    category: "Herramientas Técnicas",
    category_en: "Technical Tools",
    icon: "fa-solid fa-calculator",
    color: "text-blue-400",
    path: "/herramientas/perfiles",
  },
  {
    id: "tool-buckling",
    title: "Acortadores de Pandeo Estructural",
    title_en: "Structural Buckling Shorteners",
    desc: "Longitudes efectivas kL/r según AISC 360-16",
    desc_en: "Effective lengths kL/r compliant with AISC 360-16",
    category: "Herramientas Técnicas",
    category_en: "Technical Tools",
    icon: "fa-solid fa-arrows-split-up-and-left",
    color: "text-rose-400",
    path: "/herramientas/acortadores",
  },
  {
    id: "tool-ifc-viewer",
    title: "Visor IFC Estructural 3D",
    title_en: "Structural 3D IFC Viewer",
    desc: "Visor BIM 3D interactivo, inspección de Psets, cortes y mediciones",
    desc_en: "Interactive 3D BIM viewer, Psets inspection, sections and measurements",
    category: "Herramientas Técnicas",
    category_en: "Technical Tools",
    icon: "fa-solid fa-cube",
    color: "text-blue-400",
    path: "/herramientas/visor-ifc",
  },
  {
    id: "tool-export",
    title: "Visor & Exportador IFC / WebBIM",
    title_en: "IFC / WebBIM Viewer & Exporter",
    desc: "Conversión de modelos BIM a formatos abiertos",
    desc_en: "Conversion of BIM models into open standards",
    category: "Herramientas Técnicas",
    category_en: "Technical Tools",
    icon: "fa-solid fa-file-export",
    color: "text-purple-400",
    path: "/export",
  },
  {
    id: "tool-converter",
    title: "Convertidor de Unidades de Ingeniería & CAD",
    title_en: "Engineering & CAD Unit Converter",
    desc: "Pies/pulgadas fraccionales a mm, unidades de ingeniería y escalas CAD",
    desc_en: "Fractional feet/inches to mm, engineering units and CAD scales",
    category: "Herramientas Técnicas",
    category_en: "Technical Tools",
    icon: "fa-solid fa-ruler-combined",
    color: "text-amber-400",
    path: "/herramientas/convertidor",
  },
  {
    id: "tool-geocalc",
    title: "Calculadora de Geometría & Trigonometría",
    title_en: "Geometry & Trigonometry Calculator",
    desc: "Triángulos rectángulos y oblicuángulos, áreas, funciones y ecuaciones",
    desc_en: "Right and oblique triangles, areas, trig functions and equations",
    category: "Herramientas Técnicas",
    category_en: "Technical Tools",
    icon: "fa-solid fa-square-root-variable",
    color: "text-emerald-400",
    path: "/herramientas/geometria",
  },
  {
    id: "tool-cv-ats",
    title: "CV Builder Pro ATS",
    title_en: "ATS Resume Builder Pro",
    desc: "Creador de currículums técnicos sin fotos optimizado para ATS",
    desc_en: "Technical ATS-friendly resume builder without photos",
    category: "Herramientas Técnicas",
    category_en: "Technical Tools",
    icon: "fa-solid fa-file-lines",
    color: "text-cyan-400",
    path: "/herramientas/cv-ats",
  },

  // ─── PROYECTOS EMBLEMÁTICOS ───
  {
    id: "proj-all",
    title: "Catálogo Completo de Proyectos",
    title_en: "Complete Projects Catalog",
    desc: "Minería masiva, salud, aeropuertos e infraestructura",
    desc_en: "Heavy mining, healthcare, airports, and infrastructure",
    category: "Proyectos Estructurales",
    category_en: "Structural Projects",
    icon: "fa-solid fa-folder-open",
    color: "text-cyan-400",
    path: "/proyectos-bim",
  },
  {
    id: "proj-mine",
    title: "Nave de Molienda Minera",
    title_en: "Mining Grinding Facility",
    desc: "4.500 ton de acero estructurado en Revit + Tekla",
    desc_en: "4,500 tons of structured steel in Revit + Tekla",
    category: "Proyectos Estructurales",
    category_en: "Structural Projects",
    icon: "fa-solid fa-industry",
    color: "text-yellow-400",
    path: "/proyectos-bim",
  },
  {
    id: "proj-airport",
    title: "Aeropuerto Internacional AMB",
    title_en: "AMB Santiago International Airport",
    desc: "Coordinación BIM multidisciplinaria e interoperabilidad IFC",
    desc_en: "Multidisciplinary BIM coordination & IFC interoperability",
    category: "Proyectos Estructurales",
    category_en: "Structural Projects",
    icon: "fa-solid fa-plane-departure",
    color: "text-sky-400",
    path: "/proyectos-bim",
  },

  // ─── ARTÍCULOS & BLOG TÉCNICO ───
  {
    id: "blog-all",
    title: "Blog de Ingeniería & Automatización BIM",
    title_en: "BIM Engineering & Automation Blog",
    desc: "Artículos sobre Python, pyRevit, C# y Revit API",
    desc_en: "Articles on Python, pyRevit, C#, and Revit API",
    category: "Blog & Recursos",
    category_en: "Blog & Resources",
    icon: "fa-solid fa-newspaper",
    color: "text-cyan-400",
    path: "/blog",
  },
  {
    id: "blog-iso19650",
    title: "Validación Automatizada ISO 19650",
    title_en: "Automated ISO 19650 Validation",
    desc: "Control de calidad en tiempo real con Python e IFC",
    desc_en: "Real-time quality control with Python and IFC",
    category: "Blog & Recursos",
    category_en: "Blog & Resources",
    icon: "fa-solid fa-shield-halved",
    color: "text-emerald-400",
    path: "/blog/validacion-automatizada-iso-19650-tiempo-real",
  },
  {
    id: "blog-pyrevit-accel",
    title: "PyRevit Accelerator: De Cero a Add-ins",
    title_en: "PyRevit Accelerator: From Zero to Add-ins",
    desc: "Guía completa para desarrollar herramientas nativas en Revit",
    desc_en: "Complete guide to developing native tools in Revit",
    category: "Blog & Recursos",
    category_en: "Blog & Resources",
    icon: "fa-brands fa-python",
    color: "text-yellow-400",
    path: "/blog/pyrevit-accelerator",
  },
  {
    id: "blog-net8",
    title: "Revit 2025 API & .NET 8 SDK",
    title_en: "Revit 2025 API & .NET 8 SDK",
    desc: "Migración de plugins C# al nuevo runtime de alto rendimiento",
    desc_en: "Migrating C# plugins to the new high-performance runtime",
    category: "Blog & Recursos",
    category_en: "Blog & Resources",
    icon: "fa-solid fa-code",
    color: "text-purple-400",
    path: "/blog/revit-2025-api-net8",
  },
  {
    id: "blog-clash-ai",
    title: "IA Clash Triage en Modelos BIM",
    title_en: "AI Clash Triage in BIM Models",
    desc: "Clasificación inteligente de interferencias con modelos LLM",
    desc_en: "Intelligent clash classification using LLM models",
    category: "Blog & Recursos",
    category_en: "Blog & Resources",
    icon: "fa-solid fa-robot",
    color: "text-rose-400",
    path: "/blog/ia-clash-triage-clasificacion-interferencias-bim",
  },

  // ─── ACCIONES RÁPIDAS ───
  {
    id: "act-contact",
    title: "Hablemos de tu Proyecto (Contacto)",
    title_en: "Let's Discuss Your Project (Contact)",
    desc: "Ir directo al formulario de contacto y propuestas",
    desc_en: "Jump directly to the contact and proposal form",
    category: "Acciones Rápidas",
    category_en: "Quick Actions",
    icon: "fa-solid fa-envelope",
    color: "text-emerald-400",
    action: "contact",
  },
  {
    id: "act-cv",
    title: "Descargar Currículum Vitae (CV PDF)",
    title_en: "Download Resume / Curriculum Vitae (PDF)",
    desc: "Trayectoria de 15+ años y stack técnico",
    desc_en: "15+ years background and technical stack",
    category: "Acciones Rápidas",
    category_en: "Quick Actions",
    icon: "fa-solid fa-file-pdf",
    color: "text-cyan-400",
    action: "download-cv",
  },
  {
    id: "act-portfolio",
    title: "Descargar Portafolio de Obras (PDF)",
    title_en: "Download Works Portfolio (PDF)",
    desc: "Fichas técnicas y planos de proyectos realizados",
    desc_en: "Technical sheets and engineering drawings of past works",
    category: "Acciones Rápidas",
    category_en: "Quick Actions",
    icon: "fa-solid fa-file-arrow-down",
    color: "text-amber-400",
    action: "download-portfolio",
  },
];

export const CommandPalette = () => {
  const { language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Escuchar atajo global Ctrl+K / Cmd+K y evento personalizado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen]);

  // Reset y autofocus al abrir
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const isEn = language === "en";

  // Filtrado de elementos por búsqueda
  const filteredItems = useMemo(() => {
    const items = COMMAND_ITEMS.map((item) => ({
      ...item,
      displayTitle: isEn && item.title_en ? item.title_en : item.title,
      displayDesc: isEn && item.desc_en ? item.desc_en : item.desc,
      displayCategory: isEn && item.category_en ? item.category_en : item.category,
    }));

    if (!query.trim()) return items;
    const lower = query.toLowerCase();
    return items.filter(
      (item) =>
        item.displayTitle.toLowerCase().includes(lower) ||
        item.displayDesc.toLowerCase().includes(lower) ||
        item.displayCategory.toLowerCase().includes(lower) ||
        item.title.toLowerCase().includes(lower) ||
        item.desc.toLowerCase().includes(lower)
    );
  }, [query, isEn]);

  // Ajustar índice seleccionado cuando cambia el filtro
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  const handleSelect = (item) => {
    setIsOpen(false);
    if (!item) return;

    if (item.path) {
      navigate(item.path);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (item.action === "contact") {
      const contactEl = document.getElementById("contact");
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/#contact");
      }
      return;
    }

    if (item.action === "download-cv") {
      const link = document.createElement("a");
      link.href = asset("/Andres_Gallo_CV.pdf");
      link.download = "Andres_Gallo_CV.pdf";
      link.click();
      return;
    }

    if (item.action === "download-portfolio") {
      const link = document.createElement("a");
      link.href = asset("/Andres_Gallo_Portfolio.pdf");
      link.download = "Andres_Gallo_Portfolio.pdf";
      link.click();
      return;
    }
  };

  const handleKeyNavigation = (e) => {
    if (filteredItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop con Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Raycast Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl overflow-hidden font-mono z-10"
          >
            {/* Input de Búsqueda */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-950/60">
              <i className="fa-solid fa-magnifying-glass text-cyan-400 text-base" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyNavigation}
                placeholder={language === "en" ? "Search tools, projects, articles or commands..." : "Buscar herramientas, proyectos, artículos o comandos..."}
                className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm font-sans"
              />
              <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px] text-slate-400">
                ESC
              </span>
            </div>

            {/* Listado de Resultados */}
            <div
              ref={listRef}
              className="max-h-[380px] overflow-y-auto p-3 space-y-1 no-scrollbar"
            >
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <i className="fa-solid fa-circle-nodes text-3xl text-slate-600 mb-2 block" />
                  <p className="text-xs">
                    {language === "en" ? `No results found for "${query}"` : `No se encontraron resultados para "${query}"`}
                  </p>
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all ${
                        isSelected
                          ? "bg-cyan-950/70 border border-cyan-500/40 text-white shadow-lg"
                          : "hover:bg-slate-800/50 text-slate-300 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sm shrink-0 ${item.color}`}
                        >
                          <i className={item.icon} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate font-sans">
                            {item.displayTitle}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {item.displayDesc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-400 hidden sm:inline">
                          {item.displayCategory}
                        </span>
                        {isSelected && (
                          <span className="text-cyan-400 text-xs">
                            <i className="fa-solid fa-arrow-right" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer de Comandos */}
            <div className="px-5 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">↑↓</kbd> {language === "en" ? "Navigate" : "Navegar"}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">↵</kbd> {language === "en" ? "Select" : "Seleccionar"}
                </span>
              </div>
              <span className="text-cyan-400 font-bold hidden sm:inline">
                Andrés Gallo Parra · Command Hub
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
