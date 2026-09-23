import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { useTranslation } from "../context/LanguageContext";

export default function ToolsCatalog() {
  const { language } = useTranslation();
  const isEn = language === "en";

  return (
    <div className="bg-gray-50 dark:bg-bim-dark min-h-screen pt-24 pb-12 transition-colors duration-300">
      <SEOHead
        title={isEn ? "Free Online BIM & Structural Engineering Tools" : "Herramientas de Ingeniería Estructural y BIM Online Gratis"}
        description={isEn ? "Interactive calculators and catalogs for structural designers: Chilean ICHA catalog, AISC v15.0 catalog, C250 stair calculator, buckling shorteners, and IFC viewer." : "Calculadoras y catálogos interactivos para proyectistas estructurales: Catálogo ICHA chileno, Catálogo AISC v15.0, Calculador de Escaleras C250, Acortadores de Pandeo y Visor IFC."}
        path="/herramientas"
        keywords="Herramientas estructurales online, calculadoras BIM, catálogo ICHA, catálogo AISC, ingeniería civil estructural, cubicador de acero gratis"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": isEn ? "Online BIM & Structural Engineering Tools" : "Herramientas de Ingeniería Estructural y BIM Online",
          "url": "https://atelijudesign.com/herramientas",
          "description": isEn ? "Free online calculators and catalogs suite for structural engineering and BIM design workflows." : "Suite de calculadoras y catálogos online gratuitos para proyectos de ingeniería estructural y diseño BIM."
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top navigation */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700/50 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm group"
          >
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> {isEn ? "Back to Home" : "Volver al Inicio"}
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-900/30 border border-bim-blue/30 text-bim-blue text-xs font-bold mb-4 tracking-wider uppercase">
            {isEn ? "Productivity & Efficiency" : "Productividad y Eficiencia"}
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-white font-grotesk">
            {isEn ? (
              <>BIM <span className="text-transparent bg-clip-text bg-gradient-to-r from-bim-blue to-indigo-400">Tools</span></>
            ) : (
              <>Herramientas <span className="text-transparent bg-clip-text bg-gradient-to-r from-bim-blue to-indigo-400">BIM</span></>
            )}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {isEn ? "Engineering calculators and automation utilities designed to optimize structural designers and modelers workflow." : "Calculadoras de ingeniería y utilidades de automatización diseñadas para optimizar el flujo de trabajo de diseñadores y proyectistas estructurales."}
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
                <h3 className="text-xl font-bold text-white mb-3 font-grotesk group-hover:text-bim-blue transition-colors">
                  {isEn ? "Digital ICHA Catalog" : "Catálogo ICHA Digital"}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {isEn ? "Interactive database of Chilean structural steel profiles (NCh) with comprehensive mechanical properties, project takeoff calculator and export." : "Buscador interactivo de perfiles de acero estructural chileno (NCh) con propiedades mecánicas completas, cubicador por proyecto y exportación."}
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
                </span>
                <span className="text-sm font-bold text-bim-blue flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  {isEn ? "Open" : "Abrir"} <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </div>
          </Link>

          {/* AISC Tool Card */}
          <Link to="/herramientas/aisc" className="group block h-full">
            <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-700/50 p-8 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_8px_30px_rgb(34,211,238,0.1)] hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex-1">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-2xl text-cyan-400 mb-6 shadow-sm border border-slate-700/50 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-layer-group"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-grotesk group-hover:text-cyan-400 transition-colors">
                  {isEn ? "AISC v15.0 Catalog" : "Catálogo AISC v15.0"}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {isEn ? "Standardized database with 2,100+ steel shapes (W, M, S, HP, C, MC, L, WT, HSS, Pipe). Imperial / Metric unit toggle, 2D diagram and material takeoff." : "Base de datos normada con 2,100+ perfiles (W, M, S, HP, C, MC, L, WT, HSS, Pipe). Toggle de unidades Imperial / Métrico, diagrama 2D y cubicación."}
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
                </span>
                <span className="text-sm font-bold text-cyan-400 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  {isEn ? "Open" : "Abrir"} <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </div>
          </Link>

          {/* Stairs Calculator Card (Próximamente / Coming Soon) */}
          <Link to="/herramientas/escaleras" className="group block h-full">
            <div className="flex flex-col h-full bg-slate-900/80 rounded-2xl border border-amber-500/30 p-8 transition-all duration-300 hover:border-amber-400/50 hover:shadow-[0_8px_30px_rgb(245,158,11,0.1)] hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-2xl text-amber-400 shadow-sm border border-amber-500/20 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-stairs"></i>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <i className="fa-solid fa-clock-rotate-left text-[9px]"></i> {isEn ? "Coming Soon" : "Próximamente"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-grotesk group-hover:text-amber-400 transition-colors">
                  {isEn ? "Stairway Calculator" : "Calculadora de Escaleras"}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {isEn ? "Calculates treads, risers and validates Blondel comfort and safety rules for structural staircase design considering grating or concrete landings." : "Calcula huellas, contrahuellas y verifica las reglas de comodidad (Blondel) y seguridad para el diseño de escaleras estructurales considerando anclajes de parrilla o concreto."}
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> {isEn ? "Under Calibration" : "En Calibración"}
                </span>
                <span className="text-sm font-bold text-amber-400 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  {isEn ? "View Status" : "Ver Estado"} <i className="fa-solid fa-arrow-right"></i>
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
                <h3 className="text-xl font-bold text-white mb-3 font-grotesk group-hover:text-emerald-400 transition-colors">
                  {isEn ? "Structural Steel Calculator" : "Calculadora de Acero"}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {isEn ? "Parametric sizing and takeoff for various structural profiles (H, L, T, XL, CA, etc). Includes surface coverage area and export." : "Dimensionamiento y cubicación paramétrica de diferentes perfiles estructurales (H, L, T, XL, CA, etc). Incluye cálculo de área de cobertura y exportación."}
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
                </span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  {isEn ? "Open" : "Abrir"} <i className="fa-solid fa-arrow-right"></i>
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
                <h3 className="text-xl font-bold text-white mb-3 font-grotesk group-hover:text-orange-400 transition-colors">
                  {isEn ? "Buckling Shorteners" : "Acortadores de Pandeo"}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {isEn ? "Determines maximum spacing and minimum quantity of stitch plates / shorteners for built-up double angles (XL), optimizing compression member design." : "Determina la separación máxima y cantidad mínima de acortadores para perfiles XL, optimizando el diseño de elementos a compresión."}
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
                </span>
                <span className="text-sm font-bold text-orange-400 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  {isEn ? "Open" : "Abrir"} <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </div>
          </Link>

          {/* CV ATS Builder Card */}
          <Link to="/herramientas/cv-ats" className="group block h-full">
            <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-700/50 p-8 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_8px_30px_rgb(34,211,238,0.1)] hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex-1">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-2xl text-cyan-400 mb-6 shadow-sm border border-cyan-500/20 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-file-lines"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-grotesk group-hover:text-cyan-400 transition-colors">CV Builder Pro ATS</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">Creador de CV sin fotos: analiza ofertas, identifica keywords y exporta proyectos a PDF y LaTeX desde tu navegador.</p>
              </div>
              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Privado · Local</span>
                <span className="text-sm font-bold text-cyan-400 flex items-center gap-2 group-hover:translate-x-1 transition-transform">Abrir <i className="fa-solid fa-arrow-right"></i></span>
              </div>
            </div>
          </Link>


          {/* Visor IFC 3D Card */}
          <Link to="/herramientas/visor-ifc" className="group block h-full">
            <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-blue-500/40 p-8 transition-all duration-300 hover:border-blue-400 hover:shadow-[0_8px_30px_rgb(59,130,246,0.2)] hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex-1">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-2xl text-blue-400 mb-6 shadow-sm border border-blue-500/30 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-cube"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-grotesk group-hover:text-blue-400 transition-colors">
                  {isEn ? "Structural 3D IFC Viewer" : "Visor IFC Estructural 3D"}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {isEn
                    ? "Interactive WebAssembly IFC viewer for structural BIM: local file upload, 3D element inspection, section planes, distance and area measurement, and CSV/JSON takeoff export."
                    : "Visor BIM interactivo en WebAssembly: carga modelos IFC locales, inspección de parámetros y Psets, planos de sección, medición 3D de distancias y áreas, y exportación CSV/JSON."}
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800">
                <span className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> {isEn ? "3D Engine" : "Motor 3D"}
                </span>
                <span className="text-sm font-bold text-blue-400 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  {isEn ? "Open Viewer" : "Abrir Visor"} <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </div>
          </Link>

          {/* Unit Converter Card */}
          <Link to="/herramientas/convertidor" className="group block h-full">
            <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-700/50 p-8 transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_8px_30px_rgb(245,158,11,0.12)] hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex-1">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-2xl text-amber-400 mb-6 shadow-sm border border-slate-700/50 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-ruler-combined"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-grotesk group-hover:text-amber-400 transition-colors">
                  {isEn ? "Unit Converter" : "Convertidor de Unidades"}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {isEn
                    ? "Precision converter for architectural units: feet/inches to mm, bidirectional conversion, fractional inch tables (1/16 to 1/128) and multi-unit engineering categories."
                    : "Conversor de precisión para unidades arquitectónicas: pies/pulgadas a mm, conversión bidireccional, tablas de fracciones de pulgada (1/16 a 1/128) y categorías de ingeniería."}
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
                </span>
                <span className="text-sm font-bold text-amber-400 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  {isEn ? "Open" : "Abrir"} <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </div>
          </Link>

          {/* Geometric Calculator Card */}
          <Link to="/herramientas/geometria" className="group block h-full">
            <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-700/50 p-8 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)] hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex-1">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-2xl text-emerald-400 mb-6 shadow-sm border border-slate-700/50 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-square-root-variable"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-grotesk group-hover:text-emerald-400 transition-colors">
                  {isEn ? "Geometry & Trigonometry" : "Geometría & Trigonometría"}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {isEn
                    ? "Solve right and oblique triangles, calculate geometric areas, trig functions table, and quadratic equations. Based on Larburu's Engineering Handbook."
                    : "Resuelve triángulos rectángulos y oblicuángulos, áreas de figuras, funciones trigonométricas y ecuaciones cuadráticas. Basado en el Prontuario de Máquinas (Larburu)."}
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
                </span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  {isEn ? "Open" : "Abrir"} <i className="fa-solid fa-arrow-right"></i>
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
                <h3 className="text-xl font-bold text-white mb-3 font-grotesk">{isEn ? "Python · Revit API" : "API Python · Revit"}</h3>
                <p className="text-gray-500 text-sm max-w-[200px] mb-4">
                  {isEn ? "Automatic material takeoff module for Autodesk Revit currently in development." : "Módulo de auto-cubicación para Autodesk Revit en construcción."}
                </p>
                <div className="px-3 py-1 bg-slate-800 text-slate-400 text-xs rounded-full border border-slate-700">
                  {isEn ? "In Development" : "En Desarrollo"}
                </div>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
