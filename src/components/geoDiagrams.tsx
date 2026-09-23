import React from "react";
import type { ShapeId } from "../utils/geoCalcUtils";

// Paleta del sitio (src/styles/index.css :root)
const KNOWN = "#3b82f6";   // dato conocido (accent)
const KNOWN_L = "#60a5fa"; // etiqueta de dato conocido (accent2)
const ANGLE = "#f59e0b";   // ángulos (orange)
const UNKNOWN = "#475569"; // por calcular
const RESULT = "#22c55e";  // resultados / alturas (green)
const MUTED = "#94a3b8";
const FAINT = "#1f2937";

const MONO = "monospace";

const sideProps = (isKnown: boolean) =>
  isKnown
    ? { stroke: KNOWN, strokeWidth: 2.5 }
    : { stroke: UNKNOWN, strokeWidth: 1.5, strokeDasharray: "5 4" };

const arcProps = (isKnown: boolean) =>
  isKnown
    ? { stroke: ANGLE, strokeWidth: 2 }
    : { stroke: UNKNOWN, strokeWidth: 1.2, strokeDasharray: "4 3" };

export const DiagramLegend: React.FC = () => (
  <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[10px] font-mono text-slate-500">
    <span className="flex items-center gap-1.5">
      <span className="inline-block w-4 h-0.5 bg-[#3b82f6]" /> Dato conocido
    </span>
    <span className="flex items-center gap-1.5">
      <span className="inline-block w-4 border-t-2 border-dashed border-[#475569]" /> A calcular
    </span>
    <span className="flex items-center gap-1.5">
      <span className="inline-block w-3 h-3 rounded-full border-2 border-[#f59e0b]" /> Ángulo
    </span>
  </div>
);

// ─── Triángulo rectángulo ────────────────────────────────────────────────
// Geometría: C=90° en (20,140), A en (20,20), B en (190,140)
// lado a = base, lado b = vertical, c = hipotenusa
export type RightCase = "hyp-angle" | "hyp-leg" | "leg-angle" | "two-legs";

export const RightTriangleDiagram: React.FC<{
  activeCase: RightCase;
  values?: { a: number; b: number; c: number } | null;
}> = ({ activeCase, values }) => {
  const known = {
    c: activeCase === "hyp-angle" || activeCase === "hyp-leg",
    a: activeCase === "hyp-leg" || activeCase === "two-legs",
    b: activeCase === "leg-angle" || activeCase === "two-legs",
    A: activeCase === "hyp-angle",
    B: activeCase === "leg-angle",
  };
  return (
    <svg viewBox="0 0 220 160" className="w-full max-w-xs mx-auto" aria-label="Esquema de triángulo rectángulo">
      <polygon points="20,140 20,20 190,140" fill="rgba(59,130,246,0.05)" stroke="none" />
      <line x1="20" y1="140" x2="20" y2="20" {...sideProps(known.b)} />
      <line x1="20" y1="140" x2="190" y2="140" {...sideProps(known.a)} />
      <line x1="20" y1="20" x2="190" y2="140" {...sideProps(known.c)} />
      <polyline points="20,112 48,112 48,140" fill="none" stroke={MUTED} strokeWidth="1.2" />
      <path d="M 20,52 A 32 32 0 0 0 46.1,38.4" fill="none" {...arcProps(known.A)} />
      <path d="M 158,140 A 32 32 0 0 1 163.9,121.6" fill="none" {...arcProps(known.B)} />
      <text x="4" y="85" fill={known.b ? KNOWN_L : UNKNOWN} fontSize="13" fontFamily={MONO} fontWeight="bold">b</text>
      <text x="103" y="157" fill={known.a ? KNOWN_L : UNKNOWN} fontSize="13" fontFamily={MONO} fontWeight="bold">a</text>
      <text x="112" y="76" fill={known.c ? KNOWN_L : UNKNOWN} fontSize="13" fontFamily={MONO} fontWeight="bold">c</text>
      <text x="27" y="40" fill={known.A ? ANGLE : UNKNOWN} fontSize="11" fontFamily={MONO} fontWeight="bold">A</text>
      <text x="148" y="133" fill={known.B ? ANGLE : UNKNOWN} fontSize="11" fontFamily={MONO} fontWeight="bold">B</text>
      <text x="52" y="130" fill={MUTED} fontSize="9" fontFamily={MONO}>90°</text>
      {values && (
        <>
          <text x="4" y="99" fill={RESULT} fontSize="9" fontFamily={MONO}>{values.b.toFixed(2)}</text>
          <text x="84" y="157" fill={RESULT} fontSize="9" fontFamily={MONO}>{values.a.toFixed(2)}</text>
          <text x="106" y="64" fill={RESULT} fontSize="9" fontFamily={MONO}>{values.c.toFixed(2)}</text>
        </>
      )}
    </svg>
  );
};

// ─── Triángulo oblicuángulo ──────────────────────────────────────────────
// Geometría: A en (30,140), C en (100,20), B en (190,140)
// lado a = derecha, lado b = izquierda, c = base
export type ObliqueCase = "side-angles" | "two-sides-angle" | "three-sides" | "two-sides-opp";

export const ObliqueTriangleDiagram: React.FC<{
  activeCase: ObliqueCase;
  values?: { a: number; b: number; c: number } | null;
}> = ({ activeCase, values }) => {
  const known = {
    a: activeCase === "side-angles" || activeCase === "two-sides-angle" || activeCase === "three-sides",
    b: activeCase === "two-sides-angle" || activeCase === "three-sides" || activeCase === "two-sides-opp",
    c: activeCase === "three-sides" || activeCase === "two-sides-opp",
    A: false,
    B: activeCase === "side-angles" || activeCase === "two-sides-opp",
    C: activeCase === "side-angles" || activeCase === "two-sides-angle",
  };
  return (
    <svg viewBox="0 0 220 160" className="w-full max-w-xs mx-auto" aria-label="Esquema de triángulo oblicuángulo">
      <polygon points="30,140 100,20 190,140" fill="rgba(59,130,246,0.05)" stroke="none" />
      <line x1="30" y1="140" x2="100" y2="20" {...sideProps(known.b)} />
      <line x1="100" y1="20" x2="190" y2="140" {...sideProps(known.a)} />
      <line x1="30" y1="140" x2="190" y2="140" {...sideProps(known.c)} />
      <path d="M 56,140 A 26 26 0 0 0 43.1,117.6" fill="none" {...arcProps(known.A)} />
      <path d="M 115.6,40.8 A 26 26 0 0 1 86.9,42.5" fill="none" {...arcProps(known.C)} />
      <path d="M 164,140 A 26 26 0 0 1 174.4,119.2" fill="none" {...arcProps(known.B)} />
      <text x="50" y="85" fill={known.b ? KNOWN_L : UNKNOWN} fontSize="13" fontFamily={MONO} fontWeight="bold">b</text>
      <text x="152" y="85" fill={known.a ? KNOWN_L : UNKNOWN} fontSize="13" fontFamily={MONO} fontWeight="bold">a</text>
      <text x="105" y="156" fill={known.c ? KNOWN_L : UNKNOWN} fontSize="13" fontFamily={MONO} fontWeight="bold">c</text>
      <text x="14" y="152" fill={known.A ? ANGLE : UNKNOWN} fontSize="11" fontFamily={MONO} fontWeight="bold">A</text>
      <text x="95" y="14" fill={known.C ? ANGLE : UNKNOWN} fontSize="11" fontFamily={MONO} fontWeight="bold">C</text>
      <text x="196" y="152" fill={known.B ? ANGLE : UNKNOWN} fontSize="11" fontFamily={MONO} fontWeight="bold">B</text>
      {values && (
        <>
          <text x="42" y="99" fill={RESULT} fontSize="9" fontFamily={MONO}>{values.b.toFixed(2)}</text>
          <text x="146" y="99" fill={RESULT} fontSize="9" fontFamily={MONO}>{values.a.toFixed(2)}</text>
          <text x="98" y="156" fill={RESULT} fontSize="9" fontFamily={MONO}>{values.c.toFixed(2)}</text>
        </>
      )}
    </svg>
  );
};

// ─── Figuras de áreas ────────────────────────────────────────────────────
const ShapeBody: React.FC<{ shapeId: ShapeId }> = ({ shapeId }) => {
  const dim = { stroke: KNOWN_L, strokeWidth: 1.5 };
  const helper = { stroke: UNKNOWN, strokeWidth: 1.2, strokeDasharray: "4 3" };
  const lbl = { fontFamily: MONO, fontSize: 12, fontWeight: "bold" } as const;
  switch (shapeId) {
    case "circle":
      return (
        <>
          <circle cx="100" cy="75" r="55" fill="rgba(59,130,246,0.08)" stroke={KNOWN} strokeWidth="2" />
          <circle cx="100" cy="75" r="2.5" fill={KNOWN_L} />
          <line x1="100" y1="75" x2="145" y2="43.4" {...dim} />
          <text x="116" y="52" fill={KNOWN_L} {...lbl}>r</text>
        </>
      );
    case "sector":
      return (
        <>
          <path d="M 100,115 L 100,30 A 85 85 0 0 1 177,79.1 Z" fill="rgba(59,130,246,0.08)" stroke={KNOWN} strokeWidth="2" />
          <circle cx="100" cy="115" r="2.5" fill={KNOWN_L} />
          <path d="M 100,93 A 22 22 0 0 1 119.9,105.7" fill="none" stroke={ANGLE} strokeWidth="2" />
          <text x="110" y="98" fill={ANGLE} fontSize="11" fontFamily={MONO} fontWeight="bold">α</text>
          <text x="86" y="72" fill={KNOWN_L} {...lbl}>r</text>
        </>
      );
    case "segment":
      return (
        <>
          <circle cx="100" cy="88" r="58" fill="none" {...helper} />
          <path d="M 49.8,59 L 150.2,59 A 58 58 0 0 0 49.8,59 Z" fill="rgba(59,130,246,0.12)" stroke={KNOWN} strokeWidth="2" />
          <line x1="100" y1="88" x2="49.8" y2="59" {...dim} />
          <line x1="100" y1="88" x2="150.2" y2="59" {...dim} />
          <circle cx="100" cy="88" r="2.5" fill={KNOWN_L} />
          <path d="M 84.4,79 A 18 18 0 0 1 115.6,79" fill="none" stroke={ANGLE} strokeWidth="2" />
          <text x="95" y="76" fill={ANGLE} fontSize="11" fontFamily={MONO} fontWeight="bold">α</text>
          <text x="62" y="68" fill={KNOWN_L} {...lbl}>r</text>
        </>
      );
    case "crown":
      return (
        <>
          <path d="M 160,75 A 60,60 0 1,1 40,75 A 60,60 0 1,1 160,75 M 132,75 A 32,32 0 1,1 68,75 A 32,32 0 1,1 132,75"
            fill="rgba(59,130,246,0.12)" fillRule="evenodd" />
          <circle cx="100" cy="75" r="60" fill="none" stroke={KNOWN} strokeWidth="2" />
          <circle cx="100" cy="75" r="32" fill="none" stroke={KNOWN} strokeWidth="1.5" />
          <circle cx="100" cy="75" r="2.5" fill={KNOWN_L} />
          <line x1="100" y1="75" x2="160" y2="75" {...dim} />
          <line x1="100" y1="75" x2="100" y2="43" {...dim} />
          <text x="126" y="68" fill={KNOWN_L} {...lbl}>R</text>
          <text x="106" y="57" fill={KNOWN_L} {...lbl}>r</text>
        </>
      );
    case "triangle":
      return (
        <>
          <polygon points="25,120 175,120 85,35" fill="rgba(59,130,246,0.08)" stroke={KNOWN} strokeWidth="2" />
          <line x1="85" y1="35" x2="85" y2="120" stroke={RESULT} strokeWidth="1.5" strokeDasharray="5 4" />
          <polyline points="85,112 93,112 93,120" fill="none" stroke={MUTED} strokeWidth="1" />
          <text x="95" y="136" fill={KNOWN_L} {...lbl}>b</text>
          <text x="92" y="82" fill={RESULT} {...lbl}>h</text>
        </>
      );
    case "rectangle":
      return (
        <>
          <rect x="35" y="45" width="130" height="70" fill="rgba(59,130,246,0.08)" stroke={KNOWN} strokeWidth="2" />
          <text x="95" y="132" fill={KNOWN_L} {...lbl}>a</text>
          <text x="172" y="84" fill={KNOWN_L} {...lbl}>b</text>
        </>
      );
    case "trapezoid":
      return (
        <>
          <polygon points="30,115 170,115 130,50 70,50" fill="rgba(59,130,246,0.08)" stroke={KNOWN} strokeWidth="2" />
          <line x1="100" y1="50" x2="100" y2="115" stroke={RESULT} strokeWidth="1.5" strokeDasharray="5 4" />
          <text x="92" y="132" fill={KNOWN_L} {...lbl}>a</text>
          <text x="95" y="44" fill={KNOWN_L} {...lbl}>b</text>
          <text x="106" y="86" fill={RESULT} {...lbl}>h</text>
        </>
      );
    case "polygon":
      return (
        <>
          <polygon points="100,26 145,52 145,104 100,130 55,104 55,52" fill="rgba(59,130,246,0.08)" stroke={KNOWN} strokeWidth="2" />
          <text x="118" y="124" fill={KNOWN_L} {...lbl}>L</text>
          <text x="93" y="82" fill={MUTED} fontSize="11" fontFamily={MONO}>n</text>
        </>
      );
    case "ellipse":
      return (
        <>
          <ellipse cx="100" cy="75" rx="70" ry="38" fill="rgba(59,130,246,0.08)" stroke={KNOWN} strokeWidth="2" />
          <circle cx="100" cy="75" r="2.5" fill={KNOWN_L} />
          <line x1="100" y1="75" x2="170" y2="75" {...dim} />
          <line x1="100" y1="75" x2="100" y2="37" {...dim} />
          <text x="131" y="68" fill={KNOWN_L} {...lbl}>a</text>
          <text x="106" y="58" fill={KNOWN_L} {...lbl}>b</text>
        </>
      );
    default:
      return null;
  }
};

export const ShapeDiagram: React.FC<{ shapeId: ShapeId }> = ({ shapeId }) => (
  <svg viewBox="0 0 200 150" className="w-full max-w-[220px] mx-auto" aria-label={`Esquema de la figura ${shapeId}`}>
    <ShapeBody shapeId={shapeId} />
  </svg>
);

// ─── Círculo unitario (funciones trigonométricas) ────────────────────────
export const UnitCircleDiagram: React.FC<{ angleDeg: number | null }> = ({ angleDeg }) => {
  const has = angleDeg !== null && isFinite(angleDeg);
  const norm = has ? (((angleDeg as number) % 360) + 360) % 360 : null;
  const rad = norm !== null ? (norm * Math.PI) / 180 : Math.PI / 4;
  const cx = 100, cy = 100, r = 78;
  const x = cx + r * Math.cos(rad);
  const y = cy - r * Math.sin(rad);
  const arcR = 24;
  const ax = cx + arcR * Math.cos(rad);
  const ay = cy - arcR * Math.sin(rad);
  const largeArc = norm !== null && norm > 180 ? 1 : 0;
  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[220px] mx-auto" aria-label="Círculo unitario">
      <line x1="10" y1={cy} x2="190" y2={cy} stroke={FAINT} strokeWidth="1" />
      <line x1={cx} y1="10" x2={cx} y2="190" stroke={FAINT} strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={KNOWN} strokeWidth="1.5" opacity="0.6" />
      {has && norm !== null && norm > 0.0001 && (
        <path d={`M ${cx + arcR},${cy} A ${arcR} ${arcR} 0 ${largeArc} 0 ${ax.toFixed(1)},${ay.toFixed(1)}`}
          fill="none" stroke={ANGLE} strokeWidth="2" />
      )}
      {has && (
        <>
          <line x1={cx} y1={cy} x2={x} y2={cy} stroke={KNOWN_L} strokeWidth="3" />
          <line x1={x} y1={cy} x2={x} y2={y} stroke={RESULT} strokeWidth="3" />
        </>
      )}
      <line x1={cx} y1={cy} x2={x} y2={y}
        stroke={has ? "#e2e8f0" : UNKNOWN} strokeWidth="1.5" strokeDasharray={has ? undefined : "5 4"} />
      <circle cx={x} cy={y} r="3" fill={has ? "#e2e8f0" : UNKNOWN} />
      <circle cx={cx} cy={cy} r="2.5" fill={MUTED} />
      {has && (
        <>
          <text x={(cx + x) / 2} y={cy + 14} fill={KNOWN_L} fontSize="10" fontFamily={MONO} textAnchor="middle">cos</text>
          <text x={x + (x >= cx ? 6 : -6)} y={(cy + y) / 2} fill={RESULT} fontSize="10" fontFamily={MONO}
            textAnchor={x >= cx ? "start" : "end"}>sin</text>
          <text x={cx + arcR + 10} y={cy - 8} fill={ANGLE} fontSize="10" fontFamily={MONO}>α</text>
        </>
      )}
      {!has && (
        <text x={cx} y={cy + r + 18} fill={MUTED} fontSize="9" fontFamily={MONO} textAnchor="middle">r = 1</text>
      )}
    </svg>
  );
};

// ─── Parábola (ecuación cuadrática) ──────────────────────────────────────
export const ParabolaDiagram: React.FC<{
  a: number;
  b: number;
  c: number;
  x1: number | null;
  x2: number | null;
  hasInput: boolean;
}> = ({ a, b, c, x1, x2, hasInput }) => {
  if (!hasInput || !isFinite(a) || a === 0 || !isFinite(b) || !isFinite(c)) {
    return (
      <svg viewBox="0 0 220 160" className="w-full max-w-xs mx-auto" aria-label="Parábola genérica">
        <line x1="15" y1="110" x2="205" y2="110" stroke={FAINT} strokeWidth="1" />
        <path d="M 40,30 Q 110,190 180,30" fill="none" stroke={UNKNOWN} strokeWidth="2" strokeDasharray="5 4" />
        <text x="110" y="150" fill={MUTED} fontSize="10" fontFamily={MONO} textAnchor="middle">y = a·x² + b·x + c</text>
      </svg>
    );
  }
  const f = (x: number) => a * x * x + b * x + c;
  const xv = -b / (2 * a);
  const roots = [x1, x2].filter((r): r is number => r !== null);
  const span = roots.length === 2 ? Math.max((Math.abs(roots[1] - roots[0]) / 2) * 1.6, 2) : 3;
  const N = 60;
  const xs: number[] = [];
  for (let i = 0; i <= N; i++) xs.push(xv - span + (2 * span * i) / N);
  let ymin = Math.min(...xs.map(f), 0);
  let ymax = Math.max(...xs.map(f), 0);
  if (ymax - ymin < 1e-9) ymax = ymin + 1;
  const pad = (ymax - ymin) * 0.18;
  ymin -= pad;
  ymax += pad;
  const px = (x: number) => 15 + ((x - (xv - span)) / (2 * span)) * 190;
  const py = (y: number) => 140 - ((y - ymin) / (ymax - ymin)) * 115;
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${px(x).toFixed(1)},${py(f(x)).toFixed(1)}`).join(" ");
  const axisY = py(0);
  const uniqueRoots = roots.filter((r, i) => i === 0 || Math.abs(r - roots[0]) > 1e-9);
  return (
    <svg viewBox="0 0 220 160" className="w-full max-w-xs mx-auto" aria-label="Gráfica de la parábola">
      <line x1="15" y1={axisY} x2="205" y2={axisY} stroke={FAINT} strokeWidth="1.5" />
      <text x="207" y={axisY + 4} fill={MUTED} fontSize="9" fontFamily={MONO}>x</text>
      <path d={d} fill="none" stroke={KNOWN} strokeWidth="2" />
      {uniqueRoots.map((r, i) => (
        <g key={i}>
          <circle cx={px(r)} cy={axisY} r="3.5" fill={RESULT} />
          <text x={px(r)} y={Math.min(axisY + 14, 156)} fill={RESULT} fontSize="9" fontFamily={MONO} textAnchor="middle">
            x{uniqueRoots.length > 1 ? i + 1 : ""}
          </text>
        </g>
      ))}
      {uniqueRoots.length === 0 && (
        <text x="110" y="152" fill={MUTED} fontSize="9" fontFamily={MONO} textAnchor="middle">sin cruces reales con el eje x</text>
      )}
    </svg>
  );
};

// ─── Rueda de conversión angular ─────────────────────────────────────────
export const AngleWheelDiagram: React.FC<{ degrees: number | null }> = ({ degrees }) => {
  const has = degrees !== null && isFinite(degrees);
  const norm = has ? (((degrees as number) % 360) + 360) % 360 : 0;
  const rad = (norm * Math.PI) / 180;
  const cx = 100, cy = 86, r = 60;
  const x = cx + r * Math.cos(rad);
  const y = cy - r * Math.sin(rad);
  const arcR = 22;
  const ax = cx + arcR * Math.cos(rad);
  const ay = cy - arcR * Math.sin(rad);
  const largeArc = norm > 180 ? 1 : 0;
  return (
    <svg viewBox="0 0 200 175" className="w-full max-w-[220px] mx-auto" aria-label="Rueda de conversión angular">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={KNOWN} strokeWidth="1.5" opacity="0.5" />
      <text x={cx + r + 5} y={cy + 3} fill="#64748b" fontSize="9" fontFamily={MONO}>0°</text>
      <text x={cx} y={cy - r - 6} fill="#64748b" fontSize="9" fontFamily={MONO} textAnchor="middle">90°</text>
      <text x={cx - r - 5} y={cy + 3} fill="#64748b" fontSize="9" fontFamily={MONO} textAnchor="end">180°</text>
      <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={UNKNOWN} strokeWidth="1.2" strokeDasharray="4 3" />
      {has && norm > 0.0001 && (
        <path d={`M ${cx + arcR},${cy} A ${arcR} ${arcR} 0 ${largeArc} 0 ${ax.toFixed(1)},${ay.toFixed(1)}`}
          fill="none" stroke={ANGLE} strokeWidth="2" />
      )}
      {has && (
        <>
          <line x1={cx} y1={cy} x2={x} y2={y} stroke={KNOWN_L} strokeWidth="2" />
          <circle cx={x} cy={y} r="3" fill={KNOWN_L} />
        </>
      )}
      <circle cx={cx} cy={cy} r="2.5" fill={MUTED} />
      <text x={cx} y={cy + r + 18} fill={has ? KNOWN_L : "#64748b"} fontSize="11" fontFamily={MONO} fontWeight="bold" textAnchor="middle">
        {has ? `${norm.toFixed(2)}°` : "—"}
      </text>
    </svg>
  );
};
