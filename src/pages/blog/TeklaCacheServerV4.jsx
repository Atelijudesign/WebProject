import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export default function TeklaCacheServerV4() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  const configCode = `# Servicio Windows TeklaCacheServer.exe Configuration
Port = 9998
CachePath = "D:\\TeklaCacheServer\\V4Storage"
EnableV3Coexistence = true
MaxCacheSizeGB = 500
EncryptionAES256 = true`;

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

  const shareUrl = getShareUrl("/blog/tekla-model-sharing-cache-server-v4");
  const shareTitle = encodeURIComponent(isEn ? "Cache Server V4 for Tekla Model Sharing (2026+ Releases)" : "Servidor de Caché V4 para Tekla Model Sharing (Versiones 2026+)");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "Cache Server V4 for Tekla Model Sharing (2026+ Releases)" : "Servidor de Caché V4 para Tekla Model Sharing (Versiones 2026+)"}
        description={isEn ? "Trimble released version V4 of the Cache Server for Tekla Model Sharing, re-engineered for the modern data architecture of Tekla Structures 2026 and beyond." : "Guía técnica del nuevo Tekla Cache Server V4 con encriptación AES-256, coexistencia V3 y mejoras de rendimiento."}
        path="/blog/tekla-model-sharing-cache-server-v4"
      />
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 z-50 transition-all duration-100"
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
              <i className="fa-solid fa-server mr-1" /> Trimble · Tekla Cache Server V4
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 20 May 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "7 min read" : "7 min lectura"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            {isEn ? "Cache Server V4 for Tekla Model Sharing (2026+ Releases)" : (
              <>Servidor de Caché V4 para <span className="text-emerald-400">Tekla Model Sharing</span> (Versiones 2026+)</>
            )}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isEn ? "Trimble released version V4 of the Cache Server for Tekla Model Sharing, re-engineered for the modern data architecture of Tekla Structures 2026 and beyond." : (
              <>Trimble liberó la versión V4 del Cache Server para Tekla Model Sharing, rediseñado específicamente para la arquitectura de datos de Tekla Structures 2026 en adelante, soportando coexistencia con V3 en la red local.</>
            )}
          </p>

          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-300 shadow-lg">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <i className="fa-solid fa-link text-xs" /> Fuente Oficial:
            </span>
            <a
              href="https://download.trimble.com/tekla-structures/tekla-model-sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 transition-colors inline-flex items-center gap-1 text-xs sm:text-sm"
            >
              Tekla Model Sharing Cache Server Downloads — Trimble
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
              <i className="fa-solid fa-star text-yellow-400" /> Beneficios en Infraestructura IT
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm mb-0">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-network-wired text-emerald-400 mt-1" />
                <span><strong className="text-white">Reducción del Ancho de Banda WAN:</strong> Almacena paquetes pesados en la red local evitando descargas repetidas por cada modelador.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-layer-group text-teal-400 mt-1" />
                <span><strong className="text-white">Coexistencia V3 y V4:</strong> Soporta modelos en Tekla 2024/2025 (V3) y Tekla 2026+ (V4) simultáneamente en el mismo servidor.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-bolt text-cyan-400 mt-1" />
                <span><strong className="text-white">Descarga a Velocidad LAN (1 Gbps+):</strong> Los cambios de modelo pesados se descargan a velocidad de red local.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-shield-check text-emerald-400 mt-1" />
                <span><strong className="text-white">Cifrado de Caché Local:</strong> Encriptación AES-256 para archivos temporales almacenados en el servidor local.</span>
              </li>
            </ul>
          </div>

          <figure className="my-8 rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img
              src={asset("/assets/img/blog/news/tekla_cache_server_v4.png")}
              alt="Arquitectura Tekla Cache Server V4"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
              <i className="fa-solid fa-camera mr-1" /> {isEn ? "Figure 1:" : "Figura 1:"} Esquema de infraestructura del servidor de caché local V4 para Tekla Model Sharing.
            </figcaption>
          </figure>

          {/* Section 1 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg text-lg">🌐</span>
              1. ¿Por qué es Necesario un Cache Server Local?
            </h3>
            <p className="text-slate-300 leading-relaxed">
              En oficinas de ingeniería con 10 o más modeladores trabajando en el mismo proyecto en Tekla Model Sharing, cuando un usuario sube un cambio masivo (<code className="bg-slate-900 text-emerald-300 px-2 py-1 rounded font-mono text-xs">Write out</code>) que contiene revisiones de dibujos de ensamble o nuevas conexiones metálicas de 50 MB, los otros 9 usuarios deben descargar exactamente el mismo paquete desde los servidores en la nube de Trimble.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Con <strong className="text-white">Tekla Cache Server V4</strong>, el primer usuario que ejecuta <code className="bg-slate-900 text-emerald-300 px-2 py-1 rounded font-mono text-xs">Read in</code> descarga el paquete desde la nube y el servidor local de caché guarda una copia. Los siguientes 8 usuarios descargan los datos instantáneamente a velocidad Gigabit Ethernet desde el servidor local.
            </p>
          </div>

          {/* Section 2 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-teal-600/20 text-teal-400 rounded-lg text-lg">⚙️</span>
              2. Configuración para Administradores de Red
            </h3>
            <CodeBlock code={configCode} language="ini" filename="TeklaCacheServer.config" />
          </div>

          {/* Conclusion */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-emerald-500">
            <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb text-yellow-400" /> Conclusión IT
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-0">
              La instalación del Cache Server V4 es imprescindible para empresas de estructuras metálicas con conexiones de internet limitadas o equipos numerosos en sede local, optimizando los tiempos de espera de sincronización de modelo.
            </p>
          </div>

        </div>
      </section>

      {/* SHARE */}{/* ─── SHARE BUTTONS ─── */}
      <ShareArticle url={shareUrl} title={shareTitle} />
    </div>
  );
}
