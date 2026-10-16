import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import {
  SP3D_MODULES,
  SP3D_COMMANDS,
  SP3D_GLOSSARY,
  TRAINING_SYSTEM_HIERARCHY,
} from '../data/sp3d_curriculum';
import { Sp3dPinpointTrainer } from '../components/sp3d/Sp3dPinpointTrainer';
import { Sp3dHierarchyExplorer } from '../components/sp3d/Sp3dHierarchyExplorer';
import { SmartPlant3DLab } from '../pages/SmartPlant3DLab';

beforeEach(() => {
  cleanup();
});

describe('SmartPlant 3D Curriculum & Data Integrity', () => {
  it('should contain exactly 10 comprehensive modules (0 to 9)', () => {
    expect(SP3D_MODULES).toBeDefined();
    expect(SP3D_MODULES.length).toBe(10);
    expect(SP3D_MODULES[0].number).toBe(0);
    expect(SP3D_MODULES[9].number).toBe(9);
  });

  it('each module should have valid lab exercises and smartStep sequence', () => {
    for (const mod of SP3D_MODULES) {
      expect(mod.title).toBeTruthy();
      expect(mod.smartStepSequence).toBeDefined();
      expect(mod.smartStepSequence.length).toBeGreaterThan(0);
      expect(mod.labExercise).toBeDefined();
      expect(mod.labExercise.steps.length).toBeGreaterThan(0);
      expect(mod.quiz).toBeDefined();
      expect(mod.quiz.length).toBeGreaterThan(0);
    }
  });

  it('should include essential industrial SP3D commands and shortcuts', () => {
    expect(SP3D_COMMANDS.length).toBeGreaterThan(5);
    const pinpointCmd = SP3D_COMMANDS.find((c) => c.shortcut === 'F9');
    expect(pinpointCmd).toBeDefined();
    expect(pinpointCmd?.name).toContain('PinPoint');
  });

  it('should include technical glossary items for database-driven modeling', () => {
    expect(SP3D_GLOSSARY.length).toBeGreaterThan(5);
    const wsTerm = SP3D_GLOSSARY.find((g) => g.term.includes('Workspace'));
    expect(wsTerm).toBeDefined();
  });
});

describe('Sp3dPinpointTrainer Component', () => {
  it('should render initial target coordinates and challenge title', () => {
    render(<Sp3dPinpointTrainer />);
    expect(screen.getAllByText(/SP3D PRECISION TOOL/i)[0]).toBeDefined();
    expect(screen.getAllByText(/Desafío 1:/i)[0]).toBeDefined();
    expect(screen.getAllByText(/TARGET:/i)[0]).toBeDefined();
  });

  it('should allow clicking challenge and action buttons', () => {
    render(<Sp3dPinpointTrainer />);
    const validateBtn = screen.getAllByText(/Validar Posición/i)[0];
    expect(validateBtn).toBeDefined();
    fireEvent.click(validateBtn);

    const challenge2Btns = screen.getAllByText(/Desafío 2/i);
    expect(challenge2Btns.length).toBeGreaterThan(0);
    fireEvent.click(challenge2Btns[0]);
    expect(screen.getAllByText(/Desafío 2:/i)[0]).toBeDefined();
  });
});

describe('Sp3dHierarchyExplorer Component', () => {
  it('should render plant root and generated SQL query block', () => {
    render(<Sp3dHierarchyExplorer />);
    expect(screen.getAllByText(/Planta Refinería Biobío/i)[0]).toBeDefined();
    expect(screen.getAllByText(/CONSULTA SQL GENERADA/i)[0]).toBeDefined();
  });
});

describe('SmartPlant3DLab Master Page', () => {
  it('should render hero title and primary navigation tabs', () => {
    render(
      <LanguageProvider>
        <BrowserRouter>
          <SmartPlant3DLab />
        </BrowserRouter>
      </LanguageProvider>
    );

    expect(screen.getAllByText(/SmartPlant 3D/i)[0]).toBeDefined();
    expect(screen.getAllByText(/MasterLab/i)[0]).toBeDefined();
    expect(screen.getAllByText(/Simulador Viewport/i)[0]).toBeDefined();
    expect(screen.getAllByText(/Entrenador PinPoint/i)[0]).toBeDefined();
    expect(screen.getAllByText(/Árbol de Sistemas/i)[0]).toBeDefined();
    expect(screen.getAllByText(/Academia/i)[0]).toBeDefined();
    expect(screen.getAllByText(/Consola de Comandos/i)[0]).toBeDefined();
    expect(screen.getAllByText(/Despliegue VM & SQL Server/i)[0]).toBeDefined();
  });

  it('should allow switching between tabs', () => {
    render(
      <LanguageProvider>
        <BrowserRouter>
          <SmartPlant3DLab />
        </BrowserRouter>
      </LanguageProvider>
    );

    const pinpointTabBtns = screen.getAllByText(/Entrenador PinPoint/i);
    fireEvent.click(pinpointTabBtns[0]);
    expect(screen.getAllByText(/Simulador Interactivo de Coordenadas PinPoint/i)[0]).toBeDefined();

    const curriculumTabBtns = screen.getAllByText(/Academia/i);
    fireEvent.click(curriculumTabBtns[0]);
    expect(screen.getAllByText(/LABORATORIO/i)[0]).toBeDefined();

    const deploymentTabBtns = screen.getAllByText(/Despliegue VM & SQL Server/i);
    fireEvent.click(deploymentTabBtns[0]);
    expect(screen.getAllByText(/VMware Workstation/i)[0]).toBeDefined();
  });
});

import SmartPlant3DInteractiveMasterLab from '../pages/blog/SmartPlant3DInteractiveMasterLab';

describe('SmartPlant 3D Blog Post & Manual Request Component', () => {
  it('should render article hero, stats, and manual request section', () => {
    render(
      <LanguageProvider>
        <BrowserRouter>
          <SmartPlant3DInteractiveMasterLab />
        </BrowserRouter>
      </LanguageProvider>
    );

    expect(screen.getAllByText(/SmartPlant 3D \(SP3D\) MasterLab/i)[0]).toBeDefined();
    expect(screen.getAllByText(/Setup Tradicional VM/i)[0]).toBeDefined();
    expect(screen.getAllByText(/Acceso a la Boveda de Manuales y Videos/i)[0]).toBeDefined();
    expect(screen.getAllByText(/Solicitar Acceso a la Carpeta Drive/i)[0]).toBeDefined();
  });

  it('should allow submitting manual access request form', () => {
    render(
      <LanguageProvider>
        <BrowserRouter>
          <SmartPlant3DInteractiveMasterLab />
        </BrowserRouter>
      </LanguageProvider>
    );

    const submitButtons = screen.getAllByText(/Solicitar Acceso a la Carpeta Drive/i);
    expect(submitButtons.length).toBeGreaterThan(0);
  });
});
