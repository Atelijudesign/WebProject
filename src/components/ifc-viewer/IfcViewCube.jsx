import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

/**
 * Genera texturas nítidas estilo Revit para las 6 caras del cubo.
 */
function createFaceTexture(label) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  // Fondo pizarra arquitectónico con gradiente sutil
  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, "#223147");
  grad.addColorStop(1, "#121a29");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Borde exterior biselado
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, 250, 250);

  // Marco interior de cara central (subdivisiones idénticas al cubo de Revit)
  ctx.strokeStyle = "rgba(100, 116, 139, 0.45)";
  ctx.lineWidth = 3;
  ctx.strokeRect(46, 46, 164, 164);

  // Texto principal de la cara
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 44px 'Inter', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

/**
 * Genera la textura circular de la brújula en la base (N, E, S, W).
 */
function createCompassTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  const cx = 256;
  const cy = 256;
  const outerR = 240;
  const innerR = 175;

  // Fondo translúcido del disco
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.fill();

  // Bordes concéntricos
  ctx.strokeStyle = "rgba(56, 189, 248, 0.6)"; // cyan
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.stroke();

  // Marcas de división angulares cada 30 grados
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 * Math.PI) / 180;
    const r1 = outerR - 2;
    const r2 = outerR - (i % 3 === 0 ? 20 : 10);
    ctx.strokeStyle = i % 3 === 0 ? "#38bdf8" : "rgba(148, 163, 184, 0.5)";
    ctx.lineWidth = i % 3 === 0 ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
    ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
    ctx.stroke();
  }

  // Puntos Cardinales: N (-Z, ángulo -PI/2), E (+X, 0), S (+Z, PI/2), W (-X, PI)
  const midR = (outerR + innerR) / 2;
  const cardinals = [
    { label: "N", angle: -Math.PI / 2, color: "#38bdf8" },
    { label: "E", angle: 0, color: "#e2e8f0" },
    { label: "S", angle: Math.PI / 2, color: "#e2e8f0" },
    { label: "W", angle: Math.PI, color: "#e2e8f0" },
  ];

  ctx.font = "bold 50px 'Inter', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  cardinals.forEach(({ label, angle, color }) => {
    const tx = cx + Math.cos(angle) * midR;
    const ty = cy + Math.sin(angle) * midR;
    ctx.fillStyle = color;
    ctx.fillText(label, tx, ty);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

/**
 * Traduce coordenadas relativas del cubo a un nombre legible en español.
 */
function getZoneLabel(sx, sy, sz) {
  if (sx === 0 && sy === 1 && sz === 0) return "SUPERIOR (TOP)";
  if (sx === 0 && sy === -1 && sz === 0) return "INFERIOR (BOTTOM)";
  if (sx === 0 && sy === 0 && sz === 1) return "FRONTAL (FRONT)";
  if (sx === 0 && sy === 0 && sz === -1) return "POSTERIOR (BACK)";
  if (sx === -1 && sy === 0 && sz === 0) return "IZQUIERDA (LEFT)";
  if (sx === 1 && sy === 0 && sz === 0) return "DERECHA (RIGHT)";

  // Isométricas (Vértices)
  if (sy === 1) {
    const fStr = sz === 1 ? "Frontal" : sz === -1 ? "Posterior" : "";
    const sStr = sx === 1 ? "Derecha" : sx === -1 ? "Izquierda" : "";
    if (fStr && sStr) return `ISO: Sup-${fStr}-${sStr}`;
    if (fStr) return `Arista: Sup-${fStr}`;
    if (sStr) return `Arista: Sup-${sStr}`;
  }

  if (sy === -1) {
    const fStr = sz === 1 ? "Frontal" : sz === -1 ? "Posterior" : "";
    const sStr = sx === 1 ? "Derecha" : sx === -1 ? "Izquierda" : "";
    if (fStr && sStr) return `ISO: Inf-${fStr}-${sStr}`;
    if (fStr) return `Arista: Inf-${fStr}`;
    if (sStr) return `Arista: Inf-${sStr}`;
  }

  // Aristas verticales
  const fStr = sz === 1 ? "Frontal" : sz === -1 ? "Posterior" : "";
  const sStr = sx === 1 ? "Derecha" : sx === -1 ? "Izquierda" : "";
  if (fStr && sStr) return `Arista: ${fStr}-${sStr}`;

  return "VISTA 3D";
}

export const IfcViewCube = ({
  controlsRef,
  perspectiveCameraRef,
  orthographicCameraRef,
  isOrthographic,
  onToggleProjection,
  onAnimateCameraTo,
  onPreset,
}) => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const cubeMeshRef = useRef(null);
  const highlightMeshRef = useRef(null);
  const compassMeshRef = useRef(null);

  const [activeLabel, setActiveLabel] = useState("ISOMÉTRICA");
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const currentZoneRef = useRef(null);

  // Inicialización de la mini escena Three.js
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = 150;
    const height = 150;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-1.7, 1.7, 1.7, -1.7, 0.1, 50);
    camera.position.set(2.5, 2.5, 2.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x94a3b8, 0.4);
    dirLight2.position.set(-5, -4, -6);
    scene.add(dirLight2);

    // 1. Cubo Principal 3D
    const cubeMaterials = [
      new THREE.MeshLambertMaterial({ map: createFaceTexture("RIGHT") }),  // +X
      new THREE.MeshLambertMaterial({ map: createFaceTexture("LEFT") }),   // -X
      new THREE.MeshLambertMaterial({ map: createFaceTexture("TOP") }),    // +Y
      new THREE.MeshLambertMaterial({ map: createFaceTexture("BOTTOM") }), // -Y
      new THREE.MeshLambertMaterial({ map: createFaceTexture("FRONT") }),  // +Z
      new THREE.MeshLambertMaterial({ map: createFaceTexture("BACK") }),   // -Z
    ];

    const cubeGeom = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const cubeMesh = new THREE.Mesh(cubeGeom, cubeMaterials);
    scene.add(cubeMesh);
    cubeMeshRef.current = cubeMesh;

    // 2. Anillo de la Brújula en la Base (y = -0.72)
    const compassGeom = new THREE.PlaneGeometry(3.0, 3.0);
    const compassMat = new THREE.MeshBasicMaterial({
      map: createCompassTexture(),
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const compassMesh = new THREE.Mesh(compassGeom, compassMat);
    compassMesh.rotation.x = -Math.PI / 2;
    compassMesh.position.y = -0.72;
    scene.add(compassMesh);
    compassMeshRef.current = compassMesh;

    // 3. Mesh de Resaltado Dinámico (Highlight translúcido cyan/dorado)
    const highlightGeom = new THREE.BoxGeometry(1, 1, 1);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55,
      depthTest: false,
      wireframe: false,
    });
    const highlightMesh = new THREE.Mesh(highlightGeom, highlightMat);
    highlightMesh.visible = false;
    scene.add(highlightMesh);
    highlightMeshRef.current = highlightMesh;

    // Render loop sincronizado
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      const activeMainCam = isOrthographic
        ? orthographicCameraRef.current
        : perspectiveCameraRef.current;
      const controls = controlsRef.current;

      if (activeMainCam && controls && cameraRef.current && rendererRef.current) {
        const offset = new THREE.Vector3()
          .subVectors(activeMainCam.position, controls.target)
          .normalize();

        const dist = 3.6;
        cameraRef.current.position.copy(offset.multiplyScalar(dist));
        cameraRef.current.lookAt(0, 0, 0);
        cameraRef.current.up.copy(activeMainCam.up);

        rendererRef.current.render(scene, cameraRef.current);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [isOrthographic, controlsRef, perspectiveCameraRef, orthographicCameraRef]);

  // Actualiza la posición y forma del mesh de resaltado
  const updateHighlight = useCallback((sx, sy, sz) => {
    const hl = highlightMeshRef.current;
    if (!hl) return;

    if (sx === 0 && sy === 0 && sz === 0) {
      hl.visible = false;
      return;
    }

    const absSum = Math.abs(sx) + Math.abs(sy) + Math.abs(sz);

    if (absSum === 1) {
      // Cara completa
      const sizeX = sx !== 0 ? 0.05 : 1.16;
      const sizeY = sy !== 0 ? 0.05 : 1.16;
      const sizeZ = sz !== 0 ? 0.05 : 1.16;
      hl.scale.set(sizeX, sizeY, sizeZ);
      hl.position.set(sx * 0.61, sy * 0.61, sz * 0.61);
    } else if (absSum === 2) {
      // Arista
      const sizeX = sx !== 0 ? 0.28 : 1.16;
      const sizeY = sy !== 0 ? 0.28 : 1.16;
      const sizeZ = sz !== 0 ? 0.28 : 1.16;
      hl.scale.set(sizeX, sizeY, sizeZ);
      hl.position.set(sx * 0.52, sy * 0.52, sz * 0.52);
    } else {
      // Vértice / Esquina isométrica
      hl.scale.set(0.32, 0.32, 0.32);
      hl.position.set(sx * 0.5, sy * 0.5, sz * 0.5);
    }

    hl.visible = true;
  }, []);

  // Raycasting sobre el cubo y la brújula
  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    const cubeMesh = cubeMeshRef.current;
    const compassMesh = compassMeshRef.current;
    if (!canvas || !camera || !cubeMesh || !compassMesh) return;

    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    );

    // Si está arrastrando con el botón izquierdo, orbitar la cámara principal
    if (isDraggingRef.current) {
      const deltaX = e.clientX - dragStartPosRef.current.x;
      const deltaY = e.clientY - dragStartPosRef.current.y;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        hasMovedRef.current = true;
      }

      const activeMainCam = isOrthographic
        ? orthographicCameraRef.current
        : perspectiveCameraRef.current;
      const controls = controlsRef.current;

      if (activeMainCam && controls) {
        const offset = new THREE.Vector3().subVectors(
          activeMainCam.position,
          controls.target
        );
        const spherical = new THREE.Spherical().setFromVector3(offset);

        spherical.theta -= deltaX * 0.02;
        spherical.phi = Math.max(
          0.02,
          Math.min(Math.PI - 0.02, spherical.phi - deltaY * 0.02)
        );

        offset.setFromSpherical(spherical);
        activeMainCam.position.copy(controls.target).add(offset);
        activeMainCam.lookAt(controls.target);
        controls.update();

        dragStartPosRef.current = { x: e.clientX, y: e.clientY };
      }
      return;
    }

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const cubeIntersects = raycaster.intersectObject(cubeMesh);
    if (cubeIntersects.length > 0) {
      const hit = cubeIntersects[0];
      const p = hit.point;

      // Umbrales para clasificar cara, arista o vértice
      const threshold = 0.36;
      const sx = Math.abs(p.x) > threshold ? Math.sign(p.x) : 0;
      const sy = Math.abs(p.y) > threshold ? Math.sign(p.y) : 0;
      const sz = Math.abs(p.z) > threshold ? Math.sign(p.z) : 0;

      // Si todos son cero, usar la normal de la cara impactada
      let zoneX = sx;
      let zoneY = sy;
      let zoneZ = sz;
      if (zoneX === 0 && zoneY === 0 && zoneZ === 0 && hit.face) {
        zoneX = Math.round(hit.face.normal.x);
        zoneY = Math.round(hit.face.normal.y);
        zoneZ = Math.round(hit.face.normal.z);
      }

      currentZoneRef.current = { sx: zoneX, sy: zoneY, sz: zoneZ, type: "cube" };
      updateHighlight(zoneX, zoneY, zoneZ);
      setHoveredLabel(getZoneLabel(zoneX, zoneY, zoneZ));
      return;
    }

    // Comprobar impacto sobre la brújula
    const compassIntersects = raycaster.intersectObject(compassMesh);
    if (compassIntersects.length > 0) {
      const hit = compassIntersects[0];
      const p = hit.point;
      const distFromCenter = Math.sqrt(p.x * p.x + p.z * p.z);

      if (distFromCenter >= 1.0 && distFromCenter <= 1.5) {
        const angle = Math.atan2(p.z, p.x); // -PI a PI
        let cardinal = null;
        let direction = null;

        if (angle >= -Math.PI * 0.75 && angle <= -Math.PI * 0.25) {
          cardinal = "Norte (N)";
          direction = new THREE.Vector3(0, 0, 1); // Mirar hacia Norte
        } else if (angle >= -Math.PI * 0.25 && angle <= Math.PI * 0.25) {
          cardinal = "Este (E)";
          direction = new THREE.Vector3(-1, 0, 0);
        } else if (angle >= Math.PI * 0.25 && angle <= Math.PI * 0.75) {
          cardinal = "Sur (S)";
          direction = new THREE.Vector3(0, 0, -1);
        } else {
          cardinal = "Oeste (W)";
          direction = new THREE.Vector3(1, 0, 0);
        }

        currentZoneRef.current = { type: "cardinal", direction, label: cardinal };
        updateHighlight(0, 0, 0);
        setHoveredLabel(`Orientación: ${cardinal}`);
        return;
      }
    }

    // Sin hover
    currentZoneRef.current = null;
    updateHighlight(0, 0, 0);
    setHoveredLabel(null);
  };

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    // Si fue un clic limpio (sin arrastre mayor a 3px), navegar
    if (!hasMovedRef.current && currentZoneRef.current) {
      const zone = currentZoneRef.current;

      if (zone.type === "cube") {
        const dir = new THREE.Vector3(zone.sx, zone.sy, zone.sz).normalize();
        let up = new THREE.Vector3(0, 1, 0);

        // Caso especial: Vista Superior (TOP) o Inferior (BOTTOM)
        if (Math.abs(zone.sy) > 0.9) {
          up = new THREE.Vector3(0, 0, zone.sy > 0 ? -1 : 1);
        }

        const label = getZoneLabel(zone.sx, zone.sy, zone.sz);
        setActiveLabel(label);

        if (onAnimateCameraTo) {
          onAnimateCameraTo({ direction: dir, up });
        }
      } else if (zone.type === "cardinal") {
        setActiveLabel(zone.label);
        if (onAnimateCameraTo) {
          onAnimateCameraTo({
            direction: zone.direction,
            up: new THREE.Vector3(0, 1, 0),
          });
        }
      }
    }
  };

  const handlePointerLeave = () => {
    isDraggingRef.current = false;
    currentZoneRef.current = null;
    updateHighlight(0, 0, 0);
    setHoveredLabel(null);
    setIsHovered(false);
  };

  // Botón Home (Casa / Isométrica por defecto)
  const handleHomeClick = (e) => {
    e.stopPropagation();
    setActiveLabel("ISOMÉTRICA (HOME)");
    if (onPreset) {
      onPreset("iso");
    } else if (onAnimateCameraTo) {
      onAnimateCameraTo({
        direction: new THREE.Vector3(1, 0.7, 1).normalize(),
        up: new THREE.Vector3(0, 1, 0),
      });
    }
  };

  // Giros de 90° con las flechas curvas (Roll)
  const handleRoll = (angleDeg) => {
    const rad = (angleDeg * Math.PI) / 180;
    const activeMainCam = isOrthographic
      ? orthographicCameraRef.current
      : perspectiveCameraRef.current;
    const controls = controlsRef.current;
    if (!activeMainCam || !controls) return;

    const viewDir = new THREE.Vector3()
      .subVectors(controls.target, activeMainCam.position)
      .normalize();

    const newUp = activeMainCam.up.clone().applyAxisAngle(viewDir, rad).normalize();

    if (onAnimateCameraTo) {
      onAnimateCameraTo({
        position: activeMainCam.position.clone(),
        up: newUp,
        duration: 350,
      });
    }
  };

  // Flechas directas de volteo ortogonal (▲, ▼, ◄, ►)
  const handleFlip = (direction) => {
    const activeMainCam = isOrthographic
      ? orthographicCameraRef.current
      : perspectiveCameraRef.current;
    const controls = controlsRef.current;
    if (!activeMainCam || !controls) return;

    const offset = new THREE.Vector3().subVectors(
      activeMainCam.position,
      controls.target
    );
    let targetDir = offset.clone().normalize();
    let targetUp = activeMainCam.up.clone();

    if (direction === "left") {
      targetDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    } else if (direction === "right") {
      targetDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
    } else if (direction === "up") {
      targetDir.set(0, 1, 0);
      targetUp.set(0, 0, -1);
    } else if (direction === "down") {
      targetDir.set(0, -1, 0);
      targetUp.set(0, 0, 1);
    }

    if (onAnimateCameraTo) {
      onAnimateCameraTo({
        direction: targetDir,
        up: targetUp,
        duration: 400,
      });
    }
  };

  return (
    <div
      aria-label="Cubo de Navegación 3D Revit"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handlePointerLeave}
      className={`absolute top-4 right-4 z-20 select-none flex flex-col items-center rounded-2xl backdrop-blur-md p-2 transition-all duration-200 ${
        isHovered
          ? "bg-slate-900/85 border border-cyan-500/40 shadow-2xl shadow-cyan-950/40"
          : "bg-slate-950/40 border border-slate-700/30 shadow-lg"
      }`}
      style={{ width: "166px" }}
    >
      {/* Barra Superior del ViewCube: Casa (Home) + Giros 90° (↺ ↻) */}
      <div className="w-full flex items-center justify-between px-1 mb-1">
        <button
          type="button"
          onClick={handleHomeClick}
          title="Vista de Inicio (Home / Isométrica)"
          className="w-6 h-6 rounded-md bg-slate-800/80 hover:bg-cyan-500/20 hover:border-cyan-400 border border-slate-700/60 text-slate-300 hover:text-cyan-300 flex items-center justify-center text-xs transition-all shadow-sm"
        >
          <i className="fa-solid fa-house"></i>
        </button>

        <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
          ViewCube
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleRoll(90)}
            title="Girar 90° en sentido antihorario"
            className="w-6 h-6 rounded-md bg-slate-800/80 hover:bg-cyan-500/20 hover:border-cyan-400 border border-slate-700/60 text-slate-300 hover:text-cyan-300 flex items-center justify-center text-xs transition-all shadow-sm"
          >
            <i className="fa-solid fa-arrow-rotate-left"></i>
          </button>
          <button
            type="button"
            onClick={() => handleRoll(-90)}
            title="Girar 90° en sentido horario"
            className="w-6 h-6 rounded-md bg-slate-800/80 hover:bg-cyan-500/20 hover:border-cyan-400 border border-slate-700/60 text-slate-300 hover:text-cyan-300 flex items-center justify-center text-xs transition-all shadow-sm"
          >
            <i className="fa-solid fa-arrow-rotate-right"></i>
          </button>
        </div>
      </div>

      {/* Área Central: Canvas 3D con Flechas Direccionales de Volteo */}
      <div className="relative w-[150px] h-[150px] flex items-center justify-center">
        {/* Flecha Arriba ▲ */}
        <button
          type="button"
          onClick={() => handleFlip("up")}
          title="Ver desde Arriba (Superior)"
          className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 w-5 h-4 text-slate-400 hover:text-cyan-400 text-[10px] flex items-center justify-center hover:scale-125 transition-transform"
        >
          <i className="fa-solid fa-caret-up"></i>
        </button>

        {/* Flecha Abajo ▼ */}
        <button
          type="button"
          onClick={() => handleFlip("down")}
          title="Ver desde Abajo (Inferior)"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-10 w-5 h-4 text-slate-400 hover:text-cyan-400 text-[10px] flex items-center justify-center hover:scale-125 transition-transform"
        >
          <i className="fa-solid fa-caret-down"></i>
        </button>

        {/* Flecha Izquierda ◄ */}
        <button
          type="button"
          onClick={() => handleFlip("left")}
          title="Girar 90° a la Izquierda"
          className="absolute top-1/2 -left-1 -translate-y-1/2 z-10 w-4 h-5 text-slate-400 hover:text-cyan-400 text-[10px] flex items-center justify-center hover:scale-125 transition-transform"
        >
          <i className="fa-solid fa-caret-left"></i>
        </button>

        {/* Flecha Derecha ► */}
        <button
          type="button"
          onClick={() => handleFlip("right")}
          title="Girar 90° a la Derecha"
          className="absolute top-1/2 -right-1 -translate-y-1/2 z-10 w-4 h-5 text-slate-400 hover:text-cyan-400 text-[10px] flex items-center justify-center hover:scale-125 transition-transform"
        >
          <i className="fa-solid fa-caret-right"></i>
        </button>

        {/* Canvas WebGL del Cubo Revit */}
        <canvas
          ref={canvasRef}
          className="w-[150px] h-[150px] cursor-grab active:cursor-grabbing block outline-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      </div>

      {/* Pie del ViewCube: Etiqueta de Vista + Selector de Proyección */}
      <div className="w-full mt-1.5 flex flex-col gap-1 items-center">
        {/* Badge de Vista Activa / Hover */}
        <div className="w-full px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 text-center overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="text-[10px] font-mono font-semibold text-cyan-300">
            {hoveredLabel || activeLabel}
          </span>
        </div>

        {/* Selector Rápido Perspectiva / Ortogonal */}
        <button
          type="button"
          onClick={onToggleProjection}
          title={
            isOrthographic
              ? "Cámara Ortográfica activa (Haz clic para Perspectiva)"
              : "Cámara Perspectiva activa (Haz clic para Ortográfica)"
          }
          className="w-full py-0.5 rounded text-[10px] font-mono text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1.5"
        >
          <i
            className={`fa-solid ${
              isOrthographic ? "fa-vector-square text-cyan-400" : "fa-cube text-blue-400"
            }`}
          ></i>
          <span>{isOrthographic ? "Ortográfica" : "Perspectiva"}</span>
        </button>
      </div>
    </div>
  );
};
