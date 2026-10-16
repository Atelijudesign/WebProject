import { Component, Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF } from "@react-three/drei";
import { easing } from "maath";
import { track3DModelActivated } from "../../utils/analytics";

function Model() {
  const { scene } = useGLTF("/models/nave-licuadores.glb");
  return <primitive object={scene} />;
}

/* ── Decorative Scene Elements ── */
function GridFloor() {
  return (
    <group position={[0, -2, 0]}>
      <gridHelper args={[100, 100, "#1e3a8a", "#0f172a"]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.6} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Particles() {
  const count = 150;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = Math.random() * 10 - 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#60a5fa" transparent opacity={0.4} />
    </points>
  );
}

/* ── Loading Spinner ── */
function LoadingSpinner() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 2;
  });

  return (
    <mesh ref={ref}>
      <ringGeometry args={[0.5, 0.7, 32]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
    </mesh>
  );
}

function StaticSceneFallback() {
  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border border-cyan-500/20 bg-[radial-gradient(circle_at_50%_20%,rgba(56,189,248,0.16),transparent_42%),linear-gradient(135deg,#020617,#0f172a)] p-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-xl text-cyan-300">
        <i className="fa-solid fa-cube" aria-hidden="true" />
      </span>
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">Modelo BIM estructural</p>
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-400">La vista interactiva no está disponible en este navegador. El proyecto sigue siendo navegable.</p>
      </div>
    </div>
  );
}

class SceneErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <StaticSceneFallback />;
    return this.props.children;
  }
}

function InteractiveModelGroup({ children }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      easing.dampE(
        groupRef.current.rotation,
        [state.pointer.y * 0.15, state.pointer.x * 0.35 + state.clock.elapsedTime * 0.02, 0],
        0.35,
        delta
      );
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

/* ── Scene Content ── */
function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.6} color="#93c5fd" />
      <directionalLight position={[8, 10, 5]} intensity={1.4} color="#dbeafe" />
      <directionalLight position={[-5, 6, -8]} intensity={0.6} color="#60a5fa" />
      <pointLight position={[0, 4, 0]} intensity={1.0} color="#38bdf8" distance={14} />
      
      <InteractiveModelGroup>
        <Suspense fallback={<LoadingSpinner />}>
          <Model />
        </Suspense>
      </InteractiveModelGroup>

      <GridFloor />
      <Particles />

      <Stars
        radius={50}
        depth={30}
        count={600}
        factor={3}
        saturation={0}
        fade
        speed={0.4}
      />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 5}
        minDistance={4}
        maxDistance={20}
        zoomSpeed={0.8}
      />
    </>
  );
}

/* ── Poster Ligero de Activación Bajo Demanda (0 KB Three.js / 0 KB GLB para Bots) ── */
function Model3DPoster({ onActivate }) {
  return (
    <div className="relative w-full h-full min-h-[220px] rounded-2xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/60 p-6 flex flex-col justify-between items-center text-center group">
      {/* Fondo con grilla arquitectónica animada en CSS */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" 
      />
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Insignia superior */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <span className="px-2.5 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          Nave Licuadores 3D
        </span>
        <span className="text-[10px] font-mono text-slate-400">
          791k polígonos
        </span>
      </div>

      {/* Contenido Central: Vista Previa y Botón de Activación */}
      <div className="relative z-10 my-auto py-2 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 text-2xl mb-3 shadow-lg shadow-cyan-500/10 group-hover:scale-110 transition-transform">
          <i className="fa-solid fa-cube animate-pulse" />
        </div>
        <h4 className="text-sm font-bold text-white tracking-wide font-mono">
          Modelo Estructural Interactivo
        </h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs font-light leading-relaxed">
          Haz clic para cargar la geometría 3D en tiempo real con órbita 360°, damping y zoom.
        </p>

        <button
          onClick={onActivate}
          className="mt-4 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-105 transition-all flex items-center gap-2 font-mono"
        >
          <i className="fa-solid fa-play" />
          <span>Explorar Modelo 3D</span>
        </button>
      </div>

      {/* Pie del póster */}
      <div className="relative z-10 w-full flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-2">
        <span>BIM + Revit + Three.js</span>
        <span className="text-emerald-400">⚡ Carga Ultra-Rápida</span>
      </div>
    </div>
  );
}

/* ── Componente Principal Exportado con Modo Híbrido ── */
export default function BuildingScene() {
  const [isInteractive, setIsInteractive] = useState(false);

  if (!isInteractive) {
    return (
      <Model3DPoster
        onActivate={() => {
          track3DModelActivated();
          setIsInteractive(true);
        }}
      />
    );
  }

  return (
    <div className="hero-canvas-wrapper relative w-full h-full min-h-[220px]">
      <SceneErrorBoundary>
        <Canvas
          fallback={<StaticSceneFallback />}
          camera={{ position: [6, 5, 8], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <SceneContent />
        </Canvas>
      </SceneErrorBoundary>

      <div className="ifc-model-label flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="ifc-label-icon">⚡</span>
          <span>Modelo 3D — Nave Licuadores</span>
          <span className="ifc-label-tech">BIM 60 FPS</span>
        </div>
        <button
          onClick={() => setIsInteractive(false)}
          className="text-[10px] font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 ml-2"
          title="Minimizar modelo 3D para ahorrar recursos"
        >
          Pausar 3D
        </button>
      </div>
    </div>
  );
}
// NOTA DE ARQUITECTURA: NO usar useGLTF.preload("/models/nave-licuadores.glb")
// para evitar que crawlers, bots y móviles descarguen 22 MB de geometría en el instante 0.
