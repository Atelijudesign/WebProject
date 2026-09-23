export function IfcPrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-cyan-950/20">
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <i className="fa-solid fa-shield-halved text-lg"></i>
            </div>
            <div>
              <h2 id="privacy-modal-title" className="text-base font-bold text-white">
                Privacidad, Seguridad y Limitaciones Técnicas
              </h2>
              <p className="text-xs text-slate-400">
                Arquitectura de procesamiento y salvaguardas de ingeniería
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Cerrar modal de privacidad"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Contenido Principal */}
        <div className="overflow-y-auto p-6 space-y-5 [scrollbar-width:thin] text-xs text-slate-300 leading-relaxed">
          {/* Tarjeta de Privacidad 100% Local */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1.5">
              <i className="fa-solid fa-lock text-sm"></i>
              <span>Procesamiento 100% en tu Navegador (Client-Side)</span>
            </div>
            <p>
              Tus modelos IFC y proyectos estructurales <strong>nunca se suben a ningún servidor externo ni nube de terceros</strong>.
              El análisis geométrico, la lectura STEP y la indexación de propiedades se ejecutan exclusivamente en la memoria de tu máquina a través de <strong>Web-IFC WebAssembly</strong>.
            </p>
          </div>

          {/* Tarjeta de Almacenamiento Local Acelerado */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <i className="fa-solid fa-database text-sm"></i>
              <span>Caché Local Acelerada (IndexedDB)</span>
            </div>
            <p>
              Para evitar re-parsear archivos grandes en cada sesión, el visor puede almacenar fragmentos geométricos optimizados en tu propia base de datos local de <strong>IndexedDB</strong>. Tienes control total para purgar o vaciar esta caché en cualquier momento desde la pestaña de <em>Rendimiento → Memoria</em>.
            </p>
          </div>

          {/* Tarjeta de Limitaciones Técnicas */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <i className="fa-solid fa-triangle-exclamation text-sm"></i>
              <span>Limitaciones Técnicas del Entorno Web</span>
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
              <li>
                <strong>Límites de Memoria:</strong> Los navegadores imponen un límite de memoria JS Heap (usualmente entre 1.5 GB y 4 GB). Modelos federados mayores a 150 MB deben modularse por disciplinas (Estructuras, MEP, Arquitectura) para evitar saturación de GPU.
              </li>
              <li>
                <strong>Esquemas Soportados:</strong> Compatibilidad con esquemas <strong>IFC2X3</strong> e <strong>IFC4</strong> de BuildingSMART.
              </li>
              <li>
                <strong>Aceleración por Hardware:</strong> Se requiere un navegador con soporte <strong>WebGL 2.0</strong> activo y aceleración por GPU habilitada.
              </li>
            </ul>
          </div>

          {/* Telemetría Ética */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <i className="fa-solid fa-chart-simple text-cyan-400"></i>
              <span>Telemetría Ética y Sin Rastro de Datos</span>
            </div>
            <p className="text-slate-400">
              No registramos nombres de archivos, nombres de proyectos, coordenadas ni propiedades de tus elementos. Cualquier métrica registrada se limita a contadores anónimos de usabilidad (ej. uso de mediciones o tiempos de carga aproximados) para mejorar el rendimiento del visor.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-700 px-6 py-3 bg-slate-900/80 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-cyan-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
