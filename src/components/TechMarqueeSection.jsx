import { Marquee } from "./ui/Marquee";
import { useTranslation } from "../context/LanguageContext";

const BIM_TECH_STACK = [
  { name: "Autodesk Revit", desc: "Modelado BIM & SDK API", desc_en: "BIM Modeling & SDK API", icon: "fa-solid fa-cube", color: "text-cyan-400", border: "hover:border-cyan-500/50" },
  { name: "Tekla Structures", desc: "Detallamiento de Acero", desc_en: "Structural Steel Detailing", icon: "fa-solid fa-industry", color: "text-blue-400", border: "hover:border-blue-500/50" },
  { name: "AutoCAD & Advance Steel", desc: "Planos & Conexiones", desc_en: "Drawings & Connection Design", icon: "fa-solid fa-drafting-compass", color: "text-rose-400", border: "hover:border-rose-500/50" },
  { name: "Dynamo BIM", desc: "Lógica Paramétrica Visual", desc_en: "Visual Parametric Logic", icon: "fa-solid fa-diagram-project", color: "text-amber-400", border: "hover:border-amber-500/50" },
  { name: "Robot Structural", desc: "Cálculo & Análisis FEM", desc_en: "FEA Structural Analysis", icon: "fa-solid fa-chart-line", color: "text-emerald-400", border: "hover:border-emerald-500/50" },
  { name: "Rhino & Grasshopper", desc: "Geometría Computacional", desc_en: "Computational Geometry", icon: "fa-solid fa-shapes", color: "text-purple-400", border: "hover:border-purple-500/50" },
  { name: "IfcOpenShell", desc: "Procesamiento OpenBIM", desc_en: "OpenBIM & IFC Processing", icon: "fa-solid fa-folder-tree", color: "text-sky-400", border: "hover:border-sky-500/50" },
  { name: "Navisworks Manage", desc: "Coordinación & Clashes", desc_en: "Coordination & Clash Detection", icon: "fa-solid fa-crosshairs", color: "text-orange-400", border: "hover:border-orange-500/50" },
];

const DEV_TECH_STACK = [
  { name: "Python 3.12+", desc: "Automatización & IA", desc_en: "Automation & Applied AI", icon: "fa-brands fa-python", color: "text-yellow-400", border: "hover:border-yellow-500/50" },
  { name: "C# .NET SDK", desc: "Add-ins Nativos Revit", desc_en: "Native Revit Add-ins", icon: "fa-solid fa-code", color: "text-purple-400", border: "hover:border-purple-500/50" },
  { name: "pyRevit Framework", desc: "Extensiones & Toolbars", desc_en: "Extensions & Custom Toolbars", icon: "fa-solid fa-robot", color: "text-cyan-400", border: "hover:border-cyan-500/50" },
  { name: "React 19 & Vite", desc: "Frontend Web de Alto Rendimiento", desc_en: "High-Performance Web Frontend", icon: "fa-brands fa-react", color: "text-sky-400", border: "hover:border-sky-500/50" },
  { name: "Three.js & R3F", desc: "Visores 3D en el Navegador", desc_en: "In-Browser 3D Viewers", icon: "fa-solid fa-draw-polygon", color: "text-emerald-400", border: "hover:border-emerald-500/50" },
  { name: "TypeScript", desc: "Tipado Estricto & Arquitectura", desc_en: "Strict Typing & Architecture", icon: "fa-solid fa-shield-halved", color: "text-blue-400", border: "hover:border-blue-500/50" },
  { name: "Tailwind CSS", desc: "Diseño Bento & Responsive", desc_en: "Bento Grid & Responsive Design", icon: "fa-solid fa-wind", color: "text-cyan-300", border: "hover:border-cyan-400/50" },
  { name: "PostgreSQL & Supabase", desc: "Base de Datos en la Nube", desc_en: "Cloud Databases & Schemas", icon: "fa-solid fa-database", color: "text-emerald-400", border: "hover:border-emerald-500/50" },
  { name: "ExcelJS & jsPDF", desc: "Cubicaciones & Reportes", desc_en: "Material Takeoffs & Reports", icon: "fa-solid fa-file-excel", color: "text-green-400", border: "hover:border-green-500/50" },
];

function TechCard({ item, isEn }) {
  return (
    <div
      className={`flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md transition-all duration-300 ${item.border} hover:bg-slate-900 group shadow-lg min-w-[240px] sm:min-w-[260px] btn-tactile cursor-default`}
    >
      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
        <i className={`${item.icon} ${item.color}`} />
      </div>
      <div>
        <p className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">
          {item.name}
        </p>
        <p className="text-[11px] font-mono text-slate-400">
          {isEn && item.desc_en ? item.desc_en : item.desc}
        </p>
      </div>
    </div>
  );
}

export const TechMarqueeSection = () => {
  const { language } = useTranslation();
  const isEn = language === "en";

  return (
    <section className="py-12 bg-[#020617] relative overflow-hidden border-y border-slate-800/80">
      {/* Glow de fondo decorativo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] bg-cyan-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
          {isEn ? "// INTEGRATED TECHNOLOGY ECOSYSTEM" : "// ECOSISTEMA TECNOLÓGICO INTEGRADO"}
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-white">
          {isEn ? "Comprehensive Mastery: Structural BIM Engineering & Software Development" : "Dominio Integral: Ingeniería BIM Estructural & Desarrollo de Software"}
        </h3>
      </div>

      {/* Contenedor del Marquee con Máscara de Desvanecimiento Lateral */}
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="relative w-full overflow-hidden rounded-2xl [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] space-y-4">
          {/* Fila 1: BIM & Ingeniería */}
          <Marquee duration="38s" gap="1rem">
            {BIM_TECH_STACK.map((tech) => (
              <TechCard key={tech.name} item={tech} isEn={isEn} />
            ))}
          </Marquee>

          {/* Fila 2: Software & Web (Dirección Inversa) */}
          <Marquee reverse duration="34s" gap="1rem">
            {DEV_TECH_STACK.map((tech) => (
              <TechCard key={tech.name} item={tech} isEn={isEn} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};
