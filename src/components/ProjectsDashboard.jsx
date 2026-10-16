import { useEffect, useRef, useState, useMemo } from "react";
import Chart from "chart.js/auto";
import { useTranslation } from "../context/LanguageContext";
import {
  formatProjectType,
  getProjectTypeIcon,
  formatMetricQuantity,
  PROJECT_TYPE_METADATA,
} from "../utils/projectTypeHelpers";

export const ProjectsDashboard = ({
  allProjects = [],
  filteredProjects = [],
  projects = [],
  selectedType = "Todos",
  selectedSoftware = "Todos",
  selectedMaterial = "Todos",
  selectedCompany = "Todas",
  onSelectType,
  onSelectSoftware,
  onSelectMaterial,
  onSelectCompany: _onSelectCompany,
  onResetFilters,
}) => {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Canvas Refs - Tab Overview
  const typeChartRef = useRef(null);
  const materialChartRef = useRef(null);
  const timelineChartRef = useRef(null);
  const softwareChartRef = useRef(null);

  // Canvas Refs - Tab Magnitudes
  const magnitudeChartRef = useRef(null);
  const phaseChartRef = useRef(null);

  // Canvas Refs - Tab Clients & Geography
  const clientsChartRef = useRef(null);
  const geographyChartRef = useRef(null);

  // Chart Instances
  const typeChartInstance = useRef(null);
  const materialChartInstance = useRef(null);
  const timelineChartInstance = useRef(null);
  const softwareChartInstance = useRef(null);
  const magnitudeChartInstance = useRef(null);
  const phaseChartInstance = useRef(null);
  const clientsChartInstance = useRef(null);
  const geographyChartInstance = useRef(null);

  // Datasets unificados
  const totalList = useMemo(() => {
    if (allProjects && allProjects.length > 0) return allProjects;
    return projects || [];
  }, [allProjects, projects]);

  const hasCrossFilter = useMemo(() => {
    return (
      selectedType !== "Todos" ||
      selectedMaterial !== "Todos" ||
      selectedSoftware !== "Todos" ||
      selectedCompany !== "Todas"
    );
  }, [selectedType, selectedMaterial, selectedSoftware, selectedCompany]);

  const activeList = useMemo(() => {
    if (filteredProjects && filteredProjects.length > 0) {
      return filteredProjects;
    }
    if (hasCrossFilter) {
      // Si hay filtro activo pero filteredProjects no vino o está vacío, filtrar localmente
      return totalList.filter((p) => {
        const matchesType = selectedType === "Todos" || p.project_type === selectedType;
        const matchesMaterial = selectedMaterial === "Todos" || p.material === selectedMaterial;
        const matchesSoftware = selectedSoftware === "Todos" || p.software === selectedSoftware;
        const matchesCompany = selectedCompany === "Todas" || p.company === selectedCompany;
        return matchesType && matchesMaterial && matchesSoftware && matchesCompany;
      });
    }
    return totalList;
  }, [filteredProjects, hasCrossFilter, totalList, selectedType, selectedMaterial, selectedSoftware, selectedCompany]);

  // Función auxiliar para extraer métricas de un conjunto de proyectos
  const extractMetrics = (dataset) => {
    if (!dataset || !dataset.length) return null;

    const totalProjects = dataset.length;

    // Distribución por tipo de proyecto
    const typeCounts = {};
    dataset.forEach((p) => {
      const type = p.project_type || "Otros";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    // Distribución de materiales
    const materialCounts = {
      "Hormigón Armado": 0,
      "Acero + Hormigón": 0,
      "Acero Estructural": 0,
      "Otros": 0,
    };
    dataset.forEach((p) => {
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

    // Frecuencia de software
    const softwareCounts = {
      "Revit Structure": 0,
      "Tekla Structures": 0,
      "Navisworks": 0,
      "AutoCAD / LISP": 0,
    };
    dataset.forEach((p) => {
      const s = (p.software || "").toLowerCase();
      if (s.includes("revit")) softwareCounts["Revit Structure"] += 1;
      if (s.includes("tekla")) softwareCounts["Tekla Structures"] += 1;
      if (s.includes("navisworks")) softwareCounts["Navisworks"] += 1;
      if (s.includes("autocad") || s.includes("lisp")) softwareCounts["AutoCAD / LISP"] += 1;
    });

    // Línea de tiempo por año
    const yearCounts = {};
    dataset.forEach((p) => {
      const y = p.year_start;
      if (y) {
        yearCounts[y] = (yearCounts[y] || 0) + 1;
      }
    });

    // Conteo de infraestructura crítica
    const infraCount = dataset.filter(
      (p) =>
        (p.project_type || "").includes("Infraestructura") ||
        (p.name || "").toLowerCase().includes("metro") ||
        (p.name || "").toLowerCase().includes("aeropuerto") ||
        (p.name || "").toLowerCase().includes("pasarela")
    ).length;

    // Empresas distintas y lista de clientes
    const distinctCompaniesSet = new Set(dataset.map((p) => p.company).filter(Boolean));
    const distinctCompanies = distinctCompaniesSet.size;
    const topCompanies = Array.from(distinctCompaniesSet).slice(0, 3).join(", ");

    // Cubicación técnica: Volumen de Hormigón (m3) y Peso de Acero Estructural (Ton)
    let totalConcreteM3 = 0;
    let totalSteelTon = 0;
    let concreteProjectsCount = 0;
    let steelProjectsCount = 0;

    // Magnitudes agregadas por sector (para gráfico comparativo m3 vs Ton)
    const sectorMagnitudes = {};

    // Distribución por fases de proyecto & ciclo constructivo
    const phaseCounts = {
      "Ingeniería de Detalle": 0,
      "Ingeniería Básica": 0,
      "Maniobras & Montaje": 0,
      "Factibilidad & Perfil": 0,
    };

    // Ranking de clientes
    const clientCounts = {};

    // Distribución territorial
    const countryCounts = {
      "Chile": 0,
      "México": 0,
      "Uruguay": 0,
      "Argentina": 0,
    };

    dataset.forEach((p) => {
      const type = p.project_type || "Otros";
      if (!sectorMagnitudes[type]) {
        sectorMagnitudes[type] = { concrete: 0, steel: 0, count: 0 };
      }
      sectorMagnitudes[type].count += 1;

      // Parse concrete_volume
      let cVal = 0;
      if (typeof p.concrete_volume === "number") {
        cVal = p.concrete_volume;
      } else if (typeof p.concrete_volume === "string") {
        const match = p.concrete_volume.replace(/,/g, ".").match(/[0-9]+(?:\.[0-9]+)?/);
        if (match) cVal = parseFloat(match[0]);
      }
      if (cVal > 0) {
        totalConcreteM3 += cVal;
        concreteProjectsCount += 1;
        sectorMagnitudes[type].concrete += cVal;
      }

      // Parse steel_weight
      let sVal = 0;
      if (typeof p.steel_weight === "number") {
        sVal = p.steel_weight;
      } else if (typeof p.steel_weight === "string") {
        const match = p.steel_weight.replace(/,/g, ".").match(/[0-9]+(?:\.[0-9]+)?/);
        if (match) sVal = parseFloat(match[0]);
      }
      if (sVal > 0) {
        totalSteelTon += sVal;
        steelProjectsCount += 1;
        sectorMagnitudes[type].steel += sVal;
      }

      // Fases
      const ph = (p.phase || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      if (ph.includes("básica") || ph.includes("basica")) {
        phaseCounts["Ingeniería Básica"] += 1;
      } else if (ph.includes("factibilidad") || ph.includes("perfil")) {
        phaseCounts["Factibilidad & Perfil"] += 1;
      } else if (desc.includes("maniobra") || desc.includes("izaje") || desc.includes("montaje")) {
        phaseCounts["Maniobras & Montaje"] += 1;
      } else {
        phaseCounts["Ingeniería de Detalle"] += 1;
      }

      // Clientes
      const cl = p.client || "Otros";
      clientCounts[cl] = (clientCounts[cl] || 0) + 1;

      // Países
      const co = p.country || "Chile";
      if (co.includes("Chile")) countryCounts["Chile"] += 1;
      else if (co.includes("Méx") || co.includes("Mex")) countryCounts["México"] += 1;
      else if (co.includes("Uru")) countryCounts["Uruguay"] += 1;
      else if (co.includes("Arg")) countryCounts["Argentina"] += 1;
      else countryCounts["Chile"] += 1;
    });

    // Material predominante
    let dominantMaterial = "Acero / Hormigón";
    let maxMatCount = -1;
    Object.entries(materialCounts).forEach(([mat, count]) => {
      if (count > maxMatCount && count > 0) {
        maxMatCount = count;
        dominantMaterial = mat;
      }
    });

    // Software predominante
    let dominantSoftware = "Revit & Tekla";
    let maxSoftCount = -1;
    Object.entries(softwareCounts).forEach(([soft, count]) => {
      if (count > maxSoftCount && count > 0) {
        maxSoftCount = count;
        dominantSoftware = soft;
      }
    });

    return {
      totalProjects,
      infraCount,
      distinctCompanies,
      topCompanies,
      dominantMaterial,
      dominantSoftware,
      totalConcreteM3,
      totalSteelTon,
      concreteProjectsCount,
      steelProjectsCount,
      sectorMagnitudes,
      phaseCounts,
      clientCounts,
      countryCounts,
      typeCounts,
      materialCounts,
      softwareCounts,
      yearCounts,
    };
  };

  // Métricas globales (para baseline de tipos)
  const totalMetrics = useMemo(() => extractMetrics(totalList), [totalList]);

  // Métricas activas (reactivas al filtro seleccionado)
  const activeMetrics = useMemo(() => extractMetrics(activeList), [activeList]);

  // Render / Update Charts con Chart.js
  useEffect(() => {
    if (!isOpen || !activeMetrics || !totalMetrics) return;

    // Opciones comunes para tooltips oscuros y modernos
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
      titleFont: { family: "Space Grotesk, sans-serif", size: 13, weight: "bold" },
      bodyFont: { family: "Inter, sans-serif", size: 12 },
    };

        // ─── TAB 1: OVERVIEW & TIPOLOGÍA ───────────────────────────
    if (activeTab === "overview") {
      // 1. Chart: Distribución por Sector & Tipología (Horizontal Bar)
      if (typeChartRef.current) {
        if (typeChartInstance.current) typeChartInstance.current.destroy();

        const sortedTypes = Object.entries(totalMetrics.typeCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6);

        const rawLabels = sortedTypes.map((t) => t[0]);
        const displayLabels = rawLabels.map((l) => formatProjectType(l, isEn, false));
        const data = sortedTypes.map((t) => t[1]);

        const ctx = typeChartRef.current?.getContext?.("2d");
        if (ctx) {
          typeChartInstance.current = new Chart(ctx, {
            type: "bar",
            data: {
              labels: displayLabels,
              datasets: [
                {
                  label: isEn ? "Executed Projects" : "Proyectos Realizados",
                  data,
                  backgroundColor: rawLabels.map((l) => {
                    if (selectedType === l) return "#06b6d4";
                    if (selectedType === "Todos") return "rgba(56, 189, 248, 0.55)";
                    return "rgba(56, 189, 248, 0.2)";
                  }),
                  borderColor: rawLabels.map((l) => {
                    if (selectedType === l) return "#38bdf8";
                    if (selectedType === "Todos") return "rgba(56, 189, 248, 0.9)";
                    return "rgba(56, 189, 248, 0.35)";
                  }),
                  borderWidth: rawLabels.map((l) => (selectedType === l ? 2.5 : 1)),
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
                tooltip: {
                  ...darkTooltipOptions,
                  callbacks: {
                    title: (context) => rawLabels[context[0].dataIndex],
                    label: (context) => {
                      const val = context.raw || 0;
                      const pct = ((val / totalMetrics.totalProjects) * 100).toFixed(1);
                      const isCurrent = rawLabels[context.dataIndex] === selectedType;
                      const statusTag = isCurrent ? (isEn ? " [ACTIVE FILTER]" : " [FILTRO ACTIVO]") : "";
                      return isEn
                        ? ` ${val} projects (${pct}% of catalog)${statusTag}`
                        : ` ${val} proyectos (${pct}% del catálogo)${statusTag}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  grid: { color: "rgba(51, 65, 85, 0.3)" },
                  ticks: { color: "#94a3b8", stepSize: 2, font: { family: "Inter, sans-serif", size: 11 } },
                },
                y: {
                  grid: { display: false },
                  ticks: {
                    color: (c) => (rawLabels[c.index] === selectedType ? "#38bdf8" : "#cbd5e1"),
                    font: { family: "Inter, sans-serif", size: 11, weight: "500" },
                  },
                },
              },
              onClick: (_evt, elements) => {
                if (!elements.length || !onSelectType) return;
                const index = elements[0].index;
                const clicked = rawLabels[index];
                onSelectType(selectedType === clicked ? "Todos" : clicked);
              },
            },
          });
        }
      }

      // 2. Chart: Materialidad Estructural (Doughnut)
      if (materialChartRef.current) {
        if (materialChartInstance.current) materialChartInstance.current.destroy();

        const labels = Object.keys(activeMetrics.materialCounts);
        const data = Object.values(activeMetrics.materialCounts);

        const ctx = materialChartRef.current?.getContext?.("2d");
        if (ctx) {
          materialChartInstance.current = new Chart(ctx, {
            type: "doughnut",
            data: {
              labels,
              datasets: [
                {
                  data,
                  backgroundColor: [
                    "rgba(56, 189, 248, 0.75)",
                    "rgba(139, 92, 246, 0.75)",
                    "rgba(245, 158, 11, 0.75)",
                    "rgba(100, 116, 139, 0.5)",
                  ],
                  borderColor: "rgba(15, 23, 42, 0.8)",
                  borderWidth: 2,
                  hoverOffset: 6,
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
                    padding: 12,
                    font: { family: "Inter, sans-serif", size: 11 },
                    boxWidth: 10,
                  },
                },
                tooltip: {
                  ...darkTooltipOptions,
                  callbacks: {
                    label: (context) => {
                      const val = context.raw || 0;
                      const total = data.reduce((a, b) => a + b, 0);
                      const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                      return ` ${context.label}: ${val} ${isEn ? "projects" : "proyectos"} (${pct}%)`;
                    },
                  },
                },
              },
            },
          });
        }
      }

      // 3. Chart: Trayectoria & Cronología (Line / Bar)
      if (timelineChartRef.current) {
        if (timelineChartInstance.current) timelineChartInstance.current.destroy();

        const sortedYears = Object.keys(activeMetrics.yearCounts).sort((a, b) => Number(a) - Number(b));
        const data = sortedYears.map((y) => activeMetrics.yearCounts[y]);

        const ctx = timelineChartRef.current?.getContext?.("2d");
        if (ctx) {
          timelineChartInstance.current = new Chart(ctx, {
            type: "bar",
            data: {
              labels: sortedYears,
              datasets: [
                {
                  label: isEn ? "Executed Projects" : "Proyectos Ejecutados",
                  data,
                  backgroundColor: "rgba(99, 102, 241, 0.65)",
                  borderColor: "#818cf8",
                  borderWidth: 1.5,
                  borderRadius: 4,
                  hoverBackgroundColor: "#818cf8",
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  ...darkTooltipOptions,
                  callbacks: {
                    title: (context) => `${isEn ? "Year" : "Año"} ${context[0].label}`,
                    label: (context) => ` ${context.raw} ${isEn ? "projects registered" : "proyectos registrados"}`,
                  },
                },
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { color: "#94a3b8", font: { family: "Inter, sans-serif", size: 10 } },
                },
                y: {
                  beginAtZero: true,
                  grid: { color: "rgba(51, 65, 85, 0.3)" },
                  ticks: { color: "#94a3b8", stepSize: 1, font: { family: "Inter, sans-serif", size: 10 } },
                },
              },
            },
          });
        }
      }

      // 4. Chart: Ecosistema Software BIM (Bar)
      if (softwareChartRef.current) {
        if (softwareChartInstance.current) softwareChartInstance.current.destroy();

        const labels = Object.keys(activeMetrics.softwareCounts);
        const data = Object.values(activeMetrics.softwareCounts);

        const ctx = softwareChartRef.current?.getContext?.("2d");
        if (ctx) {
          softwareChartInstance.current = new Chart(ctx, {
            type: "bar",
            data: {
              labels,
              datasets: [
                {
                  label: isEn ? "Projects incorporating" : "Proyectos que incorporan",
                  data,
                  backgroundColor: [
                    "rgba(56, 189, 248, 0.55)",
                    "rgba(139, 92, 246, 0.55)",
                    "rgba(236, 72, 153, 0.55)",
                    "rgba(245, 158, 11, 0.55)",
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
                  ticks: { color: "#cbd5e1", font: { family: "Inter, sans-serif", size: 11, weight: "600" } },
                },
                y: {
                  beginAtZero: true,
                  grid: { color: "rgba(51, 65, 85, 0.3)" },
                  ticks: { color: "#94a3b8", stepSize: 2, font: { family: "Inter, sans-serif", size: 11 } },
                },
              },
              onClick: (_evt, elements) => {
                if (!elements.length || !onSelectSoftware) return;
                const index = elements[0].index;
                const clicked = labels[index];
                onSelectSoftware(selectedSoftware.includes(clicked) ? "Todos" : clicked);
              },
            },
          });
        }
      }
    }

    // ─── TAB 2: MAGNITUD & CUBICACIONES (m³ / Ton) ─────────────
    if (activeTab === "quantities") {
      // 5. Chart: Magnitud Física por Sector (Grouped Bar m³ vs Ton)
      if (magnitudeChartRef.current) {
        if (magnitudeChartInstance.current) magnitudeChartInstance.current.destroy();

        const sortedSectors = Object.entries(activeMetrics.sectorMagnitudes)
          .filter(([_, data]) => data.concrete > 0 || data.steel > 0)
          .sort((a, b) => (b[1].concrete + b[1].steel) - (a[1].concrete + a[1].steel))
          .slice(0, 6);

        const rawLabels = sortedSectors.map(([type]) => type);
        const displayLabels = rawLabels.map((l) => formatProjectType(l, isEn, true));
        const concreteData = sortedSectors.map(([_, d]) => d.concrete);
        const steelData = sortedSectors.map(([_, d]) => d.steel);

        const ctx = magnitudeChartRef.current?.getContext?.("2d");
        if (ctx) {
          magnitudeChartInstance.current = new Chart(ctx, {
            type: "bar",
            data: {
              labels: displayLabels,
              datasets: [
                {
                  label: isEn ? "Concrete Volume (m³)" : "Hormigón Armado (m³)",
                  data: concreteData,
                  backgroundColor: "rgba(245, 158, 11, 0.7)",
                  borderColor: "#f59e0b",
                  borderWidth: 1.5,
                  borderRadius: 6,
                  yAxisID: "y",
                },
                {
                  label: isEn ? "Structural Steel (Ton)" : "Acero Estructural (Ton)",
                  data: steelData,
                  backgroundColor: "rgba(234, 88, 12, 0.7)",
                  borderColor: "#ea580c",
                  borderWidth: 1.5,
                  borderRadius: 6,
                  yAxisID: "y1",
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                  labels: {
                    color: "#cbd5e1",
                    font: { family: "Inter, sans-serif", size: 11, weight: "600" },
                    boxWidth: 12,
                    boxHeight: 12,
                  },
                },
                tooltip: {
                  ...darkTooltipOptions,
                  callbacks: {
                    title: (context) => rawLabels[context[0].dataIndex],
                    label: (context) => {
                      const isConcrete = context.datasetIndex === 0;
                      const val = context.raw || 0;
                      const formatted = val.toLocaleString(isEn ? "en-US" : "es-CL");
                      return isConcrete
                        ? ` ${isEn ? "Concrete:" : "Hormigón:"} ${formatted} m³`
                        : ` ${isEn ? "Steel:" : "Acero:"} ${formatted} Ton`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { color: "#cbd5e1", font: { family: "Inter, sans-serif", size: 11, weight: "600" } },
                },
                y: {
                  type: "linear",
                  display: true,
                  position: "left",
                  beginAtZero: true,
                  grid: { color: "rgba(51, 65, 85, 0.3)" },
                  ticks: {
                    color: "#f59e0b",
                    font: { family: "Inter, sans-serif", size: 10 },
                    callback: (v) => formatMetricQuantity(v, "m³"),
                  },
                },
                y1: {
                  type: "linear",
                  display: true,
                  position: "right",
                  beginAtZero: true,
                  grid: { drawOnChartArea: false },
                  ticks: {
                    color: "#ea580c",
                    font: { family: "Inter, sans-serif", size: 10 },
                    callback: (v) => formatMetricQuantity(v, "T"),
                  },
                },
              },
              onClick: (_evt, elements) => {
                if (!elements.length || !onSelectType) return;
                const index = elements[0].index;
                const clicked = rawLabels[index];
                onSelectType(selectedType === clicked ? "Todos" : clicked);
              },
            },
          });
        }
      }

      // 6. Chart: Desglose de Fases de Proyecto (Doughnut)
      if (phaseChartRef.current) {
        if (phaseChartInstance.current) phaseChartInstance.current.destroy();

        const labels = Object.keys(activeMetrics.phaseCounts);
        const data = Object.values(activeMetrics.phaseCounts);

        const ctx = phaseChartRef.current?.getContext?.("2d");
        if (ctx) {
          phaseChartInstance.current = new Chart(ctx, {
            type: "doughnut",
            data: {
              labels,
              datasets: [
                {
                  data,
                  backgroundColor: ["#06b6d4", "#6366f1", "#10b981", "#f59e0b"],
                  borderColor: "rgba(15, 23, 42, 0.9)",
                  borderWidth: 3,
                  hoverOffset: 6,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: "68%",
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    color: "#cbd5e1",
                    padding: 12,
                    font: { family: "Inter, sans-serif", size: 11 },
                    boxWidth: 10,
                  },
                },
                tooltip: {
                  ...darkTooltipOptions,
                  callbacks: {
                    label: (context) => {
                      const val = context.raw || 0;
                      const total = data.reduce((a, b) => a + b, 0);
                      const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                      return ` ${context.label}: ${val} ${isEn ? "works" : "obras"} (${pct}%)`;
                    },
                  },
                },
              },
            },
          });
        }
      }
    }

    // ─── TAB 3: CLIENTES & TERRITORIO ──────────────────────────
    if (activeTab === "clients") {
      // 7. Chart: Top Clientes Corporativos & Mineras (Horizontal Bar)
      if (clientsChartRef.current) {
        if (clientsChartInstance.current) clientsChartInstance.current.destroy();

        const sortedClients = Object.entries(activeMetrics.clientCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 7);

        const labels = sortedClients.map(([c]) => c);
        const data = sortedClients.map(([_, count]) => count);

        const ctx = clientsChartRef.current?.getContext?.("2d");
        if (ctx) {
          clientsChartInstance.current = new Chart(ctx, {
            type: "bar",
            data: {
              labels,
              datasets: [
                {
                  label: isEn ? "Executed Projects" : "Proyectos Ejecutados",
                  data,
                  backgroundColor: "rgba(16, 185, 129, 0.55)",
                  borderColor: "#10b981",
                  borderWidth: 1.5,
                  borderRadius: 6,
                  hoverBackgroundColor: "#34d399",
                },
              ],
            },
            options: {
              indexAxis: "y",
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  ...darkTooltipOptions,
                  callbacks: {
                    label: (context) => ` ${context.raw} ${isEn ? "works executed" : "obras ejecutadas"}`,
                  },
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  grid: { color: "rgba(51, 65, 85, 0.3)" },
                  ticks: { color: "#94a3b8", stepSize: 1, font: { family: "Inter, sans-serif", size: 11 } },
                },
                y: {
                  grid: { display: false },
                  ticks: { color: "#cbd5e1", font: { family: "Inter, sans-serif", size: 11, weight: "600" } },
                },
              },
            },
          });
        }
      }

      // 8. Chart: Huella Geográfica & Normativas (Doughnut)
      if (geographyChartRef.current) {
        if (geographyChartInstance.current) geographyChartInstance.current.destroy();

        const labels = Object.keys(activeMetrics.countryCounts);
        const data = Object.values(activeMetrics.countryCounts);

        const ctx = geographyChartRef.current?.getContext?.("2d");
        if (ctx) {
          geographyChartInstance.current = new Chart(ctx, {
            type: "doughnut",
            data: {
              labels,
              datasets: [
                {
                  data,
                  backgroundColor: ["#38bdf8", "#ec4899", "#10b981", "#f59e0b"],
                  borderColor: "rgba(15, 23, 42, 0.9)",
                  borderWidth: 3,
                  hoverOffset: 6,
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
                    padding: 12,
                    font: { family: "Inter, sans-serif", size: 11 },
                    boxWidth: 10,
                  },
                },
                tooltip: {
                  ...darkTooltipOptions,
                  callbacks: {
                    label: (context) => {
                      const val = context.raw || 0;
                      const total = data.reduce((a, b) => a + b, 0);
                      const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                      return ` ${context.label}: ${val} ${isEn ? "projects" : "proyectos"} (${pct}%)`;
                    },
                  },
                },
              },
            },
          });
        }
      }
    }

    return () => {
      typeChartInstance.current?.destroy();
      materialChartInstance.current?.destroy();
      timelineChartInstance.current?.destroy();
      softwareChartInstance.current?.destroy();
      magnitudeChartInstance.current?.destroy();
      phaseChartInstance.current?.destroy();
      clientsChartInstance.current?.destroy();
      geographyChartInstance.current?.destroy();
    };
  }, [
    isOpen,
    activeTab,
    activeMetrics,
    totalMetrics,
    selectedType,
    selectedMaterial,
    selectedSoftware,
    isEn,
    onSelectType,
    onSelectMaterial,
    onSelectSoftware,
  ]);


  if (!activeMetrics || !totalMetrics) return null;

  const percentageOfTotal = ((activeMetrics.totalProjects / totalMetrics.totalProjects) * 100).toFixed(1);
  const activeTypeIcon = getProjectTypeIcon(selectedType);
  const activeTypeFormatted = formatProjectType(selectedType, isEn, false);

  return (
    <section className="mb-12 bg-slate-900/70 border border-slate-800/90 rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-all duration-300">
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
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <i className="fa-solid fa-chart-line"></i> Business & Technical Intelligence
            </span>
            {hasCrossFilter && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                <i className={`fa-solid ${activeTypeIcon} mr-1`}></i>
                {isEn ? "Filtered View" : "Vista Filtrada"} ({percentageOfTotal}%)
              </span>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-grotesk text-white tracking-tight flex items-center gap-2.5">
            {isEn ? "BIM Projects Analytics Dashboard" : "Dashboard Analítico de Proyectos BIM"}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            {hasCrossFilter ? (
              isEn ? (
                <>
                  Analyzing <strong className="text-cyan-300">{activeMetrics.totalProjects}</strong> of{" "}
                  <strong>{totalMetrics.totalProjects}</strong> executed projects ({percentageOfTotal}%) under active filter ·{" "}
                  <span className="text-amber-300 font-semibold">{formatMetricQuantity(activeMetrics.totalConcreteM3)} m³ Concrete</span> &{" "}
                  <span className="text-orange-300 font-semibold">{formatMetricQuantity(activeMetrics.totalSteelTon)} Ton Steel</span>.
                </>
              ) : (
                <>
                  Analizando <strong className="text-cyan-300">{activeMetrics.totalProjects}</strong> de{" "}
                  <strong>{totalMetrics.totalProjects}</strong> proyectos ejecutados ({percentageOfTotal}%) bajo el filtro activo ·{" "}
                  <span className="text-amber-300 font-semibold">{formatMetricQuantity(activeMetrics.totalConcreteM3)} m³ Hormigón</span> y{" "}
                  <span className="text-orange-300 font-semibold">{formatMetricQuantity(activeMetrics.totalSteelTon)} Ton Acero</span>.
                </>
              )
            ) : (
              isEn ? (
                `Consolidated metrics, ${formatMetricQuantity(totalMetrics.totalConcreteM3)} m³ concrete, ${formatMetricQuantity(totalMetrics.totalSteelTon)} ton steel, and technical stack across ${totalMetrics.totalProjects} executed projects.`
              ) : (
                `Métricas consolidadas, ${formatMetricQuantity(totalMetrics.totalConcreteM3)} m³ hormigón, ${formatMetricQuantity(totalMetrics.totalSteelTon)} ton acero y tecnologías sobre ${totalMetrics.totalProjects} proyectos ejecutados.`
              )
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {hasCrossFilter && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/30 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              title={isEn ? "Reset cross-filters" : "Restablecer filtros cruzados"}
            >
              <i className="fa-solid fa-rotate-left text-[11px]"></i> {isEn ? "Clear Filters" : "Limpiar Filtros"}
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-all shadow-sm group hover:scale-[1.02] active:scale-[0.98]"
          >
            <i
              className={`fa-solid fa-chevron-down transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            ></i>
            {isOpen
              ? isEn
                ? "Hide Dashboard"
                : "Ocultar Dashboard"
              : isEn
              ? "View Analytics Dashboard"
              : "Ver Dashboard Analítico"}
          </button>
        </div>
      </div>

      {/* Dashboard Body */}
      {isOpen && (
        <div className="space-y-6 relative z-10 animate-fadeIn">
          {/* Bento KPI Row - Dinámico y Reactivo con 6 KPIs Técnicos (m³, Ton, Proyectos, Infra, Software, Partners) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {/* KPI 1: Proyectos en Filtro */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-blue-500/40 transition-colors group">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold uppercase tracking-wider text-[10px] truncate">
                  {hasCrossFilter
                    ? isEn
                      ? "Filtered Projects"
                      : "Proyectos del Sector"
                    : isEn
                    ? "Total Projects"
                    : "Total Proyectos"}
                </span>
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <i className="fa-solid fa-folder-open text-xs"></i>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-grotesk tracking-tight">
                {activeMetrics.totalProjects}
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1 truncate">
                <i className="fa-solid fa-circle-check text-[9px]"></i>{" "}
                {hasCrossFilter
                  ? `${percentageOfTotal}% ${isEn ? "of catalog" : "del catálogo"}`
                  : isEn
                  ? "100% Completed"
                  : "100% Completados"}
              </div>
            </div>

            {/* KPI 2: Sector / Foco de Infraestructura */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-colors group">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold uppercase tracking-wider text-[10px] truncate">
                  {selectedType !== "Todos"
                    ? isEn
                      ? "Active Sector"
                      : "Sector Activo"
                    : isEn
                    ? "Critical Infrastructure"
                    : "Infraestructura Crítica"}
                </span>
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <i className={`fa-solid ${activeTypeIcon} text-xs`}></i>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-grotesk tracking-tight truncate" title={activeTypeFormatted}>
                {selectedType !== "Todos" ? activeTypeFormatted : activeMetrics.infraCount}
              </div>
              <div className="text-[11px] text-cyan-400 font-semibold mt-1 truncate">
                {selectedType !== "Todos"
                  ? `${activeMetrics.totalProjects} ${isEn ? "works" : "obras"}`
                  : isEn
                  ? "Metro, Bridges & AMB"
                  : "Metro, Pasarelas & AMB"}
              </div>
            </div>

            {/* KPI 3: Cubicación Hormigón (m³) */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-amber-500/40 transition-colors group">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold uppercase tracking-wider text-[10px] truncate">
                  {isEn ? "Concrete Volume" : "Hormigón Armado"}
                </span>
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <i className="fa-solid fa-cube text-xs"></i>
                </div>
              </div>
              <div
                className="text-2xl sm:text-3xl font-extrabold text-white font-grotesk tracking-tight flex items-baseline gap-1"
                title={`${activeMetrics.totalConcreteM3.toLocaleString(isEn ? "en-US" : "es-CL")} m³ ${isEn ? "Reinforced Concrete" : "Hormigón Armado"}`}
              >
                <span>{formatMetricQuantity(activeMetrics.totalConcreteM3)}</span>
                <span className="text-xs sm:text-sm font-bold text-amber-400 font-mono">m³</span>
              </div>
              <div
                className="text-[11px] text-amber-400/90 font-semibold mt-1 flex items-center gap-1 truncate"
                title={isEn ? "Total reinforced concrete volume" : "Volumen total de hormigón armado"}
              >
                <i className="fa-solid fa-shapes text-[9px]"></i>{" "}
                <span>
                  {activeMetrics.concreteProjectsCount > 0
                    ? `${activeMetrics.concreteProjectsCount} ${isEn ? "works · H25/H30" : "obras · H25/H30"}`
                    : isEn
                    ? "0 m³ in filter"
                    : "0 m³ en filtro"}
                </span>
              </div>
            </div>

            {/* KPI 4: Acero Estructural (Ton) */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-orange-500/40 transition-colors group">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold uppercase tracking-wider text-[10px] truncate">
                  {isEn ? "Structural Steel" : "Acero Estructural"}
                </span>
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <i className="fa-solid fa-weight-hanging text-xs"></i>
                </div>
              </div>
              <div
                className="text-2xl sm:text-3xl font-extrabold text-white font-grotesk tracking-tight flex items-baseline gap-1"
                title={`${activeMetrics.totalSteelTon.toLocaleString(isEn ? "en-US" : "es-CL")} Ton ${isEn ? "Structural Steel & Rebar" : "Acero Estructural & Rebar"}`}
              >
                <span>{formatMetricQuantity(activeMetrics.totalSteelTon)}</span>
                <span className="text-xs sm:text-sm font-bold text-orange-400 font-mono">Ton</span>
              </div>
              <div
                className="text-[11px] text-orange-400/90 font-semibold mt-1 flex items-center gap-1 truncate"
                title={isEn ? "Total structural steel and rebar" : "Acero estructural y enfierradura total"}
              >
                <i className="fa-solid fa-industry text-[9px]"></i>{" "}
                <span>
                  {activeMetrics.steelProjectsCount > 0
                    ? `${activeMetrics.steelProjectsCount} ${isEn ? "works · ICHA/Rebar" : "obras · ICHA/Rebar"}`
                    : isEn
                    ? "0 Ton in filter"
                    : "0 Ton en filtro"}
                </span>
              </div>
            </div>

            {/* KPI 5: Software / Especialización BIM */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-colors group">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold uppercase tracking-wider text-[10px] truncate">
                  {hasCrossFilter
                    ? isEn
                      ? "Dominant"
                      : "Software"
                    : isEn
                    ? "BIM Specialization"
                    : "Especialización BIM"}
                </span>
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <i className="fa-solid fa-layer-group text-xs"></i>
                </div>
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-white font-grotesk tracking-tight truncate" title={activeMetrics.dominantSoftware}>
                {activeMetrics.dominantSoftware}
              </div>
              <div className="text-[11px] text-indigo-300 font-semibold mt-1 truncate">
                {hasCrossFilter
                  ? activeMetrics.dominantMaterial
                  : isEn
                  ? "3D Modeling & CNC"
                  : "Modelado 3D & CNC"}
              </div>
            </div>

            {/* KPI 6: Consultoras / Partners */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-colors group">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold uppercase tracking-wider text-[10px] truncate">
                  {isEn ? "Firms / Partners" : "Consultoras"}
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <i className="fa-solid fa-building text-xs"></i>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-grotesk tracking-tight">
                {activeMetrics.distinctCompanies}
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-1 truncate" title={activeMetrics.topCompanies}>
                {activeMetrics.topCompanies || (isEn ? "GHD, BIOSMI, Arcadis" : "GHD, BIOSMI, Arcadis")}
              </div>
            </div>
          </div>

          {/* Active Filter Chips Banner */}
          {hasCrossFilter && (
            <div className="bg-slate-950/70 border border-cyan-500/30 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 shadow-inner">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                  <i className="fa-solid fa-filter"></i> {isEn ? "Active Filters:" : "Filtros Activos:"}
                </span>

                {selectedType !== "Todos" && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-400/40 px-3 py-1 rounded-xl font-medium">
                    <i className={`fa-solid ${activeTypeIcon} text-[10px]`}></i>
                    <span>{isEn ? "Sector:" : "Sector:"} <strong>{activeTypeFormatted}</strong></span>
                    <button
                      onClick={() => onSelectType && onSelectType("Todos")}
                      className="ml-1 hover:text-white text-blue-400 font-bold"
                      title={isEn ? "Remove sector filter" : "Quitar filtro de sector"}
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedMaterial !== "Todos" && (
                  <span className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-300 border border-purple-400/40 px-3 py-1 rounded-xl font-medium">
                    <i className="fa-solid fa-cubes text-[10px]"></i>
                    <span>{isEn ? "Material:" : "Material:"} <strong>{selectedMaterial}</strong></span>
                    <button
                      onClick={() => onSelectMaterial && onSelectMaterial("Todos")}
                      className="ml-1 hover:text-white text-purple-400 font-bold"
                      title={isEn ? "Remove material filter" : "Quitar filtro de material"}
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedSoftware !== "Todos" && (
                  <span className="inline-flex items-center gap-1.5 bg-pink-500/20 text-pink-300 border border-pink-400/40 px-3 py-1 rounded-xl font-medium">
                    <i className="fa-solid fa-laptop-code text-[10px]"></i>
                    <span>{isEn ? "Software:" : "Software:"} <strong>{selectedSoftware}</strong></span>
                    <button
                      onClick={() => onSelectSoftware && onSelectSoftware("Todos")}
                      className="ml-1 hover:text-white text-pink-400 font-bold"
                      title={isEn ? "Remove software filter" : "Quitar filtro de software"}
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-mono text-[11px]">
                  {activeMetrics.totalProjects} / {totalMetrics.totalProjects} {isEn ? "items" : "ítems"}
                </span>
                <button
                  onClick={onResetFilters}
                  className="text-xs text-cyan-400 hover:text-white underline font-semibold transition-colors"
                >
                  {isEn ? "Reset all" : "Restablecer todo"}
                </button>
              </div>
            </div>
          )}

          {/* Analytics View Switcher (Pestañas Analíticas Bento) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <div className="inline-flex flex-wrap sm:flex-nowrap max-w-full overflow-x-auto p-1 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner gap-1 [scrollbar-width:none]">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-blue-600/90 to-cyan-600/90 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <i className="fa-solid fa-chart-pie text-xs"></i>
                <span>{isEn ? "Overview & Typologies" : "Visión General & Sectores"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("quantities")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "quantities"
                    ? "bg-gradient-to-r from-amber-600/90 to-orange-600/90 text-white shadow-md shadow-orange-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <i className="fa-solid fa-cubes-stacked text-xs"></i>
                <span>{isEn ? "Magnitude & Materials (m³ / Ton)" : "Magnitud & Cubicaciones (m³ / Ton)"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("clients")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "clients"
                    ? "bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <i className="fa-solid fa-building-columns text-xs"></i>
                <span>{isEn ? "Clients & Geography" : "Clientes & Territorio"}</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>{isEn ? "Engineering Analytics Engine v2.6" : "Motor Analítico Estructural v2.6"}</span>
            </div>
          </div>

          {/* TAB 1: VISIÓN GENERAL & TIPOLOGÍAS */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
              {/* Chart 1: Sector / Tipología */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 md:p-6 hover:border-slate-600/70 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 font-grotesk">
                      <i className="fa-solid fa-layer-group text-sky-400 text-xs"></i>
                      {isEn ? "Distribution by Sector & Typology" : "Distribución por Sector & Tipología"}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEn
                        ? "Click any bar to instantly filter the entire dashboard and catalog"
                        : "Haz clic en una barra para filtrar instantáneamente el dashboard y catálogo"}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                    {selectedType !== "Todos"
                      ? isEn ? "Sector Selected" : "Sector Seleccionado"
                      : isEn ? "Top 6 Sectors" : "Top 6 Sectores"}
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
                      {selectedType !== "Todos"
                        ? isEn
                          ? `Proportion in ${activeTypeFormatted}`
                          : `Proporción en ${activeTypeFormatted}`
                        : isEn
                        ? "Ratio between Reinforced Concrete, Mixed, and Steel"
                        : "Proporción entre Hormigón Armado, Mixto y Acero"}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
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
                      {isEn ? "Project Timeline & History" : "Trayectoria y Cronología de Proyectos"}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {selectedType !== "Todos"
                        ? isEn
                          ? `Execution years for ${activeTypeFormatted}`
                          : `Años de ejecución para ${activeTypeFormatted}`
                        : isEn
                        ? "Development milestones and technical activity peaks (2006–2026)"
                        : "Hitos de desarrollo y picos de actividad técnica (2006–2026)"}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                    {Object.keys(activeMetrics.yearCounts).length} {isEn ? "Active Years" : "Años Activos"}
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
                      {selectedType !== "Todos"
                        ? isEn
                          ? `Tools applied in ${activeTypeFormatted}`
                          : `Herramientas aplicadas en ${activeTypeFormatted}`
                        : isEn
                        ? "Frequency of tools applied in deliverables"
                        : "Frecuencia de herramientas aplicadas en entregables"}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                    Revit / Tekla / Navis
                  </span>
                </div>
                <div className="h-60 w-full relative">
                  <canvas ref={softwareChartRef} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MAGNITUD & CUBICACIONES (m³ / Ton) */}
          {activeTab === "quantities" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
              {/* Chart 5: Magnitud Física por Sector (m³ Hormigón vs Ton Acero) */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 md:p-6 hover:border-slate-600/70 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 font-grotesk">
                      <i className="fa-solid fa-scale-balanced text-amber-400 text-xs"></i>
                      {isEn ? "Physical Magnitude by Sector (m³ vs. Ton)" : "Magnitud Física: Hormigón (m³) vs. Acero (Ton)"}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEn
                        ? "Consolidated material intensity comparison across executed sectors"
                        : "Comparativa de intensidades de material entre los sectores ejecutados"}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                    m³ & Ton Dual Scale
                  </span>
                </div>
                <div className="h-60 w-full relative">
                  <canvas ref={magnitudeChartRef} />
                </div>
              </div>

              {/* Chart 6: Ciclo Constructivo & Madurez LOD */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 md:p-6 hover:border-slate-600/70 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 font-grotesk">
                      <i className="fa-solid fa-compass-drafting text-cyan-400 text-xs"></i>
                      {isEn ? "Engineering Lifecycle & Construction LOD" : "Fases de Ingeniería & Ciclo Constructivo LOD"}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEn
                        ? "Detailed fabrication drawings, basic engineering, and rigging procedures"
                        : "Planos constructivos de fabricación, ingeniería básica y maniobras"}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                    LOD 300 - 400
                  </span>
                </div>
                <div className="h-60 w-full relative flex items-center justify-center">
                  <canvas ref={phaseChartRef} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CLIENTES & TERRITORIO */}
          {activeTab === "clients" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
              {/* Chart 7: Top Clientes Corporativos & Mineras */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 md:p-6 hover:border-slate-600/70 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 font-grotesk">
                      <i className="fa-solid fa-building text-emerald-400 text-xs"></i>
                      {isEn ? "Corporate & Mining Clients Breakdown" : "Top Clientes Corporativos & Minería"}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEn
                        ? "Executed works volume by client and contracting authority"
                        : "Volumen de obras ejecutadas por mandante y autoridad contratante"}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                    Key Accounts
                  </span>
                </div>
                <div className="h-60 w-full relative">
                  <canvas ref={clientsChartRef} />
                </div>
              </div>

              {/* Chart 8: Huella Geográfica & Normativas */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 md:p-6 hover:border-slate-600/70 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 font-grotesk">
                      <i className="fa-solid fa-earth-americas text-sky-400 text-xs"></i>
                      {isEn ? "Territorial Footprint & Design Codes" : "Huella Territorial & Códigos Normativos"}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEn
                        ? "Seismic and structural design standards applied across Americas"
                        : "Estándares de cálculo antisísmico aplicados en América Latina"}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/20">
                    NCh / AISC / ACI
                  </span>
                </div>
                <div className="h-60 w-full relative flex items-center justify-center">
                  <canvas ref={geographyChartRef} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

