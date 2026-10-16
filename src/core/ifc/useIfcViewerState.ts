import { useReducer, useCallback, useMemo } from 'react';
import {
  ifcViewerReducer,
  initialIfcViewerState,
  type IfcViewerState,
  type IfcModalKey,
  type IfcRibbonTab,
  type IfcSidebarTab,
  type IfcInteractionMode,
  type IfcRenderStyle,
  type IfcLoadingProgress,
} from './ifcViewerState';

/**
 * Custom Hook que orquesta la máquina de estados de IfcViewer.
 * Evita la dispersión de más de 30 useState individuales y provee
 * despacho de acciones atómico y predecible.
 */
export function useIfcViewerState(customInitialState?: Partial<IfcViewerState>) {
  const [state, dispatch] = useReducer(
    ifcViewerReducer,
    customInitialState ? { ...initialIfcViewerState, ...customInitialState } : initialIfcViewerState
  );

  const openModal = useCallback((modal: IfcModalKey, initialTab?: string) => {
    dispatch({ type: 'OPEN_MODAL', payload: { modal, initialTab } });
  }, []);

  const closeModal = useCallback((modal: IfcModalKey) => {
    dispatch({ type: 'CLOSE_MODAL', payload: { modal } });
  }, []);

  const closeAllModals = useCallback(() => {
    dispatch({ type: 'CLOSE_ALL_MODALS' });
  }, []);

  const setRibbonTab = useCallback((tab: IfcRibbonTab) => {
    dispatch({ type: 'SET_RIBBON_TAB', payload: tab });
  }, []);

  const toggleRibbonCollapse = useCallback(() => {
    dispatch({ type: 'TOGGLE_RIBBON_COLLAPSE' });
  }, []);

  const setSidebarTab = useCallback((tab: IfcSidebarTab) => {
    dispatch({ type: 'SET_SIDEBAR_TAB', payload: tab });
  }, []);

  const togglePropertiesPanel = useCallback(() => {
    dispatch({ type: 'TOGGLE_PROPERTIES_PANEL' });
  }, []);

  const setSidebarWidth = useCallback((width: number) => {
    dispatch({ type: 'SET_SIDEBAR_WIDTH', payload: width });
  }, []);

  const setFullscreen = useCallback((isFullscreen: boolean) => {
    dispatch({ type: 'SET_FULLSCREEN', payload: isFullscreen });
  }, []);

  const setActiveMode = useCallback((mode: IfcInteractionMode) => {
    dispatch({ type: 'SET_ACTIVE_MODE', payload: mode });
  }, []);

  const setRenderStyle = useCallback((style: IfcRenderStyle) => {
    dispatch({ type: 'SET_RENDER_STYLE', payload: style });
  }, []);

  const toggleGrid = useCallback(() => {
    dispatch({ type: 'TOGGLE_GRID_VISIBILITY' });
  }, []);

  const toggleOrthographic = useCallback(() => {
    dispatch({ type: 'TOGGLE_ORTHOGRAPHIC' });
  }, []);

  const setIsolatedElement = useCallback((expressId: number | null) => {
    dispatch({ type: 'SET_ISOLATED_ELEMENT', payload: expressId });
  }, []);

  const hideElement = useCallback((expressId: number) => {
    dispatch({ type: 'HIDE_ELEMENT', payload: expressId });
  }, []);

  const unhideElement = useCallback((expressId: number) => {
    dispatch({ type: 'UNHIDE_ELEMENT', payload: expressId });
  }, []);

  const clearHiddenElements = useCallback(() => {
    dispatch({ type: 'CLEAR_HIDDEN_ELEMENTS' });
  }, []);

  const startModelLoad = useCallback((modelName: string) => {
    dispatch({ type: 'START_MODEL_LOAD', payload: { modelName } });
  }, []);

  const updateLoadProgress = useCallback((progress: IfcLoadingProgress) => {
    dispatch({ type: 'UPDATE_LOAD_PROGRESS', payload: progress });
  }, []);

  const finishModelLoad = useCallback((modelName?: string) => {
    dispatch({ type: 'FINISH_MODEL_LOAD', payload: modelName ? { modelName } : undefined });
  }, []);

  const failModelLoad = useCallback((errorMessage: string) => {
    dispatch({ type: 'FAIL_MODEL_LOAD', payload: { errorMessage } });
  }, []);

  const actions = useMemo(
    () => ({
      openModal,
      closeModal,
      closeAllModals,
      setRibbonTab,
      toggleRibbonCollapse,
      setSidebarTab,
      togglePropertiesPanel,
      setSidebarWidth,
      setFullscreen,
      setActiveMode,
      setRenderStyle,
      toggleGrid,
      toggleOrthographic,
      setIsolatedElement,
      hideElement,
      unhideElement,
      clearHiddenElements,
      startModelLoad,
      updateLoadProgress,
      finishModelLoad,
      failModelLoad,
      dispatch,
    }),
    [
      openModal,
      closeModal,
      closeAllModals,
      setRibbonTab,
      toggleRibbonCollapse,
      setSidebarTab,
      togglePropertiesPanel,
      setSidebarWidth,
      setFullscreen,
      setActiveMode,
      setRenderStyle,
      toggleGrid,
      toggleOrthographic,
      setIsolatedElement,
      hideElement,
      unhideElement,
      clearHiddenElements,
      startModelLoad,
      updateLoadProgress,
      finishModelLoad,
      failModelLoad,
    ]
  );

  return { state, actions };
}
