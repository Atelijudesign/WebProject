import React from "react";
import { Link } from "react-router-dom";

export default function HerramientasBimAcero() {
  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      {/* Header Section */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/40 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-bim-blue rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <Link to="/blog" className="text-bim-blue hover:text-blue-400 text-sm font-medium transition-colors">
              <i className="fa-solid fa-arrow-left mr-1"></i> Volver al Blog
            </Link>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-cyan-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-toolbox mr-1"></i> Herramientas
            </span>
            <span className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-shield-halved mr-1"></i> Acero Estructural
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-calendar mr-1"></i> 19 Feb 2026
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-clock mr-1"></i> 6 min lectura
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            <span className="text-5xl">🛠️</span> Herramientas Web para Acero Estructural:<br />
            <span className="text-gradient-article">Calculadora + Catálogo ICHA</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Calculadora de perfiles personalizados y catálogo digital ICHA con búsqueda interactiva, diagramas SVG y exportación a Excel profesional, directo en tu navegador.
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-[#0b1220]/60 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">
          
          {/* El Problema */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-circle-question text-cyan-400 mr-2"></i>
              El Problema Cotidiano
            </h3>
            <p className="text-slate-400">
              ¿Cuántas veces has tenido que consultar una tabla PDF del catálogo ICHA para buscar el peso de un perfil? ¿O abrir una planilla Excel antigua para calcular el área de un perfil soldado? Como proyectistas estructurales, pasamos demasiado tiempo en tareas manuales que deberían ser instantáneas y automáticas.
            </p>
            <p className="text-slate-400 mb-0">
              Por eso decidí crear dos herramientas web totalmente gratuitas que solucionan esto de raíz: una **Calculadora de Perfiles** para geometrías personalizadas y un **Catálogo Digital ICHA** con todos los datos actualizados del Instituto Chileno del Acero. Ambas diseñadas con un enfoque ágil y limpio.
            </p>
          </div>

          {/* Calculadora de Perfiles */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-calculator text-blue-400 mr-2"></i>
              Calculadora de Perfiles de Acero
            </h3>
            <p className="text-slate-400">
              Esta herramienta te permite calcular propiedades de perfiles a partir de las dimensiones que ingreses. Ya no dependes de tablas estáticas: seleccionas la geometría del perfil, digitas las medidas y obtienes los parámetros de ingeniería al instante.
            </p>
            <h4 className="font-bold text-gray-200 mt-6 mb-3">Funcionalidades Destacadas:</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1"><i className="fa-solid fa-circle-chevron-right text-xs"></i></span>
                <span><strong>Propiedades automáticas</strong>: Área (cm²), peso unitario (kg/m) y área de cobertura se recalculan dinámicamente con cualquier cambio.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1"><i className="fa-solid fa-circle-chevron-right text-xs"></i></span>
                <span><strong>Croquis dinámico SVG</strong>: Generación automática de la sección transversal con dimensiones acotadas (h, b, t, s) que se adapta en tiempo real a las entradas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1"><i className="fa-solid fa-circle-chevron-right text-xs"></i></span>
                <span><strong>Designación normalizada</strong>: Genera automáticamente la designación estándar chilena del perfil calculado (por ejemplo: <code className="text-cyan-400">H 200 × 200 × 6 × 8</code>).</span>
              </li>
            </ul>
          </div>

          {/* Catálogo Digital ICHA */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-book-open text-emerald-400 mr-2"></i>
              Catálogo Digital ICHA
            </h3>
            <p className="text-slate-400">
              El Instituto Chileno del Acero (ICHA) recopila en sus tablas las propiedades oficiales de los perfiles disponibles comercialmente en Chile. Esta herramienta digitaliza el catálogo completo, permitiéndote filtrar, buscar y comparar perfiles de manera sumamente veloz.
            </p>
            <h4 className="font-bold text-gray-200 mt-6 mb-3">Características Principales:</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1"><i className="fa-solid fa-circle-chevron-right text-xs"></i></span>
                <span><strong>Filtrado y búsqueda instantánea</strong>: Escribe la designación o selecciona la serie y el catálogo mostrará los resultados en tiempo real.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1"><i className="fa-solid fa-circle-chevron-right text-xs"></i></span>
                <span><strong>Parámetros mecánicos completos</strong>: Consulta peso, área, dimensiones nominales, momentos de inercia (Ix, Iy), módulos resistentes (Wx, Wy) y radios de giro (ix, iy).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1"><i className="fa-solid fa-circle-chevron-right text-xs"></i></span>
                <span><strong>Diagrama dinámico acotado</strong>: Visualiza la sección estructural con cotas precisas de acuerdo con la serie seleccionada.</span>
              </li>
            </ul>
          </div>

          {/* Funciones Compartidas */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-6">
              <i className="fa-solid fa-layer-group text-blue-400 mr-2"></i>
              Ecosistema y Flujo de Trabajo Integrado
            </h3>
            <p className="text-slate-400 mb-6">
              Ambas herramientas están integradas para resolver el flujo diario de estimación y cálculo de materiales:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800/60">
                <h4 className="font-bold text-white mb-2"><i className="fa-solid fa-list-ol text-cyan-400 mr-2"></i> Listado de Materiales</h4>
                <p className="text-slate-400 text-xs mb-0">Agrega perfiles con marcas de planos, largos personalizados y cantidades. El sistema calcula los pesos totales automáticamente.</p>
              </div>
              <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800/60">
                <h4 className="font-bold text-white mb-2"><i className="fa-solid fa-scale-balanced text-orange-400 mr-2"></i> Clasificación y Conexiones</h4>
                <p className="text-slate-400 text-xs mb-0">Clasifica el perfil por categorías de peso (NW) y aplica un factor de conexiones configurable (por defecto 10%) para cubicaciones reales.</p>
              </div>
            </div>
            <div className="mt-6 p-5 bg-emerald-950/20 rounded-xl border border-emerald-900/40">
              <h4 className="font-bold text-emerald-400 mb-2"><i className="fa-solid fa-file-excel mr-2"></i> Exportación Profesional a Excel</h4>
              <p className="text-slate-400 text-xs mb-0">Genera archivos <code className="text-emerald-400">.xlsx</code> con estilos corporativos listos para entregar, con barras de títulos coloreadas, formatos numéricos profesionales y cálculo final de toneladas de acero.</p>
            </div>
          </div>

          {/* Stack Tecnológico */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-code text-cyan-400 mr-2"></i>
              Stack Tecnológico
            </h3>
            <p className="text-slate-400">
              El desarrollo se realizó utilizando **HTML5, JavaScript vanilla y Tailwind CSS** para maximizar el rendimiento y la portabilidad. El catálogo interactivo consume los datos estructurados localmente en <code className="text-cyan-400">icha_data.js</code>, garantizando carga instantánea sin llamadas a bases de datos remotas. La exportación a Excel se implementó con la biblioteca **SheetJS** con estilos personalizados por CSS-in-JS.
            </p>
          </div>

          {/* CTA & Enlaces */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-blue-800/40 border-l-4 border-l-bim-blue mb-10 text-center">
            <h3 className="text-xl font-extrabold text-white mb-3">
              ¿Quieres probar las herramientas ahora mismo?
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Están disponibles 100% online y son completamente gratuitas. Selecciona una a continuación:
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/herramientas/perfiles"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-bim-blue hover:bg-blue-500 text-white font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/20"
              >
                <i className="fa-solid fa-calculator"></i>
                Ir a Calculadora de Perfiles
              </Link>
              <Link
                to="/herramientas/icha"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-cyan-500/20"
              >
                <i className="fa-solid fa-book-open"></i>
                Ir al Catálogo ICHA
              </Link>
            </div>
          </div>

          {/* Conclusiones clave */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-bim-blue">
            <h3 className="text-xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-lightbulb text-yellow-400 mr-2"></i> Conclusiones Clave
            </h3>
            <ul className="space-y-3 mb-0">
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
                <span><strong>Búsqueda en tiempo real</strong>: Ahorra el 90% del tiempo que gastas consultando tablas manuales en PDF.</span>
              </li>
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
                <span><strong>SVG Inteligentes</strong>: El croquis se acota automáticamente según las variables físicas de la sección.</span>
              </li>
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
                <span><strong>Exportación estructurada</strong>: Los listados de materiales se exportan directamente a hojas Excel formateadas profesionalmente.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>
    </div>
  );
}
