import sp3dData from './sp3d_data.json';

export interface Sp3dQuizQuestion {
  readonly id: string;
  readonly question: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly explanation: string;
}

export interface Sp3dLabStep {
  readonly stepNumber: number;
  readonly title: string;
  readonly smartStepAction: string;
  readonly instruction: string;
  readonly parameters?: Record<string, string>;
  readonly tip?: string;
}

export interface Sp3dModule {
  readonly id: string;
  readonly number: number;
  readonly title: string;
  readonly subtitle: string;
  readonly discipline: 'common' | 'grids' | 'equipment' | 'piping' | 'structure' | 'supports' | 'electrical' | 'drawings' | 'clash' | 'infrastructure';
  readonly icon: string;
  readonly badgeColor: string;
  readonly duration: string;
  readonly level: 'Básico' | 'Intermedio' | 'Avanzado';
  readonly overview: string;
  readonly coreConcepts: readonly { readonly name: string; readonly description: string }[];
  readonly smartStepSequence: readonly string[];
  readonly labExercise: {
    readonly title: string;
    readonly objective: string;
    readonly prerequisites: string;
    readonly steps: readonly Sp3dLabStep[];
    readonly expectedResult: string;
  };
  readonly quiz: readonly Sp3dQuizQuestion[];
}

export interface Sp3dCommand {
  readonly shortcut: string;
  readonly name: string;
  readonly discipline: string;
  readonly description: string;
  readonly context: string;
}

export interface Sp3dGlossaryItem {
  readonly term: string;
  readonly category: string;
  readonly definition: string;
  readonly comparison?: string;
}

export interface HierarchyNode {
  readonly id: string;
  readonly name: string;
  readonly type: 'plant' | 'area' | 'unit' | 'system' | 'object';
  readonly discipline?: string;
  readonly children?: readonly HierarchyNode[];
  readonly properties?: Record<string, string>;
}

export const SP3D_COMMANDS: readonly Sp3dCommand[] = sp3dData.SP3D_COMMANDS;
export const SP3D_GLOSSARY: readonly Sp3dGlossaryItem[] = sp3dData.SP3D_GLOSSARY;
export const TRAINING_SYSTEM_HIERARCHY: HierarchyNode = sp3dData.TRAINING_SYSTEM_HIERARCHY as HierarchyNode;
export const SP3D_MODULES: readonly Sp3dModule[] = sp3dData.SP3D_MODULES as unknown as readonly Sp3dModule[];
