import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IfcBcfManager } from "../components/ifc-viewer/IfcBcfManager";

afterEach(cleanup);

describe("IfcBcfManager - Gestión de Incidencias BCF (Fase 5)", () => {
  const mockIssues = [
    {
      id: "BCF-101",
      title: "Interferencia viga-columna",
      description: "Colisión en unión apernada eje A",
      priority: "Crítica",
      discipline: "Estructural",
      status: "Abierto",
      createdAt: "20/09/2026, 10:00",
      elementExpressId: 101,
      elementName: "COLUMNA H 200x200",
      comments: [
        {
          id: "c-1",
          author: "Coordinador BIM",
          createdAt: "20/09/2026, 11:00",
          text: "Revisar con calculista",
        },
      ],
    },
    {
      id: "BCF-102",
      title: "Pase de ducto no contemplado",
      description: "Perforación requerida en viga de losa",
      priority: "Media",
      discipline: "MEP",
      status: "Resuelto",
      createdAt: "21/09/2026, 14:30",
      elementExpressId: 205,
      elementName: "VIGA V-12",
    },
  ];

  it("renderiza la lista de incidencias y permite filtrar por estado, prioridad y disciplina", () => {
    render(
      <IfcBcfManager
        issues={mockIssues}
        onAddIssue={() => {}}
        onUpdateIssueStatus={() => {}}
        onDeleteIssue={() => {}}
        onRestoreViewpoint={() => {}}
        selectedElement={null}
        onCaptureViewpoint={() => null}
      />
    );

    // Ambas incidencias visibles al inicio
    expect(screen.getByText("Interferencia viga-columna")).toBeTruthy();
    expect(screen.getByText("Pase de ducto no contemplado")).toBeTruthy();

    // Filtrar por Estado: botón 'Abierto'
    const openStatusBtn = screen.getByRole("button", { name: "Abierto" });
    fireEvent.click(openStatusBtn);
    expect(screen.getByText("Interferencia viga-columna")).toBeTruthy();
    expect(screen.queryByText("Pase de ducto no contemplado")).toBeNull();

    // Filtrar por Disciplina: MEP (con estado abierto no debe haber resultados)
    const disciplineSelect = screen.getByLabelText("Filtrar por disciplina");
    fireEvent.change(disciplineSelect, { target: { value: "MEP" } });
    expect(screen.queryByText("Interferencia viga-columna")).toBeNull();
    expect(screen.queryByText("Pase de ducto no contemplado")).toBeNull();
    expect(screen.getByText(/No hay incidencias que coincidan con los filtros/)).toBeTruthy();
  });

  it("permite agregar comentarios a una incidencia existente", () => {
    const onUpdateStatus = vi.fn();
    render(
      <IfcBcfManager
        issues={mockIssues}
        onAddIssue={() => {}}
        onUpdateIssueStatus={onUpdateStatus}
        onDeleteIssue={() => {}}
        onRestoreViewpoint={() => {}}
        selectedElement={null}
        onCaptureViewpoint={() => null}
      />
    );

    // Abrir sección de comentarios
    const commentButtons = screen.getAllByRole("button", { name: /Comentarios/i });
    fireEvent.click(commentButtons[0]);

    // Verificar comentario preexistente
    expect(screen.getByText("Revisar con calculista")).toBeTruthy();

    // Escribir nuevo comentario y enviar
    const input = screen.getByPlaceholderText(/Agregar nota o seguimiento/i);
    fireEvent.change(input, { target: { value: "Aprobado por ingeniería estructural" } });
    const sendBtn = screen.getByRole("button", { name: "Enviar" });
    fireEvent.click(sendBtn);

    expect(screen.getByText("Aprobado por ingeniería estructural")).toBeTruthy();
  });

  it("permite crear una nueva incidencia con elemento seleccionado y punto de vista", async () => {
    const onAddIssue = vi.fn();
    const onCapture = vi.fn().mockReturnValue({
      snapshot: "data:image/png;base64,demo",
      cameraState: { position: { x: 10, y: 10, z: 10 } },
    });

    render(
      <IfcBcfManager
        issues={[]}
        onAddIssue={onAddIssue}
        onUpdateIssueStatus={() => {}}
        onDeleteIssue={() => {}}
        onRestoreViewpoint={() => {}}
        selectedElement={{ expressID: 99, name: "VIGA MAESTRA" }}
        onCaptureViewpoint={onCapture}
        autoCreateTrigger={1}
      />
    );

    // Formulario de nueva incidencia abierto automáticamente por autoCreateTrigger
    const titleInput = screen.getByLabelText(/Título de la Incidencia/i);
    fireEvent.change(titleInput, { target: { value: "Revisar perno de anclaje" } });

    const submitBtn = screen.getByRole("button", { name: /Guardar Incidencia/i });
    fireEvent.click(submitBtn);

    expect(onAddIssue).toHaveBeenCalledOnce();
    const created = onAddIssue.mock.calls[0][0];
    expect(created.title).toBe("Revisar perno de anclaje");
    expect(created.elementExpressId).toBe(99);
    expect(created.elementName).toBe("VIGA MAESTRA");
  });
});
