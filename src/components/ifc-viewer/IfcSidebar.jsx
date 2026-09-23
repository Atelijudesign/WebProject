import { useState, useMemo } from "react";
import { getCategoryMetadata } from "./ifcHelpers";
import { IfcSpatialTree } from "./IfcSpatialTree";
import { IfcBcfManager } from "./IfcBcfManager";
import { IfcElementsPalette } from "./IfcElementsPalette";

export const SIDEBAR_WIDTH_PRESETS = {
  S: { label: "S", width: 380, title: "Compacto (380px)" },
  M: { label: "M", width: 480, title: "Estándar (480px)" },
  L: { label: "L", width: 600, title: "Amplio (600px)" },
  XL: { label: "XL", width: 750, title: "Máximo (750px)" },
};

export const IfcSidebar = ({
  isOpen,
  activeTab,
  onTabChange,
  onClose,
  width = 480,
  onWidthChange,
  categories,
  categoryVisibility,
  onToggleCategory,
  onIsolateCategory,
  onShowAllCategories,
  onHideAllCategories,
  elementsList,
  onSelectElementFromSearch,
  onZoomToElement,
  selectedExpressId,
  measurements,
  onRemoveMeasurement,
  onClearAllMeasurements,
  clippingConfig,
  onUpdateClipping,
  onResetClipping,
  modelBounds,
  modelName,
  bcfIssues = [],
  onAddBcfIssue,
  onUpdateBcfIssueStatus,
  onDeleteIssue,
  onRestoreBcfViewpoint,
  selectedElement,
  onCaptureViewpoint,
  onImportBcfIssues,
  autoCreateBcfTrigger = 0,
  isSearchIndexLimited = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isResizing, setIsResizing] = useState(false);

  // Filtrado de elementos
  const filteredElements = useMemo(() => {
    if (!elementsList || elementsList.length === 0) return [];
    const term = searchTerm.trim().toLowerCase();

    return elementsList.filter((el) => {
      const matchesCategory =
        categoryFilter === "ALL" || el.ifcType === categoryFilter;
      if (!matchesCategory) return false;

      if (!term) return true;

      const nameMatch = String(el.name || "").toLowerCase().includes(term);
      const descMatch = String(el.description || "").toLowerCase().includes(term);
      const tagMatch = String(el.tag || "").toLowerCase().includes(term);
      const typeMatch = String(el.ifcType || "").toLowerCase().includes(term);
      const idMatch = String(el.expressID || "").includes(term);
      const globalIdMatch = String(el.globalId || "").toLowerCase().includes(term);
      const levelMatch = String(el.level || el.storey || "").toLowerCase().includes(term);
      const materialMatch = String(el.material || "").toLowerCase().includes(term);

      return nameMatch || descMatch || tagMatch || typeMatch || idMatch || globalIdMatch || levelMatch || materialMatch;
    });
  }, [elementsList, searchTerm, categoryFilter]);

  // Manejador de redimensionamiento arrastrable (Splitter derecho)
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const minW = 340;
      const maxW = Math.min(window.innerWidth * 0.55, 900);
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
      onWidthChange(width === 480 ? 600 : 480);
    }
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Panel de Control BIM"
      style={{ width: typeof window !== "undefined" && window.innerWidth < 640 ? "100%" : `${width}px` }}
      className={`relative shrink-0 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/60 shadow-2xl flex flex-col h-full z-20 text-slate-200 overflow-hidden max-w-full sm:max-w-none ${
        isResizing ? "select-none" : "transition-[width] duration-150 ease-out"
      }`}
    >
      {/* Header y Selector de Pestañas */}
      <div className="border-b border-slate-700/60 bg-slate-800/40 select-none">
        <div className="p-2.5 sm:p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 truncate">
              Panel BIM Estructural
            </span>
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
              {Object.entries(SIDEBAR_WIDTH_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onWidthChange && onWidthChange(preset.width)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    Math.abs(width - preset.width) < 25
                      ? "bg-cyan-500 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                  title={preset.title}
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Botón de Cierre */}
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 flex items-center justify-center transition-colors"
              title="Cerrar Panel Lateral"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        </div>

        {/* Tab Navigation (6 pestañas con espaciado amplio y tipografía legible) */}
        <div className="grid grid-cols-6 p-1 bg-slate-900/90 gap-1 border-t border-slate-800">
          <button
            type="button"
            onClick={() => onTabChange("tree")}
            title="Árbol Espacial IFC (Niveles y Pisos)"
            className={`py-2 px-1 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
              activeTab === "tree"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30 font-bold"
                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <i className="fa-solid fa-sitemap text-xs md:text-sm"></i>
            <span className="text-[10px] md:text-[11px] truncate tracking-tight">Árbol</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("elements")}
            title="Paleta e Inventario de Elementos IFC"
            className={`py-2 px-1 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
              activeTab === "elements" || activeTab === "search" || activeTab === "palette"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <i className="fa-solid fa-shapes text-xs md:text-sm"></i>
            <span className="text-[10px] md:text-[11px] truncate tracking-tight">Paleta</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("categories")}
            title="Categorías y Clases IFC"
            className={`py-2 px-1 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
              activeTab === "categories"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <i className="fa-solid fa-layer-group text-xs md:text-sm"></i>
            <span className="text-[10px] md:text-[11px] truncate tracking-tight">Clases</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("bcf")}
            title="Gestor de Incidencias y Observaciones BCF"
            className={`py-2 px-1 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
              activeTab === "bcf"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold"
                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <i className="fa-solid fa-thumbtack text-xs md:text-sm"></i>
            <span className="text-[10px] md:text-[11px] truncate tracking-tight">BCF</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("measurements")}
            title="Mediciones 3D (Distancia y Área)"
            className={`py-2 px-1 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
              activeTab === "measurements"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <i className="fa-solid fa-ruler-combined text-xs md:text-sm"></i>
            <span className="text-[10px] md:text-[11px] truncate tracking-tight">Medir</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("section")}
            title="Planos de Corte / Sección"
            className={`py-2 px-1 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
              activeTab === "section"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <i className="fa-solid fa-scissors text-xs md:text-sm"></i>
            <span className="text-[10px] md:text-[11px] truncate tracking-tight">Cortes</span>
          </button>
        </div>
      </div>

      {/* Contenido según la pestaña activa */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {/* ========================================================= */}
        {/* PESTAÑA: ÁRBOL ESPACIAL IFC */}
        {/* ========================================================= */}
        {activeTab === "tree" && (
          <IfcSpatialTree
            modelName={modelName}
            elementsList={elementsList}
            categories={categories}
            categoryVisibility={categoryVisibility}
            onToggleCategory={onToggleCategory}
            onIsolateCategory={onIsolateCategory}
            onSelectElement={onSelectElementFromSearch}
            selectedExpressId={selectedExpressId}
          />
        )}

        {/* ========================================================= */}
        {/* PESTAÑA: CATEGORÍAS */}
        {/* ========================================================= */}
        {activeTab === "categories" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Categorías IFC</h3>
                <p className="text-xs text-slate-400">
                  {categories.length} tipos estructurales identificados
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onShowAllCategories}
                  className="px-2 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700/60 transition-colors"
                  title="Mostrar Todos los Elementos"
                >
                  Ver Todo
                </button>
                <button
                  type="button"
                  onClick={onHideAllCategories}
                  className="px-2 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 rounded border border-slate-700/60 transition-colors"
                  title="Ocultar Todos los Elementos"
                >
                  Ocultar
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {categories.map((cat) => {
                const meta = getCategoryMetadata(cat.type);
                const isVisible = categoryVisibility[cat.type] !== false;

                return (
                  <div
                    key={cat.type}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isVisible
                        ? "bg-slate-800/50 border-slate-700/60 text-slate-200"
                        : "bg-slate-900/60 border-slate-800 text-slate-500 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${meta.color}20`,
                          color: meta.color,
                        }}
                      >
                        <i className={`fa-solid ${meta.icon} text-xs`}></i>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">
                          {meta.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                          <span>{cat.type}</span>
                          <span>•</span>
                          <span className="text-slate-300 font-semibold">
                            {cat.count} {cat.count === 1 ? "elem." : "elems."}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onIsolateCategory(cat.type)}
                        className="px-1.5 py-1 text-[10px] font-semibold text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                        title={`Aislar solo ${meta.name}`}
                      >
                        Solo
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleCategory(cat.type)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          isVisible
                            ? "text-cyan-400 hover:bg-cyan-500/20"
                            : "text-slate-600 hover:text-slate-400"
                        }`}
                        title={isVisible ? "Ocultar Categoría" : "Mostrar Categoría"}
                      >
                        <i
                          className={`fa-solid ${
                            isVisible ? "fa-eye" : "fa-eye-slash"
                          } text-xs`}
                        ></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA: PALETA DE ELEMENTOS IFC */}
        {/* ========================================================= */}
        {(activeTab === "elements" || activeTab === "search" || activeTab === "palette") && (
          <IfcElementsPalette
            elementsList={elementsList}
            categories={categories}
            selectedExpressId={selectedExpressId}
            onSelectElement={onSelectElementFromSearch}
            onZoomToElement={onZoomToElement}
            modelName={modelName}
            isSearchIndexLimited={isSearchIndexLimited}
          />
        )}

        {/* ========================================================= */}
        {/* PESTAÑA: INCIDENCIAS BCF */}
        {/* ========================================================= */}
        {activeTab === "bcf" && (
          <IfcBcfManager
            issues={bcfIssues}
            onAddIssue={onAddBcfIssue}
            onUpdateIssueStatus={onUpdateBcfIssueStatus}
            onDeleteIssue={onDeleteIssue}
            onRestoreViewpoint={onRestoreBcfViewpoint}
            selectedElement={selectedElement}
            onCaptureViewpoint={onCaptureViewpoint}
            onImportIssues={onImportBcfIssues}
            clippingConfig={clippingConfig}
            autoCreateTrigger={autoCreateBcfTrigger}
          />
        )}

        {/* ========================================================= */}
        {/* PESTAÑA: MEDICIONES */}
        {/* ========================================================= */}
        {activeTab === "measurements" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Mediciones 3D</h3>
                <p className="text-xs text-slate-400">
                  Distancias y áreas medidas sobre el modelo
                </p>
              </div>

              {measurements.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAllMeasurements}
                  className="px-2 py-1 text-[11px] font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded border border-rose-500/30 transition-colors"
                >
                  Borrar Todo
                </button>
              )}
            </div>

            {/* Instrucciones de Uso */}
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <i className="fa-solid fa-lightbulb"></i>
                <span>¿Cómo medir?</span>
              </div>
              <ul className="space-y-1 text-slate-400 text-[11px] pl-4 list-disc">
                <li>
                  <strong className="text-slate-200">Distancia (M):</strong> Haz clic en el punto de inicio y luego en el punto final sobre la geometría.
                </li>
                <li>
                  <strong className="text-slate-200">Área (A):</strong> Haz clic en 3 o más vértices para formar un polígono plano 3D.
                </li>
              </ul>
            </div>

            {/* Lista de Mediciones Realizadas */}
            <div className="space-y-2">
              {measurements.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No hay mediciones activas. Activa la herramienta de regla o área en la barra inferior.
                </div>
              ) : (
                measurements.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-cyan-300">
                        <i
                          className={`fa-solid ${
                            m.type === "area" ? "fa-draw-polygon" : "fa-ruler"
                          }`}
                        ></i>
                        {m.type === "area" ? `Área #${idx + 1}` : `Distancia #${idx + 1}`}
                      </span>

                      <button
                        type="button"
                        onClick={() => onRemoveMeasurement(m.id)}
                        className="text-slate-400 hover:text-rose-400 p-1"
                        title="Eliminar Medición"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>

                    {m.type === "distance" ? (
                      <div className="space-y-1 font-mono text-[11px]">
                        <div className="text-sm font-bold text-white flex items-baseline justify-between">
                          <span>Longitud 3D:</span>
                          <span className="text-cyan-400">{m.distance.toFixed(3)} m</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 pt-1 text-slate-400 border-t border-slate-700/40">
                          <div>ΔX: {m.dx.toFixed(3)}m</div>
                          <div>ΔY: {m.dy.toFixed(3)}m</div>
                          <div>ΔZ: {m.dz.toFixed(3)}m</div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 font-mono text-[11px]">
                        <div className="text-sm font-bold text-white flex items-baseline justify-between">
                          <span>Área Planar:</span>
                          <span className="text-emerald-400">{m.area.toFixed(3)} m²</span>
                        </div>
                        <div className="text-slate-400 flex justify-between pt-1 border-t border-slate-700/40">
                          <span>Perímetro:</span>
                          <span>{m.perimeter.toFixed(3)} m</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA: PLANOS DE SECCIÓN */}
        {/* ========================================================= */}
        {activeTab === "section" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Planos de Corte</h3>
                <p className="text-xs text-slate-400">
                  Secciones dinámicas en los 3 ejes cartesianos
                </p>
              </div>

              <button
                type="button"
                onClick={onResetClipping}
                className="px-2 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700/60 transition-colors"
              >
                Reiniciar
              </button>
            </div>

            {/* Master Toggle */}
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center justify-between">
              <span className="text-xs font-bold text-white">Habilitar Cortes</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={clippingConfig.enabled}
                  onChange={(e) =>
                    onUpdateClipping({ enabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => onUpdateClipping({ enabled: true, x: { ...clippingConfig.x, enabled: true, position: ((modelBounds?.x?.min || 0) + (modelBounds?.x?.max || 0)) / 2 } })} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200">Centrar corte X</button>
              <button type="button" onClick={() => onUpdateClipping({ enabled: true, z: { ...clippingConfig.z, enabled: true, position: ((modelBounds?.z?.min || 0) + (modelBounds?.z?.max || 0)) / 2 } })} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200">Centrar corte Z</button>
            </div>

            {/* Controles por Eje */}
            {["x", "y", "z"].map((axis) => {
              const axisLabel = axis.toUpperCase();
              const axisName =
                axis === "x"
                  ? "Corte Transversal (X)"
                  : axis === "y"
                  ? "Corte en Elevación (Y)"
                  : "Corte Longitudinal (Z)";
              const isAxisEnabled = clippingConfig[axis].enabled;
              const pos = clippingConfig[axis].position;
              const bounds = modelBounds?.[axis] || { min: -50, max: 50 };

              return (
                <div
                  key={axis}
                  className={`p-3 rounded-xl border space-y-2.5 transition-all ${
                    isAxisEnabled
                      ? "bg-slate-800/50 border-amber-500/40"
                      : "bg-slate-800/20 border-slate-700/40 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center ${
                          axis === "x"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : axis === "y"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {axisLabel}
                      </span>
                      <span className="text-xs font-bold text-slate-200">
                        {axisName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateClipping({
                            [axis]: {
                              ...clippingConfig[axis],
                              inverted: !clippingConfig[axis].inverted,
                            },
                          })
                        }
                        className={`p-1 rounded text-xs transition-colors ${
                          clippingConfig[axis].inverted
                            ? "bg-amber-500/20 text-amber-400"
                            : "text-slate-400 hover:text-white"
                        }`}
                        title="Invertir Dirección de Corte"
                      >
                        <i className="fa-solid fa-arrows-rotate text-[11px]"></i>
                      </button>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAxisEnabled}
                          onChange={(e) =>
                            onUpdateClipping({
                              [axis]: {
                                ...clippingConfig[axis],
                                enabled: e.target.checked,
                              },
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-7 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  </div>

                  {isAxisEnabled && (
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span>Posición:</span>
                        <span className="text-amber-400 font-bold">
                          {pos.toFixed(2)} m
                        </span>
                      </div>
                      <input
                        type="range"
                        min={bounds.min}
                        max={bounds.max}
                        step={0.1}
                        value={pos}
                        onChange={(e) =>
                          onUpdateClipping({
                            [axis]: {
                              ...clippingConfig[axis],
                              position: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="w-full accent-amber-500 bg-slate-700 h-1.5 rounded-lg cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Splitter / Resize Handle Derecho */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClickReset}
        className={`absolute top-0 right-0 w-3.5 h-full cursor-col-resize group z-30 select-none flex items-center justify-center transition-colors ${
          isResizing ? "bg-cyan-500/30" : "hover:bg-cyan-500/20"
        }`}
        title="Arrastra para cambiar el tamaño (Doble clic para alternar M / L)"
      >
        <div
          className={`w-1 h-12 rounded-full transition-all ${
            isResizing
              ? "bg-cyan-400 scale-y-125 shadow-lg shadow-cyan-500/50"
              : "bg-slate-600/70 group-hover:bg-cyan-400"
          }`}
        />
        {/* Tooltip con indicador de ancho en vivo mientras se arrastra */}
        {isResizing && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 bg-slate-900/95 border border-cyan-500/60 rounded-md px-2.5 py-1 text-xs font-mono font-bold text-cyan-300 shadow-2xl pointer-events-none whitespace-nowrap">
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
