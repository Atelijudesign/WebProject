import { useMemo, useState } from "react";
import {
  getCategoryMetadata,
  exportElementToJson,
  exportElementToCsv,
} from "./ifcHelpers";

export const PROPERTIES_WIDTH_PRESETS = {
  S: { label: "S", width: 340, title: "Compacto (340px)" },
  M: { label: "M", width: 420, title: "Estándar (420px)" },
  L: { label: "L", width: 540, title: "Amplio (540px)" },
  XL: { label: "XL", width: 680, title: "Máximo (680px)" },
};

export const IfcPropertiesPanel = ({
  selectedElement,
  onClose,
  onZoomToElement,
  isOpen,
  width = 420,
  onWidthChange,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [expandedPsets, setExpandedPsets] = useState({});
  const [isResizing, setIsResizing] = useState(false);
  const [propertyFilter, setPropertyFilter] = useState("");
  const [copiedProperty, setCopiedProperty] = useState("");

  if (!isOpen) return null;

  const togglePset = (psetName) => {
    setExpandedPsets((prev) => ({
      ...prev,
      [psetName]: prev[psetName] === undefined ? false : !prev[psetName],
    }));
  };

  const handleCopyGlobalId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Manejador de redimensionamiento arrastrable (Splitter izquierdo)
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent) => {
      // Arrastrar hacia la izquierda agranda el panel
      const deltaX = startX - moveEvent.clientX;
      const minW = 320;
      const maxW = Math.min(window.innerWidth * 0.5, 850);
      const newWidth = Math.round(Math.max(minW, Math.min(maxW, startWidth + deltaX)));
      if (onWidthChange) onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleDoubleClickReset = () => {
    if (onWidthChange) {
      onWidthChange(width === 420 ? 540 : 420);
    }
  };

  const categoryMeta = selectedElement
    ? getCategoryMetadata(selectedElement.ifcType)
    : null;
  const filteredPsets = useMemo(() => {
    const term = propertyFilter.trim().toLowerCase();
    if (!term) return selectedElement?.psets || [];
    return (selectedElement?.psets || []).map((pset) => ({
      ...pset,
      properties: pset.properties.filter((property) => `${pset.name} ${property.name} ${property.value}`.toLowerCase().includes(term)),
    })).filter((pset) => pset.properties.length > 0);
  }, [selectedElement, propertyFilter]);

  const copyProperty = async (name, value) => {
    await navigator.clipboard.writeText(String(value));
    setCopiedProperty(name);
    window.setTimeout(() => setCopiedProperty(""), 1500);
  };

  return (
    <aside
      aria-label="Inspector de Propiedades BIM"
      style={{ width: typeof window !== "undefined" && window.innerWidth < 640 ? "100%" : `${width}px` }}
      className={`relative shrink-0 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/60 shadow-2xl flex flex-col h-full z-20 text-slate-200 overflow-hidden select-text max-w-full sm:max-w-none ${
        isResizing ? "select-none" : "transition-[width] duration-150 ease-out"
      }`}
    >
      {/* Header del Panel */}
      <div className="p-3 sm:p-4 border-b border-slate-700/60 flex items-center justify-between gap-2 bg-slate-800/40 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <i className="fa-solid fa-circle-info text-sm"></i>
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white leading-none truncate">
              Propiedades BIM
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              Inspector de Parámetros
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Selector de tamaño rápido (S / M / L / XL) */}
          <div
            className="flex items-center bg-slate-950/80 rounded-lg p-0.5 border border-slate-700/70"
            title={`Tamaño actual: ${width}px (Elige un preset o arrastra el borde)`}
          >
            <span className="text-[10px] text-slate-400 font-mono px-1 hidden sm:inline">
              {width}px
            </span>
            {Object.entries(PROPERTIES_WIDTH_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                type="button"
                onClick={() => onWidthChange && onWidthChange(preset.width)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                  Math.abs(width - preset.width) < 25
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
                title={preset.title}
              >
                {key}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 flex items-center justify-center transition-colors"
            title="Cerrar Inspector"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
      </div>

      {/* Contenido del Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {!selectedElement ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-dashed border-slate-700 flex items-center justify-center text-2xl text-slate-600">
              <i className="fa-solid fa-arrow-pointer animate-pulse"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-300">
                Ningún elemento seleccionado
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
                Haz clic en cualquier viga, columna, placa o zapata en el visor 3D para ver sus parámetros.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Cabecera del Elemento Seleccionado */}
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono uppercase"
                  style={{
                    backgroundColor: `${categoryMeta?.color || "#38bdf8"}20`,
                    color: categoryMeta?.color || "#38bdf8",
                    border: `1px solid ${categoryMeta?.color || "#38bdf8"}40`,
                  }}
                >
                  <i className={`fa-solid ${categoryMeta?.icon || "fa-cube"}`}></i>
                  {selectedElement.ifcType || "Elemento"}
                </span>

                <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/40">
                  ID: #{selectedElement.expressID}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-mono break-words leading-tight">
                  {selectedElement.name || selectedElement.description || "Sin Nombre"}
                </h3>
                {selectedElement.description && selectedElement.name !== selectedElement.description && (
                  <p className="text-xs text-cyan-400 font-mono mt-0.5 font-medium">
                    {selectedElement.description}
                  </p>
                )}
              </div>

              {/* Botones de Acción Rápida */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-700/40">
                <button
                  type="button"
                  onClick={onZoomToElement}
                  className="flex-1 py-1.5 px-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 rounded-lg text-xs font-medium text-blue-300 flex items-center justify-center gap-1.5 transition-colors"
                  title="Enfocar en Vista 3D"
                >
                  <i className="fa-solid fa-crosshairs text-[11px]"></i>
                  <span>Enfocar</span>
                </button>

                <button
                  type="button"
                  onClick={() => exportElementToJson(selectedElement)}
                  className="p-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/40 rounded-lg text-xs text-slate-300 hover:text-white transition-colors"
                  title="Exportar Elemento a JSON"
                >
                  <i className="fa-solid fa-code"></i>
                </button>

                <button
                  type="button"
                  onClick={() => exportElementToCsv(selectedElement)}
                  className="p-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/40 rounded-lg text-xs text-slate-300 hover:text-white transition-colors"
                  title="Exportar Elemento a CSV"
                >
                  <i className="fa-solid fa-file-csv text-emerald-400"></i>
                </button>
              </div>
            </div>

            {/* Atributos Básicos de Identidad */}
            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <i className="fa-solid fa-fingerprint text-slate-500 text-[11px]"></i>
                Identificación & IFC
              </h4>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-start justify-between gap-2 py-1 border-b border-slate-700/30">
                  <span className="text-slate-400 shrink-0">GlobalId:</span>
                  <button
                    type="button"
                    onClick={() => handleCopyGlobalId(selectedElement.globalId)}
                    className="font-mono text-slate-200 hover:text-cyan-400 text-right truncate flex items-center justify-end gap-1 flex-1 min-w-0 transition-colors"
                    title="Copiar GlobalId"
                  >
                    <span className="truncate">{selectedElement.globalId || "—"}</span>
                    <i
                      className={`fa-solid ${
                        copiedId ? "fa-check text-emerald-400" : "fa-copy text-slate-500"
                      } text-[10px] shrink-0`}
                    ></i>
                  </button>
                </div>

                {selectedElement.tag && (
                  <div className="flex items-start justify-between gap-2 py-1 border-b border-slate-700/30">
                    <span className="text-slate-400 shrink-0">Tag / Marca:</span>
                    <span className="font-mono text-slate-200 text-right truncate flex-1 min-w-0">
                      {selectedElement.tag}
                    </span>
                  </div>
                )}

                {selectedElement.objectType && (
                  <div className="flex items-start justify-between gap-2 py-1 border-b border-slate-700/30">
                    <span className="text-slate-400 shrink-0">ObjectType:</span>
                    <span className="font-mono text-slate-200 text-right truncate flex-1 min-w-0">
                      {selectedElement.objectType}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Property Sets (Psets) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-1">
                <i className="fa-solid fa-cubes-stacked text-slate-500 text-[11px]"></i>
                Property Sets ({selectedElement.psets?.length || 0})
              </h4>
              <input value={propertyFilter} onChange={(event) => setPropertyFilter(event.target.value)} placeholder="Buscar propiedad o valor…" className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white outline-none focus:border-cyan-500" />

              {!selectedElement.psets || selectedElement.psets.length === 0 ? (
                <div className="text-center py-4 bg-slate-800/30 rounded-xl border border-slate-700/30 text-xs text-slate-500">
                  Sin Property Sets adicionales definidos
                </div>
              ) : (
                filteredPsets.map((pset) => {
                  const isExpanded = expandedPsets[pset.name] !== false; // Abierto por defecto
                  return (
                    <div
                      key={pset.name}
                      className="bg-slate-800/40 rounded-xl border border-slate-700/40 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => togglePset(pset.name)}
                        className="w-full px-3 py-2 bg-slate-800/70 hover:bg-slate-800 text-left flex items-center justify-between text-xs font-semibold text-slate-300 transition-colors"
                      >
                        <span className="font-mono truncate flex-1 pr-2 text-cyan-300">
                          {pset.name}
                        </span>
                        <i
                          className={`fa-solid fa-chevron-down text-[10px] text-slate-500 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        ></i>
                      </button>

                      {isExpanded && (
                        <div className="p-2.5 space-y-1.5 text-xs font-mono">
                          {pset.properties.map((prop, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => copyProperty(prop.name, prop.value)}
                              className="flex w-full items-start justify-between gap-3 py-1 border-b border-slate-700/20 last:border-0 hover:bg-slate-700/20"
                              title="Copiar valor"
                            >
                              <span className="text-slate-400 text-[11px] truncate flex-1 min-w-[120px]">
                                {prop.name}:
                              </span>
                              <span
                                className="text-slate-200 text-[11px] text-right font-semibold break-words shrink-0 max-w-[65%]"
                                title={String(prop.value)}
                              >
                                {String(prop.value)} {copiedProperty === prop.name && <i className="fa-solid fa-check ml-1 text-emerald-400"></i>}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* Splitter / Resize Handle Izquierdo */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClickReset}
        className={`absolute top-0 left-0 w-3.5 h-full cursor-col-resize group z-30 select-none flex items-center justify-center transition-colors ${
          isResizing ? "bg-blue-500/30" : "hover:bg-blue-500/20"
        }`}
        title="Arrastra para cambiar el tamaño (Doble clic para alternar M / L)"
      >
        <div
          className={`w-1 h-12 rounded-full transition-all ${
            isResizing
              ? "bg-blue-400 scale-y-125 shadow-lg shadow-blue-500/50"
              : "bg-slate-600/70 group-hover:bg-blue-400"
          }`}
        />
        {/* Tooltip con indicador de ancho en vivo mientras se arrastra */}
        {isResizing && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-slate-900/95 border border-blue-500/60 rounded-md px-2.5 py-1 text-xs font-mono font-bold text-blue-300 shadow-2xl pointer-events-none whitespace-nowrap">
            {width} px
          </div>
        )}
      </div>

      {/* Overlay global para captura suave de mousemove sin pérdida de foco */}
      {isResizing && (
        <div className="fixed inset-0 z-50 cursor-col-resize select-none" />
      )}
    </aside>
  );
};
