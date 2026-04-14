import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF } from "@react-three/drei";
import * as THREE from "three";

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

/* ── Scene Content ── */
function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.5} color="#93c5fd" />
      <directionalLight position={[8, 10, 5]} intensity={1.2} color="#dbeafe" />
      <directionalLight position={[-5, 6, -8]} intensity={0.5} color="#60a5fa" />
      <pointLight position={[0, 4, 0]} intensity={0.8} color="#3b82f6" distance={12} />
      
      <Suspense fallback={<LoadingSpinner />}>
        <Model />
      </Suspense>

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
      <Canvas
        camera={{ position: [6, 5, 8], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <SceneContent />
      </Canvas>

      <div className="ifc-model-label">
        <span className="ifc-label-icon">⚡</span>
        <span>Modelo 3D — Nave Licuadores</span>
        <span className="ifc-label-tech">BIM Optimizado (GLB)</span>
      </div>
    </div>
  );
}

useGLTF.preload("/models/nave-licuadores.glb");
