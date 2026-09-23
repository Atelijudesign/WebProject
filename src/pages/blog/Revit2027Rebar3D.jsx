import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export default function Revit2027Rebar3D() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  const csCode = `// Ejemplo Revit API C# - Inserción 3D de Rebar en Revit 2027.1
Rebar rebar = Rebar.CreateFromRebarShape(
    doc,
    rebarShape,
    rebarStyle,
    hostElement,
    originPoint3D,
    normalVector,
    Vector3D.BasisZ
);`;

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

  const shareUrl = getShareUrl("/blog/revit-2027-1-enfierraduras-3d");
  const shareTitle = encodeURIComponent(isEn ? "Revit 2027.1: Placing Standard Rebar Directly in 3D Views" : "Revit 2027.1: Colocación de Enfierraduras Estándar en Vistas 3D Directas");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "Revit 2027.1: Placing Standard Rebar Directly in 3D Views" : "Revit 2027.1: Colocación de Enfierraduras Estándar en Vistas 3D Directas"}
        description={isEn ? "Autodesk updated Revit to version 2027.1 introducing the capability to place standard reinforcing bars directly in 3D views using Expand to Host and By Two Points." : "Revit 2027.1 permite colocar barras de refuerzo estándar directamente en vistas 3D con métodos Expand to Host y By Two Points."}
        path="/blog/revit-2027-1-enfierraduras-3d"
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
              <i className="fa-solid fa-cubes mr-1" /> Revit 2027.1 · Enfierradura 3D
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 16 Jun 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "8 min read" : "8 min lectura"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            {isEn ? "Revit 2027.1: Placing Standard Rebar Directly in 3D Views" : (
              <>Revit 2027.1: Colocación de Enfierraduras Estándar en <span className="text-cyan-400">Vistas 3D Directas</span></>
            )}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isEn ? "Autodesk updated Revit to version 2027.1 introducing the capability to place standard reinforcing bars directly in 3D views using Expand to Host and By Two Points." : (
              <>Análisis exhaustivo de la actualización de Autodesk Revit 2027.1: métodos dinámicos <em>Expand to Host</em> y <em>By Two Points</em> directamente en 3D, empalmes libres (<em>Free-Form Rebar Splicing</em>) y optimización de flujos de detallado estructural.</>
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
              Autodesk Help — Revit 2027 Official Documentation
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
              <i className="fa-solid fa-star text-yellow-400" /> Resumen Técnico y Puntos Clave
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm mb-0">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-cube text-cyan-400 mt-1" />
                <span><strong className="text-white">Modelado Directo en 3D:</strong> Inserción de formas de armadura estándar sin necesidad de cortar planos 2D auxiliares.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-expand text-blue-400 mt-1" />
                <span><strong className="text-white">Expand to Host:</strong> Extrusión inteligente al recubrimiento de concreto anfitrión con snapping tridimensional.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-location-crosshairs text-indigo-400 mt-1" />
                <span><strong className="text-white">By Two Points:</strong> Definición de tramos rectos e inclinados mediante selección tridimensional rápida.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-diagram-project text-emerald-400 mt-1" />
                <span><strong className="text-white">Free-Form Rebar Splicing:</strong> Empalmes por traslape dinámicos en superficies curvadas y complejas.</span>
              </li>
            </ul>
          </div>

          {/* Main Figure */}
          <figure className="my-8 rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img
              src={asset("/assets/img/blog/news/revit_2027_rebar_3d.png")}
              alt="Colocación de Enfierraduras 3D en Revit 2027.1"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
              <i className="fa-solid fa-camera mr-1" /> {isEn ? "Figure 1:" : "Figura 1:"} Inserción directa de armaduras de refuerzo en vista 3D tridimensional en Revit 2027.1.
            </figcaption>
          </figure>

          {/* Section 1 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-cyan-600/20 text-cyan-400 rounded-lg text-lg">📐</span>
              1. El Desafío Tradicional vs La Solución 3D Directa
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Durante años, los modeladores y detalladores de estructuras de hormigón armado en Revit debían seguir un procedimiento rígido: crear una vista de sección 2D ortogonal, orientar el plano de trabajo (Work Plane), seleccionar la forma de armadura (Rebar Shape) y colocar la barra antes de retornar a la vista 3D para verificar traslapes o interferencias.
            </p>
            <p className="text-slate-300 leading-relaxed">
              En <strong className="text-white">Revit 2027.1</strong>, Autodesk rompe este paradigma al habilitar la colocación de armaduras estándar directamente en el entorno tridimensional. El motor reconoce automáticamente el volumen del elemento anfitrión (Host Element) como columnas, vigas, muros o cabezales de pilotes, y proyecta las caras de recubrimiento en tiempo real.
            </p>

            <div className="bg-slate-900/90 rounded-xl p-6 border border-slate-700/80 my-6">
              <h4 className="text-cyan-400 font-bold mb-3 text-base flex items-center gap-2">
                <i className="fa-solid fa-list-check" /> Métodos de Inserción Habilitados en 3D:
              </h4>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="bg-cyan-500/20 text-cyan-400 font-bold px-2 py-0.5 rounded text-xs">Expand to Host</span>
                  <span>La armadura se extiende automáticamente a los límites de recubrimiento (Cover Reference) del anfitrión detectado en 3D.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded text-xs">By Two Points</span>
                  <span>Permite definir el inicio y fin de la barra o conjunto mediante dos clics en cualquier cara 3D.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-indigo-500/20 text-indigo-400 font-bold px-2 py-0.5 rounded text-xs">Free-Form Splicing</span>
                  <span>Genera empalmes de traslape calculados según código ACI 318 o Eurocódigo 2 en barras curvadas o geométricas libres.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-blue-600/20 text-blue-400 rounded-lg text-lg">⚡</span>
              2. Aplicación en Elementos Complejos de Infraestructura
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Esta mejora es especialmente crítica en proyectos de obras civiles e infraestructura (puentes, túneles, cepas de viaductos y losas inclinadas). En este tipo de estructuras, los planos ortogonales 2D tradicionales solían requerir decenas de secciones oblicuas que saturaban el navegador de proyectos.
            </p>

            <div className="overflow-x-auto my-6">
              <table className="w-full text-left text-sm text-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-700 text-cyan-400 font-bold">
                    <th className="p-3">Característica</th>
                    <th className="p-3">Flujo Tradicional (Revit 2026 e Inferior)</th>
                    <th className="p-3">Flujo Revit 2027.1 (3D Directo)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr className="hover:bg-slate-900/50">
                    <td className="p-3 font-semibold text-white">Vistas Auxiliares</td>
                    <td className="p-3 text-slate-400">Requería crear 5 a 15 secciones 2D por elemento</td>
                    <td className="p-3 text-emerald-400 font-semibold">0 vistas auxiliares requeridas</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50">
                    <td className="p-3 font-semibold text-white">Snapping en Superficies Inclinadas</td>
                    <td className="p-3 text-slate-400">Complejo, propenso a desalineación de recubrimiento</td>
                    <td className="p-3 text-emerald-400 font-semibold">Snapping 3D automático a caras inclinadas</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50">
                    <td className="p-3 font-semibold text-white">Tiempo de Detallado Estructural</td>
                    <td className="p-3 text-slate-400">100% (Línea de base)</td>
                    <td className="p-3 text-cyan-400 font-bold">~60% (Ahorro del 40% de horas-hombre)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg text-lg">🛠️</span>
              3. Scripting & Revit API en Revit 2027.1
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Para los desarrolladores BIM que utilizan <strong className="text-cyan-400">Revit API (.NET / Python)</strong>, la versión 2027.1 expande las clases <code className="bg-slate-900 text-cyan-300 px-2 py-1 rounded font-mono text-xs">Rebar.CreateFromCurves</code> y <code className="bg-slate-900 text-cyan-300 px-2 py-1 rounded font-mono text-xs">Rebar.CreateFreeForm</code>, permitiendo a plugins como pyRevit o Dynamo instanciar patrones de refuerzo directamente en coordenadas 3D sin depender de una <code className="bg-slate-900 text-cyan-300 px-2 py-1 rounded font-mono text-xs">View</code> 2D activa.
            </p>
            <CodeBlock code={csCode} language="csharp" filename="Revit3DRebarPlacement.cs" />
          </div>

          {/* Official Source Banner Callout */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-cyan-500/30 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-600/20 text-cyan-400 rounded-xl text-xl">
                <i className="fa-solid fa-certificate" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base mb-1">Anuncio Oficial de Autodesk</h4>
                <p className="text-slate-400 text-xs mb-0">Consulta la nota de prensa original y los videos demostrativos en el Blog de Autodesk AEC.</p>
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

          {/* Conclusion */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-cyan-500">
            <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb text-yellow-400" /> Conclusión para Proyectistas Estructurales
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-0">
              La colocación 3D directa de enfierraduras en Revit 2027.1 posiciona a Revit al nivel de herramientas especializadas de detallado como Tekla Structures o Allplan, reduciendo drásticamente la barrera de entrada para modelar estructuras de hormigón armado de alta densidad.
            </p>
          </div>

        </div>
      </section>

      {/* ─── SHARE & FOOTER ─── */}{/* ─── SHARE BUTTONS ─── */}
      <ShareArticle url={shareUrl} title={shareTitle} />
    </div>
  );
}
