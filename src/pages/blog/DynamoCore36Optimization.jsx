import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export default function DynamoCore36Optimization() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  const designScriptCode = `// Ejemplo DesignScript optimizado en Dynamo 3.6
beams = Element.GetCategory("Structural Framing");
lengths = beams.GetParameterValueByName("Length");
volumes = beams.GetParameterValueByName("Volume");

// Cálculo paralelo acelerado
totalVolume = Math.Sum(volumes);
totalWeightKg = totalVolume * 7850.0;
print($"Volumen Total: {totalVolume} m3 | Peso Total: {totalWeightKg} kg");`;

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

  const shareUrl = getShareUrl("/blog/dynamo-core-3-6-optimizacion-rendimiento");
  const shareTitle = encodeURIComponent(isEn ? "Dynamo Core 3.6: 2x Loading Speed Optimization and File Close Redesign" : "Dynamo Core 3.6: Optimización de Rendimiento y Manejo de Memoria");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "Dynamo Core 3.6: 2x Loading Speed Optimization and File Close Redesign" : "Dynamo Core 3.6: Optimización de Rendimiento y Manejo de Memoria"}
        description={isEn ? "Dynamo Core 3.6 cuts graph opening times in half and accelerates heavy node closing by up to 4x, alongside 16% speed improvements in Code Block execution." : "Dynamo Core 3.6 mejora rendimiento con procesamiento paralelo, reducción de uso de memoria y aceleración en modelos masivos de Revit."}
        path="/blog/dynamo-core-3-6-optimizacion-rendimiento"
      />
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 z-50 transition-all duration-100"
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
            <span className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-bolt mr-1" /> Dynamo Core 3.6 · Performance
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 14 May 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "7 min read" : "7 min lectura"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            {isEn ? "Dynamo Core 3.6: 2x Loading Speed Optimization and File Close Redesign" : (
              <>Dynamo Core 3.6: <span className="text-cyan-400">Optimización de Carga x2</span> y Rediseño de Cierre de Archivos</>
            )}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isEn ? "Dynamo Core 3.6 cuts graph opening times in half and accelerates heavy node closing by up to 4x, alongside 16% speed improvements in Code Block execution." : (
              <>Dynamo Core 3.6 reduce el tiempo de apertura de archivos gráficos a la mitad y acelera hasta 4 veces el cierre de nodos pesados, junto con mejoras de rendimiento del 16% en nodos Code Block.</>
            )}
          </p>

          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-300 shadow-lg">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <i className="fa-solid fa-link text-xs" /> Fuente Oficial:
            </span>
            <a
              href="https://dynamobim.org/dynamo-core-3-6-release/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 transition-colors inline-flex items-center gap-1 text-xs sm:text-sm"
            >
              DynamoBIM Blog — Dynamo Core 3.6 Release Notes
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-12 bg-[#0b1220]/70 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">

          <div className="glass-card rounded-2xl p-8 md:p-10 border border-cyan-500/20 bg-cyan-950/20 mb-10 shadow-lg">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-gauge-high text-yellow-400" /> Benchmarks de Rendimiento
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm mb-0">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-rocket text-cyan-400 mt-1" />
                <span><strong className="text-white">Apertura 2x Más Rápida:</strong> Reducción al 50% del tiempo de deserialización de archivos `.dyn` masivos.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-xmark text-blue-400 mt-1" />
                <span><strong className="text-white">Cierre 4x Acelerado:</strong> Liberación inmediata de memoria RAM no administrada al cerrar gráficos con miles de elementos.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-code text-indigo-400 mt-1" />
                <span><strong className="text-white">16% Boost en Code Blocks:</strong> Optimización en la evaluación del compilador DesignScript.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-microchip text-emerald-400 mt-1" />
                <span><strong className="text-white">Multithread Execution:</strong> Distribución de evaluación de nodos independientes en múltiples núcleos de CPU.</span>
              </li>
            </ul>
          </div>

          <figure className="my-8 rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img
              src={asset("/assets/img/blog/news/dynamo_core_36_performance.png")}
              alt="Dynamo Core 3.6 Performance Optimization"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
              <i className="fa-solid fa-camera mr-1" /> {isEn ? "Figure 1:" : "Figura 1:"} Entorno de nodos visuales de Dynamo Core 3.6 optimizado para Revit 2026 y 2027.
            </figcaption>
          </figure>

          {/* Section 1 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-blue-600/20 text-cyan-400 rounded-lg text-lg">⚡</span>
              1. Rediseño del Motor de Carga y Cierre de Memoria
            </h3>
            <p className="text-slate-300 leading-relaxed">
              En flujos de trabajo de automatización avanzada (como generación automatizada de pórticos de acero, renumeración masiva de barras o asignación de parámetros compartidos), los scripts de Dynamo solían congelar la interfaz de Revit durante la apertura o cierre por problemas de recolección de basura (*Garbage Collection*).
            </p>
            <p className="text-slate-300 leading-relaxed">
              Dynamo Core 3.6 soluciona esto introduciendo una carga diferida (*Lazy Loading*) de paquetes de nodos de terceros y una rutina de cierre en segundo plano que desacopla la UI de Revit de la liberación de memoria de Dynamo.
            </p>
          </div>

          {/* Section 2 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg text-lg">💻</span>
              2. Optimización DesignScript en Code Blocks
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Los nodos <code className="bg-slate-900 text-cyan-300 px-2 py-1 rounded font-mono text-xs">Code Block</code> recibieron una refactorización interna que acelera en un 16% las iteraciones de bucles <code className="bg-slate-900 text-cyan-300 px-2 py-1 rounded font-mono text-xs">for</code> y operaciones matriciales con listas complejas de elementos.
            </p>

            <CodeBlock code={designScriptCode} language="designscript" filename="DynamoCore36_Optimized.ds" />
          </div>

          {/* Conclusion */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-cyan-500">
            <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb text-yellow-400" />{isEn ? "Conclusion" : "Conclusión"}</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-0">
              Dynamo Core 3.6 devuelve la fluidez al desarrollo de automatizaciones estructurales masivas en Revit, permitiendo iterar scripts complejos sin interrupciones ni cierres inesperados.
            </p>
          </div>

        </div>
      </section>

      {/* SHARE */}{/* ─── SHARE BUTTONS ─── */}
      <ShareArticle url={shareUrl} title={shareTitle} />
    </div>
  );
}
