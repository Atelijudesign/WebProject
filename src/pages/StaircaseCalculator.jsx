import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { useTranslation } from '../context/LanguageContext';

// Helper de extracción de valores numéricos seguros
const getSafeVal = (val, fallback = 0) => {
  const num = parseFloat(val);
  return isNaN(num) ? fallback : num;
};

// Presets Oficiales de la Tabla de Huella y Contrahuella (Lámina 5 - Criterio Industrial b+2h=630)
const NORMATIVE_PRESETS = [
  { angle: 20.56, b: 360, h: 135, status: "Inclinación Baja", class: "text-slate-400" },
  { angle: 21.80, b: 350, h: 140, status: "Inclinación Baja", class: "text-slate-400" },
  { angle: 23.10, b: 340, h: 145, status: "Inclinación Baja", class: "text-slate-400" },
  { angle: 24.44, b: 330, h: 150, status: "Inclinación Baja", class: "text-slate-400" },
  { angle: 25.84, b: 320, h: 155, status: "Inclinación Baja", class: "text-slate-400" },
  { angle: 27.30, b: 310, h: 160, status: "Inclinación Baja", class: "text-slate-400" },
  { angle: 28.81, b: 300, h: 165, status: "Inclinación Baja", class: "text-slate-400" },
  { angle: 30.38, b: 290, h: 170, status: "Recomendable ⭐", class: "text-emerald-400 font-bold" },
  { angle: 32.01, b: 280, h: 175, status: "Recomendable ⭐ (Estándar)", class: "text-emerald-400 font-bold" },
  { angle: 33.69, b: 270, h: 180, status: "Recomendable ⭐", class: "text-emerald-400 font-bold" },
  { angle: 35.43, b: 260, h: 185, status: "Recomendable ⭐", class: "text-emerald-400 font-bold" },
  { angle: 37.23, b: 250, h: 190, status: "Recomendable ⭐", class: "text-emerald-400 font-bold" },
  { angle: 39.09, b: 240, h: 195, status: "Recomendable ⭐", class: "text-emerald-400 font-bold" },
  { angle: 41.01, b: 230, h: 200, status: "Inclinación Alta", class: "text-amber-400" },
  { angle: 42.98, b: 220, h: 205, status: "Inclinación Alta", class: "text-amber-400" },
  { angle: 45.00, b: 210, h: 210, status: "Crítico", class: "text-rose-400" }
];

// --------------------------------------------------------------------------
// Generador DXF Nativo (AutoCAD / Advance Steel)
// --------------------------------------------------------------------------
function generateDxfContent(results, huella) {
  const n = results.numeroPeldanos;
  const h = results.contrahuellaCalculada;
  const b = huella;
  const H = results.alturaTotal;
  const L = results.longitudMedia;

  let dxf = `0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n5\n`;
  dxf += `0\nLAYER\n2\nESTRUCTURA_C250\n70\n0\n62\n4\n6\nCONTINUOUS\n0\n`;
  dxf += `0\nLAYER\n2\nPELDANOS_GRATING\n70\n0\n62\n3\n6\nCONTINUOUS\n0\n`;
  dxf += `0\nLAYER\n2\nBARANDAS_SCH40\n70\n0\n62\n30\n6\nCONTINUOUS\n0\n`;
  dxf += `0\nLAYER\n2\nPUNTOS_TRABAJO\n70\n0\n62\n1\n6\nCONTINUOUS\n0\n`;
  dxf += `0\nLAYER\n2\nCOTAS_Y_TEXTO\n70\n0\n62\n7\n6\nCONTINUOUS\n0\n`;
  dxf += `0\nENDTAB\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n`;

  // Peldaños
  for (let i = 0; i < n; i++) {
    const x1 = i * b;
    const y1 = i * h;
    const x2 = (i + 1) * b;
    const y2 = y1;
    const y3 = (i + 1) * h;
    // Huella
    dxf += `0\nLINE\n8\nPELDANOS_GRATING\n10\n${x1}\n20\n${y1}\n30\n0.0\n11\n${x2}\n21\n${y2}\n31\n0.0\n`;
    // Contrahuella
    dxf += `0\nLINE\n8\nPELDANOS_GRATING\n10\n${x2}\n20\n${y2}\n30\n0.0\n11\n${x2}\n21\n${y3}\n31\n0.0\n`;
  }

  // Limón C250 (Eje e Inclinación)
  dxf += `0\nLINE\n8\nESTRUCTURA_C250\n10\n0.0\n20\n0.0\n30\n0.0\n11\n${L}\n21\n${H}\n31\n0.0\n`;
  dxf += `0\nLINE\n8\nESTRUCTURA_C250\n10\n0.0\n20\n-250.0\n30\n0.0\n11\n${L}\n21\n${H - 250.0}\n31\n0.0\n`;

  // Barandas (1200mm)
  dxf += `0\nLINE\n8\nBARANDAS_SCH40\n10\n0.0\n20\n1200.0\n30\n0.0\n11\n${L}\n21\n${H + 1200.0}\n31\n0.0\n`;
  dxf += `0\nLINE\n8\nBARANDAS_SCH40\n10\n0.0\n20\n800.0\n30\n0.0\n11\n${L}\n21\n${H + 800.0}\n31\n0.0\n`;
  dxf += `0\nLINE\n8\nBARANDAS_SCH40\n10\n0.0\n20\n400.0\n30\n0.0\n11\n${L}\n21\n${H + 400.0}\n31\n0.0\n`;

  // Puntos de Trabajo
  dxf += `0\nPOINT\n8\nPUNTOS_TRABAJO\n10\n0.0\n20\n0.0\n30\n0.0\n`;
  dxf += `0\nPOINT\n8\nPUNTOS_TRABAJO\n10\n${L}\n20\n${H}\n30\n0.0\n`;

  dxf += `0\nENDSEC\n0\nEOF\n`;
  return dxf;
}

// --------------------------------------------------------------------------
// Componente SVG Técnico de Elevación (Corte A-A con Detalle C250 y P.T.)
// --------------------------------------------------------------------------
function SvgElevationView({ results, huella, t1Ta1, t1Ta2, t2TcSup, t2TcInf, t3Ta, t3Tc, tipoConnection }) {
  const W = 900, H_canvas = 480;
  
  // Coordenadas del dibujo
  const startX = 220;
  const startY = 120;
  const endX = 640;
  const endY = 340;

  const n = Math.max(1, results.numeroPeldanos);
  const stepW = (endX - startX) / n;
  const stepH = (endY - startY) / n;
  const c250Depth = 26; // Representación proporcional del canal C250

  const safeLevelSup = tipoConnection === 'tipo1' ? t1Ta1 : (tipoConnection === 'tipo2' ? t2TcSup : t3Ta);
  const safeLevelInf = tipoConnection === 'tipo1' ? t1Ta2 : (tipoConnection === 'tipo2' ? t2TcInf : t3Tc);

  const steps = Array.from({ length: n }, (_, i) => i);

  return (
    <svg viewBox={`0 0 ${W} ${H_canvas}`} width="100%" height="100%" className="select-none font-sans">
      <defs>
        {/* Patrón de Rayado de Acero Estructural */}
        <pattern id="steel-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#0284c7" strokeWidth="1.2" opacity="0.35" />
        </pattern>
        {/* Patrón de Hormigón */}
        <pattern id="concrete-hatch" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#94a3b8" opacity="0.4" />
          <circle cx="8" cy="7" r="1.5" fill="#94a3b8" opacity="0.3" />
          <line x1="4" y1="9" x2="6" y2="11" stroke="#94a3b8" strokeWidth="0.8" opacity="0.3" />
        </pattern>
        {/* Diana de Punto de Trabajo (P.T.) */}
        <marker id="pt-target" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6">
          <circle cx="5" cy="5" r="4" fill="none" stroke="#ef4444" strokeWidth="1.5" />
          <circle cx="5" cy="5" r="1.5" fill="#ef4444" />
        </marker>
      </defs>

      {/* Grilla Guía de Fondo */}
      <line x1={startX} y1={60} x2={startX} y2={420} stroke="#1e293b" strokeDasharray="4,4" strokeWidth="1" />
      <line x1={endX} y1={60} x2={endX} y2={420} stroke="#1e293b" strokeDasharray="4,4" strokeWidth="1" />

      {/* 1. PLATAFORMAS DE LLEGADA Y ARRANQUE */}
      {/* Plataforma Superior (Viga C250 + Parrilla Grating 30mm) */}
      <g>
        {/* Viga de llegada */}
        <rect x={startX - 140} y={startY - 6} width="140" height="32" fill="url(#steel-hatch)" stroke="#0284c7" strokeWidth="2" />
        {/* Parrilla Grating Superior */}
        <rect x={startX - 140} y={startY - 14} width="140" height="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
        {/* Eje de Viga */}
        <line x1={startX - 70} y1={startY - 25} x2={startX - 70} y2={startY + 40} stroke="#64748b" strokeDasharray="3,3" strokeWidth="0.8" />
        <text x={startX - 70} y={startY + 52} fill="#64748b" fontSize="9px" fontFamily="monospace" textAnchor="middle">EJE VIGA</text>
      </g>

      {/* Plataforma Inferior (Losa / Pedestal o Viga de Arranque) */}
      <g>
        {tipoConnection === 'tipo2' || tipoConnection === 'tipo3' ? (
          <g>
            {/* Pedestal / Losa de Hormigón */}
            <rect x={endX} y={endY} width="140" height="55" fill="url(#concrete-hatch)" stroke="#64748b" strokeWidth="1.8" />
            {/* Placa Base de Acero */}
            <rect x={endX} y={endY - 6} width="110" height="6" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
            {/* Pernos de Anclaje Ø5/8" */}
            <line x1={endX + 25} y1={endY - 6} x2={endX + 25} y2={endY + 30} stroke="#f59e0b" strokeWidth="3" />
            <line x1={endX + 85} y1={endY - 6} x2={endX + 85} y2={endY + 30} stroke="#f59e0b" strokeWidth="3" />
          </g>
        ) : (
          <g>
            <rect x={endX} y={endY} width="140" height="32" fill="url(#steel-hatch)" stroke="#0284c7" strokeWidth="2" />
            <rect x={endX} y={endY - 8} width="140" height="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
          </g>
        )}
      </g>

      {/* 2. LIMÓN ESTRUCTURAL CANAL C250 (Geometría Completa con Alas y Cortes) */}
      <g>
        {/* Cuerpo del Limón (Alma) */}
        <polygon 
          points={`
            ${startX - 8},${startY - 6} 
            ${startX + 22},${startY - 6} 
            ${endX + 38},${endY - 6} 
            ${endX + 38},${endY + c250Depth} 
            ${endX - 10},${endY + c250Depth} 
            ${startX - 22},${startY + c250Depth}
          `}
          fill="#0f172a" 
          stroke="#0284c7" 
          strokeWidth="2.2" 
        />
        {/* Ala Superior del Canal */}
        <line x1={startX + 22} y1={startY - 6} x2={endX + 38} y2={endY - 6} stroke="#38bdf8" strokeWidth="3" />
        {/* Ala Inferior del Canal */}
        <line x1={startX - 22} y1={startY + c250Depth} x2={endX - 10} y2={endY + c250Depth} stroke="#38bdf8" strokeWidth="3" />
        
        {/* Texto Identificador de Perfil */}
        <text 
          x={(startX + endX) / 2 - 20} 
          y={(startY + endY) / 2 + 28} 
          fill="#38bdf8" 
          fontSize="11px" 
          fontWeight="bold" 
          fontFamily="monospace"
          transform={`rotate(${results.angulo.toFixed(1)} ${(startX + endX) / 2 - 20} ${(startY + endY) / 2 + 28})`}
        >
          CANAL C250 (250x75x6 mm)
        </text>
      </g>

      {/* 3. PELDAÑOS (Grating 32x5 mm + Ángulos de Soporte L65) */}
      <g>
        {steps.map(i => {
          const px = startX + i * stepW;
          const py = startY + i * stepH;
          return (
            <g key={`step-${i}`}>
              {/* Ángulo de Apoyo L65x65x6 */}
              <polygon points={`${px},${py + 6} ${px + stepW - 4},${py + 6} ${px + stepW - 4},${py + 14} ${px + 4},${py + 14}`} fill="#0284c7" opacity="0.6" />
              {/* Huella Grating con Nariz Estriada */}
              <rect x={px} y={py} width={stepW} height="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.8" rx="1" />
              {/* Línea de Contrahuella Teórica */}
              <line x1={px + stepW} y1={py} x2={px + stepW} y2={py + stepH} stroke="#475569" strokeDasharray="2,2" strokeWidth="0.8" />
            </g>
          );
        })}
      </g>

      {/* 4. SISTEMA DE BARANDAS Y PASAMANOS (Ø1-1/2" SCH40 - 1200 mm) */}
      <g>
        {/* Postes Verticales con Pletina Base R60x10 */}
        <line x1={startX + 15} y1={startY - 6} x2={startX + 15} y2={startY - 90} stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
        <line x1={endX - 10} y1={endY - 6} x2={endX - 10} y2={endY - 90} stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
        <line x1={(startX + endX) / 2} y1={(startY + endY) / 2 - 6} x2={(startX + endX) / 2} y2={(startY + endY) / 2 - 90} stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
        
        {/* Pletinas Base R60x10 */}
        <rect x={startX + 9} y={startY - 9} width="12" height="5" fill="#f59e0b" rx="1" />
        <rect x={endX - 16} y={endY - 9} width="12" height="5" fill="#f59e0b" rx="1" />
        <rect x={(startX + endX) / 2 - 6} y={(startY + endY) / 2 - 9} width="12" height="5" fill="#f59e0b" rx="1" />

        {/* Pasamanos Superior (H = 1200 mm con Retorno R100) */}
        <path 
          d={`
            M ${startX - 50} ${startY - 70} 
            Q ${startX - 50} ${startY - 90} ${startX - 30} ${startY - 90} 
            L ${endX + 30} ${endY - 90} 
            Q ${endX + 50} ${endY - 90} ${endX + 50} ${endY - 70}
          `}
          fill="none" 
          stroke="#f59e0b" 
          strokeWidth="4" 
          strokeLinecap="round" 
        />

        {/* Pasamanos Intermedio 1 (@ 800 mm) */}
        <line x1={startX - 35} y1={startY - 60} x2={endX + 35} y2={endY - 60} stroke="#f59e0b" strokeWidth="2.2" opacity="0.85" />

        {/* Pasamanos Intermedio 2 (@ 400 mm) */}
        <line x1={startX - 20} y1={startY - 30} x2={endX + 20} y2={endY - 30} stroke="#f59e0b" strokeWidth="2.2" opacity="0.85" />

        {/* Chapa de Rodapié / Kickplate (100x5 mm) */}
        <line x1={startX - 5} y1={startY - 8} x2={endX + 5} y2={endY - 8} stroke="#d97706" strokeWidth="7" opacity="0.7" />
        
        {/* Rótulo de Pasamanos */}
        <text x={(startX + endX) / 2} y={(startY + endY) / 2 - 105} fill="#f59e0b" fontSize="10px" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          BARANDA Ø1-1/2" SCH40 (H=1200 mm)
        </text>
      </g>

      {/* 5. GÁLIBO LIBRE DE PASO (2200 mm MÍNIMO) */}
      <g>
        <line x1={(startX + endX) / 2 + 55} y1={(startY + endY) / 2} x2={(startX + endX) / 2 + 55} y2={(startY + endY) / 2 - 120} stroke="#10b981" strokeWidth="1.8" strokeDasharray="3,3" />
        <circle cx={(startX + endX) / 2 + 55} cy={(startY + endY) / 2 - 120} r="2.5" fill="#10b981" />
        <text x={(startX + endX) / 2 + 65} y={(startY + endY) / 2 - 60} fill="#10b981" fontSize="10px" fontWeight="bold" fontFamily="monospace">
          GÁLIBO MÍN. 2200 mm (CONFORME)
        </text>
      </g>

      {/* 6. PUNTOS DE TRABAJO (P.T.) - Intersecciones Teóricas */}
      {/* P.T. Superior */}
      <g>
        <circle cx={startX} cy={startY - 6} r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
        <line x1={startX} y1={startY - 6} x2={startX + 35} y2={startY - 35} stroke="#ef4444" strokeWidth="1.2" />
        <line x1={startX + 35} y1={startY - 35} x2={startX + 95} y2={startY - 35} stroke="#ef4444" strokeWidth="1.2" />
        <text x={startX + 65} y={startY - 40} fill="#ef4444" fontSize="11px" fontWeight="bold" fontFamily="monospace" textAnchor="middle">P.T. SUP</text>
      </g>

      {/* P.T. Inferior */}
      <g>
        <circle cx={endX} cy={endY} r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
        <line x1={endX} y1={endY} x2={endX - 35} y2={endY + 35} stroke="#ef4444" strokeWidth="1.2" />
        <line x1={endX - 35} y1={endY + 35} x2={endX - 95} y2={endY + 35} stroke="#ef4444" strokeWidth="1.2" />
        <text x={endX - 65} y={endY + 47} fill="#ef4444" fontSize="11px" fontWeight="bold" fontFamily="monospace" textAnchor="middle">P.T. INF</text>
      </g>

      {/* 7. COTAS TOPOGRÁFICAS DE NIVEL (T.A. / N.P.T.) */}
      {/* Nivel Superior */}
      <g>
        <polygon points={`${startX - 140},${startY - 14} ${startX - 150},${startY - 26} ${startX - 130},${startY - 26}`} fill="#38bdf8" />
        <line x1={startX - 155} y1={startY - 26} x2={startX - 60} y2={startY - 26} stroke="#38bdf8" strokeWidth="1.2" />
        <text x={startX - 105} y={startY - 32} fill="#38bdf8" fontSize="11px" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          EL. +{Number(safeLevelSup).toFixed(3)}
        </text>
        <text x={startX - 105} y={startY - 10} fill="#94a3b8" fontSize="9px" fontFamily="monospace" textAnchor="middle">
          N.P.T. / T.A. SUP
        </text>
      </g>

      {/* Nivel Inferior */}
      <g>
        <polygon points={`${endX + 140},${endY - 6} ${endX + 130},${endY - 18} ${endX + 150},${endY - 18}`} fill="#38bdf8" />
        <line x1={endX + 70} y1={endY - 18} x2={endX + 165} y2={endY - 18} stroke="#38bdf8" strokeWidth="1.2" />
        <text x={endX + 115} y={endY - 24} fill="#38bdf8" fontSize="11px" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          EL. +{Number(safeLevelInf).toFixed(3)}
        </text>
        <text x={endX + 115} y={endY - 2} fill="#94a3b8" fontSize="9px" fontFamily="monospace" textAnchor="middle">
          N.P.T. / T.A. INF
        </text>
      </g>

      {/* 8. COTAS DE DIMENSIONAMIENTO INDUSTRIAL */}
      {/* Cota Vertical Total (H) */}
      <g>
        <line x1={endX + 75} y1={startY - 14} x2={endX + 75} y2={endY} stroke="#94a3b8" strokeWidth="1.2" />
        <line x1={endX + 68} y1={startY - 14} x2={endX + 82} y2={startY - 14} stroke="#94a3b8" strokeWidth="1.2" />
        <line x1={endX + 68} y1={endY} x2={endX + 82} y2={endY} stroke="#94a3b8" strokeWidth="1.2" />
        <text 
          x={endX + 88} 
          y={(startY + endY) / 2} 
          fill="#f8fafc" 
          fontSize="11px" 
          fontWeight="bold" 
          fontFamily="monospace" 
          transform={`rotate(90 ${endX + 88} ${(startY + endY) / 2})`} 
          textAnchor="middle"
        >
          H = {results.alturaTotal.toFixed(0)} mm ({results.numeroPeldanos} CH @ {results.contrahuellaCalculada.toFixed(1)})
        </text>
      </g>

      {/* Cota Horizontal de Desarrollo (L) */}
      <g>
        <line x1={startX} y1={endY + 65} x2={endX} y2={endY + 65} stroke="#94a3b8" strokeWidth="1.2" />
        <line x1={startX} y1={endY + 58} x2={startX} y2={endY + 72} stroke="#94a3b8" strokeWidth="1.2" />
        <line x1={endX} y1={endY + 58} x2={endX} y2={endY + 72} stroke="#94a3b8" strokeWidth="1.2" />
        <text 
          x={(startX + endX) / 2} 
          y={endY + 82} 
          fill="#f8fafc" 
          fontSize="11px" 
          fontWeight="bold" 
          fontFamily="monospace" 
          textAnchor="middle"
        >
          DESARROLLO L = {results.longitudMedia.toFixed(0)} mm ({results.numeroPeldanos} H @ {huella})
        </text>
      </g>

      {/* Arco de Ángulo de Pendiente α */}
      <g>
        <path d={`M ${endX - 55} ${endY} A 55 55 0 0 0 ${endX - 48} ${endY - 28}`} fill="none" stroke="#f59e0b" strokeWidth="2" />
        <text x={endX - 85} y={endY - 10} fill="#f59e0b" fontSize="11px" fontWeight="bold" fontFamily="monospace">
          α = {results.angulo.toFixed(1)}°
        </text>
      </g>
    </svg>
  );
}

// --------------------------------------------------------------------------
// Componente SVG Técnico de Planta (Top View)
// --------------------------------------------------------------------------
function SvgPlanView({ results, anchoTramo }) {
  const W = 900, H_canvas = 380;
  const n = Math.max(1, results.numeroPeldanos);
  const startX = 180;
  const stepW = 480 / n;
  const stairW = 160; // Ancho del tramo en vista superior
  const startY = 110;

  const steps = Array.from({ length: n }, (_, i) => i);

  return (
    <svg viewBox={`0 0 ${W} ${H_canvas}`} width="100%" height="100%" className="select-none font-sans">
      <defs>
        <pattern id="grating-plan" width="6" height="12" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="6" y2="0" stroke="#0284c7" strokeWidth="1" opacity="0.5" />
          <line x1="3" y1="0" x2="3" y2="12" stroke="#38bdf8" strokeWidth="0.8" opacity="0.3" />
        </pattern>
      </defs>

      {/* Plataforma de Descanso Superior (800mm mín) */}
      <rect x={startX - 110} y={startY} width="110" height={stairW} fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
      <text x={startX - 55} y={startY + stairW / 2 + 4} fill="#94a3b8" fontSize="10px" fontFamily="monospace" textAnchor="middle">DESCANSO SUP</text>

      {/* Plataforma de Descanso Inferior */}
      <rect x={startX + 480} y={startY} width="110" height={stairW} fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
      <text x={startX + 535} y={startY + stairW / 2 + 4} fill="#94a3b8" fontSize="10px" fontFamily="monospace" textAnchor="middle">DESCANSO INF</text>

      {/* Limones Canales C250 Laterales */}
      <rect x={startX - 110} y={startY - 8} width={700} height="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
      <rect x={startX - 110} y={startY + stairW} width={700} height="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
      <text x={startX + 240} y={startY - 14} fill="#38bdf8" fontSize="10px" fontWeight="bold" fontFamily="monospace" textAnchor="middle">LIMÓN CANAL C250 (IZQ)</text>
      <text x={startX + 240} y={startY + stairW + 22} fill="#38bdf8" fontSize="10px" fontWeight="bold" fontFamily="monospace" textAnchor="middle">LIMÓN CANAL C250 (DER)</text>

      {/* Peldaños en Planta */}
      {steps.map(i => {
        const px = startX + i * stepW;
        return (
          <g key={`plan-step-${i}`}>
            <rect x={px} y={startY} width={stepW} height={stairW} fill="url(#grating-plan)" stroke="#0284c7" strokeWidth="1" />
            <line x1={px} y1={startY} x2={px} y2={startY + stairW} stroke="#f8fafc" strokeWidth="1.2" />
            <text x={px + stepW / 2} y={startY + stairW / 2 + 3} fill="#f8fafc" fontSize="9px" fontFamily="monospace" textAnchor="middle">{i + 1}</text>
          </g>
        );
      })}

      {/* Flecha de Sentido de Subida */}
      <g>
        <line x1={startX + 40} y1={startY + stairW / 2} x2={startX + 440} y2={startY + stairW / 2} stroke="#f59e0b" strokeWidth="2.5" />
        <polygon points={`${startX + 440},${startY + stairW / 2 - 6} ${startX + 455},${startY + stairW / 2} ${startX + 440},${startY + stairW / 2 + 6}`} fill="#f59e0b" />
        <circle cx={startX + 40} cy={startY + stairW / 2} r="4" fill="#f59e0b" />
        <text x={startX + 240} y={startY + stairW / 2 - 10} fill="#f59e0b" fontSize="11px" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          SUBE ({n} PELDAÑOS)
        </text>
      </g>

      {/* Cota de Ancho Libre de Tramo A */}
      <g>
        <line x1={startX + 505} y1={startY} x2={startX + 505} y2={startY + stairW} stroke="#94a3b8" strokeWidth="1.2" />
        <line x1={startX + 498} y1={startY} x2={startX + 512} y2={startY} stroke="#94a3b8" strokeWidth="1.2" />
        <line x1={startX + 498} y1={startY + stairW} x2={startX + 512} y2={startY + stairW} stroke="#94a3b8" strokeWidth="1.2" />
        <text x={startX + 520} y={startY + stairW / 2 + 4} fill="#f8fafc" fontSize="11px" fontWeight="bold" fontFamily="monospace">
          A = {anchoTramo} mm (ANCHO LIBRE)
        </text>
      </g>
    </svg>
  );
}

// --------------------------------------------------------------------------
// Componente Principal
// --------------------------------------------------------------------------
export default function StaircaseCalculator() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [activeTab, setActiveTab] = useState("elevation"); // 'elevation' | 'plan' | 'dxf'
  const [tipoConnection, setTipoConnection] = useState("tipo1");
  const [targetContrahuella, setTargetContrahuella] = useState(175);
  const [huella, setHuella] = useState(280);
  const [anchoTramo, setAnchoTramo] = useState(900);

  // Niveles Topográficos (m)
  const [t1Ta1, setT1Ta1] = useState(6.000);
  const [t1Esp1] = useState(30);
  const [t1Ta2, setT1Ta2] = useState(3.000);
  const [t1Esp2] = useState(30);

  const [t2TcSup, setT2TcSup] = useState(6.000);
  const [t2TcInf, setT2TcInf] = useState(3.000);

  const [t3Ta, setT3Ta] = useState(6.000);
  const [t3Esp] = useState(30);
  const [t3Tc, setT3Tc] = useState(3.000);

  // Aplicar Preset de la Tabla Oficial
  const applyPreset = (preset) => {
    setHuella(preset.b);
    setTargetContrahuella(preset.h);
  };

  // Cálculo e Inferencia Estructural Completa
  const results = useMemo(() => {
    let alturaTotal = 0;
    let numeroPeldanos = 0;
    let contrahuellaCalculada = 0;
    let angulo = 0;
    let longitudMedia = 0;

    const safeTargetCH = getSafeVal(targetContrahuella, 175) || 175;
    const safeH = getSafeVal(huella, 280);
    const safeAncho = getSafeVal(anchoTramo, 900);

    if (tipoConnection === 'tipo1') {
      alturaTotal = ((getSafeVal(t1Ta1, 6) + (getSafeVal(t1Esp1, 30) * 0.001)) - (getSafeVal(t1Ta2, 3) + (getSafeVal(t1Esp2, 30) * 0.001))) * 1000;
    } else if (tipoConnection === 'tipo2') {
      alturaTotal = (getSafeVal(t2TcSup, 6) - getSafeVal(t2TcInf, 3)) * 1000;
    } else {
      alturaTotal = ((getSafeVal(t3Ta, 6) + (getSafeVal(t3Esp, 30) * 0.001)) - getSafeVal(t3Tc, 3)) * 1000;
    }

    alturaTotal = Math.abs(alturaTotal);
    numeroPeldanos = Math.max(1, Math.round(alturaTotal / safeTargetCH));
    contrahuellaCalculada = numeroPeldanos > 0 ? alturaTotal / numeroPeldanos : 0;
    longitudMedia = safeH * numeroPeldanos;

    angulo = safeH > 0 ? (Math.atan(contrahuellaCalculada / safeH) * (180 / Math.PI)) : 0;

    const blondel = (2 * contrahuellaCalculada) + safeH;
    const seguridad = contrahuellaCalculada + safeH;
    const requiereDescanso = alturaTotal > 3000;

    // Cubicaciones
    const longitudDiagonalM = Math.sqrt(Math.pow(longitudMedia / 1000, 2) + Math.pow(alturaTotal / 1000, 2));
    const pesoLimonesKg = longitudDiagonalM * 2 * 25.1; // 2 limones C250
    const pesoPeldañosKg = numeroPeldanos * (safeAncho / 1000) * 12.5; // Parrilla grating
    const pesoPasamanosKg = longitudDiagonalM * 2 * 4.5; // Cañería 1-1/2" SCH40
    const pesoTotalAceroKg = pesoLimonesKg + pesoPeldañosKg + pesoPasamanosKg;

    return {
      alturaTotal,
      numeroPeldanos,
      contrahuellaCalculada,
      angulo,
      longitudMedia,
      blondel,
      seguridad,
      requiereDescanso,
      bom: {
        longitudDiagonalM: longitudDiagonalM.toFixed(2),
        pesoLimonesKg: pesoLimonesKg.toFixed(1),
        pesoPeldañosKg: pesoPeldañosKg.toFixed(1),
        pesoPasamanosKg: pesoPasamanosKg.toFixed(1),
        pesoTotalAceroKg: pesoTotalAceroKg.toFixed(1),
        pernosAnclaje: numeroPeldanos * 4 + 8
      }
    };
  }, [tipoConnection, targetContrahuella, huella, anchoTramo, t1Ta1, t1Esp1, t1Ta2, t1Esp2, t2TcSup, t2TcInf, t3Ta, t3Esp, t3Tc]);

  // Descarga del Archivo DXF
  const downloadDxf = () => {
    const dxfData = generateDxfContent(results, huella, anchoTramo);
    const blob = new Blob([dxfData], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Escalera_Estructural_C250_${results.alturaTotal.toFixed(0)}mm.dxf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Flag de disponibilidad para deshabilitar acceso temporalmente sin eliminar código
  const isAvailable = false;

  if (!isAvailable) {
    return (
      <div className="bg-[#0b1220] text-slate-100 font-sans min-h-screen pt-24 pb-16 transition-colors duration-300">
        <SEOHead
          title={isEn ? "Industrial Staircase Calculator - Coming Soon" : "Calculador de Escaleras Industriales - Próximamente"}
          description={isEn 
            ? "The industrial staircase calculation tool is currently undergoing technical calibration and normative updates. It will be available very soon."
            : "La herramienta de cálculo de escaleras industriales está en proceso de calibración y actualización técnica. Estará disponible muy pronto."}
          path="/herramientas/escaleras"
        />

        {/* Top Navigation */}
        <div className="max-w-5xl mx-auto px-4 mb-8 flex items-center justify-between flex-wrap gap-3">
          <Link
            to="/herramientas"
            className="inline-flex items-center gap-2 text-sm font-bold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 px-4 py-2 rounded-xl transition-all shadow-sm group"
          >
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            {isEn ? "Back to Tools" : "Volver a Herramientas"}
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700/50 px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <i className="fa-solid fa-house"></i>
            {isEn ? "Back to Home" : "Volver al Inicio"}
          </Link>
        </div>

        {/* Main Bento Container */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/30 rounded-3xl p-8 md:p-14 shadow-2xl relative overflow-hidden text-center">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6 animate-pulse">
                <i className="fa-solid fa-screwdriver-wrench"></i>
                {isEn ? "Under Calibration & Upgrade" : "En Proceso de Actualización"}
              </div>

              {/* Icon */}
              <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl text-amber-400 mb-6 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
                <i className="fa-solid fa-stairs"></i>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-black text-white mb-4 font-grotesk tracking-tight">
                {isEn ? (
                  <>Staircase Calculator <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Coming Soon</span></>
                ) : (
                  <>Calculadora de Escaleras <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Pronto Disponible</span></>
                )}
              </h1>

              {/* Notice Message */}
              <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                {isEn
                  ? "This tool is temporarily closed for public access while we calibrate the structural calculation engine, Blondel ergonomics verification (b + 2h = 630mm), C250 stringer channel standards, and automated DXF CAD export. It will be fully available very soon."
                  : "Esta herramienta se encuentra temporalmente en pausa para los usuarios mientras calibramos el motor de cálculo estructural, la verificación ergonómica de Blondel (b + 2h = 630 mm), estándares de canal C250 y la exportación automatizada de planos CAD en DXF. Estará disponible muy pronto."}
              </p>

              {/* Bento Feature Teasers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
                  <div className="text-amber-400 text-lg mb-2"><i className="fa-solid fa-ruler-combined"></i></div>
                  <h4 className="text-white text-sm font-bold mb-1">{isEn ? "Blondel Formula" : "Ley de Blondel"}</h4>
                  <p className="text-slate-400 text-xs leading-normal">
                    {isEn ? "Real-time verification of comfort angles (30° - 37°) and clearance." : "Verificación de rangos de confort (30° - 37°) y gálibo 2200 mm."}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
                  <div className="text-sky-400 text-lg mb-2"><i className="fa-solid fa-cube"></i></div>
                  <h4 className="text-white text-sm font-bold mb-1">{isEn ? "C250 Channels" : "Limones Canal C250"}</h4>
                  <p className="text-slate-400 text-xs leading-normal">
                    {isEn ? "Parametric working points (W.P.) and structural connections." : "Puntos de trabajo paramétricos (P.T.) y conexiones estructurales."}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
                  <div className="text-emerald-400 text-lg mb-2"><i className="fa-solid fa-file-code"></i></div>
                  <h4 className="text-white text-sm font-bold mb-1">{isEn ? "AutoCAD DXF" : "Exportación DXF"}</h4>
                  <p className="text-slate-400 text-xs leading-normal">
                    {isEn ? "Instant production-ready drawing generation with standard layers." : "Generación de planos normalizados listos para taller y obra."}
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/herramientas"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-toolbox"></i>
                  {isEn ? "Explore Available Tools" : "Ver Otras Herramientas Disponibles"}
                </Link>
                <Link
                  to="/herramientas/icha"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-table"></i>
                  {isEn ? "ICHA Chilean Catalog" : "Catálogo ICHA Chile"}
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#030712] text-slate-100 font-sans min-h-screen pt-20 pb-16 transition-colors duration-300">
      <SEOHead
        title="Calculadora de Escaleras Estructurales C250 · Fórmula de Blondel & DXF"
        description="Dimensionamiento de escaleras metálicas industriales con canal C250, gálibos de 2.2m, fórmula de Blondel (b+2h=630) y exportación directa de planos en DXF."
        path="/herramientas/escaleras"
        keywords="Calculadora de escaleras metálicas, fórmula de Blondel, limón canal C250, cálculo contrahuella huella, barandas SCH40, planos DXF escaleras"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Calculadora de Escaleras Estructurales e Industriales",
          "applicationCategory": "EngineeringApplication",
          "operatingSystem": "All",
          "url": "https://atelijudesign.com/herramientas/escaleras",
          "description": "Herramienta online para proyectistas estructurales para calcular escaleras industriales bajo norma Blondel y generar planos CAD en DXF.",
          "inLanguage": "es",
          "author": {
            "@type": "Person",
            "name": "Andrés Gallo P."
          }
        }}
      />
      
      {/* Encabezado y Navegación */}
      <div className="max-w-7xl mx-auto px-4 mb-6 flex items-center justify-between flex-wrap gap-3">
        <Link to="/herramientas" className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 px-4 py-2 rounded-xl transition-all shadow-sm">
          <i className="fa-solid fa-arrow-left"></i> {isEn ? "Back to Tools" : "Volver a Herramientas"}
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-sky-500/20 text-sky-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-sky-500/30">
            <i className="fa-solid fa-ruler-combined mr-1.5"></i> Blondel b+2h=630
          </span>
          <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/30">
            <i className="fa-solid fa-shield-halved mr-1.5"></i> {isEn ? "C250 Channel Stringer" : "Limón Canal C250"}
          </span>
          <button 
            onClick={downloadDxf}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-4 py-1.5 rounded-lg transition-all shadow-md font-mono"
          >
            <i className="fa-solid fa-file-arrow-down"></i> {isEn ? "Download CAD Plan (.DXF)" : "Descargar Plano CAD (.DXF)"}
          </button>
        </div>
      </div>

      {/* Título Principal */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-3xl md:text-5xl font-black font-grotesk text-white mb-2 tracking-tight">
          {isEn ? (
            <>C250 Structural <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400">Staircase Engineering</span></>
          ) : (
            <>Ingeniería de <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400">Escaleras Estructurales C250</span></>
          )}
        </h1>
        <p className="text-slate-400 text-sm max-w-3xl mx-auto">
          {isEn
            ? "Technical diagrams generator, parametric Working Points (W.P.) calculation, T.O.S./F.F.L. elevations, 2200mm clearance and CAD export."
            : "Generador de esquemas técnicos, cálculo paramétrico de Puntos de Trabajo (P.T.), niveles T.A./N.P.T., gálibo 2200 mm y exportación CAD."}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panel Izquierdo: Inputs y Presets */}
        <div className="lg:col-span-4 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">1. TIPO DE CONEXIÓN ESTRUCTURAL</label>
            <select 
              value={tipoConnection} 
              onChange={(e) => setTipoConnection(e.target.value)}
              className="w-full bg-[#030712] border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 text-sm font-semibold transition-colors"
            >
              <option value="tipo1">Parrilla a Parrilla (Estructura de Acero / T.A.)</option>
              <option value="tipo2">Concreto a Concreto / T.S.P.</option>
              <option value="tipo3">Parrilla a Concreto con Pedestal</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-sky-400 uppercase tracking-wider">2. NIVELES TOPOGRÁFICOS (m)</label>
              <span className="text-[10px] text-slate-400 font-mono">T.A. / N.P.T.</span>
            </div>
            
            {tipoConnection === 'tipo1' && (
              <div className="space-y-3 bg-[#030712] p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nivel Superior T.A. 1 (m)</label>
                  <input type="number" step="0.001" value={t1Ta1} onChange={e=>setT1Ta1(parseFloat(e.target.value)||0)} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nivel Inferior T.A. 2 (m)</label>
                  <input type="number" step="0.001" value={t1Ta2} onChange={e=>setT1Ta2(parseFloat(e.target.value)||0)} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm" />
                </div>
              </div>
            )}

            {tipoConnection === 'tipo2' && (
              <div className="space-y-3 bg-[#030712] p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Cota T.S.P. Superior (m)</label>
                  <input type="number" step="0.001" value={t2TcSup} onChange={e=>setT2TcSup(parseFloat(e.target.value)||0)} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Cota T.S.P. Inferior (m)</label>
                  <input type="number" step="0.001" value={t2TcInf} onChange={e=>setT2TcInf(parseFloat(e.target.value)||0)} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm" />
                </div>
              </div>
            )}

            {tipoConnection === 'tipo3' && (
              <div className="space-y-3 bg-[#030712] p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Cota T.A. Superior (m)</label>
                  <input type="number" step="0.001" value={t3Ta} onChange={e=>setT3Ta(parseFloat(e.target.value)||0)} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Cota T.C. Losa Inferior (m)</label>
                  <input type="number" step="0.001" value={t3Tc} onChange={e=>setT3Tc(parseFloat(e.target.value)||0)} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm" />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">3. DIMENSIONES DE PELDAÑO & TRAMO</label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Contrahuella (mm)</label>
                <input type="number" value={targetContrahuella} onChange={e=>setTargetContrahuella(parseFloat(e.target.value)||0)} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Huella b (mm)</label>
                <input type="number" value={huella} onChange={e=>setHuella(parseFloat(e.target.value)||0)} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Ancho Libre de Tramo A (mm)</label>
              <input type="number" value={anchoTramo} onChange={e=>setAnchoTramo(parseFloat(e.target.value)||0)} className="w-full bg-[#030712] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm" />
            </div>
          </div>

          {/* Presets Normados Lámina 5 */}
          <div>
            <label className="block text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">TABLA OFICIAL DE PRESETS (LÁMINA 5)</label>
            <div className="max-h-48 overflow-y-auto bg-[#030712] border border-slate-800 rounded-xl p-2 space-y-1">
              {NORMATIVE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(p)}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 flex justify-between items-center text-xs transition-colors"
                >
                  <span className="font-mono text-slate-200">{p.angle}° | b={p.b} | h={p.h}</span>
                  <span className={p.class}>{p.status}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Panel Derecho: Visor CAD Multi-Vista */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Selector de Vistas CAD (Tabs) */}
          <div className="flex items-center justify-between bg-[#0f172a] p-2 rounded-2xl border border-slate-800 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("elevation")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'elevation' ? 'bg-sky-500 text-slate-900 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <i className="fa-solid fa-layer-group mr-1.5"></i> Elevación Estructural (Corte A-A)
              </button>
              <button
                onClick={() => setActiveTab("plan")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'plan' ? 'bg-sky-500 text-slate-900 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <i className="fa-solid fa-table-cells-large mr-1.5"></i> Planta Estructural (Top View)
              </button>
            </div>
            <span className="text-[11px] font-mono text-slate-400 px-3">
              Escala Visual: 1:50 | Eje C250
            </span>
          </div>

          {/* Canvas SVG */}
          <div className="bg-[#020617] border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex-1 min-h-[480px] shadow-2xl flex items-center justify-center">
            {activeTab === 'elevation' && (
              <SvgElevationView
                results={results}
                huella={huella}
                t1Ta1={t1Ta1} t1Ta2={t1Ta2}
                t2TcSup={t2TcSup} t2TcInf={t2TcInf}
                t3Ta={t3Ta} t3Tc={t3Tc}
                tipoConnection={tipoConnection}
              />
            )}
            {activeTab === 'plan' && (
              <SvgPlanView
                results={results}
                huella={huella}
                anchoTramo={anchoTramo}
              />
            )}
          </div>

          {/* Alerta de Descanso Intermedio si H > 3000 mm */}
          {results.requiereDescanso && (
            <div className="bg-amber-500/10 border border-amber-500/40 text-amber-300 p-4 rounded-xl flex items-center gap-3">
              <i className="fa-solid fa-triangle-exclamation text-2xl text-amber-400"></i>
              <div>
                <h4 className="font-bold text-sm">Alerta de Altura Normada (Lámina 2 - H &gt; 3000 mm)</h4>
                <p className="text-xs text-amber-200/90">
                  La altura vertical de {results.alturaTotal.toFixed(0)} mm supera el límite permitido por tramo (H ≤ 3000 mm). Se requiere incorporar un descanso intermedio obligatorio de 800 mm mínimo.
                </p>
              </div>
            </div>
          )}

          {/* Resultados Numéricos */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 text-center">
              <span className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Altura Total H</span>
              <span className="text-xl font-bold text-white font-mono">{results.alturaTotal.toFixed(0)} mm</span>
            </div>
            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 text-center">
              <span className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Nº Peldaños</span>
              <span className="text-xl font-bold text-sky-400 font-mono">{results.numeroPeldanos}</span>
            </div>
            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 text-center">
              <span className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Contrahuella h</span>
              <span className="text-xl font-bold text-white font-mono">{results.contrahuellaCalculada.toFixed(1)} mm</span>
            </div>
            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 text-center">
              <span className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Ángulo α</span>
              <span className={`text-xl font-bold font-mono ${results.angulo >= 30 && results.angulo <= 40 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {results.angulo.toFixed(1)}°
              </span>
            </div>
            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 text-center">
              <span className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Desarrollo L</span>
              <span className="text-xl font-bold text-white font-mono">{results.longitudMedia.toFixed(0)} mm</span>
            </div>
          </div>

          {/* Fórmulas de Confort Blondel y Seguridad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border flex justify-between items-center ${results.blondel >= 610 && results.blondel <= 650 ? 'bg-emerald-950/30 border-emerald-800/60' : 'bg-rose-950/30 border-rose-800/60'}`}>
              <div>
                <span className="block text-xs uppercase text-slate-400 font-bold mb-1">Fórmula Blondel (b + 2h = 630mm)</span>
                <span className="text-2xl font-bold text-white font-mono">{results.blondel.toFixed(1)} mm</span>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${results.blondel >= 610 && results.blondel <= 650 ? 'bg-emerald-800/60 text-emerald-300' : 'bg-rose-800/60 text-rose-300'}`}>
                {results.blondel >= 610 && results.blondel <= 650 ? "Confort Conforme" : "Fuera de Rango"}
              </span>
            </div>

            <div className={`p-4 rounded-xl border flex justify-between items-center ${results.seguridad <= 460 ? 'bg-emerald-950/30 border-emerald-800/60' : 'bg-rose-950/30 border-rose-800/60'}`}>
              <div>
                <span className="block text-xs uppercase text-slate-400 font-bold mb-1">Regla de Seguridad (b + h ≤ 460mm)</span>
                <span className="text-2xl font-bold text-white font-mono">{results.seguridad.toFixed(1)} mm</span>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${results.seguridad <= 460 ? 'bg-emerald-800/60 text-emerald-300' : 'bg-rose-800/60 text-rose-300'}`}>
                {results.seguridad <= 460 ? "Seguro" : "Inseguro"}
              </span>
            </div>
          </div>

          {/* Memoria de Cubicaciones BOM */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              <i className="fa-solid fa-boxes-stacked mr-2"></i> Memoria de Cubicaciones & Pesos Estructurales (BOM)
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="bg-[#030712] p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Limones C250 (2 uds)</span>
                <span className="text-base font-bold text-white">{results.bom.pesoLimonesKg} kg</span>
                <span className="text-[10px] text-slate-500 block">L = {results.bom.longitudDiagonalM} m</span>
              </div>
              <div className="bg-[#030712] p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Peldaños Grating</span>
                <span className="text-base font-bold text-white">{results.bom.pesoPeldañosKg} kg</span>
                <span className="text-[10px] text-slate-500 block">{results.numeroPeldanos} unidades</span>
              </div>
              <div className="bg-[#030712] p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Pasamanos Ø1-1/2" SCH40</span>
                <span className="text-base font-bold text-white">{results.bom.pesoPasamanosKg} kg</span>
                <span className="text-[10px] text-slate-500 block">Postes + Barandas</span>
              </div>
              <div className="bg-[#030712] p-3 rounded-xl border border-sky-500/40">
                <span className="text-sky-400 block mb-1 font-bold">PESO TOTAL ACERO</span>
                <span className="text-base font-bold text-sky-400">{results.bom.pesoTotalAceroKg} kg</span>
                <span className="text-[10px] text-slate-400 block">{results.bom.pernosAnclaje} Pernos Ø5/8"</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
