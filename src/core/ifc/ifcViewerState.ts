/**
 * IfcViewer State Architecture - Reducer & State Machine
 * Desacopla los más de 30 useState de IfcViewer en una máquina de estados pura,
 * predecible y fuertemente tipada para Three.js y Web-IFC.
 */

export type IfcInteractionMode =
  | 'select'
  | 'measure-distance'
  | 'measure-area'
  | 'section';

export type IfcRenderStyle = 'shaded' | 'transparent' | 'wireframe';

export type IfcRibbonTab = 'file' | 'view' | 'measure' | 'section' | 'bcf';

export type IfcSidebarTab =
  | 'categories'
  | 'search'
  | 'measurements'
  | 'section'
  | null;

export type IfcModalKey =
  | 'shortcuts'
  | 'memory'
  | 'quantities'
  | 'privacy'
  | 'export'
  | 'tutorial';

export interface IfcLoadingProgress {
  readonly phase: string;
  readonly percent: number;
}

export interface IfcIndexProgress {
  readonly completed: number;
  readonly total: number;
}

export interface IfcPerformanceMetrics {
  readonly fps: number;
  readonly drawCalls: number;
  readonly triangles: number;
}

export interface IfcViewerUiState {
  // Modales
  readonly isShortcutsModalOpen: boolean;
  readonly isMemoryModalOpen: boolean;
  readonly isQuantitiesModalOpen: boolean;
  readonly isPrivacyModalOpen: boolean;
  readonly isExportModalOpen: boolean;
  readonly isTutorialOpen: boolean;
  readonly quantitiesInitialTab: string;

  // Interfaz de navegación y paneles
  readonly activeRibbonTab: IfcRibbonTab;
  readonly isRibbonCollapsed: boolean;
  readonly activeSidebarTab: IfcSidebarTab;
  readonly isPropertiesOpen: boolean;
  readonly isFullscreen: boolean;
  readonly sidebarWidth: number;
}

export interface IfcViewerToolsState {
  readonly activeMode: IfcInteractionMode;
  readonly renderStyle: IfcRenderStyle;
  readonly isGridVisible: boolean;
  readonly isOrthographic: boolean;
  readonly isolatedExpressId: number | null;
  readonly hiddenExpressIds: ReadonlySet<number>;
}

export interface IfcViewerModelState {
  readonly modelName: string | null;
  readonly isLoading: boolean;
  readonly loadingProgress: IfcLoadingProgress;
  readonly isIndexing: boolean;
  readonly indexProgress: IfcIndexProgress;
  readonly hasLoadedModel: boolean;
  readonly errorMessage: string | null;
  readonly cacheStatus: 'idle' | 'hit' | 'miss' | 'saved';
  readonly performanceMetrics: IfcPerformanceMetrics;
}

export interface IfcViewerState {
  readonly ui: IfcViewerUiState;
  readonly tools: IfcViewerToolsState;
  readonly model: IfcViewerModelState;
}

export type IfcViewerAction =
  | { type: 'OPEN_MODAL'; payload: { modal: IfcModalKey; initialTab?: string } }
  | { type: 'CLOSE_MODAL'; payload: { modal: IfcModalKey } }
  | { type: 'CLOSE_ALL_MODALS' }
  | { type: 'SET_RIBBON_TAB'; payload: IfcRibbonTab }
  | { type: 'TOGGLE_RIBBON_COLLAPSE' }
  | { type: 'SET_SIDEBAR_TAB'; payload: IfcSidebarTab }
  | { type: 'TOGGLE_PROPERTIES_PANEL' }
  | { type: 'SET_SIDEBAR_WIDTH'; payload: number }
  | { type: 'SET_FULLSCREEN'; payload: boolean }
  | { type: 'SET_ACTIVE_MODE'; payload: IfcInteractionMode }
  | { type: 'SET_RENDER_STYLE'; payload: IfcRenderStyle }
  | { type: 'TOGGLE_GRID_VISIBILITY' }
  | { type: 'TOGGLE_ORTHOGRAPHIC' }
  | { type: 'SET_ISOLATED_ELEMENT'; payload: number | null }
  | { type: 'HIDE_ELEMENT'; payload: number }
  | { type: 'UNHIDE_ELEMENT'; payload: number }
  | { type: 'CLEAR_HIDDEN_ELEMENTS' }
  | { type: 'START_MODEL_LOAD'; payload: { modelName: string } }
  | { type: 'UPDATE_LOAD_PROGRESS'; payload: IfcLoadingProgress }
  | { type: 'SET_INDEXING'; payload: { isIndexing: boolean; completed?: number; total?: number } }
  | { type: 'FINISH_MODEL_LOAD'; payload?: { modelName?: string } }
  | { type: 'FAIL_MODEL_LOAD'; payload: { errorMessage: string } }
  | { type: 'SET_CACHE_STATUS'; payload: 'idle' | 'hit' | 'miss' | 'saved' }
  | { type: 'UPDATE_PERFORMANCE_METRICS'; payload: Partial<IfcPerformanceMetrics> };

export const initialIfcViewerState: IfcViewerState = {
  ui: {
    isShortcutsModalOpen: false,
    isMemoryModalOpen: false,
    isQuantitiesModalOpen: false,
    isPrivacyModalOpen: false,
    isExportModalOpen: false,
    isTutorialOpen: false,
    quantitiesInitialTab: 'summary',
    activeRibbonTab: 'file',
    isRibbonCollapsed: false,
    activeSidebarTab: null,
    isPropertiesOpen: true,
    isFullscreen: false,
    sidebarWidth: 460,
  },
  tools: {
    activeMode: 'select',
    renderStyle: 'shaded',
    isGridVisible: true,
    isOrthographic: false,
    isolatedExpressId: null,
    hiddenExpressIds: new Set<number>(),
  },
  model: {
    modelName: null,
    isLoading: false,
    loadingProgress: { phase: 'Listo para cargar modelo IFC', percent: 0 },
    isIndexing: false,
    indexProgress: { completed: 0, total: 0 },
    hasLoadedModel: false,
    errorMessage: null,
    cacheStatus: 'idle',
    performanceMetrics: { fps: 60, drawCalls: 1, triangles: 0 },
  },
};

export function ifcViewerReducer(
  state: IfcViewerState,
  action: IfcViewerAction
): IfcViewerState {
  switch (action.type) {
    case 'OPEN_MODAL': {
      const { modal, initialTab } = action.payload;
      return {
        ...state,
        ui: {
          ...state.ui,
          isShortcutsModalOpen: modal === 'shortcuts',
          isMemoryModalOpen: modal === 'memory',
          isQuantitiesModalOpen: modal === 'quantities',
          isPrivacyModalOpen: modal === 'privacy',
          isExportModalOpen: modal === 'export',
          isTutorialOpen: modal === 'tutorial',
          quantitiesInitialTab: initialTab || state.ui.quantitiesInitialTab,
        },
      };
    }

    case 'CLOSE_MODAL': {
      const { modal } = action.payload;
      if (modal === 'shortcuts') {
        return { ...state, ui: { ...state.ui, isShortcutsModalOpen: false } };
      }
      if (modal === 'memory') {
        return { ...state, ui: { ...state.ui, isMemoryModalOpen: false } };
      }
      if (modal === 'quantities') {
        return { ...state, ui: { ...state.ui, isQuantitiesModalOpen: false } };
      }
      if (modal === 'privacy') {
        return { ...state, ui: { ...state.ui, isPrivacyModalOpen: false } };
      }
      if (modal === 'export') {
        return { ...state, ui: { ...state.ui, isExportModalOpen: false } };
      }
      if (modal === 'tutorial') {
        return { ...state, ui: { ...state.ui, isTutorialOpen: false } };
      }
      return state;
    }

    case 'CLOSE_ALL_MODALS': {
      return {
        ...state,
        ui: {
          ...state.ui,
          isShortcutsModalOpen: false,
          isMemoryModalOpen: false,
          isQuantitiesModalOpen: false,
          isPrivacyModalOpen: false,
          isExportModalOpen: false,
          isTutorialOpen: false,
        },
      };
    }

    case 'SET_RIBBON_TAB': {
      return {
        ...state,
        ui: { ...state.ui, activeRibbonTab: action.payload },
      };
    }

    case 'TOGGLE_RIBBON_COLLAPSE': {
      return {
        ...state,
        ui: { ...state.ui, isRibbonCollapsed: !state.ui.isRibbonCollapsed },
      };
    }

    case 'SET_SIDEBAR_TAB': {
      return {
        ...state,
        ui: { ...state.ui, activeSidebarTab: action.payload },
      };
    }

    case 'TOGGLE_PROPERTIES_PANEL': {
      return {
        ...state,
        ui: { ...state.ui, isPropertiesOpen: !state.ui.isPropertiesOpen },
      };
    }

    case 'SET_SIDEBAR_WIDTH': {
      return {
        ...state,
        ui: { ...state.ui, sidebarWidth: action.payload },
      };
    }

    case 'SET_FULLSCREEN': {
      return {
        ...state,
        ui: { ...state.ui, isFullscreen: action.payload },
      };
    }

    case 'SET_ACTIVE_MODE': {
      return {
        ...state,
        tools: { ...state.tools, activeMode: action.payload },
      };
    }

    case 'SET_RENDER_STYLE': {
      return {
        ...state,
        tools: { ...state.tools, renderStyle: action.payload },
      };
    }

    case 'TOGGLE_GRID_VISIBILITY': {
      return {
        ...state,
        tools: { ...state.tools, isGridVisible: !state.tools.isGridVisible },
      };
    }

    case 'TOGGLE_ORTHOGRAPHIC': {
      return {
        ...state,
        tools: { ...state.tools, isOrthographic: !state.tools.isOrthographic },
      };
    }

    case 'SET_ISOLATED_ELEMENT': {
      return {
        ...state,
        tools: { ...state.tools, isolatedExpressId: action.payload },
      };
    }

    case 'HIDE_ELEMENT': {
      const nextHidden = new Set(state.tools.hiddenExpressIds);
      nextHidden.add(action.payload);
      return {
        ...state,
        tools: { ...state.tools, hiddenExpressIds: nextHidden },
      };
    }

    case 'UNHIDE_ELEMENT': {
      const nextHidden = new Set(state.tools.hiddenExpressIds);
      nextHidden.delete(action.payload);
      return {
        ...state,
        tools: { ...state.tools, hiddenExpressIds: nextHidden },
      };
    }

    case 'CLEAR_HIDDEN_ELEMENTS': {
      return {
        ...state,
        tools: { ...state.tools, hiddenExpressIds: new Set<number>() },
      };
    }

    case 'START_MODEL_LOAD': {
      return {
        ...state,
        model: {
          ...state.model,
          modelName: action.payload.modelName,
          isLoading: true,
          hasLoadedModel: false,
          errorMessage: null,
          loadingProgress: { phase: 'Iniciando carga...', percent: 5 },
        },
      };
    }

    case 'UPDATE_LOAD_PROGRESS': {
      return {
        ...state,
        model: { ...state.model, loadingProgress: action.payload },
      };
    }

    case 'SET_INDEXING': {
      const { isIndexing, completed = 0, total = 0 } = action.payload;
      return {
        ...state,
        model: {
          ...state.model,
          isIndexing,
          indexProgress: { completed, total },
        },
      };
    }

    case 'FINISH_MODEL_LOAD': {
      return {
        ...state,
        model: {
          ...state.model,
          isLoading: false,
          hasLoadedModel: true,
          errorMessage: null,
          loadingProgress: { phase: 'Modelo cargado exitosamente', percent: 100 },
          modelName: action.payload?.modelName || state.model.modelName,
        },
      };
    }

    case 'FAIL_MODEL_LOAD': {
      return {
        ...state,
        model: {
          ...state.model,
          isLoading: false,
          hasLoadedModel: false,
          errorMessage: action.payload.errorMessage,
        },
      };
    }

    case 'SET_CACHE_STATUS': {
      return {
        ...state,
        model: { ...state.model, cacheStatus: action.payload },
      };
    }

    case 'UPDATE_PERFORMANCE_METRICS': {
      return {
        ...state,
        model: {
          ...state.model,
          performanceMetrics: {
            ...state.model.performanceMetrics,
            ...action.payload,
          },
        },
      };
    }

    default:
      return state;
  }
}
