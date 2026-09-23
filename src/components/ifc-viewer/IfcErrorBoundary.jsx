import { Component } from "react";
import { clearIfcCache } from "./ifcCache";

export class IfcErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRecovering: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("IfcErrorBoundary capturó un fallo no controlado:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  handlePurgeAndReload = async () => {
    this.setState({ isRecovering: true });
    try {
      await clearIfcCache();
    } catch (_) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || "Ocurrió un error inesperado al renderizar el visor 3D.";
      const isContextLost =
        errorMessage.includes("context") ||
        errorMessage.includes("WebGL") ||
        errorMessage.includes("memory") ||
        errorMessage.includes("wasm");

      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-950 p-6 text-center text-slate-200">
          <div className="max-w-lg rounded-2xl border border-rose-500/40 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
              <i className={`fa-solid ${isContextLost ? "fa-microchip" : "fa-triangle-exclamation"} text-3xl`}></i>
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              {isContextLost
                ? "Recuperación de Gráficos WebGL / Memoria"
                : "Se interrumpió el Visor IFC"}
            </h2>

            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              {isContextLost
                ? "El navegador experimentó una sobrecarga de recursos gráficos o memoria en la GPU. Puedes reiniciar el contexto o limpiar la caché local."
                : "Se produjo una excepción en el motor del visor. Tus archivos y configuraciones locales están a salvo."}
            </p>

            <div className="my-4 max-h-24 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/70 p-2 text-left font-mono text-[11px] text-rose-300">
              {errorMessage}
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-cyan-500"
              >
                <i className="fa-solid fa-rotate-right mr-1.5"></i>
                Reiniciar Visor
              </button>

              <button
                type="button"
                onClick={this.handlePurgeAndReload}
                disabled={this.state.isRecovering}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:opacity-50"
              >
                <i className="fa-solid fa-broom mr-1.5"></i>
                {this.state.isRecovering ? "Limpiando..." : "Purgar Caché y Recargar"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
