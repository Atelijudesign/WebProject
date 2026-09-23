import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export const RevitEdgeWebView2 = () => {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  const csharpCode = `// Inicialización limpia de WebView2 en un panel WPF para Revit Add-in
using System;
using System.IO;
using System.Text.Json;
using System.Windows.Controls;
using Microsoft.Web.WebView2.Core;
using Autodesk.Revit.UI;

public partial class ModernRevitPanel : UserControl
{
    private readonly ExternalEvent _externalEvent;
    private readonly RevitCommandHandler _handler;

    public ModernRevitPanel(ExternalEvent externalEvent, RevitCommandHandler handler)
    {
        InitializeComponent();
        _externalEvent = externalEvent;
        _handler = handler;
        InitializeWebView();
    }

    private async void InitializeWebView()
    {
        // Aislamiento estricto de UserDataFolder para evitar bloqueos entre add-ins
        string appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
        string userDataFolder = Path.Combine(appData, "MiEmpresa_BIM", "WebView2_Cache");
        Directory.CreateDirectory(userDataFolder);

        var environment = await CoreWebView2Environment.CreateAsync(null, userDataFolder);
        await webView.EnsureCoreWebView2Async(environment);

        // Configuración de seguridad y depuración
        webView.CoreWebView2.Settings.IsStatusBarEnabled = false;
        webView.CoreWebView2.Settings.AreDevToolsEnabled = true; // Activo en entorno DEV

        // Receptor de mensajes asíncronos desde el frontend React
        webView.CoreWebView2.WebMessageReceived += OnWebMessageReceived;

        // Cargar frontend local o URL de producción empaquetada
        string devUrl = "http://localhost:5173";
        string prodPath = Path.Combine(Path.GetDirectoryName(GetType().Assembly.Location), "wwwroot", "index.html");

        if (Environment.GetEnvironmentVariable("BIM_DEV_MODE") == "1")
            webView.CoreWebView2.Navigate(devUrl);
        else
            webView.CoreWebView2.Navigate(prodPath);
    }

    private void OnWebMessageReceived(object sender, CoreWebView2WebMessageReceivedEventArgs e)
    {
        try
        {
            var json = e.WebMessageAsJson;
            using var doc = JsonDocument.Parse(json);
            string action = doc.RootElement.GetProperty("action").GetString();

            if (action == "SELECT_ELEMENTS")
            {
                // Delegar al ExternalEvent para respetar el hilo de la Revit API
                _handler.CommandData = json;
                _externalEvent.Raise();
            }
        }
        catch (Exception ex)
        {
            TaskDialog.Show("Error WebView2", ex.Message);
        }
    }
}`;

  const reactHookCode = `// Hook en React / TypeScript para comunicarse con el Host C# de Revit
import { useEffect, useCallback } from 'react';

interface RevitMessage {
  action: string;
  payload?: unknown;
}

export function useRevitBridge(onCommandReceived?: (data: unknown) => void) {
  const isInsideRevit = typeof window !== 'undefined' && 'chrome' in window && (window as any).chrome?.webview;

  const sendToRevit = useCallback((action: string, payload?: unknown) => {
    if (isInsideRevit) {
      (window as any).chrome.webview.postMessage({ action, payload });
    } else {
      console.log('[Mock Revit Bridge]', action, payload);
    }
  }, [isInsideRevit]);

  useEffect(() => {
    if (!isInsideRevit) return;

    const handleMessage = (event: MessageEvent) => {
      if (onCommandReceived) {
        onCommandReceived(event.data);
      }
    };

    window.chrome.webview.addEventListener('message', handleMessage);
    return () => window.chrome.webview.removeEventListener('message', handleMessage);
  }, [isInsideRevit, onCommandReceived]);

  return { sendToRevit, isInsideRevit };
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

  const shareUrl = getShareUrl("/blog/revit-api-webview2-migracion-cefsharp");
  const shareTitle = encodeURIComponent(isEn ? "Revit API: Farewell CefSharp, Hello Native Microsoft Edge WebView2" : "Revit API: Adiós CefSharp, Hola Microsoft Edge WebView2 Nativo");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "Revit API: Farewell CefSharp, Hello Native Microsoft Edge WebView2" : "Revit API: Adiós CefSharp, Hola Microsoft Edge WebView2 Nativo"}
        description={isEn ? "Autodesk permanently removes CefSharp in favor of WebView2 in Revit. How to build web interfaces in React and Tailwind CSS for C# Add-ins without DLL conflicts." : "Autodesk descarta definitivamente CefSharp para adoptar Microsoft Edge WebView2 en Revit. Cómo crear interfaces React y Tailwind ultra veloces en C# sin conflictos de DLLs."}
        path="/blog/revit-api-webview2-migracion-cefsharp"
        keywords="Revit API, WebView2, CefSharp, C#, .NET 8, React, Tailwind CSS, Dockable Pane, Plugins Revit, BIM Development"
      />
      
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* HERO SECTION */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/60 transition-colors duration-300 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <Link to="/blog" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors inline-flex items-center gap-1">
              <i className="fa-solid fa-arrow-left text-xs" /> {isEn ? "Back to Blog" : "Volver al Blog"}
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-purple-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-code mr-1" /> Revit API · C#
            </span>
            <span className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-window-restore mr-1" /> WebView2 & React
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 28 Ago 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "7 min read" : "7 min lectura"}
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-mono">
              Revit 2026/2027 SDK
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 text-gradient-article">
            {isEn ? "Revit API: Farewell CefSharp, Hello Native Microsoft Edge WebView2" : (
              <>🌐 Revit API: Adiós <span className="text-red-400">CefSharp</span>, Hola <span className="text-purple-400">Edge WebView2</span> Nativo</>
            )}
          </h1>

          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {isEn ? "Autodesk permanently removes CefSharp in favor of WebView2 in Revit. How to build web interfaces in React and Tailwind CSS for C# Add-ins without DLL conflicts." : (
              <>El mayor quebradero de cabeza en la historia de los plugins de Revit ha sido eliminado. Analizamos la transición arquitectónica hacia Microsoft Edge WebView2 y cómo diseñar UIs modernas en React y Tailwind CSS conectadas en tiempo real al modelo BIM.</>
            )}
          </p>

          {/* BOTONES DE ENLACES OFICIALES / FUENTES */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://learn.microsoft.com/en-us/microsoft-edge/webview2/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-blue-400 font-bold shadow-lg hover:text-blue-300 hover:border-blue-500/60 transition-all"
            >
              <i className="fa-brands fa-microsoft" /> Doc Oficial: Microsoft Edge WebView2
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
            <a
              href="https://archi-lab.net/webview2-and-revits-dockable-panel/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-purple-400 font-bold shadow-lg hover:text-purple-300 hover:border-purple-500/60 transition-all"
            >
              <i className="fa-solid fa-book-bookmark" /> Guía: archi-lab WebView2 DockablePanel
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* STATS IMPACT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-red-400 font-mono text-3xl font-bold mb-1">0 Crash</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Fin del Conflicto de DLLs</div>
            <p className="text-slate-500 text-xs mt-2">Eliminación de choques binarios por distintas versiones de CefSharp entre add-ins corporativos.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-purple-400 font-mono text-3xl font-bold mb-1">Evergreen</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Runtime Desacoplado</div>
            <p className="text-slate-500 text-xs mt-2">Motor de Chromium actualizado y securizado automáticamente por el sistema operativo Windows.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-cyan-400 font-mono text-3xl font-bold mb-1">100% Web</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">React 19 + Tailwind CSS</div>
            <p className="text-slate-500 text-xs mt-2">Desarrollo con Hot Module Replacement (HMR) local y empaquetado ultra ligero para producción.</p>
          </div>
        </div>

        {/* SECCIÓN 1: EL FIN DE CEFSHARP */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-red-500/20 text-red-400 text-lg">⚠️</span>
            ¿Por qué Autodesk eliminó definitivamente CefSharp?
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-slate-300 leading-relaxed">
            <p>
              Durante años, cualquier programador que quisiera construir una interfaz moderna e interactiva dentro de Autodesk Revit se encontraba con un muro infranqueable: <strong>Windows Presentation Foundation (WPF)</strong> era lento de maquetar y carecía del rico ecosistema de librerías de componentes existentes en la web (como React, Tailwind, Lucide Icons, o visores 3D Three.js).
            </p>
            <p>
              La solución provisional fue adoptar <strong>CefSharp</strong> (el wrapper de Chromium Embedded Framework). Sin embargo, CefSharp sufría de una vulnerabilidad arquitectónica fatal: <em>solo puede coexistir una versión de las DLLs de Chromium por proceso de Revit</em>. Si el Add-in de la empresa A requería CefSharp versión 92 y el Add-in de la empresa B cargaba CefSharp versión 114, el segundo Add-in fallaba inmediatamente o, peor aún, provocaba el cierre abrupto (*Crash to Desktop*) de Revit al iniciar.
            </p>
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/50 text-purple-200 text-sm">
              <i className="fa-solid fa-circle-check mr-2 text-purple-400" />
              <strong>El estándar moderno:</strong> Desde Revit 2026/2027, Autodesk garantiza la inclusión del runtime de <code>Microsoft.Web.WebView2</code> en el entorno de ejecución, permitiendo a cada Add-in instanciar su propio proceso de renderizado web completamente aislado.
            </div>
          </div>

          {/* FIGURA 1: DIAGRAMA TÉCNICO ARQUITECTURA WEBVIEW2 */}
          <figure className="my-8 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img 
              src={asset("/assets/img/blog/news/revit_webview2_architecture.png")} 
              alt="Diagrama de arquitectura técnica de integración de Microsoft Edge WebView2 en Autodesk Revit API con C# y React" 
              className="w-full h-auto object-cover hover:scale-[1.01] transition-transform duration-300"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800 font-mono">
              <i className="fa-solid fa-camera mr-1 text-cyan-400" /> {isEn ? "Figure 1:" : "Figura 1:"} Arquitectura de integración de Revit API con Microsoft Edge WebView2 conectando el modelo DB C# con la interfaz React vía JSON-RPC sobre postMessage.
            </figcaption>
          </figure>
        </section>

        {/* SECCIÓN 2: IMPLEMENTACIÓN EN C# CON AISLAMIENTO DE PERFILES */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-lg">⚙️</span>
            Inicialización en C# con Aislamiento de Perfiles (UserDataFolder)
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-slate-300 leading-relaxed">
            <p>
              El error más recurrente al implementar WebView2 en un Add-in de Revit es instanciar el control sin especificar un directorio de datos de usuario personalizado. Si dos add-ins intentan escribir en la carpeta compartida por defecto al mismo tiempo, Windows bloqueará los archivos (*File Lock*) y la ventana web quedará en blanco.
            </p>
            <p>
              En el siguiente ejemplo técnico, inicializamos el entorno con una ruta única bajo <code>AppData/MiEmpresa_BIM</code> y configuramos el canal de escucha para despachar acciones a la base de datos de Revit a través de un <code>ExternalEvent</code>:
            </p>
          </div>

          <div className="mt-4">
            <CodeBlock
              code={csharpCode}
              language="csharp"
              title="ModernRevitPanel.xaml.cs"
            />
          </div>

          {/* FIGURA 2: DOCKABLE PANE EN ACCIÓN DENTRO DE REVIT */}
          <figure className="my-8 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img 
              src={asset("/assets/img/blog/news/revit_webview2_dockable_pane.png")} 
              alt="Panel acoplable Dockable Pane dentro de Autodesk Revit con interfaz React y telemetría de vigas" 
              className="w-full h-auto object-cover hover:scale-[1.01] transition-transform duration-300"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800 font-mono">
              <i className="fa-solid fa-camera mr-1 text-purple-400" /> {isEn ? "Figure 2:" : "Figura 2:"} Panel lateral acoplable (Dockable Pane) en Revit renderizado con WebView2, mostrando gráficos interactivos y telemetría en tiempo real.
            </figcaption>
          </figure>
        </section>

        {/* SECCIÓN 3: HOOK EN REACT / TYPESCRIPT */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-purple-500/20 text-purple-400 text-lg">💻</span>
            Frontend React: Hook <code>useRevitBridge</code>
          </h2>
          <p className="text-slate-300 text-sm mb-4">
            Para que tu aplicación web funcione tanto dentro de Revit como en un navegador estándar durante la etapa de desarrollo local con Vite, encapsulamos la comunicación en un hook reutilizable:
          </p>
          <CodeBlock
            code={reactHookCode}
            language="typescript"
            title="useRevitBridge.ts"
          />
        </section>

        {/* SECCIÓN 4: CRITERIOS DE INGENIERÍA Y CHECKLIST DE PRODUCCIÓN */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-lg">💡</span>
            Checklist Crítico para Desarrolladores BIM en Producción
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-slate-300 leading-relaxed text-sm">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-circle-check text-emerald-400 mt-1" />
              <div>
                <strong className="text-white">Aislamiento de Transacciones con ExternalEvent:</strong> El callback <code>WebMessageReceived</code> se procesa en el hilo de interfaz de usuario de WebView2. Nunca invoques transacciones directas de la base de datos de Revit allí; delega siempre la acción a un <code>IExternalEventHandler</code> para ejecutar en el hilo principal sin bloquear el viewport 3D.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-circle-check text-emerald-400 mt-1" />
              <div>
                <strong className="text-white">Depuración Remota con edge://inspect:</strong> Al habilitar <code>AreDevToolsEnabled = true</code>, puedes abrir Microsoft Edge en tu estación de trabajo, ingresar a <code>edge://inspect</code> y depurar el HTML, el árbol de componentes React y los estilos Tailwind exactamente igual que una aplicación web estándar.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-circle-check text-emerald-400 mt-1" />
              <div>
                <strong className="text-white">Distribución Offline y Desconectada en Faena:</strong> Configura la compilación de Vite con rutas relativas (<code>base: './'</code>) y copia los archivos estáticos de la carpeta <code>dist/</code> dentro de la carpeta del Add-in. Esto garantiza que el plugin funcione en obras remotas sin acceso a internet.
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 5: FUENTES Y ENLACES TÉCNICOS OFICIALES */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-link text-cyan-400" />{isEn ? "Official Reference & Documentation" : "Fuentes y Documentación Oficial de Referencia"}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="https://learn.microsoft.com/en-us/microsoft-edge/webview2/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/50 transition-all flex items-start gap-3 group"
            >
              <div className="p-2.5 rounded-lg bg-blue-950/60 text-blue-400 text-base group-hover:scale-110 transition-transform">
                <i className="fa-brands fa-microsoft" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors flex items-center justify-between">
                  <span>Microsoft Learn</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500" />
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-1">
                  Documentación Oficial del SDK de Microsoft Edge WebView2
                </div>
              </div>
            </a>

            <a
              href="https://archi-lab.net/webview2-and-revits-dockable-panel/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-purple-500/50 transition-all flex items-start gap-3 group"
            >
              <div className="p-2.5 rounded-lg bg-purple-950/60 text-purple-400 text-base group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-book-bookmark" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                  <span>archi-lab (Konrad Sobon)</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500" />
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-1">
                  WebView2 and Revit's Dockable Panel Deep Dive
                </div>
              </div>
            </a>

            <a
              href="https://www.youtube.com/watch?v=s9KEa0_GUlw"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-red-500/50 transition-all flex items-start gap-3 group"
            >
              <div className="p-2.5 rounded-lg bg-red-950/60 text-red-400 text-base group-hover:scale-110 transition-transform">
                <i className="fa-brands fa-youtube" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-red-300 transition-colors flex items-center justify-between">
                  <span>Revit WPF UI & Fluent</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500" />
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-1">
                  Tutorial: Paneles Acoplables Fluent UI con WebView2
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* COMPARTIR Y RETORNO */}
        <div className="pt-8 border-t border-slate-800">
          <ShareArticle url={shareUrl} title={shareTitle} />
          
          <div className="mt-8 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white hover:border-purple-500 hover:text-purple-300 transition-all font-medium text-sm shadow-lg hover:shadow-purple-500/10"
            >
              <i className="fa-solid fa-arrow-left" /> Volver a Todos los Artículos del Blog
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RevitEdgeWebView2;
