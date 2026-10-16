import { Link } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";

const ACCENTS = {
  cyan: "text-cyan-400 border-cyan-500/30 bg-cyan-950/40",
  blue: "text-blue-400 border-blue-500/30 bg-blue-950/40",
  emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-950/40",
  amber: "text-amber-400 border-amber-500/30 bg-amber-950/40",
  yellow: "text-yellow-400 border-yellow-500/30 bg-yellow-950/40",
  purple: "text-purple-400 border-purple-500/30 bg-purple-950/40",
};

/**
 * Hub central de la serie SmartPlant 3D: tarjetas de la ruta de
 * aprendizaje por disciplina con nivel, duracion y estado.
 */
export default function Sp3dSeriesHub() {
  const { language } = useTranslation();
  const isEn = language === "en";

  const learningPath = [
    {
      num: "01",
      icon: "fa-border-all",
      accent: "cyan",
      title: isEn ? "Fundamentals, Common & Grids" : "Fundamentos, Common y Grillas",
      desc: isEn
        ? "Session files, 4-view workspace, Define Workspace filters and the Grid Wizard step by step."
        : "Archivos de sesion, workspace de 4 vistas, filtros Define Workspace y el Grid Wizard paso a paso.",
      level: isEn ? "Beginner" : "Inicial",
      duration: "20 min",
      href: "/blog/smartplant-3d-fundamentos-grillas",
      available: true,
    },
    {
      num: "02",
      icon: "fa-cube",
      accent: "blue",
      title: isEn ? "Equipment Modeling" : "Modelado de Equipment",
      desc: isEn
        ? "Pumps, vessels and nozzles from the catalog: placement, orientation and equipment relationships."
        : "Bombas, estanques y nozzles desde el catalogo: posicionamiento, orientacion y relaciones de equipo.",
      level: isEn ? "Beginner-Intermediate" : "Inicial-Intermedio",
      duration: "25 min",
      href: null,
      available: false,
    },
    {
      num: "03",
      icon: "fa-diagram-project",
      accent: "emerald",
      title: isEn ? "Piping & Supports" : "Piping y Soportes",
      desc: isEn
        ? "Full workflow: systems, pipe runs, routing, components and hangers & supports."
        : "Flujo completo: sistemas, pipe runs, ruteo, componentes y hangers & supports.",
      level: isEn ? "Intermediate" : "Intermedio",
      duration: "30 min",
      href: null,
      available: false,
    },
    {
      num: "04",
      icon: "fa-building",
      accent: "amber",
      title: isEn ? "Structural Modeling (CSA)" : "Estructuras (CSA)",
      desc: isEn
        ? "Master manual: 18 labs, 9 cardinal points, multi-level frames, connections and slabs."
        : "Manual maestro: 18 laboratorios, 9 puntos cardinales, marcos multinivel, conexiones y losas.",
      level: isEn ? "Intermediate" : "Intermedio",
      duration: "35 min",
      href: "/blog/manual-smartplant-3d-structural-modeling",
      available: true,
    },
    {
      num: "05",
      icon: "fa-bolt",
      accent: "yellow",
      title: isEn ? "Electrical & Cableways" : "Electricidad y Cableways",
      desc: isEn
        ? "Cable trays, conduits and electrical routing with real drawings E-1201 and E-1301."
        : "Bandejas portacables, conduits y ruteo electrico con los planos reales E-1201 y E-1301.",
      level: isEn ? "Intermediate" : "Intermedio",
      duration: "20 min",
      href: null,
      available: false,
    },
    {
      num: "06",
      icon: "fa-file-lines",
      accent: "purple",
      title: isEn ? "Isometrics, Drawings & SmartSketch" : "Isometricos, Drawings y SmartSketch",
      desc: isEn
        ? "Deliverables: Isogen isometrics, drawings & reports extraction and 2D SmartSketch detailing."
        : "Entregables: isometricos Isogen, extraccion de drawings & reports y detallado 2D con SmartSketch.",
      level: isEn ? "Advanced" : "Avanzado",
      duration: "25 min",
      href: null,
      available: false,
    },
  ];

  const renderCardInner = (step) => (
    <>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span
            className={`w-11 h-11 rounded-xl border flex items-center justify-center text-lg shrink-0 ${ACCENTS[step.accent] || ACCENTS.cyan}`}
          >
            <i className={`fa-solid ${step.icon}`} />
          </span>
          <div>
            <span className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
              {isEn ? `Module ${step.num}` : `Modulo ${step.num}`}
            </span>
            <h3 className="text-base font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
              {step.title}
            </h3>
          </div>
        </div>
        {step.available ? (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase whitespace-nowrap">
            {isEn ? "Available" : "Disponible"}
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700 text-[10px] font-mono font-bold uppercase whitespace-nowrap">
            {isEn ? "Coming soon" : "Proximamente"}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400 leading-relaxed mb-4">{step.desc}</p>
      <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-2 flex-wrap font-mono text-[10px]">
          <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300">
            <i className="fa-solid fa-signal mr-1 text-cyan-400" />
            {step.level}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300">
            <i className="fa-regular fa-clock mr-1 text-amber-400" />
            {step.duration}
          </span>
        </div>
        {step.available && (
          <i className="fa-solid fa-arrow-right text-cyan-400 group-hover:translate-x-1 transition-transform" />
        )}
      </div>
    </>
  );

  return (
    <div
      id="ruta-aprendizaje"
      className="glass-card rounded-2xl p-8 md:p-10 border-2 border-cyan-500/30 bg-slate-950/70 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40 uppercase tracking-widest inline-flex items-center gap-1.5 mb-3">
          <i className="fa-solid fa-route" />
          {isEn ? "Learning Path Hub" : "Hub de la Serie"}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-grotesk mb-2">
          {isEn
            ? "SmartPlant 3D Learning Path: From Zero to Deliverables"
            : "Ruta de Aprendizaje SmartPlant 3D: De Cero a Entregables"}
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-3xl">
          {isEn
            ? "Six progressive articles built from the EFV training manuals. Follow the recommended order: master the workspace and grids first, then equipment, piping and structures, and finish with electrical and production deliverables."
            : "Seis articulos progresivos construidos desde los manuales de entrenamiento EFV. Sigue el orden recomendado: domina primero el workspace y las grillas, luego equipos, piping y estructuras, y cierra con electricidad y entregables de produccion."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningPath.map((step) =>
            step.available ? (
              <Link
                key={step.num}
                to={step.href}
                className="group flex flex-col p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-950/40"
              >
                {renderCardInner(step)}
              </Link>
            ) : (
              <div
                key={step.num}
                aria-disabled="true"
                className="flex flex-col p-5 rounded-xl bg-slate-900/40 border border-slate-800/60 opacity-70 cursor-not-allowed"
              >
                {renderCardInner(step)}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
