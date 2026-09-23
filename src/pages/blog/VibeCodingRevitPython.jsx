import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";
import { useTranslation } from "../../context/LanguageContext";

export default function VibeCodingRevitPython() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  const pyCode = `# Python script para pyRevit / RevitPythonShell
from Autodesk.Revit.DB import FilteredElementCollector, BuiltInCategory, Transaction
from pyrevit import revit, forms

doc = revit.doc
beams = (FilteredElementCollector(doc)
         .OfCategory(BuiltInCategory.OST_StructuralFraming)
         .WhereElementIsNotElementType()
         .ToElements())

total_vol_cu_ft = 0.0
for b in beams:
    param = b.LookupParameter("Volume")
    if param and param.HasValue:
        total_vol_cu_ft += param.AsDouble()

# Convertir de pies cúbicos a metros cúbicos / Convert cu ft to m3
vol_m3 = total_vol_cu_ft * 0.0283168
forms.alert("Volumen Total de Vigas: {:.2f} m3".format(vol_m3))`;

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

  const shareUrl = getShareUrl("/blog/vibe-coding-revit-python-shell-pyrevit");
  const shareTitle = encodeURIComponent(
    isEn
      ? "Hybrid Vibe Coding in Revit Python Shell and pyRevit: Instant Structural Automation"
      : "Vibe Coding en Revit Python Shell y pyRevit: Automatización Estructural Instantánea"
  );

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "Hybrid Vibe Coding in Revit Python Shell and pyRevit: Instant Structural Automation" : "Vibe Coding en Revit Python Shell y pyRevit: Automatización Estructural Instantánea"}
        description={isEn ? "Hands-on guide to Vibe Coding applied to Revit Python Shell and pyRevit for structural BIM automation with AI." : "Guía práctica de Vibe Coding aplicado a Revit Python Shell y pyRevit para automatización BIM estructural con inteligencia artificial."}
        path="/blog/vibe-coding-revit-python-shell-pyrevit"
      />
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-green-500 via-emerald-400 to-cyan-500 z-50 transition-all duration-100"
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
            <span className="bg-emerald-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-brands fa-python mr-1" /> Python · pyRevit · LLM Scripting
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 24 Abr 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "9 min read" : "9 min lectura"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            {isEn ? (
              <>Hybrid Scripting <span className="text-emerald-400">"Vibe Coding"</span> with Python Shell and pyRevit</>
            ) : (
              <>Scripting Híbrido <span className="text-emerald-400">"Vibe Coding"</span> con Python Shell y pyRevit</>
            )}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isEn
              ? "Growth of automation workflows combining Large Language Models (LLMs) with RevitPythonShell and pyRevit to generate Python code on the fly and test API methods in real time."
              : "Expansión de repositorios de automatización que combinan modelos de lenguaje (LLMs) con RevitPythonShell y pyRevit para generar código Python al vuelo y probar funciones de la API en tiempo real."}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/mitrofmep/Revit-API-scripts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-emerald-400 font-bold shadow-lg hover:text-emerald-300"
            >
              <i className="fa-brands fa-github" /> Revit API Scripts (mitrofmep)
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
            <a
              href="https://www.youtube.com/watch?v=4ydLzIr4-z4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-red-400 font-bold shadow-lg hover:text-red-300"
            >
              <i className="fa-brands fa-youtube" /> {isEn ? "Watch on YouTube" : "Ver Video en YouTube"}
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-12 bg-[#0b1220]/70 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">

          <div className="glass-card rounded-2xl p-8 md:p-10 border border-emerald-500/20 bg-emerald-950/20 mb-10 shadow-lg">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-yellow-400" /> {isEn ? "What is Vibe Coding in BIM Development?" : "¿Qué es el Vibe Coding en Desarrollo BIM?"}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-0">
              {isEn ? (
                <>The term <strong className="text-white">"Vibe Coding"</strong> refers to the practice where an engineer describes an automation requirement in plain natural language (e.g., <em>"Select all steel beams and calculate the total volume and weight sum"</em>) to an LLM, generating a Python script ready to execute inside Revit via <strong className="text-emerald-400">RevitPythonShell</strong> or packaged into <strong className="text-cyan-400">pyRevit</strong>.</>
              ) : (
                <>El término <strong className="text-white">"Vibe Coding"</strong> hace referencia a la técnica donde el ingeniero o proyectista describe en lenguaje natural una necesidad de automatización (ej. <em>"Selecciona todas las vigas de acero y calcula la suma total de volumen y peso"</em>) a un LLM, obteniendo un script de Python listo para ser ejecutado en tiempo real dentro de Revit mediante <strong className="text-emerald-400">RevitPythonShell</strong> o empaquetado en <strong className="text-cyan-400">pyRevit</strong>.</>
              )}
            </p>
          </div>

          <figure className="my-8 rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img
              src={asset("/assets/img/blog/news/vibe_coding_revit_python.png")}
              alt="Vibe Coding en Revit Python Shell"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
              <i className="fa-solid fa-camera mr-1" /> {isEn ? "Figure 1: Interactive prototyping of AI-generated Python scripts inside Revit Python Shell." : "Figura 1: Prototipado interactivo de scripts Python generados por IA en Revit Python Shell."}
            </figcaption>
          </figure>

          {/* Section 1 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg text-lg">🐍</span>
              {isEn ? "1. Sample Code: Parameter Auditing in 10 Seconds" : "1. Código de Ejemplo: Auditoría de Parámetros en 10 Segundos"}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {isEn
                ? "A Python script example that can be tested live with RevitPythonShell before deployment as a native button on the pyRevit ribbon:"
                : "Un ejemplo de script en Python que puede probarse en vivo con RevitPythonShell antes de desplegarse como botón nativo en la cinta de pyRevit:"}
            </p>

            <CodeBlock code={pyCode} language="python" filename="vibe_beam_audit.py" />
          </div>

          {/* Conclusion */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-emerald-500">
            <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb text-yellow-400" /> {isEn ? "Conclusion" : "Conclusión"}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-0">
              {isEn
                ? "Vibe Coding slashes custom tool and plugin creation from weeks to minutes for structural designers, allowing rapid validation of Revit API logic before full C# enterprise development."
                : "El Vibe Coding reduce de semanas a minutos la creación de plugins y herramientas a medida para proyectistas estructurales, permitiendo probar la lógica de la API de Revit de forma segura antes de realizar desarrollos en C#."}
            </p>
          </div>

        </div>
      </section>

      {/* SHARE BUTTONS */}
      <ShareArticle url={shareUrl} title={shareTitle} />
    </div>
  );
}
