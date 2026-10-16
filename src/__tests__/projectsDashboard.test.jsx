import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";
import { ProjectsDashboard } from "../components/ProjectsDashboard";
import { LanguageProvider } from "../context/LanguageContext";
import { formatProjectType, getProjectTypeIcon } from "../utils/projectTypeHelpers";

afterEach(cleanup);

// Mock Chart.js to avoid canvas rendering issues in node/jsdom
vi.mock("chart.js/auto", () => {
  return {
    default: class MockChart {
      destroy() {}
    },
  };
});

const mockProjects = [
  {
    id: "1",
    project_id: "P-001",
    name: "Mina Subterránea",
    project_type: "Minería",
    material: "Acero Estructural",
    software: "AutoCAD, Detallamiento Estructural",
    year_start: 2026,
    company: "GHD",
    concrete_volume: 45,
    steel_weight: 50,
  },
  {
    id: "2",
    project_id: "P-002",
    name: "Estación Metro L2",
    project_type: "Infraestructura / Metro",
    material: "Hormigón Armado",
    software: "Revit Structure",
    year_start: 2024,
    company: "TYPSA",
    concrete_volume: 1200,
    steel_weight: 80,
  },
  {
    id: "3",
    project_id: "P-003",
    name: "Pasarela Peatonal Vespucio",
    project_type: "Infraestructura / Pasarela Peatonal",
    material: "Acero + Hormigón",
    software: "Tekla Structures",
    year_start: 2023,
    company: "Sincal",
    concrete_volume: 85,
    steel_weight: 40,
  },
  {
    id: "4",
    project_id: "P-004",
    name: "Terminal de Pasajeros Aeropuerto",
    project_type: "Infraestructura / Aviación",
    material: "Acero Estructural",
    software: "Revit Structure",
    year_start: 2025,
    company: "CJV Construction",
    concrete_volume: null,
    steel_weight: 850,
  },
];

const renderWithLang = (ui) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
};

describe("ProjectsDashboard & Project Type Reactivity", () => {
  it("formatProjectType should cleanly format long compound project types without truncation", () => {
    expect(formatProjectType("Infraestructura / Metro", false, false)).toBe("Metro Subterráneo");
    expect(formatProjectType("Infraestructura / Pasarela Peatonal", false, false)).toBe("Pasarelas Peatonales");
    expect(formatProjectType("Infraestructura / Aviación", false, false)).toBe("Aeropuertos & Aviación");
    expect(formatProjectType("Minería", false, false)).toBe("Minería & Procesos");
    expect(getProjectTypeIcon("Infraestructura / Metro")).toBe("fa-train-subway");
    expect(getProjectTypeIcon("Minería")).toBe("fa-mountain");
  });

  it("should display global baseline metrics when no filter is active", () => {
    renderWithLang(
      <ProjectsDashboard
        allProjects={mockProjects}
        filteredProjects={mockProjects}
        selectedType="Todos"
      />
    );

    // Should display total projects = 4 (appears in KPI and subtitle)
    expect(screen.getAllByText("4").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Total Proyectos")).toBeDefined();
    expect(screen.getByText("100% Completados")).toBeDefined();

    // Should render concrete (m³) and steel (Ton) KPI cards
    expect(screen.getByText("Hormigón Armado")).toBeDefined();
    expect(screen.getByText("Acero Estructural")).toBeDefined();
    expect(screen.getAllByText("m³").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Ton").length).toBeGreaterThanOrEqual(1);
  });

  it("should dynamically update metrics when a project type is selected", () => {
    const miningProjects = mockProjects.filter((p) => p.project_type === "Minería");

    renderWithLang(
      <ProjectsDashboard
        allProjects={mockProjects}
        filteredProjects={miningProjects}
        selectedType="Minería"
      />
    );

    // KPI 1 should show the filtered count (1 project)
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Proyectos del Sector")).toBeDefined();
    expect(screen.getByText("25.0% del catálogo")).toBeDefined();

    // KPI 2 should show the active sector name cleanly formatted
    expect(screen.getAllByText("Minería & Procesos").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Sector Activo")).toBeDefined();

    // The filter chip banner should be rendered
    expect(screen.getByText("Filtros Activos:")).toBeDefined();

    // Concrete and steel should react to mining filter: 45 m³ and 50 Ton
    expect(screen.getByText("45")).toBeDefined();
    expect(screen.getByText("50")).toBeDefined();
  });

  it("should allow switching between Bento tabs: Overview, Quantities, and Clients", async () => {
    const { fireEvent } = await import("@testing-library/react");

    renderWithLang(
      <ProjectsDashboard
        allProjects={mockProjects}
        filteredProjects={mockProjects}
        selectedType="Todos"
      />
    );

    // Initial tab is overview
    expect(screen.getByText("Visión General & Sectores")).toBeDefined();
    expect(screen.getByText("Magnitud & Cubicaciones (m³ / Ton)")).toBeDefined();
    expect(screen.getByText("Clientes & Territorio")).toBeDefined();
    expect(screen.getByText("Distribución por Sector & Tipología")).toBeDefined();

    // Click tab 2: Quantities & Magnitude
    fireEvent.click(screen.getByText("Magnitud & Cubicaciones (m³ / Ton)"));
    expect(screen.getByText("Magnitud Física: Hormigón (m³) vs. Acero (Ton)")).toBeDefined();
    expect(screen.getByText("Fases de Ingeniería & Ciclo Constructivo LOD")).toBeDefined();

    // Click tab 3: Clients & Territory
    fireEvent.click(screen.getByText("Clientes & Territorio"));
    expect(screen.getByText("Top Clientes Corporativos & Minería")).toBeDefined();
    expect(screen.getByText("Huella Territorial & Códigos Normativos")).toBeDefined();
  });
});

