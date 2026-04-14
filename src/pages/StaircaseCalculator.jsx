import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

export default function StaircaseCalculator() {
  const [tipoConnection, setTipoConnection] = useState("tipo1");
  
  // Shared Parameters
  const [targetContrahuella, setTargetContrahuella] = useState(180);
  const [huella, setHuella] = useState(250);

  // Tipo 1 (Parrilla a Parrilla)
  const [t1Ta1, setT1Ta1] = useState(10.00);
  const [t1Esp1, setT1Esp1] = useState(30);
  const [t1Ta2, setT1Ta2] = useState(7.00);
  const [t1Esp2, setT1Esp2] = useState(30);

  // Tipo 2 (Concreto)
  const [t2TcSup, setT2TcSup] = useState(10.00);
  const [t2TcInf, setT2TcInf] = useState(7.00);
  const [t2Hc1, setT2Hc1] = useState(180);

  // Tipo 3 (Mixta con Pedestal)
  const [t3Ta, setT3Ta] = useState(10.00);
  const [t3Esp, setT3Esp] = useState(30);
  const [t3Tc, setT3Tc] = useState(7.00);
  const [t3HHormigon, setT3HHormigon] = useState(300);
  const [t3Hc1, setT3Hc1] = useState(180);

  // Calculation Results
  const results = useMemo(() => {
    let alturaTotal = 0; 
    let numeroPeldanos = 0; 
    let contrahuellaCalculada = 0; 
    let angulo = 0; 
    let longitudMedia = 0;

    if (tipoConnection === 'tipo1') {
      alturaTotal = ((t1Ta1 + (t1Esp1 * 0.001)) - (t1Ta2 + (t1Esp2 * 0.001))) * 1000;
      numeroPeldanos = Math.round(alturaTotal / targetContrahuella);
      contrahuellaCalculada = numeroPeldanos > 0 ? alturaTotal / numeroPeldanos : 0;
      longitudMedia = huella * numeroPeldanos;
    } else if (tipoConnection === 'tipo2') {
      alturaTotal = (t2TcSup - t2TcInf) * 1000;
      numeroPeldanos = Math.round(alturaTotal / targetContrahuella);
      const alturaRestante = alturaTotal - t2Hc1;
      const peldanosRestantes = numeroPeldanos - 1;
      
      contrahuellaCalculada = peldanosRestantes > 0 ? alturaRestante / peldanosRestantes : 0;
      longitudMedia = huella * peldanosRestantes;
    } else if (tipoConnection === 'tipo3') {
      alturaTotal = ((t3Ta + (t3Esp * 0.001)) - t3Tc) * 1000;
      numeroPeldanos = Math.round((alturaTotal - t3HHormigon) / targetContrahuella);
      const alturaRestante = alturaTotal - t3HHormigon - t3Hc1;
      const peldanosRestantes = numeroPeldanos - 1;

      contrahuellaCalculada = peldanosRestantes > 0 ? alturaRestante / peldanosRestantes : 0;
      longitudMedia = huella * peldanosRestantes; 
    }

    angulo = huella > 0 ? (Math.atan(contrahuellaCalculada / huella) * (180 / Math.PI)) : 0;
    const chVal = Math.abs(contrahuellaCalculada);
    const comod = (2 * chVal) + huella;
    const segur = chVal + huella;

    return {
      alturaTotal: Math.abs(alturaTotal),
      numeroPeldanos,
      contrahuellaCalculada: chVal,
      angulo,
      longitudMedia: Math.abs(longitudMedia),
      comodidad: comod,
      seguridad: segur
    };
  }, [tipoConnection, targetContrahuella, huella, t1Ta1, t1Esp1, t1Ta2, t1Esp2, t2TcSup, t2TcInf, t2Hc1, t3Ta, t3Esp, t3Tc, t3HHormigon, t3Hc1]);

  // SVG Generation block
  const SvgDiagram = () => {
    const W = 800, H = 350;
    const xStart = 200, yStart = 80;
    const xEnd = 600, yEnd = 260;
    
    // Variables for rendering properly inside useMemo layout rules
    const s = {
      ta1: t1Ta1, ta2: t1Ta2,
      tcSup: t2TcSup, tcInf: t2TcInf,
      hHormigon: t3HHormigon, hc1: tipoConnection === 'tipo2' ? t2Hc1 : t3Hc1,
      huella: huella,
      contrahuella: results.contrahuellaCalculada,
      alturaTotal: results.alturaTotal,
      numPeldanos: results.numeroPeldanos,
      longitudMedia: results.longitudMedia,
      ta: t3Ta // mapped for 3
    };

    const stepCount = Math.max(1, s.numPeldanos);
    const stairRisingsCount = tipoConnection === 'tipo1' ? stepCount : Math.max(1, stepCount - 1);
    const stepW = (xEnd - xStart) / stairRisingsCount;
    // ensure valid rendering
    const stepH = stairRisingsCount === 0 || !isFinite(stairRisingsCount) ? 0 : (yEnd - yStart) / stairRisingsCount;
    
    const lColor = "#3b82f6", sColor = "#6b7280", tColor = "#9ca3af", vColor = "#eff6ff";
    let topOff = 6, botOff = 22;

    const ptCallout = (x, y, label="P.T.", dx=-30, dy=-30) => (
      <g>
        <circle cx={x} cy={y} r="2.5" fill={vColor}/>
        <line x1={x} y1={y} x2={x+dx} y2={y+dy} stroke={tColor} strokeWidth="1"/>
        <line x1={x+dx} y1={y+dy} x2={x+dx+(dx>0?20:-20)} y2={y+dy} stroke={tColor} strokeWidth="1"/>
        <text x={x+dx+(dx>0?10:-10)} y={y+dy-4} fill={vColor} fontSize="11px" fontFamily="monospace" textAnchor="middle">{label}</text>
      </g>
    );

    const elMarker = (x, y, elStr, labelStr, dirX=-1) => {
      const hLineY = y - 45;
      const lx = x + (150 * dirX);
      const tX = x + (8 * dirX);
      const tAnchor = dirX === -1 ? "end" : "start";
      const val = parseFloat(elStr);
      const formattedEl = "EL. " + (val > 0 ? '+' : '') + String(val.toFixed(3)).replace('.', ',');
      return (
        <g>
          <line x1={x-15} y1={y} x2={x+15} y2={y} stroke={vColor} strokeWidth="1"/>
          <polygon points={`${x},${y} ${x-8},${y-14} ${x},${y-14}`} fill="none" stroke={vColor} strokeWidth="1"/>
          <polygon points={`${x},${y} ${x+8},${y-14} ${x},${y-14}`} fill={vColor} stroke={vColor} strokeWidth="1"/>
          <line x1={x-8} y1={y-14} x2={x+8} y2={y-14} stroke={vColor} strokeWidth="1"/>
          <line x1={x} y1={y-14} x2={x} y2={hLineY} stroke={vColor} strokeWidth="1"/>
          <line x1={x} y1={hLineY} x2={lx} y2={hLineY} stroke={vColor} strokeWidth="1"/>
          <text x={tX} y={hLineY - 6} fill={vColor} fontSize="11px" fontFamily="monospace" textAnchor={tAnchor}>{formattedEl}</text>
          <text x={tX} y={hLineY + 12} fill={vColor} fontSize="11px" fontFamily="monospace" textAnchor={tAnchor}>{labelStr}</text>
        </g>
      );
    }

    const DimLineH = ({x1, x2, y, text}) => (
      <g>
        <line x1={x1} y1={y-5} x2={x1} y2={y+5} stroke={tColor} strokeWidth="1" />
        <line x1={x2} y1={y-5} x2={x2} y2={y+5} stroke={tColor} strokeWidth="1" />
        <line x1={x1} y1={y} x2={x2} y2={y} stroke={tColor} strokeWidth="1" />
        <text x={(x1+x2)/2} y={y-8} fill={vColor} fontSize="11px" fontFamily="monospace" textAnchor="middle">{text}</text>
      </g>
    );

    const DimLineV = ({x, y1, y2, text}) => (
      <g>
        <line x1={x-5} y1={y1} x2={x+5} y2={y1} stroke={tColor} strokeWidth="1" />
        <line x1={x-5} y1={y2} x2={x+5} y2={y2} stroke={tColor} strokeWidth="1" />
        <line x1={x} y1={y1} x2={x} y2={y2} stroke={tColor} strokeWidth="1" />
        <text x={x-8} y={(y1+y2)/2} fill={vColor} fontSize="11px" fontFamily="monospace" textAnchor="middle" transform={`rotate(-90 ${x-8} ${(y1+y2)/2})`}>{text}</text>
      </g>
    );

    // Calculate generic stringer components
    let hChD = 14; 
    let hBotY_s = yStart - topOff + hChD; 
    let hBotY_e = yEnd - topOff + hChD;
    
    const stepsArray = Array.from({length: stairRisingsCount-1}, (_, i) => i+1);

    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" className="fade-in font-sans">
        <defs>
          <pattern id="hatch-acero" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="#3b82f6" strokeWidth="0.8" opacity="0.45"/>
          </pattern>
        </defs>

        {tipoConnection === 'tipo1' && (
          <g>
            <line x1={xStart-100} y1={yStart-topOff-6} x2={xStart} y2={yStart-topOff-6} stroke={sColor} strokeWidth="1.5" />
            <line x1={xStart-100} y1={yStart-topOff} x2={xStart} y2={yStart-topOff} stroke={sColor} strokeWidth="1.5" />
            <line x1={xEnd} y1={yEnd-topOff-6} x2={xEnd+100} y2={yEnd-topOff-6} stroke={sColor} strokeWidth="1.5" />
            <line x1={xEnd} y1={yEnd-topOff} x2={xEnd+100} y2={yEnd-topOff} stroke={sColor} strokeWidth="1.5" />
            
            <line x1={xStart} y1={yStart} x2={xEnd} y2={yEnd} stroke="#ef4444" strokeDasharray="8,5" opacity="0.8" strokeWidth="1.2" />
            
            {/* Stringer Top y Base */}
            <line x1={xStart} y1={yStart-topOff} x2={xEnd} y2={yEnd-topOff} stroke={lColor} strokeWidth="1.5" />
            <line x1={xStart} y1={yStart+botOff} x2={xEnd} y2={yEnd+botOff} stroke={lColor} strokeWidth="1.5" />

            {/* Steps */}
            {stepsArray.map(i => (
              <rect key={i} x={xStart + i*stepW - stepW} y={yStart + i*stepH} width={stepW} height="6" fill="none" stroke={lColor} strokeWidth="1.5" />
            ))}

            {/* Joints T1 */}
            <line x1={xStart-100} y1={yStart-topOff} x2={xStart} y2={yStart-topOff} stroke={lColor} strokeWidth="1.5" />
            <line x1={xStart-100} y1={hBotY_s} x2={xStart} y2={hBotY_s} stroke={lColor} strokeWidth="1.5" />
            <line x1={xStart} y1={hBotY_s} x2={xStart} y2={yStart+botOff} stroke={lColor} strokeWidth="1.5" />
            
            <line x1={xEnd} y1={yEnd-topOff} x2={xEnd+100} y2={yEnd-topOff} stroke={lColor} strokeWidth="1.5" />
            <line x1={xEnd} y1={hBotY_e} x2={xEnd+100} y2={hBotY_e} stroke={lColor} strokeWidth="1.5" />
            <line x1={xEnd} y1={yEnd+botOff} x2={xEnd} y2={hBotY_e} stroke={lColor} strokeWidth="1.5" />
            
            <DimLineH x1={xStart} x2={xEnd} y={yStart-40} text={`${stepCount} ESP. @ ${s.huella.toFixed(1)} = ${s.longitudMedia.toFixed(1)}`} />
            <DimLineV x={xEnd+65} y1={yStart} y2={yEnd} text={`${stepCount} ESP. @ ${(s.alturaTotal/stepCount).toFixed(1)} = ${s.alturaTotal.toFixed(1)}`} />
            {ptCallout(xStart, yStart, "P.T.", 30, -20)}
            {ptCallout(xEnd, yEnd, "P.T.", -40, -20)}
            
            {elMarker(xStart-100, yStart-topOff-6, s.ta1, "T.G.", -1)}
            {elMarker(xEnd+100, yEnd-topOff-6, s.ta2, "T.G.", 1)}
          </g>
        )}

        {tipoConnection === 'tipo2' && (
          <g>
            <line x1={60} y1={yStart} x2={xStart} y2={yStart} stroke={sColor} strokeWidth="2" />
            <line x1={60} y1={yStart+4} x2={xStart+((yEnd-yStart)/-(xEnd-xStart))*4} y2={yStart+4} stroke={sColor} strokeWidth="2" />
            <line x1={xEnd} y1={yEnd} x2={xEnd+100} y2={yEnd} stroke={sColor} strokeWidth="2" />
            <line x1={xEnd} y1={yEnd+4} x2={xEnd+100} y2={yEnd+4} stroke={sColor} strokeWidth="2" />

            <line x1={xStart} y1={yStart} x2={xEnd} y2={yEnd} stroke="#ef4444" strokeDasharray="8,5" opacity="0.8" strokeWidth="1.2" />

            {/* Stringer Top y Base */}
            <line x1={xStart} y1={yStart-topOff} x2={xEnd} y2={yEnd-topOff} stroke={lColor} strokeWidth="1.5" />
            <line x1={xStart} y1={yStart+botOff} x2={xEnd} y2={yEnd+botOff} stroke={lColor} strokeWidth="1.5" />

            {stepsArray.map(i => (
              <rect key={i} x={xStart + i*stepW - stepW} y={yStart + i*stepH} width={stepW} height="6" fill="none" stroke={lColor} strokeWidth="1.5" />
            ))}

            <DimLineH x1={xStart} x2={xEnd} y={yStart-40} text={`${stairRisingsCount} ESP. @ ${s.huella.toFixed(1)} = ${s.longitudMedia.toFixed(1)}`} />
            <DimLineV x={xEnd+65} y1={yStart} y2={yEnd} text={`${stairRisingsCount} ESP. @ ${s.contrahuella.toFixed(1)} = ${s.alturaTotal.toFixed(1)}`} />
            {ptCallout(xStart, yStart, "P.T.", 30, -20)}
            {ptCallout(xEnd, yEnd, "P.T.", -40, -20)}
            
            {elMarker(xStart-100, yStart, s.tcSup, "T.S.P.", -1)}
            {elMarker(xEnd+100, yEnd, s.tcInf, "T.S.P.", 1)}
          </g>
        )}

        {tipoConnection === 'tipo3' && (
          <g>
            {/* Top Parrilla */}
            <line x1={xStart-100} y1={yStart-topOff-6} x2={xStart} y2={yStart-topOff-6} stroke={sColor} strokeWidth="1.5" />
            <line x1={xStart-100} y1={yStart-topOff} x2={xStart} y2={yStart-topOff} stroke={sColor} strokeWidth="1.5" />

            {/* Bottom Pedestal */}
            <rect x={xEnd-20} y={yEnd} width="40" height={Math.min((s.hHormigon/s.alturaTotal)*200, 50)} fill="#4b5563" stroke="#9ca3af" strokeWidth="1" />
            <rect x={xEnd-80} y={yEnd+Math.min((s.hHormigon/s.alturaTotal)*200, 50)} width="160" height="15" fill={sColor} opacity="0.6"/>

            <line x1={xStart} y1={yStart} x2={xEnd} y2={yEnd} stroke="#ef4444" strokeDasharray="8,5" opacity="0.8" strokeWidth="1.2" />

            <line x1={xStart} y1={yStart-topOff} x2={xEnd} y2={yEnd-topOff} stroke={lColor} strokeWidth="1.5" />
            <line x1={xStart} y1={yStart+botOff} x2={xEnd} y2={yEnd+botOff} stroke={lColor} strokeWidth="1.5" />

            {stepsArray.map(i => (
              <rect key={i} x={xStart + i*stepW - stepW} y={yStart + i*stepH} width={stepW} height="6" fill="none" stroke={lColor} strokeWidth="1.5" />
            ))}

            <line x1={xStart-100} y1={yStart-topOff} x2={xStart} y2={yStart-topOff} stroke={lColor} strokeWidth="1.5" />
            <line x1={xStart-100} y1={hBotY_s} x2={xStart} y2={hBotY_s} stroke={lColor} strokeWidth="1.5" />
            <line x1={xStart} y1={hBotY_s} x2={xStart} y2={yStart+botOff} stroke={lColor} strokeWidth="1.5" />

            <DimLineH x1={xStart} x2={xEnd} y={yStart-40} text={`${stairRisingsCount} ESP. @ ${s.huella.toFixed(1)} = ${s.longitudMedia.toFixed(1)}`} />
            <DimLineV x={xEnd+65} y1={yStart+(s.hc1 > 0 ? (s.hc1/s.alturaTotal)*200 : stepH)} y2={yEnd} text={`${stairRisingsCount} ESP. @ ${s.contrahuella.toFixed(1)} = ${(stairRisingsCount*s.contrahuella).toFixed(1)}`} />
            <DimLineV x={xEnd+105} y1={yStart} y2={yEnd+Math.min((s.hHormigon/s.alturaTotal)*200, 50)} text={s.alturaTotal.toFixed(1)} />

            {ptCallout(xStart, yStart, "P.T.", 30, -20)}
            {elMarker(xStart-100, yStart-topOff-6, t3Ta, "T.G.", -1)}
            {elMarker(xEnd+130, yEnd+Math.min((s.hHormigon/s.alturaTotal)*200, 50), t3Tc, "T.C. o N.T.", 1)}
          </g>
        )}
      </svg>
    )
  };

  return (
    <div className="bg-gray-50 dark:bg-bim-dark text-gray-900 dark:text-gray-300 font-sans min-h-screen pt-24 pb-12 transition-colors duration-300">
      
      {/* Title block */}
      <h1 className="text-center text-4xl font-black mb-4 font-grotesk text-white">Calculadora de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-bim-blue">Escaleras</span></h1>
      
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input column */}
        <div className="lg:col-span-4 bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">TIPO DE CONEXIÓN</label>
          <select 
            value={tipoConnection} 
            onChange={(e) => setTipoConnection(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="tipo1">Parrilla a Parrilla (Estructura de Acero)</option>
            <option value="tipo2">Concreto a Concreto / T.S.P.</option>
            <option value="tipo3">Parrilla a Concreto con Pedestal</option>
          </select>

          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">CRITERIOS PRINCIPALES</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
             <div>
                <label className="block text-xs text-slate-400 mb-1">Contrahuella Deseada</label>
                <input type="number" step="1" value={targetContrahuella} onChange={e=>setTargetContrahuella(parseFloat(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
             </div>
             <div>
                <label className="block text-xs text-slate-400 mb-1">Huella <span className="text-[10px] text-slate-500">(mm)</span></label>
                <input type="number" step="1" value={huella} onChange={e=>setHuella(parseFloat(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
             </div>
          </div>

          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">NIVELES TOPOGRÁFICOS (m)</h3>
          
          {tipoConnection === 'tipo1' && (
            <div className="space-y-4">
               <div>
                 <span className="text-xs text-bim-blue font-bold block mb-2">NIVEL SUPERIOR</span>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="number" title="T.A 1 Superior" step="0.001" value={t1Ta1} onChange={e => setT1Ta1(parseFloat(e.target.value))} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                    <input type="number" title="Espesor Parrilla 1 (mm)" step="1" value={t1Esp1} onChange={e => setT1Esp1(parseFloat(e.target.value))} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                 </div>
               </div>
               <div>
                 <span className="text-xs text-bim-blue font-bold block mb-2">NIVEL INFERIOR</span>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="number" title="T.A 2 Inferior" step="0.001" value={t1Ta2} onChange={e => setT1Ta2(parseFloat(e.target.value))} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                    <input type="number" title="Espesor Parrilla 2 (mm)" step="1" value={t1Esp2} onChange={e => setT1Esp2(parseFloat(e.target.value))} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                 </div>
               </div>
            </div>
          )}

          {tipoConnection === 'tipo2' && (
            <div className="space-y-4">
               <div>
                 <label className="text-xs text-slate-400 block mb-1">Cota T.S.P Superior</label>
                 <input type="number" step="0.001" value={t2TcSup} onChange={e => setT2TcSup(parseFloat(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
               </div>
               <div>
                 <label className="text-xs text-slate-400 block mb-1">Cota T.S.P Inferior</label>
                 <input type="number" step="0.001" value={t2TcInf} onChange={e => setT2TcInf(parseFloat(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
               </div>
               <div>
                 <label className="text-xs text-slate-400 block mb-1">Hc1 - Contrahuella Base (mm)</label>
                 <input type="number" step="1" value={t2Hc1} onChange={e => setT2Hc1(parseFloat(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
               </div>
            </div>
          )}

          {tipoConnection === 'tipo3' && (
            <div className="space-y-4">
               <div>
                 <span className="text-xs text-bim-blue font-bold block mb-2">SUPERIOR (PARRILLA)</span>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="number" title="T.A 1" step="0.001" value={t3Ta} onChange={e => setT3Ta(parseFloat(e.target.value))} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                    <input type="number" title="Espesor Parrilla (mm)" step="1" value={t3Esp} onChange={e => setT3Esp(parseFloat(e.target.value))} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                 </div>
               </div>
               <div>
                 <span className="text-xs text-emerald-500 font-bold block mb-2">INFERIOR (CONCRETO)</span>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="number" title="Cota Losa T.C" step="0.001" value={t3Tc} onChange={e => setT3Tc(parseFloat(e.target.value))} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                    <input type="number" title="Altura Pedestal (mm)" step="1" value={t3HHormigon} onChange={e => setT3HHormigon(parseFloat(e.target.value))} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                 </div>
                 <div className="mt-4">
                   <input type="number" title="Hc1 (Contrahuella inicial mm)" step="1" value={t3Hc1} onChange={e => setT3Hc1(parseFloat(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white" />
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Results & Visuals */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className="bg-[#111827] border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden flex-1 min-h-[400px] flex items-center justify-center">
            {/* SVG Visualizer Canvas */}
            <SvgDiagram />
          </div>

          {/* Results grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 text-center">
               <span className="block text-xs uppercase text-slate-500 font-bold mb-1">Altura Total</span>
               <span className="text-2xl font-bold text-white">{results.alturaTotal.toFixed(0)}</span>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 text-center">
               <span className="block text-xs uppercase text-slate-500 font-bold mb-1">Nº Peldaños</span>
               <span className="text-2xl font-bold text-bim-blue">{results.numeroPeldanos}</span>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 text-center">
               <span className="block text-xs uppercase text-slate-500 font-bold mb-1">C. Huella</span>
               <span className="text-2xl font-bold text-white">{results.contrahuellaCalculada.toFixed(1)}</span>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 text-center">
               <span className="block text-xs uppercase text-slate-500 font-bold mb-1">Ángulo (º)</span>
               <span className="text-2xl font-bold text-white">{results.angulo.toFixed(1)}</span>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 text-center">
               <span className="block text-xs uppercase text-slate-500 font-bold mb-1">Longitud</span>
               <span className="text-2xl font-bold text-white">{results.longitudMedia.toFixed(0)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Blondel */}
             <div className={`p-4 rounded-xl border flex justify-between items-center transition-colors ${results.comodidad > 610 && results.comodidad < 650 ? 'bg-emerald-900/20 border-emerald-800' : 'bg-rose-900/20 border-rose-800'}`}>
                <div>
                  <span className="block text-xs uppercase text-slate-400 font-bold mb-1">Regla de Comodidad (2CH + H)</span>
                  <span className="text-2xl font-bold text-white">{results.comodidad.toFixed(1)}</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${results.comodidad > 610 && results.comodidad < 650 ? 'bg-emerald-800/50 text-emerald-400' : 'bg-rose-800/50 text-rose-400'}`}>
                  {results.comodidad > 610 && results.comodidad < 650 ? "Excelente" : "Alerta"}
                </span>
             </div>
             {/* Security */}
             <div className={`p-4 rounded-xl border flex justify-between items-center transition-colors ${results.seguridad <= 460 ? 'bg-emerald-900/20 border-emerald-800' : 'bg-rose-900/20 border-rose-800'}`}>
                <div>
                  <span className="block text-xs uppercase text-slate-400 font-bold mb-1">Regla de Seguridad (CH + H)</span>
                  <span className="text-2xl font-bold text-white">{results.seguridad.toFixed(1)}</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${results.seguridad <= 460 ? 'bg-emerald-800/50 text-emerald-400' : 'bg-rose-800/50 text-rose-400'}`}>
                  {results.seguridad <= 460 ? "Seguro" : "Inseguro"}
                </span>
             </div>
          </div>

        </div>

      </div>
    </div>
  )
}
