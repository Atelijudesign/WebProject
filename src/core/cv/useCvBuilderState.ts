import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  CV_MODE_KEY,
  CV_STORAGE_KEY,
  EMPTY_CV,
  EXAMPLE_CV,
  analyzeAts,
  evaluateCvProgress,
  readLocalCv,
} from '../../utils/cvAts';
import { getAssistantInsights } from '../../utils/cvAssistant';
import { readCvWorkspace } from '../../utils/cvWorkspace';

export interface CvPersonal {
  readonly name: string;
  readonly title: string;
  readonly email: string;
  readonly phone: string;
  readonly location: string;
  readonly linkedin?: string;
  readonly website?: string;
}

export interface CvTargetJob {
  readonly title: string;
  readonly description: string;
}

export interface CvData {
  readonly version: number;
  readonly projectName: string;
  readonly locale: { readonly country: string; readonly language: string };
  readonly pageFormat: string;
  readonly template: string;
  readonly personal: CvPersonal;
  readonly targetJob: CvTargetJob;
  readonly summary: string;
  readonly experience: ReadonlyArray<Record<string, unknown>>;
  readonly education: ReadonlyArray<Record<string, unknown>>;
  readonly certifications: ReadonlyArray<Record<string, unknown>>;
  readonly skills: ReadonlyArray<string>;
  readonly languages: ReadonlyArray<Record<string, unknown>>;
  readonly projects: ReadonlyArray<Record<string, unknown>>;
}

export type CvStepKey =
  | 'job'
  | 'personal'
  | 'experience'
  | 'skills'
  | 'assistant'
  | 'review'
  | 'applications'
  | 'export';

/**
 * Hook arquitectónico que desacopla la gestión de datos, historial (undo)
 * y análisis ATS del currículum de la vista CvAtsBuilder.
 */
export function useCvBuilderState() {
  const [cv, setCv] = useState<CvData>(() => readLocalCv() as CvData);
  const [isDemo, setIsDemo] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const savedMode = window.localStorage.getItem(CV_MODE_KEY);
    return savedMode === 'demo';
  });
  const [activeStep, setActiveStep] = useState<CvStepKey>('job');
  const [notice, setNotice] = useState<string>('');
  const [workspace, setWorkspace] = useState(readCvWorkspace);
  const [activeApplicationId, setActiveApplicationId] = useState<string>('');
  const [exportErrors, setExportErrors] = useState<readonly string[]>([]);

  const historyRef = useRef<CvData[]>([]);

  // Sincronización automática de persistencia en localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || !cv) {
      return;
    }
    try {
      window.localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cv));
    } catch {
      // Ignorar errores de cuota de almacenamiento local
    }
  }, [cv]);

  // Actualizador inmutable con histórico para deshacer
  const updateCv = useCallback(
    (updater: Partial<CvData> | ((prev: CvData) => CvData)) => {
      setCv((current) => {
        const next =
          typeof updater === 'function' ? updater(current) : { ...current, ...updater };
        if (next === current) {
          return current;
        }
        historyRef.current = [...historyRef.current.slice(-24), current];
        return next;
      });
    },
    []
  );

  const canUndo = historyRef.current.length > 0;

  const undo = useCallback(() => {
    const previous = historyRef.current.at(-1);
    if (!previous) {
      return;
    }
    historyRef.current = historyRef.current.slice(0, -1);
    setCv(previous);
  }, []);

  const toggleDemo = useCallback(() => {
    setIsDemo((currentDemo) => {
      const nextDemo = !currentDemo;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(CV_MODE_KEY, nextDemo ? 'demo' : 'draft');
      }
      setCv(nextDemo ? (EXAMPLE_CV as unknown as CvData) : (EMPTY_CV as unknown as CvData));
      return nextDemo;
    });
  }, []);

  const resetToEmpty = useCallback(() => {
    updateCv(EMPTY_CV as unknown as CvData);
    setIsDemo(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CV_MODE_KEY, 'draft');
    }
  }, [updateCv]);

  // Análisis ATS y métricas de completitud derivadas
  const analysis = useMemo(() => analyzeAts(cv), [cv]);
  const progress = useMemo(() => evaluateCvProgress(cv), [cv]);
  const assistant = useMemo(() => getAssistantInsights(cv), [cv]);

  return {
    cv,
    updateCv,
    canUndo,
    undo,
    isDemo,
    toggleDemo,
    resetToEmpty,
    activeStep,
    setActiveStep,
    notice,
    setNotice,
    workspace,
    setWorkspace,
    activeApplicationId,
    setActiveApplicationId,
    exportErrors,
    setExportErrors,
    analysis,
    progress,
    assistant,
  };
}
