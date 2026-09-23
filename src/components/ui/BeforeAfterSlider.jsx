import { useState, useRef, useCallback } from "react";

export const BeforeAfterSlider = ({
  beforeImage = "assets/img/amb_pl1.webp",
  afterImage = "assets/img/amb_00.webp",
  beforeLabel = "CAD 2D Tradicional",
  afterLabel = "Modelo BIM 3D Coordinado",
  beforeBadge = "AutoCAD 2D (Planos Planos)",
  afterBadge = "Revit + Tekla 3D (Clash-Free)",
  beforeMetric = "Riesgo de colisiones en obra & RFIs",
  afterMetric = "100% Coordinado & Cubicaciones Automáticas",
  initialPosition = 50,
  className = "",
}) => {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handleMove(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignorar si el puntero ya fue liberado
    }
  };

  // Accesibilidad por teclado (Flechas Izquierda / Derecha)
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Contenedor Principal del Slider */}
      <div
        ref={containerRef}
        tabIndex={0}
        role="slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Comparador interactivo CAD 2D vs BIM 3D"
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] rounded-3xl overflow-hidden select-none cursor-ew-resize bg-slate-950 border border-slate-800 hover:border-slate-700 shadow-2xl touch-none group focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
      >
        {/* IMAGEN POSTERIOR (BIM 3D Coordinado - DERECHA/FONDO) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={afterImage}
            alt={afterLabel}
            className="w-full h-full object-cover"
            loading="lazy"
            draggable="false"
          />
          {/* Badge Lado Derecho */}
          <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-slate-950/85 border border-emerald-500/50 backdrop-blur-md text-emerald-400 font-mono text-xs font-bold shadow-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {afterBadge}
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800/40 text-emerald-300 text-[10px] font-mono">
              ✓ {afterMetric}
            </span>
          </div>
        </div>

        {/* IMAGEN FRONTAL CON MÁSCARA DE RECORTE (CAD 2D Tradicional - IZQUIERDA) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
              maxWidth: "none",
            }}
            loading="lazy"
            draggable="false"
          />
          {/* Badge Lado Izquierdo */}
          <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-1.5 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-slate-950/85 border border-amber-500/50 backdrop-blur-md text-amber-400 font-mono text-xs font-bold shadow-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {beforeBadge}
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md bg-amber-950/80 border border-amber-800/40 text-amber-300 text-[10px] font-mono">
              ⚠️ {beforeMetric}
            </span>
          </div>
        </div>

        {/* LÍNEA DIVISORIA VERTICAL CON GLOW */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        >
          {/* Línea luminosa */}
          <div className="w-[2px] h-full bg-gradient-to-b from-amber-400 via-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />

          {/* Botón Central de Arrastre */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-xl shadow-cyan-500/30 transition-transform group-hover:scale-110">
            <i className="fa-solid fa-arrows-left-right text-xs sm:text-sm animate-pulse" />
          </div>
        </div>

        {/* Hint inferior móvil */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 backdrop-blur-md text-slate-400 text-[10px] font-mono pointer-events-none">
          ↔ Arrastra para comparar CAD vs BIM
        </div>
      </div>

      {/* Botones de Acceso Rápido / Preset Controls */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-mono">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`px-3 py-1.5 rounded-xl border transition-all btn-tactile ${
              sliderPosition === 100
                ? "bg-amber-600/30 border-amber-500/50 text-amber-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
            onClick={() => setSliderPosition(100)}
          >
            Ver Solo CAD 2D
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-xl border transition-all btn-tactile ${
              sliderPosition === 50
                ? "bg-cyan-600/30 border-cyan-500/50 text-cyan-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
            onClick={() => setSliderPosition(50)}
          >
            Dividir 50 / 50
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-xl border transition-all btn-tactile ${
              sliderPosition === 0
                ? "bg-emerald-600/30 border-emerald-500/50 text-emerald-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
            onClick={() => setSliderPosition(0)}
          >
            Ver Solo BIM 3D
          </button>
        </div>

        <span className="text-slate-500 hidden sm:inline text-[11px]">
          Posición: <strong className="text-cyan-400">{Math.round(sliderPosition)}%</strong>
        </span>
      </div>
    </div>
  );
};
