import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function HerramientasBimAcero() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        setScrollProgress((winScroll / height) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent("Herramientas Web para Acero Estructural: Calculadora + Catálogo ICHA");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Header Section */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/40 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-bim-blue rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <Link
              to="/blog"
              className="text-bim-blue hover:text-blue-400 text-sm font-medium transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-1" /> Volver al Blog
            </Link>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-cyan-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-toolbox mr-1" /> Herramientas BIM
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 19 Feb 2026
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> 6 min lectura
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            <span className="text-cyan-400 text-5xl">🛠️</span> Herramientas Web para{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              Acero Estructural
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Calculadora de perfiles y catálogo digital ICHA: todo lo que un proyectista estructural necesita,
            directo en el navegador.
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-[#0b1220]/60 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">

          {/* Intro: El Problema */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-lightbulb text-yellow-400 mr-2" /> El Problema
            </h3>
            <p className="text-slate-400">
              ¿Cuántas veces has tenido que consultar una tabla PDF del catálogo ICHA para buscar el peso de un
              perfil? ¿O abrir una planilla Excel antigua para calcular el área de un perfil soldado? Como
              proyectistas estructurales, pasamos demasiado tiempo en tareas que deberían ser instantáneas.
            </p>
            <p className="text-slate-400 mb-0">
              Por eso creé dos <strong className="text-white">herramientas web gratuitas</strong> que resuelven
              este problema: una <strong className="text-bim-blue">Calculadora de Perfiles</strong> para
              secciones personalizadas y un <strong className="text-bim-blue">Catálogo Digital ICHA</strong> con
              todos los datos del Instituto Chileno del Acero. Veamos qué hace cada una.
            </p>
          </div>

          {/* Tool 1: Calculadora de Perfiles */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 mb-10 shadow-2xl">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <i className="fa-solid fa-calculator text-blue-400" />
              <span>Calculadora de Perfiles de Acero</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Esta herramienta permite <strong className="text-white">calcular propiedades de perfiles</strong>{" "}
              a partir de las dimensiones que tú ingresas. No dependes de tablas estáticas: simplemente
              seleccionas el tipo de sección, ingresas las dimensiones, y obtienes los resultados al instante.
            </p>

            {/* Profile types grid */}
            <h4 className="text-base font-bold text-white mt-8 mb-4 flex items-center gap-2 font-head">
              <i className="fa-solid fa-shapes text-cyan-400 text-sm" />
              <span>Tipos de Perfiles Soportados</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
              <div className="bg-[#1e293b]/80 rounded-xl py-5 px-3 text-center border border-slate-700 hover:border-blue-400 hover:bg-[#283548] transition-all hover:-translate-y-0.5 shadow-md">
                <span className="text-2xl font-bold text-blue-400 block font-head mb-1">H</span>
                <span className="text-xs font-semibold text-slate-300 tracking-wider">H / W</span>
              </div>
              <div className="bg-[#1e293b]/80 rounded-xl py-5 px-3 text-center border border-slate-700 hover:border-blue-400 hover:bg-[#283548] transition-all hover:-translate-y-0.5 shadow-md">
                <span className="text-2xl font-bold text-blue-400 block font-head mb-1">T</span>
                <span className="text-xs font-semibold text-slate-300 tracking-wider">T</span>
              </div>
              <div className="bg-[#1e293b]/80 rounded-xl py-5 px-3 text-center border border-slate-700 hover:border-blue-400 hover:bg-[#283548] transition-all hover:-translate-y-0.5 shadow-md">
                <span className="text-2xl font-bold text-blue-400 block font-head mb-1">C</span>
                <span className="text-xs font-semibold text-slate-300 tracking-wider">C / CA</span>
              </div>
              <div className="bg-[#1e293b]/80 rounded-xl py-5 px-3 text-center border border-slate-700 hover:border-blue-400 hover:bg-[#283548] transition-all hover:-translate-y-0.5 shadow-md">
                <span className="text-2xl font-bold text-blue-400 block font-head mb-1">L</span>
                <span className="text-xs font-semibold text-slate-300 tracking-wider">L / XL</span>
              </div>
              <div className="bg-[#1e293b]/80 rounded-xl py-5 px-3 text-center border border-slate-700 hover:border-blue-400 hover:bg-[#283548] transition-all hover:-translate-y-0.5 shadow-md">
                <span className="text-xl text-blue-400 block mb-1">●</span>
                <span className="text-xs font-semibold text-slate-300 tracking-wider">Pipe / RB</span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1e293b]/70 border border-slate-700/60 text-blue-400 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                  <i className="fa-solid fa-bolt" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-base mb-1">Cálculo en tiempo real</h5>
                  <p className="text-slate-400 text-sm mb-0 leading-relaxed">
                    Área (cm²), peso unitario (kg/m) y área de cobertura se recalculan instantáneamente al
                    modificar cualquier dimensión.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0f2e38]/70 border border-cyan-800/60 text-cyan-400 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                  <i className="fa-solid fa-vector-square" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-base mb-1">Diagrama SVG interactivo</h5>
                  <p className="text-slate-400 text-sm mb-0 leading-relaxed">
                    Se genera un diagrama de sección transversal con dimensiones acotadas (h, b, t, s) que se
                    actualiza con cada cambio.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#2e103f]/70 border border-purple-800/60 text-purple-400 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                  <i className="fa-solid fa-tag" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-base mb-1">Designación automática</h5>
                  <p className="text-slate-400 text-sm mb-0 leading-relaxed">
                    Genera la designación del perfil según convención chilena (ej: H 20 × 27.13, CJ 10 ×
                    15.42, PIPE Ø152.4 × 7.11).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tool 2: Catálogo ICHA */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 mb-10 shadow-2xl">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <i className="fa-solid fa-book text-emerald-400" />
              <span>Catálogo Digital ICHA</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              El <strong className="text-white">Instituto Chileno del Acero (ICHA)</strong> publica las tablas de
              propiedades de los perfiles de acero laminados y conformados disponibles en Chile. Esta herramienta
              digitaliza ese catálogo completo, permitiendo{" "}
              <strong className="text-blue-400">buscar, consultar y comparar</strong> perfiles de forma rápida.
            </p>

            {/* Series grid */}
            <h4 className="text-base font-bold text-white mt-8 mb-4 flex items-center gap-2 font-head">
              <i className="fa-solid fa-layer-group text-emerald-400 text-sm" />
              <span>Series Disponibles</span>
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 mb-8">
              {["IN", "IP", "HN", "PH", "C", "CA", "L", "TL", "XL", "IC", "ICA", "CAJÓN"].map((serie) => (
                <div
                  key={serie}
                  className="bg-[#131c2e] rounded-xl py-3 px-1 text-center border border-slate-700/80 hover:border-blue-400 hover:bg-[#1a2740] transition-all"
                >
                  <span className="text-xs font-bold text-blue-400 font-mono tracking-wide">{serie}</span>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0c2e28] text-emerald-400 border border-emerald-800/60 flex items-center justify-center text-lg flex-shrink-0">
                  <i className="fa-solid fa-search" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-base mb-1">Búsqueda interactiva</h5>
                  <p className="text-slate-400 text-sm mb-0 leading-relaxed">
                    Escribe la designación y el buscador filtra los perfiles en tiempo real. Navegación con
                    teclado incluida.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0f1f38] text-blue-400 border border-blue-800/60 flex items-center justify-center text-lg flex-shrink-0">
                  <i className="fa-solid fa-table-cells" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-base mb-1">Propiedades mecánicas completas</h5>
                  <p className="text-slate-400 text-sm mb-0 leading-relaxed">
                    Peso (kg/m), área (cm²), dimensiones (B, e, t, C), momentos de inercia (Ix, Iy), módulos
                    resistentes (Wx, Wy), radios de giro (ix, iy) y más.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0c2b36] text-cyan-400 border border-cyan-800/60 flex items-center justify-center text-lg flex-shrink-0">
                  <i className="fa-solid fa-vector-square" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-base mb-1">Diagrama SVG de sección</h5>
                  <p className="text-slate-400 text-sm mb-0 leading-relaxed">
                    Cada perfil muestra su sección transversal con dimensiones acotadas, adaptándose
                    automáticamente al tipo de serie.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shared Features */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 mb-10 shadow-2xl">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <i className="fa-solid fa-arrows-rotate text-orange-400" />
              <span>Funciones Compartidas</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Ambas herramientas comparten un flujo de trabajo diseñado para el día a día del proyectista. Una
              vez que seleccionas o calculas un perfil, puedes agregarlo a un{" "}
              <strong className="text-white">listado de materiales</strong> y exportar todo a Excel:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-[#111927] border border-slate-700/70 rounded-2xl p-6 hover:border-blue-400/60 transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl bg-[#131e33] text-blue-400 border border-blue-800/60 flex items-center justify-center text-base">
                    <i className="fa-solid fa-list-check" />
                  </span>
                  <h4 className="font-bold text-white text-base">Listado de Perfiles</h4>
                </div>
                <p className="text-sm text-slate-400 mb-0 leading-relaxed">
                  Agrega perfiles con marca, cantidad y largo. El peso total se calcula automáticamente por fila
                  y como total general.
                </p>
              </div>

              <div className="bg-[#111927] border border-slate-700/70 rounded-2xl p-6 hover:border-orange-400/60 transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl bg-[#331a13] text-orange-400 border border-orange-800/60 flex items-center justify-center text-base">
                    <i className="fa-solid fa-weight-scale" />
                  </span>
                  <h4 className="font-bold text-white text-base">Clasificación por Peso</h4>
                </div>
                <p className="text-sm text-slate-400 mb-0 leading-relaxed">
                  Clasifica automáticamente los perfiles en categorías (liviano, medio, pesado, extra pesado)
                  según su peso unitario en kg/m.
                </p>
              </div>

              <div className="bg-[#111927] border border-slate-700/70 rounded-2xl p-6 hover:border-amber-400/60 transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl bg-[#332a13] text-amber-400 border border-amber-800/60 flex items-center justify-center text-base">
                    <i className="fa-solid fa-link" />
                  </span>
                  <h4 className="font-bold text-white text-base">% Conexiones Configurable</h4>
                </div>
                <p className="text-sm text-slate-400 mb-0 leading-relaxed">
                  Agrega un porcentaje adicional por conexiones de acero. El valor es configurable (por defecto
                  10%) y se adapta a las necesidades de cada proyecto.
                </p>
              </div>

              <div className="bg-[#111927] border border-slate-700/70 rounded-2xl p-6 hover:border-emerald-400/60 transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl bg-[#0c2e24] text-emerald-400 border border-emerald-800/60 flex items-center justify-center text-base">
                    <i className="fa-solid fa-file-excel" />
                  </span>
                  <h4 className="font-bold text-white text-base">Exportación Excel</h4>
                </div>
                <p className="text-sm text-slate-400 mb-0 leading-relaxed">
                  Genera un archivo .xlsx con formato profesional: barras de título, colores corporativos,
                  filas alternadas y totales en kg y ton.
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack Callout */}
          <div className="bg-blue-950/40 rounded-2xl p-6 border border-blue-800/40 mb-10">
            <h4 className="font-bold text-bim-blue text-sm mb-2">
              <i className="fa-solid fa-code mr-1" /> Stack Tecnológico
            </h4>
            <p className="text-slate-400 text-sm mb-0">
              Ambas herramientas están construidas con{" "}
              <strong className="text-slate-200">HTML + JavaScript + Tailwind CSS</strong>, sin backend ni
              dependencias complejas. La exportación Excel usa la librería{" "}
              <strong className="text-slate-200">SheetJS (xlsx)</strong> con estilos personalizados. El
              catálogo ICHA carga los datos desde un módulo de datos que contiene todas las series y propiedades
              mecánicas extraídas del documento oficial.
            </p>
          </div>

          {/* CTA: Pruébalas Ahora */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 border-l-4 border-l-bim-blue mb-10 shadow-2xl">
            <h3 className="text-xl font-extrabold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-rocket text-bim-blue" />
              <span>¡Pruébalas Ahora!</span>
            </h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Ambas herramientas son <strong className="text-white">100% gratuitas</strong> y funcionan
              directamente en tu navegador, sin necesidad de instalar nada. Ábrelas, agrega perfiles, y exporta
              tu listado a Excel en segundos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <Link
                to="/herramientas/perfiles"
                className="inline-flex items-center justify-center bg-bim-blue hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95 text-base w-full sm:w-auto"
              >
                <i className="fa-solid fa-calculator mr-2" /> Calculadora de Perfiles
              </Link>
              <Link
                to="/herramientas/icha"
                className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:scale-95 text-base w-full sm:w-auto"
              >
                <i className="fa-solid fa-book mr-2" /> Catálogo ICHA
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Share Buttons Section */}
      <section className="py-10 bg-[#070d18] border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 font-mono">
            <i className="fa-solid fa-share-nodes mr-2 text-bim-blue" /> Comparte este artículo
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-bold shadow-lg hover:shadow-blue-500/20 transition-all hover:-translate-y-0.5"
            >
              <i className="fa-brands fa-linkedin-in" /> LinkedIn
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#0d5bbf] text-white text-sm font-bold shadow-lg hover:shadow-blue-400/20 transition-all hover:-translate-y-0.5"
            >
              <i className="fa-brands fa-facebook-f" /> Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-sm font-bold shadow-lg hover:shadow-slate-500/20 transition-all hover:-translate-y-0.5 border border-slate-700"
            >
              <i className="fa-brands fa-x-twitter" /> X
            </a>
            <a
              href={`https://www.reddit.com/submit?url=${shareUrl}&title=${shareTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4500] hover:bg-[#cc3700] text-white text-sm font-bold shadow-lg hover:shadow-orange-500/20 transition-all hover:-translate-y-0.5"
            >
              <i className="fa-brands fa-reddit-alien" /> Reddit
            </a>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5 border border-slate-700"
            >
              {copied ? (
                <>
                  <i className="fa-solid fa-check text-emerald-400" /> ¡Copiado!
                </>
              ) : (
                <>
                  <i className="fa-solid fa-link" /> Copiar Link
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Article Navigation Footer */}
      <section className="py-12 bg-[#030712] border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center text-bim-blue font-bold hover:text-blue-400 transition-colors group text-base"
          >
            <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al Blog
          </Link>
          <Link
            to="/#contact"
            className="inline-flex items-center text-slate-400 hover:text-bim-blue font-medium transition-colors text-sm"
          >
            <i className="fa-solid fa-envelope mr-2" /> ¿Preguntas? Contáctame
          </Link>
        </div>
      </section>
    </div>
  );
}
