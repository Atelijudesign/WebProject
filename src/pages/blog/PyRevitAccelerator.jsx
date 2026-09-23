import { asset } from "../../utils/asset";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export default function PyRevitAccelerator() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);
  const chartRef = useRef(null);

  const samplePythonCode = `# -*- coding: utf-8 -*-
# Cubicación Automática — Andrés Gallo P.
# atelijudesign.com

import clr
clr.AddReference('RevitAPI')
clr.AddReference('RevitAPIUI')

from Autodesk.Revit.DB import (
    FilteredElementCollector,
    BuiltInCategory,
    BuiltInParameter,
    UnitUtils,
    UnitTypeId
)
from pyrevit import revit, DB, forms, script

# —— CONFIGURACIÓN ——————————————————————————————————————————————————————————
DENSIDAD_ACERO     = 7850    # kg/m³
DENSIDAD_HORMIGON  = 2400    # kg/m³
FACTOR_CONEXIONES = 0.05    # 5% por defecto – ajústalo según proyecto

# Clasificación Nominal Weight (kg/m)
CLASES_NW = [
    (0,   20,   "Liviana"),
    (20,  40,   "Media"),
    (40,  80,   "Pesada"),
    (80,  999,  "Extra Pesada")
]`;

  const promptText = `Actúa como un experto en pyRevit y la API de Revit con IronPython.
Necesito un script.py que haga lo siguiente:

TAREA: [Describe tu tarea aquí]

CONTEXTO:
- Uso Revit 2024/2025
- pyRevit 4.8+ instalado
- El script será un pushbutton

REQUISITOS:
- Importar los módulos necesarios (clr, Autodesk.Revit.DB, etc.)
- Usar TransactionGroup o Transaction según corresponda
- Incluir manejo de errores básico (try/except)
- Mostrar un TaskDialog con el resultado al finalizar
- Código comentado en español

Dame el script.py completo y listo para usar.`;

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

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    const chart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: [
          "Velocidad de\nDesarrollo",
          "Curva de\nAprendizaje",
          "Rendimiento",
          "Ecosistema\ny Soporte",
          "UI\nAvanzada",
          "Distribución\nComercial",
        ],
        datasets: [
          {
            label: "pyRevit (Python)",
            data: [95, 90, 50, 70, 40, 30],
            backgroundColor: "rgba(34, 197, 94, 0.15)",
            borderColor: "rgba(34, 197, 94, 0.8)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(34, 197, 94, 1)",
            pointBorderColor: "#fff",
            pointHoverRadius: 6,
          },
          {
            label: "C# Add-in (.NET)",
            data: [40, 35, 95, 85, 95, 95],
            backgroundColor: "rgba(59, 130, 246, 0.15)",
            borderColor: "rgba(59, 130, 246, 0.8)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(59, 130, 246, 1)",
            pointBorderColor: "#fff",
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: "#374151" },
            grid: { color: "#1f2937" },
            pointLabels: {
              font: { size: 11, family: "Inter, sans-serif" },
              color: "#9ca3af",
            },
            ticks: { display: false, max: 100 },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: function (tooltipItems) {
                return tooltipItems[0].chart.data.labels[
                  tooltipItems[0].dataIndex
                ];
              },
            },
          },
          legend: {
            position: "bottom",
            labels: { color: "#9ca3af" },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, []);

  const shareUrl = getShareUrl("/blog/pyrevit-accelerator");
  const shareTitle = encodeURIComponent(isEn ? "pyRevit Accelerator: The Fast Track to Building Custom Revit Apps" : "pyRevit Accelerator: Automatiza Revit con Python e IA");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "pyRevit Accelerator: The Fast Track to Building Custom Revit Apps" : "pyRevit Accelerator: Automatiza Revit con Python e IA"}
        description={isEn ? "Discover why pyRevit is the fastest way to build productivity tools for Revit. App anatomy, the 7-step development framework, and the definitive C# comparison." : "Tutorial completo de pyRevit Accelerator para automatización de Revit con Python, IA y cubicación automática de acero."}
        path="/blog/pyrevit-accelerator"
      />
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-yellow-500 via-green-500 to-blue-500 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Header Section */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/40 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-bim-blue rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <Link
              to="/blog"
              className="text-bim-blue hover:text-blue-400 text-sm font-medium transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-1" /> {isEn ? "Back to Blog" : "Volver al Blog"}
            </Link>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-green-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-brands fa-python mr-1" /> pyRevit
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 17 Feb 2026
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "8 min read" : "8 min lectura"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            {isEn ? "pyRevit Accelerator: The Fast Track to Building Custom Revit Apps" : (
              <><span className="text-yellow-400 text-5xl">⚡</span> pyRevit{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-yellow-400">
              Accelerator
            </span></>
            )}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {isEn ? "Discover why pyRevit is the fastest way to build productivity tools for Revit. App anatomy, the 7-step development framework, and the definitive C# comparison." : (
              <>El camino más rápido para crear herramientas personalizadas dentro de Revit usando Python e IronPython. Sin compilar, sin Visual Studio.</>
            )}
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-[#0b1220]/60 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">

          {/* Intro Card */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 mb-10 shadow-2xl">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <i className="fa-solid fa-rocket text-blue-400" />
              <span>¿Qué es pyRevit?</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              <strong className="text-white">pyRevit</strong> es un framework de código abierto que permite crear
              extensiones para Revit usando <strong className="text-blue-400">Python (IronPython)</strong>. No necesitas
              Visual Studio, C# ni compilar DLLs. Simplemente escribes scripts{" "}
              <code className="bg-slate-800 text-blue-300 px-2 py-0.5 rounded text-sm font-mono">.py</code>, los
              colocas en una estructura de carpetas específica, y pyRevit los convierte automáticamente en botones dentro
              de la interfaz de Revit.
            </p>
            <p className="text-slate-400 mb-0 leading-relaxed">
              Para un proyectista estructural o modelador BIM que busca optimizar tiempos de entrega, este es el camino de menor
              resistencia para empezar a automatizar su trabajo en Revit.
            </p>
          </div>

          {/* Folder Structure Card */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 mb-10 shadow-2xl">
            <h3 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-3">
              <i className="fa-solid fa-folder-tree text-yellow-400" />
              <span>Anatomía de una App pyRevit</span>
            </h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              La estructura de carpetas <strong className="text-white">ES el código</strong>. pyRevit lee los nombres de
              las carpetas para crear la interfaz de usuario automáticamente.
            </p>
            <div className="bg-[#0b1324] rounded-xl p-6 border border-slate-800 font-mono text-sm shadow-inner">
              <div className="flex items-center gap-2 mb-3">
                <i className="fa-solid fa-folder text-yellow-400" />
                <span className="text-yellow-400 font-bold">MiExtension.extension/</span>
                <span className="text-slate-500 ml-2">← Carpeta raíz</span>
              </div>
              <div className="pl-4 border-l border-slate-800 ml-2">
                <div className="flex items-center gap-2 mb-3 mt-3">
                  <i className="fa-solid fa-folder text-blue-400" />
                  <span className="text-blue-400 font-bold">MiTab.tab/</span>
                  <span className="text-slate-500 ml-2">← Pestaña en ribbon</span>
                </div>
                <div className="pl-4 border-l border-slate-800 ml-2">
                  <div className="flex items-center gap-2 mb-3 mt-3">
                    <i className="fa-solid fa-folder text-cyan-400" />
                    <span className="text-cyan-400 font-bold">MiPanel.panel/</span>
                    <span className="text-slate-500 ml-2">← Panel de botones</span>
                  </div>
                  <div className="pl-4 border-l border-slate-800 ml-2">
                    <div className="flex items-center gap-2 mb-3 mt-3">
                      <i className="fa-solid fa-folder text-green-400" />
                      <span className="text-green-400 font-bold">MiHerramienta.pushbutton/</span>
                      <span className="text-slate-500 ml-2">← Botón</span>
                    </div>
                    <div className="pl-4 border-l border-slate-800 ml-2 space-y-2 mt-2">
                      <div className="flex items-center gap-2">
                        <i className="fa-brands fa-python text-green-400" />
                        <span className="text-green-300 font-bold">script.py</span>
                        <span className="text-slate-500 ml-2">← Tu código</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fa-regular fa-image text-purple-400" />
                        <span className="text-purple-300 font-bold">icon.png</span>
                        <span className="text-slate-500 ml-2">← Icono del botón</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FIGURA 1: PYREVIT ARCHITECTURE DIAGRAM */}
            <figure className="my-8 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
              <img
                src={asset("/assets/img/blog/news/pyrevit_architecture_diagram.png")}
                alt="Arquitectura de carpetas y funcionamiento de pyRevit para Autodesk Revit"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
                <i className="fa-solid fa-camera mr-1 text-green-400" /> {isEn ? "Figure 1:" : "Figura 1:"} Arquitectura jerárquica de extensiones pyRevit (.extension ➔ .tab ➔ .panel ➔ .pushbutton) con soporte para IronPython/CPython e interfaces XAML.
              </figcaption>
            </figure>

            {/* Code Snippet Example */}
            <div className="mt-8">
              <CodeBlock code={samplePythonCode} filename="script.py" language="PYREVIT" />
            </div>
          </div>

          {/* 7 Steps Process Card */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 mb-10 shadow-2xl">
            <h3 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-3">
              <i className="fa-solid fa-list-ol text-blue-400" />
              <span>El Proceso de 7 Pasos</span>
            </h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Desde la idea hasta el botón funcional en Revit. Sigue estos pasos para crear cualquier herramienta:
            </p>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4 items-start group">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30 text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">Identifica el Dolor</h4>
                  <p className="text-slate-400 text-sm mb-0 leading-relaxed">
                    ¿Qué tarea repetitiva te roba tiempo? Cuantifica: "Paso X horas haciendo Y manualmente".
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-start group">
                <div className="w-9 h-9 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-700/30 text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">Describe la Solución</h4>
                  <p className="text-slate-400 text-sm mb-0 leading-relaxed">
                    Escribe en lenguaje natural lo que quieres. Un prompt claro es la mitad del trabajo.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start group">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/30 text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">Genera el Código con IA</h4>
                  <p className="text-slate-400 text-sm mb-0 leading-relaxed">
                    Usa Gemini, Claude o ChatGPT. Pégale tu prompt + el contexto de la API que necesitas.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 items-start group">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-600/30 text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">Crea la Estructura de Carpetas</h4>
                  <p className="text-slate-400 text-sm mb-0 leading-relaxed">
                    Crea{" "}
                    <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">
                      .extension
                    </code>{" "}
                    →{" "}
                    <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">
                      .tab
                    </code>{" "}
                    →{" "}
                    <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">
                      .panel
                    </code>{" "}
                    →{" "}
                    <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">
                      .pushbutton
                    </code>
                    .
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4 items-start group">
                <div className="w-9 h-9 rounded-full bg-fuchsia-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-lg shadow-fuchsia-600/30 text-sm">
                  5
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">
                    Pega tu{" "}
                    <code className="bg-slate-800 text-green-300 px-1.5 py-0.5 rounded text-xs font-mono">
                      script.py
                    </code>
                  </h4>
                  <p className="text-slate-400 text-sm mb-0 leading-relaxed">
                    Coloca el código generado dentro de la carpeta{" "}
                    <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">
                      .pushbutton
                    </code>
                    .
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex gap-4 items-start group">
                <div className="w-9 h-9 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-lg shadow-pink-600/30 text-sm">
                  6
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">Recarga en pyRevit</h4>
                  <p className="text-slate-400 text-sm mb-0 leading-relaxed">
                    Abre Revit → Pestaña pyRevit → "Reload". Tu botón aparece automáticamente.
                  </p>
                </div>
              </div>

              {/* Step 7 */}
              <div className="flex gap-4 items-start group">
                <div className="w-9 h-9 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-600/30 text-sm">
                  7
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">Prueba, Itera, Mejora</h4>
                  <p className="text-slate-400 text-sm mb-0 leading-relaxed">
                    Si falla, lee el error, ajusta el script, y recarga. Ciclo rápido de feedback.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Radar Chart Card */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 mb-10 shadow-2xl">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <i className="fa-solid fa-chart-radar text-cyan-400" />
              <span>pyRevit vs C# Add-in: Comparativa</span>
            </h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Diferentes herramientas para diferentes objetivos. Elige según tu caso de uso:
            </p>

            <div className="w-full h-80 relative mb-8">
              <canvas ref={chartRef} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-[#0c2e24] rounded-xl border border-emerald-800/60">
                <h4 className="font-bold text-emerald-400 text-sm mb-1 flex items-center gap-2">
                  <i className="fa-brands fa-python" />
                  <span>pyRevit (Python)</span>
                </h4>
                <p className="text-slate-400 text-xs mb-0 leading-relaxed">
                  Ideal para automatizaciones rápidas, prototipos, herramientas internas y scripting diario.
                </p>
              </div>
              <div className="p-4 bg-[#111927] rounded-xl border border-blue-800/60">
                <h4 className="font-bold text-blue-400 text-sm mb-1 flex items-center gap-2">
                  <i className="fa-solid fa-code" />
                  <span>C# Add-in (.NET)</span>
                </h4>
                <p className="text-slate-400 text-xs mb-0 leading-relaxed">
                  Ideal para productos comerciales, plugins complejos con UI avanzada, y rendimiento crítico.
                </p>
              </div>
            </div>
          </div>

          {/* AI Prompt Helper Card */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 mb-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3 relative z-10">
              <i className="fa-solid fa-wand-magic-sparkles text-purple-400" />
              <span>Tu Primer Prompt para la IA</span>
            </h3>
            <p className="text-slate-400 mb-6 relative z-10 leading-relaxed">
              Copia este prompt y pégalo en tu chat con Gemini, Claude o ChatGPT para generar tu primer script de pyRevit:
            </p>
            <div className="relative z-10">
              <CodeBlock code={promptText} filename="prompt_inicial.py" language="PROMPT" />
            </div>
          </div>

          {/* Key Takeaways Card */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 border-l-4 border-l-bim-blue mb-10 shadow-2xl">
            <h3 className="text-xl font-extrabold text-white mb-4 flex items-center gap-3">
              <i className="fa-solid fa-lightbulb text-yellow-400" />
              <span>{isEn ? "Key Conclusions" : "Conclusiones Clave"}</span>
            </h3>
            <ul className="space-y-3 mb-0">
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-3 mt-1">
                  <i className="fa-solid fa-check-circle" />
                </span>
                <span>
                  <strong className="text-white">pyRevit es la puerta de entrada</strong> al desarrollo BIM. No necesitas saber C# para empezar.
                </span>
              </li>
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-3 mt-1">
                  <i className="fa-solid fa-check-circle" />
                </span>
                <span>
                  <strong className="text-white">La estructura de carpetas es la configuración</strong>. No hay XML ni manifiestos complicados.
                </span>
              </li>
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-3 mt-1">
                  <i className="fa-solid fa-check-circle" />
                </span>
                <span>
                  <strong className="text-white">La IA es tu copiloto</strong>. Usa prompts claros y específicos para generar el código base.
                </span>
              </li>
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-3 mt-1">
                  <i className="fa-solid fa-check-circle" />
                </span>
                <span>
                  <strong className="text-white">Empieza pequeño</strong>. Una herramienta que te ahorre 5 minutos al día = 20 horas al año.
                </span>
              </li>
            </ul>
          </div>

          {/* SECCIÓN: FUENTES Y ENLACES OFICIALES */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-slate-800/60 mb-10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-link text-green-400" />
              Fuentes Oficiales y Recursos de pyRevit
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://github.com/pyrevitlabs/pyRevit"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-green-500/50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-green-950/60 text-green-400 text-sm group-hover:scale-110 transition-transform">
                  <i className="fa-brands fa-github" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-green-300 transition-colors flex items-center justify-between">
                    <span>pyRevit GitHub Repository</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500" />
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    pyrevitlabs/pyRevit (Ehsan Iran-Nejad)
                  </div>
                </div>
              </a>

              <a
                href="https://pyrevitlabs.notion.site/pyRevit-Documentation"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400 text-sm group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-book" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors flex items-center justify-between">
                    <span>pyRevit Official Docs</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500" />
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    pyRevit Developer Documentation & CLI
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SHARE BUTTONS ─── */}
      <ShareArticle url={shareUrl} title={shareTitle} />

      {/* Article Navigation Footer */}
      <section className="py-12 bg-[#030712] border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center text-bim-blue font-bold hover:text-blue-400 transition-colors group text-base"
          >
            <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform" />
            {isEn ? "Back to Blog" : "Volver al Blog"}
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
