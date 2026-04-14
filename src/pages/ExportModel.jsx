import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { IFCSPACE, IFCOPENINGELEMENT } from "web-ifc";
import { IFCLoader } from "web-ifc-three/IFCLoader";

export default function ExportModel() {
  const [status, setStatus] = useState("Iniciando...");
  const sceneRef = useRef(new THREE.Scene());

  useEffect(() => {
    async function convertModel() {
      try {
        setStatus("Cargando IFCLoader...");
        const ifcLoader = new IFCLoader();
        await ifcLoader.ifcManager.setWasmPath("/wasm/");
        
        // Ensure web-ifc handles the parser
        ifcLoader.ifcManager.setupThreeMeshBVH(
            // We don't have bvh installed, just ignore it for export
            null, null, null
        );

        setStatus("Descargando nave-licuadores.ifc...");
        const model = await ifcLoader.loadAsync("/models/nave-licuadores.ifc");

        sceneRef.current.add(model);
        
        setStatus("Convirtiendo a GLB (GLTF)...");
        const exporter = new GLTFExporter();
        
        exporter.parse(
          sceneRef.current,
          function (gltf) {
            setStatus("Creando archivo de descarga...");
            const blob = new Blob([gltf], { type: "application/octet-stream" });
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
          },
          function (error) {
            console.error(error);
            setStatus("Error en la conversión: " + error.message);
          },
          { binary: true }
        );
      } catch (e) {
        console.error(e);
        setStatus("Error: " + e.message);
      }
    }

    convertModel();
  }, []);

  return (
    <div style={{ padding: 50, color: "white", background: "black", height: "100vh" }}>
      <h1>Convertidor de IFC a GLB</h1>
      <p>Estado: {status}</p>
    </div>
  );
}
