import { getCategoryMetadata } from "./ifcHelpers";

export const IfcSelectionHud = ({
  selectedElement,
  onClearSelection,
  onZoomToElement,
  onIsolateElement,
  onHideElement,
  onOpenProperties,
  isIsolated = false,
}) => {
  if (!selectedElement) return null;

  const meta = getCategoryMetadata(selectedElement.ifcType);
  const displayName =
    selectedElement.name ||
    selectedElement.description ||
    `${meta.name} #${selectedElement.expressID}`;

  return (
    <div className="absolute top-4 left-3 sm:left-4 z-30 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-200 max-w-[calc(100%-180px)]">
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/50 shadow-2xl shadow-cyan-950/50 text-white select-none">
        {/* Indicador de selección activa */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>

          {/* Badge de Categoría */}
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[11px] font-bold shrink-0"
            style={{
              backgroundColor: `${meta.color}20`,
              borderColor: `${meta.color}50`,
              color: meta.color,
            }}
          >
            <i className={`fa-solid ${meta.icon} text-[10px]`}></i>
            <span className="hidden sm:inline">{meta.name}</span>
          </div>
        </div>

        {/* Nombre y Express ID del Elemento */}
        <div className="min-w-0 max-w-[140px] sm:max-w-[240px] md:max-w-[340px]">
          <div className="text-xs font-bold font-mono truncate text-slate-100" title={displayName}>
            {displayName}
          </div>
          <div className="text-[10px] font-mono text-cyan-300 truncate">
            ExpressID: #{selectedElement.expressID}
            {selectedElement.tag ? ` • Tag: ${selectedElement.tag}` : ""}
          </div>
        </div>

        {/* Separador Vertical */}
        <div className="h-5 w-[1px] bg-slate-700/80 shrink-0"></div>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Enfocar 3D */}
          <button
            type="button"
            onClick={onZoomToElement}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-200 text-xs font-medium transition-all flex items-center gap-1 border border-slate-700/60 hover:border-cyan-500 shadow-sm"
            title="Centrar y enfocar cámara en el elemento (F)"
          >
            <i className="fa-solid fa-crosshairs text-cyan-400 text-xs"></i>
            <span className="hidden md:inline text-[11px]">Enfocar</span>
            <kbd className="hidden lg:inline text-[9px] font-mono bg-black/30 px-1 rounded text-slate-400">F</kbd>
          </button>

          {/* Aislar Elemento */}
          <button
            type="button"
            onClick={onIsolateElement}
            className={`px-2 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 border shadow-sm ${
              isIsolated
                ? "bg-amber-500 text-slate-950 font-bold border-amber-400"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700/60"
            }`}
            title={isIsolated ? "Restablecer visibilidad completa" : "Aislar solo este elemento en la escena 3D"}
          >
            <i className={`fa-solid ${isIsolated ? "fa-eye" : "fa-filter"} text-xs ${isIsolated ? "text-slate-950" : "text-amber-400"}`}></i>
            <span className="hidden md:inline text-[11px]">{isIsolated ? "Aislado" : "Aislar"}</span>
          </button>

          {/* Ocultar Elemento */}
          <button
            type="button"
            onClick={onHideElement}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-rose-900/60 hover:border-rose-500 hover:text-rose-200 text-slate-300 text-xs font-medium transition-all flex items-center gap-1 border border-slate-700/60 shadow-sm"
            title="Ocultar este elemento de la vista 3D (H)"
          >
            <i className="fa-solid fa-eye-slash text-xs text-rose-400"></i>
            <span className="hidden lg:inline text-[11px]">Ocultar</span>
          </button>

          {/* Ver Propiedades */}
          <button
            type="button"
            onClick={onOpenProperties}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-200 text-xs font-medium transition-all flex items-center gap-1 border border-slate-700/60 hover:border-blue-500 shadow-sm"
            title="Abrir inspector de propiedades y Psets"
          >
            <i className="fa-solid fa-list-check text-blue-400 text-xs"></i>
            <span className="hidden md:inline text-[11px]">Propiedades</span>
          </button>

          {/* Deseleccionar */}
          <button
            type="button"
            onClick={onClearSelection}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors ml-0.5"
            title="Quitar selección (Esc)"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
