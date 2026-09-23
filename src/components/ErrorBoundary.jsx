import { asset } from "../utils/asset";
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[70vh] p-6">
          <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-2xl p-8 max-w-lg w-full text-center shadow-xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2 font-head">
              Ocurrió un error inesperado
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              No se pudo cargar el recurso o módulo solicitado. Puedes reintentar la carga o volver al inicio.
            </p>
            {this.state.error?.message && (
              <div className="bg-slate-950/60 p-3 rounded-lg text-left text-xs font-mono text-red-300/80 mb-6 overflow-x-auto border border-red-500/10">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20"
              >
                Reintentar Carga
              </button>
              <a
                href={asset("/")}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-colors border border-slate-700"
              >
                Ir al Inicio
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
