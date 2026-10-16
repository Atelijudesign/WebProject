import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { useTranslation } from '../context/LanguageContext';
import {
  SP3D_MODULES,
  SP3D_COMMANDS,
  SP3D_GLOSSARY,
  Sp3dModule
} from '../data/sp3d_curriculum';
import { Sp3dViewportSimulator } from '../components/sp3d/Sp3dViewportSimulator';
import { Sp3dPinpointTrainer } from '../components/sp3d/Sp3dPinpointTrainer';
import { Sp3dHierarchyExplorer } from '../components/sp3d/Sp3dHierarchyExplorer';
import { Sp3dInstallGuide } from '../components/sp3d/Sp3dInstallGuide';

export const SmartPlant3DLab: React.FC = () => {
  const { language } = useTranslation();
  const isEn = language === 'en';

  // Pestañas Principales
  const [activeTab, setActiveTab] = useState<'viewport' | 'pinpoint' | 'hierarchy' | 'curriculum' | 'commands' | 'deployment' | 'spec'>('viewport');

  // Módulo Seleccionado en la Academia
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod-00');
  const selectedModule: Sp3dModule = SP3D_MODULES.find(m => m.id === selectedModuleId) || SP3D_MODULES[0];

  // Búsqueda en Comandos
  const [commandSearch, setCommandSearch] = useState<string>('');
  const [disciplineFilter, setDisciplineFilter] = useState<string>('all');

  // Progreso Guardado en LocalStorage
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sp3d_progress_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completedModules) setCompletedModules(parsed.completedModules);
        if (parsed.quizAnswers) setQuizAnswers(parsed.quizAnswers);
        if (parsed.quizSubmitted) setQuizSubmitted(parsed.quizSubmitted);
      }
    } catch {
      // Ignorar errores de localStorage
    }
  }, []);

  const saveProgress = (
    newCompleted: Record<string, boolean>,
    newQuizAns: Record<string, number>,
    newQuizSub: Record<string, boolean>
  ) => {
    try {
      localStorage.setItem(
        'sp3d_progress_v1',
        JSON.stringify({
          completedModules: newCompleted,
          quizAnswers: newQuizAns,
          quizSubmitted: newQuizSub
        })
      );
    } catch {
      // Ignorar errores
    }
  };

  const handleToggleModuleComplete = (modId: string) => {
    const updated = { ...completedModules, [modId]: !completedModules[modId] };
    setCompletedModules(updated);
    saveProgress(updated, quizAnswers, quizSubmitted);
  };

  const handleSelectQuizOption = (questionId: string, optionIdx: number) => {
    const updated = { ...quizAnswers, [questionId]: optionIdx };
    setQuizAnswers(updated);
    saveProgress(completedModules, updated, quizSubmitted);
  };

  const handleSubmitQuiz = (modId: string) => {
    const updated = { ...quizSubmitted, [modId]: true };
    setQuizSubmitted(updated);

    // Si todas las preguntas del módulo están correctas, marcar el módulo como completado
    const mod = SP3D_MODULES.find(m => m.id === modId);
    if (mod) {
      const isAllCorrect = mod.quiz.every(q => quizAnswers[q.id] === q.correctIndex);
      if (isAllCorrect) {
        const updatedComp = { ...completedModules, [modId]: true };
        setCompletedModules(updatedComp);
        saveProgress(updatedComp, quizAnswers, updated);
        return;
      }
    }
    saveProgress(completedModules, quizAnswers, updated);
  };

  const handleResetProgress = () => {
    if (window.confirm('¿Deseas reiniciar tu progreso en la academia de SmartPlant 3D?')) {
      setCompletedModules({});
      setQuizAnswers({});
      setQuizSubmitted({});
      try {
        localStorage.removeItem('sp3d_progress_v1');
      } catch {
        // Ignorar
      }
    }
  };

  // Cálculos de Progreso
  const totalModulesCount = SP3D_MODULES.length;
  const completedCount = Object.values(completedModules).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalModulesCount) * 100);

  // Filtrado de Comandos
  const filteredCommands = SP3D_COMMANDS.filter(cmd => {
    const matchesSearch =
      cmd.shortcut.toLowerCase().includes(commandSearch.toLowerCase()) ||
      cmd.name.toLowerCase().includes(commandSearch.toLowerCase()) ||
      cmd.description.toLowerCase().includes(commandSearch.toLowerCase());
    const matchesDiscipline = disciplineFilter === 'all' || cmd.discipline === disciplineFilter;
    return matchesSearch && matchesDiscipline;
  });

  return (
    <div className="bg-gray-50 dark:bg-bim-dark min-h-screen pt-24 pb-16 transition-colors duration-300">
      <SEOHead
        title={
          isEn
            ? 'SmartPlant 3D Interactive MasterLab | Learn SP3D Online'
            : 'SmartPlant 3D MasterLab Interactivo | Academia & Simulador SP3D Online'
        }
        description={
          isEn
            ? 'Interactive SmartPlant 3D learning platform: 3D graphic viewport simulator, PinPoint F9 trainer, system hierarchy tree, 10 official modules, and VM deployment guide.'
            : 'Plataforma interactiva para aprender Intergraph SmartPlant 3D desde cero: simulador de ventana gráfica 3D, entrenador PinPoint [F9], árbol de sistemas, 10 módulos de manuales técnicos y guía de despliegue en máquina virtual.'
        }
        path="/herramientas/smartplant-3d"
        keywords="SmartPlant 3D, SP3D, Intergraph Smart 3D, curso SmartPlant 3D gratis, aprender SP3D, PinPoint SP3D, modelado de plantas industriales, piping SP3D, diseño de tuberías, estructuras CSA"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: isEn ? 'SmartPlant 3D Interactive MasterLab' : 'SmartPlant 3D MasterLab Interactivo',
          description: isEn
            ? 'Free interactive simulator and master academy for Intergraph SmartPlant 3D.'
            : 'Simulador interactivo y academia de ingeniería para Intergraph SmartPlant 3D.',
          educationalLevel: 'Beginner to Advanced',
          teaches: 'SmartPlant 3D modeling, PinPoint precision, Piping specs, Structural CSA, System Hierarchy, Drawing extraction'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        {/* Navegación Superior de Retorno */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/herramientas"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700/50 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm group"
          >
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>{' '}
            {isEn ? 'Back to Tools Catalog' : 'Volver a Herramientas'}
          </Link>

          {/* Insignia de Progreso Global */}
          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono">
            <span className="text-slate-400">Progreso de Formación:</span>
            <div className="w-28 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-emerald-400 font-bold">{progressPercent}%</span>
            <span className="text-slate-500">
              ({completedCount}/{totalModulesCount} Módulos)
            </span>
          </div>
        </div>

        {/* Hero Section con Bento Grid y Estilo de Ingeniería Ultramoderna */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#0a0f1d] to-slate-900 border border-slate-800 p-8 md:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                INTERGRAPH SMART 3D // ACADEMY & SIMULATOR
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono">
                12 Manuales EFV + Bechtel CSA + Brass
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight font-grotesk tracking-tight">
                SmartPlant 3D <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">MasterLab</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-3xl mt-3 leading-relaxed">
                Aprende el software líder mundial en diseño y modelado de plantas de proceso, minería y energía.
                Sin barreras de instalación complejas: practica directamente en nuestro simulador con el SmartStep ribbon,
                domina el sistema de coordenadas PinPoint [F9] y comprende la arquitectura relacional de bases de datos.
              </p>
            </div>

            {/* Bento Grid de Capacidades Clave */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-cyan-400 font-bold block text-sm">10 MÓDULOS</span>
                <span className="text-slate-400 text-[11px]">De 0 a Pro con Quizzes</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-emerald-400 font-bold block text-sm">PINPOINT [F9]</span>
                <span className="text-slate-400 text-[11px]">Entrenador de Precisión</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-indigo-400 font-bold block text-sm">VIEWPORT 3D</span>
                <span className="text-slate-400 text-[11px]">4 Vistas y SmartStep</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-amber-400 font-bold block text-sm">GUÍA VM ISOLATED</span>
                <span className="text-slate-400 text-[11px]">VMware + SQL 2008</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Pestañas de Navegación del MasterLab en Dos Líneas Horizontales (Sin Scrollbar) */}
        <div className="space-y-2 pb-4 border-b border-slate-800/80 font-mono text-xs">
          {/* Línea 1: Primeros 4 Módulos */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('viewport')}
              className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 text-center border ${
                activeTab === 'viewport'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'
              }`}
            >
              <i className="fa-solid fa-cube text-sm shrink-0"></i>
              <span className="truncate">Simulador Viewport</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pinpoint')}
              className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 text-center border ${
                activeTab === 'pinpoint'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'
              }`}
            >
              <i className="fa-solid fa-crosshairs text-sm shrink-0"></i>
              <span className="truncate">Entrenador PinPoint [F9]</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('hierarchy')}
              className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 text-center border ${
                activeTab === 'hierarchy'
                  ? 'bg-blue-500 text-slate-950 border-blue-400 shadow-lg shadow-blue-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'
              }`}
            >
              <i className="fa-solid fa-sitemap text-sm shrink-0"></i>
              <span className="truncate">Árbol de Sistemas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('curriculum')}
              className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 text-center border ${
                activeTab === 'curriculum'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'
              }`}
            >
              <i className="fa-solid fa-graduation-cap text-sm shrink-0"></i>
              <span className="truncate">Academia (10 Módulos)</span>
            </button>
          </div>

          {/* Línea 2: Siguientes 3 Módulos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('commands')}
              className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 text-center border ${
                activeTab === 'commands'
                  ? 'bg-purple-500 text-slate-950 border-purple-400 shadow-lg shadow-purple-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'
              }`}
            >
              <i className="fa-solid fa-terminal text-sm shrink-0"></i>
              <span className="truncate">Consola de Comandos SP3D</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('spec')}
              className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 text-center border ${
                activeTab === 'spec'
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-400/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'
              }`}
            >
              <i className="fa-solid fa-database text-sm shrink-0"></i>
              <span className="truncate">Buscador de Especificaciones</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('deployment')}
              className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 text-center border ${
                activeTab === 'deployment'
                  ? 'bg-slate-200 text-slate-950 border-slate-100 shadow-lg shadow-slate-200/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'
              }`}
            >
              <i className="fa-solid fa-server text-sm shrink-0"></i>
              <span className="truncate">Despliegue VM & SQL Server</span>
            </button>
          </div>
        </div>

        {/* CONTENIDO SEGÚN LA PESTAÑA ACTIVA */}

        {/* 1. Viewport Simulator */}
        {activeTab === 'viewport' && <Sp3dViewportSimulator />}

        {/* 2. PinPoint Trainer */}
        {activeTab === 'pinpoint' && <Sp3dPinpointTrainer />}

        {/* 3. Hierarchy & Workspace Filter */}
        {activeTab === 'hierarchy' && <Sp3dHierarchyExplorer />}

        {/* 4. Academia & 10 Módulos de Manuales */}
        {activeTab === 'curriculum' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Lista Lateral de Módulos (0 a 9) */}
            <div className="lg:col-span-4 flex flex-col gap-2 max-h-[750px] overflow-y-auto pr-1 scrollbar-thin">
              <div className="flex items-center justify-between px-2 py-1 text-xs font-mono text-slate-400">
                <span>PLAN DE ESTUDIOS // 10 MÓDULOS</span>
                <button
                  type="button"
                  onClick={handleResetProgress}
                  className="text-[10px] text-rose-400 hover:underline"
                >
                  Reiniciar
                </button>
              </div>

              {SP3D_MODULES.map(mod => {
                const isSelected = mod.id === selectedModuleId;
                const isDone = completedModules[mod.id];
                return (
                  <div
                    key={mod.id}
                    onClick={() => setSelectedModuleId(mod.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                        isDone
                          ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
                          : isSelected
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {isDone ? <i className="fa-solid fa-check"></i> : <span>M{mod.number}</span>}
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                          MÓDULO {mod.number} // {mod.discipline.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{mod.duration}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug truncate mt-0.5">{mod.title}</h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{mod.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detalle del Módulo Seleccionado */}
            <div className="lg:col-span-8 flex flex-col gap-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
              {/* Header del Módulo */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded border text-[11px] font-mono font-bold ${selectedModule.badgeColor}`}>
                      <i className={`${selectedModule.icon} mr-1`}></i> MÓDULO {selectedModule.number}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Nivel: <strong>{selectedModule.level}</strong> | Duración: <strong>{selectedModule.duration}</strong>
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white font-grotesk mt-2">{selectedModule.title}</h3>
                  <p className="text-sm text-cyan-300 font-medium mt-0.5">{selectedModule.subtitle}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleModuleComplete(selectedModule.id)}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                    completedModules[selectedModule.id]
                      ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20'
                  }`}
                >
                  <i
                    className={`fa-solid ${
                      completedModules[selectedModule.id] ? 'fa-circle-check text-emerald-400' : 'fa-check'
                    }`}
                  ></i>
                  <span>{completedModules[selectedModule.id] ? 'Módulo Completado' : 'Marcar como Completado'}</span>
                </button>
              </div>

              {/* Visión General del Módulo */}
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">
                  // VISIÓN GENERAL & OBJETIVO INDUSTRIAL
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">{selectedModule.overview}</p>
              </div>

              {/* Conceptos Clave (Grid de 2 Columnas) */}
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 font-bold">
                  // CONCEPTOS TÉCNICOS ESENCIALES
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedModule.coreConcepts.map((concept, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                      <span className="text-xs font-mono font-bold text-cyan-400">{concept.name}</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{concept.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secuencia del SmartStep */}
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">
                  // SECUENCIA OPERATIVA DEL SMARTSTEP RIBBON
                </h4>
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {selectedModule.smartStepSequence.map((step, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5"
                    >
                      <span className="text-cyan-400 font-bold">{idx + 1}.</span>
                      <span>{step.replace(/^\d+\.\s*/, '')}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Laboratorio Práctico Paso a Paso */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30 uppercase">
                      LABORATORIO PRÁCTICO
                    </span>
                    <h5 className="text-sm font-bold text-white font-grotesk">{selectedModule.labExercise.title}</h5>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Objetivo:</strong> {selectedModule.labExercise.objective}
                </p>

                <div className="space-y-3 font-mono text-xs">
                  {selectedModule.labExercise.steps.map(step => (
                    <div key={step.stepNumber} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400 font-bold">
                          Paso {step.stepNumber}: {step.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                          {step.smartStepAction}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs font-sans leading-relaxed">{step.instruction}</p>
                      {step.parameters && (
                        <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-amber-300">
                          {Object.entries(step.parameters).map(([k, v]) => (
                            <span key={k} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                              {k}: <strong>{v}</strong>
                            </span>
                          ))}
                        </div>
                      )}
                      {step.tip && (
                        <span className="text-[11px] text-slate-400 italic">
                          <i className="fa-solid fa-circle-info text-cyan-400 mr-1"></i> Tip: {step.tip}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                  <i className="fa-solid fa-flag-checkered mr-1"></i>
                  <span>Resultado Esperado: {selectedModule.labExercise.expectedResult}</span>
                </div>
              </div>

              {/* Evaluación / Mini-Quiz del Módulo */}
              {selectedModule.quiz.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <i className="fa-solid fa-circle-question"></i>
                      <span>EVALUACIÓN DE COMPRENSIÓN // QUIZ MÓDULO {selectedModule.number}</span>
                    </span>
                  </div>

                  <div className="space-y-4">
                    {selectedModule.quiz.map((q, qIdx) => {
                      const isSubmitted = quizSubmitted[selectedModule.id];
                      const selectedOpt = quizAnswers[q.id];
                      return (
                        <div key={q.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
                          <p className="text-sm font-bold text-white leading-relaxed">
                            {qIdx + 1}. {q.question}
                          </p>

                          <div className="space-y-2">
                            {q.options.map((opt, optIdx) => {
                              const isChecked = selectedOpt === optIdx;
                              let optStyles = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                              if (isSubmitted) {
                                if (optIdx === q.correctIndex) {
                                  optStyles = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                                } else if (isChecked && optIdx !== q.correctIndex) {
                                  optStyles = 'bg-rose-950/80 border-rose-500 text-rose-200';
                                }
                              } else if (isChecked) {
                                optStyles = 'bg-cyan-950/80 border-cyan-400 text-cyan-200 font-bold';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => !isSubmitted && handleSelectQuizOption(q.id, optIdx)}
                                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center gap-3 ${optStyles}`}
                                >
                                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono shrink-0">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="leading-snug">{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {isSubmitted && (
                            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                              <span className="text-cyan-400 font-bold block mb-0.5">Explicación Técnica:</span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!quizSubmitted[selectedModule.id] && (
                    <button
                      type="button"
                      onClick={() => handleSubmitQuiz(selectedModule.id)}
                      className="self-end px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl font-mono text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
                    >
                      Comprobar Respuestas
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. Atajos de Teclado & Glosario Técnico */}
        {activeTab === 'commands' && (
          <div className="flex flex-col gap-8">
            {/* Tabla de Atajos de Teclado */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white font-grotesk flex items-center gap-2">
                    <i className="fa-solid fa-keyboard text-cyan-400"></i>
                    <span>Catálogo de Atajos de Teclado Oficiales de SP3D</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Memorizar estos atajos acelera el ruteo de tuberías y colocación de miembros estructurales un 40%.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-xs text-slate-500"></i>
                    <input
                      type="text"
                      placeholder="Buscar atajo o comando..."
                      value={commandSearch}
                      onChange={e => setCommandSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-cyan-400 outline-none w-56"
                    />
                  </div>
                  <select
                    value={disciplineFilter}
                    onChange={e => setDisciplineFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:border-cyan-400 outline-none"
                  >
                    <option value="all">Todas las Categorías</option>
                    <option value="PinPoint">PinPoint</option>
                    <option value="Navegación & Precisión">Navegación & Precisión</option>
                    <option value="Common">Common</option>
                    <option value="Vistas y Ventanas">Vistas y Ventanas</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Atajo / Tecla</th>
                      <th className="py-2.5 px-3">Comando Oficial</th>
                      <th className="py-2.5 px-3">Disciplina</th>
                      <th className="py-2.5 px-3">Descripción Funcional</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredCommands.map((cmd, i) => (
                      <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <kbd className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-cyan-300 font-bold shadow-sm">
                            {cmd.shortcut}
                          </kbd>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white">{cmd.name}</td>
                        <td className="py-2.5 px-3 text-slate-400">{cmd.discipline}</td>
                        <td className="py-2.5 px-3 text-slate-300 font-sans text-xs">{cmd.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Glosario de Ingeniería Industrial SP3D */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white font-grotesk flex items-center gap-2">
                  <i className="fa-solid fa-book-bookmark text-emerald-400"></i>
                  <span>Glosario Técnico de Términos SmartPlant 3D</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Diferencias conceptuales entre el paradigma tradicional de dibujo CAD y el paradigma basado en bases de datos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SP3D_GLOSSARY.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white font-grotesk">{item.term}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.definition}</p>
                    {item.comparison && (
                      <div className="mt-1 p-2 rounded bg-slate-900 border border-slate-800/80 text-[11px] text-cyan-300 font-mono">
                        <i className="fa-solid fa-code-compare mr-1 text-cyan-400"></i>
                        <span>{item.comparison}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. Despliegue VM & SQL Server */}
        {activeTab === 'deployment' && <Sp3dInstallGuide />}
      </div>
    </div>
  );
};
