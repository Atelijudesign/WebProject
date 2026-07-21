import React, { useState } from "react";

/**
 * High-end CodeBlock Component with VS Code / One Dark Pro aesthetics,
 * macOS window controls, line numbers, copy button, and syntax highlighting.
 */
export default function CodeBlock({ code, language = "python", filename = "script.py" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Helper to parse and colorize a single line of code
  const renderLineContent = (line) => {
    if (!line && line !== "") return null;

    // Check for comment
    const commentIndex = line.indexOf("#");
    if (commentIndex === 0) {
      return <span className="text-slate-500 italic font-mono">{line}</span>;
    }

    let codePart = line;
    let commentPart = "";
    if (commentIndex > 0) {
      codePart = line.slice(0, commentIndex);
      commentPart = line.slice(commentIndex);
    }

    // Tokenize codePart
    const tokens = tokenizePython(codePart);

    return (
      <>
        {tokens}
        {commentPart && <span className="text-slate-500 italic font-mono">{commentPart}</span>}
      </>
    );
  };

  const tokenizePython = (str) => {
    // Regex matching strings, keywords, numbers, decorators, functions
    const regex = /(".*?"|'.*?'|\b(?:import|from|def|return|for|in|if|elif|else|try|except|as|and|or|not|is|None|True|False|pass|break|continue|lambda|class)\b|\b\d+(?:\.\d+)?\b|\b[A-Z_][A-Z0-9_]+\b|\b[a-zA-Z_]\w*(?=\()|[a-zA-Z_]\w*|[^\s\w]+|\s+)/g;

    const matches = str.match(regex) || [str];

    const keywords = new Set([
      "import", "from", "def", "return", "for", "in", "if", "elif", "else",
      "try", "except", "as", "and", "or", "not", "is", "None", "True", "False",
      "pass", "break", "continue", "lambda", "class"
    ]);

    const builtins = new Set([
      "clr", "AddReference", "FilteredElementCollector", "BuiltInCategory",
      "BuiltInParameter", "UnitUtils", "UnitTypeId", "revit", "DB", "forms",
      "script", "doc", "Title", "print_md", "print_table", "get_output", "close_others",
      "set_title", "ConvertFromInternalUnits", "get_Parameter", "AsDouble",
      "HasValue", "AsElementId", "GetElement", "OfCategory", "WhereElementIsNotElementType"
    ]);

    return matches.map((token, idx) => {
      // String literal
      if (
        (token.startsWith('"') && token.endsWith('"')) ||
        (token.startsWith("'") && token.endsWith("'"))
      ) {
        return (
          <span key={idx} className="text-emerald-300">
            {token}
          </span>
        );
      }

      // Keyword
      if (keywords.has(token)) {
        return (
          <span key={idx} className="text-purple-400 font-semibold">
            {token}
          </span>
        );
      }

      // Built-in / API class
      if (builtins.has(token)) {
        return (
          <span key={idx} className="text-cyan-300 font-medium">
            {token}
          </span>
        );
      }

      // Uppercase Constant (DENSIDAD_ACERO, FACTOR_CONEXIONES)
      if (/^[A-Z_][A-Z0-9_]+$/.test(token)) {
        return (
          <span key={idx} className="text-rose-400 font-medium">
            {token}
          </span>
        );
      }

      // Number
      if (/^\d+(?:\.\d+)?$/.test(token)) {
        return (
          <span key={idx} className="text-amber-400 font-medium">
            {token}
          </span>
        );
      }

      // Function invocation
      if (/^[a-zA-Z_]\w*$/.test(token) && str.indexOf(`${token}(`) !== -1) {
        return (
          <span key={idx} className="text-blue-300 font-medium">
            {token}
          </span>
        );
      }

      // Default text / symbols
      return <span key={idx}>{token}</span>;
    });
  };

  const lines = code.trim().split("\n");

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-[#090d16] shadow-2xl transition-all hover:border-slate-700/80">
      {/* IDE Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d1322] border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          {/* macOS window controls */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/40" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/40" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/40" />
          </div>

          {/* File Tab Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#131b2e] border border-slate-700/50 text-xs font-mono text-slate-300">
            <i className="fa-brands fa-python text-emerald-400 text-sm" />
            <span className="font-medium text-slate-200">{filename}</span>
            <span className="text-[10px] text-slate-500 font-sans tracking-wide uppercase px-1.5 py-0.5 rounded bg-slate-800">
              {language}
            </span>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-mono transition-all active:scale-95 shadow-sm"
          title="Copiar código"
        >
          {copied ? (
            <>
              <i className="fa-solid fa-check text-emerald-400" />
              <span className="text-emerald-400 font-semibold">¡Copiado!</span>
            </>
          ) : (
            <>
              <i className="fa-regular fa-copy text-slate-400" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Code Container with Line Numbers */}
      <div className="p-4 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-slate-200 selection:bg-blue-600/40 selection:text-white">
        <div className="table w-full border-collapse">
          {lines.map((line, index) => (
            <div key={index} className="table-row group/line hover:bg-slate-800/40 transition-colors">
              {/* Line Number */}
              <div className="table-cell select-none text-right text-slate-600 group-hover/line:text-slate-400 pr-4 pl-1 font-mono text-xs w-10 border-r border-slate-800/80 align-top py-0.5">
                {index + 1}
              </div>
              {/* Line Code */}
              <div className="table-cell pl-4 pr-2 whitespace-pre align-top py-0.5 font-mono">
                {renderLineContent(line)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
