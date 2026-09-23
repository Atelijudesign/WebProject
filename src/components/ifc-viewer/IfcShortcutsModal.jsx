import { useEffect } from "react";

const SHORTCUT_GROUPS = [
  {
    category: "Navegación y Selección",
    shortcuts: [
      { key: "V", description: "Modo Selección de elementos" },
      { key: "F", description: "Enfocar elemento seleccionado (o centrar modelo)" },
      { key: "Esc", description: "Deseleccionar elemento o cancelar herramienta" },
      { key: "W", description: "Alternar modo Alámbrico (Wireframe)" },
    ],
  },
  {
    category: "Medición y Corte",
    shortcuts: [
      { key: "M", description: "Medir Distancia punto a punto" },
      { key: "A", description: "Medir Área de polígono 3D" },
      { key: "C", description: "Activar planos de Sección / Corte" },
      { key: "?", description: "Abrir esta ayuda de atajos de teclado" },
    ],
  },
  {
    category: "Control de Cámara (Ratón / Táctil)",
    shortcuts: [
      { key: "Clic Izq.", description: "Rotar cámara (Orbit)" },
      { key: "Clic Der. / Rueda", description: "Desplazar cámara (Pan)" },
      { key: "Scroll", description: "Acercar / Alejar (Zoom)" },
      { key: "Doble Clic", description: "Centrar y enfocar elemento seleccionado" },
    ],
  },
];

export function IfcShortcutsModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-cyan-950/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <i className="fa-solid fa-keyboard text-lg"></i>
            </div>
            <div>
              <h2 id="shortcuts-title" className="text-base font-bold text-white">
                Atajos de Teclado y Control 3D
              </h2>
              <p className="text-xs text-slate-400">
                Optimiza tu flujo de trabajo en el visor IFC
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Cerrar modal de atajos"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 [scrollbar-width:thin]">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.category} className="space-y-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                {group.category}
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {group.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-2.5"
                  >
                    <span className="text-xs text-slate-300">
                      {shortcut.description}
                    </span>
                    <kbd className="ml-2 flex h-6 min-w-[24px] items-center justify-center rounded border border-slate-600 bg-slate-800 px-2 text-[11px] font-mono font-bold text-cyan-300 shadow-sm">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-700 px-6 py-3 bg-slate-900/80 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
