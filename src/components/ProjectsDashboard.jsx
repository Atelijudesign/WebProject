import { useEffect, useRef, useState, useMemo } from "react";
import Chart from "chart.js/auto";
import { useTranslation } from "../context/LanguageContext";

const TYPE_NAME_MAP = {
  "Minería": "Mining",
  "Infraestructura": "Infrastructure",
  "Industrial": "Industrial",
  "Salud": "Healthcare",
  "Comercial": "Commercial",
  "Educacional": "Educational",
  "Habitacional": "Residential",
  "Marítimo": "Maritime",
  "Energía": "Energy",
  "Estructural": "Structural",
  "Civil": "Civil",
  "Otros": "Others",
};

export const ProjectsDashboard = ({
  projects = [],
  selectedType = "Todos",
  selectedSoftware = "Todos",
  selectedMaterial = "Todos",
  onSelectType,
  onSelectSoftware,
  onSelectMaterial,
  onResetFilters,
}) => {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [isOpen, setIsOpen] = useState(true);

  // Canvas Refs
  const typeChartRef = useRef(null);
  const materialChartRef = useRef(null);
  const timelineChartRef = useRef(null);
  const softwareChartRef = useRef(null);

  // Chart Instances
  const typeChartInstance = useRef(null);
  const materialChartInstance = useRef(null);
  const timelineChartInstance = useRef(null);
  const softwareChartInstance = useRef(null);

  // Dataset Metrics Calculation
  const metrics = useMemo(() => {
    if (!projects.length) return null;

    const totalProjects = projects.length;

    // Type distribution
    const typeCounts = {};
    projects.forEach((p) => {
      const type = p.project_type || "Otros";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    // Material distribution
    const materialCounts = {
      "Hormigón Armado": 0,
      "Acero + Hormigón": 0,
      "Acero Estructural": 0,
      "Otros": 0,
    };
    projects.forEach((p) => {
      const mat = p.material || "";
      if (mat.includes("Hormigón") && mat.includes("Acero")) {
        materialCounts["Acero + Hormigón"] += 1;
      } else if (mat.includes("Hormigón")) {
        materialCounts["Hormigón Armado"] += 1;
      } else if (mat.includes("Acero")) {
        materialCounts["Acero Estructural"] += 1;
      } else {
        materialCounts["Otros"] += 1;
      }
    });

    // Software frequency
    const softwareCounts = {
      "Revit Structure": 0,
      "Tekla Structures": 0,
      "Navisworks": 0,
      "AutoCAD / LISP": 0,
    };
    projects.forEach((p) => {
      const s = (p.software || "").toLowerCase();
      if (s.includes("revit")) softwareCounts["Revit Structure"] += 1;
      if (s.includes("tekla")) softwareCounts["Tekla Structures"] += 1;
      if (s.includes("navisworks")) softwareCounts["Navisworks"] += 1;
      if (s.includes("autocad") || s.includes("lisp")) softwareCounts["AutoCAD / LISP"] += 1;
    });

    // Timeline distribution by year
    const yearCounts = {};
    projects.forEach((p) => {
      const y = p.year_start;
      if (y) {
        yearCounts[y] = (yearCounts[y] || 0) + 1;
      }
    });

    // Infrastructure count (Metro + Aeropuerto + Pasarelas)
    const infraCount = projects.filter(
      (p) =>
        (p.project_type || "").includes("Infraestructura") ||
        (p.name || "").toLowerCase().includes("metro") ||
        (p.name || "").toLowerCase().includes("aeropuerto") ||
        (p.name || "").toLowerCase().includes("pasarela")
    ).length;

    // Distinct companies
    const distinctCompanies = new Set(projects.map((p) => p.company).filter(Boolean)).size;

    return {
      totalProjects,
      infraCount,
      distinctCompanies,
      typeCounts,
      materialCounts,
      softwareCounts,
      yearCounts,
    };
  }, [projects]);

  // Render / Update Charts
  useEffect(() => {
    if (!isOpen || !metrics) return;

    // Common Chart Options
    const darkTooltipOptions = {
      backgroundColor: "rgba(15, 23, 42, 0.95)",
      titleColor: "#f8fafc",
      bodyColor: "#cbd5e1",
      borderColor: "rgba(51, 65, 85, 0.8)",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 10,
      displayColors: true,
      boxPadding: 6,
      titleFont: { family: "Space Grotesk", size: 13, weight: "bold" },
      bodyFont: { family: "Inter", size: 12 },
    };

    // 1. Chart: Distribución por Sector / Tipología (Horizontal Bar)
    if (typeChartRef.current) {
      if (typeChartInstance.current) typeChartInstance.current.destroy();

      const sortedTypes = Object.entries(metrics.typeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

      const rawLabels = sortedTypes.map((t) => t[0]);
      const displayLabels = rawLabels.map((l) => isEn && TYPE_NAME_MAP[l] ? TYPE_NAME_MAP[l] : l);
      const data = sortedTypes.map((t) => t[1]);

      const ctx = typeChartRef.current.getContext("2d");
      typeChartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: displayLabels,
          datasets: [
            {
              label: isEn ? "Executed Projects" : "Proyectos Realizados",
              data,
              backgroundColor: rawLabels.map((l) =>
                selectedType === l ? "#38bdf8" : "rgba(56, 189, 248, 0.45)"
              ),
              borderColor: rawLabels.map((l) =>
                selectedType === l ? "#38bdf8" : "rgba(56, 189, 248, 0.9)"
              ),
              borderWidth: 1.5,
              borderRadius: 6,
              hoverBackgroundColor: "#38bdf8",
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: darkTooltipOptions,
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: { color: "rgba(51, 65, 85, 0.3)" },
              ticks: { color: "#94a3b8", stepSize: 2, font: { family: "Inter", size: 11 } },
            },
            y: {
              grid: { display: false },
              ticks: {
                color: (c) => {
                  const idx = c.index;
                  return rawLabels[idx] === selectedType ? "#38bdf8" : "#cbd5e1";
                },
                font: { family: "Inter", size: 11, weight: "600" },
                callback: function (val) {
                  const label = this.getLabelForValue(val);
                  return label.length > 20 ? label.slice(0, 18) + "…" : label;
                },
              },
            },
          },
          onClick: (evt, elements) => {
            if (!elements.length || !onSelectType) return;
            const index = elements[0].index;
            const clickedType = rawLabels[index];
            onSelectType(selectedType === clickedType ? "Todos" : clickedType);
          },
        },
      });
    }

    // 2. Chart: Materialidad Estructural (Doughnut Chart)
    if (materialChartRef.current) {
      if (materialChartInstance.current) materialChartInstance.current.destroy();

      const rawLabels = ["Hormigón Armado", "Acero + Hormigón", "Acero Estructural"];
      const displayLabels = isEn
        ? ["Reinforced Concrete", "Steel + Concrete", "Structural Steel"]
        : rawLabels;
      const data = [
        metrics.materialCounts["Hormigón Armado"],
        metrics.materialCounts["Acero + Hormigón"],
        metrics.materialCounts["Acero Estructural"],
      ];

      const colors = ["#3b82f6", "#8b5cf6", "#f59e0b"];
      const borderColors = ["#60a5fa", "#a78bfa", "#fbbf24"];

      const ctx = materialChartRef.current.getContext("2d");
      materialChartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: displayLabels,
          datasets: [
            {
              data,
              backgroundColor: colors.map((c, i) =>
                selectedMaterial === rawLabels[i] || selectedMaterial === "Todos"
                  ? c
                  : "rgba(100, 116, 139, 0.3)"
              ),
              borderColor: borderColors,
              borderWidth: 2,
              hoverOffset: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "65%",
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#cbd5e1",
                font: { family: "Inter", size: 11, weight: "600" },
                padding: 14,
                boxWidth: 12,
                boxHeight: 12,
              },
            },
            tooltip: {
              ...darkTooltipOptions,
              callbacks: {
                label: function (context) {
                  const val = context.raw || 0;
                  const pct = ((val / metrics.totalProjects) * 100).toFixed(1);
                  return isEn
                    ? ` ${context.label}: ${val} projects (${pct}%)`
                    : ` ${context.label}: ${val} proyectos (${pct}%)`;
                },
              },
            },
          },
          onClick: (evt, elements) => {
            if (!elements.length || !onSelectMaterial) return;
            const index = elements[0].index;
            const clickedMat = rawLabels[index];
            onSelectMaterial(selectedMaterial === clickedMat ? "Todos" : clickedMat);
          },
        },
      });
    }

    // 3. Chart: Trayectoria & Cronología Temporal (Area / Line Chart)
    if (timelineChartRef.current) {
      if (timelineChartInstance.current) timelineChartInstance.current.destroy();

      const sortedYears = Object.keys(metrics.yearCounts).sort((a, b) => Number(a) - Number(b));
      const yearValues = sortedYears.map((y) => metrics.yearCounts[y]);

      const ctx = timelineChartRef.current.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.45)");
      gradient.addColorStop(1, "rgba(59, 130, 246, 0.0)");

      timelineChartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: sortedYears,
          datasets: [
            {
              label: isEn ? "Initiated Projects" : "Proyectos Iniciados",
              data: yearValues,
              fill: true,
              backgroundColor: gradient,
              borderColor: "#3b82f6",
              borderWidth: 2.5,
              tension: 0.35,
              pointBackgroundColor: "#60a5fa",
              pointBorderColor: "#1e3a8a",
              pointBorderWidth: 2,
              pointRadius: 4.5,
              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: darkTooltipOptions,
          },
          scales: {
            x: {
              grid: { color: "rgba(51, 65, 85, 0.2)" },
              ticks: { color: "#94a3b8", font: { family: "Inter", size: 11 } },
            },
            y: {
              beginAtZero: true,
              grid: { color: "rgba(51, 65, 85, 0.2)" },
              ticks: { color: "#94a3b8", stepSize: 2, font: { family: "Inter", size: 11 } },
            },
          },
        },
      });
    }

    // 4. Chart: Software & Herramientas BIM (Bar Chart)
    if (softwareChartRef.current) {
      if (softwareChartInstance.current) softwareChartInstance.current.destroy();

      const labels = ["Revit Structure", "Tekla Structures", "Navisworks", "AutoCAD / LISP"];
      const data = [
        metrics.softwareCounts["Revit Structure"],
        metrics.softwareCounts["Tekla Structures"],
        metrics.softwareCounts["Navisworks"],
        metrics.softwareCounts["AutoCAD / LISP"],
      ];

      const ctx = softwareChartRef.current.getContext("2d");
      softwareChartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: isEn ? "Projects incorporating" : "Proyectos que incorporan",
              data,
              backgroundColor: [
                "rgba(56, 189, 248, 0.5)",
                "rgba(139, 92, 246, 0.5)",
                "rgba(236, 72, 153, 0.5)",
                "rgba(245, 158, 11, 0.5)",
              ],
              borderColor: ["#38bdf8", "#8b5cf6", "#ec4899", "#f59e0b"],
              borderWidth: 1.5,
              borderRadius: 6,
              hoverBackgroundColor: ["#38bdf8", "#8b5cf6", "#ec4899", "#f59e0b"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: darkTooltipOptions,
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: "#cbd5e1", font: { family: "Inter", size: 11, weight: "600" } },
            },
            y: {
              beginAtZero: true,
              grid: { color: "rgba(51, 65, 85, 0.3)" },
              ticks: { color: "#94a3b8", stepSize: 5, font: { family: "Inter", size: 11 } },
            },
          },
          onClick: (evt, elements) => {
            if (!elements.length || !onSelectSoftware) return;
            const index = elements[0].index;
            const clicked = labels[index];
            onSelectSoftware(selectedSoftware.includes(clicked) ? "Todos" : clicked);
          },
        },
      });
    }

    return () => {
      if (typeChartInstance.current) typeChartInstance.current.destroy();
      if (materialChartInstance.current) materialChartInstance.current.destroy();
      if (timelineChartInstance.current) timelineChartInstance.current.destroy();
      if (softwareChartInstance.current) softwareChartInstance.current.destroy();
    };
  }, [isOpen, metrics, selectedType, selectedMaterial, selectedSoftware, onSelectType, onSelectMaterial, onSelectSoftware]);

  if (!metrics) return null;

  const hasCrossFilter =
    selectedType !== "Todos" || selectedMaterial !== "Todos" || selectedSoftware !== "Todos";

  return (
    <section className="mb-12 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Decorative Glow Ambient */}
      <div
        className="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800/80 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <i className="fa-solid fa-chart-line mr-1.5"></i> Business & Technical Intelligence
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-grotesk text-white tracking-tight flex items-center gap-2.5">
            {isEn ? "BIM Projects Analytics Dashboard" : "Dashboard Analítico de Proyectos BIM"}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            {isEn ? "Consolidated metrics, typological distribution, materials, and technologies across 42 executed projects." : "Métricas consolidadas, distribución tipológica, materiales y tecnologías sobre 42 proyectos ejecutados."}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {hasCrossFilter && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/30 transition-all shadow-sm"
              title={isEn ? "Reset cross-filters" : "Restablecer filtros cruzados"}
            >
              <i className="fa-solid fa-rotate-left text-[11px]"></i> {isEn ? "Clear Filters" : "Limpiar Filtros"}
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-all shadow-sm group"
          >
            <i
              className={`fa-solid fa-chevron-down transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            ></i>
            {isOpen ? (isEn ? "Hide Dashboard" : "Ocultar Dashboard") : (isEn ? "View Analytics Dashboard" : "Ver Dashboard Analítico")}
          </button>
        </div>
      </div>

      {/* Dashboard Body */}
      {isOpen && (
        <div className="space-y-6 relative z-10 animate-fadeIn">
          {/* Bento KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* KPI 1 */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between hover:border-blue-500/40 transition-colors group">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold uppercase tracking-wider text-[10px]">{isEn ? "Total Projects" : "Total Proyectos"}</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-folder-open text-xs"></i>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white font-grotesk tracking-tight">
                {metrics.totalProjects}
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <i className="fa-solid fa-circle-check text-[9px]"></i> {isEn ? "100% Completed" : "100% Completados"}
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-colors group">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold uppercase tracking-wider text-[10px]">{isEn ? "Critical Infrastructure" : "Infraestructura Crítica"}</span>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-train-subway text-xs"></i>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white font-grotesk tracking-tight">
                {metrics.infraCount}
              </div>
              <div className="text-[11px] text-cyan-400 font-semibold mt-1">
                {isEn ? "Metro, Bridges & Airports" : "Metro, Pasarelas & Aeropuertos"}
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-colors group">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold uppercase tracking-wider text-[10px]">{isEn ? "BIM Specialization" : "Especialización BIM"}</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-cube text-xs"></i>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-grotesk tracking-tight">
                Revit & Tekla
              </div>
              <div className="text-[11px] text-indigo-300 font-semibold mt-1">
                {isEn ? "3D Modeling & CNC Detailing" : "Modelado 3D & Detallado CNC"}
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-colors group">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold uppercase tracking-wider text-[10px]">{isEn ? "Consulting Firms / Partners" : "Consultoras / Partners"}</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-building text-xs"></i>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white font-grotesk tracking-tight">
                {metrics.distinctCompanies}
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                {isEn ? "Chile, Mexico & Uruguay" : "Chile, México & Uruguay"}
              </div>
            </div>
          </div>

          {/* Active Filter Banner */}
          {hasCrossFilter && (
            <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-blue-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-blue-400 flex items-center gap-1.5">
                  <i className="fa-solid fa-filter"></i> {isEn ? "Active Filter from Charts:" : "Filtro Activo desde Gráficos:"}
                </span>
                {selectedType !== "Todos" && (
                  <span className="bg-blue-500/20 px-2 py-0.5 rounded-lg border border-blue-400/30 font-medium">
                    {isEn ? "Sector:" : "Sector:"} <strong>{isEn && TYPE_NAME_MAP[selectedType] ? TYPE_NAME_MAP[selectedType] : selectedType}</strong>
                  </span>
                )}
                {selectedMaterial !== "Todos" && (
                  <span className="bg-purple-500/20 px-2 py-0.5 rounded-lg border border-purple-400/30 text-purple-200 font-medium">
                    {isEn ? "Material:" : "Material:"} <strong>{selectedMaterial}</strong>
                  </span>
                )}
                {selectedSoftware !== "Todos" && (
                  <span className="bg-cyan-500/20 px-2 py-0.5 rounded-lg border border-cyan-400/30 text-cyan-200 font-medium">
                    {isEn ? "Software:" : "Software:"} <strong>{selectedSoftware}</strong>
                  </span>
                )}
              </div>
              <button
                onClick={onResetFilters}
                className="text-xs text-blue-400 hover:text-white underline font-semibold transition-colors"
              >
                {isEn ? "View all projects" : "Ver todos los proyectos"}
              </button>
            </div>
          )}

          {/* 4-Chart Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Sector / Tipología */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 md:p-6 hover:border-slate-600/70 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-grotesk">
                    <i className="fa-solid fa-layer-group text-sky-400 text-xs"></i>
                    {isEn ? "Distribution by Sector & Typology" : "Distribución por Sector & Tipología"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isEn ? "Click a bar to filter the catalog" : "Haz clic en una barra para filtrar el catálogo"}
                  </p>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 bg-slate-900/60 px-2 py-1 rounded">
                  {isEn ? "Top 6 Sectors" : "Top 6 Sectores"}
                </span>
              </div>
              <div className="h-60 w-full relative">
                <canvas ref={typeChartRef} />
              </div>
            </div>

            {/* Chart 2: Materialidad */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 md:p-6 hover:border-slate-600/70 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-grotesk">
                    <i className="fa-solid fa-cubes text-blue-400 text-xs"></i>
                    {isEn ? "Predominant Structural Materiality" : "Materialidad Estructural Predominante"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isEn ? "Ratio between Reinforced Concrete, Mixed, and Steel" : "Proporción entre Hormigón Armado, Mixto y Acero"}
                  </p>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 bg-slate-900/60 px-2 py-1 rounded">
                  Doughnut
                </span>
              </div>
              <div className="h-60 w-full relative flex items-center justify-center">
                <canvas ref={materialChartRef} />
              </div>
            </div>

            {/* Chart 3: Trayectoria y Cronología */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 md:p-6 hover:border-slate-600/70 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-grotesk">
                    <i className="fa-solid fa-timeline text-indigo-400 text-xs"></i>
                    {isEn ? "Project Timeline & History (2006–2026)" : "Trayectoria y Cronología de Proyectos (2006–2026)"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isEn ? "Development milestones and technical activity peaks" : "Hitos de desarrollo y picos de actividad técnica"}
                  </p>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 bg-slate-900/60 px-2 py-1 rounded">
                  {isEn ? "20 Years Exp" : "20 Años Exp"}
                </span>
              </div>
              <div className="h-60 w-full relative">
                <canvas ref={timelineChartRef} />
              </div>
            </div>

            {/* Chart 4: Ecosistema Software */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 md:p-6 hover:border-slate-600/70 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-grotesk">
                    <i className="fa-solid fa-laptop-code text-pink-400 text-xs"></i>
                    {isEn ? "BIM & Detailing Software Ecosystem" : "Ecosistema de Software BIM & Detallamiento"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isEn ? "Frequency of tools applied in deliverables" : "Frecuencia de herramientas aplicadas en entregables"}
                  </p>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 bg-slate-900/60 px-2 py-1 rounded">
                  Revit / Tekla / Navis
                </span>
              </div>
              <div className="h-60 w-full relative">
                <canvas ref={softwareChartRef} />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
