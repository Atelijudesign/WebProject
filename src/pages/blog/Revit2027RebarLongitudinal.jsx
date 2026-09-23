import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export default function Revit2027RebarLongitudinal() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  const csCode = `// Ejemplo Revit API C# (Revit 2027) - Generación de Armadura Longitudinal desde Elemento Transversal
using Autodesk.Revit.DB;
using Autodesk.Revit.DB.Structure;

public void CreateLongitudinalRebarFromTransverse(
    Document doc, 
    Element hostElement, 
    Rebar transverseStirrup, 
    RebarShape longitudinalShape)
{
    using (Transaction tx = new Transaction(doc, "Crear Armaduras Longitudinales"))
    {
        tx.Start();
        
        // 1. Obtener curvas paramétricas y esquinas del estribo transversal
        IList<Curve> stirrupCurves = transverseStirrup.GetCenterlineCurves(
            false, false, false, MultiplanarFreeFormCalculationOptions.Default, 0
        );

        // 2. Definir los puntos de inserción longitudinal en las esquinas internas del estribo
        foreach (Curve curve in stirrupCurves)
        {
            XYZ cornerPoint = curve.GetEndPoint(0);
            XYZ normalVector = curve.CreateReversed().GetEndPoint(0).Normalize();

            // 3. Crear barra longitudinal vinculada paramétricamente a la posición del estribo
            Rebar longitudinalBar = Rebar.CreateFromRebarShape(
                doc,
                longitudinalShape,
                transverseStirrup.BarType,
                hostElement,
                cornerPoint,
                normalVector,
                XYZ.BasisZ
            );

            // 4. Asignar regla de distribución y acoplamiento asociativo
            longitudinalBar.SetLayoutAsFixedNumber(4, 0.0, true, true, true);
        }

        tx.Commit();
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

  const shareUrl = getShareUrl("/blog/revit-2027-armaduras-longitudinales-transversales");
  const shareTitle = encodeURIComponent(isEn ? "Revit 2027: Automated Generation of Longitudinal Rebar from Transverse Reinforcement" : "Revit 2027: Generación Automática de Armaduras Longitudinales desde Elementos Transversales");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "Revit 2027: Automated Generation of Longitudinal Rebar from Transverse Reinforcement" : "Revit 2027: Armaduras Longitudinales desde Elementos Transversales"}
        description={isEn ? "Technical analysis of Revit 2027: automated placement and alignment of longitudinal bars referenced directly against existing stirrups, ties, and spirals." : "Análisis técnico de Revit 2027: colocación y ajuste automático de barras longitudinales tomando como referencia estribos, zunchos y espirales existentes."}
        path="/blog/revit-2027-armaduras-longitudinales-transversales"
      />
      {/* Barra de Progreso de Lectura */}
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
              <i className="fa-solid fa-cubes mr-1" /> Revit 2027 · Armaduras
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 15 Ago 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "7 min read" : "7 min lectura"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            {isEn ? "Revit 2027: Automated Generation of Longitudinal Rebar from Transverse Reinforcement" : (
              <>Revit 2027: Generación Automática de Armaduras Longitudinales desde <span className="text-cyan-400">Elementos Transversales</span></>
            )}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isEn ? "Technical analysis of Revit 2027: automated placement and alignment of longitudinal bars referenced directly against existing stirrups, ties, and spirals." : (
              <>Análisis profundo de la nueva función de Revit 2027: colocación asociativa de barras de refuerzo longitudinales tomando como referencia las esquinas internas de estribos, zunchos y espirales en columnas, vigas, cabezales y pilas de fundación.</>
            )}
          </p>

          {/* Badge Fuente Oficial */}
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-300 shadow-lg">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <i className="fa-solid fa-link text-xs" /> Fuente Oficial:
            </span>
            <a
              href="https://help.autodesk.com/view/RVT/2027/ENU/?guid=GUID-B46831F5-A550-4888-8560-3D3FCC95D653"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 transition-colors inline-flex items-center gap-1 text-xs sm:text-sm"
            >
              Autodesk Help — Structural Reinforcement in Revit 2027
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <article className="max-w-4xl mx-auto px-4 py-12 text-slate-200 leading-relaxed font-sans">
        {/* RESUMEN EJECUTIVO BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-cyan-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
              <i className="fa-solid fa-bullseye text-lg" />
            </div>
            <h3 className="text-white font-bold text-base mb-1">Alineación Precisa</h3>
            <p className="text-slate-400 text-sm">
              Barras longitudinales encajadas automáticamente en los doblados y esquinas de estribos y espirales.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-blue-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
              <i className="fa-solid fa-link text-lg" />
            </div>
            <h3 className="text-white font-bold text-base mb-1">Asociatividad Viva</h3>
            <p className="text-slate-400 text-sm">
              Al modificar el diámetro o recubrimiento del estribo, las barras longitudinales ajustan su posición de inmediato.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-indigo-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
              <i className="fa-solid fa-bolt text-lg" />
            </div>
            <h3 className="text-white font-bold text-base mb-1">Reducción de Tiempos</h3>
            <p className="text-slate-400 text-sm">
              Reduce hasta un 70% el trabajo manual de desfases y restricciones (Rebar Constraints) en detallado de hormigón.
            </p>
          </div>
        </div>

        {/* SECCIÓN 1: EL DESAFÍO HISTÓRICO */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 text-base font-mono">1</span>
            El Desafío Tradicional en el Detallado de Armaduras
          </h2>
          <p className="mb-4 text-slate-300">
            En versiones anteriores de Revit, detallar columnas, vigas y pilas de hormigón armado requería un proceso de dos pasos desconectados: primero se insertaba la barra o conjunto de barras longitudinales haciendo referencia a los planos del elemento anfitrión (Host Planes) o a los recubrimientos (Cover Reference), y posteriormente se agregaban los estribos transversales.
          </p>
          <p className="mb-6 text-slate-300">
            Esto generaba constantes desalineaciones geométricas cuando variaban los diámetros de los estribos o los radios de doblado (Bend Radius), obligando al proyectista a ajustar manualmente las restricciones (<em>Edit Constraints</em>) barra por barra.
          </p>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm flex gap-3 items-start mb-6">
            <i className="fa-solid fa-triangle-exclamation text-amber-400 text-base mt-0.5" />
            <div>
              <strong>Problema común en versiones previas:</strong> Al cambiar un estribo de Ø10 mm a Ø12 mm en una viga, las armaduras longitudinales no detectaban el cambio de espesor del estribo, quedando desplazadas o chocando con la geometría del acero transversal.
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: LA NUEVA METODOLOGÍA EN REVIT 2027 */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 text-base font-mono">2</span>
            La Solución en Revit 2027: Selección desde Elementos Transversales
          </h2>
          <p className="mb-4 text-slate-300">
            Revit 2027 invierte el flujo de trabajo: ahora es posible **seleccionar directamente un estribo transversal existente** (ya sea cerrado, en U, zuncho helicoidal o espiral) y utilizar sus vértices e intersecciones internas como plano y punto de referencia para la generación automática de la armadura longitudinal.
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-list-check" /> Pasos Clave del Nuevo Flujo en la Interfaz:
            </h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">1.</span>
                <span>Selecciona el comando <strong>Rebar</strong> en la pestaña <em>Structure</em>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">2.</span>
                <span>Elige la opción <strong>Placement Method ➔ Reference Transverse Bar</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">3.</span>
                <span>Haz clic sobre cualquier estribo existente. Revit resaltará los puntos de las esquinas e intersecciones disponibles.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">4.</span>
                <span>Define la regla de distribución (<em>Single, Fixed Number, Maximum Spacing</em>) y las barras se ajustarán dinámicamente al contorno interior del estribo.</span>
              </li>
            </ul>
          </div>

          {/* FIGURA 1: REVIT 2027 REBAR LONGITUDINAL */}
          <figure className="my-8 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img
              src={asset("/assets/img/blog/news/revit_2027_rebar_longitudinal.png")}
              alt="Generación automática de armaduras longitudinales sobre estribos en Revit 2027"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
              <i className="fa-solid fa-camera mr-1 text-cyan-400" /> {isEn ? "Figure 1:" : "Figura 1:"} Interfaz de Revit 2027 mostrando la colocación asociativa de barras longitudinales guiadas por los vértices de estribos en columnas y vigas de hormigón armado.
            </figcaption>
          </figure>
        </section>

        {/* SECCIÓN 3: CUADRO COMPARATIVO */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 text-base font-mono">3</span>
            Comparativa: Método Tradicional vs. Revit 2027
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 border-collapse border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-900 text-cyan-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Característica</th>
                  <th className="p-3">Método Tradicional (Revit &lt; 2027)</th>
                  <th className="p-3">Nuevo Método Revit 2027</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                <tr>
                  <td className="p-3 font-semibold text-white">Referencia Principal</td>
                  <td className="p-3 text-slate-400">Cara externa del elemento anfitrión (Host Cover)</td>
                  <td className="p-3 text-cyan-300 font-medium">Esquinas internas del estribo transversal</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Ajuste al cambiar Diámetro</td>
                  <td className="p-3 text-slate-400">Manual (Requiere Edit Constraints)</td>
                  <td className="p-3 text-cyan-300 font-medium">Automático e Instantáneo</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Secciones Circulares / Espirales</td>
                  <td className="p-3 text-slate-400">Complejo cálculo de radio polar</td>
                  <td className="p-3 text-cyan-300 font-medium">Distribución tangencial perfecta en zunchos</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Compatibilidad Revit API</td>
                  <td className="p-3 text-slate-400">Basado en RebarShape & HostFace</td>
                  <td className="p-3 text-cyan-300 font-medium">Método asociativo directo C# / Python</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECCIÓN 4: IMPLEMENTACIÓN EN REVIT API C# */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 text-base font-mono">4</span>
            Automatización vía Revit API C#
          </h2>
          <p className="mb-4 text-slate-300">
            Para los desarrolladores de Add-ins y scripts en pyRevit, la API de Revit 2027 expone los métodos necesarios para consultar las curvas geométricas de elementos transversales y generar armaduras asociativas de forma programática.
          </p>

          <CodeBlock
            code={csCode}
            language="csharp"
            title="Revit 2027 API C# — Longitudinal Rebar from Transverse Reference"
          />
        </section>

        {/* SECCIÓN 5: CONCLUSIÓN Y RECOMENDACIONES */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 text-base font-mono">5</span>
            Conclusión e Impacto en Producción
          </h2>
          <p className="mb-4 text-slate-300">
            La posibilidad de generar armadura longitudinal referenciando elementos transversales representa uno de los avances más esperados por calculistas y detalladores de estructuras de hormigón armado. Elimina horas de ajuste de restricciones manuales y garantiza planillas de enfierradura sin colisiones entre barras principales y estribos.
          </p>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-blue-950/80 to-slate-900 border border-cyan-500/30 text-slate-200 mt-6 shadow-xl">
            <h4 className="text-lg font-bold text-cyan-400 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb" /> Recomendación del Proyectista:
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Si estás migrando tus proyectos a Revit 2027, estandariza tus familias de estribos con los nuevos parámetros de esquina interna. Esto te permitirá crear plantillas de colocación asociativa que automatizarán el armado de columnas y vigas tipo en cuestión de segundos.
            </p>
          </div>
        </section>

        {/* SECCIÓN: FUENTES Y ENLACES OFICIALES */}
        <section className="mb-12 p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-link text-cyan-400" />
            Fuentes Oficiales y Documentación de Autodesk
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://help.autodesk.com/view/RVT/2027/ENU/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 text-sm group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-book-open" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>Autodesk Help Portal</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500" />
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  Documentación Técnica Oficial de Revit 2027
                </div>
              </div>
            </a>

            <a
              href="https://help.autodesk.com/view/RVT/2027/ENU/?guid=GUID-B46831F5-A550-4888-8560-3D3FCC95D653"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/50 transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400 text-sm group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-book" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors flex items-center justify-between">
                  <span>Autodesk Help Revit 2027</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500" />
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  Reinforcement Elements & Transverse References
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* COMPARTIR Y TAGS */}
        <div className="border-t border-slate-800 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Etiquetas:</span>
            <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-700">Revit 2027</span>
            <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-700">Armaduras</span>
            <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-700">Enfierraduras</span>
            <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-700">Revit API</span>
          </div>

          <ShareArticle shareUrl={shareUrl} shareTitle={shareTitle} />
        </div>
      </article>
    </div>
  );
}
