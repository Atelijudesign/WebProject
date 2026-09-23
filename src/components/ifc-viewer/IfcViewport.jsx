import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as OBC from "@thatopen/components";
import * as FRAGS from "@thatopen/fragments";
import fragmentsWorkerUrl from "@thatopen/fragments/worker?url";
import {
  STRUCTURAL_CATEGORIES,
  cleanPropertySets,
  extractIfcValue,
  calculatePolygonArea3D,
  calculatePolygonPerimeter3D,
  IFC_SEARCH_INDEX_LIMIT,
  getRendererPixelRatio,
  createLoadTimings,
} from "./ifcHelpers";
import { IfcViewCube } from "./IfcViewCube";
import { getCachedFragments, putCachedFragments } from "./ifcCache";

export const IfcViewport = ({
  modelName,
  fileData,
  fileObject,
  cacheKey,
  fileUrl,
  loadTrigger,
  cancelLoadTrigger,
  performanceProfile = "balanced",
  activeMode,
  isWireframe,
  renderStyle = "shaded",
  isGridVisible = true,
  isolatedExpressId = null,
  hiddenExpressIds = null,
  isOrthographic,
  onToggleProjection,
  cameraPresetTrigger,
  fitModelTrigger,
  resetViewTrigger,
  categoryVisibility,
  onLoaded,
  onGeometryReady,
  onIndexProgress,
  onProgress,
  onError,
  onSourceConsumed,
  onCacheStatus,
  onSelectElement,
  selectedElement,
  selectedExpressId,
  zoomToElementTrigger,
  measurements,
  onAddMeasurement,
  clippingConfig,
  onModelBoundsComputed,
  onRegisterCapture,
  onPerformanceMetrics,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const gridRef = useRef(null);
  const selectionHelperRef = useRef(null);
  const selectionBoxRef = useRef(new THREE.Box3());

  // Referencias para Modo Peatonal (Walk Mode)
  const activeModeRef = useRef(activeMode);
  activeModeRef.current = activeMode;
  const keysPressedRef = useRef({});
  const isWalkingPointerDownRef = useRef(false);
  const walkPointerStartRef = useRef({ x: 0, y: 0 });

  // Referencias a Three.js
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const perspectiveCameraRef = useRef(null);
  const orthographicCameraRef = useRef(null);
  const controlsRef = useRef(null);
  const componentsRef = useRef(null);
  const fragmentsRef = useRef(null);
  const ifcLoaderRef = useRef(null);
  const classifierRef = useRef(null);
  const engineReadyRef = useRef(Promise.resolve());
  const modelRef = useRef(null);
  const categoryIdsRef = useRef(new Map());
  const loadGenerationRef = useRef(0);
  const loadQueueRef = useRef(Promise.resolve());
  const pageVisibleRef = useRef(true);
  const boundingBoxRef = useRef(null);
  const modelCenterRef = useRef(new THREE.Vector3());
  const modelRadiusRef = useRef(50);
  const clippingPlanesRef = useRef({
    x: new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0),
    y: new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
    z: new THREE.Plane(new THREE.Vector3(0, 0, -1), 0),
  });

  // Material de resaltado (Cyan vibrante)
  const highlightMaterialRef = useRef({
    color: new THREE.Color(0x06b6d4),
    renderedFaces: FRAGS.RenderedFaces.TWO,
    opacity: 0.85,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    preserveOriginalMaterial: true,
    customId: "viewer-selection",
  });

  // Grupos para mediciones 3D
  const measurementsGroupRef = useRef(new THREE.Group());
  const activeMeasureStateRef = useRef({
    points: [], // Puntos para distancia o área
    tempLine: null,
    tempPoints: null,
    previewMesh: null,
  });

  // Etiquetas 2D flotantes sobre el canvas (coordenadas proyectadas)
  const [floatingLabels, setFloatingLabels] = useState([]);
  const [hoverCursorPos, setHoverCursorPos] = useState(null);

  // =========================================================================
  // 1. INICIALIZACIÓN DE LA ESCENA THREE.JS
  // =========================================================================
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // Escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    sceneRef.current = scene;

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight1.position.set(60, 100, 70);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x90cdf4, 0.4);
    dirLight2.position.set(-60, -30, -50);
    scene.add(dirLight2);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.6);
    scene.add(hemiLight);

    // Rejilla de Referencia (Grid)
    const grid = new THREE.GridHelper(100, 50, 0x3b82f6, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);
    gridRef.current = grid;

    // Grupo de Mediciones
    scene.add(measurementsGroupRef.current);

    // Caja 3D de Selección (Cyan Neón)
    const selBox = new THREE.Box3();
    const selHelper = new THREE.Box3Helper(selBox, new THREE.Color(0x06b6d4));
    selHelper.visible = false;
    selHelper.material.depthTest = false;
    selHelper.material.transparent = true;
    selHelper.material.opacity = 0.95;
    selHelper.renderOrder = 999;
    scene.add(selHelper);
    selectionHelperRef.current = selHelper;
    selectionBoxRef.current = selBox;

    // Cámaras
    const aspect = width / height;
    const persCamera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    persCamera.position.set(40, 30, 40);
    perspectiveCameraRef.current = persCamera;

    const orthoFrustum = 30;
    const orthoCamera = new THREE.OrthographicCamera(
      -orthoFrustum * aspect,
      orthoFrustum * aspect,
      orthoFrustum,
      -orthoFrustum,
      0.1,
      1000
    );
    orthoCamera.position.set(40, 30, 40);
    orthographicCameraRef.current = orthoCamera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: performanceProfile !== "economy",
      alpha: true,
      powerPreference: "high-performance",
      logarithmicDepthBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(getRendererPixelRatio(performanceProfile, window.devicePixelRatio));
    renderer.localClippingEnabled = true;
    rendererRef.current = renderer;
    const handleContextLost = (event) => {
      event.preventDefault();
      onError("El navegador perdió el contexto gráfico por falta de recursos. Cierra otras pestañas, usa un modelo optimizado o recarga el visor.");
    };
    const handleContextRestored = () => {
      console.info("Contexto WebGL restaurado exitosamente.");
      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(
          sceneRef.current,
          isOrthographic ? orthographicCameraRef.current : perspectiveCameraRef.current
        );
      }
    };
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost, false);
    renderer.domElement.addEventListener("webglcontextrestored", handleContextRestored, false);

    // Controls
    const controls = new OrbitControls(persCamera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;
    controls.maxDistance = 600;
    controls.minDistance = 0.5;
    controlsRef.current = controls;
    let fragmentsUpdateFrame = null;
    const updateFragmentsView = () => {
      if (fragmentsUpdateFrame !== null) return;
      fragmentsUpdateFrame = requestAnimationFrame(() => {
        fragmentsUpdateFrame = null;
        const model = modelRef.current;
        const fragmentsManager = fragmentsRef.current;
        if (!model || !fragmentsManager) return;
        model.useCamera(controls.object);
        fragmentsManager.core.update();
      });
    };
    controls.addEventListener("change", updateFragmentsView);

    const components = new OBC.Components();
    const fragments = components.get(OBC.FragmentsManager);
    componentsRef.current = components;
    fragmentsRef.current = fragments;

    engineReadyRef.current = (async () => {
      fragments.init(fragmentsWorkerUrl);
      const ifcLoader = components.get(OBC.IfcLoader);
      const classifier = components.get(OBC.Classifier);
      ifcLoaderRef.current = ifcLoader;
      classifierRef.current = classifier;
      await ifcLoader.setup({
        autoSetWasm: false,
        wasm: { path: "/wasm/", absolute: true },
      });
      components.init();
    })();

    // Loop de animación
    let animationFrameId;
    let frameCount = 0;
    let lastMetricEmit = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!pageVisibleRef.current) return;

      frameCount++;
      const now = performance.now();
      if (now - lastMetricEmit >= 1000) {
        const calculatedFps = Math.round((frameCount * 1000) / (now - lastMetricEmit));
        const drawCalls = renderer.info?.render?.calls ?? 1;
        const triangles = renderer.info?.render?.triangles ?? 0;
        onPerformanceMetrics?.({ fps: calculatedFps, drawCalls, triangles });
        frameCount = 0;
        lastMetricEmit = now;
      }

      // Desplazamiento dinámico en Modo Peatonal (WASD)
      if (activeModeRef.current === "walk") {
        const keys = keysPressedRef.current;
        const activeCam = isOrthographic ? orthoCamera : persCamera;
        const d = modelRadiusRef.current || 40;
        const baseSpeed = Math.max(0.12, d * 0.007);
        const speed = keys["ShiftLeft"] || keys["ShiftRight"] ? baseSpeed * 2.5 : baseSpeed;

        const forward = new THREE.Vector3();
        activeCam.getWorldDirection(forward);
        const forwardHorizontal = forward.clone();
        forwardHorizontal.y = 0;
        forwardHorizontal.normalize();

        const right = new THREE.Vector3().crossVectors(forwardHorizontal, new THREE.Vector3(0, 1, 0)).normalize();

        let moveZ = 0;
        let moveX = 0;
        let moveY = 0;

        if (keys["KeyW"] || keys["ArrowUp"]) moveZ += 1;
        if (keys["KeyS"] || keys["ArrowDown"]) moveZ -= 1;
        if (keys["KeyD"] || keys["ArrowRight"]) moveX += 1;
        if (keys["KeyA"] || keys["ArrowLeft"]) moveX -= 1;
        if (keys["Space"]) moveY += 1;
        if (keys["KeyC"] || keys["ControlLeft"]) moveY -= 1;

        if (moveZ !== 0 || moveX !== 0 || moveY !== 0) {
          const moveDelta = new THREE.Vector3()
            .addScaledVector(forwardHorizontal, moveZ * speed)
            .addScaledVector(right, moveX * speed);
          moveDelta.y += moveY * speed;

          activeCam.position.add(moveDelta);
          controls.target.add(moveDelta);
        }
      } else {
        controls.update();
      }

      const activeCamera = isOrthographic ? orthoCamera : persCamera;
      renderer.render(scene, activeCamera);

      // Actualizar posición de etiquetas de medición proyectadas
      updateScreenLabels(activeCamera, width, height);
    };
    animate();

    // Redimensionamiento
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      const newAspect = newW / newH;

      persCamera.aspect = newAspect;
      persCamera.updateProjectionMatrix();

      const d = modelRadiusRef.current || 30;
      orthoCamera.left = -d * newAspect;
      orthoCamera.right = d * newAspect;
      orthoCamera.top = d;
      orthoCamera.bottom = -d;
      orthoCamera.updateProjectionMatrix();

      renderer.setSize(newW, newH);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    const handleVisibilityChange = () => { pageVisibleRef.current = !document.hidden; };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      loadGenerationRef.current += 1;
      cancelAnimationFrame(animationFrameId);
      if (fragmentsUpdateFrame !== null) cancelAnimationFrame(fragmentsUpdateFrame);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      controls.removeEventListener("change", updateFragmentsView);
      controls.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", handleContextLost, false);
      renderer.domElement.removeEventListener("webglcontextrestored", handleContextRestored, false);
      renderer.dispose();
      modelRef.current?.dispose().catch(() => {});
      components.dispose();
      modelRef.current = null;
      gridRef.current = null;
      selectionHelperRef.current = null;
      categoryIdsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!rendererRef.current) return;
    rendererRef.current.setPixelRatio(getRendererPixelRatio(performanceProfile, window.devicePixelRatio));
    rendererRef.current.setSize(containerRef.current?.clientWidth || 800, containerRef.current?.clientHeight || 600);
  }, [performanceProfile]);

  useEffect(() => {
    if (!cancelLoadTrigger) return;
    loadGenerationRef.current += 1;
  }, [cancelLoadTrigger]);

  // Función para proyectar etiquetas 3D a la pantalla 2D
  const updateScreenLabels = (camera, width, height) => {
    if (!measurements || measurements.length === 0) {
      if (floatingLabels.length > 0) setFloatingLabels([]);
      return;
    }

    const tempV = new THREE.Vector3();
    const updated = [];

    measurements.forEach((m) => {
      if (m.midPoint) {
        tempV.set(m.midPoint.x, m.midPoint.y, m.midPoint.z);
        tempV.project(camera);

        // Si el punto está frente a la cámara
        if (tempV.z < 1) {
          const x = (tempV.x * 0.5 + 0.5) * width;
          const y = (-(tempV.y * 0.5) + 0.5) * height;
          updated.push({
            id: m.id,
            x,
            y,
            text:
              m.type === "distance"
                ? `${m.distance.toFixed(3)} m`
                : `${m.area.toFixed(2)} m²`,
            type: m.type,
          });
        }
      }
    });

    setFloatingLabels(updated);
  };

  // =========================================================================
  // 2. CAMBIO DE PROYECCIÓN (PERSPECTIVA / ORTOGRÁFICA)
  // =========================================================================
  useEffect(() => {
    if (!controlsRef.current || !perspectiveCameraRef.current || !orthographicCameraRef.current)
      return;

    const controls = controlsRef.current;
    const persCam = perspectiveCameraRef.current;
    const orthoCam = orthographicCameraRef.current;

    if (isOrthographic) {
      orthoCam.position.copy(persCam.position);
      orthoCam.quaternion.copy(persCam.quaternion);
      controls.object = orthoCam;
      orthoCam.updateProjectionMatrix();
    } else {
      persCam.position.copy(orthoCam.position);
      persCam.quaternion.copy(orthoCam.quaternion);
      controls.object = persCam;
      persCam.updateProjectionMatrix();
    }
    const activeCamera = isOrthographic ? orthoCam : persCam;
    if (modelRef.current) {
      modelRef.current.useCamera(activeCamera);
      fragmentsRef.current?.core.update(true);
    }
  }, [isOrthographic]);

  // Hook para Modo Peatonal (Bloqueo de órbita y captura de teclas)
  useEffect(() => {
    if (controlsRef.current) {
      if (activeMode === "walk") {
        controlsRef.current.enableRotate = false;
        controlsRef.current.enablePan = false;
      } else {
        controlsRef.current.enableRotate = true;
        controlsRef.current.enablePan = true;
      }
    }

    if (activeMode !== "walk") return;

    const handleKeyDown = (e) => {
      // Ignorar si se escribe en un input o textarea
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      keysPressedRef.current[e.code] = true;
    };

    const handleKeyUp = (e) => {
      keysPressedRef.current[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      keysPressedRef.current = {};
    };
  }, [activeMode]);

  // Registro de función para capturar vista 3D (para BCF)
  useEffect(() => {
    if (onRegisterCapture) {
      onRegisterCapture(() => {
        const canvas = canvasRef.current;
        const activeCam = isOrthographic
          ? orthographicCameraRef.current
          : perspectiveCameraRef.current;
        const controls = controlsRef.current;
        if (!canvas || !activeCam || !controls) return null;

        return {
          snapshot: canvas.toDataURL("image/png"),
          cameraState: {
            position: {
              x: activeCam.position.x,
              y: activeCam.position.y,
              z: activeCam.position.z,
            },
            target: {
              x: controls.target.x,
              y: controls.target.y,
              z: controls.target.z,
            },
            up: {
              x: activeCam.up.x,
              y: activeCam.up.y,
              z: activeCam.up.z,
            },
            isOrthographic,
          },
        };
      });
    }
  }, [onRegisterCapture, isOrthographic]);

  // =========================================================================
  // 3. CARGA DEL ARCHIVO IFC (LOCAL BUFFER O URL)
  // =========================================================================
  useEffect(() => {
    const generation = ++loadGenerationRef.current;

    const loadModel = async () => {
      if (!fileData && !fileObject && !fileUrl) return;
      const ifcLoader = ifcLoaderRef.current;
      const fragments = fragmentsRef.current;
      const classifier = classifierRef.current;
      const scene = sceneRef.current;
      if (!ifcLoader || !fragments || !classifier || !scene) return;

      try {
        const startedAt = performance.now();
        const milestones = {};
        onProgress({ phase: "Inicializando motor Fragments...", percent: 10 });
        await engineReadyRef.current;
        milestones.engineReady = performance.now();

        if (modelRef.current) {
          await modelRef.current.dispose();
          modelRef.current = null;
        }
        categoryIdsRef.current.clear();

        const safeName = String(modelName || "modelo-ifc")
          .replace(/\.ifc$/i, "")
          .replace(/[^a-z0-9_-]+/gi, "-");
        const modelId = `${safeName}-${generation}`;
        let model;
        let loadedFromCache = false;

        if (cacheKey) {
          onProgress({ phase: "Buscando conversión local...", percent: 20 });
          onCacheStatus?.("checking");
          const cached = await getCachedFragments(cacheKey);
          if (cached?.buffer) {
            onProgress({ phase: "Abriendo modelo optimizado...", percent: 45 });
            model = await fragments.core.load(cached.buffer, {
              modelId,
              camera: isOrthographic ? orthographicCameraRef.current : perspectiveCameraRef.current,
            });
            loadedFromCache = true;
            onCacheStatus?.("hit");
          } else {
            onCacheStatus?.("miss");
          }
        }

        if (!model) {
          onProgress({ phase: "Leyendo datos IFC...", percent: 25 });
          let data = fileData;
          if (fileObject) {
            data = new Uint8Array(await fileObject.arrayBuffer());
          } else if (fileUrl) {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error(`No se pudo descargar el modelo (${response.status})`);
            data = new Uint8Array(await response.arrayBuffer());
          }
          milestones.dataReady = performance.now();
          onProgress({ phase: "Convirtiendo IFC a Fragments...", percent: 45 });
          model = await ifcLoader.load(data, true, modelId);
          data = null;
        } else {
          milestones.dataReady = performance.now();
        }
        if (!model) throw new Error("No se pudo generar el modelo 3D");

        if (generation !== loadGenerationRef.current) {
          await model.dispose();
          return;
        }

        modelRef.current = model;
        scene.add(model.object);
        model.useCamera(
          isOrthographic
            ? orthographicCameraRef.current
            : perspectiveCameraRef.current
        );
        await fragments.core.update(true);

        onProgress({ phase: "Calculando dimensiones y categorías...", percent: 70 });

        const bbox = model.box.clone();
        boundingBoxRef.current = bbox;
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());
        modelCenterRef.current.copy(center);
        const maxDim = Math.max(size.x, size.y, size.z, 1);
        modelRadiusRef.current = maxDim;
        milestones.geometryReady = performance.now();

        // Informar los límites del modelo a los planos de sección
        if (onModelBoundsComputed) {
          onModelBoundsComputed({
            x: { min: bbox.min.x - 2, max: bbox.max.x + 2 },
            y: { min: bbox.min.y - 2, max: bbox.max.y + 2 },
            z: { min: bbox.min.z - 2, max: bbox.max.z + 2 },
          });
        }

        // Posicionar cámaras y controles
        const camDist = maxDim * 1.5;
        const persCam = perspectiveCameraRef.current;
        const orthoCam = orthographicCameraRef.current;
        const controls = controlsRef.current;

        persCam.position.set(center.x + camDist * 0.7, center.y + camDist * 0.5, center.z + camDist * 0.7);
        persCam.lookAt(center);
        persCam.near = Math.max(0.1, maxDim / 1000);
        persCam.far = Math.max(1000, maxDim * 10);
        persCam.updateProjectionMatrix();

        const aspect = (containerRef.current?.clientWidth || 800) / (containerRef.current?.clientHeight || 600);
        orthoCam.left = (-maxDim * 0.8) * aspect;
        orthoCam.right = (maxDim * 0.8) * aspect;
        orthoCam.top = maxDim * 0.8;
        orthoCam.bottom = -maxDim * 0.8;
        orthoCam.position.set(center.x + camDist * 0.7, center.y + camDist * 0.5, center.z + camDist * 0.7);
        orthoCam.lookAt(center);
        orthoCam.updateProjectionMatrix();

        controls.target.copy(center);
        controls.update();

        onGeometryReady?.({ modelID: model.modelId, bounds: bbox, timings: createLoadTimings(startedAt, milestones) });

        onProgress({ phase: "Modelo visible · preparando herramientas BIM...", percent: 72 });
        const categoriesFound = [];
        const elementsInventory = [];
        let totalElements = 0;
        const classificationName = `IFC-Categories-${generation}`;
        try {
          await classifier.byCategory({
            classificationName,
          });
        } catch (clsErr) {
          console.warn("Error en clasificador:", clsErr);
        }
        const categoryGroups = classifier.list.get(classificationName);

        if (categoryGroups) {
          const allGroups = Array.from(categoryGroups.entries());
          for (let typeIndex = 0; typeIndex < allGroups.length; typeIndex += 1) {
            const [rawTypeKey, group] = allGroups[typeIndex];
            const typeKey = String(rawTypeKey).toUpperCase();
            try {
              const groupMap = await group.get();
              const itemIds = [];
              if (groupMap) {
                for (const key of Object.keys(groupMap)) {
                  const setOrArray = groupMap[key];
                  if (setOrArray) {
                    for (const id of setOrArray) {
                      itemIds.push(id);
                    }
                  }
                }
              }
              if (itemIds.length === 0) continue;

              categoryIdsRef.current.set(typeKey, itemIds);
              categoriesFound.push({ type: typeKey, count: itemIds.length });
              totalElements += itemIds.length;
              for (const id of itemIds) {
                if (elementsInventory.length >= IFC_SEARCH_INDEX_LIMIT) break;
                elementsInventory.push({
                  expressID: id,
                  ifcType: typeKey,
                  name: `${typeKey} #${id}`,
                });
              }
              onIndexProgress?.({
                completed: typeIndex + 1,
                total: allGroups.length,
                categories: [...categoriesFound],
                elementsList: [...elementsInventory],
              });
              await new Promise((resolve) => requestAnimationFrame(resolve));
            } catch (groupErr) {
              console.warn("Error leyendo grupo de categoría:", groupErr);
            }
          }
        }

        milestones.indexReady = performance.now();
        milestones.finishedAt = milestones.indexReady;

        onProgress({ phase: "¡Modelo listo para interactuar!", percent: 100 });

        if (generation !== loadGenerationRef.current) return;

        onLoaded({
          modelID: model.modelId,
          totalElements,
          indexTruncated: totalElements > elementsInventory.length,
          categories: categoriesFound,
          elementsList: elementsInventory,
          bounds: bbox,
          timings: createLoadTimings(startedAt, milestones),
        });
        onSourceConsumed?.();

        if (cacheKey && !loadedFromCache) {
          onCacheStatus?.("saving");
          try {
            const buffer = await model.getBuffer();
            const saved = await putCachedFragments({
              key: cacheKey,
              name: modelName,
              size: fileObject?.size || fileData?.byteLength || 0,
              lastModified: fileObject?.lastModified || 0,
              buffer,
            });
            onCacheStatus?.(saved ? "saved" : "unavailable");
          } catch (cacheError) {
            console.warn("No se pudo serializar el modelo IFC:", cacheError);
            onCacheStatus?.("unavailable");
          }
        }
      } catch (err) {
        if (generation !== loadGenerationRef.current) return;
        console.error("Error al cargar archivo IFC:", err);
        onSourceConsumed?.();
        onError(err.message || "Error al procesar el archivo IFC");
      }
    };

    loadQueueRef.current = loadQueueRef.current.catch(() => {}).then(loadModel);

    return () => {
      if (generation === loadGenerationRef.current) {
        loadGenerationRef.current += 1;
      }
    };
  }, [fileData, fileObject, fileUrl, loadTrigger, modelName, cacheKey]);

  // =========================================================================
  // 4. CONTROL DE VISIBILIDAD DE CATEGORÍAS
  // =========================================================================
  useEffect(() => {
    const model = modelRef.current;
    const fragments = fragmentsRef.current;
    if (!model || !fragments || categoryIdsRef.current.size === 0) return;

    let cancelled = false;
    const applyVisibility = async () => {
      await model.resetVisible();

      if (isolatedExpressId !== null && isolatedExpressId !== undefined) {
        for (const [, itemIds] of categoryIdsRef.current) {
          await model.setVisible(itemIds, false);
        }
        await model.setVisible([isolatedExpressId], true);
      } else {
        for (const [typeKey, itemIds] of categoryIdsRef.current) {
          if (categoryVisibility[typeKey] === false) {
            await model.setVisible(itemIds, false);
          }
        }
        if (hiddenExpressIds && hiddenExpressIds.size > 0) {
          await model.setVisible(Array.from(hiddenExpressIds), false);
        }
      }

      if (!cancelled) await fragments.core.update(true);
    };
    applyVisibility().catch((error) =>
      console.warn("No se pudo aplicar el filtro de visibilidad:", error)
    );
    return () => {
      cancelled = true;
    };
  }, [categoryVisibility, isolatedExpressId, hiddenExpressIds]);

  // =========================================================================
  // 5. MODOS DE RENDER (SOMBREADO, TRANSPARENTE, ALÁMBRICO) Y REJILLA
  // =========================================================================
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.visible = Boolean(isGridVisible);
    }
  }, [isGridVisible]);

  useEffect(() => {
    const isTransparent = renderStyle === "transparent";
    const updateMaterial = (material) => {
      if (!material) return;
      const mats = Array.isArray(material) ? material : [material];
      mats.forEach((item) => {
        item.wireframe = Boolean(isWireframe || renderStyle === "wireframe");
        if (isTransparent) {
          item.transparent = true;
          item.opacity = 0.35;
          item.depthWrite = false;
        } else {
          item.transparent = false;
          item.opacity = 1.0;
          item.depthWrite = true;
        }
        item.needsUpdate = true;
      });
    };

    modelRef.current?.object.traverse((object) => updateMaterial(object.material));
  }, [isWireframe, renderStyle]);

  // =========================================================================
  // 6. PLANOS DE CORTE Y SECCIÓN (CLIPPING PLANES)
  // =========================================================================
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    if (!clippingConfig?.enabled) {
      renderer.clippingPlanes = [];
      return;
    }

    const activePlanes = [];
    const planes = clippingPlanesRef.current;

    // Eje X
    if (clippingConfig.x.enabled) {
      const normalX = clippingConfig.x.inverted ? 1 : -1;
      planes.x.normal.set(normalX, 0, 0);
      planes.x.constant = clippingConfig.x.inverted
        ? -clippingConfig.x.position
        : clippingConfig.x.position;
      activePlanes.push(planes.x);
    }

    // Eje Y (Elevación vertical)
    if (clippingConfig.y.enabled) {
      const normalY = clippingConfig.y.inverted ? 1 : -1;
      planes.y.normal.set(0, normalY, 0);
      planes.y.constant = clippingConfig.y.inverted
        ? -clippingConfig.y.position
        : clippingConfig.y.position;
      activePlanes.push(planes.y);
    }

    // Eje Z (Longitudinal)
    if (clippingConfig.z.enabled) {
      const normalZ = clippingConfig.z.inverted ? 1 : -1;
      planes.z.normal.set(0, 0, normalZ);
      planes.z.constant = clippingConfig.z.inverted
        ? -clippingConfig.z.position
        : clippingConfig.z.position;
      activePlanes.push(planes.z);
    }

    renderer.clippingPlanes = activePlanes;
  }, [clippingConfig]);

  // =========================================================================
  // 7. VISTAS DE CÁMARA PREDEFINIDAS Y FIT TO MODEL (ANIMACIÓN SUAVE)
  // =========================================================================
  const cameraAnimRef = useRef(null);

  const animateCameraTo = useCallback(
    ({ position, direction, target, up = new THREE.Vector3(0, 1, 0), duration = 450 }) => {
      const controls = controlsRef.current;
      const persCam = perspectiveCameraRef.current;
      const orthoCam = orthographicCameraRef.current;
      const center = modelCenterRef.current;
      const d = (modelRadiusRef.current || 40) * 1.6;

      if (!controls || !persCam || !orthoCam) return;

      const activeCam = isOrthographic ? orthoCam : persCam;
      const inactiveCam = isOrthographic ? persCam : orthoCam;

      if (cameraAnimRef.current) {
        cancelAnimationFrame(cameraAnimRef.current);
        cameraAnimRef.current = null;
      }

      const endPos = new THREE.Vector3();
      if (position) {
        endPos.copy(position);
      } else if (direction) {
        endPos.copy(center).addScaledVector(direction.clone().normalize(), d);
      } else {
        endPos.copy(activeCam.position);
      }

      const endTarget = target ? target.clone() : center.clone();
      const endUp = up ? up.clone() : new THREE.Vector3(0, 1, 0);

      const startPos = activeCam.position.clone();
      const startTarget = controls.target.clone();
      const startUp = activeCam.up.clone();

      const startTime = performance.now();
      const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = easeInOutCubic(progress);

        activeCam.position.lerpVectors(startPos, endPos, ease);
        controls.target.lerpVectors(startTarget, endTarget, ease);
        activeCam.up.lerpVectors(startUp, endUp, ease).normalize();

        activeCam.lookAt(controls.target);
        controls.update();

        inactiveCam.position.copy(activeCam.position);
        inactiveCam.up.copy(activeCam.up);
        inactiveCam.lookAt(controls.target);

        if (progress < 1) {
          cameraAnimRef.current = requestAnimationFrame(step);
        } else {
          cameraAnimRef.current = null;
        }
      };

      cameraAnimRef.current = requestAnimationFrame(step);
    },
    [isOrthographic]
  );

  const applyCameraPreset = useCallback(
    (presetOrConfig) => {
      const center = modelCenterRef.current;
      const d = (modelRadiusRef.current || 40) * 1.6;

      // Soporte para restauración de punto de vista BCF (posición exacta)
      if (typeof presetOrConfig === "object" && presetOrConfig?.position) {
        animateCameraTo({
          position: new THREE.Vector3(
            presetOrConfig.position.x,
            presetOrConfig.position.y,
            presetOrConfig.position.z
          ),
          target: presetOrConfig.target
            ? new THREE.Vector3(
                presetOrConfig.target.x,
                presetOrConfig.target.y,
                presetOrConfig.target.z
              )
            : center,
          up: presetOrConfig.up
            ? new THREE.Vector3(
                presetOrConfig.up.x,
                presetOrConfig.up.y,
                presetOrConfig.up.z
              )
            : new THREE.Vector3(0, 1, 0),
          duration: 500,
        });
        return;
      }

      let targetPos = new THREE.Vector3();
      let targetUp = new THREE.Vector3(0, 1, 0);

      if (typeof presetOrConfig === "object" && presetOrConfig?.direction) {
        targetPos.copy(center).addScaledVector(presetOrConfig.direction.clone().normalize(), d);
        if (presetOrConfig.up) {
          targetUp.copy(presetOrConfig.up);
        } else if (Math.abs(presetOrConfig.direction.y) > 0.9) {
          targetUp.set(0, 0, presetOrConfig.direction.y > 0 ? -1 : 1);
        }
      } else {
        const preset = typeof presetOrConfig === "string" ? presetOrConfig : presetOrConfig?.preset;
        if (preset === "top") {
          targetPos.set(center.x, center.y + d, center.z);
          targetUp.set(0, 0, -1);
        } else if (preset === "bottom") {
          targetPos.set(center.x, center.y - d, center.z);
          targetUp.set(0, 0, 1);
        } else if (preset === "front") {
          targetPos.set(center.x, center.y, center.z + d);
        } else if (preset === "back") {
          targetPos.set(center.x, center.y, center.z - d);
        } else if (preset === "left") {
          targetPos.set(center.x - d, center.y, center.z);
        } else if (preset === "right") {
          targetPos.set(center.x + d, center.y, center.z);
        } else if (preset === "iso" || preset === "fit") {
          targetPos.set(center.x + d * 0.7, center.y + d * 0.5, center.z + d * 0.7);
        }
      }

      animateCameraTo({
        position: targetPos,
        target: center,
        up: targetUp,
        duration: 450,
      });
    },
    [animateCameraTo]
  );

  useEffect(() => {
    if (cameraPresetTrigger) {
      if (cameraPresetTrigger.position) {
        applyCameraPreset(cameraPresetTrigger);
      } else {
        applyCameraPreset(cameraPresetTrigger.preset);
      }
    }
  }, [cameraPresetTrigger, applyCameraPreset]);

  useEffect(() => {
    if (fitModelTrigger) {
      applyCameraPreset("fit");
    }
  }, [fitModelTrigger, applyCameraPreset]);

  useEffect(() => {
    if (resetViewTrigger) {
      applyCameraPreset("iso");
    }
  }, [resetViewTrigger, applyCameraPreset]);

  // =========================================================================
  // 8. SELECCIÓN DE ELEMENTO & RESALTADO (HIGHLIGHTING Y CAJA 3D)
  // =========================================================================
  const highlightElement = useCallback((expressID) => {
    const model = modelRef.current;
    const fragments = fragmentsRef.current;
    if (!model || !fragments) return;

    const applyHighlight = async () => {
      await model.resetHighlight();
      if (expressID) {
        await model.highlight([expressID], highlightMaterialRef.current);
      }
      await fragments.core.update(true);
    };
    applyHighlight().catch((error) =>
      console.warn("Error resaltando elemento:", error)
    );
  }, []);

  useEffect(() => {
    highlightElement(selectedExpressId);

    const helper = selectionHelperRef.current;
    const model = modelRef.current;
    if (!helper) return;

    if (!selectedExpressId || !model) {
      helper.visible = false;
      return;
    }

    const updateBox = async () => {
      try {
        const [elemBox] = await model.getBoxes([selectedExpressId]);
        if (elemBox && !elemBox.isEmpty()) {
          helper.box.copy(elemBox);
          helper.visible = true;
        } else {
          helper.visible = false;
        }
      } catch (err) {
        helper.visible = false;
      }
    };

    updateBox();
  }, [selectedExpressId, highlightElement]);

  // Carga reactiva de propiedades completas del elemento si fue seleccionado externamente sin Psets
  useEffect(() => {
    if (!selectedExpressId) return;
    const model = modelRef.current;
    if (!model) return;

    if (!selectedElement?.psets || selectedElement.psets.length === 0) {
      let isSubscribed = true;
      const fetchDetails = async () => {
        try {
          const [rawProps = {}] = await model.getItemsData([selectedExpressId], {
            attributesDefault: true,
            relations: {
              IsDefinedBy: { attributes: true, relations: true },
              DefinesOccurrence: { attributes: false, relations: false },
            },
          });
          if (!isSubscribed) return;

          const typeName = Array.from(categoryIdsRef.current.entries()).find(
            ([, itemIds]) => itemIds.includes(selectedExpressId)
          )?.[0];
          const rawPsets = [
            ...(Array.isArray(rawProps.IsDefinedBy) ? rawProps.IsDefinedBy : []),
            ...(Array.isArray(rawProps.DefinesOccurrence) ? rawProps.DefinesOccurrence : []),
          ];

          const elementData = {
            expressID: selectedExpressId,
            ifcType: typeName || selectedElement?.ifcType || "IFCELEMENT",
            name: extractIfcValue(rawProps?.Name || "") || selectedElement?.name || `Elemento #${selectedExpressId}`,
            description: extractIfcValue(rawProps?.Description || "") || selectedElement?.description || "",
            tag: extractIfcValue(rawProps?.Tag || "") || selectedElement?.tag || "",
            globalId: extractIfcValue(rawProps?.GlobalId || "") || selectedElement?.globalId || "",
            objectType: extractIfcValue(rawProps?.ObjectType || "") || selectedElement?.objectType || "",
            psets: cleanPropertySets(rawPsets),
          };

          onSelectElement(elementData);
        } catch (err) {
          console.warn("No se pudieron cargar propiedades completas del elemento:", err);
        }
      };
      fetchDetails();
      return () => {
        isSubscribed = false;
      };
    }
  }, [selectedExpressId, selectedElement, onSelectElement]);

  // Zoom al elemento seleccionado
  useEffect(() => {
    if (!zoomToElementTrigger || !selectedExpressId) return;
    const model = modelRef.current;
    if (!model) return;

    const zoomToItem = async () => {
      const [elemBox] = await model.getBoxes([selectedExpressId]);
      if (elemBox && !elemBox.isEmpty()) {
        const elemCenter = elemBox.getCenter(new THREE.Vector3());
        const elemSize = elemBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(elemSize.x, elemSize.y, elemSize.z, 2);

        const controls = controlsRef.current;
        const persCam = perspectiveCameraRef.current;
        persCam.position.set(
          elemCenter.x + maxDim * 2,
          elemCenter.y + maxDim * 1.5,
          elemCenter.z + maxDim * 2
        );
        controls.target.copy(elemCenter);
        controls.update();
      }
    };
    zoomToItem().catch((error) =>
      console.warn("No se pudo enfocar el elemento:", error)
    );
  }, [zoomToElementTrigger, selectedExpressId]);

  // =========================================================================
  // 9. EVENTOS DE PUNTERO: INSPECCIÓN, MODO PEATONAL Y MEDICIONES 3D
  // =========================================================================
  const handlePointerDown = async (event) => {
    // Modo Peatonal: registrar inicio de arrastre de cabeza
    if (activeMode === "walk") {
      isWalkingPointerDownRef.current = true;
      walkPointerStartRef.current = { x: event.clientX, y: event.clientY };
      return;
    }

    // Solo clic primario
    if (event.button !== 0) return;

    const container = containerRef.current;
    const model = modelRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !model) return;

    const mouse = new THREE.Vector2(event.clientX, event.clientY);

    const activeCamera = isOrthographic
      ? orthographicCameraRef.current
      : perspectiveCameraRef.current;

    const hit = await model.raycast({ camera: activeCamera, mouse, dom: canvas });

    if (!hit) {
      // Clic en el vacío: deseleccionar en modo inspeccionar
      if (activeMode === "select") {
        onSelectElement(null);
      }
      return;
    }

    const hitPoint = hit.point;

    // -------------------------------------------------------------
    // MODO A: INSPECCIÓN / SELECCIÓN DE ELEMENTO
    // -------------------------------------------------------------
    if (activeMode === "select") {
      const expressID = hit.localId;

      if (expressID !== undefined && expressID !== null) {
        try {
          const [rawProps = {}] = await model.getItemsData([expressID], {
            attributesDefault: true,
            relations: {
              IsDefinedBy: { attributes: true, relations: true },
              DefinesOccurrence: { attributes: false, relations: false },
            },
          });
          const typeName = Array.from(categoryIdsRef.current.entries()).find(
            ([, itemIds]) => itemIds.includes(expressID)
          )?.[0];
          const rawPsets = [
            ...(Array.isArray(rawProps.IsDefinedBy) ? rawProps.IsDefinedBy : []),
            ...(Array.isArray(rawProps.DefinesOccurrence)
              ? rawProps.DefinesOccurrence
              : []),
          ];

          const elementData = {
            expressID,
            ifcType: typeName || "IFCELEMENT",
            name: extractIfcValue(rawProps?.Name || ""),
            description: extractIfcValue(rawProps?.Description || ""),
            tag: extractIfcValue(rawProps?.Tag || ""),
            globalId: extractIfcValue(rawProps?.GlobalId || ""),
            objectType: extractIfcValue(rawProps?.ObjectType || ""),
            psets: cleanPropertySets(rawPsets),
          };

          onSelectElement(elementData);
        } catch (err) {
          console.warn("Error extrayendo propiedades:", err);
        }
      }
      return;
    }

    // -------------------------------------------------------------
    // MODO B: MEDIR DISTANCIA (PUNTO A PUNTO)
    // -------------------------------------------------------------
    if (activeMode === "measure-distance") {
      const measureState = activeMeasureStateRef.current;

      if (measureState.points.length === 0) {
        // Primer punto (Punto A)
        measureState.points.push(hitPoint.clone());

        // Esfera marcador punto A
        const markerA = createMarkerSphere(hitPoint, 0x22d3ee);
        measurementsGroupRef.current.add(markerA);
        measureState.tempPoints = [markerA];
      } else {
        // Segundo punto (Punto B) -> Finalizar medición
        const p1 = measureState.points[0];
        const p2 = hitPoint.clone();

        const distance = p1.distanceTo(p2);
        const dx = Math.abs(p2.x - p1.x);
        const dy = Math.abs(p2.y - p1.y);
        const dz = Math.abs(p2.z - p1.z);
        const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

        // Crear línea permanente 3D
        const lineGeom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x22d3ee,
          linewidth: 3,
          depthTest: false,
        });
        const line = new THREE.Line(lineGeom, lineMat);

        const markerB = createMarkerSphere(p2, 0x22d3ee);

        const measureGroup = new THREE.Group();
        measureGroup.add(line);
        measureGroup.add(measureState.tempPoints[0]);
        measureGroup.add(markerB);
        measurementsGroupRef.current.add(measureGroup);

        const measurementId = `dist_${Date.now()}`;
        measureGroup.name = measurementId;

        onAddMeasurement({
          id: measurementId,
          type: "distance",
          distance,
          dx,
          dy,
          dz,
          midPoint: { x: midPoint.x, y: midPoint.y, z: midPoint.z },
          createdAt: new Date().toISOString(),
        });

        // Limpiar estado temporal
        measureState.points = [];
        measureState.tempPoints = null;
      }
      return;
    }

    // -------------------------------------------------------------
    // MODO C: MEDIR ÁREA POLIGONAL 3D
    // -------------------------------------------------------------
    if (activeMode === "measure-area") {
      const measureState = activeMeasureStateRef.current;
      measureState.points.push(hitPoint.clone());

      const marker = createMarkerSphere(hitPoint, 0x10b981);
      measurementsGroupRef.current.add(marker);
      if (!measureState.tempPoints) measureState.tempPoints = [];
      measureState.tempPoints.push(marker);

      // Si hay al menos 3 puntos, calcular área dinámica o permitir cerrar
      if (measureState.points.length >= 3) {
        const area = calculatePolygonArea3D(measureState.points);
        const perimeter = calculatePolygonPerimeter3D(measureState.points);

        // Centroide aproximado
        const centroid = new THREE.Vector3();
        measureState.points.forEach((p) => centroid.add(p));
        centroid.divideScalar(measureState.points.length);

        // Si es doble clic o alcanzamos cierre de polígono
        if (event.detail >= 2) {
          const measurementId = `area_${Date.now()}`;

          // Malla cerrada de polígono
          const polyLineGeom = new THREE.BufferGeometry().setFromPoints([
            ...measureState.points,
            measureState.points[0],
          ]);
          const polyLine = new THREE.Line(
            polyLineGeom,
            new THREE.LineBasicMaterial({
              color: 0x10b981,
              linewidth: 2,
              depthTest: false,
            })
          );
          measurementsGroupRef.current.add(polyLine);

          onAddMeasurement({
            id: measurementId,
            type: "area",
            area,
            perimeter,
            midPoint: { x: centroid.x, y: centroid.y, z: centroid.z },
            createdAt: new Date().toISOString(),
          });

          measureState.points = [];
          measureState.tempPoints = null;
        }
      }
    }
  };

  // Movimiento del puntero para rotación de cabeza en Modo Peatonal
  const handlePointerMove = (event) => {
    if (activeModeRef.current !== "walk" || !isWalkingPointerDownRef.current) return;
    const deltaX = event.clientX - walkPointerStartRef.current.x;
    const deltaY = event.clientY - walkPointerStartRef.current.y;

    const activeCam = isOrthographic
      ? orthographicCameraRef.current
      : perspectiveCameraRef.current;
    const controls = controlsRef.current;

    if (activeCam && controls) {
      const lookTarget = controls.target;
      const dir = new THREE.Vector3().subVectors(lookTarget, activeCam.position);
      const spherical = new THREE.Spherical().setFromVector3(dir);

      spherical.theta -= deltaX * 0.005;
      spherical.phi = Math.max(
        0.05,
        Math.min(Math.PI - 0.05, spherical.phi - deltaY * 0.005)
      );

      dir.setFromSpherical(spherical);
      controls.target.copy(activeCam.position).add(dir);
      activeCam.lookAt(controls.target);

      walkPointerStartRef.current = { x: event.clientX, y: event.clientY };
    }
  };

  const handlePointerUp = () => {
    isWalkingPointerDownRef.current = false;
  };

  // Helper para esferas de puntos de medición
  const createMarkerSphere = (position, colorHex) => {
    const geom = new THREE.SphereGeometry(
      Math.max(0.15, (modelRadiusRef.current || 20) * 0.008),
      16,
      16
    );
    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      depthTest: false,
    });
    const sphere = new THREE.Mesh(geom, mat);
    sphere.position.copy(position);
    return sphere;
  };

  // Limpiar mediciones en escena cuando measurements cambian desde afuera
  useEffect(() => {
    if (!measurements || measurements.length === 0) {
      while (measurementsGroupRef.current.children.length > 0) {
        const obj = measurementsGroupRef.current.children[0];
        measurementsGroupRef.current.remove(obj);
      }
    }
  }, [measurements]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        cursor:
          activeMode === "select"
            ? "default"
            : activeMode === "walk"
            ? "grab"
            : activeMode === "measure-distance" || activeMode === "measure-area"
            ? "crosshair"
            : "default",
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full block outline-none" />

      {/* Cubo de Navegación 3D Estilo Revit (ViewCube) */}
      <IfcViewCube
        controlsRef={controlsRef}
        perspectiveCameraRef={perspectiveCameraRef}
        orthographicCameraRef={orthographicCameraRef}
        isOrthographic={isOrthographic}
        onToggleProjection={onToggleProjection}
        onAnimateCameraTo={animateCameraTo}
        onPreset={applyCameraPreset}
      />

      {/* Etiquetas 2D flotantes de mediciones */}
      {floatingLabels.map((lbl) => (
        <div
          key={lbl.id}
          className={`absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full text-xs font-mono font-bold shadow-xl border backdrop-blur-md transition-all ${
            lbl.type === "distance"
              ? "bg-cyan-950/80 text-cyan-300 border-cyan-400/50 shadow-cyan-500/20"
              : "bg-emerald-950/80 text-emerald-300 border-emerald-400/50 shadow-emerald-500/20"
          }`}
          style={{ left: `${lbl.x}px`, top: `${lbl.y}px` }}
        >
          {lbl.text}
        </div>
      ))}

      {/* Indicador de Modo Peatonal en 1ª Persona (Walk Mode) */}
      {activeMode === "walk" && (
        <div className="absolute top-4 left-4 pointer-events-none bg-slate-900/95 backdrop-blur-md border border-purple-500/50 rounded-2xl p-3 text-xs text-slate-200 shadow-2xl flex items-center gap-3 animate-in fade-in duration-150 max-w-md">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 text-base shrink-0 animate-pulse">
            <i className="fa-solid fa-person-walking"></i>
          </div>
          <div>
            <div className="font-bold text-white mb-0.5 flex items-center gap-1.5">
              <span>Modo Peatonal en 1ª Persona</span>
              <span className="text-[9px] font-mono bg-purple-900/60 text-purple-300 px-1.5 rounded font-bold">
                WASD
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Usa <strong>W/A/S/D</strong> para caminar · <strong>Shift</strong> para correr · <strong>Espacio/C</strong> para altura · <strong>Arrastra el ratón</strong> para mirar.
            </p>
          </div>
        </div>
      )}

      {/* Indicador de Modo de Medición en Pantalla */}
      {(activeMode === "measure-distance" || activeMode === "measure-area") && (
        <div className="absolute top-4 left-4 pointer-events-none bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 shadow-xl flex items-center gap-2 animate-in fade-in duration-150">
          <i
            className={`fa-solid ${
              activeMode === "measure-distance" ? "fa-ruler text-cyan-400" : "fa-draw-polygon text-emerald-400"
            }`}
          ></i>
          <span>
            {activeMode === "measure-distance"
              ? "Modo Distancia: Haz clic en punto A y punto B sobre el modelo."
              : "Modo Área: Haz clic en 3 o más vértices. Doble clic para finalizar."}
          </span>
        </div>
      )}
    </div>
  );
};
