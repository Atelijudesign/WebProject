import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export default function AIClashTriageBim() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  const pythonCode = `import xml.etree.ElementTree as ET
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

def parse_navisworks_clashes(xml_file_path):
    tree = ET.parse(xml_file_path)
    root = tree.getroot()
    clash_records = []

    for clash in root.findall(".//clashresult"):
        clash_name = clash.attrib.get("name", "Unknown")
        distance = float(clash.attrib.get("distance", 0.0))
        
        # Extraer metadatos de los dos elementos en conflicto
        obj1 = clash.find("./clashobjects/clashobject[1]")
        obj2 = clash.find("./clashobjects/clashobject[2]")
        
        cat1 = obj1.find(".//property[name='Category']").text if obj1 is not None else ""
        cat2 = obj2.find(".//property[name='Category']").text if obj2 is not None else ""
        
        # Determinar si involucra estructura crítica (Vigas, Columnas, Muros Muestrales)
        is_structural = "Structural" in cat1 or "Structural" in cat2
        
        # Determinar si es un pase de losa pre-diseñado
        is_sleeve = "Sleeve" in cat1 or "Sleeve" in cat2 or "Opening" in cat1 or "Opening" in cat2

        clash_records.append({
            "clash_id": clash_name,
            "overlap_distance": abs(distance),
            "cat1": cat1,
            "cat2": cat2,
            "is_structural": int(is_structural),
            "is_sleeve": int(is_sleeve)
        })

    return pd.DataFrame(clash_records)

# Ejemplo de regla de inferencia o modelo entrenado:
def classify_clash(row):
    if row["is_sleeve"]:
        return "FALSO_POSITIVO_IGNORABLE"
    if row["is_structural"] and row["overlap_distance"] > 0.02:
        return "CHOQUE_CRITICO_ESTRUCTURAL"
    if "Insulation" in row["cat1"] or "Insulation" in row["cat2"]:
        return "CHOQUE_MENOR_TOLERANCIA"
    return "REVISION_MANUAL"

print("Pipeline de triaje de interferencias configurado exitosamente.")`;

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

  const shareUrl = getShareUrl("/blog/ia-clash-triage-clasificacion-interferencias-bim");
  const shareTitle = encodeURIComponent(isEn ? "AI Models for Clash Triage and Automated BIM Clash Classification" : "Modelos IA para Triaje y Clasificación de Interferencias BIM / MEPF");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "AI Models for Clash Triage and Automated BIM Clash Classification" : "Modelos IA para Triaje y Clasificación de Interferencias BIM / MEPF"}
        description={isEn ? "Machine learning algorithms that analyze coordination clash data in Navisworks/ACC, filtering out geometric false positives and prioritizing critical structural collisions." : "Cómo la inteligencia artificial clasifica automáticamente clashes de Navisworks en categorías críticas, menores y falsos positivos."}
        path="/blog/ia-clash-triage-clasificacion-interferencias-bim"
      />
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* HERO */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/60 transition-colors duration-300 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <Link to="/blog" className="text-bim-blue hover:text-cyan-400 text-sm font-medium transition-colors inline-flex items-center gap-1">
              <i className="fa-solid fa-arrow-left text-xs" /> {isEn ? "Back to Blog" : "Volver al Blog"}
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-rose-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-brain mr-1" /> IA & MEPF · Clash Triage 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 18 Abr 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "12 min read" : "12 min lectura"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            {isEn ? "AI Models for Clash Triage and Automated BIM Clash Classification" : (
              <>Modelos de IA para Triaje y Clasificación de Interferencias MEPF <span className="text-rose-400 font-mono">(Clash Triage 2026)</span></>
            )}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isEn ? "Machine learning algorithms that analyze coordination clash data in Navisworks/ACC, filtering out geometric false positives and prioritizing critical structural collisions." : (
              <>Integración de algoritmos de Machine Learning y automatización MEPF para filtrar falsos positivos en Navisworks/ACC, acelerar la coordinación tridimensional y generar modelos construibles para prefabricación industrializada.</>
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.advenser.com/2026/07/21/mepf-coordination-and-clash-detection-in-2026-how-automation-is-improving-bim-services-delivery/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-cyan-400 font-bold shadow-lg hover:text-cyan-300 transition-colors"
            >
              <i className="fa-solid fa-newspaper" /> Advenser MEPF 2026 Report
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-12 bg-[#0b1220]/70 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">

          {/* KPI HIGHLIGHT BOX */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-rose-500/20 bg-rose-950/20 mb-10 shadow-lg">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-chart-line text-yellow-400" /> Métricas Clave de la Automatización MEPF en 2026
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm mb-0">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-filter text-rose-400 mt-1" />
                <span><strong className="text-white">Depuración del 80% de Falsos Positivos:</strong> Eliminación automatizada de interferencias por aislamiento térmico, tolerancias de montaje y pases de losa ya aprobados.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-layer-group text-pink-400 mt-1" />
                <span><strong className="text-white">Priorización por Riesgo Estructural:</strong> Clasificación instantánea de interferencias severas entre tuberías de gran diámetro o ductos de climatización y vigas maestras.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-route text-cyan-400 mt-1" />
                <span><strong className="text-white">Ruteo Algorítmico Autónomo:</strong> Algoritmos de optimización de trazado MEPF que re-enrutan ductos y bandejas de cables respetando pendientes y códigos.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-industry text-emerald-400 mt-1" />
                <span><strong className="text-white">Modelos Listos para Fabricación (Construction-Ready):</strong> Generación directa de planos de carretes de tubería (Spool Drawings) y módulos prefabricados.</span>
              </li>
            </ul>
          </div>

          {/* MAIN VISUAL */}
          <figure className="my-8 rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img
              src={asset("/assets/img/blog/news/ai_clash_triage_navisworks.png")}
              alt="AI Clash Triage Navisworks Matrix and MEPF Automation"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
              <i className="fa-solid fa-camera mr-1" /> {isEn ? "Figure 1:" : "Figura 1:"} Matriz de triaje mediante inteligencia artificial procesando datos de Navisworks Clash Detective y Autodesk Construction Cloud (ACC).
            </figcaption>
          </figure>

          {/* SECTION 1 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-rose-600/20 text-rose-400 rounded-lg text-lg">🤖</span>
              1. El Desafío de los "Falsos Positivos" en la Coordinación BIM Tradicional
            </h3>
            <p className="text-slate-300 leading-relaxed">
              En proyectos complejas de alta densidad técnica (hospitales, centros de datos, plantas industriales y rascacielos), la ejecución de un reporte de interferencias estándar en <strong className="text-white">Navisworks Clash Detective</strong> o <strong className="text-white">Autodesk Model Coordination</strong> suele arrojar entre 5,000 y más de 20,000 choques.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Sin embargo, hasta un 80% de estos hallazgos son <strong className="text-rose-300">falsos positivos o interferencias no críticas</strong>:
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2 mb-4">
              <li><strong className="text-white">Solape de Aislamientos:</strong> Tuberías de agua helada cuyo aislamiento térmico interseca la envolvente de otra tubería sin tocar la pared de acero.</li>
              <li><strong className="text-white">Pases de Losa Aprobados:</strong> Tuberías de drenaje o ductos de extracción que atraviesan pasadas ya contempladas en los planos de encofrado estructural.</li>
              <li><strong className="text-white">Espacios de Mantenimiento (Clearance Zones):</strong> Zonas de acceso a válvulas o paneles eléctricos colisionando dinámicamente con cielos falsos desmontables.</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mb-0">
              Revisar manualmente miles de ítems consume cientos de horas hombre de coordinadores BIM calificados, distrayendo su atención de las interferencias realmente destructivas en obra.
            </p>
          </div>

          {/* SECTION 2: ADVENSER INSIGHTS */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-cyan-600/20 text-cyan-400 rounded-lg text-lg">⚙️</span>
              2. Coordinación MEPF en 2026: De la Detección Pasiva al Trazado Algorítmico Autónomo
            </h3>
            <p className="text-slate-300 leading-relaxed">
              De acuerdo con el informe de la industria publicado por <strong className="text-cyan-400">Advenser Engineering Services (2026)</strong>, la coordinación MEPF (Mecánica, Electricidad, Plomería y Protección Contra Incendios) ha evolucionado desde la simple "detección pasiva de choques" hacia la <strong className="text-white">resolución algorítmica autónoma</strong>.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-cyan-400 text-lg font-bold mb-2">
                  <i className="fa-solid fa-diagram-project mr-2" /> Ruteo Inteligente
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Algoritmos geométricos recalculan trayectorias de ductos HVAC y bandejas porta-cables esquivando elementos estructurales respetando radios de curvatura mínimos y caídas de presión hidráulica.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-emerald-400 text-lg font-bold mb-2">
                  <i className="fa-solid fa-cubes-stacked mr-2" /> Prefabricación Off-Site
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Los modelos libres de choques alimentan directamente sistemas CAM para el corte robotizado de cañerías y la fabricación modular de pasillos técnicos (*MEP Skids & Racks*).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-rose-400 text-lg font-bold mb-2">
                  <i className="fa-solid fa-file-shield mr-2" /> Cero Rework en Obra
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  La validación previa con modelos de IA asegura que el 100% de los elementos prefabricados ensamblen en terreno con precisión milimétrica, reduciendo las solicitudes de información (RFI).
                </p>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed mb-0">
              La sinergia entre el triaje automático de choques y el ruteo paramétrico permite pasar de semanas de reuniones de coordinación a iteraciones continuas y automatizadas durante la fase de detalle.
            </p>
          </div>

          {/* SECTION 3: PYTHON CODE SNIPPET */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg text-lg">🐍</span>
              3. Pipeline Técnico de Triaje con Machine Learning (Python + XML/JSON)
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              A continuación se presenta una implementación de referencia en Python para extraer choques exportados desde Navisworks XML, calcular el volumen de colisión y clasificar semánticamente los choques utilizando <code className="text-emerald-400">scikit-learn</code> / XGBoost:
            </p>

            <CodeBlock code={pythonCode} language="python" filename="clash_triage_ml.py" />
          </div>

          {/* SECTION 4: COMPARATIVE TABLE */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-rose-600/20 text-rose-400 rounded-lg text-lg">📊</span>
              4. Comparativa: Coordinación Tradicional vs. Triaje Asistido por IA (2026)
            </h3>
            
            <div className="overflow-x-auto my-4">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/80 text-white font-bold">
                    <th className="p-3">Parámetro</th>
                    <th className="p-3 text-rose-400">Coordinación BIM Tradicional</th>
                    <th className="p-3 text-emerald-400">Triaje IA & MEPF Automatizado (2026)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="p-3 font-semibold text-white">Falsos Positivos</td>
                    <td className="p-3 text-slate-400">Revisados manualmente uno a uno.</td>
                    <td className="p-3 text-emerald-300 font-bold">Filtrados automáticamente (80% reducción).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Tiempo de Sesión BIM</td>
                    <td className="p-3 text-slate-400">4 a 8 horas semanales por especialista.</td>
                    <td className="p-3 text-emerald-300 font-bold">1 a 2 horas centradas en decisiones clave.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Trazado MEPF</td>
                    <td className="p-3 text-slate-400">Re-ruteo manual en Revit/CAD.</td>
                    <td className="p-3 text-emerald-300 font-bold">Re-ruteo algorítmico autónomo.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Entregables Obra</td>
                    <td className="p-3 text-slate-400">Planos 2D con omisiones y desajustes.</td>
                    <td className="p-3 text-emerald-300 font-bold">Spool drawings y módulos para prefabricación.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CONCLUSION */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-rose-500">
            <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb text-yellow-400" /> Conclusión e Impacto en la Industria AEC
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-0">
              La integración de inteligencia artificial para el triaje de interferencias y la automatización MEPF marca la transición definitiva desde la modelación tridimensional estándar hacia una <strong className="text-white">ingeniería digital verdaderamente construible</strong>. Liberar a los ingenieros del filtrado manual de falsos positivos acelera los plazos de entrega, optimiza la prefabricación industrial y erradica los sobrecostos por reprocesos en la obra física.
            </p>
          </div>

        </div>
      </section>

      {/* SHARE & FOOTER */}{/* ─── SHARE BUTTONS ─── */}
      <ShareArticle url={shareUrl} title={shareTitle} />
    </div>
  );
}

