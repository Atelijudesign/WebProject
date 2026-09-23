import { useState, useMemo, useEffect } from "react";
import {
  buildQuantitySummary,
  exportQuantitySummaryToCsv,
  compareQuantitySummaries,
  getCategoryMetadata,
  downloadFile,
} from "./ifcHelpers";

export function IfcQuantitiesModal({
  isOpen,
  onClose,
  elementsList = [],
  categories = [],
  modelName = "Modelo",
  modelBounds = null,
  loadTimings = null,
  initialTab = "summary", // 'summary' | 'compare' | 'metrics'
  comparison = null,
  onSetBaseline = null,
  baselineModelName = null,
  baselineInventory = null,
}) {
  const [activeTab, setActiveTab] = useState(initialTab || "summary");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const quantitySummary = useMemo(
    () => buildQuantitySummary(elementsList),
    [elementsList]
  );

  const effectiveComparison = useMemo(() => {
    if (comparison && comparison.length > 0) return comparison;
    if (baselineInventory && baselineInventory.length > 0) {
      return compareQuantitySummaries(baselineInventory, elementsList);
    }
    return [];
  }, [comparison, baselineInventory, elementsList]);

  const totalElements = elementsList.length;

  const filteredSummary = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return quantitySummary;
    return quantitySummary.filter(
      (item) =>
        item.label.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term)
    );
  }, [quantitySummary, searchTerm]);

  // Dimensiones y volumen de la caja envolvente
  const boundsMetrics = useMemo(() => {
    if (!modelBounds) return null;
    const xMin = modelBounds.x?.min ?? modelBounds.min?.x ?? 0;
    const xMax = modelBounds.x?.max ?? modelBounds.max?.x ?? 0;
    const yMin = modelBounds.y?.min ?? modelBounds.min?.y ?? 0;
    const yMax = modelBounds.y?.max ?? modelBounds.max?.y ?? 0;
    const zMin = modelBounds.z?.min ?? modelBounds.min?.z ?? 0;
    const zMax = modelBounds.z?.max ?? modelBounds.max?.z ?? 0;
    const dx = Math.abs(xMax - xMin);
    const dy = Math.abs(yMax - yMin);
    const dz = Math.abs(zMax - zMin);
    const volume = dx * dy * dz;
    return {
      dx: dx.toFixed(2),
      dy: dy.toFixed(2),
      dz: dz.toFixed(2),
      volume: volume > 0 ? volume.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "—",
    };
  }, [modelBounds]);

  const handleExportDetailedCsv = () => {
    const rows = [
      ["Tipo IFC", "Categoría", "Cantidad", "Porcentaje del Modelo"],
    ];
    quantitySummary.forEach((g) => {
      const pct = totalElements > 0 ? ((g.count / totalElements) * 100).toFixed(1) : "0.0";
      rows.push([g.type, `"${g.label}"`, g.count, `${pct}%`]);
    });
    const csv = "\uFEFF" + rows.map((r) => r.join(",")).join("\n");
    downloadFile(
      csv,
      `${(modelName || "modelo").replace(/\.ifc$/i, "")}_Cubicacion_Categorias.csv`,
      "text/csv;charset=utf-8;"
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quantities-modal-title"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-cyan-950/30">
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <i className="fa-solid fa-chart-pie text-xl"></i>
            </div>
            <div>
              <h2 id="quantities-modal-title" className="text-base font-bold text-white">
                Cubicación, Comparación y Métricas BIM
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {modelName} • {totalElements.toLocaleString("es-CL")} elementos indexados
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Cerrar modal de cantidades"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Pestañas internas */}
        <div className="flex border-b border-slate-700/80 bg-slate-950/50 px-6">
          <button
            type="button"
            onClick={() => setActiveTab("summary")}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors ${
              activeTab === "summary"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <i className="fa-solid fa-table-list text-xs"></i>
            <span>Resumen de Cubicación</span>
            <span className="ml-1 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
              {quantitySummary.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("compare")}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors ${
              activeTab === "compare"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <i className="fa-solid fa-code-compare text-xs"></i>
            <span>Comparar Versiones</span>
            {comparison && comparison.length > 0 && (
              <span className="ml-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 font-bold">
                {comparison.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("metrics")}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors ${
              activeTab === "metrics"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <i className="fa-solid fa-gauge-high text-xs"></i>
            <span>Métricas del Modelo</span>
          </button>
        </div>

        {/* Contenido de la pestaña */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 [scrollbar-width:thin]">
          {/* TAB 1: RESUMEN DE CUBICACIÓN */}
          {activeTab === "summary" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-sm">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"></i>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar clase IFC o categoría..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportDetailedCsv}
                    disabled={quantitySummary.length === 0}
                    className="flex items-center gap-2 rounded-xl border border-emerald-600/50 bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-900/50 transition disabled:opacity-40"
                  >
                    <i className="fa-solid fa-file-csv"></i>
                    <span>Exportar CSV</span>
                  </button>
                </div>
              </div>

              {/* Lista / Tabla de Cubicación */}
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="border-b border-slate-800 bg-slate-900/80 text-[10px] uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="py-3 px-4">Categoría / Clase IFC</th>
                      <th className="py-3 px-4 text-center">Conteo</th>
                      <th className="py-3 px-4">Distribución</th>
                      <th className="py-3 px-4 text-right">% Modelo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredSummary.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500">
                          No se encontraron categorías con ese criterio de búsqueda.
                        </td>
                      </tr>
                    ) : (
                      filteredSummary.map((group) => {
                        const meta = getCategoryMetadata(group.type);
                        const pct =
                          totalElements > 0
                            ? ((group.count / totalElements) * 100).toFixed(1)
                            : "0.0";

                        return (
                          <tr
                            key={group.type}
                            className="hover:bg-slate-800/40 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="flex h-7 w-7 items-center justify-center rounded-lg text-xs"
                                  style={{
                                    backgroundColor: `${meta.color}20`,
                                    color: meta.color,
                                    border: `1px solid ${meta.color}40`,
                                  }}
                                >
                                  <i className={`fa-solid ${meta.icon}`}></i>
                                </div>
                                <div>
                                  <span className="font-bold text-white block">
                                    {group.label}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400">
                                    {group.type}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-bold text-white">
                              {group.count.toLocaleString("es-CL")}
                            </td>
                            <td className="py-3 px-4">
                              <div className="h-2 w-full min-w-[80px] overflow-hidden rounded-full bg-slate-800">
                                <div
                                  className="h-full transition-all"
                                  style={{
                                    width: `${pct}%`,
                                    backgroundColor: meta.color || "#06b6d4",
                                  }}
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-semibold text-cyan-300">
                              {pct}%
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: COMPARAR VERSIONES */}
          {activeTab === "compare" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Versión de Referencia (Línea Base)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {baselineModelName
                      ? `Comparando contra: ${baselineModelName}`
                      : "No se ha fijado una línea base manual; se compara con el modelo previo en la sesión."}
                  </p>
                </div>
                {onSetBaseline && (
                  <button
                    type="button"
                    onClick={() => onSetBaseline?.(elementsList, modelName)}
                    className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-900/50 transition"
                  >
                    <i className="fa-solid fa-thumbtack"></i>
                    <span>Fijar Modelo Actual como Base</span>
                  </button>
                )}
              </div>

              {effectiveComparison && effectiveComparison.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Comparación de Inventario entre Revisiones
                  </h4>
                  <div className="divide-y divide-slate-800 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
                    {effectiveComparison.map((item) => {
                      const isAddition = item.difference > 0;
                      return (
                        <div
                          key={item.type}
                          className="flex items-center justify-between p-3 hover:bg-slate-900/60 transition"
                        >
                          <div>
                            <strong className="text-xs text-white block">
                              {item.label}
                            </strong>
                            <span className="text-[10px] font-mono text-slate-500">
                              {item.type} • Previo: {item.previousCount} → Actual: {item.currentCount}
                            </span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono font-bold ${
                              isAddition
                                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40"
                                : "bg-rose-950/80 text-rose-400 border border-rose-500/40"
                            }`}
                          >
                            <i
                              className={`fa-solid ${
                                isAddition ? "fa-plus" : "fa-minus"
                              } text-[10px]`}
                            ></i>
                            <span>{isAddition ? `+${item.difference}` : item.difference}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-cyan-400">
                    <i className="fa-solid fa-code-compare text-xl"></i>
                  </div>
                  <strong className="text-sm font-bold text-white block">
                    No hay cambios o no hay modelo de comparación
                  </strong>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                    Carga un modelo diferente o pulsa "Fijar Modelo Actual como Base" para comparar cambios cuando importes una nueva versión del IFC.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MÉTRICAS DEL MODELO */}
          {activeTab === "metrics" && (
            <div className="space-y-4">
              {/* Tarjetas KPI */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-center">
                  <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Elementos
                  </span>
                  <strong className="mt-1 block text-xl font-mono font-bold text-cyan-400">
                    {totalElements.toLocaleString("es-CL")}
                  </strong>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-center">
                  <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Categorías
                  </span>
                  <strong className="mt-1 block text-xl font-mono font-bold text-blue-400">
                    {quantitySummary.length}
                  </strong>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-center">
                  <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Volumen Envolvente
                  </span>
                  <strong className="mt-1 block text-xl font-mono font-bold text-emerald-400">
                    {boundsMetrics?.volume || "—"} m³
                  </strong>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-center">
                  <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Carga Geometría
                  </span>
                  <strong className="mt-1 block text-xl font-mono font-bold text-amber-400">
                    {loadTimings?.geometryReadyMs
                      ? `${(loadTimings.geometryReadyMs / 1000).toFixed(1)}s`
                      : "—"}
                  </strong>
                </div>
              </div>

              {/* Dimensiones de la caja delimitadora (BBox) */}
              {boundsMetrics && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-cube text-cyan-400"></i>
                    Dimensiones de la Envolvente (Bounding Box)
                  </h4>
                  <div className="grid grid-cols-3 gap-3 pt-2 text-center font-mono">
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Ancho (X)</span>
                      <strong className="text-sm text-slate-200">{boundsMetrics.dx} m</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Altura (Y)</span>
                      <strong className="text-sm text-slate-200">{boundsMetrics.dy} m</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Longitud (Z)</span>
                      <strong className="text-sm text-slate-200">{boundsMetrics.dz} m</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Tiempos de indexación */}
              {loadTimings && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 text-xs">
                  <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-stopwatch text-cyan-400"></i>
                    Tiempos de Procesamiento Local
                  </h4>
                  <div className="space-y-1.5 text-slate-400">
                    <div className="flex justify-between">
                      <span>Carga y conversión inicial:</span>
                      <strong className="text-slate-200 font-mono">
                        {loadTimings.dataReadyMs ? `${(loadTimings.dataReadyMs / 1000).toFixed(2)}s` : "—"}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Generación de Geometría 3D:</span>
                      <strong className="text-slate-200 font-mono">
                        {loadTimings.geometryReadyMs ? `${(loadTimings.geometryReadyMs / 1000).toFixed(2)}s` : "—"}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Indexación de Datos BIM y Psets:</span>
                      <strong className="text-slate-200 font-mono">
                        {loadTimings.indexReadyMs ? `${(loadTimings.indexReadyMs / 1000).toFixed(2)}s` : "—"}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pie de página */}
        <div className="flex items-center justify-between border-t border-slate-700 px-6 py-3 bg-slate-900/80 rounded-b-2xl">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <i className="fa-solid fa-circle-info text-cyan-400"></i>
            Datos calculados en memoria sin enviar archivos a servidores externos
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
