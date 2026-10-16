import React, { useState } from 'react';

export const Sp3dInstallGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vm' | 'sql' | 'splm' | 'batches' | 'troubleshoot'>('vm');
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const startScript = `@echo off
echo ===================================================
echo [1/3] Iniciando Servicios SQL Server 2008 R2...
net start MSSQL$SP3D_INST
net start SQLAgent$SP3D_INST
echo [2/3] Levantando Servidor de Licencia SPLM...
net start "Intergraph SmartPlant License Manager"
echo [3/3] Servicios Operativos. Lanzando Smart 3D...
start "" "D:\Program Files\SmartPlant 3D\Smart3D\Core\Container\Bin\Smart3D.exe"
echo ===================================================`;

  const stopScript = `@echo off
echo ===================================================
echo [1/2] Deteniendo Servidor de Licencias SPLM...
net stop "Intergraph SmartPlant License Manager"
echo [2/2] Deteniendo Instancia SQL Server...
net stop SQLAgent$SP3D_INST
net stop MSSQL$SP3D_INST
echo Todos los servicios de SP3D han sido liberados de RAM.
echo ===================================================`;

  return (
    <div className="flex flex-col gap-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-xs font-bold border border-slate-700">
              <i className="fa-solid fa-server mr-1 text-cyan-400"></i> DEPLOYMENT & VM ARCHITECTURE
            </span>
            <span className="text-xs font-mono text-slate-400">// Guía Oficial VMware + SQL Server 2008 R2</span>
          </div>
          <h3 className="text-xl font-black text-white mt-1 font-grotesk">
            Despliegue Aislado en Máquina Virtual & Servidor SQL
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
            SmartPlant 3D 2016 es software legacy corporativo. Para operarlo sin riesgos en tu máquina anfitriona moderna
            (Windows 11) se utiliza VMware Workstation Pro en red <strong>Host-Only</strong>, manteniendo tu sistema
            inmune ante virus y con snapshots instantáneos de retorno.
          </p>
        </div>

        {/* Selector de Pestañas */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('vm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'vm' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-desktop mr-1"></i> 1. VMware Workstation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'sql' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-database mr-1"></i> 2. SQL Server 2008
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('splm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'splm' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-key mr-1"></i> 3. Licencias SPLM
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('batches')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'batches' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-terminal mr-1"></i> 4. Scripts Batch
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('troubleshoot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'troubleshoot' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-screwdriver-wrench mr-1"></i> 5. Solución de Fallos
          </button>
        </div>
      </div>

      {/* Contenido según Pestaña */}
      {activeTab === 'vm' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">// HARDWARE ASIGNADO</span>
              <h4 className="text-lg font-bold text-white mt-1 mb-3">Especificación Óptima VM</h4>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                <li className="flex justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-500">Sistema Operativo:</span>
                  <span className="text-white font-bold">Windows 10 Pro 64-bit (22H2)</span>
                </li>
                <li className="flex justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-500">Memoria RAM:</span>
                  <span className="text-emerald-400 font-bold">8192 MB (8 GB)</span>
                </li>
                <li className="flex justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-500">Procesadores:</span>
                  <span className="text-white">1 Socket / 4 Cores</span>
                </li>
                <li className="flex justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-500">Disco Virtual:</span>
                  <span className="text-white">100 GB (Single File)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">Aceleración 3D:</span>
                  <span className="text-cyan-400">Habilitada (2 GB vRAM)</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 p-2.5 bg-blue-950/40 border border-blue-500/30 rounded-lg text-[11px] text-blue-200 font-mono">
              Almacenar como 'Single File' aumenta la velocidad de I/O de bases de datos un 15%.
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">// SEGURIDAD DE RED</span>
              <h4 className="text-lg font-bold text-white mt-1 mb-3">Aislamiento Host-Only</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                El adaptador de red debe mantenerse en <strong>Host-Only (VMnet1)</strong>. Esto crea un túnel privado
                exclusivo entre tu PC y la máquina virtual sin salida a Internet, blindando tu router contra malware.
              </p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-amber-300 space-y-1">
                <div>[PC Anfitrión] --(VMnet1 Privada)-- [VM Smart 3D]</div>
                <div className="text-rose-400 font-bold">❌ Acceso a Internet Bloqueado</div>
                <div className="text-emerald-400 font-bold">✔ Carpetas Compartidas Activas</div>
              </div>
            </div>
            <div className="mt-4 p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-300 font-mono">
              Snapshots: Crea el snapshot 'Limpio_Pre_SP3D' antes de instalar nada.
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-purple-400 font-bold uppercase">// ESTRUCTURA DE DISCO</span>
              <h4 className="text-lg font-bold text-white mt-1 mb-3">Rutas en Disco D:</h4>
              <ul className="space-y-1.5 text-xs font-mono text-slate-300">
                <li className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-cyan-400 font-bold">D:Program FilesSmartPlant 3D</span>
                  <span className="block text-[10px] text-slate-400">Instalación base del software</span>
                </li>
                <li className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-emerald-400 font-bold">D:...SP3D_BDDATA</span>
                  <span className="block text-[10px] text-slate-400">Archivos maestros .mdf de planta</span>
                </li>
                <li className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-amber-400 font-bold">D:...SP3D_BDLOG</span>
                  <span className="block text-[10px] text-slate-400">Registros de transacciones .ldf</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-400 font-mono">
              Separar DATA y LOG optimiza el rendimiento del motor de base de datos en proyectos masivos.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sql' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-xs text-cyan-400 font-bold uppercase">// INSTALACIÓN DE SQL SERVER 2008 R2</span>
            <h4 className="text-lg font-bold text-white font-grotesk">Parámetros Obligatorios de Instancia</h4>
            <div className="space-y-2">
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Nombre de Instancia</span>
                <span className="text-white font-bold text-sm">SP3D_INST (o Default)</span>
              </div>
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Autenticación</span>
                <span className="text-amber-400 font-bold">Modo Mixto (SQL Server y Windows)</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Usuario: sa | Password seguro</span>
              </div>
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Intercalación (Collation) - CRÍTICO ⚠️</span>
                <span className="text-emerald-400 font-bold">Latin1_General_BIN</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  SP3D fallará si la intercalación es Case-Insensitive (CI). Debe ser binaria (BIN).
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-xs text-emerald-400 font-bold uppercase">// LAS 4 BASES DE DATOS DE PLANTA</span>
            <h4 className="text-lg font-bold text-white font-grotesk">Esquema Relacional de Proyecto</h4>
            <div className="space-y-2">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong className="text-cyan-300">1. Site Database (SiteDB):</strong>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Gestiona usuarios, permisos y apunta a las ubicaciones físicas de los proyectos.
                </p>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong className="text-indigo-300">2. Catalog Database (CatalogDB):</strong>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Alberga todas las especificaciones de tuberías (Piping Specs), perfiles metálicos y equipos.
                </p>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong className="text-emerald-300">3. Model Database (ModelDB):</strong>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Contiene la geometría 3D completa de la refinería y las relaciones paramétricas.
                </p>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong className="text-amber-300">4. Reports Database:</strong>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Plantillas de cubicación (MTO) y extracción de planos Isogen.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'splm' && (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-cyan-400 font-bold uppercase">// SMARTPLANT LICENSE MANAGER (SPLM 2012)</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              v12.00.05
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Paso 1: Identificador de Máquina</span>
              <strong className="text-white text-sm block mt-1">Hostname: atelijudesign</strong>
              <p className="text-[11px] text-slate-400 font-sans mt-2">
                El generador de claves requiere el nombre exacto de la estación en mayúsculas o minúsculas idénticas.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Paso 2: Generación de Clave</span>
              <strong className="text-amber-400 text-sm block mt-1">License Key Generator</strong>
              <p className="text-[11px] text-slate-400 font-sans mt-2">
                Genera la cadena de tokens para Smart 3D Core, Piping, Structural y Electrical con 30 días de validez.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Paso 3: Carga en SPLM</span>
              <strong className="text-emerald-400 text-sm block mt-1">Install License Key</strong>
              <p className="text-[11px] text-slate-400 font-sans mt-2">
                Pega la clave generada y activa el servicio con el botón 'Start Service'.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'batches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* Iniciar_SP3D.bat */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <i className="fa-solid fa-play"></i> Iniciar_SP3D.bat
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(startScript, 'start')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 text-[11px] transition-colors"
                >
                  <i className="fa-solid fa-copy mr-1"></i> {copiedScript === 'start' ? '¡Copiado!' : 'Copiar Script'}
                </button>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-lg text-slate-300 text-[11px] overflow-x-auto whitespace-pre leading-relaxed border border-slate-800">
                {startScript}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Inicia los motores de base de datos y licencias solo cuando vas a trabajar, evitando consumo de RAM innecesario al reiniciar la PC.
            </p>
          </div>

          {/* Detener_SP3D.bat */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <i className="fa-solid fa-stop"></i> Detener_SP3D.bat
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(stopScript, 'stop')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 text-[11px] transition-colors"
                >
                  <i className="fa-solid fa-copy mr-1"></i> {copiedScript === 'stop' ? '¡Copiado!' : 'Copiar Script'}
                </button>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-lg text-slate-300 text-[11px] overflow-x-auto whitespace-pre leading-relaxed border border-slate-800">
                {stopScript}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Apaga limpiamente las bases de datos asegurando que no se corrompan los archivos .ldf de transacciones.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'troubleshoot' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-rose-400 font-bold flex items-center gap-1.5">
              <i className="fa-solid fa-triangle-exclamation"></i> Error: "License Not Available (-15,10)"
            </span>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              El servicio SPLM no está corriendo o el lease de 30 días caducó. Abre servicios de Windows (<code>services.msc</code>),
              inicia 'Intergraph SmartPlant License Manager' o genera una nueva clave en el Keygen con la fecha actual.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-rose-400 font-bold flex items-center gap-1.5">
              <i className="fa-solid fa-triangle-exclamation"></i> Error: "Cannot connect to Site Database"
            </span>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              La instancia de SQL Server no ha arrancado. Ejecuta <code>net start MSSQL$SP3D_INST</code> en una consola
              de Administrador y verifica que los protocolos Named Pipes y TCP/IP estén habilitados en SQL Configuration Manager.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <i className="fa-solid fa-triangle-exclamation"></i> Pantalla Gráfica en Negro sin Geometría
            </span>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              No es un error de instalación. Debes ir a <strong>File &gt; Define Workspace</strong>, expandir la jerarquía
              de la planta y marcar al menos una Unidad o Área para que SP3D cargue los objetos desde el servidor SQL.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <i className="fa-solid fa-triangle-exclamation"></i> Error de Isogen: "Disconnected Pipe Run"
            </span>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Falta una empaquetadura (gasket) o espárragos entre dos bridas adyacentes. Selecciona la unión y verifica
              que la propiedad 'Joint Type' esté en 'Buttweld' o 'Flanged Bolted'.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
