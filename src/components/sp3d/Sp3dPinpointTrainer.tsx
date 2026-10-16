import React, { useState } from 'react';

interface Challenge {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly targetInitial: { readonly e: number; readonly n: number; readonly el: number };
  readonly expectedDelta: { readonly de: number; readonly dn: number; readonly del: number };
  readonly requiredLocks: { readonly e: boolean; readonly n: boolean; readonly el: boolean };
  readonly hint: string;
}

const CHALLENGES: readonly Challenge[] = [
  {
    id: 'ch-1',
    title: 'Desafío 1: Ruteo Horizontal hacia el Este desde Boquilla N1',
    description: 'Establece el Target en la boquilla N1 (E: 100.00, N: 200.00, EL: 3.50), bloquea Elevation (EL) para mantener nivel y avanza exactamente +4.000m en Easting.',
    targetInitial: { e: 100, n: 200, el: 3.5 },
    expectedDelta: { de: 4, dn: 0, del: 0 },
    requiredLocks: { e: false, n: true, el: true },
    hint: 'Bloquea Northing y Elevation para forzar al cursor a moverse únicamente en el eje Este-Oeste.'
  },
  {
    id: 'ch-2',
    title: 'Desafío 2: Subida Vertical de Cañería hacia Rack Superior',
    description: 'Desde la posición actual, bloquea Easting y Northing para elevar la cañería verticalmente +2.800m hasta la cota de rack EL +6.300m.',
    targetInitial: { e: 104, n: 200, el: 3.5 },
    expectedDelta: { de: 0, dn: 0, del: 2.8 },
    requiredLocks: { e: true, n: true, el: false },
    hint: 'Al bloquear E y N, cualquier movimiento del mouse solo incrementará o decrementará la cota vertical EL.'
  },
  {
    id: 'ch-3',
    title: 'Desafío 3: Cruce hacia el Norte en Rack Principal',
    description: 'Con el target fijado a EL +6.300m, bloquea Elevation y Easting, y avanza +6.000m hacia el Norte atravesando el vano entre vigas.',
    targetInitial: { e: 104, n: 200, el: 6.3 },
    expectedDelta: { de: 0, dn: 6, del: 0 },
    requiredLocks: { e: true, n: false, el: true },
    hint: 'Mantén bloqueado E y EL. Ingresa dN = 6.000m en la casilla de delta Northing.'
  }
];

export const Sp3dPinpointTrainer: React.FC = () => {
  const [activeChallengeIndex, setActiveChallengeIndex] = useState<number>(0);
  const currentChallenge = CHALLENGES[activeChallengeIndex];

  // Coordenadas del Target (Origen relativo)
  const [targetPos, setTargetPos] = useState(currentChallenge.targetInitial);

  // Desplazamientos Delta (dE, dN, dEL)
  const [deltaE, setDeltaE] = useState<number>(0);
  const [deltaN, setDeltaN] = useState<number>(0);
  const [deltaEL, setDeltaEL] = useState<number>(0);

  // Bloqueos de Ejes (Locks)
  const [isLockE, setIsLockE] = useState<boolean>(false);
  const [isLockN, setIsLockN] = useState<boolean>(false);
  const [isLockEL, setIsLockEL] = useState<boolean>(false);

  // Modo: 'relative' (delta dE, dN, dEL) | 'absolute' (coordenadas globales)
  const [coordMode, setCoordMode] = useState<'relative' | 'absolute'>('relative');

  // Estado de éxito del desafío
  const [challengeCompleted, setChallengeCompleted] = useState<Record<string, boolean>>({});
  const [validationFeedback, setValidationFeedback] = useState<string | null>(null);

  // Coordenadas Absolutas Calculadas
  const absE = (targetPos.e + deltaE).toFixed(3);
  const absN = (targetPos.n + deltaN).toFixed(3);
  const absEL = (targetPos.el + deltaEL).toFixed(3);

  // Distancia 3D euclidiana
  const dist3D = Math.sqrt(deltaE * deltaE + deltaN * deltaN + deltaEL * deltaEL).toFixed(3);

  const handleValidateChallenge = () => {
    const isEValid = Math.abs(deltaE - currentChallenge.expectedDelta.de) < 0.05;
    const isNValid = Math.abs(deltaN - currentChallenge.expectedDelta.dn) < 0.05;
    const isELValid = Math.abs(deltaEL - currentChallenge.expectedDelta.del) < 0.05;

    const areLocksCompliant =
      (!currentChallenge.requiredLocks.e || isLockE) &&
      (!currentChallenge.requiredLocks.n || isLockN) &&
      (!currentChallenge.requiredLocks.el || isLockEL);

    if (isEValid && isNValid && isELValid && areLocksCompliant) {
      setChallengeCompleted(prev => ({ ...prev, [currentChallenge.id]: true }));
      setValidationFeedback('¡Excelente! Cumpliste con precisión milimétrica y los bloqueos requeridos por la norma SP3D.');
      return;
    }

    if (!areLocksCompliant) {
      setValidationFeedback('Las coordenadas son cercanas, pero olvidaste activar los bloqueos (Locks) requeridos para asegurar la ortogonalidad.');
      return;
    }

    setValidationFeedback(`Discrepancia en coordenadas. Esperado: dE=${currentChallenge.expectedDelta.de}m, dN=${currentChallenge.expectedDelta.dn}m, dEL=${currentChallenge.expectedDelta.del}m. Actual: dE=${deltaE.toFixed(2)}m, dN=${deltaN.toFixed(2)}m, dEL=${deltaEL.toFixed(2)}m.`);
  };

  const handleSelectChallenge = (index: number) => {
    setActiveChallengeIndex(index);
    const ch = CHALLENGES[index];
    setTargetPos(ch.targetInitial);
    setDeltaE(0);
    setDeltaN(0);
    setDeltaEL(0);
    setIsLockE(ch.requiredLocks.e);
    setIsLockN(ch.requiredLocks.n);
    setIsLockEL(ch.requiredLocks.el);
    setValidationFeedback(null);
  };

  return (
    <div className="flex flex-col gap-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      {/* Encabezado del Entrenador PinPoint */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
              <i className="fa-solid fa-crosshairs mr-1"></i> SP3D PRECISION TOOL // PINPOINT [F9]
            </span>
            <span className="text-xs font-mono text-slate-400">
              // Control de Coordenadas Relativas dE, dN, dEL
            </span>
          </div>
          <h3 className="text-xl font-black text-white mt-1 font-grotesk">
            Simulador Interactivo de Coordenadas PinPoint
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
            PinPoint es el corazón de la precisión en SmartPlant 3D. A diferencia del dibujo libre, en plantas químicas y de minería
            cada codo y boquilla se posiciona bloqueando ejes y fijando desplazamientos relativos desde un punto Target conocido.
          </p>
        </div>

        {/* Progreso de Desafíos */}
        <div className="flex items-center gap-2">
          {CHALLENGES.map((ch, idx) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => handleSelectChallenge(idx)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeChallengeIndex === idx
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400'
                  : challengeCompleted[ch.id]
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {challengeCompleted[ch.id] ? (
                <i className="fa-solid fa-circle-check text-emerald-400"></i>
              ) : (
                <span>#{idx + 1}</span>
              )}
              <span className="hidden sm:inline">Desafío {idx + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tarjeta del Desafío Activo */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
            <i className="fa-solid fa-bullseye"></i> {currentChallenge.title}
          </div>
          <p className="text-sm text-slate-200 mt-1 leading-relaxed">{currentChallenge.description}</p>
          <p className="text-xs text-slate-400 mt-1 italic">
            <i className="fa-solid fa-lightbulb text-amber-400 mr-1"></i> Pista: {currentChallenge.hint}
          </p>
        </div>

        <button
          type="button"
          onClick={handleValidateChallenge}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl font-mono text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <i className="fa-solid fa-check-double"></i> Validar Posición
        </button>
      </div>

      {validationFeedback && (
        <div
          className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
            challengeCompleted[currentChallenge.id]
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
          }`}
        >
          <i
            className={`fa-solid ${
              challengeCompleted[currentChallenge.id] ? 'fa-circle-check text-emerald-400' : 'fa-circle-exclamation text-rose-400'
            } text-base`}
          ></i>
          <span>{validationFeedback}</span>
        </div>
      )}

      {/* Panel del Controlador PinPoint (Copia fiel de la barra flotante de SP3D) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lado Izquierdo: Controles Numéricos y Bloqueos de Ejes */}
        <div className="lg:col-span-6 flex flex-col gap-4 bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                BARRA FLOTANTE PINPOINT
              </span>
            </div>
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setCoordMode('relative')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono ${
                  coordMode === 'relative' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Relativo (Δ)
              </button>
              <button
                type="button"
                onClick={() => setCoordMode('absolute')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono ${
                  coordMode === 'absolute' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Absoluto
              </button>
            </div>
          </div>

          {/* Fila Target de Origen */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">
                <i className="fa-solid fa-location-crosshairs mr-1"></i> TARGET:
              </span>
              <span className="text-slate-300">
                E: <strong>{targetPos.e.toFixed(2)}m</strong> | N: <strong>{targetPos.n.toFixed(2)}m</strong> | EL:{' '}
                <strong>{targetPos.el.toFixed(2)}m</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setTargetPos(currentChallenge.targetInitial);
                setDeltaE(0);
                setDeltaN(0);
                setDeltaEL(0);
              }}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              title="Restaurar Target al origen de la boquilla"
            >
              Reset Target
            </button>
          </div>

          {/* Entradas de Coordenadas con Botón de Bloqueo (Lock) */}
          <div className="space-y-3 font-mono">
            {/* Eje Easting (E) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsLockE(prev => !prev)}
                className={`w-24 px-2 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isLockE
                    ? 'bg-red-500 text-white border-red-400 shadow-md shadow-red-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-red-400'
                }`}
                title="Bloquear Eje Easting (Alt + E)"
              >
                <i className={`fa-solid ${isLockE ? 'fa-lock' : 'fa-lock-open'}`}></i>
                <span>Lock E</span>
              </button>
              <div className="flex-1 flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 focus-within:border-amber-400">
                <span className="text-red-400 text-xs font-bold mr-2">dE (m):</span>
                <input
                  type="number"
                  step="0.5"
                  value={deltaE}
                  onChange={e => setDeltaE(parseFloat(e.target.value) || 0)}
                  disabled={isLockE}
                  className="w-full bg-transparent text-white text-sm outline-none disabled:opacity-40"
                />
              </div>
              <span className="text-xs text-slate-400 w-24 text-right">Abs: {absE}m</span>
            </div>

            {/* Eje Northing (N) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsLockN(prev => !prev)}
                className={`w-24 px-2 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isLockN
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-emerald-400'
                }`}
                title="Bloquear Eje Northing (Alt + N)"
              >
                <i className={`fa-solid ${isLockN ? 'fa-lock' : 'fa-lock-open'}`}></i>
                <span>Lock N</span>
              </button>
              <div className="flex-1 flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 focus-within:border-amber-400">
                <span className="text-emerald-400 text-xs font-bold mr-2">dN (m):</span>
                <input
                  type="number"
                  step="0.5"
                  value={deltaN}
                  onChange={e => setDeltaN(parseFloat(e.target.value) || 0)}
                  disabled={isLockN}
                  className="w-full bg-transparent text-white text-sm outline-none disabled:opacity-40"
                />
              </div>
              <span className="text-xs text-slate-400 w-24 text-right">Abs: {absN}m</span>
            </div>

            {/* Eje Elevation (EL) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsLockEL(prev => !prev)}
                className={`w-24 px-2 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isLockEL
                    ? 'bg-blue-500 text-white border-blue-400 shadow-md shadow-blue-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-blue-400'
                }`}
                title="Bloquear Elevación (Alt + L)"
              >
                <i className={`fa-solid ${isLockEL ? 'fa-lock' : 'fa-lock-open'}`}></i>
                <span>Lock EL</span>
              </button>
              <div className="flex-1 flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 focus-within:border-amber-400">
                <span className="text-blue-400 text-xs font-bold mr-2">dEL (m):</span>
                <input
                  type="number"
                  step="0.5"
                  value={deltaEL}
                  onChange={e => setDeltaEL(parseFloat(e.target.value) || 0)}
                  disabled={isLockEL}
                  className="w-full bg-transparent text-white text-sm outline-none disabled:opacity-40"
                />
              </div>
              <span className="text-xs text-slate-400 w-24 text-right">Abs: {absEL}m</span>
            </div>
          </div>

          {/* Datos Calculados de Vector */}
          <div className="mt-2 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>
              Distancia Vectorial (3D): <strong className="text-amber-300 font-bold">{dist3D} m</strong>
            </span>
            <span className="text-cyan-400">Paso de Snap: 0.100 m</span>
          </div>
        </div>

        {/* Lado Derecho: Visualizador Gráfico 2D/3D del Vector PinPoint */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="relative w-full h-[320px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-2">
            {/* Cuadrícula */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(to right, #f59e0b 1px, transparent 1px)',
                backgroundSize: '25px 25px'
              }}
            />

            <svg className="w-full h-full" viewBox="0 0 400 300">
              {/* Origen Target */}
              <g transform="translate(140, 200)">
                {/* Círculos concéntricos de diana */}
                <circle cx="0" cy="0" r="14" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="0" cy="0" r="6" fill="#f59e0b" />
                <line x1="-20" y1="0" x2="20" y2="0" stroke="#f59e0b" strokeWidth="1" />
                <line x1="0" y1="-20" x2="0" y2="20" stroke="#f59e0b" strokeWidth="1" />
                <text x="15" y="-10" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  TARGET (0,0,0)
                </text>
              </g>

              {/* Vector de Desplazamiento */}
              {(() => {
                const startX = 140;
                const startY = 200;
                const endX = startX + deltaE * 25;
                const endY = startY - deltaN * 20 - deltaEL * 15;
                return (
                  <g>
                    {/* Línea de proyección proyectada */}
                    <line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke="#22d3ee"
                      strokeWidth="3"
                      strokeDasharray={dist3D === '0.000' ? 'none' : 'none'}
                    />
                    {/* Punto Cursor Actual */}
                    <circle cx={endX} cy={endY} r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                    <text
                      x={endX + 10}
                      y={endY + 5}
                      fill="#38bdf8"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      P(Δ: {deltaE}, {deltaN}, {deltaEL})
                    </text>
                  </g>
                );
              })()}

              {/* Guías de Bloqueo de Ejes */}
              {isLockEL && (
                <text x="10" y="25" fill="#60a5fa" fontSize="10" fontFamily="monospace">
                  🔒 COTA BLOQUEADA: EL {targetPos.el.toFixed(2)}m
                </text>
              )}
              {isLockN && (
                <text x="10" y="40" fill="#34d399" fontSize="10" fontFamily="monospace">
                  🔒 EJE NORTH BLOQUEADO
                </text>
              )}
              {isLockE && (
                <text x="10" y="55" fill="#f87171" fontSize="10" fontFamily="monospace">
                  🔒 EJE EAST BLOQUEADO
                </text>
              )}
            </svg>

            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-500">
              Escala de Gráfico: 1m = 25px
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-amber-400 font-bold block mb-1">
              <i className="fa-solid fa-graduation-cap mr-1"></i> Regla de Oro del Proyectista Senior:
            </span>
            Nunca hagas clic en el vacío tridimensional. Primero posiciona el Target en un punto de referencia conocido
            (Nozzle, Grid Intersection o extremo de viga con <strong>Alt + Clic</strong>), activa los bloqueos necesarios
            y digita la distancia exacta.
          </div>
        </div>
      </div>
    </div>
  );
};
