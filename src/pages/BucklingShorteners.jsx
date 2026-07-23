import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ExcelJS from "exceljs";
import { ICHA_CATALOG } from "../data/icha_data";

export default function BucklingShorteners() {
  const [selectedProfileIdx, setSelectedProfileIdx] = useState("");
  const [d, setD] = useState(0);
  const [L, setL] = useState(3000);
  
  // Manual overrides overrides
  const [manualB, setManualB] = useState(80);
  const [manualE, setManualE] = useState(6);
  const [manualR, setManualR] = useState(10);

  const lProfiles = ICHA_CATALOG.L.profiles;

  const currentProfile = useMemo(() => {
    if (selectedProfileIdx === "") return null;
    return lProfiles[parseInt(selectedProfileIdx, 10)];
  }, [selectedProfileIdx, lProfiles]);

  // Sync manual inputs when profile changes
  const activeB = currentProfile ? (currentProfile.B_mm || 80) : manualB;
  const activeE = currentProfile ? (currentProfile.e_mm || 6) : manualE;
  const activeR = currentProfile ? 10 : manualR; // Assuming default 10 for catalog if not spec'd

  const results = useMemo(() => {
    let AL, xL, ivL, IvL;

    if (currentProfile) {
      AL = currentProfile.A_cm2 || currentProfile["A_cm²"]; // Try both property spellings
      xL = currentProfile.xy_cm || currentProfile["x=y_cm"];
      ivL = currentProfile.iv_cm;
      IvL = Math.pow(ivL, 2) * AL;
    } else {
      // Manual calculation formulas from Excel for L
      AL = (activeE * (2 * activeB - activeE) + 0.2146 * (Math.pow(activeR, 2) - 2 * Math.pow(activeR / 2, 2))) / 100;
      xL = (6 * activeE * (activeB * (activeB + activeE) - Math.pow(activeE, 2)) + Math.pow(activeR / 2, 2) * (1.1504 * (activeR / 2) - 2.5752 * (activeB + activeE)) + Math.pow(activeR, 2) * (2.5752 * activeE + 0.5752 * activeR)) / (12 * AL * 1000);
      ivL = (0.197 * activeB) / 10;
      IvL = Math.pow(ivL, 2) * AL;
    }

    // Combined XL Properties (Cruciform at 45°)
    const AXL = 2 * AL;
    const IuXL = 2 * (IvL + AL * Math.pow(1.414 * (xL + d / 20), 2));
    const iuXL = Math.sqrt(IuXL / AXL);

    // Guard: evitar división por cero si iuXL es 0 o no finito
    if (!iuXL || !isFinite(iuXL)) {
      return { AL, xL, ivL, IvL, IuXL, iuXL: 0, lmax: 0, nmin: 0, paramB: activeB, paramE: activeE, paramD: d, paramL: L };
    }

    // Buckling Shorteners
    const lmax = (0.75 * ivL * L) / iuXL;

    const innerTerm = 1 + Math.ceil((L - 1200) / lmax);
    let nmin = innerTerm;
    if (nmin < 2) nmin = 2;         // 1º asegurar mínimo
    if (nmin % 2 === 0) nmin += 1;  // 2º asegurar impar

    return { AL, xL, ivL, IvL, IuXL, iuXL, lmax, nmin, paramB: activeB, paramE: activeE, paramD: d, paramL: L };

  }, [currentProfile, d, L, activeB, activeE, activeR]);

  const profileName = currentProfile ? currentProfile.designation : `Manual ${activeB}x${activeB}x${activeE}`;

  // Svg Builders
  const CrossSectionSVG = () => {
    const size = 300;
    const mid = size / 2;
    const { paramB: B, paramE: e, paramD: d_val } = results;
    
    const totalW = 2 * B + d_val;
    const scale = (size * 0.55) / (totalW || 1);
    const b_px = B * scale;
    const e_px = e * scale;
    const d_px = d_val * scale;

    return (
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#4b5563" />
          </marker>
        </defs>
        
        {/* Axes */}
        <line x1={mid - b_px - d_px / 2 - 20} y1={mid} x2={mid + b_px + d_px / 2 + 20} y2={mid} stroke="#1f2937" strokeWidth="1" strokeDasharray="4" />
        <line x1={mid} y1={mid - b_px - d_px / 2 - 20} x2={mid} y2={mid + b_px + d_px / 2 + 20} stroke="#1f2937" strokeWidth="1" strokeDasharray="4" />

        {/* Angles */}
        <g>
            <path d={`M ${mid + d_px / 2},${mid - d_px / 2} L ${mid + d_px / 2},${mid - d_px / 2 - b_px} L ${mid + d_px / 2 + e_px},${mid - d_px / 2 - b_px} L ${mid + d_px / 2 + e_px},${mid - d_px / 2 - e_px} L ${mid + d_px / 2 + b_px},${mid - d_px / 2 - e_px} L ${mid + d_px / 2 + b_px},${mid - d_px / 2} Z`} fill="url(#grad1)" stroke="#3b82f6" strokeWidth="1.5" />
            <path d={`M ${mid - d_px / 2},${mid - d_px / 2} L ${mid - d_px / 2 - b_px},${mid - d_px / 2} L ${mid - d_px / 2 - b_px},${mid - d_px / 2 - e_px} L ${mid - d_px / 2 - e_px},${mid - d_px / 2 - e_px} L ${mid - d_px / 2 - e_px},${mid - d_px / 2 - b_px} L ${mid - d_px / 2},${mid - d_px / 2 - b_px} Z`} fill="url(#grad1)" stroke="#3b82f6" strokeWidth="1.5" />
            <path d={`M ${mid - d_px / 2},${mid + d_px / 2} L ${mid - d_px / 2},${mid + d_px / 2 + b_px} L ${mid - d_px / 2 - e_px},${mid + d_px / 2 + b_px} L ${mid - d_px / 2 - e_px},${mid + d_px / 2 + e_px} L ${mid - d_px / 2 - b_px},${mid + d_px / 2 + e_px} L ${mid - d_px / 2 - b_px},${mid + d_px / 2} Z`} fill="url(#grad1)" stroke="#3b82f6" strokeWidth="1.5" />
            <path d={`M ${mid + d_px / 2},${mid + d_px / 2} L ${mid + d_px / 2 + b_px},${mid + d_px / 2} L ${mid + d_px / 2 + b_px},${mid + d_px / 2 + e_px} L ${mid + d_px / 2 + e_px},${mid + d_px / 2 + e_px} L ${mid + d_px / 2 + e_px},${mid + d_px / 2 + b_px} L ${mid + d_px / 2},${mid + d_px / 2 + b_px} Z`} fill="url(#grad1)" stroke="#3b82f6" strokeWidth="1.5" />
        </g>

        {/* Dimension B */}
        <line x1={mid + d_px/2} y1={mid - d_px/2 - b_px - 20} x2={mid + d_px/2 + b_px} y2={mid - d_px/2 - b_px - 20} stroke="#4b5563" strokeWidth="0.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
        <text x={mid + d_px/2 + b_px/2} y={mid - d_px/2 - b_px - 25} fill="#9ca3af" fontSize="10" textAnchor="middle">B = {B} mm</text>
        
        {/* Dimension e */}
        <line x1={mid + d_px/2 + b_px + 10} y1={mid - d_px/2 - e_px} x2={mid + d_px/2 + b_px + 10} y2={mid - d_px/2} stroke="#4b5563" strokeWidth="0.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
        <text x={mid + d_px/2 + b_px + 12} y={mid - d_px/2 - e_px/2} fill="#9ca3af" fontSize="10" alignmentBaseline="middle">e = {e} mm</text>

        {d_val > 0 && (
          <>
            <line x1={mid - d_px/2} y1={mid + 15} x2={mid + d_px/2} y2={mid + 15} stroke="#4b5563" strokeWidth="0.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <text x={mid} y={mid + 28} fill="#9ca3af" fontSize="9" textAnchor="middle">d = {d_val} mm</text>
          </>
        )}

        <text x={mid} y={size - 5} fill="#6b7280" fontSize="11" textAnchor="middle" fontWeight="bold">VISTA TRANSVERSAL (XL)</text>
      </svg>
    )
  };

  const LongSectionSVG = () => {
    const lH = 120, lW = 300;
    const lScale = (lW * 0.9) / (results.paramL || 1);
    const lPad = lW * 0.05;
    const startX = lPad;
    const endX = lPad + results.paramL * lScale;
    const midY = lH / 2;

    const numSpaces = results.nmin;
    const spaceLen = results.paramL / numSpaces;

    const shorteners = [];
    for (let i = 1; i < numSpaces; i++) {
        shorteners.push({ x: startX + i * spaceLen * lScale, val: (i * spaceLen).toFixed(0) });
    }

    return (
      <svg viewBox={`0 0 ${lW} ${lH}`} className="w-full h-full drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]">
        {/* Main Member */}
        <rect x={startX} y={midY - 10} width={results.paramL * lScale} height="20" fill="#1f2937" stroke="#374151" rx="2" />
        
        {/* Shorteners */}
        {shorteners.map((s, idx) => (
          <g key={idx}>
            <rect x={s.x - 2} y={midY - 15} width="4" height="30" fill="#3b82f6" rx="1" />
            <text x={s.x} y={midY + 25} fill="#3b82f6" fontSize="8" textAnchor="middle">{s.val}</text>
          </g>
        ))}

        {/* Dimensions */}
        <line x1={startX} y1={midY - 30} x2={endX} y2={midY - 30} stroke="#4b5563" strokeWidth="1" />
        <text x={(startX + endX) / 2} y={midY - 35} fill="#6b7280" fontSize="10" textAnchor="middle">L = {results.paramL} mm</text>
        
        <text x={lW/2} y={lH - 5} fill="#6b7280" fontSize="10" textAnchor="middle" fontWeight="bold">DISTRIBUCIÓN DE ACORTADORES ({results.nmin - 1} unidades)</text>
      </svg>
    )
  };

  const exportExcel = async () => {
    const wb = new ExcelJS.Workbook();
    const sheet = wb.addWorksheet("Resultados");
    
    sheet.addRow(["REPORTE ACORTADORES DE PANDEO"]);
    sheet.addRow([]);
    sheet.addRow(["PARÁMETROS"]);
    sheet.addRow(["Perfil", profileName]);
    sheet.addRow(["Separación d (mm)", d]);
    sheet.addRow(["Longitud L (mm)", L]);
    sheet.addRow([]);
    sheet.addRow(["RESULTADOS"]);
    sheet.addRow(["lmax (mm)", results.lmax.toFixed(2)]);
    sheet.addRow(["nmin (Espacios)", results.nmin]);
    sheet.addRow(["IuXL (cm⁴)", results.IuXL.toFixed(2)]);
    sheet.addRow(["iuXL (cm)", results.iuXL.toFixed(2)]);

    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Calculo_Acortadores_Pandeo.xlsx";
    a.click();
  };

  return (
    <div className="bg-gray-50 dark:bg-bim-dark text-gray-900 dark:text-gray-300 font-sans min-h-screen pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 mb-6 flex items-center justify-between flex-wrap gap-3">
        <Link to="/herramientas" className="inline-flex items-center gap-2 text-sm font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 hover:border-orange-500/50 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm group">
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Volver a Herramientas
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700/50 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm">
          <i className="fa-solid fa-house"></i> Volver al Inicio
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-10">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-bim-blue text-xs font-bold tracking-widest uppercase">
            Diseño Estructural
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
            Acortadores de Pandeo
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Calcula la separación máxima y cantidad mínima de acortadores para
            perfiles de doble ángulo (Perfil XL) según geometría y longitud.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Visualization Card */}
          <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 flex flex-col lg:col-span-2 min-h-[450px]">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center">
              <i className="fa-solid fa-draw-polygon mr-2 text-bim-blue"></i> Esquema XL (Cruciforme)
            </h3>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col items-center justify-center p-4 h-full border-r border-slate-800/80 last:border-0 relative">
                <CrossSectionSVG />
              </div>
              <div className="flex flex-col items-center justify-center p-4 h-full relative">
                <LongSectionSVG />
              </div>
            </div>

            {/* Horizontal Property Table */}
            <div className="mt-8 p-6 rounded-xl bg-slate-800/40 border border-slate-700/60 shadow-inner">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Propiedades de Cálculo</span>
                <span className="text-sm font-bold text-bim-blue px-3 py-1 rounded-lg bg-blue-900/20 border border-blue-800/30">
                   {profileName}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <span className="block text-[10px] text-slate-500 uppercase font-black">Área (AL)</span>
                  <div className="text-xl font-black text-white">{results.AL.toFixed(2)} <small className="text-xs text-slate-600 font-normal">cm²</small></div>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] text-slate-500 uppercase font-black">Ctro. Grav. (xL)</span>
                  <div className="text-xl font-black text-white">{results.xL.toFixed(2)} <small className="text-xs text-slate-600 font-normal">cm</small></div>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] text-slate-500 uppercase font-black">Inercia Mín (IvL)</span>
                  <div className="text-xl font-black text-white">{results.IvL.toFixed(2)} <small className="text-xs text-slate-600 font-normal">cm⁴</small></div>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] text-slate-500 uppercase font-black">Radio Mín (ivL)</span>
                  <div className="text-xl font-black text-white">{results.ivL.toFixed(2)} <small className="text-xs text-slate-600 font-normal">cm</small></div>
                </div>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <i className="fa-solid fa-sliders mr-2 text-bim-blue"></i> Parámetros
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Catálogo ICHA (L)</label>
                <select 
                  value={selectedProfileIdx} 
                  onChange={e => setSelectedProfileIdx(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-bim-blue"
                >
                  <option value="">--- SELECCIONA UN PERFIL ---</option>
                  {lProfiles.map((p, idx) => (
                    <option key={idx} value={idx}>{p.designation}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Separación (d)</label>
                  <div className="relative">
                    <input type="number" value={d} onChange={e=>setD(parseFloat(e.target.value)||0)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold text-lg focus:outline-none focus:border-bim-blue" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">mm</span>
                  </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Longitud (L)</label>
                   <div className="relative">
                     <input type="number" step="100" value={L} onChange={e=>setL(parseFloat(e.target.value)||0)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold text-lg focus:outline-none focus:border-bim-blue" />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">mm</span>
                   </div>
                </div>
              </div>

              {!currentProfile && (
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[10px] text-slate-500 italic mb-3">Ingresa dimensiones manuales (Ángulo Simple):</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase mb-1">Ala (B)</label>
                      <input type="number" value={manualB} onChange={e=>setManualB(parseFloat(e.target.value)||0)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-bim-blue" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase mb-1">Espesor (e)</label>
                      <input type="number" value={manualE} onChange={e=>setManualE(parseFloat(e.target.value)||0)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-bim-blue" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase mb-1">Radio (R)</label>
                      <input type="number" value={manualR} onChange={e=>setManualR(parseFloat(e.target.value)||0)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-bim-blue" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button onClick={exportExcel} className="w-full bg-emerald-600/20 hover:bg-emerald-600 hover:text-white text-emerald-500 border border-emerald-600/30 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4">
              <i className="fa-solid fa-file-excel"></i> EXPORTAR RESULTADOS
            </button>
          </div>

          {/* Results */}
          <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <i className="fa-solid fa-calculator mr-2 text-bim-blue"></i> Resultados XL
            </h3>

            <div className="space-y-4">
              <div className="bg-bim-blue/10 border border-bim-blue/30 rounded-2xl p-4 shadow-[0_0_15px_rgba(59,130,246,0.05)]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Separación Máxima (lmax)</span>
                  <span className="text-[10px] text-slate-600">mm</span>
                </div>
                <span className="text-4xl font-black text-white">{results.lmax.toFixed(2)}</span>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Cantidad Mínima Espacios</span>
                  <span className="text-[10px] text-slate-600">Nº</span>
                </div>
                <span className="text-4xl font-black text-bim-blue">{results.nmin}</span>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Propiedades Perfil XL</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                    <span className="block text-[10px] text-slate-500 uppercase mb-1">Inercia XL (IuXL)</span>
                    <span className="text-lg font-bold text-white">{results.IuXL.toFixed(2)} <small className="text-xs text-slate-500 font-normal">cm⁴</small></span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                    <span className="block text-[10px] text-slate-500 uppercase mb-1">Radio XL (iuXL)</span>
                    <span className="text-lg font-bold text-white">{results.iuXL.toFixed(2)} <small className="text-xs text-slate-500 font-normal">cm</small></span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4 flex gap-3 items-start">
                <i className="fa-solid fa-circle-info text-bim-blue mt-1"></i>
                <div className="text-[10px] text-slate-400 leading-relaxed italic">
                  <p className="mb-2"><strong>Criterio:</strong> lmax = 0.75 × ivL × L / iuXL.</p>
                  <p><strong>Configuración XL:</strong> Dos ángulos espalda con espalda en disposición de cruz, orientados a 45° (ejes u-v).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <Link to="/herramientas" className="inline-flex items-center gap-2 text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors group">
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Volver a Herramientas
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <i className="fa-solid fa-house"></i> Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
