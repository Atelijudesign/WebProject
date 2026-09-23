import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export default function Revit2025ApiNet8() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  const csharpCode = `// Ejemplo de uso con C# 12 y .NET 8 en Revit 2025
public void GetBeams(Document doc)
{
    // Uso de colecciones modernas
    List<Element> beams = [.. new FilteredElementCollector(doc)
        .OfCategory(BuiltInCategory.OST_StructuralFraming)
        .WhereElementIsNotElementType()
        .ToElements()];
        
    TaskDialog.Show("Revit 2025", $"Se encontraron {beams.Count} vigas ultra rápido.");
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

  const shareUrl = getShareUrl("/blog/revit-2025-api-net8");
  const shareTitle = encodeURIComponent(isEn ? "Revit 2025 & .NET 8: The Architectural Leap for BIM Developers" : "Revit 2025 y .NET 8: El Salto Arquitectónico para BIM Devs");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "Revit 2025 & .NET 8: The Architectural Leap for BIM Developers" : "Revit 2025 y .NET 8: El Salto Arquitectónico"}
        description={isEn ? "The Revit 2025 API abandons .NET Framework to embrace modern .NET 8, delivering massive performance gains while requiring developers to migrate their C# Add-ins." : "La API de Revit 2025 abandona .NET Framework para abrazar .NET 8. Todo sobre los Breaking Changes, rendimiento, y cómo migrar tus Add-ins C#."}
        path="/blog/revit-2025-api-net8"
      />
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-cyan-500 via-blue-400 to-indigo-500 z-50 transition-all duration-100"
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
            <span className="bg-cyan-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-code mr-1" /> C# · Revit API
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 12 Ago 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "5 min read" : "5 min lectura"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            {isEn ? "Revit 2025 & .NET 8: The Architectural Leap for BIM Developers" : (
              <>Revit 2025 y <span className="text-cyan-400">.NET 8</span>: El Salto Arquitectónico</>
            )}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isEn ? "The Revit 2025 API abandons .NET Framework to embrace modern .NET 8, delivering massive performance gains while requiring developers to migrate their C# Add-ins." : (
              <>La industria del desarrollo sobre Autodesk Revit acaba de recibir la noticia más impactante de la década: el abandono del clásico .NET Framework 4.8.</>
            )}
          </p>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="py-12 px-4 max-w-3xl mx-auto text-slate-300 leading-relaxed space-y-8">
        
        {/* FIGURA 1: REVIT 2025 API .NET 8 ARCHITECTURE */}
        <figure className="my-8 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
          <img 
            src={asset("/assets/img/blog/news/revit_2025_api_net8_architecture.png")} 
            alt="Arquitectura de migración de Revit 2025 API a Microsoft .NET 8" 
            className="w-full h-auto object-cover"
            loading="lazy"
          />
          <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
            <i className="fa-solid fa-camera mr-1 text-cyan-400" /> {isEn ? "Figure 1:" : "Figura 1:"} Diagrama de migración tecnológica de Autodesk Revit 2025 API de .NET Framework 4.8 a .NET 8 (net8.0-windows) con soporte para C# 12 y garbage collection optimizado.
          </figcaption>
        </figure>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">¿Por qué es importante este cambio?</h2>
          <p className="mb-4">
            Durante años, los desarrolladores de plugins de Revit, C# y Dynamo han estado atados a .NET Framework. Si bien era estable, carecía de las mejoras de rendimiento masivas introducidas en .NET Core y sus versiones sucesoras.
          </p>
          <p className="mb-4">
            Con la llegada de <strong>.NET 8</strong>, los tiempos de ejecución de cálculos pesados (como interferencias geométricas complejas, lectura de parámetros masivos y cubicaciones) se reducen drásticamente. Sin embargo, este cambio no es un simple "actualizar versión". Representa un "Breaking Change" masivo. Cientos de métodos obsoletos han sido purgados.
          </p>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl">
           <h3 className="text-xl font-bold text-cyan-400 mb-3"><i className="fa-solid fa-triangle-exclamation mr-2"></i>Breaking Changes</h3>
           <p className="text-sm">
             Asegúrate de revisar la documentación oficial de la API de Autodesk. Muchos métodos obsoletos han sido removidos permanentemente. Las dependencias de terceros (como librerías de UI o Excel) que no soporten .NET Standard 2.0 o superior, simplemente fallarán.
           </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Características Clave del Nuevo Entorno</h2>
          <ul className="list-disc pl-5 space-y-3">
            <li><strong className="text-cyan-300">Rendimiento C# (C-Sharp 12):</strong> Ahora puedes usar constructores primarios y expresiones de colección.</li>
            <li><strong className="text-cyan-300">Seguridad Mejorada:</strong> Respaldado por la arquitectura de soporte a largo plazo (LTS) de Microsoft.</li>
            <li><strong className="text-cyan-300">RevitLookup 2025:</strong> La herramienta ya fue migrada; debes instalar la versión específica para esta arquitectura.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Código de Ejemplo (C# 12)</h2>
          <p className="mb-4">
            Al tener soporte para C# 12, podemos limpiar mucho código redundante. Mira cómo obtener vigas con las nuevas características de lenguajes:
          </p>
          <CodeBlock
            code={csharpCode}
            language="csharp"
            title="GetBeams.cs"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">{isEn ? "Action Summary for BIM Devs" : "Resumen de Acciones para BIM Devs"}</h2>
          <ol className="list-decimal pl-5 space-y-3">
            <li>Actualiza tu Visual Studio a 2022 (Versión 17.8 o superior).</li>
            <li>Modifica el archivo <code>.csproj</code> cambiando el TargetFramework a <code>net8.0-windows</code>.</li>
            <li>Revisa las librerías NuGet. Busca alternativas modernas si las tuyas no soportan el nuevo framework.</li>
          </ol>
        </div>

        {/* SECCIÓN: FUENTES Y ENLACES OFICIALES */}
        <section className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 my-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-link text-cyan-400" />{isEn ? "Official Sources & Migration Documentation" : "Fuentes Oficiales y Documentación de Migración"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://github.com/jeremytammik/RevitLookup"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 text-sm group-hover:scale-110 transition-transform">
                <i className="fa-brands fa-github" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>RevitLookup (GitHub Oficial)</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500" />
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  Herramienta de Exploración BIM migrada a .NET 8
                </div>
              </div>
            </a>

            <a
              href="https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/50 transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-indigo-950/60 text-indigo-400 text-sm group-hover:scale-110 transition-transform">
                <i className="fa-brands fa-microsoft" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                  <span>Microsoft Learn .NET 8</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500" />
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  What's New in .NET 8 Runtime & C# 12
                </div>
              </div>
            </a>
          </div>
        </section>



        {/* SHARE */}
        <ShareArticle url={shareUrl} title={shareTitle} />
      </section>
    </div>
  );
}
