import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IfcElementsPalette } from "../components/ifc-viewer/IfcElementsPalette";
import { IfcSelectionHud } from "../components/ifc-viewer/IfcSelectionHud";

afterEach(cleanup);

const mockElements = [
  { expressID: 101, ifcType: "IFCCOLUMN", name: "COLUMNA C1 250x250", tag: "C1", level: "Nivel 1" },
  { expressID: 102, ifcType: "IFCCOLUMN", name: "COLUMNA C2 250x250", tag: "C2", level: "Nivel 1" },
  { expressID: 201, ifcType: "IFCBEAM", name: "VIGA PRINCIPAL W12x26", tag: "VP1", level: "Nivel 2" },
  { expressID: 202, ifcType: "IFCBEAM", name: "COSTANERA 100x50x2", tag: "CST", level: "Cubierta" },
  { expressID: 301, ifcType: "IFCPLATE", name: "PLACA BASE 300x300x16", tag: "PL1", level: "Fundaciones" },
];

const mockCategories = [
  { type: "IFCCOLUMN", count: 2 },
  { type: "IFCBEAM", count: 2 },
  { type: "IFCPLATE", count: 1 },
];

describe("IfcElementsPalette - Paleta e Inventario de Elementos IFC", () => {
  it("renderiza el encabezado con el total de elementos y categorías reconocidas", () => {
    render(
      <IfcElementsPalette
        elementsList={mockElements}
        categories={mockCategories}
        selectedExpressId={null}
        onSelectElement={() => {}}
      />
    );

    expect(screen.getByText("Paleta de Elementos IFC")).toBeTruthy();
    expect(screen.getByText(/5 elementos reconocidos/)).toBeTruthy();
    expect(screen.getByText("5 mostrados")).toBeTruthy();
  });

  it("permite filtrar elementos mediante el buscador de texto en tiempo real", () => {
    render(
      <IfcElementsPalette
        elementsList={mockElements}
        categories={mockCategories}
        selectedExpressId={null}
        onSelectElement={() => {}}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Buscar por Express ID/i);
    fireEvent.change(searchInput, { target: { value: "Costanera" } });

    expect(screen.getByText("COSTANERA 100x50x2")).toBeTruthy();
    expect(screen.queryByText("COLUMNA C1 250x250")).toBeNull();
    expect(screen.getByText("1 mostrados")).toBeTruthy();
  });

  it("permite filtrar elementos por chip de categoría", () => {
    render(
      <IfcElementsPalette
        elementsList={mockElements}
        categories={mockCategories}
        selectedExpressId={null}
        onSelectElement={() => {}}
      />
    );

    // Seleccionar chip 'Vigas'
    const vigasChip = screen.getByRole("button", { name: /Vigas/i });
    fireEvent.click(vigasChip);

    expect(screen.getByText("VIGA PRINCIPAL W12x26")).toBeTruthy();
    expect(screen.getByText("COSTANERA 100x50x2")).toBeTruthy();
    expect(screen.queryByText("COLUMNA C1 250x250")).toBeNull();
  });

  it("emite onSelectElement al hacer clic en una tarjeta y onZoomToElement al enfocar", () => {
    const onSelectElement = vi.fn();
    const onZoomToElement = vi.fn();

    render(
      <IfcElementsPalette
        elementsList={mockElements}
        categories={mockCategories}
        selectedExpressId={202}
        onSelectElement={onSelectElement}
        onZoomToElement={onZoomToElement}
      />
    );

    // Debe mostrar badge SELECCIONADO para el ID 202
    expect(screen.getByText("Seleccionado")).toBeTruthy();

    // Clic en otro elemento
    fireEvent.click(screen.getByText("COLUMNA C1 250x250"));
    expect(onSelectElement).toHaveBeenCalledWith(mockElements[0]);

    // Clic en botón de enfoque 3D (mira)
    const zoomButtons = screen.getAllByTitle(/Enfocar y centrar en el modelo 3D/i);
    fireEvent.click(zoomButtons[0]);
    expect(onZoomToElement).toHaveBeenCalled();
  });
});

describe("IfcSelectionHud - Feedback y Acciones al Seleccionar Elemento", () => {
  it("no renderiza nada si no hay elemento seleccionado", () => {
    const { container } = render(
      <IfcSelectionHud
        selectedElement={null}
        onClearSelection={() => {}}
        onZoomToElement={() => {}}
        onIsolateElement={() => {}}
        onHideElement={() => {}}
        onOpenProperties={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renderiza datos del elemento seleccionado y ejecuta acciones interactivas", () => {
    const onClearSelection = vi.fn();
    const onZoomToElement = vi.fn();
    const onIsolateElement = vi.fn();
    const onHideElement = vi.fn();
    const onOpenProperties = vi.fn();

    const selectedItem = mockElements[3]; // COSTANERA 100x50x2

    render(
      <IfcSelectionHud
        selectedElement={selectedItem}
        onClearSelection={onClearSelection}
        onZoomToElement={onZoomToElement}
        onIsolateElement={onIsolateElement}
        onHideElement={onHideElement}
        onOpenProperties={onOpenProperties}
        isIsolated={false}
      />
    );

    expect(screen.getByText("COSTANERA 100x50x2")).toBeTruthy();
    expect(screen.getByText(/ExpressID: #202/)).toBeTruthy();

    // Pulsar Enfocar
    fireEvent.click(screen.getByTitle(/Centrar y enfocar cámara/i));
    expect(onZoomToElement).toHaveBeenCalledOnce();

    // Pulsar Aislar
    fireEvent.click(screen.getByTitle(/Aislar solo este elemento/i));
    expect(onIsolateElement).toHaveBeenCalledOnce();

    // Pulsar Ocultar
    fireEvent.click(screen.getByTitle(/Ocultar este elemento/i));
    expect(onHideElement).toHaveBeenCalledOnce();

    // Pulsar Propiedades
    fireEvent.click(screen.getByTitle(/Abrir inspector de propiedades/i));
    expect(onOpenProperties).toHaveBeenCalledOnce();

    // Pulsar Deseleccionar
    fireEvent.click(screen.getByTitle(/Quitar selección/i));
    expect(onClearSelection).toHaveBeenCalledOnce();
  });
});
