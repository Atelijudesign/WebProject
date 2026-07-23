import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";

/* ───────── Quarter data ───────── */
const quarters = {
  1: {
    title: "T1: Victoria Rápida con pyRevit",
    subtitle: "Mes 1 – 3",
    color: "blue",
    icon: "fa-solid fa-rocket",
    focus: "Python & Lógica Básica",
    description:
      "No se toca C# todavía. Se aprovecha la velocidad de pyRevit para obtener resultados inmediatos. La meta es automatizar tareas repetitivas desde el primer mes.",
    modules: [
      {
        title: "Entorno & Python Básico",
        icon: "fa-solid fa-terminal",
        detail:
          "Instalar pyRevit y VS Code. Variables, Listas, Loops (iterar vigas), Condicionales (if largo mayor a 5m).",
      },
      {
        title: "Revit API 'Lite'",
        icon: "fa-solid fa-magnifying-glass",
        detail:
          "Entender qué es un Element, un Parameter y una Category. Usar RevitLookup para inspeccionar objetos del modelo.",
      },
      {
        title: "Primer Script",
        icon: "fa-solid fa-play",
        detail:
          "Crear un botón en pyRevit que cuente cuántas vigas hay seleccionadas o que liste todos los niveles del proyecto.",
      },
      {
        title: "Proyecto Hito",
        icon: "fa-solid fa-trophy",
        detail:
          "'Renombrador Automático': selecciona elementos y los renombra con un prefijo + correlativo. La primera herramienta real.",
      },
    ],
  },
  2: {
    title: "T2: Profundizando la API",
    subtitle: "Mes 4 – 6",
    color: "indigo",
    icon: "fa-solid fa-layer-group",
    focus: "Conceptos API & Datos Masivos",
    description:
      "Se sigue con Python, pero se empieza a pensar como el motor de Revit. Geometría, manipulación de datos en masa y comunicación con Excel.",
    modules: [
      {
        title: "FilteredElementCollector",
        icon: "fa-solid fa-filter",
        detail:
          "El corazón de la API. Aprender a buscar rápidamente en el modelo (encontrar todos los muros del Tipo X, vigas del Nivel 2, etc.).",
      },
      {
        title: "Transacciones & Modificación",
        icon: "fa-solid fa-pen-to-square",
        detail:
          "Crear, borrar, mover y rotar elementos dentro de una Transacción. Manejo de errores con Try/Except.",
      },
      {
        title: "Excel ↔ Revit",
        icon: "fa-solid fa-file-excel",
        detail:
          "Usar librerías de Python para leer un Excel y volcar datos a parámetros de Revit (y viceversa). Automatización de reportes.",
      },
      {
        title: "Proyecto Hito",
        icon: "fa-solid fa-trophy",
        detail:
          "'Creador de Planos': lee un archivo Excel con lista de planos (nombre, escala, vista) y los crea en Revit automáticamente.",
      },
    ],
  },
  3: {
    title: "T3: El Salto Profesional",
    subtitle: "Mes 7 – 9",
    color: "purple",
    icon: "fa-solid fa-code",
    focus: "C# & Interfaces Visuales",
    description:
      "Python es genial para prototipos, pero C# es el estándar industrial. Se traduce lo aprendido a C# y se crean interfaces profesionales con WPF.",
    modules: [
      {
        title: "Intro a C# & Visual Studio",
        icon: "fa-brands fa-microsoft",
        detail:
          "Tipado estático (int, string, double). La sintaxis cambia, la lógica es la misma. Implementar IExternalCommand.",
      },
      {
        title: "WPF (Windows Presentation)",
        icon: "fa-solid fa-window-maximize",
        detail:
          "Crear interfaces profesionales con XAML: botones, dropdowns, barras de progreso. La herramienta deja de 'verse fea'.",
      },
      {
        title: "Migración Python → C#",
        icon: "fa-solid fa-arrows-rotate",
        detail:
          "Se toma el mejor script de Python y se reescribe como un Plugin compilado (.dll). Se nota el salto en velocidad.",
      },
      {
        title: "Proyecto Hito",
        icon: "fa-solid fa-trophy",
        detail:
          "'Quality Checker': una ventana WPF que audita el modelo (vigas sin material, muros duplicados) y muestra un reporte visual.",
      },
    ],
  },
  4: {
    title: "T4: Portafolio & Despliegue",
    subtitle: "Mes 10 – 12",
    color: "orange",
    icon: "fa-solid fa-rocket",
    focus: "Distribución & Marca Personal",
    description:
      "Ya se sabe programar. Ahora toca empaquetar las herramientas, subirlas a GitHub y construir una marca personal que abra puertas laborales.",
    modules: [
      {
        title: "Git & GitHub",
        icon: "fa-brands fa-github",
        detail:
          "Control de versiones. El código en la nube. Aprender Commit, Push, Branch. Cada repositorio es una carta de presentación.",
      },
      {
        title: "Instaladores (.msi)",
        icon: "fa-solid fa-box-open",
        detail:
          "Usar herramientas como InnoSetup o WiX para que el plugin se instale con doble clic. Distribución profesional.",
      },
      {
        title: "Marca Personal",
        icon: "fa-solid fa-user-tie",
        detail:
          "Limpiar el perfil de LinkedIn. Subir videos de las herramientas en acción. Postular a trabajos remotos de nicho BIM.",
      },
      {
        title: "Proyecto Final",
        icon: "fa-solid fa-trophy",
        detail:
          "'Suite BIM': un Tab completo en la Ribbon de Revit con las 5 mejores herramientas, con iconos propios e instalador profesional.",
      },
    ],
  },
};

const colorMap = {
  blue: {
    bg: "from-blue-900/20 to-blue-800/10",
    border: "border-blue-600/30",
    text: "text-blue-400",
    badge: "bg-blue-900/40 text-blue-300",
  },
  indigo: {
    bg: "from-indigo-900/20 to-indigo-800/10",
    border: "border-indigo-600/30",
    text: "text-indigo-400",
    badge: "bg-indigo-900/40 text-indigo-300",
  },
  purple: {
    bg: "from-purple-900/20 to-purple-800/10",
    border: "border-purple-600/30",
    text: "text-purple-400",
    badge: "bg-purple-900/40 text-purple-300",
  },
  orange: {
    bg: "from-orange-900/20 to-orange-800/10",
    border: "border-orange-600/30",
    text: "text-orange-400",
    badge: "bg-orange-900/40 text-orange-300",
  },
};

/* ───────── Component ───────── */
export default function BimDevRoadmap() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeQuarter, setActiveQuarter] = useState(1);
  const [copied, setCopied] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(null);

  // Chart refs
  const learningCurveRef = useRef(null);
  const aiUsageRef = useRef(null);
  const timeAllocRef = useRef(null);
  const chartInstances = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (height > 0) setScrollProgress((winScroll / height) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize charts
  useEffect(() => {
    // Destroy previous instances
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    // Chart 1: Learning Curve (Line)
    if (learningCurveRef.current) {
      const ctx1 = learningCurveRef.current.getContext("2d");
      chartInstances.current.push(
        new Chart(ctx1, {
          type: "line",
          data: {
            labels: ["Mes 1", "Mes 3", "Mes 6", "Mes 9", "Mes 12"],
            datasets: [
              {
                label: "Python / pyRevit (Velocidad)",
                data: [100, 90, 60, 30, 20],
                borderColor: "#f97316",
                backgroundColor: "rgba(249, 115, 22, 0.08)",
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: "#f97316",
              },
              {
                label: "C# / .NET (Potencia)",
                data: [0, 10, 40, 70, 80],
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.08)",
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: "#3b82f6",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { color: "#9ca3af", font: { size: 11 } },
              },
              tooltip: { mode: "index", intersect: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: "% de Tiempo",
                  color: "#6b7280",
                },
                ticks: { color: "#6b7280" },
                grid: { color: "#1f2937" },
              },
              x: {
                ticks: { color: "#6b7280" },
                grid: { color: "#1f2937" },
              },
            },
          },
        })
      );
    }

    // Chart 2: AI Usage Evolution (Stacked Bar)
    if (aiUsageRef.current) {
      const ctx2 = aiUsageRef.current.getContext("2d");
      chartInstances.current.push(
        new Chart(ctx2, {
          type: "bar",
          data: {
            labels: [
              "Meses 1-3 (Conceptos)",
              "Meses 4-8 (Boilerplate)",
              "Meses 9-12 (Optimización)",
            ],
            datasets: [
              {
                label: "Preguntar \"Explícame qué es...\"",
                data: [80, 20, 5],
                backgroundColor: "#3b82f6",
              },
              {
                label: "Pedir \"Escribe el código base...\"",
                data: [10, 60, 40],
                backgroundColor: "#06b6d4",
              },
              {
                label: "Pedir \"Refactoriza/Arregla esto...\"",
                data: [10, 20, 55],
                backgroundColor: "#8b5cf6",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                titleColor: "#f8fafc",
                bodyColor: "#cbd5e1",
                padding: 10,
              },
              legend: {
                labels: {
                  usePointStyle: true,
                  color: "#94a3b8",
                  font: { size: 12 },
                },
              },
            },
            scales: {
              x: {
                stacked: true,
                grid: { display: false },
                ticks: { color: "#94a3b8" },
              },
              y: {
                stacked: true,
                beginAtZero: true,
                grid: { color: "#1e293b" },
                max: 100,
                ticks: { color: "#94a3b8" },
              },
            },
          },
        })
      );
    }

    // Chart 3: Time Allocation (Line)
    if (timeAllocRef.current) {
      const ctx3 = timeAllocRef.current.getContext("2d");
      chartInstances.current.push(
        new Chart(ctx3, {
          type: "line",
          data: {
            labels: ["Mes 1", "Mes 3", "Mes 6", "Mes 9", "Mes 12"],
            datasets: [
              {
                label: "Estudio Teoría",
                data: [80, 60, 30, 20, 10],
                borderColor: "#60a5fa",
                backgroundColor: "rgba(96, 165, 250, 0.5)",
                fill: true,
                tension: 0.3,
              },
              {
                label: "Escribir Código",
                data: [20, 40, 70, 80, 90],
                borderColor: "#22d3ee",
                backgroundColor: "rgba(34, 211, 238, 0.5)",
                fill: true,
                tension: 0.3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                titleColor: "#f8fafc",
                bodyColor: "#cbd5e1",
                padding: 10,
              },
              legend: {
                labels: { color: "#94a3b8", font: { size: 11 } },
              },
            },
            scales: {
              y: {
                stacked: false,
                beginAtZero: true,
                max: 100,
                grid: { color: "#334155" },
                ticks: { color: "#94a3b8" },
              },
              x: {
                grid: { color: "#334155" },
                ticks: { color: "#94a3b8" },
              },
            },
          },
        })
      );
    }

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
      chartInstances.current = [];
    };
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const copyPromptText = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedPrompt(id);
      setTimeout(() => setCopiedPrompt(null), 2000);
    });
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(
    "De Profesional de Obra a BIM Software Developer en 12 Meses"
  );

  const q = quarters[activeQuarter];
  const c = colorMap[q.color];

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-orange-500 via-amber-400 to-blue-500 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ─── HERO ─── */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/40 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-60 h-60 bg-orange-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-blue-500 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Link
              to="/blog"
              className="text-bim-blue hover:text-blue-400 text-sm font-bold transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-1" /> Blog
            </Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-500 text-sm">Roadmap</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="bg-orange-600/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full border border-orange-600/30">
              <i className="fa-solid fa-map mr-1" /> Roadmap
            </span>
            <span className="bg-blue-600/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-600/30">
              <i className="fa-solid fa-code mr-1" /> pyRevit + C#
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            De{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #f97316, #3b82f6)",
              }}
            >
              Profesional de Obra
            </span>{" "}
            a{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #f97316, #3b82f6)",
              }}
            >
              BIM Software Developer
            </span>{" "}
            en 12 Meses
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mb-6 leading-relaxed">
            Una guía paso a paso para que cualquier profesional de la
            construcción pueda transicionar hacia el desarrollo de software BIM.
            Enfoque híbrido: Python/pyRevit para victorias rápidas + C#/.NET
            para potencia industrial.
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
            <span>
              <i className="fa-regular fa-calendar mr-1" /> 17 Feb 2026
            </span>
            <span className="w-1 h-1 bg-gray-400 rounded-full" />
            <span>
              <i className="fa-regular fa-clock mr-1" /> 15 min lectura
            </span>
            <span className="w-1 h-1 bg-gray-400 rounded-full" />
            <span>
              <i className="fa-solid fa-user-pen mr-1" /> Andrés Gallo P.
            </span>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Quick Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-6 glass-card rounded-xl border-l-4 border-blue-500 hover:border-blue-400 transition-all">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-bold text-white">El Objetivo</h3>
            <p className="text-sm text-gray-400 mt-1">
              Crear plugins propios para Revit, automatizar flujos BIM y
              posicionarse como desarrollador especializado en 12 meses.
            </p>
          </div>
          <div className="p-6 glass-card rounded-xl border-l-4 border-cyan-500 hover:border-cyan-400 transition-all">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-bold text-white">El Aliado</h3>
            <p className="text-sm text-gray-400 mt-1">
              Uso intensivo de IA (Gemini/Claude) como tutor personal y
              generador de código base.
            </p>
          </div>
          <div className="p-6 glass-card rounded-xl border-l-4 border-indigo-500 hover:border-indigo-400 transition-all">
            <div className="text-2xl mb-2">💻</div>
            <h3 className="font-bold text-white">El Stack</h3>
            <p className="text-sm text-gray-400 mt-1">
              Python/pyRevit (inicio rápido) → C# .NET, Revit API 2025, Visual
              Studio, WPF, Git.
            </p>
          </div>
        </section>

        {/* The Advantage + Learning Curve Chart */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="glass-card p-8 rounded-2xl border-l-4 border-orange-500">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🏗️</span> La Ventaja del Profesional
              de Obra
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Un programador junior puede tardar años en entender qué es una
              "conexión a momento" o cómo funciona una estructura aporticada. El
              profesional de la construcción que decide dar el salto al
              desarrollo ya tiene esa ventaja:{" "}
              <strong className="text-white">
                no aprende a programar para "ver qué sale", sino para resolver
                los problemas que lo han acompañado durante toda su carrera.
              </strong>
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full font-bold border border-gray-700">
                Experiencia en Obra
              </span>
              <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full font-bold border border-gray-700">
                Lógica Estructural
              </span>
              <span className="px-3 py-1 bg-orange-900/30 text-orange-400 text-xs rounded-full font-bold border border-orange-800">
                Resolución de Problemas
              </span>
            </div>
          </div>

          {/* Learning Curve Chart */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase text-center tracking-wider">
              <i className="fa-solid fa-chart-line mr-2" />
              Curva de Aprendizaje Recomendada
            </h3>
            <div className="relative w-full" style={{ height: "280px" }}>
              <canvas ref={learningCurveRef} />
            </div>
          </div>
        </section>

        {/* ─── INTERACTIVE QUARTERS ─── */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <span className="text-bim-blue font-bold tracking-wider text-xs uppercase">
                Plan Estratégico
              </span>
              <h2 className="text-3xl font-bold text-white mt-2">
                El Plan de Batalla (12 Meses)
              </h2>
              <p className="text-gray-400 mt-1 text-sm">
                Divide y vencerás. Cuatro trimestres estratégicos.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setActiveQuarter(n)}
                  className={`px-5 py-2.5 text-sm font-bold rounded-lg border transition-all duration-200 ${
                    activeQuarter === n
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                      : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600"
                  }`}
                >
                  <i className={`fa-solid fa-${n} mr-1`} /> T{n}
                </button>
              ))}
            </div>
          </div>

          {/* Quarter Content Panel */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Left panel */}
              <div
                className={`p-8 lg:col-span-1 bg-gradient-to-br ${c.bg} border-b lg:border-b-0 lg:border-r border-gray-700`}
              >
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  <i className={`${q.icon} mr-1`} /> {q.subtitle}
                </span>
                <h3 className="text-2xl font-bold text-white mt-3 mb-4">
                  {q.title}
                </h3>
                <div
                  className={`mb-6 p-4 rounded-xl border ${c.border} bg-gray-800/50`}
                >
                  <p className={`text-sm ${c.text} leading-relaxed`}>
                    {q.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-semibold">
                    Enfoque:
                  </span>
                  <span
                    className={`${c.badge} text-xs font-bold px-3 py-1 rounded-full`}
                  >
                    {q.focus}
                  </span>
                </div>
              </div>

              {/* Right panel: Modules */}
              <div className="p-8 lg:col-span-2">
                <h4 className="font-bold text-gray-400 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <i className="fa-solid fa-cubes" /> Módulos de Trabajo
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.modules.map((mod, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-xl border border-gray-700 bg-gray-800/30 hover:bg-gray-800/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center">
                          <i className={`${mod.icon} ${c.text} text-sm`} />
                        </div>
                        <h5 className="font-bold text-white text-sm">
                          {mod.title}
                        </h5>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed pl-11">
                        {mod.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── AI INTEGRATION ─── */}
        <section>
          <div className="text-center mb-10">
            <span className="text-bim-blue font-bold tracking-wider text-xs uppercase">
              Acelerador de Carrera
            </span>
            <h2 className="text-3xl font-bold text-white mt-2">
              Cómo Usar la IA (Gemini / Claude)
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-2">
              No se trata de memorizar sintaxis. Se trata de entender la lógica
              y pedirle a la IA que escriba el código repetitivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Prompt Structure Guide */}
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-4">
                📐 La Estructura del Prompt Perfecto
              </h3>
              <div className="space-y-4 text-sm text-gray-300">
                <div className="bg-gray-800 p-3 rounded shadow-sm border-l-4 border-green-500">
                  <strong>1. Rol:</strong> "Actúa como un Desarrollador Senior
                  de Revit API experto en C#."
                </div>
                <div className="bg-gray-800 p-3 rounded shadow-sm border-l-4 border-blue-500">
                  <strong>2. Contexto:</strong> "Soy un ingeniero estructural
                  aprendiendo. Usa analogías de construcción."
                </div>
                <div className="bg-gray-800 p-3 rounded shadow-sm border-l-4 border-amber-500">
                  <strong>3. Tarea Específica:</strong> "Explícame cómo funciona
                  FilteredElementCollector para obtener solo columnas
                  estructurales."
                </div>
                <div className="bg-gray-800 p-3 rounded shadow-sm border-l-4 border-purple-500">
                  <strong>4. Formato:</strong> "Dame el código comentado línea
                  por línea y explica por qué usaste ese método."
                </div>
              </div>
            </div>

            {/* Practical Prompts */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-2xl">🤖</span> Prompts Reales para el Día
                a Día
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Dos ejemplos concretos que se pueden usar desde la primera
                semana:
              </p>

              <div className="space-y-4">
                <div className="bg-gray-800/80 p-5 rounded-xl border border-gray-700 hover:border-orange-600/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                      <i className="fa-solid fa-graduation-cap mr-1" /> Prompt
                      para Aprender Conceptos
                    </div>
                    <button
                      onClick={() =>
                        copyPromptText(
                          "Soy Ingeniero Civil / Proyectista Estructural. Explícame el concepto de 'FilteredElementCollector' en Revit API usando una analogía de una obra de construcción o un almacén de materiales.",
                          "p1"
                        )
                      }
                      className="text-xs text-gray-500 hover:text-orange-400 transition-colors"
                    >
                      {copiedPrompt === "p1" ? (
                        <>
                          <i className="fa-solid fa-check mr-1" /> ¡Copiado!
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-copy mr-1" /> Copiar
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-mono text-xs text-green-400 leading-relaxed">
                    "Soy Ingeniero Civil / Proyectista Estructural. Explícame el
                    concepto de 'FilteredElementCollector' en Revit API usando
                    una analogía de una obra de construcción o un almacén de
                    materiales."
                  </p>
                </div>
                <div className="bg-gray-800/80 p-5 rounded-xl border border-gray-700 hover:border-blue-600/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                      <i className="fa-solid fa-code mr-1" /> Prompt para
                      Generar Código (pyRevit)
                    </div>
                    <button
                      onClick={() =>
                        copyPromptText(
                          "Escribe un script de Python para pyRevit.\nObjetivo: Seleccionar todas las vigas del nivel actual que tengan el parámetro 'Comentarios' vacío.\nAcción: Asignarles el valor 'Revisar' en ese parámetro.\nUsa transacciones de Revit. Comenta cada línea en español.",
                          "p2"
                        )
                      }
                      className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
                    >
                      {copiedPrompt === "p2" ? (
                        <>
                          <i className="fa-solid fa-check mr-1" /> ¡Copiado!
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-copy mr-1" /> Copiar
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-mono text-xs text-green-400 leading-relaxed">
                    "Escribe un script de Python para pyRevit.
                    <br />
                    Objetivo: Seleccionar todas las vigas del nivel actual que
                    tengan el parámetro 'Comentarios' vacío.
                    <br />
                    Acción: Asignarles el valor 'Revisar' en ese parámetro.
                    <br />
                    Usa transacciones de Revit. Comenta cada línea en español."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Usage Evolution Chart */}
          <div className="glass-card p-6 rounded-2xl mt-8">
            <h3 className="text-lg font-bold text-white mb-2 text-center">
              Evolución del Uso de IA
            </h3>
            <p className="text-xs text-gray-400 mb-4 text-center max-w-xl mx-auto">
              Cómo cambia la interacción con la IA a medida que se avanza.
            </p>
            <div
              className="relative w-full mx-auto"
              style={{ height: "300px", maxWidth: "600px" }}
            >
              <canvas ref={aiUsageRef} />
            </div>
          </div>
        </section>

        {/* ─── PORTFOLIO + EFFORT DISTRIBUTION ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Portfolio */}
          <div className="glass-card p-6 rounded-2xl border-l-4 border-orange-500">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <i className="fa-solid fa-briefcase text-orange-500" /> El
              Portafolio que Abre Puertas
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">🌍</span>
                <div>
                  <strong className="text-sm text-white block mb-1">
                    GitHub es el Nuevo Título
                  </strong>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    En el mundo tech, un repositorio con código limpio y
                    soluciones reales vale más que un papel. El portafolio habla
                    por sí mismo.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">💼</span>
                <div>
                  <strong className="text-sm text-white block mb-1">
                    Un Nicho Único
                  </strong>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    No eres un "Junior Developer" genérico. Eres un especialista
                    BIM que automatiza. Ese perfil es muy valorado en USA,
                    Europa y Australia.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">📹</span>
                <div>
                  <strong className="text-sm text-white block mb-1">
                    El Portafolio Visual
                  </strong>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    GIFs o videos cortos (15s) mostrando las herramientas
                    funcionando dentro de Revit. Publicarlos en LinkedIn atrae
                    reclutadores.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Effort Distribution */}
          <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Distribución del Esfuerzo
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Para tener éxito en 12 meses, hay que disciplinar el tiempo. Al
              principio, la teoría domina. Al final, la construcción de
              portafolio y código complejo toman el control.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-gray-700 pb-2">
                  <span className="text-blue-400 font-medium">
                    Teoría (C# / API Docs)
                  </span>
                  <span className="text-gray-500">Vital en Fase 1 y 2</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-gray-700 pb-2">
                  <span className="text-cyan-400 font-medium">
                    Práctica (Coding)
                  </span>
                  <span className="text-gray-500">Crece exponencialmente</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-gray-700 pb-2">
                  <span className="text-amber-400 font-medium">
                    Debugging (Errores)
                  </span>
                  <span className="text-gray-500">
                    La realidad del developer
                  </span>
                </div>
              </div>
              <div
                className="bg-gray-800/30 p-3 rounded-xl border border-gray-700 relative w-full"
                style={{ height: "250px" }}
              >
                <canvas ref={timeAllocRef} />
              </div>
            </div>
          </div>
        </section>

        {/* ─── SHARE ─── */}
        <section className="pt-10 text-center">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-bold shadow-lg hover:shadow-gray-500/30 transition-all hover:-translate-y-0.5 border border-gray-700"
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
        </section>

        {/* Back to Blog */}
        <section className="text-center pt-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-bim-blue font-bold hover:text-blue-400 transition-colors group text-lg"
          >
            <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al Blog
          </Link>
        </section>
      </main>
    </div>
  );
}
