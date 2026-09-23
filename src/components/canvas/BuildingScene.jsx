import { Component, Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF } from "@react-three/drei";
import { easing } from "maath";

function Model() {
  // Ultra-fast GLB loading (~1-3 seconds instead of 17s)
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
      // Damping ultra-suave reactivo a la posición del cursor (Skill Three.js Animation)
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

/* ── Main Exported Component ── */
export default function BuildingScene() {
  return (
    <div className="hero-canvas-wrapper">
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

      <div className="ifc-model-label">
        <span className="ifc-label-icon">⚡</span>
        <span>Modelo 3D — Nave Licuadores</span>
        <span className="ifc-label-tech">BIM Optimizado (GLB)</span>
      </div>
    </div>
  );
}

useGLTF.preload("/models/nave-licuadores.glb");
