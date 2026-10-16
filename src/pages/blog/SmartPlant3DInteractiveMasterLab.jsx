import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../context/LanguageContext";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";
import BlogBackButton from "../../components/BlogBackButton";
import Sp3dSeriesHub from "../../components/Sp3dSeriesHub";
import { trackManualRequest } from "../../utils/analytics";

export default function SmartPlant3DInteractiveMasterLab() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  // Form state for Google Drive manual access request
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterCompany, setRequesterCompany] = useState("");
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  // Scroll Progress
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

  const shareUrl = getShareUrl("/blog/smartplant-3d-masterlab-simulador-interactivo");
  const shareTitle = encodeURIComponent(
    isEn
      ? "SmartPlant 3D (SP3D) MasterLab: Interactive Web Simulator, PinPoint Precision & Plant Manuals"
      : "SmartPlant 3D (SP3D) MasterLab: Simulador Web Interactivo, Precision PinPoint [F9] y Manuales de Planta"
  );

  const sqlWorkspaceQuery = [
    "-- ========================================================",
    "-- CONSULTA SQL GENERADA POR DEFINE WORKSPACE (SP3D CORE)",
    "-- ========================================================",
    "SELECT ",
    "    obj.Oid, ",
    "    obj.ItemType, ",
    "    obj.NPD, ",
    "    obj.Schedule, ",
    "    sys.SystemName, ",
    "    loc.EastCoordinate, ",
    "    loc.NorthCoordinate, ",
    "    loc.Elevation",
    "FROM SP3D_Plant_Biobio.dbo.SP3D_ModelObjects AS obj",
    "INNER JOIN SP3D_Plant_Biobio.dbo.SP3D_Hierarchy AS sys ",
    "    ON obj.SystemParentOid = sys.Oid",
    "INNER JOIN SP3D_Plant_Biobio.dbo.SP3D_Coordinates AS loc ",
    "    ON obj.Oid = loc.ObjectOid",
    "WHERE sys.SystemPath LIKE 'Planta Biobio/Area 100/Crude Distillation/%'",
    "  AND obj.ItemType IN ('PipeRun', 'PipeComponent', 'EquipmentNozzle')",
    "  AND loc.Elevation BETWEEN 0.000 AND 18.500;",
    "-- Estado: 1,420 objetos transferidos a RAM del cliente (Memoria consumida: 48 MB)"
  ].join("\n");

  const batchStartupScript = [
    "@echo off",
    ":: ========================================================",
    ":: SCRIPT OFICIAL: INICIO DE SERVICIOS SMARTPLANT 3D (VM)",
    ":: ========================================================",
    "title SmartPlant 3D 2016 - Startup Controller",
    "echo [*] Iniciando motor de base de datos SQL Server...",
    "net start MSSQL$SP3D_INSTANCE",
    "if %errorlevel% neq 0 (",
    "    echo [ERROR] No se pudo iniciar el servicio de SQL Server. Verifique permisos de Administrador.",
    "    pause",
    "    exit /b %errorlevel%",
    ")",
    "",
    "echo [*] Levantando servicio de licencias Intergraph SPLM 2012...",
    'net start "SmartPlant License Manager"',
    "",
    "echo [*] Sincronizando variables de entorno y mapeo de unidades P:...",
    'subst P: "C:\\SP3D_Projects\\BiobioRefinery"',
    "",
    "echo [*] Todo en orden. Lanzando SmartPlant 3D...",
    'start "" "C:\\Program Files (x86)\\SmartPlant\\3D\\Core\\SP3D.exe" -plant "Planta Biobio"',
    "exit"
  ].join("\n");

  const handleManualRequest = (e) => {
    e.preventDefault();
    if (!requesterEmail || !requesterName) return;

    trackManualRequest("sp3d_interactive_blog_request");

    const mailSubject = encodeURIComponent(
      "Solicitud de Acceso a Carpeta de Manuales SmartPlant 3D - " + requesterName
    );
    const mailBody = encodeURIComponent(
      "Hola Andres,\n\nSolicito acceso a la carpeta de Google Drive con los manuales y cursos de SmartPlant 3D (12 Manuales EFV, Bechtel CSA, Brass y Videos).\n\nDatos del solicitante:\n- Nombre: " +
        requesterName +
        "\n- Email: " +
        requesterEmail +
        "\n- Empresa / Estudio: " +
        (requesterCompany || "Independiente") +
        "\n\nMuchas gracias."
    );

    window.location.href = "mailto:contacto@atelijudesign.cl?subject=" + mailSubject + "&body=" + mailBody;
    setIsRequestSubmitted(true);
  };

  const copyFolderReference = () => {
    navigator.clipboard.writeText("G:\\Mi unidad\\Atelijudesign\\02_Estudios\\02.1_Cursos_Formacion\\01_BIM\\101-CursosSoftware\\SmartPlant 3D");
    setHasCopiedLink(true);
    setTimeout(() => setHasCopiedLink(false), 3000);
  };

  return (
    <article className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={
          isEn
            ? "SmartPlant 3D (SP3D) MasterLab: Interactive Web Simulator & Engineering Manuals | Andres Gallo P."
            : "SmartPlant 3D (SP3D) MasterLab: Academia Interactiva, Simulador PinPoint y Manuales | Andres Gallo P."
        }
        description={
          isEn
            ? "Learn Intergraph SmartPlant 3D from zero in our interactive browser simulator. Master PinPoint F9, SmartStep ribbon, database architecture, and request access to our master training manuals."
            : "Aprende Intergraph SmartPlant 3D desde cero en nuestro simulador web interactivo. Domina el comando PinPoint F9, cinta SmartStep, arquitectura SQL Server y solicita acceso a los manuales maestros de formacion."
        }
        path="/blog/smartplant-3d-masterlab-simulador-interactivo"
      />

      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 z-50 transition-all duration-100"
        style={{ width: scrollProgress + "%" }}
      />

      {/* Hero Section */}
      <header className="pt-28 pb-16 px-4 bg-[#030712]/60 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <BlogBackButton />
          </div>

          <div className="flex items-center justify-center gap-2.5 mb-4 flex-wrap font-mono text-xs">
            <span className="bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <i className="fa-solid fa-industry" />
              {isEn ? "Industrial Plant 3D" : "Ingenieria de Plantas"}
            </span>
            <span className="bg-amber-950/90 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <i className="fa-solid fa-crosshairs" />
              SmartPlant 3D (SP3D)
            </span>
            <span className="text-slate-400">
              <i className="fa-regular fa-calendar mr-1" />
              Septiembre 2026
            </span>
            <span className="text-slate-400">
              <i className="fa-regular fa-clock mr-1" />
              10 min {isEn ? "read" : "lectura"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6 font-grotesk">
            SmartPlant 3D (SP3D) MasterLab:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Academia Interactiva, Simulador PinPoint & Manuales
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isEn
              ? "How we eliminated the brutal barrier of entry to Intergraph SmartPlant 3D: an interactive web laboratory with live 4-view viewport, real-time PinPoint [F9] trainer, and an exclusive drive repository with 12 complete training manuals."
              : "Como derribamos la brutal barrera de entrada a Intergraph SmartPlant 3D: un laboratorio web interactivo con viewport cuadruple, entrenador de coordenadas de precision PinPoint [F9] en tiempo real y solicitud de acceso directo a la carpeta con 12 manuales maestros de planta."}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/herramientas/smartplant-3d"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-sm uppercase tracking-wider font-mono shadow-lg shadow-cyan-500/20 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
            >
              <i className="fa-solid fa-play" />
              {isEn ? "Launch Live Simulator" : "Abrir Simulador en Vivo"}
            </Link>
            <a
              href="#solicitar-manuales"
              className="px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm uppercase tracking-wider font-mono flex items-center gap-2 transition-all"
            >
              <i className="fa-solid fa-folder-open text-amber-400" />
              {isEn ? "Request Manuals Access" : "Solicitar Manuales (Drive)"}
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 bg-[#0b1220]/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-red-500/30 text-center bg-slate-900/60">
              <p className="text-3xl sm:text-4xl font-black text-red-400 mb-1 font-mono">14 Dias</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Setup Tradicional VM</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-emerald-500/40 text-center bg-slate-900/60">
              <p className="text-3xl sm:text-4xl font-black text-emerald-400 mb-1 font-mono">0 Seg</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Acceso Web MasterLab</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-cyan-500/30 text-center bg-slate-900/60">
              <p className="text-3xl sm:text-4xl font-black text-cyan-400 mb-1 font-mono">10 Modulos</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">De 0 a Pro + Quizzes</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-amber-500/30 text-center bg-slate-900/60">
              <p className="text-3xl sm:text-4xl font-black text-amber-400 mb-1 font-mono">12 Manuales</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">EFV + Bechtel + Brass</p>
            </div>
          </div>

          {/* HUB: Ruta de Aprendizaje SmartPlant 3D */}
          <section aria-label={isEn ? "Series learning path" : "Ruta de aprendizaje de la serie"}>
            <Sp3dSeriesHub />
          </section>

          {/* El Problema Real */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 bg-slate-950/70">
            <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3 font-grotesk">
              <span className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 text-lg">
                <i className="fa-solid fa-triangle-exclamation" />
              </span>
              El Problema: La Pared de Entrada a SmartPlant 3D
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              En la ingenieria de plantas de proceso, celulosa, petroquimica y gran mineria (como Codelco, Antofagasta Minerals o BHP), <strong>Intergraph SmartPlant 3D (SP3D)</strong> es el estandar indiscutible. Sin embargo, para un diseñador estructural, ingeniero recién graduado o un modelador de Revit que desea dar el salto a plantas industriales, aprender SP3D es practicamente imposible sin una licencia corporativa de $25,000 USD.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-3 font-mono text-xs">
              <div className="flex items-start gap-2.5 text-red-300">
                <i className="fa-solid fa-circle-xmark mt-0.5 text-red-400" />
                <span>
                  <strong>Dependencia Estricta de Base de Datos:</strong> SP3D no tiene archivos tipo <code>.dwg</code> o <code>.rvt</code>. Requiere SQL Server 2008 R2 SP2 con collation binario especifico (<code>SQL_Latin1_General_CP1_CI_AS</code>) y 3 bases de datos interconectadas (Site, Site Schema y Model).
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-red-300">
                <i className="fa-solid fa-circle-xmark mt-0.5 text-red-400" />
                <span>
                  <strong>Licenciamiento SPLM 2012 Obsoleto:</strong> Requiere maquinas virtuales aisladas en Windows 7 x64, desactivacion de adaptadores de red WiFi y servicios batch de arranque manual.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-red-300">
                <i className="fa-solid fa-circle-xmark mt-0.5 text-red-400" />
                <span>
                  <strong>Curva de Aprendizaje Frustrante:</strong> Quienes logran instalarlo suelen abandonar porque la interfaz carece de dibujo libre: todo funciona mediante la barra de precision <code>PinPoint [F9]</code> y el asistente paso a paso <code>SmartStep</code>.
                </span>
              </div>
            </div>
          </div>

          {/* La Solucion: SP3D MasterLab */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 bg-slate-950/70">
            <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3 font-grotesk">
              <span className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-lg">
                <i className="fa-solid fa-circle-check" />
              </span>
              Nuestra Solucion: MasterLab Web Interactivo
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Disenamos una aplicacion web interactiva completa que traslada la experiencia real de modelado de SP3D directamente a tu navegador, permitiendote practicar los flujos de trabajo exactos de la industria sin lidiar con SQL Server ni maquinas virtuales.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
                  <i className="fa-solid fa-crosshairs" />
                  ENTRENADOR PINPOINT [F9]
                </div>
                <p className="text-xs text-slate-300">
                  Simula la barra flotante de SP3D. Bloquea coordenadas Este, Norte y Elevacion (E, N, EL), define puntos de origen Target y calcula desplazamientos relativos (dE, dN, dEL).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                  <i className="fa-solid fa-cubes" />
                  VIEWPORT 4 VISTAS & SMARTSTEP
                </div>
                <p className="text-xs text-slate-300">
                  Visualizador con proyeccion isometrica y vistas ortogonales (Planta, Frontal, Lateral). Controla la cinta SmartStep Ribbon para guiar el trazado de piping y equipos.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                  <i className="fa-solid fa-sitemap" />
                  DEFINE WORKSPACE & ARBOL SQL
                </div>
                <p className="text-xs text-slate-300">
                  Comprende el filtrado de objetos por disciplina (Plant / Area / Unit / System). Genera la consulta SQL subyacente y calcula el consumo de memoria RAM de la estacion.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold">
                  <i className="fa-solid fa-graduation-cap" />
                  10 MODULOS DE FORMACION CON QUIZZES
                </div>
                <p className="text-xs text-slate-300">
                  Curriculum completo basado en los 12 manuales de Edward F. Vicente, Bechtel CSA y Brass, con laboratorios paso a paso y evaluacion de retencion.
                </p>
              </div>
            </div>
          </div>

          {/* Tabla Comparativa */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 bg-slate-950/70">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3 font-grotesk">
              <span className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg">
                <i className="fa-solid fa-table-columns" />
              </span>
              Comparativa: Formacion Tradicional vs. SP3D MasterLab
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse font-sans">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900 text-white font-mono text-xs">
                    <th className="p-3.5">Parametro Clave</th>
                    <th className="p-3.5 text-red-400">Entorno Tradicional (VM / Licencias)</th>
                    <th className="p-3.5 text-emerald-400">SP3D MasterLab (WebProject)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs">
                  <tr>
                    <td className="p-3.5 font-bold text-white">Requisitos de Hardware</td>
                    <td className="p-3.5 text-slate-400">VMware Workstation, 16 GB RAM, disco SSD dedicado</td>
                    <td className="p-3.5 text-emerald-300 font-bold">Cualquier navegador web moderno (0 descargas)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Tiempo hasta el Primer Modelo</td>
                    <td className="p-3.5 text-slate-400">10 a 14 dias instalando SQL Server y parches</td>
                    <td className="p-3.5 text-emerald-300 font-bold">Inmediato (&lt; 5 segundos)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Practica de PinPoint [F9]</td>
                    <td className="p-3.5 text-slate-400">Requiere catalogo completo poblado para poder activar comandos</td>
                    <td className="p-3.5 text-emerald-300 font-bold">Entrenador interactivo con micro-desafios graduados</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Comprension de Base de Datos</td>
                    <td className="p-3.5 text-slate-400">Caja negra (el usuario no ve que pasa en SQL)</td>
                    <td className="p-3.5 text-emerald-300 font-bold">Visualizador SQL en tiempo real con recuento de memoria</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Costo de Acceso</td>
                    <td className="p-3.5 text-slate-400">Licencia corporativa privativa ($25,000 USD/seat)</td>
                    <td className="p-3.5 text-emerald-300 font-bold">100% Gratuito en nuestro portafolio de ingenieria</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bloque de Codigo: Consulta SQL y Script Batch */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 bg-slate-950/70 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 font-grotesk">
                <i className="fa-solid fa-database text-cyan-400" />
                1. Arquitectura de Consulta SQL: Que es "Define Workspace"?
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                A diferencia de programas basados en archivos, en SmartPlant 3D nunca abres la planta completa. Ejecutas una consulta espacial y por sistema que extrae de SQL Server unicamente lo necesario para tu sesion de trabajo:
              </p>
              <CodeBlock code={sqlWorkspaceQuery} language="sql" filename="sp3d_define_workspace_filter.sql" />
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 font-grotesk">
                <i className="fa-solid fa-terminal text-amber-400" />
                2. Script Automatizado para Quienes Montan su Maquina Virtual
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Si decides montar tu propio entorno virtual con VMware Workstation, este script batch automatiza el arranque del servicio SQL y el gestor de licencias SPLM:
              </p>
              <CodeBlock code={batchStartupScript} language="batch" filename="Iniciar_SP3D.bat" />
            </div>
          </div>

          {/* SECCION ESPECIAL: PACK DE MANUALES & RECURSOS DRIVE */}
          <div
            id="solicitar-manuales"
            className="glass-card rounded-3xl p-8 md:p-10 border-2 border-amber-500/50 bg-gradient-to-br from-amber-950/30 via-slate-950 to-slate-900 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-500/30 pb-6 mb-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40 uppercase tracking-widest inline-flex items-center gap-1.5 mb-2">
                  <i className="fa-solid fa-folder-closed text-amber-400" />
                  REPOSITORIO EXCLUSIVO DE MANUALES
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-grotesk">
                  Acceso a la Boveda de Manuales y Videos SmartPlant 3D
                </h3>
              </div>

              <button
                type="button"
                onClick={copyFolderReference}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
                title="Copiar ruta interna de referencia"
              >
                <i className={hasCopiedLink ? "fa-solid fa-check text-emerald-400" : "fa-solid fa-copy text-amber-400"} />
                {hasCopiedLink ? "Ruta Copiada" : "Copiar Ruta Drive"}
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Compartimos con la comunidad de ingenieria de plantas el acceso a nuestra biblioteca privada en Google Drive con mas de <strong>12 Manuales Tecnicos en PDF</strong>, guias de diseno estructural y sesiones practicas en video:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs mb-8">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <i className="fa-solid fa-file-pdf text-red-400 text-base mt-0.5" />
                <div>
                  <strong className="text-white block">12 Manuales Edward F. Vicente (PDF)</strong>
                  <span className="text-slate-400 text-[11px]">Fundamentos, Grids, Equipos, Piping, Estructuras, Soportes, HVAC, Isogen.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <i className="fa-solid fa-building-columns text-cyan-400 text-base mt-0.5" />
                <div>
                  <strong className="text-white block">Curso Bechtel CSA (Civil & Structures)</strong>
                  <span className="text-slate-400 text-[11px]">Estandares de modelado estructural y obras civiles para mega-proyectos.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <i className="fa-solid fa-video text-amber-400 text-base mt-0.5" />
                <div>
                  <strong className="text-white block">14 Sesiones Practicas en Video</strong>
                  <span className="text-slate-400 text-[11px]">Demostraciones en vivo de ruteo de canerias, bombas y plataformas de acero.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <i className="fa-solid fa-sliders text-emerald-400 text-base mt-0.5" />
                <div>
                  <strong className="text-white block">Guias de Setup VMware & SQL Server</strong>
                  <span className="text-slate-400 text-[11px]">Manual paso a paso de instalacion de Windows 7 x64, SQL Server y SPLM.</span>
                </div>
              </div>
            </div>

            {/* FORMULARIO DE SOLICITUD DE ACCESO */}
            <div className="p-6 rounded-2xl bg-slate-950/90 border border-amber-500/30">
              <h4 className="text-base font-bold text-white mb-2 font-grotesk flex items-center gap-2">
                <i className="fa-solid fa-paper-plane text-amber-400" />
                Formulario de Solicitud de Acceso Directo (Google Drive)
              </h4>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Ingresa tu nombre y correo de Google (Gmail/Workspace) para autorizar tu acceso de lectura a la carpeta compartida:
              </p>

              {isRequestSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 font-mono text-xs flex items-center gap-3">
                  <i className="fa-solid fa-circle-check text-emerald-400 text-lg" />
                  <div>
                    <strong className="block text-white">Solicitud Generada Exitosamente!</strong>
                    <span>Se ha abierto tu cliente de correo para enviar la solicitud de autorizacion. Te responderemos habilitando el acceso a la carpeta en Google Drive en breve.</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleManualRequest} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 font-mono text-[11px] mb-1">Tu Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={requesterName}
                      onChange={(e) => setRequesterName(e.target.value)}
                      placeholder="Ej. Juan Perez"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono text-[11px] mb-1">Tu Correo (Gmail / Google) *</label>
                    <input
                      type="email"
                      required
                      value={requesterEmail}
                      onChange={(e) => setRequesterEmail(e.target.value)}
                      placeholder="nombre@gmail.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono text-[11px] mb-1">Empresa / Proyecto</label>
                    <input
                      type="text"
                      value={requesterCompany}
                      onChange={(e) => setRequesterCompany(e.target.value)}
                      placeholder="Ej. Minera / Consultora"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-3 flex flex-wrap items-center justify-between gap-4 pt-2">
                    <p className="text-[11px] text-slate-500 font-mono">
                      * El acceso se otorga via permisos compartidos de Google Drive con cuenta autorizada.
                    </p>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <i className="fa-solid fa-lock-open" />
                      Solicitar Acceso a la Carpeta Drive
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Conclusiones Clave */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 bg-slate-950/70 border-l-4 border-l-cyan-500">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-grotesk">
              <i className="fa-solid fa-lightbulb text-yellow-400" />
              Conclusiones y Futuro de la Formacion Industrial en 2026
            </h3>
            <ul className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <li className="flex items-start gap-2.5">
                <i className="fa-solid fa-circle-check text-cyan-400 mt-1" />
                <span>
                  <strong>La democratizacion del software pesado:</strong> Las barreras de licenciamiento y setup de herramientas como SmartPlant 3D ya no deben ser un obstaculo para la capacitacion tecnica de nuevas generaciones de diseñadores y modeladores.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <i className="fa-solid fa-circle-check text-cyan-400 mt-1" />
                <span>
                  <strong>El valor de la precision sobre el dibujo libre:</strong> Aprender la disciplina de PinPoint [F9] y el flujo de trabajo SmartStep prepara a los modeladores para trabajar bajo tolerancias milimetricas en tuberias ASME B31.3 y estructuras AISC 360.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <i className="fa-solid fa-circle-check text-cyan-400 mt-1" />
                <span>
                  <strong>Combinacion practica en la nube y documentacion local:</strong> El laboratorio web interactivo acelera la curva de aprendizaje inicial, mientras que la biblioteca completa de manuales permite profundizar en cada disciplina con rigor tecnico de ingenieria de detalle.
                </span>
              </li>
            </ul>
          </div>

          {/* Fuentes Oficiales y Referencias */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 bg-slate-950/70">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 font-grotesk">
              <i className="fa-solid fa-link text-cyan-400" />
              Fuentes Oficiales y Referencias Tecnicas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <a
                href="https://hexagon.com/products/smart-3d"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 flex items-center justify-between group transition-all"
              >
                <div>
                  <p className="font-bold text-white">Hexagon PPM (Intergraph)</p>
                  <p className="text-slate-400 text-[11px]">Plataforma oficial de Smart 3D para plantas y mineria</p>
                </div>
                <i className="fa-solid fa-arrow-up-right-from-square text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <Link
                to="/herramientas/smartplant-3d"
                className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 flex items-center justify-between group transition-all"
              >
                <div>
                  <p className="font-bold text-cyan-300">SP3D MasterLab Interactivo</p>
                  <p className="text-slate-400 text-[11px]">Prueba el simulador en vivo en AtelijuDesign</p>
                </div>
                <i className="fa-solid fa-play text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Share Buttons */}
      <ShareArticle url={shareUrl} title={shareTitle} />
    </article>
  );
}
