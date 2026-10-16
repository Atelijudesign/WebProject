import React, { useState } from 'react';
import { TRAINING_SYSTEM_HIERARCHY, HierarchyNode } from '../../data/sp3d_curriculum';

interface TreeNodeProps {
  readonly node: HierarchyNode;
  readonly level: number;
  readonly selectedNodeId: string | null;
  readonly onSelect: (node: HierarchyNode) => void;
  readonly activeWorkspaceFilters: readonly string[];
  readonly onToggleFilter: (nodeId: string) => void;
}

const TreeNodeItem: React.FC<TreeNodeProps> = ({
  node,
  level,
  selectedNodeId,
  onSelect,
  activeWorkspaceFilters,
  onToggleFilter
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(level < 2);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNodeId === node.id;
  const isIncludedInWorkspace = activeWorkspaceFilters.includes(node.id);

  const getNodeIcon = () => {
    if (node.type === 'plant') return 'fa-solid fa-industry text-amber-400';
    if (node.type === 'area') return 'fa-solid fa-map text-cyan-400';
    if (node.type === 'unit') return 'fa-solid fa-cube text-blue-400';
    if (node.type === 'system') {
      if (node.discipline === 'piping') return 'fa-solid fa-arrows-split-up-and-left text-emerald-400';
      if (node.discipline === 'structure') return 'fa-solid fa-cubes-stacked text-indigo-400';
      if (node.discipline === 'equipment') return 'fa-solid fa-gear text-cyan-300';
      if (node.discipline === 'electrical') return 'fa-solid fa-bolt text-yellow-400';
      return 'fa-solid fa-folder text-slate-400';
    }
    return 'fa-solid fa-circle-dot text-slate-400';
  };

  return (
    <div className="flex flex-col select-none">
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-all ${
          isSelected ? 'bg-cyan-950/80 border border-cyan-500/50' : 'hover:bg-slate-800/60'
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(node)}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setIsExpanded(prev => !prev);
            }}
            className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <i className={`fa-solid ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-right'} text-[10px]`}></i>
          </button>
        ) : (
          <span className="w-4"></span>
        )}

        <input
          type="checkbox"
          checked={isIncludedInWorkspace}
          onChange={e => {
            e.stopPropagation();
            onToggleFilter(node.id);
          }}
          className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
          title="Incluir / Excluir de Workspace (Filtro SQL)"
        />

        <i className={`${getNodeIcon()} text-xs w-4 text-center`}></i>

        <span className="text-xs font-mono text-slate-200 truncate flex-1">{node.name}</span>

        {node.type === 'system' && (
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
            {node.discipline}
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="flex flex-col">
          {node.children!.map(child => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedNodeId={selectedNodeId}
              onSelect={onSelect}
              activeWorkspaceFilters={activeWorkspaceFilters}
              onToggleFilter={onToggleFilter}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sp3dHierarchyExplorer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<HierarchyNode>(TRAINING_SYSTEM_HIERARCHY);
  const [activeWorkspaceFilters, setActiveWorkspaceFilters] = useState<readonly string[]>([
    'plant-01',
    'area-a2',
    'unit-u03',
    'sys-u03-eqp',
    'sys-u03-pip',
    'sys-u03-str'
  ]);
  const [isQueryApplied, setIsQueryApplied] = useState<boolean>(true);

  const handleToggleFilter = (nodeId: string) => {
    setActiveWorkspaceFilters(prev =>
      prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]
    );
    setIsQueryApplied(false);
  };

  const handleSelectAll = () => {
    setActiveWorkspaceFilters([
      'plant-01',
      'area-a1',
      'unit-u01',
      'sys-u01-pip',
      'sys-u01-str',
      'area-a2',
      'unit-u03',
      'sys-u03-eqp',
      'sys-u03-pip',
      'sys-u03-str',
      'sys-u03-elec',
      'unit-u04',
      'sys-u04-pip',
      'sys-u04-sup'
    ]);
    setIsQueryApplied(false);
  };

  const handleClearFilters = () => {
    setActiveWorkspaceFilters([]);
    setIsQueryApplied(false);
  };

  const estimatedElementsCount = activeWorkspaceFilters.length * 142;
  const estimatedRamMB = (activeWorkspaceFilters.length * 48.5).toFixed(1);

  return (
    <div className="flex flex-col gap-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 font-mono text-xs font-bold border border-blue-500/40">
              <i className="fa-solid fa-sitemap mr-1"></i> SP3D SYSTEM HIERARCHY & WORKSPACE
            </span>
            <span className="text-xs font-mono text-slate-400">// Base de Datos de Planta SQL Server</span>
          </div>
          <h3 className="text-xl font-black text-white mt-1 font-grotesk">
            Explorador de Árbol de Sistemas & Filtro de Espacio de Trabajo
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
            En SmartPlant 3D ningún elemento flota suelto. Todo componente pertenece a un Sistema Padre estricto
            (Planta &gt; Área &gt; Unidad &gt; Disciplina). Aquí puedes simular el diálogo 'Define Workspace' y entender
            cómo la base de datos carga solo los objetos seleccionados.
          </p>
        </div>

        {/* Acciones de Selección Rápida */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono border border-slate-700"
          >
            Seleccionar Todo
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono border border-slate-700"
          >
            Limpiar Filtros
          </button>
          <button
            type="button"
            onClick={() => setIsQueryApplied(true)}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-bold shadow-md shadow-cyan-600/20"
          >
            <i className="fa-solid fa-arrows-rotate mr-1"></i> Aplicar Workspace
          </button>
        </div>
      </div>

      {/* Grid: Árbol de Jerarquía + Panel de Información y Consulta SQL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Árbol Interactivo (Columna Izquierda) */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 max-h-[480px] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <i className="fa-solid fa-folder-tree text-cyan-400"></i>
              <span>SYSTEM HIERARCHY TREE</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {activeWorkspaceFilters.length} nodos activos
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <TreeNodeItem
              node={TRAINING_SYSTEM_HIERARCHY}
              level={0}
              selectedNodeId={selectedNode.id}
              onSelect={setSelectedNode}
              activeWorkspaceFilters={activeWorkspaceFilters}
              onToggleFilter={handleToggleFilter}
            />
          </div>
        </div>

        {/* Panel de Metadatos del Nodo + Simulación SQL (Columna Derecha) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Tarjeta de Metadatos del Nodo Seleccionado */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                PROPIEDADES DE LA ENTIDAD SELECCIONADA
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
                {selectedNode.type}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Nombre del Objeto</span>
                <p className="text-sm font-bold text-white">{selectedNode.name}</p>
              </div>

              {selectedNode.properties && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  {Object.entries(selectedNode.properties).map(([k, v]) => (
                    <div key={k} className="flex flex-col">
                      <span className="text-[10px] text-slate-500">{k}</span>
                      <span className="text-slate-200 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Consulta SQL Generada & Métricas de Workspace */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-database text-emerald-400"></i>
                <span>CONSULTA SQL GENERADA ('Define Workspace')</span>
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded border ${
                  isQueryApplied
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-950 text-amber-300 border-amber-500/40'
                }`}
              >
                {isQueryApplied ? 'Sincronizado' : 'Cambios Pendientes'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
              <code>
                SELECT e.OID, e.Type, e.Spec, e.GeometryBlob, e.SystemOID <br />
                FROM SP3D_Model.dbo.JNamedItem e <br />
                WHERE e.SystemOID IN (
                {activeWorkspaceFilters.length > 0 ? (
                  activeWorkspaceFilters.map(f => `'${f}'`).join(', ')
                ) : (
                  <span className="text-rose-400 font-bold">/* NINGÚN FILTRO: LA VISTA GRÁFICA QUEDA VACÍA */</span>
                )}
                ) AND e.Status = 1;
              </code>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-500">Objetos Cargados</span>
                <span className="text-white font-bold">{isQueryApplied ? estimatedElementsCount : 0} items</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-500">Memoria RAM Est.</span>
                <span className="text-cyan-300 font-bold">{isQueryApplied ? estimatedRamMB : '0.0'} MB</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex flex-col col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500">Latencia SQL</span>
                <span className="text-emerald-400 font-bold">14 ms (Direct Socket)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
