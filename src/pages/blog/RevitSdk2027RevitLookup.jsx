import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export default function RevitSdk2027RevitLookup() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  const sdkCode = `// Consulta típica de propiedades en C# usando Revit SDK 2027.2
using Autodesk.Revit.DB;

public double GetRebarTotalMass(Document doc, ElementId selectedId)
{
    Element elem = doc.GetElement(selectedId);
    Parameter massParam = elem.get_Parameter(BuiltInParameter.REBAR_TOTAL_MASS);
    
    if (massParam != null && massParam.HasValue)
    {
        return massParam.AsDouble(); // Valor en kilogramos (kg)
    }
    return 0.0;
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

  const shareUrl = getShareUrl("/blog/revit-sdk-2027-2-revitlookup");
  const shareTitle = encodeURIComponent(isEn ? "Revit .NET SDK 2027.2 and Official RevitLookup GitHub Repository" : "Revit SDK 2027.2 & RevitLookup: Herramientas Clave para Desarrolladores BIM");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "Revit .NET SDK 2027.2 and Official RevitLookup GitHub Repository" : "Revit SDK 2027.2 & RevitLookup: Herramientas Clave para Desarrolladores BIM"}
        description={isEn ? "Official Revit .NET SDK updated to version 2027.2 alongside the release of the updated RevitLookup version on GitHub for deep inspection of model database and geometry." : "Guía completa del Revit SDK 2027.2 y RevitLookup actualizado para inspección de propiedades y desarrollo de plugins."}
        path="/blog/revit-sdk-2027-2-revitlookup"
      />
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 z-50 transition-all duration-100"
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
            <span className="bg-purple-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-code mr-1" /> Revit .NET SDK 2027.2 · RevitLookup
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 02 May 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "8 min read" : "8 min lectura"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            {isEn ? "Revit .NET SDK 2027.2 and Official RevitLookup GitHub Repository" : (
              <>Revit .NET SDK 2027.2 y Repositorio Oficial <span className="text-purple-400">RevitLookup</span></>
            )}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isEn ? "Official Revit .NET SDK updated to version 2027.2 alongside the release of the updated RevitLookup version on GitHub for deep inspection of model database and geometry." : (
              <>Actualización del SDK oficial de Revit .NET a la versión 2027.2 y lanzamiento de la nueva versión de RevitLookup en GitHub para inspección profunda de la base de datos de elementos, geometrías y parámetros.</>
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://aps.autodesk.com/developer/overview/revit-api"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-purple-400 font-bold shadow-lg hover:text-purple-300"
            >
              <i className="fa-solid fa-link" /> Autodesk Platform Services (APS)
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
            <a
              href="https://github.com/topics/revit?o=desc&s=updated"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-cyan-400 font-bold shadow-lg hover:text-cyan-300"
            >
              <i className="fa-brands fa-github" /> GitHub Revit Topics
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-12 bg-[#0b1220]/70 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">

          <div className="glass-card rounded-2xl p-8 md:p-10 border border-purple-500/20 bg-purple-950/20 mb-10 shadow-lg">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-star text-yellow-400" /> Novedades para Desarrolladores BIM
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm mb-0">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-database text-purple-400 mt-1" />
                <span><strong className="text-white">Inspección de Jerarquías API:</strong> Exploración interactiva del modelo de objetos de Revit (Document, FamilyInstance, GeometryElement).</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-cubes-stacked text-indigo-400 mt-1" />
                <span><strong className="text-white">Nuevos Métodos SDK 2027.2:</strong> Clases para extracción de enfierradura 3D directa y atributos de carbono embebido EC3.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-brands fa-github text-cyan-400 mt-1" />
                <span><strong className="text-white">RevitLookup GitHub:</strong> Actualización comunitaria mantenida por la comunidad open-source de Autodesk.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-bug text-emerald-400 mt-1" />
                <span><strong className="text-white">Depuración Rápida:</strong> Evaluación de propiedades de elementos sin necesidad de adjuntar el depurador de Visual Studio.</span>
              </li>
            </ul>
          </div>

          <figure className="my-8 rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img
              src={asset("/assets/img/blog/news/revit_sdk_2027_lookup.png")}
              alt="Revit SDK 2027 y RevitLookup"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
              <i className="fa-solid fa-camera mr-1" /> {isEn ? "Figure 1:" : "Figura 1:"} Inspección de base de datos de elementos y propiedades geométricas con RevitLookup 2027.2.
            </figcaption>
          </figure>

          {/* Section 1 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-purple-600/20 text-purple-400 rounded-lg text-lg">🔍</span>
              1. RevitLookup: La Herramienta Indispensable del Programador BIM
            </h3>
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-white">RevitLookup</strong> es el Add-In interactivo indispensable para cualquier programador de la Revit API (C# / .NET / Python). Permite seleccionar cualquier elemento en la pantalla de Revit y desplegar un árbol de inspección con todas sus propiedades, métodos, parámetros compartidos e identificadores únicos (<code className="bg-slate-900 text-purple-300 px-2 py-1 rounded font-mono text-xs">UniqueId</code>).
            </p>

            <CodeBlock code={sdkCode} language="csharp" filename="RevitSdkPropertyInspector.cs" />
          </div>

          {/* Conclusion */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-purple-500">
            <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb text-yellow-400" /> Recomendación para Desarrolladores
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-0">
              Mantener actualizado el SDK 2027.2 y RevitLookup desde el repositorio oficial de GitHub es la mejor forma de asegurar la compatibilidad de Add-Ins de C# y scripts de pyRevit ante cambios en las firmas de métodos de Autodesk.
            </p>
          </div>

        </div>
      </section>

      {/* SHARE */}{/* ─── SHARE BUTTONS ─── */}
      <ShareArticle url={shareUrl} title={shareTitle} />
    </div>
  );
}
