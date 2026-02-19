import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls, mesh;
let containerId = "canvas3d";

export function init3D(container) {
  container = document.getElementById(container);
  if (!container) return;

  // SCENE
  scene = new THREE.Scene();
  // Transparent background is handled by renderer alpha: true

  // CAMERA
  const aspect = container.clientWidth / container.clientHeight;
  camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
  camera.position.set(200, 200, 200); // Initial position, will look at center

  // RENDERER
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.innerHTML = ""; // Clear any existing canvas
  container.appendChild(renderer.domElement);

  // CONTROLS
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // LIGHTS
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(50, 100, 50);
  scene.add(dirLight);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight2.position.set(-50, -50, -50);
  scene.add(dirLight2);

  // MATERIAL
  // const material = new THREE.MeshStandardMaterial({
  //     color: 0x3b82f6, // bim-blueish
  //     metalness: 0.5,
  //     roughness: 0.5
  // });

  // ANIMATION LOOP
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  // RESIZE HANDLER
  window.addEventListener("resize", () => {
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
}

export function updateProfile3D(type, d, b, t, s, r = 0) {
  if (!scene) return;

  // Remove old mesh
  if (mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  }

  const shape = new THREE.Shape();

  // Convert string inputs to floats
  d = parseFloat(d);
  b = parseFloat(b);
  t = parseFloat(t);
  s = parseFloat(s);
  r = parseFloat(r) || 0;

  // Logic to draw shapes based on type
  // Coordinates usually start from (0,0) or centered
  // Let's center the profile at (0,0)

  if (type === "H" || type === "I") {
    // Draw I-shape (assuming centered)
    const w_2 = b / 2;
    const h_2 = d / 2;
    const web_2 = s / 2;
    const flange_thick = t;

    // Start top-right corner
    shape.moveTo(web_2, h_2 - flange_thick);
    shape.lineTo(w_2, h_2 - flange_thick);
    shape.lineTo(w_2, h_2);
    shape.lineTo(-w_2, h_2);
    shape.lineTo(-w_2, h_2 - flange_thick);
    shape.lineTo(-web_2, h_2 - flange_thick);
    // Down the web
    shape.lineTo(-web_2, -h_2 + flange_thick);
    // Bottom flange
    shape.lineTo(-w_2, -h_2 + flange_thick);
    shape.lineTo(-w_2, -h_2);
    shape.lineTo(w_2, -h_2);
    shape.lineTo(w_2, -h_2 + flange_thick);
    shape.lineTo(web_2, -h_2 + flange_thick);
    // Close
    shape.lineTo(web_2, h_2 - flange_thick);
  } else if (type === "C" || type === "Canal") {
    const h_2 = d / 2;
    const w = b; // Full width usually
    const tw = s; // Web thickness
    const tf = t; // Flange thickness

    // Centering X is tricky, let's align back of web to -tw/2 for simplicity or center visually
    // Let's stick to standard bounding box centering later.

    // Start Top-Right (tip of flange)
    shape.moveTo(w, h_2);
    shape.lineTo(0, h_2); // Back top corner
    shape.lineTo(0, -h_2); // Back bottom corner
    shape.lineTo(w, -h_2); // Bottom flange tip
    shape.lineTo(w, -h_2 + tf);
    shape.lineTo(tw, -h_2 + tf);
    shape.lineTo(tw, h_2 - tf);
    shape.lineTo(w, h_2 - tf);
    shape.lineTo(w, h_2);

    // Re-center geometry later? Or manually offset coordinates.
    // Let's just draw relative to 0,0 being bottom-left or center-left for now.
    // Actually, let's offset to center
    const offsetX = -w / 2;
    // ... (Simplify for prototype, just draw it)
  } else if (type === "L" || type === "Angulo") {
    // Angle (Equal or Unequal)
    // d = height, b = width, t = thickness
    const h_2 = d / 2;
    const w_2 = b / 2;
    const thick = t;

    // Draw L shape (centered)
    shape.moveTo(-w_2, h_2); // Top left
    shape.lineTo(-w_2 + thick, h_2);
    shape.lineTo(-w_2 + thick, -h_2 + thick);
    shape.lineTo(w_2, -h_2 + thick);
    shape.lineTo(w_2, -h_2);
    shape.lineTo(-w_2, -h_2);
    shape.lineTo(-w_2, h_2);
  } else if (type === "T") {
    // T Profile
    const h_2 = d / 2;
    const w_2 = b / 2;
    const tf = t;
    const tw = s; // web thickness

    // Top Flange
    shape.moveTo(-w_2, h_2);
    shape.lineTo(w_2, h_2);
    shape.lineTo(w_2, h_2 - tf);
    shape.lineTo(tw / 2, h_2 - tf);
    // Web down
    shape.lineTo(tw / 2, -h_2);
    shape.lineTo(-tw / 2, -h_2);
    // Web up
    shape.lineTo(-tw / 2, h_2 - tf);
    shape.lineTo(-w_2, h_2 - tf);
    shape.lineTo(-w_2, h_2);
  } else if (type === "CA" || type === "Canal Atiesado") {
    // C with Lips (c = lip length)
    // params: d(h), b(b), c(r passed as c?), t(t)
    // In profile calculator: r parameter was passed as '0' in my hook?
    // Wait, the hook passed '0' for r. I need to fix the hook to pass 'c' if distinct.
    // Actually, updateProfile3D signature is (type, d, b, t, s, r).
    // For CA, 'c' is the lip. I should map 'c' to 'r' in the hook or add a param.
    // Let's assume 'r' param holds 'c' for CA type.

    const h_2 = d / 2;
    const w = b;
    const th = t; // thickness (uniform)
    const lip = r; // mapped from c

    // Simplified C-shape with lips
    // Outer
    shape.moveTo(0, h_2); // Top-left back
    shape.lineTo(w, h_2); // Top flange
    shape.lineTo(w, h_2 - lip); // Top lip down
    shape.lineTo(w - th, h_2 - lip); // Inner lip up
    shape.lineTo(w - th, h_2 - th); // Inner flange back
    shape.lineTo(th, h_2 - th); // Inner web down
    shape.lineTo(th, -h_2 + th); // Inner web bottom
    shape.lineTo(w - th, -h_2 + th); // Inner bottom flange
    shape.lineTo(w - th, -h_2 + lip); // Inner bottom lip
    shape.lineTo(w, -h_2 + lip); // Outer bottom lip
    shape.lineTo(w, -h_2); // Bottom flange
    shape.lineTo(0, -h_2); // Bottom-left back
    shape.lineTo(0, h_2); // Close

    // Center it roughly
    const offsetX = -w / 2;
    // (Geometry.center() will fix it anyway)
  } else if (type === "Circulo" || type === "Circular" || type === "Tubo") {
    // Hollow Circle
    const outerR = d / 2;
    const innerR = outerR - t;
    shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, innerR, 0, Math.PI * 2, true);
    shape.holes.push(holePath);
  } else if (type === "Macizo" || type === "RB") {
    // Solid Round Bar
    const R = d / 2;
    shape.absarc(0, 0, R, 0, Math.PI * 2, false);
  } else if (type === "Rectangular" || type === "Cajon") {
    // Hollow Rect
    const h_2 = d / 2;
    const w_2 = b / 2;
    const thick = t;

    // Outer Rect
    shape.moveTo(-w_2, h_2);
    shape.lineTo(w_2, h_2);
    shape.lineTo(w_2, -h_2);
    shape.lineTo(-w_2, -h_2);
    shape.lineTo(-w_2, h_2);

    // Inner Rect (Hole)
    const hole = new THREE.Path();
    hole.moveTo(-w_2 + thick, h_2 - thick);
    hole.lineTo(w_2 - thick, h_2 - thick);
    hole.lineTo(w_2 - thick, -h_2 + thick);
    hole.lineTo(-w_2 + thick, -h_2 + thick);
    hole.lineTo(-w_2 + thick, h_2 - thick);
    shape.holes.push(hole);
  }

  // EXTRUDE settings
  const extrudeSettings = {
    steps: 1,
    depth: 1000, // 1 meter length for visualization
    bevelEnabled: false,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Center geometry
  geometry.computeBoundingBox();
  geometry.center();

  // Material
  const material = new THREE.MeshStandardMaterial({
    color: 0xa0a0a0,
    metalness: 0.7,
    roughness: 0.2,
    side: THREE.DoubleSide,
  });

  mesh = new THREE.Mesh(geometry, material);

  // Rotate 90 degrees to point Z? Or just leaving as is (extruded along Z)
  // Actually ExtrudeGeometry extrudes along Z. So the profile is in XY plane.
  // Usually beams are horizontal. Let's rotate it to lie along X axis?
  // mesh.rotation.y = Math.PI / 2;

  scene.add(mesh);

  // Adjust Camera to fit
  const box = new THREE.Box3().setFromObject(mesh);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  // Simple auto-zoom
  // camera.position.set(maxDim, maxDim, maxDim);
  // controls.target.set(0, 0, 0);
}
