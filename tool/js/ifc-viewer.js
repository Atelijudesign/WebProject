// js/ifc-viewer.js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { IFCLoader } from "web-ifc-three";

// Referencias al DOM
const inputFrame = document.getElementById("ifc-file-input");
const viewerContainer = document.getElementById("viewer-container");
const loaderOverlay = document.getElementById("loader-overlay");
const loaderProgress = document.getElementById("loader-progress");
const btnResetView = document.getElementById("btn-reset-view");
const btnWireframe = document.getElementById("btn-wireframe");

// Configuración básica de Three.js
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111827); // Tailwind gray-900

// Cámara
const camera = new THREE.PerspectiveCamera(
  45,
  viewerContainer.clientWidth / viewerContainer.clientHeight,
  0.1,
  1000,
);
camera.position.z = 15;
camera.position.y = 15;
camera.position.x = 15;

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(viewerContainer.clientWidth, viewerContainer.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
viewerContainer.appendChild(renderer.domElement);

// Controles de cámara
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Iluminación
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 0);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight2.position.set(10, 5, 10);
scene.add(directionalLight2);

// Grid Helper
const grid = new THREE.GridHelper(50, 50, 0x4b5563, 0x374151);
scene.add(grid);

// Configurar IFCLoader
const ifcLoader = new IFCLoader();

// Vite puede servir archivos si configuramos correctamente public, pero por ahora apuntamos a node_modules temporalmente para desarrollo local si es necesario, o lo dejaremos que Vite lo resuelva.
ifcLoader.ifcManager.setWasmPath("/");

let currentModel = null;
let isWireframe = false;

// Manejo del redimensionamiento de la ventana
window.addEventListener("resize", () => {
  camera.aspect = viewerContainer.clientWidth / viewerContainer.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(viewerContainer.clientWidth, viewerContainer.clientHeight);
});

// Bucle de animación
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// Lógica de carga del archivo
inputFrame.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);

  // Mostrar UI de carga
  loaderOverlay.classList.remove("opacity-0", "pointer-events-none");
  loaderProgress.textContent = "Analizando y procesando malla 3D...";

  try {
    if (currentModel) {
      scene.remove(currentModel);
      // Liberar memoria del modelo anterior si existe
    }

    const model = await ifcLoader.loadAsync(url);
    currentModel = model;
    scene.add(currentModel);

    // Centrar cámara en el modelo
    loaderProgress.textContent = "Calculando geometría...";
    const box = new THREE.Box3().setFromObject(currentModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs((maxDim / 2) * Math.tan(fov * 2));
    cameraZ *= 1.5;

    camera.position.set(
      center.x + cameraZ,
      center.y + cameraZ,
      center.z + cameraZ,
    );
    controls.target.copy(center);
    camera.updateProjectionMatrix();

    loaderProgress.textContent = "¡Modelo cargado!";
    setTimeout(() => {
      loaderOverlay.classList.add("opacity-0", "pointer-events-none");
    }, 500);
  } catch (error) {
    console.error("Error al cargar el archivo IFC:", error);
    loaderProgress.textContent = "Error al cargar el archivo.";
    setTimeout(() => {
      loaderOverlay.classList.add("opacity-0", "pointer-events-none");
    }, 2000);
  }
});

// Controles de la barra inferior
btnResetView.addEventListener("click", () => {
  if (!currentModel) return;
  const box = new THREE.Box3().setFromObject(currentModel);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  let cameraZ = Math.abs(
    (maxDim / 2) * Math.tan(camera.fov * (Math.PI / 180) * 2),
  );
  cameraZ *= 1.5;

  camera.position.set(
    center.x + cameraZ,
    center.y + cameraZ,
    center.z + cameraZ,
  );
  controls.target.copy(center);
});

btnWireframe.addEventListener("click", () => {
  if (!currentModel) return;
  isWireframe = !isWireframe;

  // El modelo cargado por web-ifc-three es a menudo un InstancedMesh o BufferGeometry especial
  if (currentModel.material) {
    if (Array.isArray(currentModel.material)) {
      currentModel.material.forEach((m) => (m.wireframe = isWireframe));
    } else {
      currentModel.material.wireframe = isWireframe;
    }
  }

  // Cambiar color del botón para indicar estado
  if (isWireframe) {
    btnWireframe.classList.add("text-blue-500");
    btnWireframe.classList.remove("text-gray-300");
  } else {
    btnWireframe.classList.remove("text-blue-500");
    btnWireframe.classList.add("text-gray-300");
  }
});
