import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export default function Tekla2026SP3ModelSharing() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  const teklaApiCode = `// Tekla Open API C# - Verificación de Estado de Model Sharing SP3
using Tekla.Structures.Model;
using Tekla.Structures.Model.Operations;

public class ModelSharingVerifier 
{
    public static void VerifySyncStatus() 
    {
        Model currentModel = new Model();
        if (currentModel.GetConnectionStatus()) 
        {
            string modelPath = currentModel.GetInfo().ModelPath;
            bool isSharingActive = Operation.IsModelSharingModel();
            
            System.Console.WriteLine($"[Tekla SP3] Modelo activo: {modelPath}");
            System.Console.WriteLine($"[Tekla SP3] Model Sharing habilitado: {isSharingActive}");
        }
    }
}`;

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

  const shareUrl = getShareUrl("/blog/tekla-structures-2026-sp3-model-sharing");
  const shareTitle = encodeURIComponent(isEn ? "Tekla Structures 2026 SP3: Model View Synchronization Fix in Tekla Model Sharing" : "Tekla Structures 2026 SP3: Corrección en Sincronización de Vistas en Tekla Model Sharing");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "Tekla Structures 2026 SP3: Model View Synchronization Fix in Tekla Model Sharing" : "Tekla Structures 2026 SP3: Corrección en Sincronización de Vistas en Tekla Model Sharing"}
        description={isEn ? "Trimble released Tekla Structures 2026 SP3, resolving model view desynchronization and mark glitches in multi-user projects using Tekla Model Sharing." : "Tekla Structures 2026 SP3 corrige errores críticos de sincronización de vistas en Model Sharing multi-usuario."}
        path="/blog/tekla-structures-2026-sp3-model-sharing"
      />
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 z-50 transition-all duration-100"
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
            <span className="bg-indigo-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-cloud-arrow-down mr-1" /> Tekla Structures 2026 SP3
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 05 Jun 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "7 min read" : "7 min lectura"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            {isEn ? "Tekla Structures 2026 SP3: Model View Synchronization Fix in Tekla Model Sharing" : (
              <>Tekla Structures 2026 SP3: Corrección en Sincronización en <span className="text-indigo-400">Tekla Model Sharing</span></>
            )}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isEn ? "Trimble released Tekla Structures 2026 SP3, resolving model view desynchronization and mark glitches in multi-user projects using Tekla Model Sharing." : (
              <>Trimble publicó Tekla Structures 2026 SP3 resolviendo errores críticos de desincronización de vistas de modelo y marcas en proyectos compartidos con Tekla Model Sharing, junto con mejoras en Tekla Model Assistant.</>
            )}
          </p>

          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-300 shadow-lg">
            <span className="text-indigo-400 font-bold flex items-center gap-1.5">
              <i className="fa-solid fa-link text-xs" /> Fuente Oficial:
            </span>
            <a
              href="https://support.tekla.com/doc/tekla-structures/2026/rel_2026_sp3_new_features_and_improvements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 transition-colors inline-flex items-center gap-1 text-xs sm:text-sm"
            >
              Tekla User Assistance — Release Notes 2026 SP3
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-12 bg-[#0b1220]/70 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">

          <div className="glass-card rounded-2xl p-8 md:p-10 border border-indigo-500/20 bg-indigo-950/20 mb-10 shadow-lg">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-star text-yellow-400" /> Novedades Clave en SP3
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm mb-0">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-arrows-rotate text-indigo-400 mt-1" />
                <span><strong className="text-white">Estabilidad en Read in / Write out:</strong> Solución definitiva a la desalineación de vistas guardadas y marcas de ensamble en paquetes compartidos.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-robot text-cyan-400 mt-1" />
                <span><strong className="text-white">Tekla Model Assistant:</strong> Auditoría en tiempo real de choques de pernos, soldaduras y holguras de montaje.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-file-drawing text-emerald-400 mt-1" />
                <span><strong className="text-white">Assembly Drawings Sync:</strong> Coherencia de planos de taller entre oficinas técnicas distribuidas.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-shield-halved text-purple-400 mt-1" />
                <span><strong className="text-white">Prevención de Corrupción de Datos:</strong> Bloqueo automático de paquetes de datos incompletos en caso de caídas de red.</span>
              </li>
            </ul>
          </div>

          <figure className="my-8 rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img
              src={asset("/assets/img/blog/news/tekla_2026_sp3_sharing.png")}
              alt="Tekla Structures 2026 SP3 Model Sharing Sync"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
              <i className="fa-solid fa-camera mr-1" /> {isEn ? "Figure 1:" : "Figura 1:"} Sincronización continua en Tekla Model Sharing en Tekla Structures 2026 Service Pack 3.
            </figcaption>
          </figure>

          {/* Section 1 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg text-lg">☁️</span>
              1. Corrección de Desincronización en Equipos Distribuidos
            </h3>
            <p className="text-slate-300 leading-relaxed">
              En proyectos de estructuras metálicas de gran escala (naves industriales, estadios o minería), múltiples detalladores trabajan de forma simultánea conectándose mediante <strong className="text-white">Tekla Model Sharing</strong>. En versiones anteriores de la serie 2026, realizar operaciones consecutivas de <em>Read in / Write out</em> provocaba ocasionalmente que las orientaciones de las vistas tridimensionales guardadas por el modelador principal sufrieran descalibramientos gráficos o pérdida de marcas en los planos de fabricación (<code className="bg-slate-900 text-indigo-300 px-2 py-1 rounded font-mono text-xs">Assembly Drawings</code>).
            </p>
            <p className="text-slate-300 leading-relaxed">
              El Service Pack 3 (SP3) corrige la gestión del identificador único de marcas de objeto (<code className="bg-slate-900 text-indigo-300 px-2 py-1 rounded font-mono text-xs">GUID Persistence</code>), asegurando que cualquier modificación en una unión o pernería se refleje idénticamente en todas las estaciones de trabajo cliente.
            </p>
          </div>

          {/* Section 2 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-cyan-600/20 text-cyan-400 rounded-lg text-lg">🤖</span>
              2. Asistente Inteligente Tekla Model Assistant
            </h3>
            <p className="text-slate-300 leading-relaxed">
              SP3 incluye actualizaciones en el <strong className="text-cyan-400">Tekla Model Assistant</strong>, un motor de verificación en segundo plano que alerta sobre inconsistencias geométricas antes de que el usuario envíe su paquete de cambios (<code className="bg-slate-900 text-cyan-300 px-2 py-1 rounded font-mono text-xs">Write out</code>) a la nube de Trimble.
            </p>
            <CodeBlock code={teklaApiCode} language="csharp" filename="ModelSharingVerifier.cs" />
          </div>

          {/* Official Link Card */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-indigo-500/30 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <h4 className="text-white font-bold text-base mb-1">Notas de Lanzamiento Trimble</h4>
              <p className="text-slate-400 text-xs mb-0">Consulta las notas técnicas completas del Service Pack 3 en Trimble Support.</p>
            </div>
            <a
              href="https://support.tekla.com/doc/tekla-structures/2026/rel_2026_sp3_new_features_and_improvements"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg whitespace-nowrap flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-up-right-from-square" /> Ver Release Notes
            </a>
          </div>

          {/* Conclusion */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-indigo-500">
            <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb text-yellow-400" /> Recomendación
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-0">
              Se recomienda a todas las empresas de ingeniería de detalle y talleres de fabricación de acero que utilicen Tekla Structures 2026 actualizar de forma prioritaria a SP3 en todas sus licencias activas para evitar desalineaciones en revisiones de planos de montaje.
            </p>
          </div>

        </div>
      </section>

      {/* SHARE */}{/* ─── SHARE BUTTONS ─── */}
      <ShareArticle url={shareUrl} title={shareTitle} />
    </div>
  );
}
