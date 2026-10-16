/**
 * Master Architectural Barrel - WebProject Core Layer
 * Expone de forma unificada y modular los subsistemas de dominio:
 * - Exportación & Estrategias (DXF, PDF, Excel)
 * - Motores de Cálculo de Ingeniería (Escaleras, Búsqueda de Perfiles)
 * - Máquina de Estados del Visor IFC
 * - Gestión de Estado del Constructor ATS
 */

export * from './export';
export * from './calculators';
export * from './ifc';
export * from './cv';
