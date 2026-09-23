import { useState, useRef, useEffect } from "react";

export const IfcToolbar = ({
  activeMode,
  onModeChange,
  isWireframe,
  onToggleWireframe,
  isOrthographic,
  onToggleProjection,
  onCameraPreset,
  onFitModel,
  onResetView,
  activeSidebarTab,
  onToggleSidebarTab,
  isPropertiesOpen,
  onToggleProperties,
  onClearSelection,
  hasSelection,
  onOpenExportModal,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const viewMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (viewMenuRef.current && !viewMenuRef.current.contains(e.target)) {
        setIsViewMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePresetClick = (preset) => {
    onCameraPreset(preset);
    setIsViewMenuOpen(false);
  };

  return (
    <div className="flex max-w-[calc(100vw-1rem)] items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/50 text-slate-300 pointer-events-auto">
      {/* Herramientas de Interacción */}
      <div className="flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/40">
        <button
          type="button"
          onClick={() => onModeChange("select")}
          title="Modo Selección e Inspección (V)"
          aria-label="Modo Selección e Inspección"
          className={`px-3 py-2 min-h-[40px] sm:min-h-[44px] rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeMode === "select"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <i className="fa-solid fa-arrow-pointer text-sm"></i>
          <span className="hidden sm:inline">Inspeccionar</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("measure-distance")}
          title="Medir Distancia 3D punto a punto (M)"
          aria-label="Medir Distancia 3D"
          className={`px-3 py-2 min-h-[40px] sm:min-h-[44px] rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeMode === "measure-distance"
              ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <i className="fa-solid fa-ruler text-sm"></i>
          <span className="hidden sm:inline">Distancia</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("measure-area")}
          title="Medir Área Poligonal 3D (A)"
          aria-label="Medir Área Poligonal 3D"
          className={`hidden md:flex px-3 py-2 min-h-[40px] sm:min-h-[44px] rounded-lg text-xs font-semibold items-center gap-2 transition-all ${
            activeMode === "measure-area"
              ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <i className="fa-solid fa-draw-polygon text-sm"></i>
          <span className="hidden sm:inline">Área</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("section")}
          title="Planos de Sección y Corte (C)"
          aria-label="Planos de Sección y Corte"
          className={`px-3 py-2 min-h-[40px] sm:min-h-[44px] rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeMode === "section"
              ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <i className="fa-solid fa-scissors text-sm"></i>
          <span className="hidden sm:inline">Corte</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("walk")}
          title="Modo Peatonal en Primera Persona (WASD + Ratón)"
          aria-label="Modo Peatonal en Primera Persona"
          className={`hidden md:flex px-3 py-2 min-h-[40px] sm:min-h-[44px] rounded-lg text-xs font-semibold items-center gap-2 transition-all ${
            activeMode === "walk"
              ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <i className="fa-solid fa-person-walking text-sm"></i>
          <span className="hidden sm:inline">Paseo</span>
        </button>
      </div>

      <div className="h-6 w-px bg-slate-700/60 mx-0.5"></div>

      {/* Vistas de Cámara y Proyección */}
      <div className="relative" ref={viewMenuRef}>
        <button
          type="button"
          onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
          title="Vistas Estándar (Planta, Elevaciones, Isométrica)"
          aria-label="Menú de Vistas Estándar"
          className={`px-3 py-2 min-h-[40px] sm:min-h-[44px] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
            isViewMenuOpen
              ? "bg-slate-700 text-white border-slate-600"
              : "bg-slate-800/60 text-slate-300 border-slate-700/40 hover:bg-slate-700/50 hover:text-white"
          }`}
        >
          <i className="fa-solid fa-camera-rotate text-sm text-blue-400"></i>
          <span className="hidden md:inline">Vistas</span>
          <i className="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
        </button>

        {isViewMenuOpen && (
          <div className="absolute bottom-full mb-2 left-0 w-52 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="px-2.5 py-1 text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold border-b border-slate-800 mb-1 flex items-center justify-between">
              <span>Orientaciones Revit</span>
              <span className="text-[9px] text-slate-400 bg-slate-800 px-1 rounded font-normal">Cubo 3D</span>
            </div>
            <button
              type="button"
              onClick={() => handlePresetClick("iso")}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-blue-600/30 flex items-center gap-2.5 transition-colors"
            >
              <i className="fa-solid fa-cube text-blue-400 w-4 text-center"></i>
              <span>Isométrica (Home)</span>
            </button>
            <button
              type="button"
              onClick={() => handlePresetClick("top")}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-blue-600/30 flex items-center gap-2.5 transition-colors"
            >
              <i className="fa-solid fa-border-top-left text-cyan-400 w-4 text-center"></i>
              <span>Superior (TOP)</span>
            </button>
            <button
              type="button"
              onClick={() => handlePresetClick("front")}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-blue-600/30 flex items-center gap-2.5 transition-colors"
            >
              <i className="fa-solid fa-grip-lines text-indigo-400 w-4 text-center"></i>
              <span>Frontal (FRONT)</span>
            </button>
            <button
              type="button"
              onClick={() => handlePresetClick("right")}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-blue-600/30 flex items-center gap-2.5 transition-colors"
            >
              <i className="fa-solid fa-grip-lines-vertical text-emerald-400 w-4 text-center"></i>
              <span>Derecha (RIGHT)</span>
            </button>
            <button
              type="button"
              onClick={() => handlePresetClick("left")}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-blue-600/30 flex items-center gap-2.5 transition-colors"
            >
              <i className="fa-solid fa-grip-lines-vertical text-teal-400 w-4 text-center"></i>
              <span>Izquierda (LEFT)</span>
            </button>
            <button
              type="button"
              onClick={() => handlePresetClick("back")}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-blue-600/30 flex items-center gap-2.5 transition-colors"
            >
              <i className="fa-solid fa-grip-lines text-purple-400 w-4 text-center"></i>
              <span>Posterior (BACK)</span>
            </button>
            <button
              type="button"
              onClick={() => handlePresetClick("bottom")}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-blue-600/30 flex items-center gap-2.5 transition-colors"
            >
              <i className="fa-solid fa-border-all text-slate-400 w-4 text-center"></i>
              <span>Inferior (BOTTOM)</span>
            </button>
            <div className="my-1 border-t border-slate-800"></div>
            <button
              type="button"
              onClick={() => handlePresetClick("fit")}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-blue-600/30 flex items-center gap-2.5 transition-colors"
            >
              <i className="fa-solid fa-expand text-amber-400 w-4 text-center"></i>
              <span>Encuadrar Modelo (F)</span>
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onToggleProjection}
        title={isOrthographic ? "Cambiar a Cámara Perspectiva" : "Cambiar a Cámara Ortográfica (Técnica)"}
        aria-label={isOrthographic ? "Cambiar a Cámara Perspectiva" : "Cambiar a Cámara Ortográfica"}
        className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 transition-all border ${
          isOrthographic
            ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/40"
            : "bg-slate-800/60 text-slate-400 border-slate-700/40 hover:text-white hover:bg-slate-700/50"
        }`}
      >
        <i className={`fa-solid ${isOrthographic ? "fa-vector-square" : "fa-cube"} text-sm`}></i>
      </button>

      <button
        type="button"
        onClick={onToggleWireframe}
        title={isWireframe ? "Ocultar Malla Wireframe" : "Mostrar Malla Wireframe de Aristas"}
        aria-label={isWireframe ? "Ocultar Malla Wireframe" : "Mostrar Malla Wireframe"}
        className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 transition-all border ${
          isWireframe
            ? "bg-cyan-500/30 text-cyan-300 border-cyan-500/40"
            : "bg-slate-800/60 text-slate-400 border-slate-700/40 hover:text-white hover:bg-slate-700/50"
        }`}
      >
        <i className="fa-solid fa-network-wired text-sm"></i>
      </button>

      <button
        type="button"
        onClick={onFitModel}
        title="Centrar y Encuadrar Modelo (F)"
        aria-label="Centrar y Encuadrar Modelo"
        className="p-2 rounded-xl text-xs font-semibold flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-white hover:bg-slate-700/50 transition-all"
      >
        <i className="fa-solid fa-bullseye text-sm"></i>
      </button>

      <div className="h-6 w-px bg-slate-700/60 mx-0.5"></div>

      {/* Paneles Laterales */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onToggleSidebarTab("tree")}
          title="Árbol Espacial IFC (Niveles y Pisos)"
          aria-label="Árbol Espacial IFC"
          className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 transition-all border ${
            activeSidebarTab === "tree"
              ? "bg-cyan-600/30 text-cyan-300 border-cyan-500/40"
              : "bg-slate-800/60 text-slate-400 border-slate-700/40 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <i className="fa-solid fa-sitemap text-sm"></i>
        </button>

        <button
          type="button"
          onClick={() => onToggleSidebarTab("categories")}
          title="Panel de Categorías Estructurales"
          aria-label="Panel de Categorías Estructurales"
          className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 transition-all border ${
            activeSidebarTab === "categories"
              ? "bg-blue-600/30 text-blue-300 border-blue-500/40"
              : "bg-slate-800/60 text-slate-400 border-slate-700/40 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <i className="fa-solid fa-layer-group text-sm"></i>
        </button>

        <button
          type="button"
          onClick={() => onToggleSidebarTab("search")}
          title="Buscador y Filtros BIM"
          aria-label="Buscador y Filtros BIM"
          className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 transition-all border ${
            activeSidebarTab === "search"
              ? "bg-blue-600/30 text-blue-300 border-blue-500/40"
              : "bg-slate-800/60 text-slate-400 border-slate-700/40 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <i className="fa-solid fa-magnifying-glass text-sm"></i>
        </button>

        <button
          type="button"
          onClick={() => onToggleSidebarTab("bcf")}
          title="Incidencias y Revisiones BCF"
          aria-label="Incidencias y Revisiones BCF"
          className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 transition-all border ${
            activeSidebarTab === "bcf"
              ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/40"
              : "bg-slate-800/60 text-slate-400 border-slate-700/40 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <i className="fa-solid fa-thumbtack text-sm"></i>
        </button>

        <button
          type="button"
          onClick={() => onToggleSidebarTab("measurements")}
          title="Historial de Mediciones"
          aria-label="Historial de Mediciones"
          className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 transition-all border ${
            activeSidebarTab === "measurements"
              ? "bg-cyan-500/30 text-cyan-300 border-cyan-500/40"
              : "bg-slate-800/60 text-slate-400 border-slate-700/40 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <i className="fa-solid fa-list-check text-sm"></i>
        </button>

        <button
          type="button"
          onClick={onToggleProperties}
          title="Inspector de Propiedades BIM"
          aria-label="Inspector de Propiedades BIM"
          className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 transition-all border ${
            isPropertiesOpen
              ? "bg-purple-600/30 text-purple-300 border-purple-500/40"
              : "bg-slate-800/60 text-slate-400 border-slate-700/40 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <i className="fa-solid fa-circle-info text-sm"></i>
        </button>
      </div>

      <div className="h-6 w-px bg-slate-700/60 mx-0.5"></div>

      {/* Exportar & Pantalla Completa */}
      <button
        type="button"
        onClick={onOpenExportModal}
        title="Exportar Cubicación o Datos a CSV / JSON"
        aria-label="Exportar Cubicación o Datos"
        className="px-3 py-2 min-h-[40px] sm:min-h-[44px] rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
      >
        <i className="fa-solid fa-download text-xs"></i>
        <span className="hidden lg:inline">Exportar</span>
      </button>

      {hasSelection && (
        <button
          type="button"
          onClick={onClearSelection}
          title="Deseleccionar Elemento (Esc)"
          aria-label="Deseleccionar Elemento"
          className="p-2 rounded-xl text-xs font-semibold min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all"
        >
          <i className="fa-solid fa-xmark text-sm"></i>
        </button>
      )}

      <button
        type="button"
        onClick={onToggleFullscreen}
        title={isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}
        aria-label={isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}
        className="p-2 rounded-xl text-xs font-semibold flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-white hover:bg-slate-700/50 transition-all"
      >
        <i className={`fa-solid ${isFullscreen ? "fa-compress" : "fa-expand"} text-sm`}></i>
      </button>
    </div>
  );
};
