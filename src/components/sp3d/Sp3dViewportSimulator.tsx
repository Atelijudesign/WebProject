import React, { useState } from 'react';

export interface ViewportElement {
  readonly id: string;
  readonly name: string;
  readonly type: 'equipment' | 'pipe' | 'beam' | 'column' | 'support' | 'cabletray';
  readonly system: string;
  readonly spec: string;
  readonly elevation: string;
  readonly coordinates: string;
  readonly color: string;
  readonly description: string;
}

const INITIAL_ELEMENTS: readonly ViewportElement[] = [
  {
    id: 't-101',
    name: 'T-101 (Torre de Fraccionamiento)',
    type: 'equipment',
    system: 'Area A2 > U03 > Equipment',
    spec: 'Vertical Vessel SWWSE210-E',
    elevation: 'EL +0.000m (Base) / +24.000m (Top)',
    coordinates: 'E: 100.00m | N: 200.00m',
    color: '#06b6d4',
    description: 'Columna cilíndrica de proceso con boquilla N1 (4" 300# RF a cota +3.50m) y boquilla N2 (6" 150# RF).'
  },
  {
    id: 'p-101a',
    name: 'P-101A (Bomba Centrífuga Sulzer)',
    type: 'equipment',
    system: 'Area A2 > U03 > Equipment',
    spec: 'Centrifugal Pump ANSI B73.1',
    elevation: 'EL +0.300m (Plinto de hormigón)',
    coordinates: 'E: 108.00m | N: 196.00m',
    color: '#38bdf8',
    description: 'Bomba de succión horizontal con boquilla de succión 6" 150# y descarga vertical 4" 300#.'
  },
  {
    id: 'col-a1',
    name: 'Columna Metálica W12x65 (Eje A-1)',
    type: 'column',
    system: 'Area A2 > U03 > Structures',
    spec: 'AISC W12x65 | ASTM A36',
    elevation: 'EL +0.000m a EL +6.000m',
    coordinates: 'E: 96.00m | N: 204.00m',
    color: '#818cf8',
    description: 'Columna de acero laminado para el pórtico principal del rack de tuberías.'
  },
  {
    id: 'col-a2',
    name: 'Columna Metálica W12x65 (Eje A-2)',
    type: 'column',
    system: 'Area A2 > U03 > Structures',
    spec: 'AISC W12x65 | ASTM A36',
    elevation: 'EL +0.000m a EL +6.000m',
    coordinates: 'E: 104.00m | N: 204.00m',
    color: '#818cf8',
    description: 'Segunda columna del marco estructural con conexión de placa base soldada.'
  },
  {
    id: 'beam-01',
    name: 'Viga Principal W10x49 (Nivel Rack +6m)',
    type: 'beam',
    system: 'Area A2 > U03 > Structures',
    spec: 'AISC W10x49 | Cardinal Point: 8 (T.O.S.)',
    elevation: 'EL +6.000m T.O.S.',
    coordinates: 'Eje A (Entre 1 y 2)',
    color: '#6366f1',
    description: 'Viga portante con destajes tipo Fit contra columnas para apoyar cañerías de proceso.'
  },
  {
    id: 'pipe-4in',
    name: 'Línea de Cañería 4"-P-204-1C0031-CS',
    type: 'pipe',
    system: 'Area A2 > U03 > Piping',
    spec: '1C0031 (Carbon Steel 150# RF)',
    elevation: 'EL +3.500m (Desde N1) -> EL +6.300m',
    coordinates: 'Ruta continua T-101 -> Rack -> P-101A',
    color: '#10b981',
    description: 'Tubería continua con contrabrida 300# en boquilla N1, codos 90° LR, válvula de compuerta 4" y pendiente 1:100.'
  },
  {
    id: 'sup-u01',
    name: 'Soporte Estándar U-Shape Frame L2x2x1/8',
    type: 'support',
    system: 'Area A2 > U03 > Supports',
    spec: 'U Shape Frame w/o Baseplate',
    elevation: 'EL +6.000m (Anclado a viga W10x49)',
    coordinates: 'Abraza línea 4"-P-204',
    color: '#f59e0b',
    description: 'Soporte paramétrico de acero estructural soldado al ala inferior de la viga para guiar la cañería.'
  },
  {
    id: 'tray-24in',
    name: 'Bandeja Eléctrica Tipo Escalerilla 24" x 4"',
    type: 'cabletray',
    system: 'Area A2 > U03 > Electrical',
    spec: 'Aluminum Ladder Tray (24" x 4")',
    elevation: 'EL +7.200m (Sobre el rack de cañerías)',
    coordinates: 'Paralela al eje de proceso',
    color: '#eab308',
    description: 'Canalización de cables de fuerza y control respetando el despeje normativo respecto a tuberías calientes.'
  }
];

export const Sp3dViewportSimulator: React.FC = () => {
  const [activeWindowLayout, setActiveWindowLayout] = useState<'single' | 'quad'>('single');
  const [activeTool, setActiveTool] = useState<'select' | 'route-pipe' | 'place-eqp' | 'place-member' | 'place-support' | 'pinpoint'>('select');
  const [selectedElement, setSelectedElement] = useState<ViewportElement | null>(INITIAL_ELEMENTS[0]);
  const [isPinpointOpen, setIsPinpointOpen] = useState<boolean>(true);
  const [pinpointCoords, setPinpointCoords] = useState<{ readonly e: string; readonly n: string; readonly el: string }>({
    e: '100.000m',
    n: '200.000m',
    el: '+3.500m'
  });
  const [currentSmartStep, setCurrentSmartStep] = useState<number>(1);
  const [visibleFilter, setVisibleFilter] = useState<'all' | 'piping' | 'structure' | 'equipment'>('all');

  const filteredElements = INITIAL_ELEMENTS.filter(el => {
    if (visibleFilter === 'all') return true;
    if (visibleFilter === 'piping') return el.type === 'pipe' || el.type === 'support';
    if (visibleFilter === 'structure') return el.type === 'beam' || el.type === 'column';
    if (visibleFilter === 'equipment') return el.type === 'equipment';
    return true;
  });

  const getSmartStepTitle = () => {
    if (activeTool === 'select') return 'Modo Selección: Haz clic sobre cualquier elemento de la planta para inspeccionar sus atributos SQL.';
    if (activeTool === 'route-pipe') {
      if (currentSmartStep === 1) return 'Paso 1: Selecciona la boquilla inicial (Nozzle N1 en T-101)';
      if (currentSmartStep === 2) return 'Paso 2: Define Spec (1C0031) y Diámetro Nominal (4 in)';
      if (currentSmartStep === 3) return 'Paso 3: Fija longitud o avanza ortogonalmente con PinPoint [F9]';
      return 'Paso 4: Haz clic en Insert Component para válvula o finaliza en la bomba P-101A';
    }
    if (activeTool === 'place-eqp') return 'Colocar Equipo: Selecciona el modelo SWWSE210-E y fija coordenadas con PinPoint.';
    if (activeTool === 'place-member') return 'Colocar Miembro: Selecciona perfil W12x65, Cardinal Point 8 y ancla a las grillas.';
    if (activeTool === 'place-support') return 'Colocar Soporte: SmartStep 1: Selecciona cañería | SmartStep 2: Selecciona viga de apoyo.';
    return 'PinPoint [F9]: Introduce coordenadas relativas dE, dN, dEL para precisión milimétrica.';
  };

  return (
    <div className="flex flex-col gap-4 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
      {/* Barra de Título y Controles de Ventana (Estilo Menú SP3D) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/60 border border-cyan-500/40 rounded-lg text-cyan-300 font-mono text-xs font-bold tracking-wider">
            <i className="fa-solid fa-cube text-cyan-400"></i>
            <span>SMART 3D VIEWPORT v11.00</span>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            // Unidad: <strong className="text-white">U03 (Refinería)</strong> | Workspace: <strong className="text-emerald-400">Activo</strong>
          </span>
        </div>

        {/* Layout Toggle: Single View vs 4-Views (Common Lab 1) */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono mr-1">Vistas:</span>
          <button
            type="button"
            onClick={() => setActiveWindowLayout('single')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
              activeWindowLayout === 'single'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
            title="Vista Única Isométrica 3D"
          >
            <i className="fa-solid fa-square mr-1"></i> 1 Ventana (Iso)
          </button>
          <button
            type="button"
            onClick={() => setActiveWindowLayout('quad')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
              activeWindowLayout === 'quad'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
            title="4 Ventanas Ortográficas Estándar SP3D (Iso, Top, Front, Right)"
          >
            <i className="fa-solid fa-table-cells-large mr-1"></i> 4 Ventanas (.ses)
          </button>
        </div>
      </div>

      {/* SmartStep Ribbon Horizontal Oficial de SP3D */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-cyan-500/30 rounded-xl p-3 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500 text-slate-950 font-mono font-black text-xs">
            {activeTool === 'route-pipe' ? currentSmartStep : '1'}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              SMARTSTEP RIBBON // {activeTool.toUpperCase()}
            </span>
            <span className="text-xs text-slate-200 font-medium">{getSmartStepTitle()}</span>
          </div>
        </div>

        {/* Acciones de paso cuando Route Pipe está activo */}
        {activeTool === 'route-pipe' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentSmartStep(prev => (prev > 1 ? prev - 1 : 1))}
              disabled={currentSmartStep === 1}
              className="px-2 py-1 bg-slate-800 disabled:opacity-30 text-slate-300 hover:text-white rounded text-xs font-mono border border-slate-700"
            >
              <i className="fa-solid fa-arrow-left mr-1"></i> Paso Previo
            </button>
            <button
              type="button"
              onClick={() => setCurrentSmartStep(prev => (prev < 4 ? prev + 1 : 4))}
              disabled={currentSmartStep === 4}
              className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-mono font-bold"
            >
              Siguiente <i className="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </div>
        )}
      </div>

      {/* Barra de Herramientas Verticales (Toolbar) + Viewport 3D Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Barra Vertical de Comandos Rápidos (Tasks & Tools) */}
        <div className="lg:col-span-1 flex lg:flex-col gap-2 bg-slate-900/80 border border-slate-800 p-2 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTool('select')}
            className={`p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
              activeTool === 'select'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Seleccionar Objeto (SmartSelect)"
          >
            <i className="fa-solid fa-arrow-pointer text-sm"></i>
            <span className="text-[9px] font-mono">Select</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTool('route-pipe');
              setCurrentSmartStep(1);
            }}
            className={`p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
              activeTool === 'route-pipe'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
            }`}
            title="Rutear Tubería (Route Pipe)"
          >
            <i className="fa-solid fa-arrows-split-up-and-left text-sm"></i>
            <span className="text-[9px] font-mono">Piping</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('place-eqp')}
            className={`p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
              activeTool === 'place-eqp'
                ? 'bg-cyan-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800'
            }`}
            title="Colocar Equipo (Place Equipment)"
          >
            <i className="fa-solid fa-industry text-sm"></i>
            <span className="text-[9px] font-mono">Eqp</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('place-member')}
            className={`p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
              activeTool === 'place-member'
                ? 'bg-indigo-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
            }`}
            title="Colocar Miembro Estructural (Place Member)"
          >
            <i className="fa-solid fa-cubes-stacked text-sm"></i>
            <span className="text-[9px] font-mono">Struct</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('place-support')}
            className={`p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
              activeTool === 'place-support'
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
            }`}
            title="Colocar Soporte de Tubería (Place Support)"
          >
            <i className="fa-solid fa-wrench text-sm"></i>
            <span className="text-[9px] font-mono">Support</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPinpointOpen(prev => !prev)}
            className={`p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
              isPinpointOpen
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
            }`}
            title="Alternar Barra PinPoint (Tecla F9)"
          >
            <i className="fa-solid fa-crosshairs text-sm"></i>
            <span className="text-[9px] font-mono">PinPoint</span>
          </button>
        </div>

        {/* Viewport Gráfico Central (SVG / Canvas Interactivo) */}
        <div className="lg:col-span-8 flex flex-col gap-2">
          {/* Filtros Rápidos de Capas del Workspace */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-slate-900/60 rounded-lg border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Disciplina:</span>
              <button
                type="button"
                onClick={() => setVisibleFilter('all')}
                className={`px-2 py-0.5 rounded ${visibleFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setVisibleFilter('piping')}
                className={`px-2 py-0.5 rounded ${visibleFilter === 'piping' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-emerald-400'}`}
              >
                Piping
              </button>
              <button
                type="button"
                onClick={() => setVisibleFilter('structure')}
                className={`px-2 py-0.5 rounded ${visibleFilter === 'structure' ? 'bg-indigo-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-indigo-400'}`}
              >
                CSA
              </button>
              <button
                type="button"
                onClick={() => setVisibleFilter('equipment')}
                className={`px-2 py-0.5 rounded ${visibleFilter === 'equipment' ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-cyan-400'}`}
              >
                Equipos
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>WCS Global // E, N, EL</span>
            </div>
          </div>

          {/* Contenedor del Lienzo Gráfico */}
          <div className="relative w-full h-[460px] bg-[#070b14] border border-slate-800 rounded-xl overflow-hidden shadow-2xl group select-none">
            {/* Cuadrícula Isométrica de Fondo */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}
            />

            {/* View Cube / Brújula de Navegación 3D */}
            <div className="absolute top-3 right-3 z-20 flex flex-col items-center bg-slate-900/90 border border-slate-700/60 p-2 rounded-xl shadow-lg">
              <div className="w-12 h-12 relative flex items-center justify-center font-mono text-[10px] text-cyan-300 font-bold">
                <span className="absolute top-0 text-amber-400">N</span>
                <span className="absolute bottom-0 text-slate-400">S</span>
                <span className="absolute right-0 text-emerald-400">E</span>
                <span className="absolute left-0 text-slate-400">W</span>
                <div className="w-5 h-5 rounded-full border border-cyan-400/50 flex items-center justify-center text-[8px] text-cyan-200">
                  ISO
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-400 mt-1">Azimuth: 45°</span>
            </div>

            {/* Ejes WCS (Easting / Northing / Elevation) */}
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-3 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-[11px]">
              <span className="text-red-400 font-bold flex items-center gap-1">
                <span className="w-2 h-0.5 bg-red-400 inline-block"></span> E (X)
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-0.5 bg-emerald-400 inline-block"></span> N (Y)
              </span>
              <span className="text-blue-400 font-bold flex items-center gap-1">
                <span className="w-2 h-0.5 bg-blue-400 inline-block"></span> EL (Z)
              </span>
            </div>

            {/* Barra Flotante PinPoint [F9] */}
            {isPinpointOpen && (
              <div className="absolute top-3 left-3 z-20 bg-slate-900/95 border border-amber-500/50 rounded-xl p-3 shadow-xl flex flex-col gap-2 max-w-xs">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase flex items-center gap-1">
                    <i className="fa-solid fa-crosshairs"></i> PINPOINT [F9] // TARGET
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPinpointOpen(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div className="flex flex-col bg-slate-950 p-1.5 rounded border border-slate-800">
                    <span className="text-[9px] text-red-400 font-bold">Easting</span>
                    <span className="text-white font-semibold truncate">{pinpointCoords.e}</span>
                  </div>
                  <div className="flex flex-col bg-slate-950 p-1.5 rounded border border-slate-800">
                    <span className="text-[9px] text-emerald-400 font-bold">Northing</span>
                    <span className="text-white font-semibold truncate">{pinpointCoords.n}</span>
                  </div>
                  <div className="flex flex-col bg-slate-950 p-1.5 rounded border border-slate-800">
                    <span className="text-[9px] text-blue-400 font-bold">Elevation</span>
                    <span className="text-white font-semibold truncate">{pinpointCoords.el}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                  <span>Modo: Rectangular</span>
                  <span className="text-amber-400">Lock: E / EL Activo</span>
                </div>
              </div>
            )}

            {/* SVG Renderizado de Geometría Interactiva de Planta */}
            <svg
              className="w-full h-full cursor-crosshair"
              viewBox="0 0 800 460"
              preserveAspectRatio="xMidYMid meet"
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 800);
                const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 460);
                setPinpointCoords({
                  e: `${(100 + (clickX - 400) / 40).toFixed(3)}m`,
                  n: `${(200 - (clickY - 230) / 40).toFixed(3)}m`,
                  el: '+3.500m'
                });
              }}
            >
              <defs>
                <linearGradient id="eqpGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0e7490" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="pipeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="steelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4338ca" />
                </linearGradient>
              </defs>

              {/* Grillas en Suelo (Grid Lines) */}
              <g stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4">
                <line x1="100" y1="360" x2="700" y2="360" />
                <line x1="140" y1="320" x2="740" y2="320" />
                <line x1="180" y1="280" x2="780" y2="280" />
                <line x1="200" y1="200" x2="200" y2="420" />
                <line x1="360" y1="200" x2="360" y2="420" />
                <line x1="520" y1="200" x2="520" y2="420" />
                <line x1="680" y1="200" x2="680" y2="420" />
              </g>

              {/* Etiquetas de Ejes */}
              <g fill="#64748b" fontFamily="monospace" fontSize="11" fontWeight="bold">
                <text x="195" y="440">EJE 1</text>
                <text x="355" y="440">EJE 2</text>
                <text x="515" y="440">EJE 3</text>
                <text x="675" y="440">EJE 4</text>
                <text x="80" y="365">EJE A</text>
                <text x="120" y="325">EJE B</text>
                <text x="160" y="285">EJE C</text>
              </g>

              {/* Columna A1 */}
              {(visibleFilter === 'all' || visibleFilter === 'structure') && (
                <g
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedElement(INITIAL_ELEMENTS[2])}
                >
                  <rect x="350" y="160" width="16" height="200" fill="url(#steelGrad)" rx="2" />
                  <rect x="344" y="356" width="28" height="8" fill="#94a3b8" rx="1" />
                  <title>Columna W12x65 Eje A-1</title>
                </g>
              )}

              {/* Columna A2 */}
              {(visibleFilter === 'all' || visibleFilter === 'structure') && (
                <g
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedElement(INITIAL_ELEMENTS[3])}
                >
                  <rect x="510" y="160" width="16" height="200" fill="url(#steelGrad)" rx="2" />
                  <rect x="504" y="356" width="28" height="8" fill="#94a3b8" rx="1" />
                  <title>Columna W12x65 Eje A-2</title>
                </g>
              )}

              {/* Viga Transversal W10x49 */}
              {(visibleFilter === 'all' || visibleFilter === 'structure') && (
                <g
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedElement(INITIAL_ELEMENTS[4])}
                >
                  <rect x="350" y="160" width="176" height="14" fill="#818cf8" rx="1" />
                  <line x1="350" y1="167" x2="526" y2="167" stroke="#c7d2fe" strokeWidth="1" strokeDasharray="3 3" />
                  <title>Viga W10x49 (Cota EL +6.00m)</title>
                </g>
              )}

              {/* Torre Vertical T-101 */}
              {(visibleFilter === 'all' || visibleFilter === 'equipment') && (
                <g
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedElement(INITIAL_ELEMENTS[0])}
                >
                  {/* Faldón Base */}
                  <path d="M 170 360 L 230 360 L 225 330 L 175 330 Z" fill="#334155" />
                  {/* Cuerpo Cilíndrico */}
                  <rect x="175" y="100" width="50" height="230" fill="url(#eqpGrad)" rx="3" />
                  {/* Cabezal Torisférico Superior */}
                  <ellipse cx="200" cy="100" rx="25" ry="12" fill="#06b6d4" />
                  {/* Boquilla N1 (4" 300#) */}
                  <rect x="225" y="240" width="20" height="8" fill="#22d3ee" />
                  <rect x="245" y="236" width="5" height="16" fill="#67e8f9" />
                  <circle cx="247" cy="244" r="3" fill="#0f172a" />
                  {/* Boquilla N2 (6" 150#) */}
                  <rect x="225" y="150" width="18" height="10" fill="#22d3ee" />
                  <rect x="243" y="145" width="5" height="20" fill="#67e8f9" />
                  <title>T-101 (Torre de Fraccionamiento)</title>
                </g>
              )}

              {/* Bomba Centrífuga P-101A */}
              {(visibleFilter === 'all' || visibleFilter === 'equipment') && (
                <g
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedElement(INITIAL_ELEMENTS[1])}
                >
                  <rect x="630" y="340" width="60" height="20" fill="#1e293b" rx="2" />
                  <rect x="635" y="315" width="30" height="25" fill="#38bdf8" rx="2" />
                  <circle cx="650" cy="327" r="10" fill="#0284c7" />
                  {/* Boquilla Succión */}
                  <rect x="620" y="323" width="15" height="8" fill="#7dd3fc" />
                  <rect x="618" y="319" width="3" height="16" fill="#bae6fd" />
                  <title>P-101A Bomba Centrífuga Sulzer</title>
                </g>
              )}

              {/* Tubería Ruteada 4"-P-204 */}
              {(visibleFilter === 'all' || visibleFilter === 'piping') && (
                <g
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedElement(INITIAL_ELEMENTS[5])}
                >
                  {/* Tramo 1: Desde N1 hacia el Este */}
                  <path
                    d="M 250 244 L 430 244 L 430 180 L 610 180 L 610 327 L 618 327"
                    fill="none"
                    stroke="url(#pipeGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Codos Destacados */}
                  <circle cx="430" cy="244" r="5" fill="#34d399" />
                  <circle cx="430" cy="180" r="5" fill="#34d399" />
                  <circle cx="610" cy="180" r="5" fill="#34d399" />
                  <circle cx="610" cy="327" r="5" fill="#34d399" />

                  {/* Válvula de Compuerta en Tubería con Volante */}
                  <g transform="translate(320, 244)">
                    <polygon points="-8,-6 8,6 8,-6 -8,6" fill="#facc15" />
                    <line x1="0" y1="0" x2="0" y2="-12" stroke="#facc15" strokeWidth="2" />
                    <ellipse cx="0" cy="-13" rx="7" ry="2.5" fill="#ca8a04" stroke="#fef08a" strokeWidth="1" />
                  </g>
                  <title>4"-P-204-1C0031-CS</title>
                </g>
              )}

              {/* Soporte U-Shape en Viga W10x49 */}
              {(visibleFilter === 'all' || visibleFilter === 'piping') && (
                <g
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedElement(INITIAL_ELEMENTS[6])}
                >
                  <path d="M 425 174 L 425 190 L 435 190 L 435 174" fill="none" stroke="#f59e0b" strokeWidth="3" />
                  <rect x="422" y="171" width="16" height="3" fill="#fbbf24" />
                  <title>Soporte U-Shape L2x2x1/8</title>
                </g>
              )}

              {/* Bandeja Eléctrica 24" en Nivel Superior */}
              {(visibleFilter === 'all') && (
                <g
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedElement(INITIAL_ELEMENTS[7])}
                >
                  <rect x="300" y="125" width="380" height="12" fill="#ca8a04" opacity="0.85" rx="1" />
                  {/* Peldaños de Escalerilla */}
                  {Array.from({ length: 15 }).map((_, i) => (
                    <line key={i} x1={310 + i * 25} y1="125" x2={310 + i * 25} y2="137" stroke="#fef08a" strokeWidth="1.5" />
                  ))}
                  <title>Bandeja Eléctrica 24" x 4"</title>
                </g>
              )}

              {/* Marcador de Selección / Halo */}
              {selectedElement && selectedElement.id === 't-101' && (
                <rect x="170" y="90" width="60" height="275" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 4" rx="4" />
              )}
              {selectedElement && selectedElement.id === 'pipe-4in' && (
                <circle cx="320" cy="244" r="16" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="3 3" />
              )}
            </svg>

            {/* Vista Cuádruple (Quad Layout) cuando se activa modo 4 ventanas */}
            {activeWindowLayout === 'quad' && (
              <div className="absolute inset-0 bg-slate-950/95 grid grid-cols-2 grid-rows-2 gap-1 p-2 font-mono text-xs z-30">
                <div className="border border-cyan-500/40 rounded p-2 flex flex-col justify-between bg-slate-900/60">
                  <span className="text-cyan-400 font-bold">// 1. Isometric (Focal Model 3D)</span>
                  <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                    Perspectiva Axonométrica E/N/EL
                  </div>
                  <span className="text-[10px] text-slate-400">Fit All | Active Window [F11]</span>
                </div>
                <div className="border border-slate-700/60 rounded p-2 flex flex-col justify-between bg-slate-900/40">
                  <span className="text-emerald-400 font-bold">// 2. Plan (Top View X-Y)</span>
                  <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                    Planta Ortogonal Cota +6.000m
                  </div>
                  <span className="text-[10px] text-slate-400">Looking Down</span>
                </div>
                <div className="border border-slate-700/60 rounded p-2 flex flex-col justify-between bg-slate-900/40">
                  <span className="text-indigo-400 font-bold">// 3. Elevation Looking North</span>
                  <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                    Elevación Eje A (Plano X-Z)
                  </div>
                  <span className="text-[10px] text-slate-400">Looking North (0°)</span>
                </div>
                <div className="border border-slate-700/60 rounded p-2 flex flex-col justify-between bg-slate-900/40">
                  <span className="text-amber-400 font-bold">// 4. Elevation Looking East</span>
                  <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                    Elevación Eje 2 (Plano Y-Z)
                  </div>
                  <span className="text-[10px] text-slate-400">Looking East (90°)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel Inspector de Propiedades SP3D (SQL Database Object Attributes) */}
        <div className="lg:col-span-3 flex flex-col gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <i className="fa-solid fa-circle-info text-cyan-400"></i>
              <span>INSPECTOR DE PROPIEDADES</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              Database Sync
            </span>
          </div>

          {selectedElement ? (
            <div className="flex flex-col gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Elemento Seleccionado</span>
                <p className="text-sm font-bold text-white mt-0.5 leading-snug">{selectedElement.name}</p>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase">Sistema Padre (Hierarchy)</span>
                  <span className="text-cyan-300 font-semibold">{selectedElement.system}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase">Especificación de Catálogo</span>
                  <span className="text-emerald-300 font-semibold">{selectedElement.spec}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase">Cota de Elevación (T.O.S. / C.L.)</span>
                  <span className="text-amber-300 font-semibold">{selectedElement.elevation}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase">Coordenadas de Referencia</span>
                  <span className="text-slate-300">{selectedElement.coordinates}</span>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Nota de Ingeniería</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed mt-1 font-sans">
                    {selectedElement.description}
                  </p>
                </div>
              </div>

              <div className="mt-2 p-2 bg-blue-950/40 border border-blue-500/30 rounded-lg text-[10px] text-blue-200">
                <i className="fa-solid fa-lock mr-1 text-blue-400"></i>
                <span>Permission Group: <strong>Layout_Engineering</strong> (Lectura/Escritura activa).</span>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs font-mono">
              <i className="fa-solid fa-arrow-pointer text-2xl mb-2 text-slate-600 block"></i>
              Haz clic en cualquier equipo, cañería o viga del viewport para inspeccionar sus datos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
