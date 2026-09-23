import { useMemo, useRef } from "react";

export const IFC_RIBBON_TABS = [
  { id: "file", label: "Archivo", icon: "fa-file" },
  { id: "view", label: "Vista", icon: "fa-eye" },
  { id: "analyze", label: "Analizar", icon: "fa-ruler-combined" },
  { id: "section", label: "Sección", icon: "fa-cube" },
  { id: "elements", label: "Elementos", icon: "fa-shapes" },
  { id: "review", label: "Revisión", icon: "fa-clipboard-check" },
  { id: "performance", label: "Rendimiento", icon: "fa-gauge-high" },
];

export const DEFAULT_GROUPS = {
  file: [
    {
      label: "Modelo",
      commands: [
        { id: "open", label: "Abrir IFC", icon: "fa-folder-open", title: "Cargar archivo IFC local" },
        { id: "demo", label: "Ejemplo", icon: "fa-building", title: "Cargar modelo nave industrial de prueba" },
        { id: "clear-model", label: "Cerrar", icon: "fa-rectangle-xmark", title: "Cerrar modelo y liberar memoria GPU" },
      ],
    },
    {
      label: "Intercambio",
      commands: [
        { id: "export", label: "Exportar", icon: "fa-file-export", title: "Exportar datos a CSV o JSON" },
        { id: "cache", label: "Caché", icon: "fa-bolt", title: "Administrar almacenamiento local acelerado" },
      ],
    },
    {
      label: "Seguridad",
      commands: [
        { id: "privacy", label: "Privacidad", icon: "fa-shield-halved", title: "Privacidad 100% local y limitaciones técnicas" },
      ],
    },
  ],
  view: [
    {
      label: "Orientación",
      commands: [
        { id: "iso", label: "Isométrica", icon: "fa-cube", title: "Vista isométrica 3D" },
        { id: "top", label: "Planta", icon: "fa-arrow-down", title: "Vista superior (Planta)" },
        { id: "front", label: "Frontal", icon: "fa-border-all", title: "Vista frontal" },
        { id: "right", label: "Lateral", icon: "fa-border-right", title: "Vista lateral derecha" },
      ],
    },
    {
      label: "Navegación",
      commands: [
        { id: "fit", label: "Ajustar", icon: "fa-expand", title: "Ajustar modelo completo a la pantalla (F)" },
        { id: "reset-view", label: "Restablecer", icon: "fa-rotate-left", title: "Restablecer posición inicial de cámara" },
        { id: "walk", label: "Peatonal", icon: "fa-person-walking", title: "Modo recorrido peatonal (WASD)" },
        { id: "save-view", label: "Guardar", icon: "fa-bookmark", title: "Guardar punto de vista actual" },
        { id: "projection", label: "Proyección", icon: "fa-camera", title: "Alternar entre perspectiva y ortográfica" },
      ],
    },
    {
      label: "Entorno",
      commands: [
        { id: "toggle-grid", label: "Rejilla", icon: "fa-table-cells", title: "Mostrar u ocultar cuadrícula de referencia" },
        { id: "fullscreen", label: "Pantalla", icon: "fa-maximize", title: "Alternar modo pantalla completa" },
        { id: "shortcuts", label: "Atajos", icon: "fa-keyboard", title: "Ver atajos de teclado y controles (?)" },
      ],
    },
  ],
  analyze: [
    {
      label: "Medición",
      commands: [
        { id: "distance", label: "Distancia", icon: "fa-ruler", title: "Medir distancia lineal entre 2 puntos (M)" },
        { id: "area", label: "Área", icon: "fa-draw-polygon", title: "Medir área de polígono 3D (A)" },
        { id: "clear-measurements", label: "Limpiar", icon: "fa-trash-can", title: "Eliminar todas las mediciones" },
      ],
    },
    {
      label: "Datos BIM",
      commands: [
        { id: "quantities", label: "Cantidades", icon: "fa-chart-column", title: "Ver cubicación y resumen por categoría" },
        { id: "compare", label: "Comparar", icon: "fa-code-compare", title: "Comparar cantidades con modelo previo" },
      ],
    },
  ],
  section: [
    {
      label: "Planos de Corte",
      commands: [
        { id: "section-x", label: "Corte X", icon: "fa-arrows-left-right", title: "Activar plano de sección en eje X" },
        { id: "section-y", label: "Corte Y", icon: "fa-arrows-up-down", title: "Activar plano de sección vertical Y" },
        { id: "section-z", label: "Corte Z", icon: "fa-layer-group", title: "Activar plano de sección en eje Z" },
      ],
    },
    {
      label: "Control",
      commands: [
        { id: "section-box", label: "Caja 3D", icon: "fa-box", title: "Abrir panel de sección y corte 3D (C)" },
        { id: "reset-section", label: "Restablecer", icon: "fa-rotate-left", title: "Desactivar todos los planos de corte" },
      ],
    },
  ],
  elements: [
    {
      label: "Selección",
      commands: [
        { id: "select", label: "Seleccionar", icon: "fa-arrow-pointer", title: "Modo de selección de elementos (V / Esc)" },
        { id: "palette", label: "Paleta IFC", icon: "fa-table-list", title: "Abrir paleta e inventario de todos los elementos IFC" },
        { id: "search", label: "Buscar", icon: "fa-magnifying-glass", title: "Buscar elementos por nombre o ExpressID" },
        { id: "tree", label: "Árbol BIM", icon: "fa-folder-tree", title: "Ver categorías y jerarquía estructural" },
        { id: "properties", label: "Propiedades", icon: "fa-list", title: "Abrir/cerrar panel de propiedades y Psets" },
      ],
    },
    {
      label: "Visibilidad",
      commands: [
        { id: "isolate", label: "Aislar", icon: "fa-crosshairs", title: "Aislar elemento seleccionado" },
        { id: "hide", label: "Ocultar", icon: "fa-eye-slash", title: "Ocultar elemento seleccionado" },
        { id: "show-all", label: "Mostrar todo", icon: "fa-eye", title: "Mostrar todos los elementos del modelo" },
      ],
    },
  ],
  review: [
    {
      label: "Incidencias BCF",
      commands: [
        { id: "new-issue", label: "Nueva BCF", icon: "fa-circle-plus", title: "Crear nueva incidencia en el punto actual" },
        { id: "issues", label: "Listado", icon: "fa-list-check", title: "Ver lista de incidencias registradas" },
      ],
    },
    {
      label: "Compartir",
      commands: [
        { id: "capture", label: "Capturar", icon: "fa-camera-retro", title: "Capturar imagen de la vista actual" },
        { id: "bcf-export", label: "Exportar BCF", icon: "fa-share-from-square", title: "Exportar incidencias a archivo BCF-XML" },
      ],
    },
  ],
  performance: [
    {
      label: "Modos de Render",
      commands: [
        { id: "style-shaded", label: "Sombreado", icon: "fa-cube", title: "Modo sólido con sombreado estándar" },
        { id: "style-transparent", label: "Transparente", icon: "fa-ghost", title: "Modo semitransparente para ver armaduras y tuberías" },
        { id: "style-wireframe", label: "Alámbrico", icon: "fa-vector-square", title: "Alternar modo alámbrico (W)" },
      ],
    },
    {
      label: "Perfil Gráfico",
      commands: [
        { id: "economy", label: "Económico", icon: "fa-leaf", title: "Perfil económico para bajo consumo de GPU" },
        { id: "balanced", label: "Equilibrado", icon: "fa-scale-balanced", title: "Perfil equilibrado (estándar)" },
        { id: "quality", label: "Calidad", icon: "fa-gem", title: "Perfil de alta fidelidad visual" },
      ],
    },
    {
      label: "Diagnóstico",
      commands: [
        { id: "memory", label: "Memoria & FPS", icon: "fa-gauge-high", title: "Diagnóstico de FPS, memoria Heap y GPU" },
        { id: "clear-cache", label: "Limpiar Caché", icon: "fa-trash-can", title: "Liberar espacio de modelos en IndexedDB" },
        { id: "privacy", label: "Seguridad", icon: "fa-shield-halved", title: "Garantía de privacidad 100% local y límites del navegador" },
      ],
    },
  ],
};

export function RibbonCommand({ command, onCommand, disabled, isActive }) {
  return (
    <button
      type="button"
      onClick={() => onCommand?.(command.id)}
      disabled={disabled || command.disabled}
      className={`group relative flex h-[64px] w-[76px] sm:h-[68px] sm:w-[88px] shrink-0 flex-col items-center justify-center gap-1 rounded border px-1.5 sm:px-2 transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
        isActive
          ? "border-cyan-400 bg-cyan-950/70 text-cyan-300 shadow-md shadow-cyan-950/40"
          : "border-slate-600/50 bg-slate-700/30 text-slate-100 hover:border-cyan-500 hover:bg-slate-700"
      }`}
      title={command.title || command.label}
      aria-label={command.label}
      aria-pressed={isActive ? "true" : undefined}
    >
      <i
        className={`fa-solid ${command.icon} flex h-6 sm:h-7 items-center text-[18px] sm:text-[22px] transition-transform group-hover:scale-110 ${
          isActive ? "text-cyan-300" : "text-cyan-400 group-disabled:text-slate-500"
        }`}
      ></i>
      <span className="w-full truncate text-center text-[10px] font-medium leading-tight sm:text-[11px]">
        {command.label}
      </span>
      {isActive && (
        <span className="absolute bottom-0.5 h-1 w-4 rounded-full bg-cyan-400"></span>
      )}
    </button>
  );
}

export function RibbonGroup({ group, onCommand, disabled, activeCommands = {} }) {
  return (
    <div
      className="relative flex h-[90px] sm:h-[94px] shrink-0 flex-col border-r border-slate-600/70 px-1 last:border-r-0"
      aria-label={group.label}
      data-ribbon-group={group.label}
    >
      <div className="flex h-[68px] sm:h-[72px] items-start gap-1">
        {group.commands.map((command) => (
          <RibbonCommand
            key={command.id}
            command={command}
            onCommand={onCommand}
            disabled={disabled}
            isActive={Boolean(activeCommands[command.id] ?? command.isActive)}
          />
        ))}
      </div>
      <span className="mt-auto h-[18px] border-t border-slate-700/70 pt-0.5 text-center text-[9px] font-medium tracking-wide text-slate-400">
        {group.label}
      </span>
    </div>
  );
}

export function IfcRibbon({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapsed,
  onCommand,
  disabled = false,
  groups = DEFAULT_GROUPS,
  activeCommands = {},
}) {
  const activeGroups = useMemo(() => groups[activeTab] || [], [activeTab, groups]);
  const tabListRef = useRef(null);

  const handleTabChange = (tabId) => {
    onTabChange(tabId);
    if (collapsed) onToggleCollapsed();
  };

  const handleKeyDown = (e) => {
    const tabIds = IFC_RIBBON_TABS.map((t) => t.id);
    const currentIndex = tabIds.indexOf(activeTab);
    if (currentIndex === -1) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabIds.length;
      handleTabChange(tabIds[nextIndex]);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
      handleTabChange(tabIds[prevIndex]);
    } else if (e.key === "Home") {
      e.preventDefault();
      handleTabChange(tabIds[0]);
    } else if (e.key === "End") {
      e.preventDefault();
      handleTabChange(tabIds[tabIds.length - 1]);
    }
  };

  return (
    <nav
      className="shrink-0 border-b border-slate-950 bg-slate-800 shadow-lg shadow-black/30"
      aria-label="Herramientas del visor IFC"
    >
      <div
        ref={tabListRef}
        onKeyDown={handleKeyDown}
        className="flex h-9 items-end overflow-x-auto border-b border-slate-600 bg-slate-900 px-0 sm:pr-2 [scrollbar-width:thin]"
        role="tablist"
        aria-label="Pestañas de la cinta de herramientas"
      >
        {IFC_RIBBON_TABS.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`relative flex h-9 shrink-0 items-center gap-1.5 border-x border-t px-3 text-[11px] font-medium transition-colors sm:px-4 sm:text-xs outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                tab.id === "file"
                  ? isSelected
                    ? "border-cyan-700 bg-cyan-700 text-white"
                    : "border-transparent bg-cyan-900/40 text-cyan-200 hover:bg-cyan-800/60 hover:text-white"
                  : isSelected
                  ? "-mb-px border-slate-600 bg-slate-800 text-white"
                  : "border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              }`}
              aria-selected={isSelected}
              role="tab"
              id={`ribbon-tab-${tab.id}`}
              aria-controls={`ribbon-panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
            >
              <i className={`fa-solid ${tab.icon} text-[10px] sm:hidden`}></i>
              <span>{tab.label}</span>
              {isSelected && tab.id !== "file" && (
                <span className="absolute inset-x-0 top-0 h-0.5 bg-cyan-400"></span>
              )}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="sticky right-0 ml-auto flex h-8 w-9 shrink-0 items-center justify-center border-l border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
          aria-label={collapsed ? "Expandir cinta" : "Contraer cinta"}
          title={collapsed ? "Expandir cinta" : "Contraer cinta"}
        >
          <i className={`fa-solid ${collapsed ? "fa-chevron-down" : "fa-chevron-up"} text-xs`}></i>
        </button>
      </div>

      {!collapsed && (
        <div
          className="flex min-h-[104px] w-full items-start gap-0 overflow-x-auto border-t border-slate-600 bg-slate-800 px-1 pt-1.5 sm:px-2 [scrollbar-width:thin]"
          role="tabpanel"
          id={`ribbon-panel-${activeTab}`}
          aria-labelledby={`ribbon-tab-${activeTab}`}
        >
          {activeGroups.length > 0 ? (
            activeGroups.map((group) => (
              <RibbonGroup
                key={`${activeTab}-${group.label}`}
                group={group}
                onCommand={onCommand}
                disabled={disabled}
                activeCommands={activeCommands}
              />
            ))
          ) : (
            <div className="p-4 text-xs text-amber-300">
              No hay comandos configurados para esta pestaña.
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
