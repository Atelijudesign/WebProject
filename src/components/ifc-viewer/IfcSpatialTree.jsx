import { useState, useMemo } from "react";
import { getCategoryMetadata } from "./ifcHelpers";

export const IfcSpatialTree = ({
  modelName = "Modelo Estructural",
  elementsList = [],
  categories = [],
  categoryVisibility = {},
  onToggleCategory,
  onIsolateCategory,
  onSelectElement,
  selectedExpressId,
}) => {
  const [expandedNodes, setExpandedNodes] = useState({
    root: true,
    "lvl-0": true,
    "lvl-1": true,
  });
  const [filterText, setFilterText] = useState("");

  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  // Construir jerarquía espacial organizada por disciplinas y niveles
  const treeData = useMemo(() => {
    if (!elementsList || elementsList.length === 0) return null;

    // Agrupar elementos por tipo
    const byType = {};
    elementsList.forEach((el) => {
      const t = el.ifcType || "OTROS";
      if (!byType[t]) byType[t] = [];
      byType[t].push(el);
    });

    // Crear estructura jerárquica con niveles lógicos de ingeniería estructural
    const levels = [
      {
        id: "lvl-foundations",
        name: "Cimentación y Fundaciones (Nivel 0.00)",
        icon: "fa-cubes-stacked",
        color: "text-amber-400",
        categories: ["IFCFOOTING", "IFCSLAB"].filter((cat) => byType[cat]?.length > 0),
      },
      {
        id: "lvl-columns",
        name: "Estructura Vertical (Columnas y Pilares)",
        icon: "fa-arrows-up-down",
        color: "text-blue-400",
        categories: ["IFCCOLUMN"].filter((cat) => byType[cat]?.length > 0),
      },
      {
        id: "lvl-beams",
        name: "Estructura Horizontal (Vigas y Marcos)",
        icon: "fa-grip-lines",
        color: "text-indigo-400",
        categories: ["IFCBEAM", "IFCMEMBER"].filter((cat) => byType[cat]?.length > 0),
      },
      {
        id: "lvl-plates",
        name: "Conexiones y Placas (Nudos Estructurales)",
        icon: "fa-square",
        color: "text-emerald-400",
        categories: ["IFCPLATE", "IFCFASTENER", "IFCMECHANICALFASTENER"].filter((cat) => byType[cat]?.length > 0),
      },
    ];

    // Recoger cualquier categoría no clasificada
    const classified = new Set(levels.flatMap((lvl) => lvl.categories));
    const otherCats = Object.keys(byType).filter((cat) => !classified.has(cat));
    if (otherCats.length > 0) {
      levels.push({
        id: "lvl-others",
        name: "Otros Componentes Estructurales",
        icon: "fa-shapes",
        color: "text-purple-400",
        categories: otherCats,
      });
    }

    return {
      projectName: (modelName || "Modelo IFC").replace(/\.ifc$/i, ""),
      totalElements: elementsList.length,
      levels,
      byType,
    };
  }, [elementsList, modelName]);

  if (!treeData) {
    return (
      <div className="p-4 text-center text-xs text-slate-400">
        No hay datos espaciales disponibles.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full select-none text-xs">
      {/* Buscador Rápido del Árbol */}
      <div className="relative mb-3">
        <i className="fa-solid fa-filter absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]"></i>
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filtrar por elemento o perfil..."
          className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        {filterText && (
          <button
            type="button"
            onClick={() => setFilterText("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-[10px]"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>

      {/* Árbol Jerárquico Desplegable */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
        {/* Nodo Raíz: Proyecto */}
        <div className="border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden">
          <div
            onClick={() => toggleNode("root")}
            className="p-2 bg-slate-800/60 hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <i
                className={`fa-solid fa-chevron-right text-[10px] text-slate-400 transition-transform ${
                  expandedNodes.root ? "rotate-90" : ""
                }`}
              ></i>
              <i className="fa-solid fa-diagram-project text-cyan-400 text-xs"></i>
              <span className="font-bold text-slate-200 uppercase tracking-wide">
                {treeData.projectName}
              </span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-400">
              {treeData.totalElements} elem.
            </span>
          </div>

          {/* Ramas: Niveles Estructurales */}
          {expandedNodes.root && (
            <div className="p-1 space-y-1.5 pl-2 border-t border-slate-800/80">
              {treeData.levels.map((lvl) => {
                const isLvlExpanded = !!expandedNodes[lvl.id];
                const totalInLvl = lvl.categories.reduce(
                  (acc, cat) => acc + (treeData.byType[cat]?.length || 0),
                  0
                );

                if (totalInLvl === 0) return null;

                return (
                  <div
                    key={lvl.id}
                    className="border border-slate-800/60 rounded-lg bg-slate-950/40 overflow-hidden"
                  >
                    {/* Encabezado del Nivel */}
                    <div
                      onClick={() => toggleNode(lvl.id)}
                      className="p-1.5 hover:bg-slate-800/50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <i
                          className={`fa-solid fa-chevron-right text-[9px] text-slate-500 transition-transform ${
                            isLvlExpanded ? "rotate-90" : ""
                          }`}
                        ></i>
                        <i className={`fa-solid ${lvl.icon} ${lvl.color} text-xs`}></i>
                        <span className="font-semibold text-slate-300 truncate">
                          {lvl.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {totalInLvl}
                      </span>
                    </div>

                    {/* Categorías dentro del Nivel */}
                    {isLvlExpanded && (
                      <div className="p-1 space-y-1 pl-4 border-t border-slate-800/50">
                        {lvl.categories.map((catKey) => {
                          const catItems = treeData.byType[catKey] || [];
                          const meta = getCategoryMetadata(catKey);
                          const isVisible = categoryVisibility[catKey] !== false;
                          const catNodeId = `${lvl.id}-${catKey}`;
                          const isCatExpanded = !!expandedNodes[catNodeId];

                          // Filtro de texto sobre elementos
                          const filteredItems = filterText
                            ? catItems.filter((it) =>
                                (it.name || "")
                                  .toLowerCase()
                                  .includes(filterText.toLowerCase())
                              )
                            : catItems;

                          if (filterText && filteredItems.length === 0) return null;

                          return (
                            <div
                              key={catKey}
                              className="rounded-md bg-slate-900/80 border border-slate-800/80 p-1"
                            >
                              <div className="flex items-center justify-between">
                                <div
                                  onClick={() => toggleNode(catNodeId)}
                                  className="flex items-center gap-1.5 cursor-pointer flex-1 min-w-0"
                                >
                                  <i
                                    className={`fa-solid fa-chevron-right text-[8px] text-slate-500 transition-transform ${
                                      isCatExpanded ? "rotate-90" : ""
                                    }`}
                                  ></i>
                                  <i
                                    className={`fa-solid ${meta.icon} text-[10px] ${meta.color}`}
                                  ></i>
                                  <span className="font-medium text-slate-300 truncate text-[11px]">
                                    {meta.label}
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-500">
                                    ({catItems.length})
                                  </span>
                                </div>

                                {/* Acciones de Visibilidad y Aislamiento */}
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => onIsolateCategory?.(catKey)}
                                    title="Aislar esta categoría"
                                    className="w-5 h-5 rounded hover:bg-blue-600/30 text-slate-400 hover:text-blue-300 flex items-center justify-center text-[10px] transition-colors"
                                  >
                                    <i className="fa-solid fa-bullseye"></i>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onToggleCategory?.(catKey)}
                                    title={isVisible ? "Ocultar" : "Mostrar"}
                                    className={`w-5 h-5 rounded flex items-center justify-center text-[10px] transition-colors ${
                                      isVisible
                                        ? "text-slate-300 hover:bg-slate-700"
                                        : "text-slate-600 hover:bg-slate-800"
                                    }`}
                                  >
                                    <i
                                      className={`fa-solid ${
                                        isVisible ? "fa-eye" : "fa-eye-slash"
                                      }`}
                                    ></i>
                                  </button>
                                </div>
                              </div>

                              {/* Lista de Elementos (desplegable) */}
                              {isCatExpanded && (
                                <div className="mt-1 space-y-0.5 max-h-48 overflow-y-auto pl-3 pr-1 border-t border-slate-800 pt-1 custom-scrollbar">
                                  {filteredItems.slice(0, 100).map((el) => {
                                    const isSelected = selectedExpressId === el.expressID;
                                    return (
                                      <div
                                        key={el.expressID}
                                        onClick={() => onSelectElement?.(el.expressID)}
                                        className={`px-1.5 py-0.5 rounded cursor-pointer flex items-center justify-between transition-colors ${
                                          isSelected
                                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                                            : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                                        }`}
                                      >
                                        <span className="truncate text-[10px]">
                                          {el.name || `#${el.expressID}`}
                                        </span>
                                        <span className="text-[9px] font-mono text-slate-500 shrink-0">
                                          #{el.expressID}
                                        </span>
                                      </div>
                                    );
                                  })}
                                  {filteredItems.length > 100 && (
                                    <div className="text-center py-1 text-[9px] text-slate-500 italic">
                                      + {filteredItems.length - 100} elementos más
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
