import {
  exportElementToJson,
  exportElementToCsv,
  exportElementsListToCsv,
  exportElementsListToJson,
  downloadFile,
  buildQuantitySummary,
  exportQuantitySummaryToCsv,
} from "./ifcHelpers";

export const IfcExportModal = ({
  isOpen,
  onClose,
  selectedElement,
  elementsList,
  measurements,
  modelName,
}) => {
  if (!isOpen) return null;
  const quantitySummary = buildQuantitySummary(elementsList);

  const handleExportMeasurementsCsv = () => {
    if (!measurements || measurements.length === 0) return;
    const rows = [
      ["ID", "Tipo", "Valor Principal", "Unidad", "Detalles"],
      ...measurements.map((m, i) => {
        if (m.type === "distance") {
          return [
            i + 1,
            "Distancia",
            m.distance.toFixed(3),
            "m",
            `dX: ${m.dx.toFixed(3)}m | dY: ${m.dy.toFixed(3)}m | dZ: ${m.dz.toFixed(3)}m`,
          ];
        }
        return [
          i + 1,
          "Área",
          m.area.toFixed(3),
          "m²",
          `Perímetro: ${m.perimeter.toFixed(3)}m`,
        ];
      }),
    ];
    const csvContent = "\uFEFF" + rows.map((r) => r.join(",")).join("\n");
    downloadFile(csvContent, `${modelName}_Mediciones_3D.csv`, "text/csv;charset=utf-8;");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg">
              <i className="fa-solid fa-file-export"></i>
            </div>
            <div>
              <h2 id="export-modal-title" className="text-base font-bold text-white">
                Exportar Datos del Modelo BIM
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {modelName} • {elementsList?.length || 0} elementos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Opciones de Exportación */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-3">
            <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-slate-300">Resumen de cantidades</span><button type="button" onClick={() => exportQuantitySummaryToCsv(elementsList, modelName)} disabled={!elementsList?.length} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40">CSV resumen</button></div>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">{quantitySummary.map((group) => <div key={group.type} className="flex items-center justify-between rounded-lg bg-slate-950/50 px-2.5 py-2 text-xs"><span className="truncate text-slate-300">{group.label}</span><strong className="text-cyan-300">{group.count}</strong></div>)}</div>
            <p className="text-[11px] text-slate-500">Las cantidades corresponden al índice estructural disponible. Longitudes, áreas y volúmenes se incorporan solo cuando existen propiedades IFC verificables.</p>
          </div>
          {/* Opción 1: Elemento Seleccionado */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <i className="fa-solid fa-crosshairs text-blue-400"></i>
                Elemento Seleccionado
              </span>
              {selectedElement ? (
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  #{selectedElement.expressID} {selectedElement.ifcType}
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">Ninguno</span>
              )}
            </div>

            <p className="text-xs text-slate-400">
              Exporta los parámetros nativos y todos los Property Sets (Psets) del elemento actualmente seleccionado.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={!selectedElement}
                onClick={() => {
                  exportElementToCsv(selectedElement);
                  onClose();
                }}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                <i className="fa-solid fa-file-csv text-emerald-400"></i>
                <span>Exportar CSV</span>
              </button>

              <button
                type="button"
                disabled={!selectedElement}
                onClick={() => {
                  exportElementToJson(selectedElement);
                  onClose();
                }}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                <i className="fa-solid fa-code text-cyan-400"></i>
                <span>Exportar JSON</span>
              </button>
            </div>
          </div>

          {/* Opción 2: Inventario Completo / Cubicación */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <i className="fa-solid fa-table-list text-emerald-400"></i>
                Cubicación / Inventario Completo
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                {elementsList?.length || 0} ítems
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Genera una tabla con todos los elementos estructurales del modelo (Vigas, Columnas, Placas, Zapatas, Perfiles y Tags).
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={!elementsList || elementsList.length === 0}
                onClick={() => {
                  exportElementsListToCsv(elementsList, modelName);
                  onClose();
                }}
                className="flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                <i className="fa-solid fa-file-csv"></i>
                <span>Cubicación CSV (Excel)</span>
              </button>

              <button
                type="button"
                disabled={!elementsList || elementsList.length === 0}
                onClick={() => {
                  exportElementsListToJson(elementsList, modelName);
                  onClose();
                }}
                className="flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                <i className="fa-solid fa-code text-cyan-400"></i>
                <span>Inventario JSON</span>
              </button>
            </div>
          </div>

          {/* Opción 3: Mediciones 3D */}
          {measurements && measurements.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <i className="fa-solid fa-ruler-combined text-cyan-400"></i>
                  Reporte de Mediciones 3D
                </span>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  {measurements.length} medidas
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleExportMeasurementsCsv();
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <i className="fa-solid fa-download text-cyan-400"></i>
                  <span>Descargar Reporte de Medidas (.CSV)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/60 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
