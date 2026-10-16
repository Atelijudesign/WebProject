import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { asset } from "../utils/asset";
import { useTranslation } from "../context/LanguageContext";
import { RollingTextButton } from "./ui/RollingTextButton";

const LANDMARK_PROJECTS = [
  {
    id: "P-052",
    slug: "12593017-garden-city-skyway",
    name: "Garden City Skyway (Twin Bridge)",
    name_en: "Garden City Skyway (Twin Bridge)",
    client: "MTO / GHD",
    country: "Canadá",
    flag: "ca",
    category: "Infraestructura Vial",
    category_en: "Infrastructure / Bridge",
    metric: "8,500 ton",
    metricLabel: "Acero Estructural",
    metricLabel_en: "Structural Steel",
    software: "Revit Structure · Bluebeam",
    image: "assets/img/garden_city_skyway_portada.webp",
    summary:
      "Ingeniería de constructibilidad para el puente gemelo sobre el Canal Welland. Celosías continuas de gran luz, vigas cajón y secuencia de izaje.",
    summary_en:
      "Constructability engineering for the twin skyway bridge over Welland Canal. High-span continuous trusses, box girders, and erection sequencing.",
  },
  {
    id: "P-001",
    slug: "aeropuerto-amb-terminal-2",
    name: "Aeropuerto Internacional AMB — Terminal 2",
    name_en: "AMB International Airport — Terminal 2",
    client: "Nuevo Pudahuel / Astaldi / Vinci",
    country: "Chile",
    flag: "cl",
    category: "Aeroportuario",
    category_en: "Aviation",
    metric: "320,000 m²",
    metricLabel: "Superficie Modelada",
    metricLabel_en: "Modeled Surface",
    software: "Revit · Navisworks · ACC",
    image: "assets/img/amb_00.webp",
    summary:
      "Coordinación BIM integral y modelado estructural de espigones y terminal internacional con flujos de pasajeros de alta densidad.",
    summary_en:
      "Full BIM coordination and structural modeling of piers and international terminal handling high-density passenger flows.",
  },
  {
    id: "P-002",
    slug: "hospital-marga-marga",
    name: "Hospital Marga Marga",
    name_en: "Marga Marga Hospital Complex",
    client: "SSVQ / Acciona",
    country: "Chile",
    flag: "cl",
    category: "Salud",
    category_en: "Healthcare",
    metric: "75,000 m²",
    metricLabel: "Hormigón & Aisladores",
    metricLabel_en: "Concrete & Isolators",
    software: "Revit Structure",
    image: "assets/img/hmm_portada.webp",
    summary:
      "Estructura masiva de hormigón armado con sistema de aislación sísmica elastomérica y compatibilización estricta de redes MEP hospitalarias.",
    summary_en:
      "Massive reinforced concrete hospital with elastomeric seismic isolation system and strict MEP clash resolution.",
  },
  {
    id: "P-051",
    slug: "12668262-bhp-piscinas-refino",
    name: "Piscinas de Refino BHP — Minera Escondida",
    name_en: "BHP Raffinate Ponds — Escondida Mine",
    client: "BHP Minerals Americas / GHD",
    country: "Chile",
    flag: "cl",
    category: "Gran Minería",
    category_en: "Major Mining",
    metric: "12,000 m³",
    metricLabel: "Hormigón Ácido",
    metricLabel_en: "Acid-Resistant Concrete",
    software: "Revit · AutoCAD · Bluebeam",
    image: "assets/img/bhp_piscinas_refino_portada.webp",
    summary:
      "Piscinas de retención de soluciones de lixiviación con revestimiento HDPE, losas de protección química y zapatas continuas en alta montaña.",
    summary_en:
      "Leaching solution ponds with HDPE geomembranes, acid-resistant concrete slabs, and massive foundations in high-altitude desert mining.",
  },
  {
    id: "P-005",
    slug: "maquina-papelera-mp05-absormex",
    name: "Máquina Papelera MP05 — ABSORMEX",
    name_en: "MP05 Tissue Paper Machine — ABSORMEX",
    client: "Absormex CMPC Tissue",
    country: "México",
    flag: "mx",
    category: "Industrial Pesada",
    category_en: "Heavy Industrial",
    metric: "8,000 m²",
    metricLabel: "Nave Celulosa",
    metricLabel_en: "Pulp Machine Hall",
    software: "Revit Structure · BIM 360",
    image: "assets/img/absormex_portada.webp",
    summary:
      "Nave industrial de alta vibración dinámica, vigas carrilera de puente grúa y fundaciones aisladas para cilindro secador Yankee.",
    summary_en:
      "Heavy industrial machine hall with dynamic vibration loads, overhead crane girders, and massive Yankee dryer foundations.",
  },
  {
    id: "P-004",
    slug: "paso-fronterizo-los-libertadores",
    name: "Complejo Los Libertadores (3,200 msnm)",
    name_en: "Los Libertadores Border Complex (3,200m)",
    client: "MOP Chile / OHL",
    country: "Chile",
    flag: "cl",
    category: "Infraestructura / Clima Extremo",
    category_en: "High Mountain / Extreme Climate",
    metric: "35,000 m²",
    metricLabel: "Nieve 1,200 kg/m²",
    metricLabel_en: "Snow 1,200 kg/m²",
    software: "Tekla Structures · AutoCAD",
    image: "assets/img/pfll_00.webp",
    summary:
      "Edificio terminal de alta montaña diseñado para cargas extremas de nieve y vientos cordilleranos. Detallamiento de nudos de acero en Tekla.",
    summary_en:
      "High mountain border facility engineered for extreme snow loads and Andean wind gusts. Full structural steel detailing in Tekla.",
  },
];

export const HorizontalProjectsGallery = () => {
  const containerRef = useRef(null);
  const { language, t } = useTranslation();
  const isEn = language === "en";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transformación horizontal del riel en desktop
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-64%"]);
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ["16%", "100%"]);

  return (
    <section className="relative w-full border-t border-slate-800/80 bg-slate-950/70">
      {/* ─── DESKTOP PINNED HORIZONTAL TRACK ─── */}
      <div ref={containerRef} className="hidden md:block h-[280vh] relative">
        <div className="sticky top-0 h-screen w-full flex flex-col justify-between py-8 px-6 lg:px-12 overflow-hidden">
          {/* Header Superior del Pinned Section */}
          <div className="flex items-center justify-between z-20 pt-16 pb-2">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
                {isEn ? "// LANDMARK PROJECTS · SCROLL-DRIVEN" : "// PROYECTOS INSIGNIA · HORIZONTAL SCROLL"}
              </span>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                {isEn ? "Engineering & Mining Megaprojects" : "Megaproyectos de Ingeniería & Minería"}
              </h2>
            </div>

            {/* Barra de Progreso Dinámica */}
            <div className="flex items-center gap-4">
              <div className="text-xs font-mono text-slate-400">
                <span className="text-cyan-400 font-bold">01</span> / 06
              </div>
              <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  style={{ width: progressBarWidth }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Riel Horizontal Deslizante */}
          <div className="relative flex-1 flex items-center overflow-hidden">
            <motion.div style={{ x }} className="flex gap-8 items-center cursor-grab active:cursor-grabbing">
              {LANDMARK_PROJECTS.map((project, index) => {
                const title = isEn ? project.name_en : project.name;
                const category = isEn ? project.category_en : project.category;
                const metricLabel = isEn ? project.metricLabel_en : project.metricLabel;
                const summary = isEn ? project.summary_en : project.summary;

                return (
                  <div
                    key={project.id}
                    className="w-[580px] lg:w-[680px] shrink-0 bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 lg:p-7 backdrop-blur-xl shadow-2xl hover:border-cyan-500/40 transition-colors group"
                  >
                    {/* Contenedor Imagen Cinemática */}
                    <div className="relative h-64 lg:h-72 w-full rounded-2xl overflow-hidden bg-slate-950 mb-5">
                      <img
                        src={asset(`/${project.image}`)}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      {/* Insignias Flotantes */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 backdrop-blur-md text-[11px] font-mono font-bold text-cyan-400">
                          {category}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 backdrop-blur-md text-[11px] font-mono text-slate-300">
                          {project.country}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 backdrop-blur-md text-[11px] font-mono font-bold text-cyan-300">
                        {project.metric} · {metricLabel}
                      </div>

                      {/* Cliente e ID en la base de la imagen */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300">
                        <span>{project.client}</span>
                        <span className="text-slate-500">{project.software}</span>
                      </div>
                    </div>

                    {/* Contenido Textual y CTA */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-mono text-cyan-400 font-bold mb-1">
                          0{index + 1} // {project.id}
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {title}
                        </h3>
                        <p className="text-slate-300 text-xs lg:text-sm leading-relaxed mb-6 line-clamp-2">
                          {summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <Link
                          to={`/project/${project.id}`}
                          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300"
                        >
                          <RollingTextButton
                            text={isEn ? "Inspect Technical Dossier" : "Examinar Expediente Técnico"}
                            variant="primary"
                            icon={<i className="fa-solid fa-arrow-right text-[10px]" />}
                            className="text-xs py-2 px-4"
                          />
                        </Link>
                        <span className="text-[11px] font-mono text-slate-500">
                          {isEn ? "Direct Case Study" : "Caso de Estudio Completo"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Hint de Navegación Inferior */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 z-20 pb-2">
            <span>
              <i className="fa-solid fa-arrow-down mr-2 text-cyan-400" />
              {isEn ? "Scroll to traverse project sequence" : "Haz scroll para recorrer la secuencia técnica"}
            </span>
            <Link
              to="/proyectos-bim"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
            >
              {isEn ? "View Complete Archive (50+ Projects) →" : "Ver Catálogo Completo (50+ Obras) →"}
            </Link>
          </div>
        </div>
      </div>

      {/* ─── MOBILE TOUCH CAROUSEL (RESPONSIVE FALLBACK) ─── */}
      <div className="block md:hidden py-12 px-4">
        <div className="mb-6">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
            {isEn ? "// FEATURED PROJECTS" : "// PROYECTOS DESTACADOS"}
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {isEn ? "Engineering Megaprojects" : "Megaproyectos de Ingeniería"}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {isEn ? "Swipe horizontally to explore" : "Desliza horizontalmente para explorar"}
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-none">
          {LANDMARK_PROJECTS.map((project, index) => {
            const title = isEn ? project.name_en : project.name;
            const category = isEn ? project.category_en : project.category;
            const summary = isEn ? project.summary_en : project.summary;

            return (
              <div
                key={project.id}
                className="w-[84vw] shrink-0 snap-center bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 rounded-xl overflow-hidden bg-slate-950 mb-3">
                    <img
                      src={asset(`/${project.image}`)}
                      alt={title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] font-mono font-bold text-cyan-400">
                      {category}
                    </div>
                    <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300">
                      {project.metric}
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-cyan-400 font-bold mb-0.5">
                    0{index + 1} // {project.id}
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{title}</h3>
                  <p className="text-slate-300 text-xs leading-relaxed mb-4 line-clamp-2">
                    {summary}
                  </p>
                </div>

                <Link to={`/project/${project.id}`} className="w-full block">
                  <RollingTextButton
                    text={isEn ? "View Details" : "Ver Expediente"}
                    variant="primary"
                    icon={<i className="fa-solid fa-arrow-right text-[10px]" />}
                    className="w-full text-xs py-2 justify-center"
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
