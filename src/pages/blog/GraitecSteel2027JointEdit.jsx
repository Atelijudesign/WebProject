import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export default function GraitecSteel2027JointEdit() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  const jointConfigCode = `// Advance Steel / Graitec Multi-Joint Update Script
using AstApi = Autodesk.AdvanceSteel.API;

public void MultiUpdateBolts(List<AstApi.JointHeader> joints, string newBoltGrade, double newDiameter)
{
    foreach (var joint in joints)
    {
        if (joint.IsMaster || joint.IsGroupSlave)
        {
            joint.SetBoltGrade(newBoltGrade);
            joint.SetBoltDiameter(newDiameter);
            joint.UpdateJointGeometry();
        }
    }
    System.Console.WriteLine($"[Graitec 2027] Actualizadas {joints.Count} uniones a grado {newBoltGrade}.");
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

  const shareUrl = getShareUrl("/blog/graitec-steel-2027-joint-multi-edit");
  const shareTitle = encodeURIComponent(isEn ? "Graitec STEEL 2027 / Advance Steel: Joint Multi-Edit and Joint Groups" : "Graitec STEEL 2027 / Advance Steel: Edición Multicriterio de Conexiones (Joint Multi-Edit)");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "Graitec STEEL 2027 / Advance Steel: Joint Multi-Edit and Joint Groups" : "Graitec STEEL 2027 / Advance Steel: Edición Multicriterio de Conexiones"}
        description={isEn ? "The Graitec STEEL 2027 suite for Advance Steel introduces Joint Multi-Edit and Joint Groups, enabling bulk parameter updates across multiple structural steel connections." : "Graitec STEEL 2027 introduce Joint Multi-Edit para edición masiva de conexiones de acero estructural."}
        path="/blog/graitec-steel-2027-joint-multi-edit"
      />
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 z-50 transition-all duration-100"
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
            <span className="bg-orange-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-gears mr-1" /> Graitec STEEL 2027 · Advance Steel
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 28 May 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "8 min read" : "8 min lectura"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            {isEn ? "Graitec STEEL 2027 / Advance Steel: Joint Multi-Edit and Joint Groups" : (
              <>Graitec STEEL 2027 / Advance Steel: Edición Multicriterio de Conexiones <span className="text-orange-400 font-mono">(Joint Multi-Edit)</span></>
            )}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isEn ? "The Graitec STEEL 2027 suite for Advance Steel introduces Joint Multi-Edit and Joint Groups, enabling bulk parameter updates across multiple structural steel connections." : (
              <>La suite Graitec STEEL 2027 compatible con Advance Steel 2026 y 2027 revoluciona la gestión de estructuras metálicas masivas introduciendo <em>Joint Multi-Edit</em> y <em>Joint Groups</em> para cambios paramétricos en masa.</>
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://graitec.com/us/products/graitec-steel/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-orange-400 font-bold shadow-lg hover:text-orange-300"
            >
              <i className="fa-solid fa-link" /> Graitec STEEL Product Page
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
            <a
              href="https://graitec.com/uk/blog/whats-new-in-graitec-steel-for-advance-steel/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-cyan-400 font-bold shadow-lg hover:text-cyan-300"
            >
              <i className="fa-solid fa-newspaper" /> Blog Post Graitec
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-12 bg-[#0b1220]/70 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">

          <div className="glass-card rounded-2xl p-8 md:p-10 border border-orange-500/20 bg-orange-950/20 mb-10 shadow-lg">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-star text-yellow-400" /> Innovaciones Destacadas
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm mb-0">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-object-group text-orange-400 mt-1" />
                <span><strong className="text-white">Joint Groups:</strong> Agrupación lógica de conexiones apernadas/soldadas en naves industriales sin importar variaciones menores de perfiles.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-bolt-lightning text-amber-400 mt-1" />
                <span><strong className="text-white">Joint Multi-Edit:</strong> Modificación masiva de pernos A325/A490, espesores de cartelas y rigidez en cientos de uniones.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-shield text-yellow-400 mt-1" />
                <span><strong className="text-white">Detección de Colisiones:</strong> Verificación de interferencias de pernos con alas de vigas antes de aplicar el cambio masivo.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-clock-rotate-left text-cyan-400 mt-1" />
                <span><strong className="text-white">Ahorro de Tiempo:</strong> Edición de 500 conexiones de momento en menos de 30 segundos.</span>
              </li>
            </ul>
          </div>

          <figure className="my-8 rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img
              src={asset("/assets/img/blog/news/graitec_steel_joint_multiedit.png")}
              alt="Graitec STEEL 2027 Joint Multi Edit"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
              <i className="fa-solid fa-camera mr-1" /> {isEn ? "Figure 1:" : "Figura 1:"} Interfaz de edición multicriterio de uniones paramétricas en Graitec STEEL 2027 para Advance Steel.
            </figcaption>
          </figure>

          {/* Section 1 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-orange-600/20 text-orange-400 rounded-lg text-lg">🔩</span>
              1. Optimización en Estructuras de Acero Pesadas
            </h3>
            <p className="text-slate-300 leading-relaxed">
              En el detallado de estructuras de acero con Advance Steel, cuando el calculista o revisor estructural solicita modificar el diámetro de pernos de 3/4" A325 a 7/8" A490 o aumentar el espesor de la placa de cabeza de 16mm a 20mm en una nave industrial con más de 300 conexiones columna-viga, el dibujante solía tener que modificar cada caja de unión (<code className="bg-slate-900 text-orange-300 px-2 py-1 rounded font-mono text-xs">Joint Box</code>) o propagar manualmente las propiedades una por una.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Con <strong className="text-white">Graitec STEEL 2027</strong>, la función <strong className="text-orange-400">Joint Multi-Edit</strong> permite seleccionar múltiples conexiones apernadas o soldadas heterogéneas, filtrar atributos compartidos y aplicar cambios masivos con un solo clic.
            </p>
          </div>

          {/* Section 2 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-amber-600/20 text-amber-400 rounded-lg text-lg">⚡</span>
              2. Creación de Joint Groups Inteligentes
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              La herramienta <strong className="text-white">Joint Groups</strong> asigna un rol maestro a una conexión estándar. Si la conexión maestra sufre cambios de ingeniería, todas las conexiones dependientes del grupo heredan inmediatamente la geometría de platinas, cordones de soldadura y patrones de agujeros, reduciendo drásticamente las revisiones de plano de fabricación.
            </p>
            <CodeBlock code={jointConfigCode} language="csharp" filename="GraitecJointGroupManager.cs" />
          </div>

          {/* Conclusion */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-orange-500">
            <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb text-yellow-400" /> Impacto en el Negocio
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-0">
              Para maestranzas y oficinas de ingeniería de detalle de acero, Graitec STEEL 2027 elimina cuellos de botella en la fase de revisión estructural, acortando los plazos de entrega de planos de taller (*Shop Drawings*) y entregables CNC para perforadoras automatizadas.
            </p>
          </div>

        </div>
      </section>

      {/* SHARE */}{/* ─── SHARE BUTTONS ─── */}
      <ShareArticle url={shareUrl} title={shareTitle} />
    </div>
  );
}
