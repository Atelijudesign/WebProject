import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";
import CodeBlock from "../../components/CodeBlock";

export default function WhatsNewRevit2027() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (height > 0) {
        setScrollProgress((winScroll / height) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shareUrl = getShareUrl("/blog/whats-new-revit-2027-1");
  const shareTitle = encodeURIComponent(
    "Novedades de Revit 2027.1: Autodesk Assistant IA, Render GPU y Huella de Carbono EC3"
  );

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "What's New in Revit 2027.1: Autodesk Assistant AI, GPU Rendering & EC3 Carbon Analysis" : "Novedades de Revit 2027.1: Autodesk Assistant IA, Render GPU y Huella de Carbono EC3"}
        description={isEn ? "Technical review of Revit 2027.1: AI conversational assistant, native GPU-accelerated real-time viewport rendering, direct EC3 embodied carbon calculator integration, and smart numbering." : "Revisión completa de las novedades de Revit 2027.1 incluyendo Autodesk Assistant con IA, Rendering GPU nativo y cálculo de Huella de Carbono EC3."}
        path="/blog/whats-new-revit-2027-1"
      />
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ─── HERO ─── */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/60 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-80 h-80 bg-cyan-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              to="/blog"
              className="text-bim-blue hover:text-cyan-400 text-sm font-medium transition-colors inline-flex items-center gap-1"
            >
              <i className="fa-solid fa-arrow-left text-xs" /> {isEn ? "Back to Blog" : "Volver al Blog"}
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-cyan-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-rocket mr-1" /> Revit 2027.1 Release
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 10 Ago 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "8 min read" : "8 min lectura"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            {isEn ? "What's New in Revit 2027.1: Autodesk Assistant AI, GPU Rendering & EC3 Carbon Analysis" : (
              <><span className="text-cyan-400">Novedades de Revit 2027.1</span>:
            <br />
            IA con Autodesk Assistant, Render GPU & Cálculo de Carbono EC3</>
            )}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isEn ? "Technical review of Revit 2027.1: AI conversational assistant, native GPU-accelerated real-time viewport rendering, direct EC3 embodied carbon calculator integration, and smart numbering." : (
              <>Analizamos a fondo la actualización de Autodesk Revit 2027.1:
            asistentes generativos integrados, navegación en tiempo real por tarjeta gráfica GPU,
            etiquetado inteligente y sostenibilidad automatizada.</>
            )}
          </p>

          {/* Official Source Badge */}
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-300 shadow-lg">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <i className="fa-solid fa-link text-xs" /> Fuente Oficial:
            </span>
            <a
              href="https://help.autodesk.com/view/RVT/2027/ENU/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 transition-colors inline-flex items-center gap-1 text-xs sm:text-sm"
            >
              Autodesk Help — Revit 2027 Documentation
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </div>
        </div>
      </section>


      {/* ─── ARTICLE CONTENT ─── */}
      <section className="py-12 bg-[#0b1220]/70 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">

          {/* Key Highlights Card */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-cyan-500/20 bg-cyan-950/20 mb-10 shadow-lg">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-star text-yellow-400" />
              Resumen de Puntos Clave en Revit 2027.1
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm mb-0">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-robot text-cyan-400 mt-1" />
                <span><strong className="text-white">Autodesk Assistant (IA):</strong> Interacción por lenguaje natural para consultar parámetros y comandos.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-microchip text-blue-400 mt-1" />
                <span><strong className="text-white">Accelerated Graphics (GPU):</strong> Renderizado continuo por tarjeta gráfica para modelos masivos.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-leaf text-emerald-400 mt-1" />
                <span><strong className="text-white">Carbon Asset (EC3):</strong> Integración de materiales con datos de carbono de Building Transparency.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-tags text-indigo-400 mt-1" />
                <span><strong className="text-white">Rule-Based Tagging:</strong> Numeración automatizada y etiquetas multi-categoría mejoradas.</span>
              </li>
            </ul>
          </div>

          {/* Section 1: Autodesk Assistant */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-cyan-600/20 text-cyan-400 rounded-lg text-lg">🤖</span>
              1. Autodesk Assistant: La Inteligencia Artificial entra a Revit
            </h3>
            <p className="text-slate-300 leading-relaxed">
              La mayor novedad de Revit 2027.1 es la integración nativa del 
              <strong className="text-white"> Autodesk Assistant (Tech Preview)</strong>. 
              Este módulo de inteligencia artificial conversacional permite al usuario realizar preguntas en español o inglés directamente sobre la geometría, familias y datos de proyecto.
            </p>

            {/* Figura 1 - Autodesk Assistant */}
            <figure className="my-8 rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
              <img
                src={asset("/assets/img/blog/revit2027/revit_2027_assistant.png")}
                alt="Autodesk Assistant AI en Revit 2027.1"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
                <i className="fa-solid fa-camera mr-1" /> {isEn ? "Figure 1:" : "Figura 1:"} Interfaz del Autodesk Assistant integrado en Revit 2027.1 con resaltado analítico conversacional.
              </figcaption>
            </figure>

            <div className="my-6">
              <CodeBlock
                code={`// Ejemplo de consulta al Autodesk Assistant:
"Selecciona todas las columnas W14x90 en el Nivel 3 y calcula el volumen total de acero estructural."

➔ Respuesta: 18 columnas seleccionadas · Volumen Total: 14.82 m³ · Peso: 116.3 Ton.`}
                language="plaintext"
                filename="Autodesk_Assistant_Prompt.txt"
              />
            </div>

            <p className="text-slate-300">
              Para los desarrolladores de herramientas y plugins, esto abre la puerta a conectar modelos LLM con la <strong className="text-cyan-400">Revit API</strong>, reduciendo el tiempo de navegación y filtrado de datos en un 70%.
            </p>
          </div>

          {/* Section 2: Accelerated Graphics Engine */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-blue-600/20 text-blue-400 rounded-lg text-lg">⚡</span>
              2. Accelerated Graphics: Navegación por GPU en Tiempo Real
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Históricamente, la vista 3D de Revit dependía fuertemente del rendimiento mono-núcleo de la CPU. En la versión 2027.1, el motor de 
              <strong className="text-white"> Accelerated Graphics</strong> pasa a ser <strong className="text-emerald-400">Production-Ready</strong>.
            </p>

            {/* Figura 2 - GPU Accelerated Graphics */}
            <figure className="my-8 rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
              <img
                src={asset("/assets/img/blog/revit2027/revit_2027_gpu.png")}
                alt="Accelerated GPU Graphics y Section Box en Revit 2027.1"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
                <i className="fa-solid fa-camera mr-1" /> {isEn ? "Figure 2:" : "Figura 2:"} Rendimiento continuo con GPU dedicada y Section Box fluido en tiempo real.
              </figcaption>
            </figure>

            <div className="space-y-4 my-6">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-check-circle text-blue-400 mt-1" />
                <div>
                  <strong className="text-white">Section Box en Tiempo Real:</strong>{" "}
                  <span className="text-slate-300">El corte de modelos en 3D es fluido e instantáneo sin caídas de cuadros (*FPS lag*).</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-check-circle text-blue-400 mt-1" />
                <div>
                  <strong className="text-white">Carga GPU Dedicada:</strong>{" "}
                  <span className="text-slate-300">Las tareas de renderizado de bordes, sombras y transparencia se transfieren directamente a tarjetas NVIDIA RTX o AMD Radeon.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Carbon Asset & EC3 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg text-lg">🌱</span>
              3. Carbon Asset & Integración con EC3
            </h3>
            <p className="text-slate-300 leading-relaxed">
              En respuesta a los estándares de edificación sostenible e indicadores ESG, Revit 2027.1 incorpora la pestaña 
              <strong className="text-white"> Carbon Asset</strong> dentro del editor de Materiales. Este módulo se conecta en tiempo real con la base de datos de 
              <strong className="text-emerald-400"> Building Transparency EC3</strong>.
            </p>

            {/* Figura 3 - Carbon Asset EC3 */}
            <figure className="my-8 rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
              <img
                src={asset("/assets/img/blog/revit2027/revit_2027_carbon.png")}
                alt="Carbon Asset de Materiales conectado con EC3 en Revit 2027.1"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
                <i className="fa-solid fa-camera mr-1" /> {isEn ? "Figure 3:" : "Figura 3:"} Pestaña Carbon Asset con métricas de huella de carbono embebida EC3 para acero y hormigón.
              </figcaption>
            </figure>

            <div className="bg-emerald-950/30 rounded-xl p-6 border border-emerald-800/40 my-6">
              <h4 className="font-bold text-emerald-400 text-sm mb-2 flex items-center gap-2">
                <i className="fa-solid fa-calculator" /> Beneficio para Proyectos de Ingeniería y Acero:
              </h4>
              <p className="text-slate-300 text-sm mb-0">
                Permite asociar a los perfiles de acero ICHA/AISC y hormigones sus coeficientes de <strong className="text-white">Carbono Embebido (Embodied Carbon - kgCO2e/kg)</strong> directamente en la tabla de materiales, exportando reportes de impacto ambiental sin necesidad de software externo.
              </p>
            </div>
          </div>

          {/* Section 4: Documentación y Automatización */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg text-lg">📐</span>
              4. Mejoras en Documentación & Etiquetado
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Para los equipos dedicados al desarrollo de planos y coordinación de instalaciones, destacan dos grandes adiciones:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white text-base mb-2">Rule-Based Numbering</h4>
                <p className="text-xs text-slate-400 mb-0">
                  Reglas de numeración automática secuencial para elementos de armadura de hormigón, vigas y paneles de fachada.
                </p>
              </div>
              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white text-base mb-2">Multi-Category Tags Pro</h4>
                <p className="text-xs text-slate-400 mb-0">
                  Mejora en las directrices de etiquetas múltiples que permiten agrupar elementos mixtos sin romper la legibilidad gráfica.
                </p>
              </div>
            </div>
          </div>

          {/* Official Source Banner Callout */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-cyan-500/30 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-600/20 text-cyan-400 rounded-xl text-xl">
                <i className="fa-solid fa-certificate" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base mb-1">Análisis basado en el comunicado oficial de Autodesk</h4>
                <p className="text-slate-400 text-xs mb-0">Consulta la nota de prensa original, parches de seguridad y documentación oficial de lanzamiento en el Blog AEC de Autodesk.</p>
              </div>
            </div>
            <a
              href="https://help.autodesk.com/view/RVT/2027/ENU/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-lg hover:shadow-cyan-500/25 whitespace-nowrap flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-up-right-from-square" /> Ver Documentación Oficial
            </a>
          </div>

          {/* Section 5: Conclusiones */}

          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-cyan-500">
            <h3 className="text-xl font-extrabold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb text-yellow-400" />
              Conclusión: ¿Hacia dónde se dirige el desarrollo BIM?
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Revit 2027.1 confirma la tendencia: la automatización basada en código (Python/C#) combinada con modelos de inteligencia artificial será el estándar operativo.
            </p>
            <p className="text-slate-300 mb-0">
              Para desarrolladores BIM y proyectistas, integrar herramientas como 
              <Link to="/blog/pyrevit-accelerator" className="text-cyan-400 font-bold hover:underline mx-1">pyRevit</Link> 
              y bibliotecas web de consulta técnica será vital para aprovechar al máximo las nuevas capacidades de Autodesk.
            </p>
          </div>

        </div>
      </section>

      {/* ─── SHARE BUTTONS ─── */}{/* ─── SHARE BUTTONS ─── */}
      <ShareArticle url={shareUrl} title={shareTitle} />

      {/* ─── FOOTER NAV ─── */}
      <section className="py-12 bg-[#030712] border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center text-cyan-400 font-bold hover:text-cyan-300 transition-colors group text-lg"
          >
            <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform" />
            {isEn ? "Back to Blog" : "Volver al Blog"}
          </Link>
          <Link
            to="/#contact"
            className="inline-flex items-center text-slate-400 hover:text-cyan-400 font-medium transition-colors text-sm"
          >
            <i className="fa-solid fa-envelope mr-1" /> Contacto
          </Link>
        </div>
      </section>
    </div>
  );
}
