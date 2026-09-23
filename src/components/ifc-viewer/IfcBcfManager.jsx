import { useRef, useState, useEffect } from "react";

export const IfcBcfManager = ({
  issues = [],
  onAddIssue,
  onUpdateIssueStatus,
  onDeleteIssue,
  onRestoreViewpoint,
  selectedElement,
  onCaptureViewpoint,
  onImportIssues,
  clippingConfig,
  autoCreateTrigger,
}) => {
  const importInputRef = useRef(null);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Alta");
  const [discipline, setDiscipline] = useState("Estructural");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [filterDiscipline, setFilterDiscipline] = useState("ALL");
  const [capturedSnapshot, setCapturedSnapshot] = useState(null);
  const [expandedIssueComments, setExpandedIssueComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [localComments, setLocalComments] = useState({});

  // Iniciar creación de incidencia capturando la vista actual
  const handleStartCreate = () => {
    if (onCaptureViewpoint) {
      const viewData = onCaptureViewpoint();
      setCapturedSnapshot(viewData?.snapshot || null);
    }
    setTitle(
      selectedElement
        ? `Observación en ${selectedElement.name || selectedElement.ifcType}`
        : "Observación de Coordinación"
    );
    setDescription("");
    setIsCreating(true);
  };

  useEffect(() => {
    if (autoCreateTrigger) {
      handleStartCreate();
    }
  }, [autoCreateTrigger]);

  const handleSaveIssue = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const viewpoint = onCaptureViewpoint ? onCaptureViewpoint() : null;

    const newIssue = {
      id: `BCF-${String(issues.length + 1).padStart(3, "0")}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      discipline,
      status: "Abierto",
      createdAt: new Date().toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      elementExpressId: selectedElement?.expressID || null,
      elementName: selectedElement?.name || null,
      elementGlobalId: selectedElement?.globalId || null,
      viewpoint: viewpoint?.cameraState || null,
      clippingConfig: clippingConfig ? JSON.parse(JSON.stringify(clippingConfig)) : null,
      snapshot: viewpoint?.snapshot || capturedSnapshot || null,
      comments: [],
    };

    onAddIssue(newIssue);
    setIsCreating(false);
    setTitle("");
    setDescription("");
    setCapturedSnapshot(null);
  };

  const handleAddComment = (issueId) => {
    const text = (newCommentText[issueId] || "").trim();
    if (!text) return;

    const currentIssue = issues.find((iss) => iss.id === issueId);
    if (!currentIssue) return;

    const baseComments = localComments[issueId] || currentIssue.comments || [];
    const updatedComments = [
      ...baseComments,
      {
        id: `COMM-${Date.now()}`,
        author: "Revisor BIM",
        text,
        createdAt: new Date().toLocaleDateString("es-CL", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];

    setLocalComments((prev) => ({ ...prev, [issueId]: updatedComments }));

    const updatedIssue = {
      ...currentIssue,
      comments: updatedComments,
    };

    onAddIssue(updatedIssue);
    setNewCommentText((prev) => ({ ...prev, [issueId]: "" }));
  };

  const toggleComments = (issueId) => {
    setExpandedIssueComments((prev) => ({
      ...prev,
      [issueId]: !prev[issueId],
    }));
  };

  // Exportar BCF / JSON
  const handleExportBcfJson = () => {
    if (issues.length === 0) {
      alert("No hay incidencias para exportar.");
      return;
    }

    const payload = {
      project: "BIM Coordination BCF",
      version: "2.1",
      exportedAt: new Date().toISOString(),
      issuesCount: issues.length,
      topics: issues.map((iss) => ({
        guid: iss.id,
        topicType: iss.discipline,
        topicStatus: iss.status,
        priority: iss.priority,
        title: iss.title,
        description: iss.description,
        creationDate: iss.createdAt,
        element: {
          expressID: iss.elementExpressId,
          name: iss.elementName,
          globalId: iss.elementGlobalId,
        },
        viewpoint: iss.viewpoint,
        clippingConfig: iss.clippingConfig,
        comments: iss.comments || [],
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `incidencias_bcf_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredIssues = issues.filter((iss) => {
    if (filterStatus !== "ALL" && iss.status !== filterStatus) return false;
    if (filterPriority !== "ALL" && iss.priority !== filterPriority) return false;
    if (filterDiscipline !== "ALL" && iss.discipline !== filterDiscipline) return false;
    return true;
  });

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      const topics = Array.isArray(payload.topics) ? payload.topics : [];
      onImportIssues?.(
        topics.map((topic, index) => ({
          id: topic.guid || `BCF-IMPORT-${index + 1}`,
          title: topic.title || "Incidencia importada",
          description: topic.description || "",
          priority: topic.priority || "Media",
          discipline: topic.topicType || "Coordinación",
          status: topic.topicStatus || "Abierto",
          createdAt: topic.creationDate || new Date().toLocaleString("es-CL"),
          elementExpressId: topic.element?.expressID || null,
          elementName: topic.element?.name || null,
          elementGlobalId: topic.element?.globalId || null,
          viewpoint: topic.viewpoint || null,
          clippingConfig: topic.clippingConfig || null,
          comments: Array.isArray(topic.comments) ? topic.comments : [],
        }))
      );
    } catch {
      alert("El archivo no contiene un reporte BCF JSON válido.");
    }
    event.target.value = "";
  };

  return (
    <div className="flex flex-col h-full select-none text-xs">
      {/* Botones de Cabecera */}
      <div className="flex items-center gap-2 mb-3">
        <input
          ref={importInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleImport}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleStartCreate}
          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all text-xs"
        >
          <i className="fa-solid fa-camera-retro"></i>
          <span>Nueva Incidencia</span>
        </button>

        {issues.length > 0 && (
          <button
            type="button"
            onClick={handleExportBcfJson}
            title="Exportar Reporte BCF (JSON)"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 hover:border-cyan-500/40 transition-colors"
          >
            <i className="fa-solid fa-file-export text-xs"></i>
          </button>
        )}
        <button
          type="button"
          onClick={() => importInputRef.current?.click()}
          title="Importar incidencias BCF JSON"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
        >
          <i className="fa-solid fa-file-import text-xs"></i>
        </button>
      </div>

      {/* Formulario de Creación de Incidencia */}
      {isCreating ? (
        <form
          onSubmit={handleSaveIssue}
          className="p-3 bg-slate-950/80 rounded-xl border border-blue-500/40 space-y-3 mb-3 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <i className="fa-solid fa-thumbtack text-cyan-400"></i>
              Captura de Incidencia BCF
            </span>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-white"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Miniatura capturada */}
          {capturedSnapshot && (
            <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-700/80 bg-slate-900 relative">
              <img
                src={capturedSnapshot}
                alt="Vista 3D Capturada"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1.5 bg-slate-950/80 text-[9px] font-mono px-1 rounded text-cyan-300">
                Punto de Vista 3D
              </span>
            </div>
          )}

          <div>
            <label htmlFor="bcf-title" className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Título de la Incidencia
            </label>
            <input
              id="bcf-title"
              aria-label="Título de la Incidencia"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Interferencia en nudo viga-columna eje 4"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="bcf-priority" className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Prioridad
              </label>
              <select
                id="bcf-priority"
                aria-label="Prioridad"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>

            <div>
              <label htmlFor="bcf-discipline" className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Disciplina
              </label>
              <select
                id="bcf-discipline"
                aria-label="Disciplina"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Estructural">Estructural</option>
                <option value="Montaje">Montaje</option>
                <option value="Arquitectura">Arquitectura</option>
                <option value="Coordinación">Coordinación</option>
                <option value="MEP">MEP</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="bcf-description" className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Descripción Técnica
            </label>
            <textarea
              id="bcf-description"
              aria-label="Descripción Técnica"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalle o instrucción para el modelador..."
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {selectedElement && (
            <div className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5">
              <i className="fa-solid fa-link text-cyan-400"></i>
              <span className="truncate">
                Vinculado a: #{selectedElement.expressID} ({selectedElement.name || selectedElement.ifcType || "Elemento"})
              </span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
            >
              Guardar Incidencia
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : null}

      {/* Filtros Avanzados: Estado, Prioridad y Disciplina */}
      <div className="space-y-2 p-2 bg-slate-950/60 rounded-xl border border-slate-800 mb-2">
        {/* Filtro de Estado */}
        <div className="flex items-center gap-1">
          {["ALL", "Abierto", "En Revisión", "Resuelto"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`flex-1 py-1 rounded text-[10px] font-semibold transition-colors ${
                filterStatus === st
                  ? "bg-slate-800 text-cyan-300 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {st === "ALL" ? "Todas" : st}
            </button>
          ))}
        </div>

        {/* Filtros Secundarios: Prioridad y Disciplina */}
        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-850">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[10px] text-slate-300 focus:outline-none focus:border-cyan-500"
            title="Filtrar por Prioridad"
            aria-label="Filtrar por prioridad"
          >
            <option value="ALL">Prioridad: Todas</option>
            <option value="Crítica">Crítica</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>

          <select
            value={filterDiscipline}
            onChange={(e) => setFilterDiscipline(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[10px] text-slate-300 focus:outline-none focus:border-cyan-500"
            title="Filtrar por Disciplina"
            aria-label="Filtrar por disciplina"
          >
            <option value="ALL">Disciplina: Todas</option>
            <option value="Estructural">Estructural</option>
            <option value="Montaje">Montaje</option>
            <option value="Arquitectura">Arquitectura</option>
            <option value="Coordinación">Coordinación</option>
            <option value="MEP">MEP</option>
          </select>
        </div>
      </div>

      {/* Lista de Incidencias */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            <i className="fa-solid fa-clipboard-check text-2xl mb-2 block text-slate-600"></i>
            <span>No hay incidencias que coincidan con los filtros seleccionados.</span>
          </div>
        ) : (
          filteredIssues.map((iss) => {
            const priorityColors = {
              Crítica: "bg-rose-500/20 text-rose-400 border-rose-500/40",
              Alta: "bg-amber-500/20 text-amber-400 border-amber-500/40",
              Media: "bg-blue-500/20 text-blue-400 border-blue-500/40",
              Baja: "bg-slate-500/20 text-slate-400 border-slate-500/40",
            };

            const statusColors = {
              Abierto: "text-amber-400 bg-amber-950/60 border-amber-500/40",
              "En Revisión": "text-cyan-400 bg-cyan-950/60 border-cyan-500/40",
              Resuelto: "text-emerald-400 bg-emerald-950/60 border-emerald-500/40",
            };

            const isCommentsOpen = Boolean(expandedIssueComments[iss.id]);
            const issueComments = localComments[iss.id] || iss.comments || [];
            const commentsCount = issueComments.length;

            return (
              <div
                key={iss.id}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 space-y-2 transition-all"
              >
                {/* Cabecera de Tarjeta */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-mono font-bold text-[10px] text-cyan-400">
                        {iss.id}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${
                          priorityColors[iss.priority] || priorityColors.Media
                        }`}
                      >
                        {iss.priority}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {iss.discipline}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-200 text-xs truncate">
                      {iss.title}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteIssue?.(iss.id)}
                    title="Eliminar Incidencia"
                    className="text-slate-500 hover:text-rose-400 text-xs p-1"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>

                {/* Miniatura 3D interactiva */}
                {iss.snapshot && (
                  <div
                    onClick={() => onRestoreViewpoint?.(iss)}
                    title="Clic para restaurar esta vista 3D y planos de sección"
                    className="w-full h-20 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 relative cursor-pointer group"
                  >
                    <img
                      src={iss.snapshot}
                      alt={iss.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-transparent transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-slate-900/90 text-cyan-300 text-[10px] font-bold px-2 py-1 rounded-md shadow-lg transition-opacity flex items-center gap-1">
                        <i className="fa-solid fa-crosshairs"></i> Ir a Vista
                      </span>
                    </div>
                  </div>
                )}

                {iss.description && (
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {iss.description}
                  </p>
                )}

                {/* Historial de Comentarios / Seguimiento */}
                <div className="border-t border-slate-800/80 pt-1.5">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleComments(iss.id)}
                      className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <i className={`fa-solid ${isCommentsOpen ? "fa-chevron-up" : "fa-chevron-down"} text-[8px]`}></i>
                      <span>Comentarios ({commentsCount})</span>
                    </button>
                    <span className="text-[9px] font-mono text-slate-500">
                      {iss.createdAt}
                    </span>
                  </div>

                  {isCommentsOpen && (
                    <div className="mt-2 space-y-1.5 pl-1 border-l-2 border-slate-700/80 animate-in fade-in">
                      {issueComments.map((comm) => (
                        <div key={comm.id} className="p-1.5 rounded bg-slate-900/80 text-[10px]">
                          <div className="flex items-center justify-between text-slate-500 text-[9px] mb-0.5">
                            <strong className="text-slate-300">{comm.author}</strong>
                            <span>{comm.createdAt}</span>
                          </div>
                          <p className="text-slate-300">{comm.text}</p>
                        </div>
                      ))}

                      {/* Input para agregar comentario */}
                      <div className="flex gap-1 pt-1">
                        <input
                          type="text"
                          value={newCommentText[iss.id] || ""}
                          onChange={(e) =>
                            setNewCommentText((prev) => ({ ...prev, [iss.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddComment(iss.id);
                            }
                          }}
                          placeholder="Agregar nota o seguimiento..."
                          className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddComment(iss.id)}
                          className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded text-[10px]"
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pie con Selector de Estado */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-850">
                  <span className="text-[9px] text-slate-400">
                    {iss.elementName ? (
                      <span className="truncate max-w-[140px] inline-block font-mono">
                        {iss.elementName}
                      </span>
                    ) : (
                      "Vista Global"
                    )}
                  </span>

                  <select
                    value={iss.status}
                    onChange={(e) => onUpdateIssueStatus?.(iss.id, e.target.value)}
                    className={`text-[10px] font-bold rounded px-1.5 py-0.5 border cursor-pointer focus:outline-none ${
                      statusColors[iss.status] || statusColors.Abierto
                    }`}
                  >
                    <option value="Abierto">Abierto</option>
                    <option value="En Revisión">En Revisión</option>
                    <option value="Resuelto">Resuelto</option>
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
