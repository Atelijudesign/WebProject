import { useRef } from "react";
import { AnimatedBeam } from "./ui/AnimatedBeam";
import { useTranslation } from "../context/LanguageContext";

export const BimAutomationPipeline = () => {
  const { t, language } = useTranslation();
  const isEn = language === "en";
  const containerRef = useRef(null);
  
  // Nodos Izquierda (Fuentes BIM / CAD)
  const revitRef = useRef(null);
  const cadRef = useRef(null);
  const dynamoRef = useRef(null);

  // Nodo Central (Motor de Desarrollo)
  const coreRef = useRef(null);

  // Nodos Derecha (Salidas y Plataformas)
  const webAppRef = useRef(null);
  const dbRef = useRef(null);
  const excelRef = useRef(null);

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl relative overflow-hidden mb-12">
      {/* Header del Pipeline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800/60">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            {t("pipe_tag")}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
            {t("pipe_title")}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            {t("pipe_latency")}
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            {t("pipe_sync")}
          </span>
        </div>
      </div>

      {/* Contenedor Visual de Nodos y Haces de Luz */}
      <div
        ref={containerRef}
        className="relative flex w-full items-center justify-between min-h-[340px] px-2 sm:px-6 py-8"
      >
        {/* Columna 1: Entradas BIM & CAD */}
        <div className="flex flex-col justify-between h-full gap-6 z-10">
          <div
            ref={revitRef}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg hover:border-cyan-400/50 transition-colors btn-tactile cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-lg font-bold group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-cube" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-mono font-bold text-white">Revit 2024-2027</p>
              <p className="text-[10px] font-mono text-slate-400">{t("pipe_models_desc") || (isEn ? "IFC Models / Geometry" : "Modelos IFC / Geometría")}</p>
            </div>
          </div>

          <div
            ref={cadRef}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg hover:border-cyan-400/50 transition-colors btn-tactile cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 text-lg font-bold group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-drafting-compass" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-mono font-bold text-white">AutoCAD & Steel</p>
              <p className="text-[10px] font-mono text-slate-400">{t("pipe_cad_desc") || (isEn ? "Details & Connections" : "Detalles & Conexiones")}</p>
            </div>
          </div>

          <div
            ref={dynamoRef}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg hover:border-cyan-400/50 transition-colors btn-tactile cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg font-bold group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-diagram-project" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-mono font-bold text-white">Dynamo BIM</p>
              <p className="text-[10px] font-mono text-slate-400">{t("pipe_dynamo_desc") || (isEn ? "Parametric Logic" : "Lógica Paramétrica")}</p>
            </div>
          </div>
        </div>

        {/* Columna 2: Motor Central (Andrés Gallo P. Engine) */}
        <div className="z-10 flex flex-col items-center justify-center">
          <div
            ref={coreRef}
            className="p-6 rounded-3xl bg-slate-900/95 border-2 border-cyan-500/60 shadow-2xl shadow-cyan-500/20 flex flex-col items-center text-center max-w-[200px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-2xl shadow-lg mb-3 float-gentle">
              <i className="fa-solid fa-microchip" />
            </div>
            <h4 className="text-sm font-black text-white font-mono uppercase tracking-wider">
              Andrés Gallo P. Engine
            </h4>
            <p className="text-[11px] font-mono text-cyan-300 mt-1">
              Python · C# .NET · pyRevit
            </p>
            <span className="mt-3 px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-400/40 text-[9px] font-mono text-cyan-400">
              CORE PIPELINE
            </span>
          </div>
        </div>

        {/* Columna 3: Salidas y Plataformas */}
        <div className="flex flex-col justify-between h-full gap-6 z-10">
          <div
            ref={webAppRef}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg hover:border-emerald-400/50 transition-colors btn-tactile cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg font-bold group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-laptop-code" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-mono font-bold text-white">Web Apps & Tools</p>
              <p className="text-[10px] font-mono text-slate-400">{isEn ? "ICHA & AISC Catalogs" : "Catálogos ICHA & AISC"}</p>
            </div>
          </div>

          <div
            ref={dbRef}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg hover:border-emerald-400/50 transition-colors btn-tactile cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-lg font-bold group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-database" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-mono font-bold text-white">Cloud Database</p>
              <p className="text-[10px] font-mono text-slate-400">PostgreSQL / Supabase</p>
            </div>
          </div>

          <div
            ref={excelRef}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg hover:border-emerald-400/50 transition-colors btn-tactile cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-700/20 border border-emerald-600/30 flex items-center justify-center text-emerald-300 text-lg font-bold group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-file-excel" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-mono font-bold text-white">{t("pipe_takeoff_title") || (isEn ? "Instant Takeoff" : "Cubicación Instantánea")}</p>
              <p className="text-[10px] font-mono text-slate-400">{t("pipe_takeoff_desc") || (isEn ? "Excel & PDF Reports" : "Reportes Excel & PDF")}</p>
            </div>
          </div>
        </div>

        {/* ─── HACES DE LUZ ANIMADOS (ANIMATED BEAMS) ─── */}
        {/* Entradas ➔ Núcleo */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={revitRef}
          toRef={coreRef}
          curvature={-30}
          duration={3.2}
          gradientStartColor="#38bdf8"
          gradientStopColor="#3b82f6"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={cadRef}
          toRef={coreRef}
          curvature={0}
          duration={2.8}
          gradientStartColor="#f87171"
          gradientStopColor="#38bdf8"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={dynamoRef}
          toRef={coreRef}
          curvature={30}
          duration={3.5}
          gradientStartColor="#fbbf24"
          gradientStopColor="#38bdf8"
        />

        {/* Núcleo ➔ Salidas */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={coreRef}
          toRef={webAppRef}
          curvature={-30}
          duration={3.0}
          delay={0.4}
          gradientStartColor="#38bdf8"
          gradientStopColor="#34d399"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={coreRef}
          toRef={dbRef}
          curvature={0}
          duration={2.6}
          delay={0.2}
          gradientStartColor="#38bdf8"
          gradientStopColor="#a855f7"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={coreRef}
          toRef={excelRef}
          curvature={30}
          duration={3.4}
          delay={0.6}
          gradientStartColor="#38bdf8"
          gradientStopColor="#10b981"
        />
      </div>
    </div>
  );
};
