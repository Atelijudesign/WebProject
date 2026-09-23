import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export default function AITakeoffStructuralSteel() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  const takeoffCode = `# Python API Pipeline para AI Structural Takeoff (PDF 2D / IFC 3D)
import cv2
import pandas as pd

def process_structural_plan_takeoff(pdf_page_image):
    # 1. Segmentación por Visión Computacional de Perfiles W y Placas
    detected_profiles = [
        {"profile": "W14x90", "count": 24, "length_m": 6.5, "weight_kg_m": 134.0},
        {"profile": "W12x53", "count": 48, "length_m": 8.0, "weight_kg_m": 79.0},
        {"profile": "PL1/2_x12", "count": 96, "length_m": 0.4, "weight_kg_m": 24.5}
    ]
    
    df = pd.DataFrame(detected_profiles)
    df["total_weight_kg"] = df["count"] * df["length_m"] * df["weight_kg_m"]
    total_ton = df["total_weight_kg"].sum() / 1000.0
    
    print(f"Cubicación Total Estimada por IA: {total_ton:.2f} Toneladas de Acero")
    return df`;

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

  const shareUrl = getShareUrl("/blog/ia-takeoff-cubicacion-estructuras-acero");
  const shareTitle = encodeURIComponent(isEn ? "AI Tools for Structural Steel & Concrete Takeoff (AI Takeoff)" : "AI Takeoff: Cubicación Automatizada de Estructuras de Acero y Hormigón");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "AI Tools for Structural Steel & Concrete Takeoff (AI Takeoff)" : "AI Takeoff: Cubicación Automatizada de Estructuras de Acero y Hormigón"}
        description={isEn ? "Adoption of AI-powered takeoff platforms capable of processing 2D and 3D engineering documentation and classifying reinforced concrete members and structural steel shapes." : "Plataformas de AI Takeoff para cubicación automática de acero estructural usando visión computacional en planos PDF e IFC."}
        path="/blog/ia-takeoff-cubicacion-estructuras-acero"
      />
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 z-50 transition-all duration-100"
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
            <span className="bg-amber-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-calculator mr-1" /> IA & Estimaciones · AI Takeoff
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 12 Mar 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "8 min read" : "8 min lectura"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            {isEn ? "AI Tools for Structural Steel & Concrete Takeoff (AI Takeoff)" : (
              <>Herramientas de IA para Cubicaciones de Estructuras y Acero <span className="text-amber-400 font-mono">(AI Takeoff)</span></>
            )}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isEn ? "Adoption of AI-powered takeoff platforms capable of processing 2D and 3D engineering documentation and classifying reinforced concrete members and structural steel shapes." : (
              <>Adopción de plataformas de cubicación impulsadas por visión computacional e IA (como TheTakeoff.AI) capaces de procesar planos 2D y modelos 3D para cuantificar volúmenes de hormigón y toneladas de acero.</>
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.contravault.com/blog/10-best-ai-takeoff-software-tools-for-construction-in-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-amber-400 font-bold shadow-lg hover:text-amber-300"
            >
              <i className="fa-solid fa-list-check" /> ContraVault Best AI Takeoff Tools
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
            <a
              href="https://designdrafter.com/ai-in-construction-how-ai-is-transforming-building-design-in-2026/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-cyan-400 font-bold shadow-lg hover:text-cyan-300"
            >
              <i className="fa-solid fa-building text-cyan-400" /> DesignDrafter AI Report
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-12 bg-[#0b1220]/70 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">

          <div className="glass-card rounded-2xl p-8 md:p-10 border border-amber-500/20 bg-amber-950/20 mb-10 shadow-lg">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-chart-pie text-yellow-400" /> Revolución en la Estimación de Licitaciones
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm mb-0">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-eye text-amber-400 mt-1" />
                <span><strong className="text-white">Reconocimiento Óptico 2D:</strong> Extracción de notas de perfiles ICHA/AISC y tablas de armaduras directamente desde PDFs.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-cubes text-orange-400 mt-1" />
                <span><strong className="text-white">Procesamiento de Modelos 3D:</strong> Extracción instantánea de metrajes de modelos IFC y Revit sin software CAD instalado.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-percent text-yellow-400 mt-1" />
                <span><strong className="text-white">Margen de Error inferior al 1.5%:</strong> Comparado con mediciones manuales con escalímetro digital.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-file-excel text-emerald-400 mt-1" />
                <span><strong className="text-white">Exportación Directa a Excel / ERP:</strong> Integración inmediata con software de costos e presupuestos.</span>
              </li>
            </ul>
          </div>

          <figure className="my-8 rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img
              src={asset("/assets/img/blog/news/ai_takeoff_steel_concrete.png")}
              alt="AI Takeoff Structural Steel Concrete Calculation"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
              <i className="fa-solid fa-camera mr-1" /> {isEn ? "Figure 1:" : "Figura 1:"} Interfaz de cubicación automatizada mediante visión computacional e IA para estructuras de acero y hormigón.
            </figcaption>
          </figure>

          {/* Section 1 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-amber-600/20 text-amber-400 rounded-lg text-lg">📊</span>
              1. De Días de Medición Manual a Minutos de Procesamiento por IA
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Durante el proceso de oferta y licitación de un proyecto industrial, los cubicadores de empresas constructoras dedican días enteros a contar columnas, medir metros lineales de perfiles W o calcular m³ de fundaciones.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              Las plataformas de <strong className="text-white">AI Takeoff</strong> utilizan modelos de segmentación de imágenes (Deep Learning) que detectan elementos estructurales en planos 2D y modelos 3D, clasificándolos automáticamente por tipo de acero, grado de hormigón y nivel del proyecto.
            </p>
            <CodeBlock code={takeoffCode} language="python" filename="ai_structural_takeoff.py" />
          </div>

          {/* Conclusion */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-amber-500">
            <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb text-yellow-400" />{isEn ? "Conclusion" : "Conclusión"}</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-0">
              La adopción de software de AI Takeoff permite a los equipos de estudios de propuestas cotizar un 400% más de proyectos por mes con una precisión cuantitativa sin precedentes.
            </p>
          </div>

        </div>
      </section>

      {/* SHARE */}{/* ─── SHARE BUTTONS ─── */}
      <ShareArticle url={shareUrl} title={shareTitle} />
    </div>
  );
}
