import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export default function Revit2027RebarWeight() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  const ruleCode = `# Ejemplo de regla de nomenclatura en Rule-Based Numbering Revit 2027
# Formato: [Prefijo_Zona]-[Tipo_Elemento]-[Diámetro_mm]-[Secuencia_001]

def generate_rebar_mark(zone, element_type, diameter_mm, sequence_id):
    prefix = f"{zone}-{element_type}"
    dia_str = f"d{diameter_mm}"
    seq_str = f"{sequence_id:03d}"
    return f"{prefix}-{dia_str}-{seq_str}"

# Ejemplo generado: Z1-VIG-d16-042
rebar_mark = generate_rebar_mark("Z1", "VIG", 16, 42)
print("Marca de Enfierradura:", rebar_mark)`;

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

  const shareUrl = getShareUrl("/blog/revit-2027-peso-enfierradura-rule-numbering");
  const shareTitle = encodeURIComponent(isEn ? "Revit 2027: Automatic Rebar Weight Calculation and Rule-Based Numbering" : "Revit 2027: Cálculo Automático de Peso de Enfierradura y Rule-Based Numbering");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "Revit 2027: Automatic Rebar Weight Calculation and Rule-Based Numbering" : "Revit 2027: Cálculo Automático de Peso de Enfierradura y Rule-Based Numbering"}
        description={isEn ? "Native automatic calculation and display of rebar mass in element properties, schedules, and tags, alongside the Rule-Based Numbering engine for standardizing component marks." : "Revit 2027 incorpora cálculo de peso nativo para enfierraduras y Rule-Based Numbering para nomenclatura automática de barras."}
        path="/blog/revit-2027-peso-enfierradura-rule-numbering"
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
              <i className="fa-solid fa-calculator mr-1" /> Revit 2027 · Cubicaciones Estructurales
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 10 Jun 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "7 min read" : "7 min lectura"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            {isEn ? "Revit 2027: Automatic Rebar Weight Calculation and Rule-Based Numbering" : (
              <>Revit 2027: Cálculo Automático de <span className="text-cyan-400">Peso de Enfierradura</span> y Numeración por Reglas</>
            )}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isEn ? "Native automatic calculation and display of rebar mass in element properties, schedules, and tags, alongside the Rule-Based Numbering engine for standardizing component marks." : (
              <>Analizamos la incorporación del parámetro nativo de masa de enfierradura en propiedades, planillas y etiquetas, combinado con el nuevo motor <em>Rule-Based Numbering</em> para la estandarización automatizada de códigos de armadura.</>
            )}
          </p>

          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-300 shadow-lg">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <i className="fa-solid fa-link text-xs" /> Fuente Oficial:
            </span>
            <a
              href="https://help.autodesk.com/view/RVT/2027/ENU/?guid=GUID-C81929D7-02CB-4BF7-A637-9B98EC9EB38B"
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

      {/* CONTENT */}
      <section className="py-12 bg-[#0b1220]/70 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">

          {/* Key Highlights */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-cyan-500/20 bg-cyan-950/20 mb-10 shadow-lg">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-star text-yellow-400" /> Novedades Clave en Cubicaciones
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm mb-0">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-weight-hanging text-cyan-400 mt-1" />
                <span><strong className="text-white">Parámetro Nativo Rebar Mass:</strong> Masa en kg/m o tonelaje total calculado según densidad del acero sin fórmulas manuales.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-list-ol text-blue-400 mt-1" />
                <span><strong className="text-white">Rule-Based Numbering:</strong> Asignación automática de marcas de armadura basadas en prefijos por zona o diámetro.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-table-cells text-indigo-400 mt-1" />
                <span><strong className="text-white">Schedules Inteligentes:</strong> Tablas de planificación con cálculo de residuos de corte y totales por nivel.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-tag text-emerald-400 mt-1" />
                <span><strong className="text-white">Etiquetas Dinámicas:</strong> Tags de armadura que muestran la masa unitaria y total por conjunto.</span>
              </li>
            </ul>
          </div>

          <figure className="my-8 rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img
              src={asset("/assets/img/blog/news/revit_2027_rebar_weight.png")}
              alt="Cálculo de masa y Rule Based Numbering en Revit 2027"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
              <i className="fa-solid fa-camera mr-1" /> {isEn ? "Figure 1:" : "Figura 1:"} Despliegue de la masa de enfierradura en tablas de planificación y numeración inteligente por reglas.
            </figcaption>
          </figure>

          {/* Section 1 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-blue-600/20 text-blue-400 rounded-lg text-lg">⚖️</span>
              1. Eliminando la Dependencia de Parámetros Calculados Manuales
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Anteriormente en Revit, para obtener el tonelaje total de enfierradura en un proyecto de hormigón armado, el especialista debía crear fórmulas manuales en las tablas de planificación multiplando el <code className="bg-slate-900 text-cyan-300 px-2 py-1 rounded font-mono text-xs">Total Bar Length</code> por un peso nominal en kg/m creado mediante parámetros compartidos (<code className="bg-slate-900 text-cyan-300 px-2 py-1 rounded font-mono text-xs">Shared Parameters</code>).
            </p>
            <p className="text-slate-300 leading-relaxed">
              En <strong className="text-white">Revit 2027</strong>, la masa de las barras (<code className="bg-slate-900 text-cyan-300 px-2 py-1 rounded font-mono text-xs">Bar Mass</code> y <code className="bg-slate-900 text-cyan-300 px-2 py-1 rounded font-mono text-xs">Total Rebar Mass</code>) se convierte en un atributo nativo de solo lectura calculado dinámicamente según la geometría exacta de la barra, los ganchos y la densidad lineal configurada en los tipos de barra (<code className="bg-slate-900 text-cyan-300 px-2 py-1 rounded font-mono text-xs">Rebar Bar Type</code>).
            </p>

            <div className="bg-slate-900/90 rounded-xl p-6 border border-slate-700/80 my-6">
              <h4 className="text-cyan-400 font-bold mb-2 text-sm flex items-center gap-2">
                <i className="fa-solid fa-square-check" /> Ventajas del Parámetro Nativo Rebar Mass:
              </h4>
              <ul className="space-y-2 text-xs text-slate-300 mb-0">
                <li>• <strong>Cálculo Automático de Ganchos:</strong> Incluye la longitud adicional de dobleces ACI 318 / NCh204 en la masa final.</li>
                <li>• <strong>Compatibilidad con IFC 4.3:</strong> Se exporta automáticamente bajo la propiedad estándar <code className="bg-slate-950 text-cyan-300 px-1.5 py-0.5 rounded font-mono">IfcReinforcingBar.Mass</code>.</li>
                <li>• <strong>Sin Errores de Redondeo:</strong> Precisión de doble flotante alineada con los estándares de cubicación de acero.</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg text-lg">🔢</span>
              2. Motor Rule-Based Numbering
            </h3>
            <p className="text-slate-300 leading-relaxed">
              El motor <strong className="text-white">Rule-Based Numbering</strong> permite a los coordinadores BIM establecer reglas de codificación de marcas de armadura basadas en atributos del anfitrión o de la barra.
            </p>

            <CodeBlock code={ruleCode} language="python" filename="rebar_rule_numbering.py" />

            <p className="text-slate-300 text-sm">
              Esto garantiza que cuando se agregan o eliminan barras en el modelo, la secuencia se renumere automáticamente sin generar duplicados ni dejar huecos en los planos de detallado.
            </p>
          </div>

          {/* Official Link Card */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-cyan-500/30 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <h4 className="text-white font-bold text-base mb-1">Documentación Oficial de Autodesk Help</h4>
              <p className="text-slate-400 text-xs mb-0">Consulta la guía técnica de parámetros de enfierradura y Rule-Based Numbering.</p>
            </div>
            <a
              href="https://help.autodesk.com/view/RVT/2027/ENU/?guid=GUID-C81929D7-02CB-4BF7-A637-9B98EC9EB38B"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-lg whitespace-nowrap flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-up-right-from-square" /> Ver en Autodesk Help
            </a>
          </div>

          {/* Conclusion */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-cyan-500">
            <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb text-yellow-400" />{isEn ? "Conclusion" : "Conclusión"}</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-0">
              La automatización de la cubicación de masa y el etiquetado inteligente en Revit 2027 elimina horas de configuración manual de parámetros compartidos, estandarizando la entrega de planillas de enfierradura para plantas de prefabricados y faenas de hormigonado.
            </p>
          </div>

        </div>
      </section>

      {/* SHARE */}{/* ─── SHARE BUTTONS ─── */}
      <ShareArticle url={shareUrl} title={shareTitle} />
    </div>
  );
}
