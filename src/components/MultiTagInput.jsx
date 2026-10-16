import { useState, useMemo } from "react";

const THEME_CLASSES = {
  blue: {
    chip: "bg-sky-500/15 text-sky-300 border-sky-500/30 hover:border-sky-400/50",
    chipRemove: "hover:bg-sky-500/30 text-sky-400 hover:text-white",
    presetActive: "bg-sky-500/25 text-sky-200 border-sky-400/60 shadow-sm shadow-sky-500/20",
    presetInactive: "bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:border-slate-600",
    focusBorder: "focus-within:border-sky-400/60 focus-within:ring-2 focus-within:ring-sky-500/15"
  },
  emerald: {
    chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:border-emerald-400/50",
    chipRemove: "hover:bg-emerald-500/30 text-emerald-400 hover:text-white",
    presetActive: "bg-emerald-500/25 text-emerald-200 border-emerald-400/60 shadow-sm shadow-emerald-500/20",
    presetInactive: "bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:border-slate-600",
    focusBorder: "focus-within:border-emerald-400/60 focus-within:ring-2 focus-within:ring-emerald-500/15"
  },
  purple: {
    chip: "bg-purple-500/15 text-purple-300 border-purple-500/30 hover:border-purple-400/50",
    chipRemove: "hover:bg-purple-500/30 text-purple-400 hover:text-white",
    presetActive: "bg-purple-500/25 text-purple-200 border-purple-400/60 shadow-sm shadow-purple-500/20",
    presetInactive: "bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:border-slate-600",
    focusBorder: "focus-within:border-purple-400/60 focus-within:ring-2 focus-within:ring-purple-500/15"
  },
  amber: {
    chip: "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:border-amber-400/50",
    chipRemove: "hover:bg-amber-500/30 text-amber-400 hover:text-white",
    presetActive: "bg-amber-500/25 text-amber-200 border-amber-400/60 shadow-sm shadow-amber-500/20",
    presetInactive: "bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:border-slate-600",
    focusBorder: "focus-within:border-amber-400/60 focus-within:ring-2 focus-within:ring-amber-500/15"
  }
};

export const MultiTagInput = ({
  label,
  value = "",
  onChange,
  presets = [],
  placeholder = "+ escribir y presionar Enter...",
  colorTheme = "blue",
  required = false
}) => {
  const [inputValue, setInputValue] = useState("");
  const theme = THEME_CLASSES[colorTheme] || THEME_CLASSES.blue;

  const tags = useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(v => String(v).trim()).filter(Boolean);
    return String(value)
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
  }, [value]);

  const handleAddTag = (newTag) => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    
    const hasAlready = tags.some(t => t.toLowerCase() === trimmed.toLowerCase());
    if (hasAlready) {
      setInputValue("");
      return;
    }

    const nextTags = [...tags, trimmed];
    onChange(nextTags.join(", "));
    setInputValue("");
  };

  const handleRemoveTag = (tagToRemove) => {
    const nextTags = tags.filter(t => t.toLowerCase() !== tagToRemove.toLowerCase());
    onChange(nextTags.join(", "));
  };

  const handleTogglePreset = (preset) => {
    const isSelected = tags.some(t => t.toLowerCase() === preset.toLowerCase());
    if (isSelected) {
      handleRemoveTag(preset);
      return;
    }
    handleAddTag(preset);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(inputValue);
      return;
    }
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      handleRemoveTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="form-group mb-4">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="form-label !mb-0 text-slate-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <span>{label}</span>
            {required && <span className="text-red-400">*</span>}
          </label>
          <span className="text-[10px] text-slate-500 font-mono">
            {tags.length} seleccionado{tags.length === 1 ? "" : "s"}
          </span>
        </div>
      )}

      {/* Main Tag Container Box */}
      <div className={`w-full min-h-[44px] p-2 bg-slate-900/90 border border-slate-700/80 rounded-xl transition-all duration-200 flex flex-wrap items-center gap-1.5 ${theme.focusBorder}`}>
        {tags.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-xs font-medium border backdrop-blur-md transition-all ${theme.chip}`}
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className={`w-4 h-4 rounded-md inline-flex items-center justify-center text-xs transition-colors ${theme.chipRemove}`}
              title={`Remover ${tag}`}
            >
              &times;
            </button>
          </span>
        ))}

        <input
          type="text"
          className="flex-1 min-w-[130px] bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none py-1 px-1.5"
          placeholder={tags.length === 0 ? placeholder : "+ agregar otro..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) handleAddTag(inputValue);
          }}
        />
      </div>

      {/* Preset Pill Buttons Row */}
      {presets.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mr-1">
            Sugerencias:
          </span>
          {presets.map((preset) => {
            const isSelected = tags.some((t) => t.toLowerCase() === preset.toLowerCase());
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handleTogglePreset(preset)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all duration-150 flex items-center gap-1 ${
                  isSelected ? theme.presetActive : theme.presetInactive
                }`}
              >
                <span>{isSelected ? "✓" : "+"}</span>
                <span>{preset}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
