import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import * as OBC from "@thatopen/components";
import fragmentsWorkerUrl from "@thatopen/fragments/worker?url";

export default function ExportModel() {
  const [status, setStatus] = useState("Iniciando...");
  const sceneRef = useRef(new THREE.Scene());

  useEffect(() => {
    const components = new OBC.Components();
    let disposed = false;

    async function convertModel() {
      try {
        setStatus("Inicializando That Open Engine...");
        const fragments = components.get(OBC.FragmentsManager);
        fragments.init(fragmentsWorkerUrl);
        const ifcLoader = components.get(OBC.IfcLoader);
        await ifcLoader.setup({
          autoSetWasm: false,
          wasm: { path: "/wasm/", absolute: true },
        });
        components.init();

        setStatus("Descargando nave-licuadores.ifc...");
        const response = await fetch("/models/nave-licuadores.ifc");
        if (!response.ok) throw new Error(`Descarga IFC fallida (${response.status})`);
        const data = new Uint8Array(await response.arrayBuffer());

        setStatus("Convirtiendo IFC a Fragments...");
        const model = await ifcLoader.load(data, true, "nave-licuadores-export");
        if (disposed) {
          await model.dispose();
          return;
        }

        const center = model.box.getCenter(new THREE.Vector3());
        const size = model.box.getSize(new THREE.Vector3());
        const distance = Math.max(size.x, size.y, size.z, 1) * 2;
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, distance * 20);
        camera.position.set(center.x + distance, center.y + distance, center.z + distance);
        camera.lookAt(center);
        camera.updateProjectionMatrix();
        model.useCamera(camera);
        sceneRef.current.add(model.object);
        await fragments.core.update(true);

        setStatus("Convirtiendo a GLB (GLTF)...");
        const exporter = new GLTFExporter();
        const gltf = await exporter.parseAsync(sceneRef.current, { binary: true });
        setStatus("Creando archivo de descarga...");
        const blob = new Blob([gltf], { type: "model/gltf-binary" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.download = "nave-licuadores.glb";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setStatus("¡Descargado exitosamente! Revisa tu carpeta de Descargas.");
      } catch (e) {
        console.error(e);
        setStatus("Error: " + e.message);
      }
    }

    convertModel();
    return () => {
      disposed = true;
      components.dispose();
    };
  }, []);

  return (
    <div style={{ padding: 50, color: "white", background: "black", height: "100vh" }}>
      <h1>Convertidor de IFC a GLB</h1>
      <p>Estado: {status}</p>
    </div>
  );
}
