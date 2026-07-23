import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function RevitStructureFuturo() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
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
  const shareTitle = encodeURIComponent(
    "El Futuro de Revit Structure: Roadmap y Tendencias 2025"
  );

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ─── HERO ─── */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/40 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              to="/blog"
              className="text-bim-blue hover:text-blue-400 text-sm font-medium transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-1" /> Volver al Blog
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="bg-indigo-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-building mr-1" /> Revit Structure
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 17 Feb 2026
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> 8 min lectura
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            <span className="text-indigo-400 text-5xl">🔗</span> ¿El Fin de la{" "}
            <span className="text-gradient-article">Brecha BIM</span>?
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Analizando el futuro de Revit Structure: del diseño conceptual al
            detallado de fabricación, sin salir del entorno BIM.
          </p>
        </div>
      </section>

      {/* ─── ARTICLE CONTENT ─── */}
      <section className="py-12 bg-[#0b1220]/60 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">
          {/* Intro: El Flujo Fragmentado */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-diagram-project text-bim-blue mr-2" />{" "}
              El Flujo Fragmentado
            </h3>
            <p className="text-gray-400">
              Históricamente, el flujo de trabajo estructural ha estado
              fragmentado. Usamos{" "}
              <strong className="text-white">Revit</strong> para la coordinación
              inicial y el diseño conceptual, pero cuando llega el momento del
              detallado de acero real, saltamos a{" "}
              <strong className="text-bim-blue">Tekla Structures</strong> o{" "}
              <strong className="text-bim-blue">Advance Steel</strong>.
            </p>
            <p className="text-gray-400 mb-0">
              Sin embargo, el último{" "}
              <a
                href="https://autodeskblog.wpengine.com/aec/roadmap/revit-structure-roadmap/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bim-blue hover:text-blue-400 underline transition-colors"
              >
                Roadmap de Autodesk
              </a>{" "}
              sugiere que esta barrera está a punto de caer. Analicemos qué
              significa esto para los proyectistas estructurales.
            </p>
          </div>

          {/* Hito 1: Fabrication-Ready */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-bolt text-yellow-400 mr-2" /> Hito 1:
              Hacia un Revit "Fabrication-Ready"
            </h3>
            <p className="text-gray-400">
              La inversión de Autodesk se centra ahora en la precisión. No se
              trata solo de "dibujar" el acero, sino de que Revit sea capaz de
              manejar las{" "}
              <strong className="text-white">conexiones de acero</strong> y el{" "}
              <strong className="text-white">armado de concreto (rebar)</strong>{" "}
              con niveles de desarrollo (LOD) 400 de forma nativa.
            </p>

            {/* Callout */}
            <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-800/30 mt-6">
              <h4 className="font-bold text-bim-blue text-sm mb-2">
                <i className="fa-solid fa-lightbulb mr-1" /> Punto Clave para
                Proyectistas:
              </h4>
              <p className="text-gray-400 text-sm mb-0">
                La automatización de conexiones mediante scripts de Dynamo y
                herramientas nativas está reduciendo la necesidad de modelar
                placa por placa manualmente. ¿Podrá alcanzar la velocidad de
                macros de Tekla? Estamos cada vez más cerca.
              </p>
            </div>
          </div>

          {/* Hito 2: Modelo Analítico Autónomo */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-brain text-purple-400 mr-2" /> Hito 2:
              El Modelo Analítico Autónomo
            </h3>
            <p className="text-gray-400">
              Una de las tarjetas más interesantes del roadmap es la evolución
              del{" "}
              <strong className="text-white">Modelo Analítico</strong>. Antes, si
              movías un muro, el modelo analítico se rompía. Ahora, Revit
              permite crear un modelo analítico independiente.
            </p>

            <div className="space-y-4 mt-6">
              <div className="flex items-start gap-3">
                <span className="text-bim-blue mt-1">
                  <i className="fa-solid fa-check-circle" />
                </span>
                <div>
                  <strong className="text-white">Flexibilidad:</strong>{" "}
                  <span className="text-gray-400">
                    El ingeniero puede empezar a calcular antes de que el modelo
                    físico esté terminado.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-bim-blue mt-1">
                  <i className="fa-solid fa-check-circle" />
                </span>
                <div>
                  <strong className="text-white">Sincronización:</strong>{" "}
                  <span className="text-gray-400">
                    Mejor integración con Robot Structural Analysis y software de
                    terceros.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-bim-blue mt-1">
                  <i className="fa-solid fa-check-circle" />
                </span>
                <div>
                  <strong className="text-white">Control:</strong>{" "}
                  <span className="text-gray-400">
                    Menos errores de "nodos no conectados" al exportar.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Estado del Roadmap - 3 Cards con borde superior coloreado */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-6">
              <i className="fa-solid fa-road text-cyan-400 mr-2" /> Estado del
              Roadmap
            </h3>
            <p className="text-gray-400 mb-8">
              Así se ve el avance de las funcionalidades clave según Autodesk:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Available */}
              <div className="bg-gray-800/50 p-6 rounded-xl border border-emerald-800/40 border-t-4 border-t-emerald-500 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)]">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <i className="fa-solid fa-circle-check mr-1" /> Disponible
                </span>
                <h4 className="font-bold text-white mt-3 text-lg">
                  Nodos Analíticos
                </h4>
                <p className="text-sm text-gray-400 mt-2 mb-0">
                  Mejoras en la edición directa de nodos estructurales y mayor
                  control del modelo analítico.
                </p>
              </div>
              {/* In Progress */}
              <div className="bg-gray-800/50 p-6 rounded-xl border border-blue-800/40 border-t-4 border-t-bim-blue transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)]">
                <span className="text-xs font-bold text-bim-blue uppercase tracking-wider">
                  <i className="fa-solid fa-spinner mr-1" /> En Progreso
                </span>
                <h4 className="font-bold text-white mt-3 text-lg">
                  Automation Connections
                </h4>
                <p className="text-sm text-gray-400 mt-2 mb-0">
                  Algoritmos para detallado automático de conexiones de acero
                  estructural.
                </p>
              </div>
              {/* Coming Soon */}
              <div className="bg-gray-800/50 p-6 rounded-xl border border-purple-800/40 border-t-4 border-t-purple-500 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)]">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  <i className="fa-solid fa-clock mr-1" /> Próximamente
                </span>
                <h4 className="font-bold text-white mt-3 text-lg">
                  Fabrication Sync
                </h4>
                <p className="text-sm text-gray-400 mt-2 mb-0">
                  Integración bidireccional perfecta entre el modelo BIM y el
                  taller de fabricación.
                </p>
              </div>
            </div>
          </div>

          {/* ¿Qué Significa Esto Para Nosotros? */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-scale-balanced text-orange-400 mr-2" />{" "}
              ¿Qué Significa Esto Para Nosotros?
            </h3>
            <p className="text-gray-400">
              Como alguien que utiliza el{" "}
              <strong className="text-white">Tridente del Proyectista</strong>{" "}
              (Revit – Tekla – Advance Steel), mi conclusión es que Revit está
              absorbiendo las funciones de Advance Steel. Para proyectos de
              mediana complejidad, ya no será necesario salir del entorno Revit.
            </p>
            <p className="text-gray-400 mb-0">
              Sin embargo, para proyectos industriales masivos,{" "}
              <strong className="text-bim-blue">Tekla Structures</strong> sigue
              manteniendo el trono debido a su gestión de bases de datos de
              fabricación CNC y su ecosistema maduro de macros y componentes
              personalizados.
            </p>
          </div>

          {/* Conclusiones clave */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-bim-blue">
            <h3 className="text-xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-lightbulb text-yellow-400 mr-2" />{" "}
              Conclusiones Clave
            </h3>
            <ul className="space-y-3 mb-0">
              <li className="flex items-start text-gray-400">
                <span className="text-bim-blue mr-2 mt-1">
                  <i className="fa-solid fa-check-circle" />
                </span>
                <span>
                  <strong className="text-white">
                    Revit está cerrando la brecha
                  </strong>{" "}
                  entre diseño conceptual y detallado de fabricación.
                  Fabrication-Ready es el objetivo.
                </span>
              </li>
              <li className="flex items-start text-gray-400">
                <span className="text-bim-blue mr-2 mt-1">
                  <i className="fa-solid fa-check-circle" />
                </span>
                <span>
                  <strong className="text-white">
                    El modelo analítico autónomo
                  </strong>{" "}
                  es un game-changer para ingenieros calculistas que trabajan en
                  paralelo con el equipo de modelado.
                </span>
              </li>
              <li className="flex items-start text-gray-400">
                <span className="text-bim-blue mr-2 mt-1">
                  <i className="fa-solid fa-check-circle" />
                </span>
                <span>
                  <strong className="text-white">
                    Advance Steel será absorbido
                  </strong>{" "}
                  progresivamente. Para proyectos medianos, Revit será
                  suficiente.
                </span>
              </li>
              <li className="flex items-start text-gray-400">
                <span className="text-bim-blue mr-2 mt-1">
                  <i className="fa-solid fa-check-circle" />
                </span>
                <span>
                  <strong className="text-white">
                    Tekla mantiene el trono industrial
                  </strong>{" "}
                  para proyectos masivos con fabricación CNC y alta complejidad.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── SHARE BUTTONS ─── */}
      <section className="py-10 bg-[#070d18] border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            <i className="fa-solid fa-share-nodes mr-2 text-bim-blue" />
            Comparte este artículo
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-bold shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
            >
              <i className="fa-brands fa-linkedin-in" /> LinkedIn
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#0d5bbf] text-white text-sm font-bold shadow-lg hover:shadow-blue-400/30 transition-all hover:-translate-y-0.5"
            >
              <i className="fa-brands fa-facebook-f" /> Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-sm font-bold shadow-lg hover:shadow-gray-500/30 transition-all hover:-translate-y-0.5 border border-gray-700"
            >
              <i className="fa-brands fa-x-twitter" /> X
            </a>
            <a
              href={`https://www.reddit.com/submit?url=${shareUrl}&title=${shareTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4500] hover:bg-[#cc3700] text-white text-sm font-bold shadow-lg hover:shadow-orange-500/30 transition-all hover:-translate-y-0.5"
            >
              <i className="fa-brands fa-reddit-alien" /> Reddit
            </a>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold shadow-lg hover:shadow-gray-500/30 transition-all hover:-translate-y-0.5"
            >
              {copied ? (
                <>
                  <i className="fa-solid fa-check text-emerald-400" />{" "}
                  ¡Copiado!
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

      {/* ─── ARTICLE NAVIGATION FOOTER ─── */}
      <section className="py-12 bg-[#030712] border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center text-bim-blue font-bold hover:text-blue-400 transition-colors group text-lg"
          >
            <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al Blog
          </Link>
          <Link
            to="/#contact"
            className="inline-flex items-center text-gray-500 hover:text-bim-blue font-medium transition-colors text-sm"
          >
            <i className="fa-solid fa-envelope mr-1" /> ¿Preguntas? Contáctame
          </Link>
        </div>
      </section>
    </div>
  );
}
