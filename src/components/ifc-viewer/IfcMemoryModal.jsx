import { useEffect, useState, useCallback } from "react";
import { clearIfcCache, deleteCachedModel, getStorageEstimate, listCachedModels } from "./ifcCache";

export function IfcMemoryModal({
  isOpen,
  onClose,
  modelName,
  modelElementCount,
  indexedElementCount,
  categoryCount,
  performanceProfile,
  onProfileChange,
  onDisposeModel,
  hasLoadedModel,
  fps = null,
  gpuMetrics = null,
}) {
  const [memoryStats, setMemoryStats] = useState(null);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [cacheClearMessage, setCacheClearMessage] = useState(null);
  const [storageEstimate, setStorageEstimate] = useState(null);
  const [cachedModels, setCachedModels] = useState([]);
  const [activeTab, setActiveTab] = useState("memory"); // 'memory' | 'cache' | 'fps'

  const refreshStorageData = useCallback(async () => {
    try {
      const [estimate, models] = await Promise.all([
        getStorageEstimate(),
        listCachedModels(),
      ]);
      setStorageEstimate(estimate);
      setCachedModels(models);
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const readMemory = () => {
      if (typeof window !== "undefined" && window.performance && window.performance.memory) {
        const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = window.performance.memory;
        setMemoryStats({
          usedMB: (usedJSHeapSize / (1024 * 1024)).toFixed(1),
          totalMB: (totalJSHeapSize / (1024 * 1024)).toFixed(1),
          limitMB: (jsHeapSizeLimit / (1024 * 1024)).toFixed(0),
          percent: Math.round((usedJSHeapSize / jsHeapSizeLimit) * 100),
          isNative: true,
        });
      } else {
        const estimatedMB = Math.max(25, Math.round((modelElementCount || 100) * 0.08));
        setMemoryStats({
          usedMB: estimatedMB.toFixed(1),
          totalMB: (estimatedMB * 1.3).toFixed(1),
          limitMB: "2048",
          percent: Math.min(100, Math.round((estimatedMB / 2048) * 100)),
          isNative: false,
        });
      }
    };

    readMemory();
    refreshStorageData();
    const interval = window.setInterval(readMemory, 2000);
    return () => window.clearInterval(interval);
  }, [isOpen, modelElementCount, refreshStorageData]);

  const handleClearCacheClick = async () => {
    setIsClearingCache(true);
    setCacheClearMessage(null);
    try {
      const cleared = await clearIfcCache();
      if (cleared) {
        setCacheClearMessage("Caché de modelos IndexedDB liberada con éxito.");
        await refreshStorageData();
      } else {
        setCacheClearMessage("No había datos en caché o no está disponible.");
      }
    } catch {
      setCacheClearMessage("Ocurrió un problema al limpiar la caché.");
    } finally {
      setIsClearingCache(false);
    }
  };

  const handleDeleteModel = async (key) => {
    try {
      await deleteCachedModel(key);
      await refreshStorageData();
    } catch (_) {}
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="memory-modal-title"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-cyan-950/20">
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <i className="fa-solid fa-gauge-high text-lg"></i>
            </div>
            <div>
              <h2 id="memory-modal-title" className="text-base font-bold text-white">
                Rendimiento, FPS y Almacenamiento Local
              </h2>
              <p className="text-xs text-slate-400">
                Auditoría WebGL, memoria JS Heap y base de datos IndexedDB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Cerrar modal de diagnóstico"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Sub-navegación entre pestañas de diagnóstico */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 py-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("memory")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === "memory"
                ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <i className="fa-solid fa-microchip mr-1.5"></i>
            Memoria & GPU
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cache")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === "cache"
                ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <i className="fa-solid fa-database mr-1.5"></i>
            IndexedDB ({cachedModels.length})
          </button>
        </div>

        {/* Contenido Principal */}
        <div className="overflow-y-auto p-6 space-y-5 [scrollbar-width:thin]">
          {activeTab === "memory" ? (
            <>
              {/* Tarjeta de Memoria JS Heap */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-microchip text-sm text-cyan-400"></i>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Uso de Memoria Heap {memoryStats?.isNative ? "(V8)" : "(Estimado)"}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {memoryStats?.usedMB || "—"} MB / {memoryStats?.limitMB || "—"} MB
                  </span>
                </div>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      (memoryStats?.percent || 0) > 80
                        ? "bg-rose-500"
                        : (memoryStats?.percent || 0) > 50
                        ? "bg-amber-500"
                        : "bg-cyan-500"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(3, memoryStats?.percent || 0))}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{memoryStats?.percent || 0}% de límite del navegador</span>
                  <span>Total asignado: {memoryStats?.totalMB || "—"} MB</span>
                </div>
              </div>

              {/* Métricas de GPU y FPS en tiempo real */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-center">
                  <span className="block text-[11px] text-slate-400">Cuadros (FPS)</span>
                  <strong className="mt-1 block text-lg font-mono text-emerald-400">
                    {fps !== null ? fps : "60"}
                  </strong>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-center">
                  <span className="block text-[11px] text-slate-400">Draw Calls</span>
                  <strong className="mt-1 block text-lg font-mono text-cyan-300">
                    {gpuMetrics?.drawCalls ?? "1"}
                  </strong>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-center">
                  <span className="block text-[11px] text-slate-400">Triángulos GPU</span>
                  <strong className="mt-1 block text-lg font-mono text-amber-300">
                    {gpuMetrics?.triangles ? (gpuMetrics.triangles / 1000).toFixed(0) + "k" : "—"}
                  </strong>
                </div>
              </div>

              {/* Perfil de Rendimiento */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <i className="fa-solid fa-sliders text-cyan-400"></i>
                  Perfil de Rendimiento Gráfico
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "economy", label: "Económico", desc: "Móviles / 1x DPR" },
                    { id: "balanced", label: "Equilibrado", desc: "Normal / 1.5x DPR" },
                    { id: "quality", label: "Calidad", desc: "Alta fidelidad / 2x" },
                  ].map((prof) => (
                    <button
                      key={prof.id}
                      type="button"
                      onClick={() => onProfileChange?.(prof.id)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                        performanceProfile === prof.id
                          ? "border-cyan-500 bg-cyan-950/40 text-white shadow-md shadow-cyan-950/30"
                          : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-xs font-bold">{prof.label}</span>
                      <span className="text-[10px] text-slate-400">{prof.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Liberar Recursos */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      onDisposeModel?.();
                      onClose();
                    }}
                    disabled={!hasLoadedModel}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-rose-800/50 bg-rose-950/30 px-4 py-2.5 text-xs font-semibold text-rose-200 hover:bg-rose-900/40 transition disabled:opacity-40"
                  >
                    <i className="fa-solid fa-power-off text-rose-400"></i>
                    <span>Liberar Modelo de GPU</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Pestaña de Auditoría IndexedDB */
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Almacenamiento Navegador</span>
                  <span className="font-mono text-cyan-300">
                    {storageEstimate?.usageMB || "0"} MB usados de {storageEstimate?.quotaMB || "—"} MB
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-cyan-500 transition-all"
                    style={{ width: `${Math.min(100, Math.max(2, storageEstimate?.percent || 0))}%` }}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Modelos Almacenados en Caché Local
                </h4>

                {cachedModels.length === 0 ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-6 text-center text-xs text-slate-400">
                    <i className="fa-solid fa-box-open text-2xl mb-2 text-slate-500"></i>
                    <p>No hay modelos cacheados en este momento.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto [scrollbar-width:thin]">
                    {cachedModels.map((model) => (
                      <div
                        key={model.key}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-3.5 py-2.5 text-xs"
                      >
                        <div className="truncate pr-2">
                          <strong className="block text-slate-200 truncate">{model.name}</strong>
                          <span className="text-[10px] text-slate-400">
                            {model.sizeMB} MB · Guardado: {model.formattedDate}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteModel(model.key)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-950/60 hover:text-rose-300 transition"
                          title="Eliminar este modelo de la caché"
                        >
                          <i className="fa-solid fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleClearCacheClick}
                disabled={isClearingCache || cachedModels.length === 0}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-800/50 bg-rose-950/30 px-4 py-2.5 text-xs font-semibold text-rose-200 hover:bg-rose-900/40 transition disabled:opacity-40"
              >
                <i className="fa-solid fa-trash-can text-rose-400"></i>
                <span>{isClearingCache ? "Limpiando..." : "Vaciar Todos los Modelos de IndexedDB"}</span>
              </button>

              {cacheClearMessage && (
                <p className="text-xs text-emerald-400 text-center animate-in fade-in">
                  <i className="fa-solid fa-circle-check mr-1.5"></i>
                  {cacheClearMessage}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-700 px-6 py-3 bg-slate-900/80 rounded-b-2xl">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <i className="fa-solid fa-shield-halved text-cyan-400"></i>
            <span>Procesamiento 100% en tu navegador (privado)</span>
          </div>
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

