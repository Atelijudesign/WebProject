import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { IfcViewport } from "../components/ifc-viewer/IfcViewport";
import { IfcToolbar } from "../components/ifc-viewer/IfcToolbar";
import { IfcRibbon } from "../components/ifc-viewer/IfcRibbon";
import { IfcSidebar } from "../components/ifc-viewer/IfcSidebar";
import { IfcPropertiesPanel } from "../components/ifc-viewer/IfcPropertiesPanel";
import { IfcExportModal } from "../components/ifc-viewer/IfcExportModal";
import { IfcShortcutsModal } from "../components/ifc-viewer/IfcShortcutsModal";
import { IfcMemoryModal } from "../components/ifc-viewer/IfcMemoryModal";
import { IfcQuantitiesModal } from "../components/ifc-viewer/IfcQuantitiesModal";
import { IfcPrivacyModal } from "../components/ifc-viewer/IfcPrivacyModal";
import { IfcErrorBoundary } from "../components/ifc-viewer/IfcErrorBoundary";
import { IfcSelectionHud } from "../components/ifc-viewer/IfcSelectionHud";
import { trackIfcEvent } from "../components/ifc-viewer/ifcTelemetry";
import { IFC_LOAD_TIMEOUT_MS, compareQuantitySummaries, resolvePerformanceProfile, validateIfcFile, validateIfcHeader } from "../components/ifc-viewer/ifcHelpers";
import { clearIfcCache, createIfcFingerprint } from "../components/ifc-viewer/ifcCache";

export default function IfcViewer() {
  // Estado del Archivo y Modelo (Inicializado sin modelo para carga web instantánea)
  const [modelName, setModelName] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [fileObject, setFileObject] = useState(null);
  const [cacheKey, setCacheKey] = useState(null);
  const [cacheStatus, setCacheStatus] = useState("idle");
  const [fileUrl, setFileUrl] = useState(null);
  const [loadTrigger, setLoadTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState({
    phase: "Listo para cargar modelo IFC",
    percent: 0,
  });
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexProgress, setIndexProgress] = useState({ completed: 0, total: 0 });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loadTimings, setLoadTimings] = useState(null);
  const [hasLoadedModel, setHasLoadedModel] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [cancelLoadTrigger, setCancelLoadTrigger] = useState(0);
  const [performanceProfile, setPerformanceProfile] = useState(() => resolvePerformanceProfile("auto", navigator.deviceMemory, window.devicePixelRatio));

  // Estado de Elementos y Categorías
  const [categories, setCategories] = useState([]);
  const [categoryVisibility, setCategoryVisibility] = useState({});
  const [elementsList, setElementsList] = useState([]);
  const [modelElementCount, setModelElementCount] = useState(0);
  const [isSearchIndexLimited, setIsSearchIndexLimited] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedExpressId, setSelectedExpressId] = useState(null);
  const [selectionHistory, setSelectionHistory] = useState([]);
  const [selectionHistoryIndex, setSelectionHistoryIndex] = useState(-1);

  // Estado de Herramientas y Modos
  const [activeMode, setActiveMode] = useState("select"); // 'select' | 'measure-distance' | 'measure-area' | 'section'
  const [isWireframe, setIsWireframe] = useState(false);
  const [renderStyle, setRenderStyle] = useState("shaded"); // 'shaded' | 'transparent' | 'wireframe'
  const [isGridVisible, setIsGridVisible] = useState(true);
  const [isolatedExpressId, setIsolatedExpressId] = useState(null);
  const [hiddenExpressIds, setHiddenExpressIds] = useState(() => new Set());
  const [isOrthographic, setIsOrthographic] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeRibbonTab, setActiveRibbonTab] = useState("file");
  const [isRibbonCollapsed, setIsRibbonCollapsed] = useState(() => {
    try { return localStorage.getItem("ifc_ribbon_collapsed_v1") === "true"; } catch { return false; }
  });
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isQuantitiesModalOpen, setIsQuantitiesModalOpen] = useState(false);
  const [quantitiesInitialTab, setQuantitiesInitialTab] = useState("summary");
  const [baselineInventory, setBaselineInventory] = useState(null);
  const [baselineModelName, setBaselineModelName] = useState(null);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({ fps: 60, drawCalls: 1, triangles: 0 });
  const [autoCreateBcfTrigger, setAutoCreateBcfTrigger] = useState(0);

  // Paneles y Modales
  const [activeSidebarTab, setActiveSidebarTab] = useState(null); // 'categories' | 'search' | 'measurements' | 'section' | null
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [comparison, setComparison] = useState(null);
  const previousInventoryRef = useRef(null);
  const loadStartedAtRef = useRef(performance.now());

  // Ancho personalizable de paneles (con persistencia en localStorage)
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    try {
      const saved = localStorage.getItem("ifc_sidebar_width");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 340 && parsed <= 900) return parsed;
      }
    } catch (_) {}
    return typeof window !== "undefined" && window.innerWidth >= 1920 ? 500 : 460;
  });

  const [propertiesWidth, setPropertiesWidth] = useState(() => {
    try {
      const saved = localStorage.getItem("ifc_properties_width");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 320 && parsed <= 850) return parsed;
      }
    } catch (_) {}
    return typeof window !== "undefined" && window.innerWidth >= 1920 ? 450 : 400;
  });

  const handleSidebarWidthChange = useCallback((newWidth) => {
    setSidebarWidth(newWidth);
    try {
      localStorage.setItem("ifc_sidebar_width", String(newWidth));
    } catch (_) {}
  }, []);

  const handlePropertiesWidthChange = useCallback((newWidth) => {
    setPropertiesWidth(newWidth);
    try {
      localStorage.setItem("ifc_properties_width", String(newWidth));
    } catch (_) {}
  }, []);

  // Mediciones 3D
  const [measurements, setMeasurements] = useState([]);

  // Planos de Sección / Corte
  const [clippingConfig, setClippingConfig] = useState({
    enabled: false,
    x: { enabled: false, position: 0, inverted: false },
    y: { enabled: false, position: 0, inverted: false },
    z: { enabled: false, position: 0, inverted: false },
  });
  const [modelBounds, setModelBounds] = useState(null);

  // Triggers para eventos de Three.js
  const [cameraPresetTrigger, setCameraPresetTrigger] = useState(null);
  const [fitModelTrigger, setFitModelTrigger] = useState(0);
  const [resetViewTrigger, setResetViewTrigger] = useState(0);
  const [zoomToElementTrigger, setZoomToElementTrigger] = useState(0);

  // Gestor de Incidencias BCF
  const [bcfIssues, setBcfIssues] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem("ifc_bcf_issues_v1") || "null"); if (Array.isArray(saved)) return saved; } catch {}
    return [
    {
      id: "BCF-001",
      title: "Verificar conexión apernada en viga costanera eje B",
      description: "Revisar espesor de placa de nudo y cantidad de pernos A325 según plano de detalle.",
      priority: "Alta",
      discipline: "Estructural",
      status: "Abierto",
      createdAt: "15/09/2026, 00:10",
      elementExpressId: 104,
      elementName: "COSTANERA 100x50x2",
    },
    ];
  });
  const captureViewpointRef = useRef(null);
  const [savedViews, setSavedViews] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ifc_saved_views_v1") || "[]"); } catch { return []; }
  });

  // Drag & Drop
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef(null);
  const viewerContainerRef = useRef(null);

  // =========================================================================
  // Manejadores de Carga de Archivos
  // =========================================================================
  const loadLocalFile = async (file) => {
    if (!file || isLoading) return;
    const validation = validateIfcFile(file, navigator.deviceMemory);
    if (!validation.valid) {
      setErrorMessage(validation.message);
      return;
    }

    // Validación de seguridad de cabecera STEP/IFC ISO-10303-21
    const hasValidHeader = await validateIfcHeader(file);
    if (!hasValidHeader) {
      setErrorMessage("El archivo seleccionado no presenta una firma STEP/IFC (ISO-10303-21) válida. Verifica que no sea un archivo corrupto o renombrado.");
      return;
    }

    trackIfcEvent("ifc_file_selected", { sizeCategory: validation.category, sizeBytes: file.size });

    setIsLoading(true);
    setIsIndexing(false);
    setElapsedSeconds(0);
    setLoadTimings(null);
    if (elementsList.length > 0) {
      setBaselineInventory(elementsList);
      setBaselineModelName(modelName);
    }
    previousInventoryRef.current = elementsList.length ? elementsList : null;
    loadStartedAtRef.current = performance.now();
    setErrorMessage(null);
    setModelName(file.name);
    setLoadingProgress({ phase: "Identificando modelo IFC...", percent: 10 });
    setSelectedElement(null);
    setSelectedExpressId(null);
    setMeasurements([]);
    setElementsList([]);
    setModelElementCount(0);
    setIsSearchIndexLimited(false);

    try {
      const fingerprint = await createIfcFingerprint(file);
      setFileUrl(null);
      setFileData(null);
      setFileObject(file);
      setCacheKey(fingerprint);
      setCacheStatus("checking");
      setLoadTrigger(Date.now());
    } catch {
      setIsLoading(false);
      setErrorMessage("No se pudo identificar el archivo IFC desde el disco.");
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      loadLocalFile(file);
    }
  };

  const handleLoadDemoModel = () => {
    if (isLoading) return;
    setIsLoading(true);
    setIsIndexing(false);
    setElapsedSeconds(0);
    setLoadTimings(null);
    setErrorMessage(null);
    if (elementsList.length > 0 && modelName !== "nave-licuadores.ifc") {
      setBaselineInventory(elementsList);
      setBaselineModelName(modelName);
    }
    setModelName("nave-licuadores.ifc");
    setLoadingProgress({ phase: "Cargando modelo demo estructurado...", percent: 10 });
    setSelectedElement(null);
    setSelectedExpressId(null);
    setMeasurements([]);
    setFileData(null);
    setFileObject(null);
    setCacheKey(null);
    setCacheStatus("idle");
    setFileUrl("/models/nave-licuadores.ifc");
    setLoadTrigger(Date.now());
  };

  // Drag & Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    if (isLoading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      loadLocalFile(file);
    }
  };

  // =========================================================================
  // Callbacks desde IfcViewport
  // =========================================================================
  const handleModelLoaded = ({ categories: cats, elementsList: elems, totalElements, indexTruncated, bounds, timings }) => {
    setCategories(cats);
    setElementsList(elems);
    setModelElementCount(totalElements || elems.length);
    setIsSearchIndexLimited(Boolean(indexTruncated));
    setModelBounds(bounds);
    setIsLoading(false);
    setHasLoadedModel(true);
    setIsIndexing(false);
    setLoadTimings(timings);
    if (previousInventoryRef.current) setComparison(compareQuantitySummaries(previousInventoryRef.current, elems));
    const duration = Math.round(performance.now() - loadStartedAtRef.current);
    localStorage.setItem("ifc_last_performance_v1", JSON.stringify({ modelName, duration, indexedElements: elems.length, totalElements, loadedAt: new Date().toISOString() }));
    trackIfcEvent("ifc_model_loaded", {
      totalElements: totalElements || elems.length,
      indexedElements: elems.length,
      durationMs: duration,
      categoryCount: cats.length,
    });

    // Inicializar visibilidad: todas las categorías visibles
    const vis = {};
    cats.forEach((c) => {
      vis[c.type] = true;
    });
    setCategoryVisibility(vis);
  };

  const handleGeometryReady = ({ bounds, timings }) => {
    setModelBounds(bounds);
    setHasLoadedModel(true);
    setIsLoading(false);
    setIsIndexing(true);
    setLoadTimings(timings);
  };

  const handleIndexProgress = ({ completed, total, categories: partialCategories, elementsList: partialElements }) => {
    setIndexProgress({ completed, total });
    setCategories(partialCategories);
    setElementsList(partialElements);
  };

  const handleModelProgress = (prog) => {
    setLoadingProgress(prog);
  };

  useEffect(() => {
    if (!isLoading) return undefined;
    const timeout = window.setTimeout(() => {
      setCancelLoadTrigger(Date.now());
      setFileData(null);
      setFileObject(null);
      setFileUrl(null);
      setIsLoading(false);
      setErrorMessage("La carga superó 2 minutos y fue cancelada para proteger el navegador. Optimiza o divide el archivo IFC.");
    }, IFC_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, [isLoading, loadTrigger]);

  useEffect(() => {
    if (!isLoading && !isIndexing) return undefined;
    const interval = window.setInterval(() => setElapsedSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(interval);
  }, [isLoading, isIndexing]);

  const handleCancelLoad = () => {
    setCancelLoadTrigger(Date.now());
    setFileData(null);
    setFileObject(null);
    setFileUrl(null);
    setIsLoading(false);
    setErrorMessage("Carga cancelada. Puedes seleccionar otro archivo IFC.");
  };

  const handleModelError = (msg) => {
    setIsLoading(false);
    setErrorMessage(msg);
  };

  const handleSourceConsumed = useCallback(() => {
    setFileData(null);
    setFileObject(null);
  }, []);

  const handleClearCache = async () => {
    const cleared = await clearIfcCache();
    setCacheStatus(cleared ? "cleared" : "unavailable");
  };

  const cacheStatusLabel = {
    checking: "Revisando caché",
    hit: "Carga acelerada",
    miss: "Primera conversión",
    saving: "Guardando optimización",
    saved: "Modelo optimizado",
    cleared: "Caché limpia",
    unavailable: "Caché no disponible",
  }[cacheStatus];

  const handleSelectElement = (elem) => {
    setSelectedElement(elem);
    setSelectedExpressId(elem?.expressID || null);
    if (elem) {
      setSelectionHistory((current) => [...current.slice(0, selectionHistoryIndex + 1), elem].slice(-30));
      setSelectionHistoryIndex((current) => Math.min(current + 1, 29));
      setIsPropertiesOpen(true);
    }
  };

  const navigateSelectionHistory = (direction) => {
    const nextIndex = selectionHistoryIndex + direction;
    const element = selectionHistory[nextIndex];
    if (!element) return;
    setSelectionHistoryIndex(nextIndex);
    setSelectedElement(element);
    setSelectedExpressId(element.expressID);
    setZoomToElementTrigger(Date.now());
  };

  // =========================================================================
  // Control de Categorías
  // =========================================================================
  const handleToggleCategory = (type) => {
    setCategoryVisibility((prev) => ({
      ...prev,
      [type]: prev[type] === undefined ? false : !prev[type],
    }));
  };

  const handleIsolateCategory = (type) => {
    const vis = {};
    categories.forEach((c) => {
      vis[c.type] = c.type === type;
    });
    setCategoryVisibility(vis);
  };

  const handleShowAllCategories = () => {
    const vis = {};
    categories.forEach((c) => {
      vis[c.type] = true;
    });
    setCategoryVisibility(vis);
  };

  const handleHideAllCategories = () => {
    const vis = {};
    categories.forEach((c) => {
      vis[c.type] = false;
    });
    setCategoryVisibility(vis);
  };

  // =========================================================================
  // Mediciones 3D
  // =========================================================================
  const handleAddMeasurement = (m) => {
    setMeasurements((prev) => [m, ...prev]);
    setActiveSidebarTab("measurements");
  };

  const handleRemoveMeasurement = (id) => {
    setMeasurements((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClearAllMeasurements = () => {
    setMeasurements([]);
  };

  // =========================================================================
  // Planos de Sección
  // =========================================================================
  const handleUpdateClipping = (updates) => {
    setClippingConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleResetClipping = () => {
    setClippingConfig({
      enabled: false,
      x: { enabled: false, position: 0, inverted: false },
      y: { enabled: false, position: 0, inverted: false },
      z: { enabled: false, position: 0, inverted: false },
    });
  };

  // =========================================================================
  // Selección desde Buscador o Árbol
  // =========================================================================
  const handleSelectFromSearch = (elemOrId) => {
    if (typeof elemOrId === "number") {
      const found = elementsList.find((el) => el.expressID === elemOrId);
      if (found) {
        setSelectedElement(found);
        setSelectedExpressId(found.expressID);
        setIsPropertiesOpen(true);
        setZoomToElementTrigger(Date.now());
      }
      return;
    }

    setSelectedElement(elemOrId);
    setSelectedExpressId(elemOrId?.expressID || null);
    setIsPropertiesOpen(true);
    setZoomToElementTrigger(Date.now());
  };

  // =========================================================================
  // Manejadores de Incidencias BCF
  // =========================================================================
  const handleAddBcfIssue = (newIssue) => {
    setBcfIssues((prev) => [newIssue, ...prev]);
  };

  const handleUpdateBcfIssueStatus = (issueId, newStatus) => {
    setBcfIssues((prev) =>
      prev.map((iss) => (iss.id === issueId ? { ...iss, status: newStatus } : iss))
    );
  };

  const handleDeleteBcfIssue = (issueId) => {
    setBcfIssues((prev) => prev.filter((iss) => iss.id !== issueId));
  };

  const handleImportBcfIssues = (issues) => setBcfIssues((current) => {
    const existing = new Set(current.map((issue) => issue.id));
    return [...current, ...issues.filter((issue) => !existing.has(issue.id))];
  });

  useEffect(() => {
    localStorage.setItem("ifc_bcf_issues_v1", JSON.stringify(bcfIssues));
  }, [bcfIssues]);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setPerformanceProfile("economy");
      setIsPropertiesOpen(false);
      setActiveSidebarTab(null);
    }
  }, []);

  const handleRestoreBcfViewpoint = (issue) => {
    if (issue.viewpoint) {
      setCameraPresetTrigger({
        position: issue.viewpoint.position,
        target: issue.viewpoint.target,
        up: issue.viewpoint.up,
        time: Date.now(),
      });
    }
    if (issue.clippingConfig) {
      setClippingConfig(issue.clippingConfig);
    }
    if (issue.elementExpressId) {
      const found = elementsList.find((el) => el.expressID === issue.elementExpressId);
      if (found) {
        setSelectedElement(found);
        setSelectedExpressId(found.expressID);
        setIsPropertiesOpen(true);
      }
    }
  };

  const saveCurrentView = async () => {
    const capture = captureViewpointRef.current ? await captureViewpointRef.current() : null;
    if (!capture?.cameraState) return;
    const name = window.prompt("Nombre de la vista guardada:", `Vista ${savedViews.length + 1}`)?.trim();
    if (!name) return;
    const next = [...savedViews, { id: crypto.randomUUID?.() || String(Date.now()), name, viewpoint: capture.cameraState, clippingConfig }].slice(-20);
    setSavedViews(next);
    localStorage.setItem("ifc_saved_views_v1", JSON.stringify(next));
  };

  const restoreSavedView = (id) => {
    const view = savedViews.find((item) => item.id === id);
    if (!view) return;
    setCameraPresetTrigger({ ...view.viewpoint, time: Date.now() });
    if (view.clippingConfig) setClippingConfig(view.clippingConfig);
  };

  // =========================================================================
  // Pantalla Completa
  // =========================================================================
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleToggleRibbon = () => {
    setIsRibbonCollapsed((current) => {
      const next = !current;
      try { localStorage.setItem("ifc_ribbon_collapsed_v1", String(next)); } catch {}
      return next;
    });
  };

  // =========================================================================
  // Manejo de Visibilidad de Elementos (Aislar / Ocultar / Mostrar Todo)
  // =========================================================================
  const handleIsolateSelected = () => {
    if (!selectedExpressId) return;
    setIsolatedExpressId((current) => (current === selectedExpressId ? null : selectedExpressId));
  };

  const handleHideSelected = () => {
    if (!selectedExpressId) return;
    setHiddenExpressIds((current) => {
      const next = new Set(current);
      next.add(selectedExpressId);
      return next;
    });
    setSelectedElement(null);
    setSelectedExpressId(null);
  };

  const handleShowAllElements = () => {
    setIsolatedExpressId(null);
    setHiddenExpressIds(new Set());
    handleShowAllCategories();
  };

  const handleToggleClippingAxis = (axis) => {
    setClippingConfig((prev) => {
      const isCurrentlyEnabled = Boolean(prev[axis]?.enabled);
      const nextAxisState = {
        ...prev[axis],
        enabled: !isCurrentlyEnabled,
      };
      const anyAxisEnabled =
        (axis === "x" ? !isCurrentlyEnabled : prev.x.enabled) ||
        (axis === "y" ? !isCurrentlyEnabled : prev.y.enabled) ||
        (axis === "z" ? !isCurrentlyEnabled : prev.z.enabled);

      return {
        ...prev,
        enabled: anyAxisEnabled,
        [axis]: nextAxisState,
      };
    });
  };

  const handleDisposeModel = () => {
    setModelName(null);
    setFileData(null);
    setFileObject(null);
    setFileUrl(null);
    setHasLoadedModel(false);
    setModelElementCount(0);
    setElementsList([]);
    setCategories([]);
    setSelectedElement(null);
    setSelectedExpressId(null);
    setMeasurements([]);
    setLoadTrigger(0);
    setIsolatedExpressId(null);
    setHiddenExpressIds(new Set());
  };

  // =========================================================================
  // Enrutamiento de Comandos de la Ribbon (Fases 1 a 4)
  // =========================================================================
  const handleRibbonCommand = (commandId) => {
    trackIfcEvent("ifc_command_triggered", { command: commandId });
    switch (commandId) {
      // Pestaña Archivo
      case "open":
        fileInputRef.current?.click();
        break;
      case "demo":
        handleLoadDemoModel();
        break;
      case "clear-model":
        handleDisposeModel();
        break;
      case "export":
        setIsExportModalOpen(true);
        break;
      case "cache":
        setIsMemoryModalOpen(true);
        break;
      case "privacy":
        setIsPrivacyModalOpen(true);
        break;

      // Pestaña Vista
      case "iso":
      case "top":
      case "front":
      case "right":
        setCameraPresetTrigger({ preset: commandId, time: Date.now() });
        break;
      case "fit":
        setFitModelTrigger(Date.now());
        break;
      case "reset-view":
        setResetViewTrigger(Date.now());
        break;
      case "walk":
        setActiveMode((curr) => (curr === "walk" ? "select" : "walk"));
        break;
      case "save-view":
        saveCurrentView();
        break;
      case "projection":
        setIsOrthographic((prev) => !prev);
        break;
      case "toggle-grid":
        setIsGridVisible((prev) => !prev);
        break;
      case "fullscreen":
        handleToggleFullscreen();
        break;
      case "shortcuts":
        setIsShortcutsModalOpen(true);
        break;

      // Pestaña Analizar
      case "distance":
        setActiveMode((curr) => (curr === "measure-distance" ? "select" : "measure-distance"));
        break;
      case "area":
        setActiveMode((curr) => (curr === "measure-area" ? "select" : "measure-area"));
        break;
      case "clear-measurements":
        handleClearAllMeasurements();
        break;
      case "quantities":
        setQuantitiesInitialTab("summary");
        setIsQuantitiesModalOpen(true);
        break;
      case "compare":
        setQuantitiesInitialTab("compare");
        setIsQuantitiesModalOpen(true);
        break;

      // Pestaña Sección
      case "section-x":
        handleToggleClippingAxis("x");
        break;
      case "section-y":
        handleToggleClippingAxis("y");
        break;
      case "section-z":
        handleToggleClippingAxis("z");
        break;
      case "section-box":
        setActiveMode("section");
        setActiveSidebarTab("section");
        setClippingConfig((prev) => ({
          ...prev,
          enabled: true,
          x: { ...prev.x, enabled: true },
          y: { ...prev.y, enabled: true },
          z: { ...prev.z, enabled: true },
        }));
        break;
      case "reset-section":
        handleResetClipping();
        break;

      // Pestaña Elementos
      case "select":
        setActiveMode("select");
        break;
      case "palette":
        setActiveSidebarTab("elements");
        break;
      case "search":
        setActiveSidebarTab("elements");
        break;
      case "tree":
        setActiveSidebarTab("tree");
        break;
      case "properties":
        setIsPropertiesOpen((prev) => !prev);
        break;
      case "isolate":
        handleIsolateSelected();
        break;
      case "hide":
        handleHideSelected();
        break;
      case "show-all":
        handleShowAllElements();
        break;

      // Pestaña Revisión
      case "new-issue":
        setActiveSidebarTab("bcf");
        setAutoCreateBcfTrigger(Date.now());
        break;
      case "issues":
        setActiveSidebarTab("bcf");
        break;
      case "capture":
        if (captureViewpointRef.current) {
          const cap = captureViewpointRef.current();
          if (cap?.snapshot) {
            const link = document.createElement("a");
            const safeModelBase = (modelName || "modelo").replace(/\.ifc$/i, "");
            link.download = `captura-${safeModelBase}-${Date.now()}.png`;
            link.href = cap.snapshot;
            link.click();
          }
        }
        break;
      case "bcf-export":
        setIsExportModalOpen(true);
        break;

      // Pestaña Rendimiento
      case "style-shaded":
        setRenderStyle("shaded");
        setIsWireframe(false);
        break;
      case "style-transparent":
        setRenderStyle("transparent");
        setIsWireframe(false);
        break;
      case "style-wireframe":
        setIsWireframe((prev) => !prev);
        break;
      case "economy":
      case "balanced":
      case "quality":
        setPerformanceProfile(commandId);
        break;
      case "memory":
        setIsMemoryModalOpen(true);
        break;
      case "clear-cache":
        handleClearCache();
        break;

      default:
        break;
    }
  };

  const activeCommands = useMemo(() => ({
    "select": activeMode === "select",
    "walk": activeMode === "walk",
    "distance": activeMode === "measure-distance",
    "area": activeMode === "measure-area",
    "section-box": activeMode === "section" && clippingConfig.enabled,
    "section-x": clippingConfig.enabled && clippingConfig.x.enabled,
    "section-y": clippingConfig.enabled && clippingConfig.y.enabled,
    "section-z": clippingConfig.enabled && clippingConfig.z.enabled,
    "projection": isOrthographic,
    "toggle-grid": isGridVisible,
    "fullscreen": isFullscreen,
    "style-shaded": renderStyle === "shaded" && !isWireframe,
    "style-transparent": renderStyle === "transparent" && !isWireframe,
    "style-wireframe": isWireframe || renderStyle === "wireframe",
    "economy": performanceProfile === "economy",
    "balanced": performanceProfile === "balanced",
    "quality": performanceProfile === "quality",
    "properties": isPropertiesOpen,
    "palette": activeSidebarTab === "elements" || activeSidebarTab === "search" || activeSidebarTab === "palette",
    "search": activeSidebarTab === "elements" || activeSidebarTab === "search" || activeSidebarTab === "palette",
    "tree": activeSidebarTab === "tree",
    "isolate": Boolean(isolatedExpressId),
    "issues": activeSidebarTab === "bcf",
  }), [
    activeMode,
    clippingConfig,
    isOrthographic,
    isGridVisible,
    isFullscreen,
    renderStyle,
    isWireframe,
    performanceProfile,
    isPropertiesOpen,
    activeSidebarTab,
    isolatedExpressId,
  ]);

  // =========================================================================
  // Atajos de Teclado
  // =========================================================================
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignorar si el usuario está escribiendo en un input
      if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;

      if (e.key === "Escape") {
        setSelectedElement(null);
        setSelectedExpressId(null);
        setActiveMode("select");
      } else if (e.key === "v" || e.key === "V") {
        setActiveMode("select");
      } else if (e.key === "m" || e.key === "M") {
        setActiveMode("measure-distance");
      } else if (e.key === "a" || e.key === "A") {
        setActiveMode("measure-area");
      } else if (e.key === "c" || e.key === "C") {
        setActiveMode("section");
        setActiveSidebarTab("section");
      } else if (e.key === "f" || e.key === "F") {
        if (selectedExpressId) {
          setZoomToElementTrigger(Date.now());
        } else {
          setFitModelTrigger(Date.now());
        }
      } else if (e.key === "w" || e.key === "W") {
        setIsWireframe((prev) => !prev);
      } else if (e.key === "?") {
        setIsShortcutsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <IfcErrorBoundary onReset={handleLoadDemoModel}>
      <div
        ref={viewerContainerRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="relative w-full h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none"
      >
      <SEOHead
        title="Visor IFC Web 3D Interactivo · BIM Estructural"
        description="Visualizador BIM 3D en línea: carga modelos IFC locales, inspecciona propiedades y Psets, planos de sección, mide distancias y áreas, y exporta a CSV o JSON."
        path="/herramientas/visor-ifc"
        keywords="Visor IFC online, visor BIM 3D, Web-IFC viewer, Three.js BIM, cubicador IFC, planos de corte IFC"
      />

      {/* Input oculto para carga de archivos */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".ifc"
        className="hidden"
      />

      {/* =================================================================== */}
      {/* 1. TOP BAR DE NAVEGACIÓN Y ESTADO DEL MODELO */}
      {/* =================================================================== */}
      <header className="h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-30">
        {/* Lado Izquierdo: Volver & Título */}
        <div className="flex items-center gap-3">
          <Link
            to="/herramientas"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/50"
            title="Volver al Catálogo de Herramientas"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            <span className="hidden sm:inline">Herramientas</span>
          </Link>

          <div className="h-5 w-px bg-slate-800"></div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <i className="fa-solid fa-cube text-sm"></i>
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-white leading-tight flex items-center gap-2">
                <span>Visor IFC Estructural</span>
                <span className="hidden md:inline px-1.5 py-0.5 rounded bg-blue-900/40 text-blue-400 border border-blue-500/30 text-[10px] font-mono font-bold">
                  BIM 3D
                </span>
              </h1>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                <i className="fa-solid fa-file-code text-[10px] text-cyan-400"></i>
                <span className="truncate text-slate-300">{modelName || "Sin modelo cargado"}</span>
                {modelElementCount > 0 ? (
                  <span className="text-slate-500">
                    • {modelElementCount.toLocaleString("es-CL")} elementos
                  </span>
                ) : (
                  <span className="text-slate-500">• Listo</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Acciones de Archivo y Modelo */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPrivacyModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1 text-[11px] font-medium text-emerald-300 hover:bg-emerald-900/40 transition"
            title="Procesamiento 100% en tu navegador (Client-Side) - Privacidad absoluta"
          >
            <i className="fa-solid fa-shield-halved text-emerald-400"></i>
            <span className="hidden lg:inline">100% Local</span>
          </button>

          {cacheStatusLabel && (
            <button
              type="button"
              onClick={handleClearCache}
              className="hidden xl:flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-900/40"
              title="La siguiente apertura del mismo IFC usa su conversión local. Pulsa para limpiar la caché."
            >
              <i className="fa-solid fa-bolt"></i>
              <span>{cacheStatusLabel}</span>
            </button>
          )}
          <div className="hidden md:flex items-center gap-1">
            <button type="button" onClick={() => navigateSelectionHistory(-1)} disabled={selectionHistoryIndex <= 0} className="w-8 h-8 rounded-lg border border-slate-700 text-slate-300 disabled:opacity-30" title="Selección anterior">←</button>
            <button type="button" onClick={() => navigateSelectionHistory(1)} disabled={selectionHistoryIndex < 0 || selectionHistoryIndex >= selectionHistory.length - 1} className="w-8 h-8 rounded-lg border border-slate-700 text-slate-300 disabled:opacity-30" title="Selección siguiente">→</button>
          </div>
          <label className="hidden lg:flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-slate-300">Rendimiento
            <select value={performanceProfile} onChange={(event) => setPerformanceProfile(event.target.value)} className="bg-transparent text-white outline-none"><option value="economy">Económico</option><option value="balanced">Equilibrado</option><option value="quality">Calidad</option></select>
          </label>
          <button type="button" onClick={saveCurrentView} disabled={!hasLoadedModel} className="hidden lg:block rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 disabled:opacity-30" title="Guardar cámara y cortes">Guardar vista</button>
          {savedViews.length > 0 && <select defaultValue="" onChange={(event) => { restoreSavedView(event.target.value); event.target.value = ""; }} className="hidden xl:block rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-200"><option value="">Abrir vista…</option>{savedViews.map((view) => <option key={view.id} value={view.id}>{view.name}</option>)}</select>}
          {/* Botón Cargar IFC Local */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all"
            title="Abrir un archivo .IFC local desde tu computadora"
          >
            <i className="fa-solid fa-folder-open text-xs"></i>
            <span>Cargar IFC</span>
          </button>

          {/* Botón Cargar Modelo Demo */}
          <button
            type="button"
            onClick={handleLoadDemoModel}
            disabled={isLoading}
            className="hidden sm:flex px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 hover:text-white border border-slate-700 transition-colors items-center gap-1.5"
            title="Recargar el modelo de prueba nave-licuadores.ifc"
          >
            <i className="fa-solid fa-building text-xs text-amber-400"></i>
            <span>Modelo Demo</span>
          </button>
        </div>
      </header>

      <IfcRibbon
        activeTab={activeRibbonTab}
        onTabChange={setActiveRibbonTab}
        collapsed={isRibbonCollapsed}
        onToggleCollapsed={handleToggleRibbon}
        onCommand={handleRibbonCommand}
        activeCommands={activeCommands}
        disabled={isLoading}
      />

      {/* =================================================================== */}
      {/* 2. CONTENEDOR PRINCIPAL DEL VIEWPORT Y PANELES */}
      {/* =================================================================== */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Panel Lateral Izquierdo (Pestañas) */}
        <IfcSidebar
          isOpen={activeSidebarTab !== null}
          activeTab={activeSidebarTab}
          onTabChange={(tab) =>
            setActiveSidebarTab((curr) => (curr === tab ? null : tab))
          }
          onClose={() => setActiveSidebarTab(null)}
          categories={categories}
          categoryVisibility={categoryVisibility}
          onToggleCategory={handleToggleCategory}
          onIsolateCategory={handleIsolateCategory}
          onShowAllCategories={handleShowAllCategories}
          onHideAllCategories={handleHideAllCategories}
          elementsList={elementsList}
          onSelectElementFromSearch={handleSelectFromSearch}
          selectedExpressId={selectedExpressId}
          measurements={measurements}
          onRemoveMeasurement={handleRemoveMeasurement}
          onClearAllMeasurements={handleClearAllMeasurements}
          clippingConfig={clippingConfig}
          onUpdateClipping={handleUpdateClipping}
          onResetClipping={handleResetClipping}
          modelBounds={modelBounds}
          modelName={modelName}
          bcfIssues={bcfIssues}
          onAddBcfIssue={handleAddBcfIssue}
          onUpdateBcfIssueStatus={handleUpdateBcfIssueStatus}
          onDeleteBcfIssue={handleDeleteBcfIssue}
          onRestoreBcfViewpoint={handleRestoreBcfViewpoint}
          selectedElement={selectedElement}
          onCaptureViewpoint={() =>
            captureViewpointRef.current ? captureViewpointRef.current() : null
          }
          onImportBcfIssues={handleImportBcfIssues}
          autoCreateBcfTrigger={autoCreateBcfTrigger}
          onZoomToElement={() => setZoomToElementTrigger(Date.now())}
          isSearchIndexLimited={isSearchIndexLimited}
          width={sidebarWidth}
          onWidthChange={handleSidebarWidthChange}
        />

        {/* Viewport 3D Canvas */}
        <main className="relative flex-1 h-full w-full bg-slate-950 overflow-hidden min-w-[280px]">
          <IfcViewport
            modelName={modelName}
            fileData={fileData}
            fileObject={fileObject}
            cacheKey={cacheKey}
            fileUrl={fileUrl}
            loadTrigger={loadTrigger}
            cancelLoadTrigger={cancelLoadTrigger}
            performanceProfile={performanceProfile}
            activeMode={activeMode}
            isWireframe={isWireframe}
            renderStyle={renderStyle}
            isGridVisible={isGridVisible}
            isolatedExpressId={isolatedExpressId}
            hiddenExpressIds={hiddenExpressIds}
            isOrthographic={isOrthographic}
            onToggleProjection={() => setIsOrthographic((prev) => !prev)}
            cameraPresetTrigger={cameraPresetTrigger}
            fitModelTrigger={fitModelTrigger}
            resetViewTrigger={resetViewTrigger}
            categoryVisibility={categoryVisibility}
            onLoaded={handleModelLoaded}
            onGeometryReady={handleGeometryReady}
            onIndexProgress={handleIndexProgress}
            onProgress={handleModelProgress}
            onError={handleModelError}
            onSourceConsumed={handleSourceConsumed}
            onCacheStatus={setCacheStatus}
            onSelectElement={handleSelectElement}
            selectedElement={selectedElement}
            selectedExpressId={selectedExpressId}
            zoomToElementTrigger={zoomToElementTrigger}
            measurements={measurements}
            onAddMeasurement={handleAddMeasurement}
            clippingConfig={clippingConfig}
            onModelBoundsComputed={setModelBounds}
            onRegisterCapture={(fn) => {
              captureViewpointRef.current = fn;
            }}
            onPerformanceMetrics={setPerformanceMetrics}
          />

          {/* Barra Flotante HUD de Selección Activa (Acción de Feedback Visual) */}
          {hasLoadedModel && selectedElement && (
            <IfcSelectionHud
              selectedElement={selectedElement}
              onClearSelection={() => {
                setSelectedElement(null);
                setSelectedExpressId(null);
              }}
              onZoomToElement={() => setZoomToElementTrigger(Date.now())}
              onIsolateElement={handleIsolateSelected}
              onHideElement={handleHideSelected}
              onOpenProperties={() => setIsPropertiesOpen(true)}
              isIsolated={isolatedExpressId === selectedExpressId}
            />
          )}

          {/* Pantalla Inicial / Empty State: Solo se muestra si no hay modelo cargado y no está cargando */}
          {!hasLoadedModel && !isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-[2px] pointer-events-auto animate-in fade-in duration-200">
              <div className="max-w-lg w-full rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl shadow-cyan-950/20 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600/20 to-cyan-500/20 border border-cyan-500/30 text-cyan-400">
                  <i className="fa-solid fa-cube text-3xl"></i>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Visor IFC Web 3D Interactivo
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                  Carga modelos BIM estructurales al instante y realiza mediciones, planos de corte y gestión BCF con procesamiento 100% local.
                </p>

                {/* Acciones Principales */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <i className="fa-solid fa-folder-open"></i>
                    <span>Abrir Archivo IFC Local</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLoadDemoModel}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <i className="fa-solid fa-building text-cyan-400"></i>
                    <span>Cargar Modelo de Ejemplo</span>
                  </button>
                </div>

                <p className="mt-3.5 text-[11px] text-slate-500">
                  o arrastra y suelta tu archivo <code className="text-cyan-400 font-mono">.ifc</code> aquí
                </p>

                {/* Tarjetas Bento de Ventajas */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-5 border-t border-slate-800/80 text-left">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-2.5">
                    <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-1">
                      <i className="fa-solid fa-bolt"></i>
                      <span>Ultra Rápido</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Carga inicial instantánea sin consumo de datos de red.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-2.5">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
                      <i className="fa-solid fa-shield-halved"></i>
                      <span>100% Local</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Tus archivos nunca salen de tu equipo ni se suben a servidores.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-2.5">
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                      <i className="fa-solid fa-chart-column"></i>
                      <span>Cubicación & BCF</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Exportación CSV, comparación de versiones y BCF 2.1.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Barra de Herramientas Flotante (solo visible si hay modelo cargado) */}
          {hasLoadedModel && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <IfcToolbar
                activeMode={activeMode}
                onModeChange={(mode) => {
                  setActiveMode(mode);
                  if (mode === "section") {
                    setActiveSidebarTab("section");
                  }
                }}
                isWireframe={isWireframe}
                onToggleWireframe={() => setIsWireframe((prev) => !prev)}
                isOrthographic={isOrthographic}
                onToggleProjection={() => setIsOrthographic((prev) => !prev)}
                onCameraPreset={(preset) =>
                  setCameraPresetTrigger({ preset, time: Date.now() })
                }
                onFitModel={() => setFitModelTrigger(Date.now())}
                onResetView={() => setResetViewTrigger(Date.now())}
                activeSidebarTab={activeSidebarTab}
                onToggleSidebarTab={(tab) =>
                  setActiveSidebarTab((curr) => (curr === tab ? null : tab))
                }
                isPropertiesOpen={isPropertiesOpen}
                onToggleProperties={() => setIsPropertiesOpen((prev) => !prev)}
                onClearSelection={() => {
                  setSelectedElement(null);
                  setSelectedExpressId(null);
                }}
                hasSelection={selectedElement !== null}
                onOpenExportModal={() => setIsExportModalOpen(true)}
                isFullscreen={isFullscreen}
                onToggleFullscreen={handleToggleFullscreen}
              />
            </div>
          )}
        </main>

        {/* Panel Lateral Derecho: Inspector de Propiedades */}
        <IfcPropertiesPanel
          isOpen={isPropertiesOpen}
          onClose={() => setIsPropertiesOpen(false)}
          selectedElement={selectedElement}
          onZoomToElement={() => setZoomToElementTrigger(Date.now())}
          width={propertiesWidth}
          onWidthChange={handlePropertiesWidthChange}
        />
      </div>

      {isSearchIndexLimited && !isLoading && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 rounded-lg border border-amber-500/40 bg-amber-950/90 px-4 py-2 text-xs text-amber-100 shadow-xl backdrop-blur-md">
          El modelo 3D está completo. Para proteger la memoria, la búsqueda y exportación muestran los primeros {elementsList.length.toLocaleString("es-CL")} elementos.
        </div>
      )}
      {isIndexing && !isLoading && <div className="absolute bottom-24 left-1/2 z-40 w-[min(92vw,420px)] -translate-x-1/2 rounded-xl border border-cyan-500/40 bg-slate-900/95 p-3 shadow-2xl backdrop-blur"><div className="flex items-center justify-between text-xs"><strong className="text-white">Modelo visible · preparando herramientas BIM</strong><span className="font-mono text-cyan-300">{indexProgress.completed}/{indexProgress.total || "…"}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all" style={{ width: `${indexProgress.total ? (indexProgress.completed / indexProgress.total) * 100 : 5}%` }} /></div><p className="mt-2 text-[10px] text-slate-400">Ya puedes navegar. Árbol, búsqueda y cubicación se habilitan progresivamente · {elapsedSeconds}s.</p></div>}
      {loadTimings?.indexReadyMs && !isLoading && !isIndexing && <div className="absolute bottom-3 left-3 z-30 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-[10px] font-mono text-slate-400">Geometría {(loadTimings.geometryReadyMs / 1000).toFixed(1)}s · BIM {(loadTimings.indexReadyMs / 1000).toFixed(1)}s</div>}
      {comparison && !isLoading && <div className="absolute right-4 top-16 z-40 max-w-sm rounded-xl border border-cyan-500/40 bg-slate-900/95 p-3 text-xs shadow-2xl"><div className="flex items-center justify-between"><strong className="text-white">Cambios respecto al modelo anterior</strong><button onClick={() => setComparison(null)} className="text-slate-400">×</button></div>{comparison.length ? <div className="mt-2 max-h-40 space-y-1 overflow-y-auto">{comparison.slice(0, 12).map((item) => <div key={item.type} className="flex justify-between text-slate-300"><span>{item.label}</span><strong className={item.difference > 0 ? "text-emerald-400" : "text-rose-400"}>{item.difference > 0 ? "+" : ""}{item.difference}</strong></div>)}</div> : <p className="mt-2 text-emerald-300">No cambiaron las cantidades estructurales indexadas.</p>}<p className="mt-2 text-[10px] text-slate-500">Comparación ligera por categorías; no mantiene dos modelos 3D en memoria.</p></div>}
      {showTutorial && <div className="absolute inset-0 z-[70] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur"><div className="max-w-md rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 text-center shadow-2xl"><i className="fa-solid fa-cube text-3xl text-cyan-400"></i><h2 className="mt-3 text-xl font-bold text-white">Visor IFC local y privado</h2><p className="mt-2 text-sm leading-relaxed text-slate-300">Carga o arrastra un IFC, selecciona elementos para revisar propiedades y usa Árbol, Clases y Buscar para navegar. Los archivos no se suben a un servidor.</p><ul className="mt-4 space-y-2 text-left text-xs text-slate-400"><li>• Usa Económico en móviles o equipos limitados.</li><li>• Guarda vistas con cámara y cortes.</li><li>• Exporta cantidades e incidencias BCF.</li></ul><button onClick={() => { localStorage.setItem("ifc_tutorial_seen_v1", "true"); setShowTutorial(false); }} className="mt-5 rounded-lg bg-cyan-500 px-5 py-2 text-sm font-bold text-slate-950">Entendido, abrir visor</button></div></div>}

      {/* =================================================================== */}
      {/* 3. MODALES DE EXPORTACIÓN, ATAJOS Y MEMORIA */}
      {/* =================================================================== */}
      <IfcExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedElement={selectedElement}
        elementsList={elementsList}
        measurements={measurements}
        modelName={(modelName || "modelo").replace(/\.ifc$/i, "")}
      />

      <IfcShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <IfcMemoryModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        modelName={modelName}
        modelElementCount={modelElementCount}
        indexedElementCount={elementsList.length}
        categoryCount={categories.length}
        performanceProfile={performanceProfile}
        onProfileChange={setPerformanceProfile}
        onDisposeModel={handleDisposeModel}
        hasLoadedModel={hasLoadedModel}
        cacheStatus={cacheStatus}
        fps={performanceMetrics.fps}
        gpuMetrics={performanceMetrics}
      />

      <IfcPrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <IfcQuantitiesModal
        isOpen={isQuantitiesModalOpen}
        onClose={() => setIsQuantitiesModalOpen(false)}
        elementsList={elementsList}
        categories={categories}
        modelBounds={modelBounds}
        modelName={modelName}
        loadTimings={loadTimings}
        baselineInventory={baselineInventory}
        baselineModelName={baselineModelName}
        onSetBaseline={(items, name) => {
          setBaselineInventory(items);
          setBaselineModelName(name);
        }}
        initialTab={quantitiesInitialTab}
      />

      {/* =================================================================== */}
      {/* 4. OVERLAY DE CARGA (LOADING) */}
      {/* =================================================================== */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin"></div>
            <div className="absolute inset-3 rounded-full bg-slate-900 border border-slate-700/60 flex items-center justify-center text-cyan-400 text-xl">
              <i className="fa-solid fa-cube"></i>
            </div>
          </div>

          <h2 className="text-lg font-bold text-white mb-2 font-mono">
            {loadingProgress.phase}
          </h2>

          <div className="w-64 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60 mb-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${loadingProgress.percent}%` }}
            ></div>
          </div>

          <span className="text-xs font-mono text-slate-400">
            {loadingProgress.percent}% completado · {elapsedSeconds}s
          </span>
          <button type="button" onClick={handleCancelLoad} className="mt-5 rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800">Cancelar carga</button>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. OVERLAY DE DRAG & DROP */}
      {/* =================================================================== */}
      {isDraggingFile && (
        <div className="absolute inset-0 bg-blue-950/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 border-4 border-dashed border-cyan-400 animate-in fade-in duration-150 pointer-events-none">
          <div className="w-24 h-24 rounded-3xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-4xl text-cyan-400 mb-6 animate-bounce">
            <i className="fa-solid fa-cloud-arrow-up"></i>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">
            Suelta tu archivo .IFC aquí
          </h2>
          <p className="text-sm text-cyan-200">
            Se procesará localmente en tu navegador mediante Web-IFC WebAssembly
          </p>
        </div>
      )}

      {/* =================================================================== */}
      {/* 6. OVERLAY DE ERROR */}
      {/* =================================================================== */}
      {errorMessage && (
        <div className="absolute bottom-6 left-6 z-50 max-w-md bg-rose-950/90 border border-rose-500/60 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-start gap-3 text-rose-200">
          <i className="fa-solid fa-triangle-exclamation text-rose-400 text-lg mt-0.5"></i>
          <div className="flex-1 text-xs">
            <h3 className="font-bold text-white mb-1">Error al procesar modelo</h3>
            <p className="text-rose-300 leading-relaxed">{errorMessage}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleLoadDemoModel}
                className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Cargar Modelo Demo
              </button>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </IfcErrorBoundary>
  );
}
