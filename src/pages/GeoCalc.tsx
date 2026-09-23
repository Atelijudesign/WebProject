import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import {
  DiagramLegend,
  RightTriangleDiagram,
  ObliqueTriangleDiagram,
  ShapeDiagram,
  UnitCircleDiagram,
  ParabolaDiagram,
  AngleWheelDiagram,
  type RightCase,
  type ObliqueCase,
} from "../components/geoDiagrams";
import {
  rightTriangle_hypAngle,
  rightTriangle_hypLeg,
  rightTriangle_legAngle,
  rightTriangle_twoLegs,
  obliqueTriangle_sideAngles,
  obliqueTriangle_twoSidesAngle,
  obliqueTriangle_threeSides,
  obliqueTriangle_twoSidesOppAngle,
  calcTrigFunctions,
  solveQuadratic,
  convertAngle,
  SHAPE_DEFINITIONS,
  type RightTriangleResult,
  type ObliqueTriangleResult,
  type TrigFunctions,
  type QuadraticResult,
  type ShapeId,
} from "../utils/geoCalcUtils";

// ─── Estilo del sitio (index.css): azul plano #3b82f6, sin degradados ───
const BTN_ACTIVE = "bg-[#3b82f6] border-transparent text-white shadow-lg shadow-[#3b82f6]/25 hover:bg-[#60a5fa]";
const BTN_GHOST = "bg-white/[0.07] border-white/15 text-slate-200 hover:border-[#3b82f6]/70 hover:text-white hover:bg-white/10";

const ResultRow: React.FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
  <div className={`flex justify-between items-center px-4 py-2.5 rounded-lg border transition-colors ${accent ? "bg-[#3b82f6]/10 border-[#3b82f6]/40" : "bg-white/[0.03] border-white/10"}`}>
    <span className="text-sm text-slate-400 font-medium">{label}</span>
    <span className={`font-mono text-sm font-bold ${accent ? "text-[#60a5fa]" : "text-slate-100"}`}>{value}</span>
  </div>
);

const NumInput: React.FC<{ label: string; symbol?: string; value: string; onChange: (v: string) => void; placeholder?: string; }> = ({ label, symbol, value, onChange, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
      {label}{symbol && <span className="ml-1 text-[#60a5fa]">[{symbol}]</span>}
    </label>
    <input
      type="number"
      step="any"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "0"}
      className="w-full bg-[#111a2c] border border-white/20 rounded-lg px-3 py-2.5 text-white caret-[#60a5fa] font-mono text-sm font-semibold focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 hover:border-white/30 transition-all placeholder:text-slate-500 placeholder:font-normal"
    />
  </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-sm font-black text-white font-head uppercase tracking-wider flex items-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
    {children}
  </h3>
);

const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <p className="text-xs text-slate-500 text-center py-8 font-mono">{text}</p>
);

type Tab = "triangle-right" | "triangle-oblique" | "areas" | "trig" | "quadratic" | "angles";

const TAB_CONFIG: { id: Tab; label: string; icon: string }[] = [
  { id: "triangle-right", label: "Tri. Rectángulo", icon: "fa-solid fa-ruler-combined" },
  { id: "triangle-oblique", label: "Tri. Oblicuángulo", icon: "fa-solid fa-draw-polygon" },
  { id: "areas", label: "Áreas", icon: "fa-solid fa-shapes" },
  { id: "trig", label: "Funciones Trig.", icon: "fa-solid fa-wave-square" },
  { id: "quadratic", label: "Ec. Cuadrática", icon: "fa-solid fa-square-root-variable" },
  { id: "angles", label: "Ángulos", icon: "fa-solid fa-compass-drafting" },
];

const RightTriangleSection: React.FC = () => {
  const [activeCase, setActiveCase] = useState<RightCase>("hyp-angle");
  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const result: RightTriangleResult = useMemo(() => {
    const n1 = parseFloat(v1);
    const n2 = parseFloat(v2);
    if (activeCase === "hyp-angle") return rightTriangle_hypAngle(n1, n2);
    if (activeCase === "hyp-leg") return rightTriangle_hypLeg(n1, n2);
    if (activeCase === "leg-angle") return rightTriangle_legAngle(n1, n2);
    return rightTriangle_twoLegs(n1, n2);
  }, [activeCase, v1, v2]);
  const cases: { id: RightCase; title: string; l1: string; s1: string; l2: string; s2: string }[] = [
    { id: "hyp-angle", title: "Hipotenusa + Ángulo", l1: "Hipotenusa", s1: "c", l2: "Ángulo A", s2: "A°" },
    { id: "hyp-leg", title: "Hipotenusa + Cateto", l1: "Hipotenusa", s1: "c", l2: "Cateto a", s2: "a" },
    { id: "leg-angle", title: "Cateto + Ángulo", l1: "Cateto b", s1: "b", l2: "Ángulo B", s2: "B°" },
    { id: "two-legs", title: "Dos Catetos", l1: "Cateto a", s1: "a", l2: "Cateto b", s2: "b" },
  ];
  const ac = cases.find((c) => c.id === activeCase)!;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
        <SectionTitle>Triángulo Rectángulo</SectionTitle>
        <RightTriangleDiagram
          activeCase={activeCase}
          values={result.isValid ? { a: result.a, b: result.b, c: result.c } : null}
        />
        <DiagramLegend />
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">// Datos conocidos</p>
          <div className="grid grid-cols-2 gap-2">
            {cases.map((c) => (
              <button key={c.id} type="button" onClick={() => { setActiveCase(c.id); setV1(""); setV2(""); }}
                className={`text-xs py-2.5 px-3 rounded-lg border transition-all duration-200 text-left font-semibold ${activeCase === c.id ? BTN_ACTIVE : BTN_GHOST}`}>
                {c.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
          <SectionTitle>{ac.title}</SectionTitle>
          <NumInput label={ac.l1} symbol={ac.s1} value={v1} onChange={setV1} />
          <NumInput label={ac.l2} symbol={ac.s2} value={v2} onChange={setV2} />
        </div>
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-3">
          <SectionTitle>Resultados</SectionTitle>
          {result.error && <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 font-mono">{result.error}</div>}
          {result.isValid && (
            <>
              <ResultRow label="Cateto a" value={result.a.toFixed(4)} />
              <ResultRow label="Cateto b" value={result.b.toFixed(4)} />
              <ResultRow label="Hipotenusa c" value={result.c.toFixed(4)} accent />
              <ResultRow label="Ángulo A" value={result.A.toFixed(4) + "°"} />
              <ResultRow label="Ángulo B" value={result.B.toFixed(4) + "°"} />
              <ResultRow label="Ángulo C" value="90°" />
              <div className="border-t border-white/10 pt-3 mt-1 flex flex-col gap-2">
                <ResultRow label="Área" value={result.area.toFixed(4) + " u²"} accent />
                <ResultRow label="Perímetro" value={result.perimeter.toFixed(4) + " u"} />
              </div>
            </>
          )}
          {!result.isValid && !result.error && <EmptyState text="Ingresa los valores para calcular" />}
        </div>
      </div>
    </div>
  );
};

const ObliqueTriangleSection: React.FC = () => {
  const [activeCase, setActiveCase] = useState<ObliqueCase>("side-angles");
  const [v1, setV1] = useState(""); const [v2, setV2] = useState(""); const [v3, setV3] = useState("");
  const result: ObliqueTriangleResult = useMemo(() => {
    const n1 = parseFloat(v1); const n2 = parseFloat(v2); const n3 = parseFloat(v3);
    if (activeCase === "side-angles") return obliqueTriangle_sideAngles(n1, n2, n3);
    if (activeCase === "two-sides-angle") return obliqueTriangle_twoSidesAngle(n1, n2, n3);
    if (activeCase === "three-sides") return obliqueTriangle_threeSides(n1, n2, n3);
    return obliqueTriangle_twoSidesOppAngle(n1, n2, n3);
  }, [activeCase, v1, v2, v3]);
  const cases: { id: ObliqueCase; title: string; inputs: { l: string; s: string }[] }[] = [
    { id: "side-angles", title: "Lado + 2 Ángulos (a,B,C)", inputs: [{ l: "Lado a", s: "a" }, { l: "Ángulo B", s: "B°" }, { l: "Ángulo C", s: "C°" }] },
    { id: "two-sides-angle", title: "2 Lados + Ángulo entre (a,b,C)", inputs: [{ l: "Lado a", s: "a" }, { l: "Lado b", s: "b" }, { l: "Ángulo C", s: "C°" }] },
    { id: "three-sides", title: "3 Lados (a,b,c)", inputs: [{ l: "Lado a", s: "a" }, { l: "Lado b", s: "b" }, { l: "Lado c", s: "c" }] },
    { id: "two-sides-opp", title: "2 Lados + Ángulo opuesto (b,c,B)", inputs: [{ l: "Lado b", s: "b" }, { l: "Lado c", s: "c" }, { l: "Ángulo B", s: "B°" }] },
  ];
  const ac = cases.find((c) => c.id === activeCase)!;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
        <SectionTitle>Triángulo Oblicuángulo</SectionTitle>
        <ObliqueTriangleDiagram
          activeCase={activeCase}
          values={result.isValid ? { a: result.a, b: result.b, c: result.c } : null}
        />
        <DiagramLegend />
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">// Caso conocido</p>
          <div className="flex flex-col gap-2">
            {cases.map((c) => (
              <button key={c.id} type="button" onClick={() => { setActiveCase(c.id); setV1(""); setV2(""); setV3(""); }}
                className={`text-xs py-2.5 px-3 rounded-lg border transition-all duration-200 text-left font-semibold ${activeCase === c.id ? BTN_ACTIVE : BTN_GHOST}`}>
                {c.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
          <SectionTitle>{ac.title}</SectionTitle>
          {ac.inputs.map((inp, i) => (
            <NumInput key={inp.s} label={inp.l} symbol={inp.s}
              value={i === 0 ? v1 : i === 1 ? v2 : v3}
              onChange={i === 0 ? setV1 : i === 1 ? setV2 : setV3} />
          ))}
        </div>
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-3">
          <SectionTitle>Resultados</SectionTitle>
          {result.error && <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 font-mono">{result.error}</div>}
          {result.isValid && (
            <>
              <ResultRow label="Lado a" value={result.a.toFixed(4)} accent />
              <ResultRow label="Lado b" value={result.b.toFixed(4)} accent />
              <ResultRow label="Lado c" value={result.c.toFixed(4)} accent />
              <div className="border-t border-white/10 pt-3 mt-1 flex flex-col gap-2">
                <ResultRow label="Ángulo A" value={result.A.toFixed(4) + "°"} />
                <ResultRow label="Ángulo B" value={result.B.toFixed(4) + "°"} />
                <ResultRow label="Ángulo C" value={result.C.toFixed(4) + "°"} />
              </div>
              <div className="border-t border-white/10 pt-3 mt-1 flex flex-col gap-2">
                <ResultRow label="Área" value={result.area.toFixed(4) + " u²"} />
                <ResultRow label="Perímetro" value={result.perimeter.toFixed(4) + " u"} />
              </div>
            </>
          )}
          {!result.isValid && !result.error && <EmptyState text="Ingresa los valores para calcular" />}
        </div>
      </div>
    </div>
  );
};

const AreasSection: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<ShapeId>("circle");
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const shapeDef = SHAPE_DEFINITIONS.find((s) => s.id === selectedShape)!;
  const numericInputs: Record<string, number> = {};
  shapeDef.inputs.forEach((inp) => { numericInputs[inp.id] = parseFloat(inputValues[inp.id] ?? "") || 0; });
  const allFilled = shapeDef.inputs.every((inp) => (numericInputs[inp.id] ?? 0) > 0);
  const calcResult = allFilled ? shapeDef.calc(numericInputs) : null;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="glass-card rounded-2xl p-4 flex flex-col gap-2">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1 px-2">// Figura Geométrica</h3>
        {SHAPE_DEFINITIONS.map((shape) => (
          <button key={shape.id} type="button" onClick={() => { setSelectedShape(shape.id); setInputValues({}); }}
            className={`text-sm py-2.5 px-4 rounded-lg border transition-all duration-200 text-left font-semibold ${selectedShape === shape.id ? BTN_ACTIVE : BTN_GHOST}`}>
            {shape.nameEs}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
          <SectionTitle>{shapeDef.nameEs}</SectionTitle>
          <ShapeDiagram shapeId={selectedShape} />
          <p className="text-xs text-[#60a5fa] font-mono bg-[#0d1420] border border-white/10 rounded-lg px-3 py-2">{shapeDef.formulaEs}</p>
          {shapeDef.inputs.map((inp) => (
            <NumInput key={inp.id} label={inp.label} symbol={inp.symbol}
              value={inputValues[inp.id] ?? ""}
              onChange={(val) => setInputValues((prev) => ({ ...prev, [inp.id]: val }))}
              placeholder={inp.description} />
          ))}
        </div>
      </div>
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-3">
        <SectionTitle>Resultados</SectionTitle>
        {calcResult ? (
          <>
            <ResultRow label="Área" value={calcResult.area.toFixed(6) + " u²"} accent />
            {calcResult.perimeter !== undefined && <ResultRow label="Perímetro" value={calcResult.perimeter.toFixed(6) + " u"} />}
            {calcResult.extras.map((ex) => <ResultRow key={ex.label} label={ex.label} value={ex.value.toFixed(6)} />)}
          </>
        ) : (
          <EmptyState text="Ingresa los valores para calcular" />
        )}
      </div>
    </div>
  );
};

const TrigSection: React.FC = () => {
  const [angleStr, setAngleStr] = useState("");
  const angle = parseFloat(angleStr);
  const isValid = isFinite(angle) && angleStr !== "";
  const trig: TrigFunctions | null = isValid ? calcTrigFunctions(angle) : null;
  const fmtV = (v: number) => (!isFinite(v) ? "∞" : v.toFixed(8));
  const special = [0, 15, 30, 45, 60, 75, 90, 120, 135, 150, 180, 270, 360];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex flex-col gap-4">
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
          <SectionTitle>Ángulo de entrada</SectionTitle>
          <UnitCircleDiagram angleDeg={isValid ? angle : null} />
          <NumInput label="Ángulo" symbol="α°" value={angleStr} onChange={setAngleStr} placeholder="45" />
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">// Ángulos notables</p>
            <div className="flex flex-wrap gap-1.5">
              {special.map((a) => (
                <button key={a} type="button" onClick={() => setAngleStr(String(a))}
                  className={`text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg border transition-all duration-200 ${parseFloat(angleStr) === a ? "bg-[#f59e0b] border-transparent text-[#080c14]" : BTN_GHOST}`}>
                  {a}°
                </button>
              ))}
            </div>
          </div>
          {trig && (
            <div className="border-t border-white/10 pt-3 flex flex-col gap-1">
              <p className="text-xs text-slate-500">Radianes: <span className="text-[#60a5fa] font-mono font-bold">{trig.angleRad.toFixed(8)}</span></p>
              <p className="text-xs text-slate-500">Gradianes: <span className="text-[#60a5fa] font-mono font-bold">{(angle / 0.9).toFixed(4)}</span></p>
            </div>
          )}
        </div>
      </div>
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-3">
        <SectionTitle>Funciones para {trig ? trig.angleDeg + "°" : "---"}</SectionTitle>
        {trig ? (
          <>
            <ResultRow label="sin" value={fmtV(trig.sin)} accent />
            <ResultRow label="cos" value={fmtV(trig.cos)} accent />
            <ResultRow label="tan" value={fmtV(trig.tan)} accent />
            <div className="border-t border-white/10 pt-3 mt-1 flex flex-col gap-2">
              <ResultRow label="cot" value={fmtV(trig.cot)} />
              <ResultRow label="sec" value={fmtV(trig.sec)} />
              <ResultRow label="csc" value={fmtV(trig.csc)} />
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">sin² + cos² = <span className="text-[#60a5fa] font-bold">{(trig.sin**2 + trig.cos**2).toFixed(8)}</span></p>
          </>
        ) : <EmptyState text="Ingresa un ángulo" />}
      </div>
      <div className="glass-card rounded-2xl p-6 col-span-1 lg:col-span-2">
        <SectionTitle>Tabla de Ángulos Notables</SectionTitle>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left pb-2 text-slate-400 font-mono font-bold uppercase tracking-wider">Ángulo</th>
                <th className="text-right pb-2 text-[#60a5fa] font-mono font-bold">sin</th>
                <th className="text-right pb-2 text-[#22c55e] font-mono font-bold">cos</th>
                <th className="text-right pb-2 text-[#f59e0b] font-mono font-bold">tan</th>
                <th className="text-right pb-2 text-slate-400 font-mono font-bold">cot</th>
              </tr>
            </thead>
            <tbody>
              {[0, 15, 30, 45, 60, 75, 90].map((a) => {
                const t = calcTrigFunctions(a);
                return (
                  <tr key={a} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setAngleStr(String(a))}>
                    <td className="py-2 text-slate-200 font-mono font-bold">{a}°</td>
                    <td className="py-2 text-right font-mono text-[#60a5fa]">{isFinite(t.sin) ? t.sin.toFixed(6) : "∞"}</td>
                    <td className="py-2 text-right font-mono text-[#22c55e]">{isFinite(t.cos) ? t.cos.toFixed(6) : "∞"}</td>
                    <td className="py-2 text-right font-mono text-[#f59e0b]">{isFinite(t.tan) ? t.tan.toFixed(6) : "∞"}</td>
                    <td className="py-2 text-right font-mono text-slate-300">{isFinite(t.cot) ? t.cot.toFixed(6) : "∞"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const QuadraticSection: React.FC = () => {
  const [a, setA] = useState(""); const [b, setB] = useState(""); const [c, setC] = useState("");
  const na = parseFloat(a); const nb = parseFloat(b); const nc = parseFloat(c);
  const hasInput = isFinite(na) && isFinite(nb) && isFinite(nc) && a !== "" && b !== "" && c !== "";
  const result: QuadraticResult | null = hasInput ? solveQuadratic(na, nb, nc) : null;
  const typeLabel = result ? result.type === "two_real" ? "2 raíces reales distintas" : result.type === "one_real" ? "1 raíz real doble" : "Raíces complejas (sin solución real)" : "";
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
        <div>
          <SectionTitle>Ecuación Cuadrática</SectionTitle>
          <p className="text-xs text-[#60a5fa] font-mono mt-2 bg-[#0d1420] border border-white/10 rounded-lg px-3 py-2 inline-block">a·x² + b·x + c = 0</p>
        </div>
        <ParabolaDiagram
          a={na} b={nb} c={nc}
          x1={result?.x1 ?? null}
          x2={result?.x2 ?? null}
          hasInput={hasInput}
        />
        <NumInput label="Coeficiente a" symbol="a" value={a} onChange={setA} placeholder="1" />
        <NumInput label="Coeficiente b" symbol="b" value={b} onChange={setB} placeholder="0" />
        <NumInput label="Término c" symbol="c" value={c} onChange={setC} placeholder="0" />
        {result && <div className="text-xs text-slate-400 font-mono bg-[#0d1420] border border-white/10 rounded-lg px-3 py-2">Δ = b² − 4ac = <span className="text-[#f59e0b] font-bold">{result.discriminant}</span></div>}
      </div>
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-3">
        <SectionTitle>Solución</SectionTitle>
        {result ? (
          <>
            <div className={`text-xs font-mono font-bold px-3 py-2 rounded-lg border ${result.type === "two_real" ? "bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]" : result.type === "one_real" ? "bg-[#f59e0b]/10 border-[#f59e0b]/30 text-[#f59e0b]" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>{typeLabel}</div>
            {result.type !== "complex" && result.x1 !== null && (
              <>
                <ResultRow label="x₁" value={result.x1.toFixed(8)} accent />
                {result.x2 !== null && result.x2 !== result.x1 && <ResultRow label="x₂" value={result.x2.toFixed(8)} accent />}
              </>
            )}
            {result.type === "complex" && (
              <div className="text-xs text-slate-400 bg-[#0d1420] border border-white/10 rounded-lg px-3 py-3 font-mono">
                <p>Raíces complejas conjugadas:</p>
                {a !== "" && b !== "" && c !== "" && (
                  <>
                    <p className="text-[#60a5fa] font-bold mt-1">Parte real: {(-parseFloat(b) / (2 * parseFloat(a))).toFixed(4)}</p>
                    <p className="text-[#f59e0b] font-bold">Parte imag: ± {(Math.sqrt(-result.discriminant) / (2 * parseFloat(a))).toFixed(4)}i</p>
                  </>
                )}
              </div>
            )}
          </>
        ) : <EmptyState text="Ingresa los coeficientes a, b, c" />}
      </div>
    </div>
  );
};

const AnglesSection: React.FC = () => {
  const [val, setVal] = useState(""); const [from, setFrom] = useState<"degrees" | "radians" | "gradians">("degrees");
  const n = parseFloat(val);
  const result = isFinite(n) && val !== "" ? convertAngle(n, from) : null;
  const fromOpts = [{ id: "degrees" as const, label: "Grados (°)" }, { id: "radians" as const, label: "Radianes (rad)" }, { id: "gradians" as const, label: "Gradianes (gon)" }];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
        <SectionTitle>Conversión Angular</SectionTitle>
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">// Sistema de entrada</p>
          <div className="grid grid-cols-3 gap-2">
            {fromOpts.map((opt) => (
              <button key={opt.id} type="button" onClick={() => { setFrom(opt.id); setVal(""); }}
                className={`text-xs py-2.5 px-2 rounded-lg border transition-all duration-200 font-semibold ${from === opt.id ? BTN_ACTIVE : BTN_GHOST}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <NumInput label={"Valor en " + fromOpts.find((f) => f.id === from)!.label} value={val} onChange={setVal} placeholder={from === "degrees" ? "45" : from === "radians" ? "0.7854" : "50"} />
      </div>
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-3">
        <SectionTitle>Equivalencias</SectionTitle>
        <AngleWheelDiagram degrees={result ? result.degrees : null} />
        {result ? (
          <>
            <ResultRow label="Grados decimales" value={result.degrees.toFixed(6) + "°"} accent />
            <ResultRow label="Grados Min Seg" value={result.dms} accent />
            <ResultRow label="Radianes (rad)" value={result.radians.toFixed(8)} />
            <ResultRow label="Gradianes (gon)" value={result.gradians.toFixed(6)} />
          </>
        ) : <EmptyState text="Ingresa un ángulo para convertir" />}
      </div>
    </div>
  );
};

export const GeoCalc: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("triangle-right");
  return (
    <div className="bg-[#080c14] min-h-screen pt-24 pb-16">
      <SEOHead
        title="Calculadora de Geometría y Trigonometría | Andrés Gallo P. BIM Developer"
        description="Resuelve triángulos rectángulos y oblicuángulos, calcula áreas de figuras geométricas, funciones trigonométricas y ecuaciones cuadráticas. Basado en el Prontuario de Máquinas Larburu."
        keywords="calculadora geometria, trigonometria, triangulo rectangulo, ley senos, ley cosenos, areas figuras, funcion trigonometrica, ecuacion cuadratica"
        path="/herramientas/geometria"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navegación Superior */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            to="/herramientas"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-white/[0.07] hover:bg-white/10 border border-white/15 px-4 py-2 rounded-lg transition-all duration-300 group"
          >
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform" />
            Volver a Herramientas
          </Link>
          <Link
            to="/herramientas/convertidor"
            className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider border px-3.5 py-2 rounded-lg transition-all duration-200 ${BTN_GHOST}`}
          >
            <i className="fa-solid fa-arrow-right-arrow-left" />
            Convertidor de Unidades
          </Link>
        </div>

        {/* Encabezado Principal */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#60a5fa] text-xs font-mono font-bold mb-4 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
            // Geometría & Trigonometría
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-head tracking-tight mb-4">
            Calculadora <span className="text-[#60a5fa]">Geométrica</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Triángulos rectángulos y oblicuángulos, áreas de figuras, funciones trigonométricas y ecuaciones. Basado en el Prontuario de Máquinas (N. Larburu, 13ª Ed.)
          </p>

          {/* Selector de Módulos */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex flex-wrap justify-center p-1.5 rounded-xl bg-[#0d1420] border border-white/10 gap-1" role="tablist" aria-label="Módulos calculadora">
              {TAB_CONFIG.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 border ${
                    activeTab === tab.id ? BTN_ACTIVE : "border-transparent text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <i className={tab.icon} aria-hidden />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Módulo Activo */}
        <section aria-live="polite">
          {activeTab === "triangle-right" && <RightTriangleSection />}
          {activeTab === "triangle-oblique" && <ObliqueTriangleSection />}
          {activeTab === "areas" && <AreasSection />}
          {activeTab === "trig" && <TrigSection />}
          {activeTab === "quadratic" && <QuadraticSection />}
          {activeTab === "angles" && <AnglesSection />}
        </section>

        <footer className="mt-10 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-slate-500 font-mono">
            Fórmulas basadas en: Prontuario de Máquinas — Nicolás Larburu Arrizabalaga, 13ª Ed. (Paraninfo Thomson Learning). Sección I.
          </p>
        </footer>
      </div>
    </div>
  );
};
