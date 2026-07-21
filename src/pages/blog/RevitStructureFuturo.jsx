import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function RevitStructureFuturo() {
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
  const shareTitle = encodeURIComponent("¿El Fin de la Brecha entre Diseño y Detallado? El Futuro de Revit Structure");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />
      {/* Header Section */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/40 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-900 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <Link to="/blog" className="text-bim-blue hover:text-blue-400 text-sm font-medium transition-colors">
              <i className="fa-solid fa-arrow-left mr-1"></i> Volver al Blog
            </Link>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-building mr-1"></i> Revit Structure
            </span>
            <span className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-road mr-1"></i> Roadmap 2025+
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-calendar mr-1"></i> 17 Feb 2026
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-clock mr-1"></i> 8 min lectura
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            <span className="text-5xl">🔗</span> ¿El Fin de la Brecha entre Diseño y Detallado?<br />
            <span className="text-gradient-article">El Futuro de Revit Structure</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Análisis del roadmap estructural de Autodesk: del modelo conceptual al detallado LOD 400 y la convergencia de herramientas tradicionales en el entorno BIM.
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-[#0b1220]/60 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">

          {/* El Flujo Fragmentado */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-scissors text-red-400 mr-2"></i>
              El Flujo de Trabajo Fragmentado
            </h3>
            <p className="text-slate-400">
              Históricamente, el desarrollo de proyectos de ingeniería estructural ha estado fragmentado. Diseñamos y coordinamos de forma preliminar en Revit, pero en cuanto llega la hora de detallar las conexiones de acero o el armado de concreto real, nos vemos obligados a exportar y migrar a software de taller como **Tekla Structures** o **Advance Steel**.
            </p>
            <p className="text-slate-400 mb-0">
              Sin embargo, las prioridades de desarrollo en el último **Roadmap de Autodesk** demuestran que esta frontera técnica está colapsando gradualmente. Veamos qué significa esta transformación para el trabajo de los proyectistas.
            </p>
          </div>

          {/* Hito 1: Fabrication-Ready */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-industry text-blue-400 mr-2"></i>
              Hito 1: Hacia un Revit "Fabrication-Ready"
            </h3>
            <p className="text-slate-400">
              La inversión en desarrollo de Autodesk ya no apunta a simples modelos tridimensionales para vistas generales, sino a la **precisión milimétrica**. El objetivo es dotar a Revit de la capacidad de administrar conexiones complejas de acero y detallado de barras de refuerzo (rebar) con nivel de desarrollo LOD 400 nativo.
            </p>
            <div className="callout mt-4">
              <div className="callout-label">💡 Automatización en Marcha</div>
              <p className="text-gray-400 text-sm mb-0">
                La colocación de conexiones mediante algoritmos y scripts de Dynamo reduce drásticamente las horas dedicadas a modelar perno por perno y placa por placa. Aunque todavía tiene camino que recorrer frente a las macros avanzadas de Tekla, la brecha se está acortando velozmente.
              </p>
            </div>
          </div>

          {/* Hito 2: Modelo Analítico Autónomo */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-diagram-project text-green-400 mr-2"></i>
              Hito 2: El Modelo Analítico Autónomo
            </h3>
            <p className="text-slate-400">
              En versiones previas de Revit, el modelo analítico estaba estrechamente atado al modelado físico: cualquier edición geométrica en una viga corría el riesgo de romper los nudos de cálculo estructural.
            </p>
            <p className="text-slate-400 mb-0">
              Actualmente, Revit permite modelar y refinar un **modelo analítico independiente**, permitiendo que el ingeniero calculista estructure la lógica del cálculo matemático sin interferir directamente en el modelado físico de los proyectistas, resolviendo discrepancias mediante herramientas automáticas de sincronización.
            </p>
          </div>

          {/* Estado del Roadmap */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-6">
              <i className="fa-solid fa-list-check text-cyan-400 mr-2"></i>
              Funcionalidades Clave del Roadmap
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800/60 text-center">
                <span className="text-2xl text-blue-400"><i className="fa-solid fa-circle-nodes"></i></span>
                <h4 className="font-bold text-white text-sm mt-3 mb-1">Nodos Analíticos</h4>
                <p className="text-slate-400 text-xs mb-0">Edición simplificada del esqueleto estructural para cálculos exactos.</p>
              </div>
              <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800/60 text-center">
                <span className="text-2xl text-cyan-400"><i className="fa-solid fa-gears"></i></span>
                <h4 className="font-bold text-white text-sm mt-3 mb-1">Automation Connections</h4>
                <p className="text-slate-400 text-xs mb-0">Colocación inteligente de conexiones de acero mediante reglas automáticas.</p>
              </div>
              <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800/60 text-center">
                <span className="text-2xl text-emerald-400"><i className="fa-solid fa-rotate"></i></span>
                <h4 className="font-bold text-white text-sm mt-3 mb-1">Fabrication Sync</h4>
                <p className="text-slate-400 text-xs mb-0">Integración nativa directa con software de taller de corte y CNC.</p>
              </div>
            </div>
          </div>

          {/* ¿Qué significa esto para el proyectista? */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-users-gear text-yellow-500 mr-2"></i>
              ¿Qué Significa Esto Para Nosotros?
            </h3>
            <p className="text-slate-400">
              Al analizar el panorama con el clásico "Tridente del Proyectista" (**Revit – Tekla – Advance Steel**), la dirección es evidente: Revit está absorbiendo las funcionalidades de detallado de Advance Steel. Para proyectos comerciales y de mediana envergadura, ya no será estrictamente necesario salir del entorno Revit para obtener planos de taller.
            </p>
            <p className="text-slate-400 mb-0">
              No obstante, para proyectos industriales a gran escala, **Tekla Structures** mantendrá su hegemonía por su excelente manejo de enormes bases de datos, compatibilidad con maquinarias de fabricación CNC y su ecosistema maduro de programación.
            </p>
          </div>

          {/* Conclusiones clave */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-bim-blue">
            <h3 className="text-xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-lightbulb text-yellow-400 mr-2"></i> Conclusiones Clave
            </h3>
            <ul className="space-y-3 mb-0">
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
                <span><strong>LOD 400 Nativo</strong>: El objetivo final de Revit es cerrar la brecha entre diseño y taller, apuntando a un modelo listo para fabricación.</span>
              </li>
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
                <span><strong>Modelo Analítico Autónomo</strong>: El desacople físico-analítico cambia la forma en que interactúan ingenieros y modeladores.</span>
              </li>
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
                <span><strong>El Tridente converge</strong>: La suite de herramientas se consolida, simplificando los flujos de importación y exportación de archivos.</span>
              </li>
            </ul>
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
          <a
            href="/#contact"
            className="inline-flex items-center text-slate-400 hover:text-bim-blue font-medium transition-colors text-sm"
          >
            <i className="fa-solid fa-envelope mr-2" /> ¿Preguntas? Contáctame
          </a>
        </div>
      </section>
    </div>
  );
}
