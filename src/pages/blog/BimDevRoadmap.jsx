import React from "react";
import { Link } from "react-router-dom";

export default function BimDevRoadmap() {
  const copyBlock = (e) => {
    const pre = e.target.closest('.code-block').querySelector('pre');
    navigator.clipboard.writeText(pre.innerText.trim()).then(() => {
      e.target.textContent = '✓ Copiado';
      setTimeout(() => e.target.textContent = 'Copiar', 2000);
    });
  };

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
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
            
            <div className="space-y-6">
              <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800/60">
                <div className="text-xs font-bold text-orange-400 mb-1">Q1 (MESES 1 - 3)</div>
                <h4 className="font-bold text-white mb-2">Cimientos de Scripting & Revit API</h4>
                <p className="text-slate-400 text-sm mb-0">
                  Foco en sintaxis básica de Python. Aprende a usar la consola interactiva de pyRevit y a realizar selecciones y filtros de elementos mediante la API de Revit utilizando <code className="text-orange-400">FilteredElementCollector</code>.
                </p>
              </div>

              <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800/60">
                <div className="text-xs font-bold text-orange-400 mb-1">Q2 (MESES 4 - 6)</div>
                <h4 className="font-bold text-white mb-2">Automatización de Tareas de Oficina</h4>
                <p className="text-slate-400 text-sm mb-0">
                  Crea tus primeros pushbuttons propios en pyRevit para automatizar reportes de cubicaciones, control de parámetros de planos y revisiones geométricas. Implementación de Git y GitHub para el control de versiones de tu código.
                </p>
              </div>

              <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800/60">
                <div className="text-xs font-bold text-orange-400 mb-1">Q3 (MESES 7 - 9)</div>
                <h4 className="font-bold text-white mb-2">Transición a C# y Desarrollo Industrial</h4>
                <p className="text-slate-400 text-sm mb-0">
                  Introduce C# y la suite de .NET. Configura tu entorno en Visual Studio, asimila conceptos de tipado estático, interfaces como <code className="text-orange-400">IExternalCommand</code> y compila tu primer plugin (.addin) nativo de Revit.
                </p>
              </div>

              <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800/60">
                <div className="text-xs font-bold text-orange-400 mb-1">Q4 (MESES 10 - 12)</div>
                <h4 className="font-bold text-white mb-2">Interfaces de Usuario Avanzadas & Cloud</h4>
                <p className="text-slate-400 text-sm mb-0">
                  Diseño de interfaces gráficas (UI) ricas y responsivas con WPF y patrón MVVM. Conexión de herramientas a bases de datos o APIs externas para reportes y flujos en la nube (BIM 360 / ACC).
                </p>
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
    </div>
  );
}
