import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function BimDevRoadmap() {
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
  const shareTitle = encodeURIComponent("De Profesional de Obra a BIM Software Developer en 12 Meses");

  const copyBlock = (e) => {
    const pre = e.target.closest('.code-block').querySelector('pre');
    navigator.clipboard.writeText(pre.innerText.trim()).then(() => {
      e.target.textContent = '✓ Copiado';
      setTimeout(() => e.target.textContent = 'Copiar', 2000);
    });
  };

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
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-900 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <Link to="/blog" className="text-bim-blue hover:text-blue-400 text-sm font-medium transition-colors">
              <i className="fa-solid fa-arrow-left mr-1"></i> Volver al Blog
            </Link>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-orange-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-map mr-1"></i> Roadmap
            </span>
            <span className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-code mr-1"></i> pyRevit + C#
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-calendar mr-1"></i> 17 Feb 2026
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-clock mr-1"></i> 15 min lectura
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            <span className="text-5xl">🏗️</span> De Profesional de Obra a<br />
            <span className="text-gradient-article">BIM Software Developer en 12 Meses</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Guía completa para que cualquier profesional de la construcción pueda transicionar al desarrollo de software BIM. Enfoque híbrido: Python para victorias rápidas + C# para potencia industrial.
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-[#0b1220]/60 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">

          {/* La Ventaja */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-graduation-cap text-orange-400 mr-2"></i>
              La Gran Ventaja del Profesional del Sector
            </h3>
            <p className="text-slate-400">
              Un programador junior convencional puede tardar años en comprender qué es una "conexión a momento", qué es un nudo analítico estructural o cómo funciona la coordinación MEP en obra. 
            </p>
            <p className="text-slate-400 mb-0">
              El profesional de la construcción que decide dar el salto al desarrollo de software ya cuenta con esa invaluable ventaja conceptual: **conoce el problema real**. No aprende a programar para "ver qué pasa", sino para dar solución técnica a los dolores e ineficiencias que ha experimentado en su día a día.
            </p>
          </div>

          {/* Plan de Batalla */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-6">
              <i className="fa-solid fa-calendar-days text-bim-blue mr-2"></i>
              El Plan de Batalla: 4 Trimestres
            </h3>
            
            <div className="steps-list">
              <div className="step-item">
                <div className="step-num text-xs">Q1</div>
                <div className="step-body w-full">
                  <div className="text-xs font-bold text-orange-400 mb-1">MESES 1 - 3</div>
                  <h4 className="step-title">Cimientos de Scripting & Revit API</h4>
                  <p className="step-desc mb-0">
                    Foco en sintaxis básica de Python. Aprende a usar la consola interactiva de pyRevit y a realizar selecciones y filtros de elementos mediante la API de Revit utilizando <span className="ic">FilteredElementCollector</span>.
                  </p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-num text-xs">Q2</div>
                <div className="step-body w-full">
                  <div className="text-xs font-bold text-orange-400 mb-1">MESES 4 - 6</div>
                  <h4 className="step-title">Automatización de Tareas de Oficina</h4>
                  <p className="step-desc mb-0">
                    Crea tus primeros pushbuttons propios en pyRevit para automatizar reportes de cubicaciones, control de parámetros de planos y revisiones geométricas. Implementación de Git y GitHub para el control de versiones de tu código.
                  </p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-num text-xs">Q3</div>
                <div className="step-body w-full">
                  <div className="text-xs font-bold text-orange-400 mb-1">MESES 7 - 9</div>
                  <h4 className="step-title">Transición a C# y Desarrollo Industrial</h4>
                  <p className="step-desc mb-0">
                    Introduce C# y la suite de .NET. Configura tu entorno en Visual Studio, asimila conceptos de tipado estático, interfaces como <span className="ic">IExternalCommand</span> y compila tu primer plugin (.addin) nativo de Revit.
                  </p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-num text-xs">Q4</div>
                <div className="step-body w-full">
                  <div className="text-xs font-bold text-orange-400 mb-1">MESES 10 - 12</div>
                  <h4 className="step-title">Arquitectura de Software y UI Avanzada</h4>
                  <p className="step-desc mb-0">
                    Implementación de interfaces de usuario robustas con WPF y XAML. Patrones de diseño de software (MVVM). Creación de herramientas con instaladores (MSI) listas para ser distribuidas comercialmente en la empresa.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cómo usar la IA */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-robot text-cyan-400 mr-2"></i>
              El Uso Estratégico de la Inteligencia Artificial
            </h3>
            <p className="text-slate-400 mb-6">
              Ser un BIM Developer moderno no implica memorizar de memoria los cientos de clases y métodos de la Revit API. Se trata de entender la lógica de funcionamiento del motor de Revit y usar la IA (Gemini, Claude) para generar la sintaxis repetitiva.
            </p>

            <h4 className="font-bold text-gray-200 mb-3 text-sm">Prompt 1: Analogías de la API (para aprender)</h4>
            <div className="code-block mb-6">
              <div className="code-header">
                <span className="code-lang">Prompt IA · Conceptos</span>
                <button className="code-copy" onClick={(e) => copyBlock(e)}>Copiar</button>
              </div>
              <pre className="text-xs">Soy Ingeniero Civil / Proyectista Estructural. Explícame el concepto de 'FilteredElementCollector' en Revit API usando una analogía de una obra de construcción o un almacén de materiales.</pre>
            </div>

            <h4 className="font-bold text-gray-200 mb-3 text-sm">Prompt 2: Generar Script en Python</h4>
            <div className="code-block">
              <div className="code-header">
                <span className="code-lang">Prompt IA · Código pyRevit</span>
                <button className="code-copy" onClick={(e) => copyBlock(e)}>Copiar</button>
              </div>
              <pre className="text-xs">Escribe un script de Python para pyRevit. Objetivo: Seleccionar todas las vigas del nivel actual que tengan el parámetro 'Comentarios' vacío. Acción: Asignarles el valor 'Revisar' en ese parámetro. Usa transacciones de Revit. Comenta cada línea en español.</pre>
            </div>
          </div>

          {/* El Portafolio */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-6">
              <i className="fa-solid fa-briefcase text-yellow-500 mr-2"></i>
              El Portafolio que Abre Puertas Internacionales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800/60">
                <div className="text-2xl mb-2">🌍</div>
                <h4 className="font-bold text-white text-sm mb-1">GitHub como tu CV</h4>
                <p className="text-slate-400 text-xs mb-0">Un perfil ordenado con código limpio y READMEs descriptivos vale más que cualquier título universitario formal.</p>
              </div>
              <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800/60">
                <div className="text-2xl mb-2">💼</div>
                <h4 className="font-bold text-white text-sm mb-1">Un Nicho Valioso</h4>
                <p className="text-slate-400 text-xs mb-0">No compitas con desarrolladores genéricos. Posiciónate como especialista BIM automatizador, un perfil escaso y cotizado.</p>
              </div>
              <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800/60">
                <div className="text-2xl mb-2">📹</div>
                <h4 className="font-bold text-white text-sm mb-1">Portafolio Visual</h4>
                <p className="text-slate-400 text-xs mb-0">Publica GIFs o videos cortos (15s) de tus plugins funcionando en Revit. Es la mejor forma de atraer la atención en LinkedIn.</p>
              </div>
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
                <span><strong>El conocimiento del sector es clave</strong>: Tu entendimiento del diseño y detallado estructural es tu mayor ventaja competitiva.</span>
              </li>
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
                <span><strong>Aprende de forma híbrida</strong>: Usa Python para resultados veloces y motivadores, y C# cuando necesites rendimiento empresarial.</span>
              </li>
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
                <span><strong>Crea y muestra</strong>: No programes solo en tu máquina local. Comparte tus herramientas visualmente en comunidades y redes.</span>
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
