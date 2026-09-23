import { useState, useMemo } from "react";
import { getCategoryMetadata, STRUCTURAL_CATEGORIES } from "./ifcHelpers";

export const IfcElementsPalette = ({
  elementsList = [],
  categories = [],
  selectedExpressId = null,
  onSelectElement,
  onZoomToElement,
  modelName = "",
  isSearchIndexLimited = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("id-asc"); // 'id-asc' | 'id-desc' | 'name-asc' | 'category'
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 60;

  // Filtrado y ordenamiento de elementos
  const filteredAndSortedElements = useMemo(() => {
    if (!elementsList || elementsList.length === 0) return [];

    const term = searchTerm.trim().toLowerCase();

    // 1. Filtrado
    const filtered = elementsList.filter((el) => {
      // Filtro de categoría
      if (selectedCategory !== "ALL" && el.ifcType !== selectedCategory) {
        return false;
      }

      // Filtro de texto
      if (!term) return true;

      const idMatch = String(el.expressID || "").includes(term);
      const nameMatch = String(el.name || "").toLowerCase().includes(term);
      const descMatch = String(el.description || "").toLowerCase().includes(term);
      const tagMatch = String(el.tag || "").toLowerCase().includes(term);
      const typeMatch = String(el.ifcType || "").toLowerCase().includes(term);
      const globalIdMatch = String(el.globalId || "").toLowerCase().includes(term);

      return idMatch || nameMatch || descMatch || tagMatch || typeMatch || globalIdMatch;
    });

    // 2. Ordenamiento
    return filtered.sort((a, b) => {
      if (sortBy === "id-asc") return (a.expressID || 0) - (b.expressID || 0);
      if (sortBy === "id-desc") return (b.expressID || 0) - (a.expressID || 0);
      if (sortBy === "name-asc") {
        const nameA = String(a.name || a.ifcType || "");
        const nameB = String(b.name || b.ifcType || "");
        return nameA.localeCompare(nameB, "es", { numeric: true });
      }
      if (sortBy === "category") {
        const catA = String(a.ifcType || "");
        const catB = String(b.ifcType || "");
        return catA.localeCompare(catB);
      }
      return 0;
    });
  }, [elementsList, searchTerm, selectedCategory, sortBy]);

  // Resumen de conteo por categoría para los chips
  const categoryCounts = useMemo(() => {
    const counts = {};
    elementsList.forEach((el) => {
      const type = el.ifcType || "OTROS";
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [elementsList]);

  // Elementos visibles según la página actual
  const visibleCount = page * ITEMS_PER_PAGE;
  const visibleElements = useMemo(() => {
    return filteredAndSortedElements.slice(0, visibleCount);
  }, [filteredAndSortedElements, visibleCount]);

  const hasMore = visibleCount < filteredAndSortedElements.length;

  const handleSelect = (el) => {
    if (onSelectElement) {
      onSelectElement(el);
    }
  };

  const handleZoom = (e, el) => {
    e.stopPropagation();
    if (onSelectElement) {
      onSelectElement(el);
    }
    if (onZoomToElement) {
      onZoomToElement();
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Encabezado y Estadísticas Bento */}
      <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <i className="fa-solid fa-shapes text-sm"></i>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Paleta de Elementos IFC
              </h3>
              <p className="text-[11px] text-slate-400">
                {elementsList.length.toLocaleString("es-CL")} elementos reconocidos en {categories.length} tipos
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              {filteredAndSortedElements.length} mostrados
            </span>
          </div>
        </div>

        {isSearchIndexLimited && (
          <div className="mt-2 text-[10px] text-amber-300 bg-amber-950/50 border border-amber-500/30 rounded-lg p-1.5 flex items-center gap-1.5">
            <i className="fa-solid fa-triangle-exclamation text-amber-400"></i>
            <span>Índice limitado para optimizar memoria en modelos masivos.</span>
          </div>
        )}
      </div>

      {/* Buscador & Controles */}
      <div className="space-y-2">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por Express ID (#104), viga, columna, perfil..."
            className="w-full pl-8 pr-8 py-2 bg-slate-800/80 border border-slate-700/70 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              title="Limpiar búsqueda"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          )}
        </div>

        {/* Barra de Ordenamiento */}
        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-arrow-down-short-wide text-[10px] text-cyan-400"></i>
            <span>Ordenar por:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800 border border-slate-700/70 rounded-lg px-2 py-1 text-xs text-slate-200 outline-none focus:border-cyan-500"
          >
            <option value="id-asc">Express ID (Menor a Mayor)</option>
            <option value="id-desc">Express ID (Mayor a Menor)</option>
            <option value="name-asc">Nombre / Perfil (A-Z)</option>
            <option value="category">Categoría Estructural</option>
          </select>
        </div>

        {/* Chips de Categorías Horizontales con Desplazamiento */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px]">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("ALL");
              setPage(1);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === "ALL"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30"
                : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60"
            }`}
          >
            <span>Todos</span>
            <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-black/20">
              {elementsList.length}
            </span>
          </button>

          {categories.map((cat) => {
            const meta = getCategoryMetadata(cat.type);
            const isCurrent = selectedCategory === cat.type;
            const count = categoryCounts[cat.type] || cat.count || 0;

            return (
              <button
                key={cat.type}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.type);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30"
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: meta.color }}
                ></span>
                <span>{meta.name}</span>
                <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-black/20">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de Elementos */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar max-h-[calc(100vh-340px)]">
        {visibleElements.map((el) => {
          const isSelected = selectedExpressId === el.expressID;
          const meta = getCategoryMetadata(el.ifcType);

          return (
            <div
              key={el.expressID}
              onClick={() => handleSelect(el)}
              className={`group relative p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                isSelected
                  ? "bg-cyan-950/60 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50"
                  : "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600 text-slate-300 hover:text-white"
              }`}
            >
              {/* Indicador de selección activa */}
              {isSelected && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-cyan-400 rounded-r-full shadow-md shadow-cyan-400"></div>
              )}

              {/* Icono de Categoría */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: `${meta.color}15`,
                  borderColor: `${meta.color}40`,
                  color: meta.color,
                }}
                title={meta.name}
              >
                <i className={`fa-solid ${meta.icon} text-xs`}></i>
              </div>

              {/* Información Principal del Elemento */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold font-mono truncate text-white">
                    {el.name || el.description || `${meta.name} #${el.expressID}`}
                  </span>
                  {isSelected && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-cyan-500 text-slate-950 shrink-0">
                      Seleccionado
                    </span>
                  )}
                </div>

                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2 mt-0.5 truncate">
                  <span className="text-cyan-300 font-semibold">#{el.expressID}</span>
                  <span>•</span>
                  <span>{meta.name}</span>
                  {el.tag && (
                    <>
                      <span>•</span>
                      <span className="text-slate-300">Tag: {el.tag}</span>
                    </>
                  )}
                  {el.level && (
                    <>
                      <span>•</span>
                      <span className="text-slate-400">{el.level}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Botón de Enfoque Rápido 3D */}
              <button
                type="button"
                onClick={(e) => handleZoom(e, el)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/60"
                }`}
                title="Enfocar y centrar en el modelo 3D (F)"
              >
                <i className="fa-solid fa-crosshairs text-xs"></i>
              </button>
            </div>
          );
        })}

        {/* Estado Vacío */}
        {filteredAndSortedElements.length === 0 && (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-800 text-slate-500">
            <i className="fa-solid fa-filter-circle-xmark text-2xl mb-2 text-slate-600"></i>
            <p className="text-xs font-semibold text-slate-400">
              No se encontraron elementos coincidentes
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Prueba modificando el término de búsqueda o seleccionando otra categoría.
            </p>
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("ALL");
                }}
                className="mt-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs rounded-lg transition-colors border border-slate-700"
              >
                Restablecer filtros
              </button>
            )}
          </div>
        )}

        {/* Botón Cargar Más */}
        {hasMore && (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="w-full py-2 px-3 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <span>Mostrar siguientes {Math.min(ITEMS_PER_PAGE, filteredAndSortedElements.length - visibleCount)} elementos...</span>
              <span className="text-[10px] font-mono text-cyan-400">
                ({visibleCount} de {filteredAndSortedElements.length})
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
