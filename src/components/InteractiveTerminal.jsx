import { useState, useRef, useEffect } from "react";
import { useTranslation } from "../context/LanguageContext";

// Comandos disponibles y sus respuestas estructuradas (Bilingüe)
const getCommands = (isEn) => ({
  help: {
    description: isEn ? "Shows the list of available commands" : "Muestra la lista de comandos disponibles",
    output: [
      { type: "info", text: isEn ? "⚡ AVAILABLE COMMANDS IN ATELIJUDESIGN CLI:" : "⚡ COMANDOS DISPONIBLES EN ATELIJUDESIGN CLI:" },
      { type: "cmd", text: isEn ? "  projects --featured   -> View flagship projects (Mining, Healthcare, BIM)" : "  projects --featured   -> Ver proyectos destacados (Minería, Hospitales, BIM)" },
      { type: "cmd", text: isEn ? "  calc --profile <nom>  -> Compute structural section properties (e.g. H300x300x94)" : "  calc --profile <nom>  -> Calcular propiedades estructurales (ej: H300x300x94)" },
      { type: "cmd", text: isEn ? "  stack                 -> List software & engineering technologies" : "  stack                 -> Listar tecnologías de software e ingeniería" },
      { type: "cmd", text: isEn ? "  experience            -> View professional career background (15+ years)" : "  experience            -> Ver trayectoria profesional (15+ años)" },
      { type: "cmd", text: isEn ? "  contact               -> Get direct contact channels" : "  contact               -> Obtener canales de contacto directo" },
      { type: "cmd", text: isEn ? "  clear                 -> Clear terminal screen" : "  clear                 -> Limpiar la pantalla de la terminal" },
    ],
  },
  "projects --featured": {
    description: isEn ? "Lists high-complexity projects" : "Lista proyectos de alta complejidad",
    output: [
      { type: "success", text: isEn ? "✓ [2024] Mining Grinding Facility — 4,500 tons structured steel in Revit + Tekla" : "✓ [2024] Nave de Molienda Minera — 4.500 ton acero estructurado en Revit + Tekla" },
      { type: "success", text: isEn ? "✓ [2023] International Airport — Multidisciplinary BIM coordination & OpenBIM IFC" : "✓ [2023] Aeropuerto Internacional — Coordinación BIM multidisciplinaria e IFC" },
      { type: "success", text: isEn ? "✓ [2022] Hospital Building — 65,000 m² automated slabs and rebar detailing" : "✓ [2022] Edificio Hospitalario — 65.000 m² de losas y armaduras automatizadas" },
      { type: "info", text: isEn ? "→ Type 'projects' or navigate to Portfolio to view full details." : "→ Escribe 'projects' o ve a la sección de Portafolio para ver detalles completos." },
    ],
  },
  "calc --profile h300x300x94": {
    description: isEn ? "Instant ICHA steel profile calculation" : "Cálculo instantáneo de perfil ICHA",
    output: [
      { type: "calc", text: isEn ? "⚙ PROCESSING ICHA STEEL PROFILE: H300x300x94.2" : "⚙ PROCESANDO PERFIL ICHA: H300x300x94.2" },
      { type: "data", text: isEn ? "  • Linear Weight: 94.20 kg/m" : "  • Peso Lineal: 94.20 kg/m" },
      { type: "data", text: isEn ? "  • Cross-section Area (A): 120.00 cm²" : "  • Área de Sección (A): 120.00 cm²" },
      { type: "data", text: isEn ? "  • Strong Axis Inertia (Ix): 20,400 cm⁴ | Weak Axis (Iy): 6,750 cm⁴" : "  • Inercia Fuerte (Ix): 20.400 cm⁴ | Inercia Débil (Iy): 6.750 cm⁴" },
      { type: "data", text: isEn ? "  • Elastic Section Modulus (Wx): 1,360 cm³" : "  • Módulo Resistente (Wx): 1.360 cm³" },
      { type: "success", text: isEn ? "✓ Status: COMPLIES WITH AISC 360-16 / NCh427 (D/C Ratio: 0.72)" : "✓ Estado: CUMPLE NORMA AISC 360-16 / NCh427 (D/C Ratio: 0.72)" },
    ],
  },
  stack: {
    description: isEn ? "Shows software and engineering stack" : "Muestra el stack de desarrollo e ingeniería",
    output: [
      { type: "info", text: isEn ? "🛠 PROFESSIONAL TECHNICAL STACK:" : "🛠 STACK TÉCNICO PROFESIONAL:" },
      { type: "data", text: "  • BIM & CAD:     Autodesk Revit, Tekla, AutoCAD, Dynamo, Advance Steel" },
      { type: "data", text: "  • Code & Dev:    Python (pyRevit), C# (.NET SDK), TypeScript, React, Three.js" },
      { type: "data", text: "  • OpenBIM:       IfcOpenShell, web-ifc, Schemas IFC4 / IFC2x3" },
      { type: "data", text: "  • Data & Web:    PostgreSQL, Supabase, Tailwind CSS, Vite" },
    ],
  },
  experience: {
    description: isEn ? "Professional trajectory summary" : "Resumen de trayectoria profesional",
    output: [
      { type: "info", text: isEn ? "🏛 ANDRÉS GALLO P. BACKGROUND" : "🏛 TRAYECTORIA DE ANDRÉS GALLO P." },
      { type: "data", text: isEn ? "  • 15+ Years as Senior Structural BIM Designer & Developer" : "  • 15+ Años como Proyectista Estructural Senior & BIM Developer" },
      { type: "data", text: isEn ? "  • Specialization: Heavy industrial mining, healthcare complexes & civil infrastructure" : "  • Especialidad: Minería de gran escala, naves industriales y edificación hospitalaria" },
      { type: "success", text: isEn ? "  • Key Edge: Creation of native Add-ins and scripts that reduce hours into seconds" : "  • Diferencial: Creación de Add-ins nativos y scripts que reducen horas a segundos" },
    ],
  },
  contact: {
    description: isEn ? "Direct contact information" : "Información de contacto directo",
    output: [
      { type: "info", text: isEn ? "📫 DIRECT CONTACT CHANNELS:" : "📫 CANALES DE CONTACTO:" },
      { type: "data", text: "  • Email:    contacto@atelijudesign.com" },
      { type: "data", text: "  • LinkedIn: linkedin.com/in/andres-gallo-parra" },
      { type: "data", text: "  • GitHub:   github.com/atelijudesign" },
      { type: "success", text: isEn ? "  • Status:   AVAILABLE FOR BIM PROJECTS & CUSTOM SOFTWARE" : "  • Estado:   DISPONIBLE PARA PROYECTOS BIM & SOFTWARE" },
    ],
  },
});

export const InteractiveTerminal = () => {
  const { language } = useTranslation();
  const isEn = language === "en";
  const commands = getCommands(isEn);

  const [history, setHistory] = useState([
    { type: "info", text: "Atelijudesign BIM & Structural OS [Version 2026.4.1]" },
    { type: "info", text: isEn ? "Type 'help' or click quick commands to interact." : "Escribe 'help' o haz clic en los comandos rápidos para interactuar." },
    { type: "success", text: isEn ? "pyRevit & Revit API Environment initialized successfully (0.08s)." : "pyRevit & Revit API Environment inicializado con éxito (0.08s)." },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll interno exclusivo de la terminal (sin desplazar la ventana del navegador)
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmdText) => {
    const trimmed = cmdText.trim().toLowerCase();
    if (!trimmed) return;

    // Agregar al historial de comandos escritos
    setCommandHistory((prev) => [...prev, cmdText]);
    setHistoryIndex(-1);

    // Entrada del usuario en la pantalla
    const newEntry = { type: "prompt", text: `andres@atelijudesign:~$ ${cmdText}` };

    if (trimmed === "clear" || trimmed === "cls") {
      setHistory([
        { type: "info", text: "Atelijudesign BIM & Structural OS [Version 2026.4.1]" },
        { type: "info", text: isEn ? "Screen cleared. Type 'help' to see available commands." : "Pantalla limpiada. Escribe 'help' para ver opciones." },
      ]);
      setInputVal("");
      return;
    }

    // Buscar coincidencia en comandos
    let matchedCommand = commands[trimmed];

    // Soporte para variaciones de calc --profile
    if (!matchedCommand && trimmed.startsWith("calc")) {
      matchedCommand = {
        output: [
          { type: "calc", text: isEn ? `⚙ ANALYZING SECTION: ${cmdText.replace("calc", "").trim().toUpperCase()}` : `⚙ ANALIZANDO PARÁMETROS: ${cmdText.replace("calc", "").trim().toUpperCase()}` },
          { type: "data", text: isEn ? "  • Profile detected in AISC v15 / ICHA 2026 database" : "  • Perfil detectado en catálogo AISC v15 / ICHA 2026" },
          { type: "data", text: isEn ? "  • Modulus of Elasticity (E): 29,000 ksi / 2,100,000 kg/cm² (A36/A572 Gr.50)" : "  • Módulo de Elasticidad (E): 2.100.000 kg/cm² (Acero A36/A572 Gr.50)" },
          { type: "success", text: isEn ? "✓ Slenderness Check (λ = kL/r ≤ 200): Optimal compliance." : "✓ Verificación de Esbeltez (λ = kL/r ≤ 200): Cumple óptimamente." },
        ],
      };
    }

    if (matchedCommand) {
      setHistory((prev) => [...prev, newEntry, ...matchedCommand.output]);
    } else {
      setHistory((prev) => [
        ...prev,
        newEntry,
        {
          type: "error",
          text: isEn ? `Unrecognized command: '${cmdText}'. Type 'help' to see valid commands.` : `Comando no reconocido: '${cmdText}'. Escribe 'help' para ver los comandos válidos.`,
        },
      ]);
    }

    setInputVal("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(inputVal);
      return;
    }

    // Navegación de historial con flechas Arriba / Abajo
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex] || "");
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex] || "");
      }
    }
  };

  const quickChips = [
    { label: "help", cmd: "help" },
    { label: "projects --featured", cmd: "projects --featured" },
    { label: "calc H300x94", cmd: "calc --profile H300x300x94" },
    { label: "stack", cmd: "stack" },
    { label: "experience", cmd: "experience" },
    { label: "contact", cmd: "contact" },
  ];

  return (
    <div
      className="w-full rounded-3xl bg-slate-950/95 border border-slate-800/90 hover:border-slate-700 shadow-2xl overflow-hidden flex flex-col font-mono text-xs cursor-text transition-colors"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      {/* Barra Superior / Header de Terminal */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors cursor-pointer" />
          <span className="text-[11px] text-slate-400 font-bold ml-2 flex items-center gap-1.5">
            <i className="fa-solid fa-terminal text-cyan-400" /> andres@atelijudesign-bim:~ (bash)
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE
          </span>
          <span className="hidden sm:inline text-slate-500">UTF-8</span>
        </div>
      </div>

      {/* Quick Action Chips */}
      <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-slate-500 uppercase font-bold shrink-0 mr-1">{isEn ? "Commands:" : "Comandos:"}</span>
        {quickChips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-500/40 border border-slate-800 text-[10px] text-slate-300 transition-all shrink-0 btn-tactile"
            onClick={(e) => {
              e.stopPropagation();
              executeCommand(chip.cmd);
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Ventana de Salida de Terminal */}
      <div
        ref={terminalBodyRef}
        className="p-4 sm:p-5 h-[280px] sm:h-[320px] overflow-y-auto space-y-1.5 leading-relaxed text-slate-300"
      >
        {history.map((item, idx) => {
          if (item.type === "prompt") {
            return (
              <div key={idx} className="text-cyan-300 font-bold flex items-center gap-1.5 mt-2">
                <span className="text-emerald-400">➜</span>
                <span>{item.text}</span>
              </div>
            );
          }
          if (item.type === "success") {
            return (
              <div key={idx} className="text-emerald-400 font-medium">
                {item.text}
              </div>
            );
          }
          if (item.type === "error") {
            return (
              <div key={idx} className="text-rose-400 font-medium">
                {item.text}
              </div>
            );
          }
          if (item.type === "calc") {
            return (
              <div key={idx} className="text-amber-400 font-bold">
                {item.text}
              </div>
            );
          }
          if (item.type === "cmd") {
            return (
              <div key={idx} className="text-cyan-400 hover:text-cyan-300 cursor-pointer" onClick={() => executeCommand(item.text.trim().split("->")[0].trim())}>
                {item.text}
              </div>
            );
          }
          return (
            <div key={idx} className="text-slate-400">
              {item.text}
            </div>
          );
        })}

        {/* Línea Activa de Entrada */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 font-bold">➜</span>
          <span className="text-cyan-400 font-bold">andres@atelijudesign:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-w-0 flex-1 bg-transparent text-white outline-none border-none p-0 m-0 font-mono text-xs caret-cyan-400"
            autoComplete="off"
            spellCheck="false"
            placeholder={isEn ? "Type a command..." : "Escribe un comando..."}
          />
        </div>
      </div>

      {/* Footer de la Terminal */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
        <span>{isEn ? "Use ↑ ↓ to browse history · Enter to execute" : "Usa ↑ ↓ para navegar historial · Enter para ejecutar"}</span>
        <span className="text-cyan-400 font-bold">PyRevit / C# Live Node</span>
      </div>
    </div>
  );
};
