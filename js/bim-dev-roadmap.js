// ==================== QUARTER DATA ====================
const quarters = {
  1: {
    title: "T1: Victoria Rapida con pyRevit",
    subtitle: "Mes 1 - 3",
    color: "blue",
    icon: "fa-solid fa-rocket",
    focus: "Python & Logica Basica",
    description:
      "No se toca C# todavia. Se aprovecha la velocidad de pyRevit para obtener resultados inmediatos. La meta es automatizar tareas repetitivas desde el primer mes.",
    modules: [
      {
        title: "Entorno & Python Basico",
        icon: "fa-solid fa-terminal",
        detail:
          "Instalar pyRevit y VS Code. Variables, Listas, Loops (iterar vigas), Condicionales (if largo mayor a 5m).",
      },
      {
        title: "Revit API 'Lite'",
        icon: "fa-solid fa-magnifying-glass",
        detail:
          "Entender que es un Element, un Parameter y una Category. Usar RevitLookup para inspeccionar objetos del modelo.",
      },
      {
        title: "Primer Script",
        icon: "fa-solid fa-play",
        detail:
          "Crear un boton en pyRevit que cuente cuantas vigas hay seleccionadas o que liste todos los niveles del proyecto.",
      },
      {
        title: "Proyecto Hito",
        icon: "fa-solid fa-trophy",
        detail:
          "'Renombrador Automatico': selecciona elementos y los renombra con un prefijo + correlativo. La primera herramienta real.",
      },
    ],
  },
  2: {
    title: "T2: Profundizando la API",
    subtitle: "Mes 4 - 6",
    color: "indigo",
    icon: "fa-solid fa-layer-group",
    focus: "Conceptos API & Datos Masivos",
    description:
      "Se sigue con Python, pero se empieza a pensar como el motor de Revit. Geometria, manipulacion de datos en masa y comunicacion con Excel.",
    modules: [
      {
        title: "FilteredElementCollector",
        icon: "fa-solid fa-filter",
        detail:
          "El corazon de la API. Aprender a buscar rapidamente en el modelo (encontrar todos los muros del Tipo X, vigas del Nivel 2, etc.).",
      },
      {
        title: "Transacciones & Modificacion",
        icon: "fa-solid fa-pen-to-square",
        detail:
          "Crear, borrar, mover y rotar elementos dentro de una Transaccion. Manejo de errores con Try/Except.",
      },
      {
        title: "Excel <-> Revit",
        icon: "fa-solid fa-file-excel",
        detail:
          "Usar librerias de Python para leer un Excel y volcar datos a parametros de Revit (y viceversa). Automatizacion de reportes.",
      },
      {
        title: "Proyecto Hito",
        icon: "fa-solid fa-trophy",
        detail:
          "'Creador de Planos': lee un archivo Excel con lista de planos (nombre, escala, vista) y los crea en Revit automaticamente.",
      },
    ],
  },
  3: {
    title: "T3: El Salto Profesional",
    subtitle: "Mes 7 - 9",
    color: "purple",
    icon: "fa-solid fa-code",
    focus: "C# & Interfaces Visuales",
    description:
      "Python es genial para prototipos, pero C# es el estandar industrial. Se traduce lo aprendido a C# y se crean interfaces profesionales con WPF.",
    modules: [
      {
        title: "Intro a C# & Visual Studio",
        icon: "fa-brands fa-microsoft",
        detail:
          "Tipado estatico (int, string, double). La sintaxis cambia, la logica es la misma. Implementar IExternalCommand.",
      },
      {
        title: "WPF (Windows Presentation)",
        icon: "fa-solid fa-window-maximize",
        detail:
          "Crear interfaces profesionales con XAML: botones, dropdowns, barras de progreso. La herramienta deja de 'verse fea'.",
      },
      {
        title: "Migracion Python -> C#",
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
    subtitle: "Mes 10 - 12",
    color: "orange",
    icon: "fa-solid fa-rocket",
    focus: "Distribucion & Marca Personal",
    description:
      "Ya se sabe programar. Ahora toca empaquetar las herramientas, subirlas a GitHub y construir una marca personal que abra puertas laborales.",
    modules: [
      {
        title: "Git & GitHub",
        icon: "fa-brands fa-github",
        detail:
          "Control de versiones. El codigo en la nube. Aprender Commit, Push, Branch. Cada repositorio es una carta de presentacion.",
      },
      {
        title: "Instaladores (.msi)",
        icon: "fa-solid fa-box-open",
        detail:
          "Usar herramientas como InnoSetup o WiX para que el plugin se instale con doble clic. Distribucion profesional.",
      },
      {
        title: "Marca Personal",
        icon: "fa-solid fa-user-tie",
        detail:
          "Limpiar el perfil de LinkedIn. Subir videos de las herramientas en accion. Postular a trabajos remotos de nicho BIM.",
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

// ==================== RENDER ====================
function renderContent(qId) {
  const data = quarters[qId];
  const contentDiv = document.getElementById("quarter-content");
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
  const c = colorMap[data.color];

  contentDiv.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <div class="p-8 lg:col-span-1 bg-gradient-to-br ${c.bg} border-b lg:border-b-0 lg:border-r border-gray-700">
        <span class="text-xs font-bold uppercase tracking-widest text-gray-500">
          <i class="${data.icon} mr-1"></i> ${data.subtitle}
        </span>
        <h3 class="text-2xl font-bold text-white mt-3 mb-4">${data.title}</h3>
        <div class="mb-6 p-4 rounded-xl border ${c.border} bg-gray-800/50">
          <p class="text-sm ${c.text} leading-relaxed">${data.description}</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500 font-semibold">Enfoque:</span>
          <span class="${c.badge} text-xs font-bold px-3 py-1 rounded-full">${data.focus}</span>
        </div>
      </div>
      <div class="p-8 lg:col-span-2">
        <h4 class="font-bold text-gray-400 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
          <i class="fa-solid fa-cubes"></i> Modulos de Trabajo
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${data.modules
            .map(
              (mod) => `
            <div class="module-card p-5 rounded-xl border border-gray-700 bg-gray-800/30 hover:bg-gray-800/60">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center">
                  <i class="${mod.icon} ${c.text} text-sm"></i>
                </div>
                <h5 class="font-bold text-white text-sm">${mod.title}</h5>
              </div>
              <p class="text-xs text-gray-400 leading-relaxed pl-11">${mod.detail}</p>
            </div>`,
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function switchQuarter(qId) {
  document.querySelectorAll(".quarter-btn").forEach((btn, i) => {
    btn.classList.toggle("active", i + 1 === qId);
  });
  renderContent(qId);
}

// ==================== HELPER ====================
function splitLabel(str, maxLen = 16) {
  if (str.length <= maxLen) return str;
  const words = str.split(" ");
  const lines = [];
  let currentLine = words[0];
  for (let i = 1; i < words.length; i++) {
    if ((currentLine + " " + words[i]).length <= maxLen) {
      currentLine += " " + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
}

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.9)",
      titleColor: "#f8fafc",
      bodyColor: "#cbd5e1",
      padding: 10,
      callbacks: {
        title: function (tooltipItems) {
          const item = tooltipItems[0];
          let label = item.chart.data.labels[item.dataIndex];
          if (Array.isArray(label)) {
            return label.join(" ");
          }
          return label;
        },
      },
    },
    legend: {
      labels: {
        usePointStyle: true,
        color: "#94a3b8",
        font: { family: "Inter, sans-serif", size: 12 },
      },
    },
  },
};

// ==================== CHARTS ====================
document.addEventListener("DOMContentLoaded", () => {
  renderContent(1);

  const ctx = document.getElementById("strategyChart").getContext("2d");
  new Chart(ctx, {
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
  });

  const ctxAi = document.getElementById("aiUsageChart").getContext("2d");
  new Chart(ctxAi, {
    type: "bar",
    data: {
      labels: [
        splitLabel("Meses 1-3 (Conceptos)"),
        splitLabel("Meses 4-8 (Boilerplate)"),
        splitLabel("Meses 9-12 (Optimizacion)"),
      ],
      datasets: [
        {
          label: 'Preguntar "Explicame que es..."',
          data: [80, 20, 5],
          backgroundColor: "#3b82f6",
        },
        {
          label: 'Pedir "Escribe el codigo base..."',
          data: [10, 60, 40],
          backgroundColor: "#06b6d4",
        },
        {
          label: 'Pedir "Refactoriza/Arregla esto..."',
          data: [10, 20, 55],
          backgroundColor: "#8b5cf6",
        },
      ],
    },
    options: {
      ...commonOptions,
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
  });

  const ctxTime = document.getElementById("timeAllocationChart").getContext("2d");
  new Chart(ctxTime, {
    type: "line",
    data: {
      labels: ["Mes 1", "Mes 3", "Mes 6", "Mes 9", "Mes 12"],
      datasets: [
        {
          label: "Estudio Teoria",
          data: [80, 60, 30, 20, 10],
          borderColor: "#60a5fa",
          backgroundColor: "rgba(96, 165, 250, 0.5)",
          fill: true,
          tension: 0.3,
        },
        {
          label: "Escribir Codigo",
          data: [20, 40, 70, 80, 90],
          borderColor: "#22d3ee",
          backgroundColor: "rgba(34, 211, 238, 0.5)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      ...commonOptions,
      plugins: {
        ...commonOptions.plugins,
        legend: { labels: { color: "#94a3b8", font: { size: 11 } } },
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
  });
});

// ==================== MOBILE MENU ====================
document.getElementById("mobile-menu-button").addEventListener("click", function () {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("hidden");
  this.setAttribute("aria-expanded", menu.classList.contains("hidden") ? "false" : "true");
});

// ==================== BACK TO TOP ====================
const backToTopBtn = document.getElementById("back-to-top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    backToTopBtn.classList.remove("opacity-0", "invisible");
    backToTopBtn.classList.add("opacity-100", "visible");
  } else {
    backToTopBtn.classList.remove("opacity-100", "visible");
    backToTopBtn.classList.add("opacity-0", "invisible");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

