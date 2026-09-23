import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export const RevitScanToBimReality3D = () => {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  const scanToBimCode = `# Pipeline Python / pyRevit para Segmentación de Nube de Puntos (Scan-to-BIM)
# Ajuste automático de Perfiles de Acero (ICHA / AISC) desde Nubes de Puntos (.e57 / .rcp)

import math
import clr
clr.AddReference('RevitAPI')
clr.AddReference('RevitServices')

from Autodesk.Revit.DB import *
from Autodesk.Revit.DB.Structure import StructuralType
from RevitServices.Persistence import DocumentManager
from RevitServices.Transactions import TransactionManager

doc = DocumentManager.Instance.CurrentDBDocument

def fit_steel_beam_from_cloud_segment(pt_start, pt_end, detected_flange_w, detected_height_h):
    """
    Toma los puntos centroidales de inicio y fin detectados por segmentación RANSAC
    y busca la familia de viga de acero más cercana en el catálogo ICHA / AISC.
    """
    # 1. Definir la línea de eje estructural
    start_xyz = XYZ(pt_start[0], pt_start[1], pt_start[2])
    end_xyz = XYZ(pt_end[0], pt_end[1], pt_end[2])
    axis_curve = Line.CreateBound(start_xyz, end_xyz)
    
    # 2. Tolerancias geométricas (en milímetros convertidos a pies de Revit)
    tol_mm = 5.0
    
    # 3. Buscar tipo de viga W / HN en el catálogo del proyecto
    collector = FilteredElementCollector(doc)\\
        .OfCategory(BuiltInCategory.OST_StructuralFraming)\\
        .WhereElementIsElementType()
        
    matched_type = None
    min_diff = 9999.0
    
    for elem_type in collector:
        # Extraer parámetros de altura (d) y ancho de ala (bf)
        param_h = elem_type.LookupParameter("d") or elem_type.LookupParameter("Height")
        param_b = elem_type.LookupParameter("bf") or elem_type.LookupParameter("Width")
        
        if param_h and param_b:
            h_mm = param_h.AsDouble() * 304.8
            b_mm = param_b.AsDouble() * 304.8
            diff = math.sqrt((h_mm - detected_height_h)**2 + (b_mm - detected_flange_w)**2)
            
            if diff < min_diff and diff <= tol_mm:
                min_diff = diff
                matched_type = elem_type
                
    if not matched_type:
        print(f"⚠️ No se encontró perfil exacto para H={detected_height_h}mm, B={detected_flange_w}mm.")
        return None
        
    # 4. Crear la viga estructural paramétrica en Revit
    TransactionManager.Instance.EnsureInTransaction(doc)
    
    if not matched_type.IsActive:
        matched_type.Activate()
        
    level = doc.ActiveView.GenLevel or FilteredElementCollector(doc).OfClass(Level).FirstElement()
    beam = doc.Create.NewFamilyInstance(axis_curve, matched_type, level, StructuralType.Beam)
    
    # Setear parámetro de desalineación o rotación si existe inclinación
    param_comment = beam.LookupParameter("Comments")
    if param_comment:
        param_comment.Set("Scan-to-BIM Automático Reality3D (Delta: {:.1f}mm)".format(min_diff))
        
    TransactionManager.Instance.TransactionTaskDone()
    
    print(f"✅ Viga creada: {matched_type.Name} | Longitud: {axis_curve.Length * 0.3048:.2f}m")
    return beam
`;

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        setScrollProgress((winScroll / height) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shareUrl = getShareUrl("/blog/revit-2027-scan-to-bim-vigas-acero-reality3d");
  const shareTitle = encodeURIComponent(isEn ? "Revit 2027 + Reality3D: Automated Modeling and Segmentation of Steel Beams from Point Clouds" : "Revit 2027 + Reality3D: Modelado Automático de Vigas de Acero desde Nubes de Puntos");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "Revit 2027 + Reality3D: Automated Modeling and Segmentation of Steel Beams from Point Clouds" : "Revit 2027 + Reality3D: Scan-to-BIM Automático de Vigas de Acero"}
        description={isEn ? "How to convert industrial plant LiDAR laser scans into native Revit ICHA/AISC structural steel profiles automatically using 3D segmentation algorithms." : "Aprende cómo los nuevos algoritmos de segmentación y visión 3D transforman nubes de puntos de plantas industriales en perfiles de acero nativos de Revit en segundos."}
        path="/blog/revit-2027-scan-to-bim-vigas-acero-reality3d"
        keywords="Scan to BIM, Nubes de Puntos, Revit 2027, Reality3D, Vigas de Acero, Estructuras Metalicas, Levantamiento As Built, Mineria, pyRevit, ICHA, AISC"
      />
      
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* HERO SECTION */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/60 transition-colors duration-300 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <Link to="/blog" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors inline-flex items-center gap-1">
              <i className="fa-solid fa-arrow-left text-xs" /> {isEn ? "Back to Blog" : "Volver al Blog"}
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-cyan-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-cube mr-1" /> Reality Capture · Scan-to-BIM
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 26 Ago 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> 8 min de lectura
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-mono">
              Revit 2027 + Reality3D
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 text-gradient-article">
            {isEn ? "Revit 2027 + Reality3D: Automated Modeling and Segmentation of Steel Beams from Point Clouds" : (
              <>📐 Revit 2027 + Reality3D: Modelado y Segmentación Automática de Vigas de Acero desde Nubes de Puntos</>
            )}
          </h1>

          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {isEn ? "How to convert industrial plant LiDAR laser scans into native Revit ICHA/AISC structural steel profiles automatically using 3D segmentation algorithms." : (
              <>Cómo la integración de algoritmos de segmentación volumétrica y machine learning permite convertir escaneos láser LiDAR de plantas industriales y mineras en perfiles ICHA/AISC nativos sin trazar manualmente viga por viga.</>
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.rmdatagroup.com/en/news/detail/new-features-point-cloud-visualization-flatness-check-steel-beam-modeling-and-integration-with-revit/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-cyan-400 font-bold shadow-lg hover:text-cyan-300 transition-colors"
            >
              <i className="fa-solid fa-newspaper" /> Fuente: RMData Reality3D News
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
            <a
              href="https://help.autodesk.com/view/RVT/2027/ENU/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-indigo-400 font-bold shadow-lg hover:text-indigo-300 transition-colors"
            >
              <i className="fa-solid fa-book-bookmark" /> Autodesk Revit 2027 Guide
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
            <a
              href="https://www.astm.org/e2807-11r19.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-emerald-400 font-bold shadow-lg hover:text-emerald-300 transition-colors"
            >
              <i className="fa-solid fa-cube" /> Norma ASTM E2807 (E57)
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* STATS IMPACT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-red-400 font-mono text-3xl font-bold mb-1">45 min</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Trazado Manual Tradicional / Pórtico</div>
            <p className="text-slate-500 text-xs mt-2">Cortes manuales de caja, alineación de ejes y cálculo de desaplome visual.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-emerald-400 font-mono text-3xl font-bold mb-1">12 seg</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Segmentación Reality3D</div>
            <p className="text-slate-500 text-xs mt-2">Detección RANSAC del alma, alas y longitud real de cada elemento.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-cyan-400 font-mono text-3xl font-bold mb-1">225×</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Aceleración de Modelado As-Built</div>
            <p className="text-slate-500 text-xs mt-2">Ajuste directo contra librerías de perfiles estándar ICHA y AISC.</p>
          </div>
        </div>

        {/* SECCIÓN 1: EL PROBLEMA REAL EN MINERÍA E INDUSTRIA */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-red-500/20 text-red-400 text-lg">⚠️</span>
            El Cuello de Botella del Scan-to-BIM Estructural
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-slate-300 leading-relaxed">
            <p>
              En proyectos de ampliación minera, celulosas, centrales hidroeléctricas o refinerías, el levantamiento con escáner láser terrestre (LiDAR) genera archivos de nubes de puntos de miles de millones de puntos (archivos <code>.rcp</code> / <code>.e57</code> que superan los 50 GB).
            </p>
            <p>
              Tradicionalmente, el proyectista estructural debe:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-2">
              <li>Crear decenas de cajas de sección (Section Boxes) en Revit para aislar cada viga.</li>
              <li>Medir con la regla milimétrica el ancho de ala y la altura para adivinar qué perfil es (¿es un HN 40x74 o un W16x50?).</li>
              <li>Trazar el eje y ajustar manualmente la rotación para absorber la deformación real o el desplome del galpón existente.</li>
            </ul>
            <p className="text-amber-300/90 font-medium">
              Este proceso manual es extremadamente propenso a errores humanos y puede consumir hasta el 60% de las horas hombre de ingeniería de detalle en una modernización de planta (Revamping / Brownfield).
            </p>
          </div>

          {/* IMAGEN 1: MODELADO INDUSTRIAL SCAN-TO-BIM */}
          <figure className="mt-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 shadow-2xl">
            <img
              src={asset("/assets/img/blog/scan_to_bim/industrial_steel_piping_bim.png")}
              alt="Modelado Scan-to-BIM de estructuras de acero y plantas industriales en Revit"
              className="w-full h-auto rounded-xl object-cover hover:scale-[1.01] transition-transform duration-300"
              loading="lazy"
            />
            <figcaption className="text-center text-xs text-slate-400 py-2.5 font-mono">
              {isEn ? "Figure 1:" : "Figura 1:"} Segmentación de estructuras y ruteo en plantas industriales con diálogo de catálogo integrado en Revit.
            </figcaption>
          </figure>
        </section>

        {/* SECCIÓN 2: CÓMO FUNCIONA LA SEGMENTACIÓN AUTOMÁTICA */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-lg">⚙️</span>
            Arquitectura del Motor Reality3D + Revit 2027
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 text-slate-300 leading-relaxed">
            <p>
              El motor de <strong>Reality3D</strong> integrado en Revit 2027 implementa una tubería algorítmica de 4 etapas que automatiza la extracción de geometría pura a entidades BIM nativas:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-cyan-400 font-bold mb-1 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-xs">1</span>
                  Filtrado y Detección Plana (RANSAC)
                </div>
                <p className="text-xs text-slate-400">
                  Agrupa los puntos de la nube en planos ortogonales continuos para aislar las caras del alma (Web) y las alas superior e inferior (Flanges) de la viga.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-cyan-400 font-bold mb-1 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-xs">2</span>
                  Bounding Box Orientado (OBB)
                </div>
                <p className="text-xs text-slate-400">
                  Calcula el vector axial 3D exacto del elemento, extrayendo la inclinación real, longitud y centro de masa independientemente del sistema de coordenadas global.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-cyan-400 font-bold mb-1 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-xs">3</span>
                  Emparejamiento con Catálogo ICHA/AISC
                </div>
                <p className="text-xs text-slate-400">
                  Compara las dimensiones de sección obtenidas contra la base de datos de perfiles cargados en Revit, asignando la familia estándar con menor desviación cuadrática media.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-cyan-400 font-bold mb-1 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-xs">4</span>
                  Instanciación Nativa Paramétrica
                </div>
                <p className="text-xs text-slate-400">
                  Crea un elemento nativo <code>StructuralFraming</code> en Revit con sus puntos de justificación, nivel de referencia y parámetros analíticos listos para cálculo.
                </p>
              </div>
            </div>

            {/* IMAGEN 2: WORKFLOW 3D Y VISTA X-RAY */}
            <figure className="mt-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 shadow-2xl">
              <img
                src={asset("/assets/img/blog/scan_to_bim/scan_to_bim_workflows_3d.png")}
                alt="Visualización X-Ray y duplicación de flujos de trabajo 3D Scan-to-BIM"
                className="w-full h-auto rounded-xl object-cover hover:scale-[1.01] transition-transform duration-300"
                loading="lazy"
              />
              <figcaption className="text-center text-xs text-slate-400 py-2.5 font-mono">
                {isEn ? "Figure 2:" : "Figura 2:"} Visualización transparente (X-Ray) en nubes de puntos y duplicación de flujos intermedios en Reality3D.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* SECCIÓN 3: SCRIPT DE AUTOMATIZACIÓN EN PYTHON */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-lg">💻</span>
            Script pyRevit: Conversor de Segmentos a Familias Nativas
          </h2>
          <p className="text-slate-300 text-sm mb-4">
            A continuación, el script de Python que puedes ejecutar desde la barra de pyRevit o Dynamo para conectar las coordenadas extraídas por el visor de nube de puntos con la base de datos de familias de Revit:
          </p>
          <CodeBlock
            code={scanToBimCode}
            language="python"
            title="scan_to_bim_steel_beam_fitter.py"
          />
        </section>

        {/* SECCIÓN 4: MEJORES PRÁCTICAS Y VERIFICACIÓN EN TERRENO */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-lg">💡</span>
            Criterios de Ingeniería y Tolerancias Constructivas
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-slate-300 leading-relaxed text-sm">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-circle-check text-emerald-400 mt-1" />
              <div>
                <strong className="text-white">Tolerancia de Corrosión y Pintura:</strong> En estructuras industriales existentes, el espesor de pintura intumescente o capas de óxido puede alterar la medición en 1 a 3 mm. Se debe configurar el umbral de búsqueda de catálogo con una holgura de ±5 mm.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-circle-check text-emerald-400 mt-1" />
              <div>
                <strong className="text-white">Validación de Flechas y Contrafechas:</strong> Las vigas de grandes luces bajo carga muerta presentarán deflexión natural en la nube de puntos. El algoritmo ajusta la viga sobre el eje medio de apoyos para no trasladar la comba al modelo analítico de diseño.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-circle-check text-emerald-400 mt-1" />
              <div>
                <strong className="text-white">Control de Planitud de Losas y Enfierraduras:</strong> Reality3D incluye mapas térmicos (Heatmaps) de rugosidad para verificar niveles de pisos industriales (FF/FL) antes del vaciado de hormigón.
              </div>
            </div>

            {/* IMAGEN 3: MAPA DE CALOR DE PLANITUD */}
            <figure className="mt-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 shadow-2xl">
              <img
                src={asset("/assets/img/blog/scan_to_bim/flatness_check_heatmap.png")}
                alt="Mapa térmico de análisis de planitud en losas industriales con nubes de puntos"
                className="w-full h-auto rounded-lg object-cover hover:scale-[1.01] transition-transform duration-300"
                loading="lazy"
              />
              <figcaption className="text-center text-xs text-slate-400 py-2.5 font-mono">
                {isEn ? "Figure 3:" : "Figura 3:"} Inspección de planitud y deformación milimétrica en losas y placas mediante mapa de colores (Flatness Check).
              </figcaption>
            </figure>
          </div>
        </section>



        {/* COMPARTIR Y RETORNO */}
        <div className="pt-8 border-t border-slate-800">
          <ShareArticle url={shareUrl} title={shareTitle} />
          
          <div className="mt-8 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white hover:border-cyan-500 hover:text-cyan-300 transition-all font-medium text-sm shadow-lg hover:shadow-cyan-500/10"
            >
              <i className="fa-solid fa-arrow-left" /> Volver a Todos los Artículos del Blog
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RevitScanToBimReality3D;
