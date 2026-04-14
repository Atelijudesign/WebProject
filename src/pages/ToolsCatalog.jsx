import { Link } from "react-router-dom";
import { toolsPreview } from "../constants";

export default function ToolsCatalog() {
  return (
    <div className="bg-gray-50 dark:bg-bim-dark min-h-screen pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-900/30 border border-bim-blue/30 text-bim-blue text-xs font-bold mb-4 tracking-wider uppercase">
            Productividad y Eficiencia
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-white font-grotesk">
            Herramientas <span className="text-transparent bg-clip-text bg-gradient-to-r from-bim-blue to-indigo-400">BIM</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Calculadoras de ingeniería y utilidades de automatización diseñadas para optimizar el flujo de trabajo de diseñadores y proyectistas estructurales.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* ICHA Tool Card */}
          <Link to="/herramientas/icha" className="group block h-full">
            <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-700/50 p-8 transition-all duration-300 hover:border-bim-blue/50 hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)] hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-bim-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex-1">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-2xl text-bim-blue mb-6 shadow-sm border border-slate-700/50 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-box-archive"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-grotesk group-hover:text-bim-blue transition-colors">Catálogo ICHA Digital</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Buscador interactivo de perfiles de acero estructural con propiedades mecánicas completas, cubicador por proyecto, comparador de perfiles y exportación a Excel y PDF.
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
                </span>
                <span className="text-sm font-bold text-bim-blue flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  Abrir <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </div>
          </Link>

          {/* Stairs Calculator Card */}
          <Link to="/herramientas/escaleras" className="group block h-full">
            <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-700/50 p-8 transition-all duration-300 hover:border-indigo-400/50 hover:shadow-[0_8px_30px_rgb(129,140,248,0.1)] hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex-1">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-2xl text-indigo-400 mb-6 shadow-sm border border-slate-700/50 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-stairs"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-grotesk group-hover:text-indigo-400 transition-colors">Calculadora de Escaleras</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Calcula huellas, contrahuellas y verifica las reglas de comodidad (Blondel) y seguridad para el diseño de escaleras estructurales considerando anclajes de parrilla o concreto.
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
                </span>
                <span className="text-sm font-bold text-indigo-400 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  Abrir <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </div>
          </Link>

          {/* Profile Calculator Card */}
          <Link to="/herramientas/perfiles" className="group block h-full">
            <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-700/50 p-8 transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_8px_30px_rgb(52,211,153,0.1)] hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex-1">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-2xl text-emerald-400 mb-6 shadow-sm border border-slate-700/50 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-shapes"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-grotesk group-hover:text-emerald-400 transition-colors">Calculadora de Acero</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Dimensionamiento y cubicación paramétrica de diferentes perfiles estructurales (H, L, T, XL, CA, etc). Incluye cálculo de área de cobertura y exportación.
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
                </span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  Abrir <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </div>
          </Link>

          {/* Buckling Shorteners Card */}
          <Link to="/herramientas/acortadores" className="group block h-full">
            <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-700/50 p-8 transition-all duration-300 hover:border-orange-400/50 hover:shadow-[0_8px_30px_rgb(251,146,60,0.1)] hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex-1">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-2xl text-orange-400 mb-6 shadow-sm border border-slate-700/50 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-compress"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-grotesk group-hover:text-orange-400 transition-colors">Acortadores de Pandeo</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Determina la separación máxima y cantidad mínima de acortadores para perfiles XL, optimizando el diseño de elementos a compresión.
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
                </span>
                <span className="text-sm font-bold text-orange-400 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  Abrir <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </div>
          </Link>

          {/* Coming Soon Card */}
          <div className="group block h-full select-none">
            <div className="flex flex-col h-full bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed p-8 relative overflow-hidden">
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center opacity-50">
                <div className="w-14 h-14 bg-slate-800/50 rounded-xl flex items-center justify-center text-2xl text-slate-500 mb-6">
                  <i className="fa-solid fa-code"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-grotesk">API Python · Revit</h3>
                <p className="text-gray-500 text-sm max-w-[200px] mb-4">Módulo de auto-cubicación para Autodesk Revit en construcción.</p>
                <div className="px-3 py-1 bg-slate-800 text-slate-400 text-xs rounded-full border border-slate-700">En Desarrollo</div>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
