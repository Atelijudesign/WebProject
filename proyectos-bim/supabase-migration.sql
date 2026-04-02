-- =====================================================
-- SUPABASE MIGRATION: Proyectos BIM
-- Run this ONCE in Supabase SQL Editor (supabase.com → SQL Editor)
-- =====================================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS proyectos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  client TEXT DEFAULT '–',
  company TEXT NOT NULL,
  country TEXT DEFAULT 'Chile',
  city TEXT DEFAULT '',
  period TEXT DEFAULT '',
  year_start INTEGER,
  year_end INTEGER,
  project_type TEXT DEFAULT '',
  material TEXT DEFAULT '',
  role TEXT DEFAULT 'Proyectista Estructural',
  software TEXT DEFAULT '',
  status TEXT DEFAULT 'Completado' CHECK (status IN ('Completado', 'En Curso')),
  description TEXT DEFAULT '',
  activities TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Anyone can READ (public dashboard)
CREATE POLICY "public_read" ON proyectos
  FOR SELECT
  USING (true);

-- 4. Policy: Only authenticated users can INSERT
CREATE POLICY "auth_insert" ON proyectos
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 5. Policy: Only authenticated users can UPDATE
CREATE POLICY "auth_update" ON proyectos
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 6. Policy: Only authenticated users can DELETE
CREATE POLICY "auth_delete" ON proyectos
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- 7. Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON proyectos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. Create index for common queries
CREATE INDEX IF NOT EXISTS idx_proyectos_company ON proyectos(company);
CREATE INDEX IF NOT EXISTS idx_proyectos_status ON proyectos(status);
CREATE INDEX IF NOT EXISTS idx_proyectos_year ON proyectos(year_start, year_end);

-- 9. Insert all 46 projects
INSERT INTO proyectos (project_id, name, client, company, country, city, period, year_start, year_end, project_type, material, role, software, status, description, activities) VALUES
('P-046', 'Proyecto Atrio Sur (OT-1301)', '–', 'BIOS MI', 'Chile', 'Santiago', 'Ene 2012–Dic 2014', 2012, 2013, 'Edificación / Comercial', 'Acero Estructural', 'Proyectista Estructural', 'Tekla Structures', 'Completado', 'Fabricación de estructuras metálicas para Atrio Sur. Planos de taller (singles, conjuntos, montaje).', 'Planos singles, conjuntos y montaje; listado de materiales; visitas a terreno'),
('P-045', 'Proyecto Desaladora Santo Domingo – Estanques GRP', 'Acciona', 'BIOS MI', 'Chile', 'Santo Domingo', 'Feb 2025–Presente', 2025, 2025, 'Industrial / Desalinización', 'Acero + Hormigón', 'Proyectista Estructural', 'Revit Structure', 'En Curso', 'Ingeniería de detalles para estanques GRP de la planta desaladora de Santo Domingo.', 'Modelado BIM, planos estructurales, cubicaciones, coordinación especialidades'),
('P-044', 'Proyecto Minero Arqueros (Fase Factibilidad)', 'Teck Resources', 'Black & Veatch', 'Chile', 'Coquimbo', 'Dic 2024–May 2025', 2024, 2025, 'Minería / Cobre-Oro', 'Acero Estructural', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Factibilidad de infraestructura estructural para proyecto minero Arqueros de Teck.', 'Modelado BIM, planos estructurales, cubicaciones'),
('P-043', 'Ampliación Planta Desaladora Antofagasta – BHP', 'BHP', 'Arcadis', 'Chile', 'Antofagasta', 'Jun 2024–Nov 2024', 2024, 2024, 'Industrial / Desalinización', 'Acero + Hormigón', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Ampliación de planta desaladora para operaciones BHP en Antofagasta.', 'Modelado BIM, planos estructurales, cubicaciones, coordinación especialidades'),
('P-042', 'CMPC – Máquina Papelera MP21', 'CMPC', 'AFRY', 'Chile', 'Nacimiento, Bío Bío', 'Dic 2022–May 2024', 2022, 2024, 'Industrial / Manufactura', 'Acero + Hormigón', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Ingeniería de detalles para nueva máquina papelera MP21 en planta CMPC Nacimiento.', 'Modelado BIM estructura y arquitectura, conexiones metálicas, planos detalle'),
('P-041', 'Celulosa Arauco – Línea de Fibra MAPA', 'Arauco', 'AFRY', 'Chile', 'Arauco, Bío Bío', 'Dic 2022–May 2024', 2022, 2024, 'Industrial / Celulosa', 'Acero + Hormigón', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Ingeniería de detalles para línea de fibra del proyecto MAPA, Celulosa Arauco.', 'Modelado BIM estructura y arquitectura, conexiones metálicas, planos detalle'),
('P-040', 'Minera Alumbrera (YMAD) – Infraestructura Planta', 'YMAD', 'AFRY', 'Argentina', 'Catamarca', 'Dic 2022–May 2024', 2022, 2024, 'Minería / Cobre-Oro', 'Acero + Hormigón', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Infraestructura estructural para planta de procesamiento minero Alumbrera.', 'Modelado BIM estructura y arquitectura, conexiones metálicas, planos detalle'),
('P-039', 'Cervecería Heineken – Planta Meoqui', 'Heineken', 'AFRY', 'México', 'Meoqui, Chihuahua', 'Dic 2022–May 2024', 2022, 2024, 'Industrial / Alimentos y Bebidas', 'Acero + Hormigón', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Ingeniería de detalles para ampliación de planta cervecera Heineken en Meoqui.', 'Modelado BIM estructura y arquitectura, conexiones metálicas, planos detalle'),
('P-038', 'CMPC – Continuidad Operaciones Bio Bio', 'CMPC', 'AFRY', 'Chile', 'Nacimiento, Bío Bío', 'Dic 2022–May 2024', 2022, 2024, 'Industrial / Manufactura', 'Acero + Hormigón', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Continuidad de operaciones en planta papelera CMPC Bío Bío. Ingeniería estructural.', 'Modelado BIM estructura y arquitectura, conexiones metálicas, planos detalle'),
('P-037', 'CMPC – Máquina Papelera MP23', 'CMPC', 'AFRY', 'Chile', 'Puente Alto, Santiago', 'Dic 2022–May 2024', 2022, 2024, 'Industrial / Manufactura', 'Acero + Hormigón', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Ingeniería de detalles para nueva línea de producción MP23 en planta CMPC Puente Alto.', 'Modelado BIM estructura y arquitectura, conexiones metálicas, planos detalle'),
('P-036', 'CMPC – Continuidad Operaciones Planta de Laja', 'CMPC', 'AFRY', 'Chile', 'Laja, Bío Bío', 'Dic 2022–May 2024', 2022, 2024, 'Industrial / Manufactura', 'Acero + Hormigón', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Continuidad de operaciones e integridad de activos para planta papelera CMPC en Laja.', 'Modelado BIM estructura y arquitectura, conexiones metálicas, planos detalle'),
('P-035', 'Pasarela La Finca', 'MOP / SERVIU', 'Sincal', 'Chile', 'Región Metropolitana', 'Ene 2021–Dic 2022', 2021, 2022, 'Infraestructura / Pasarela Peatonal', 'Acero + Hormigón', 'Proyectista Estructural', 'Tekla Structures, Navisworks', 'Completado', 'Modelado estructural detallado de pasarela peatonal en hormigón y acero. Cubicación y planos estructurales.', 'Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales'),
('P-034', 'Pasarela Paine', 'MOP / SERVIU', 'Sincal', 'Chile', 'Paine, R.M.', 'Ene 2021–Dic 2022', 2021, 2022, 'Infraestructura / Pasarela Peatonal', 'Acero + Hormigón', 'Proyectista Estructural', 'Tekla Structures, Navisworks', 'Completado', 'Modelado y detallado de pasarela peatonal para la comuna de Paine.', 'Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales'),
('P-033', 'Pasarela El Retiro', 'MOP / SERVIU', 'Sincal', 'Chile', 'Región Metropolitana', 'Ene 2021–Dic 2022', 2021, 2022, 'Infraestructura / Pasarela Peatonal', 'Acero + Hormigón', 'Proyectista Estructural', 'Tekla Structures, Navisworks', 'Completado', 'Modelado y detallado de pasarela peatonal El Retiro.', 'Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales'),
('P-032', 'Pasarela Campamento 4', 'MOP / SERVIU', 'Sincal', 'Chile', 'Región Metropolitana', 'Ene 2021–Dic 2022', 2021, 2022, 'Infraestructura / Pasarela Peatonal', 'Acero + Hormigón', 'Proyectista Estructural', 'Tekla Structures, Navisworks', 'Completado', 'Modelado y detallado de pasarela peatonal Campamento 4.', 'Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales'),
('P-031', 'Pasarela Cerrillos', 'MOP / SERVIU', 'Sincal', 'Chile', 'Cerrillos, R.M.', 'Ene 2021–Dic 2022', 2021, 2022, 'Infraestructura / Pasarela Peatonal', 'Acero + Hormigón', 'Proyectista Estructural', 'Tekla Structures, Navisworks', 'Completado', 'Modelado y detallado de pasarela peatonal Cerrillos.', 'Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales'),
('P-030', 'Pasarela Las Miras Norte', 'MOP / SERVIU', 'Sincal', 'Chile', 'Región Metropolitana', 'Ene 2021–Dic 2022', 2021, 2022, 'Infraestructura / Pasarela Peatonal', 'Acero + Hormigón', 'Proyectista Estructural', 'Tekla Structures, Navisworks', 'Completado', 'Modelado y detallado de pasarela peatonal Las Miras Norte.', 'Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales'),
('P-029', 'Pasarela Copihue', 'MOP / SERVIU', 'Sincal', 'Chile', 'Región Metropolitana', 'Ene 2021–Dic 2022', 2021, 2022, 'Infraestructura / Pasarela Peatonal', 'Acero + Hormigón', 'Proyectista Estructural', 'Tekla Structures, Navisworks', 'Completado', 'Modelado y detallado de pasarela peatonal Copihue.', 'Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales'),
('P-028', 'Pasarela Longaví', 'MOP / SERVIU', 'Sincal', 'Chile', 'Longaví, Maule', 'Ene 2021–Dic 2022', 2021, 2022, 'Infraestructura / Pasarela Peatonal', 'Acero + Hormigón', 'Proyectista Estructural', 'Tekla Structures, Navisworks', 'Completado', 'Modelado y detallado de pasarela peatonal Longaví.', 'Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales'),
('P-027', 'Pasarela Gaona', 'MOP / SERVIU', 'Sincal', 'Chile', 'Región Metropolitana', 'Ene 2021–Dic 2022', 2021, 2022, 'Infraestructura / Pasarela Peatonal', 'Acero + Hormigón', 'Proyectista Estructural', 'Tekla Structures, Navisworks', 'Completado', 'Modelado y detallado de pasarela peatonal Gaona.', 'Modelado estructural Tekla, detallado refuerzos y conexiones, cubicación materiales, planos estructurales'),
('P-026', 'Aeropuerto AMB – Terminal 2 T2M', 'SCL Terminal / DGAC', 'CJV Construction', 'Chile', 'Santiago', 'Ene 2018–Mar 2019', 2018, 2019, 'Infraestructura / Aviación', 'Acero Estructural', 'Proyectista Estructural', 'Revit Structure, Navisworks', 'Completado', 'Modelado BIM de estructuras metálicas del Terminal 2 del Aeropuerto Internacional Arturo Merino Benítez (320.000 m²).', 'Modelado BIM estructura y arquitectura, conexiones metálicas Revit, planos ingeniería detalle, visitas terreno'),
('P-025', 'Aeropuerto AMB – Espigón T2D (1)', 'SCL Terminal / DGAC', 'CJV Construction', 'Chile', 'Santiago', 'Ene 2018–Mar 2019', 2018, 2019, 'Infraestructura / Aviación', 'Acero Estructural', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Modelado de espigón T2D del nuevo Terminal 2, Aeropuerto AMB.', 'Modelado BIM estructuras metálicas, conexiones en Revit, planos de detalle'),
('P-024', 'Aeropuerto AMB – Espigón T2F', 'SCL Terminal / DGAC', 'CJV Construction', 'Chile', 'Santiago', 'Ene 2018–Mar 2019', 2018, 2019, 'Infraestructura / Aviación', 'Acero Estructural', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Modelado de espigón T2F del nuevo Terminal 2, Aeropuerto AMB.', 'Modelado BIM estructuras metálicas, conexiones en Revit, planos de detalle'),
('P-023', 'Aeropuerto AMB – Espigón T2D (2)', 'SCL Terminal / DGAC', 'CJV Construction', 'Chile', 'Santiago', 'Ene 2018–Mar 2019', 2018, 2019, 'Infraestructura / Aviación', 'Acero Estructural', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Modelado de segundo espigón T2D, Aeropuerto AMB.', 'Modelado BIM estructuras metálicas, conexiones en Revit, planos de detalle'),
('P-022', 'Aeropuerto AMB – Desmontaje Torre Grúa 11', 'SCL Terminal / DGAC', 'CJV Construction', 'Chile', 'Santiago', 'Ene 2018–Mar 2019', 2018, 2019, 'Infraestructura / Aviación', 'Acero Estructural', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Ingeniería y documentación para desmontaje de torre grúa N°11 en obra AMB.', 'Modelado BIM, planos desmontaje, documentación detalle'),
('P-021', 'Aeropuerto AMB – Estacionamiento Poniente', 'SCL Terminal / DGAC', 'CJV Construction', 'Chile', 'Santiago', 'Ene 2018–Mar 2019', 2018, 2019, 'Infraestructura / Aviación', 'Hormigón Armado', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Modelado BIM del estacionamiento poniente del nuevo Terminal 2.', 'Modelado BIM, planos de ingeniería de detalle'),
('P-020', 'Aeropuerto AMB – Estacionamiento Sur', 'SCL Terminal / DGAC', 'CJV Construction', 'Chile', 'Santiago', 'Ene 2018–Mar 2019', 2018, 2019, 'Infraestructura / Aviación', 'Hormigón Armado', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Modelado BIM del estacionamiento sur del nuevo Terminal 2.', 'Modelado BIM, planos de ingeniería de detalle'),
('P-019', 'Nuevo Complejo Fronterizo Los Libertadores', 'MOP Chile', 'Sirve', 'Chile', 'Los Andes', 'May 2015–Sep 2017', 2015, 2017, 'Infraestructura / Fronterizo', 'Acero + Hormigón', 'Proyectista Estructural', 'Revit Structure, Tekla Structures, Navisworks', 'Completado', 'Modelado BIM de estructuras para el nuevo complejo fronterizo Los Libertadores (~35.000 m²).', 'Modelado BIM estructura y arquitectura, conexiones Tekla, planos detalle, coordinación especialidades'),
('P-018', 'Hospital Marga Marga', 'Ministerio de Salud', 'Sirve', 'Chile', 'Quilpué', 'May 2015–Sep 2017', 2015, 2017, 'Edificación / Salud', 'Hormigón Armado', 'Proyectista Estructural', 'Revit Structure, Tekla Structures', 'Completado', 'Modelado BIM estructural de hospital público de alta complejidad.', 'Modelado BIM estructura y arquitectura, conexiones metálicas, planos detalle, coordinación interdisciplinaria'),
('P-017', 'Hospital Dr. Gustavo Fricke', 'Ministerio de Salud', 'Sirve', 'Chile', 'Viña del Mar', 'May 2015–Sep 2017', 2015, 2017, 'Edificación / Salud', 'Hormigón Armado', 'Proyectista Estructural', 'Revit Structure, Tekla Structures', 'Completado', 'Modelado BIM estructural de hospital, coordinación interdisciplinaria de especialidades.', 'Modelado BIM, conexiones metálicas, planos detalle, coordinación especialidades'),
('P-016', 'Hospital Felix Bulnes', 'Ministerio de Salud', 'Sirve', 'Chile', 'Santiago', 'May 2015–Sep 2017', 2015, 2017, 'Edificación / Salud', 'Hormigón Armado', 'Proyectista Estructural', 'Revit Structure, Tekla Structures', 'Completado', 'Modelado BIM estructural de hospital Felix Bulnes, coordinación multidisciplina.', 'Modelado BIM, conexiones metálicas, planos detalle, coordinación especialidades'),
('P-015', 'Metro L3 – Máquina de Lavado (L3-359)', 'Metro de Santiago', 'TYPSA', 'Chile', 'Santiago', 'Mar 2014–Mar 2015', 2014, 2015, 'Infraestructura / Metro', 'Hormigón Armado', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Ingeniería de detalles para caseta de máquina de lavado, Línea 3 Metro de Santiago.', 'Modelado BIM, planos estructurales, cubicaciones'),
('P-014', 'Metro L3 – Casetas Seguridad Norte 1 (L3-362)', 'Metro de Santiago', 'TYPSA', 'Chile', 'Santiago', 'Mar 2014–Mar 2015', 2014, 2015, 'Infraestructura / Metro', 'Hormigón Armado', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Ingeniería de detalles para casetas de seguridad norte, Línea 3.', 'Modelado BIM, planos estructurales, cubicaciones'),
('P-013', 'Metro L3 – Caseta de Tracción (L3-363)', 'Metro de Santiago', 'TYPSA', 'Chile', 'Santiago', 'Mar 2014–Mar 2015', 2014, 2015, 'Infraestructura / Metro', 'Hormigón Armado', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Ingeniería de detalles caseta de tracción Línea 3.', 'Modelado BIM, planos estructurales, cubicaciones'),
('P-012', 'Metro L3 – Estanque Agua Regenerada (L3-363)', 'Metro de Santiago', 'TYPSA', 'Chile', 'Santiago', 'Mar 2014–Mar 2015', 2014, 2015, 'Infraestructura / Metro', 'Hormigón Armado', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Ingeniería de detalles estanque agua regenerada Línea 3.', 'Modelado BIM, planos estructurales, cubicaciones'),
('P-011', 'Metro L3 – Edificio Compresores (L3-368)', 'Metro de Santiago', 'TYPSA', 'Chile', 'Santiago', 'Mar 2014–Mar 2015', 2014, 2015, 'Infraestructura / Metro', 'Hormigón Armado', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Ingeniería de detalles edificio de compresores Línea 3.', 'Modelado BIM, planos estructurales, cubicaciones'),
('P-010', 'Metro L3 – Edificio Lubricantes (L3-369)', 'Metro de Santiago', 'TYPSA', 'Chile', 'Santiago', 'Mar 2014–Mar 2015', 2014, 2015, 'Infraestructura / Metro', 'Hormigón Armado', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Ingeniería de detalles edificio de lubricantes Línea 3.', 'Modelado BIM, planos estructurales, cubicaciones'),
('P-009', 'Metro L6 – Bodega Residuos Peligrosos (L6-860)', 'Metro de Santiago', 'TYPSA', 'Chile', 'Santiago', 'Mar 2014–Mar 2015', 2014, 2015, 'Infraestructura / Metro', 'Hormigón Armado', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Ingeniería de detalles bodega de residuos peligrosos Línea 6.', 'Modelado BIM, planos estructurales, cubicaciones'),
('P-008', 'Metro L6 – Sala de Compresores (L6-868)', 'Metro de Santiago', 'TYPSA', 'Chile', 'Santiago', 'Mar 2014–Mar 2015', 2014, 2015, 'Infraestructura / Metro', 'Hormigón Armado', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Ingeniería de detalles sala de compresores Línea 6.', 'Modelado BIM, planos estructurales, cubicaciones'),
('P-007', 'Metro L6 – Bodega de Lubricantes (L6-869)', 'Metro de Santiago', 'TYPSA', 'Chile', 'Santiago', 'Mar 2014–Mar 2015', 2014, 2015, 'Infraestructura / Metro', 'Hormigón Armado', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Ingeniería de detalles bodega de lubricantes Línea 6.', 'Modelado BIM, planos estructurales, cubicaciones'),
('P-006', 'Proyecto Hidroeléctrico Los Cóndores (OH1737)', 'EMB / Enel', 'TYPSA', 'Chile', 'Talca, Maule', 'Mar 2014–Mar 2015', 2014, 2015, 'Energía / Hidroeléctrica', 'Hormigón Armado', 'Proyectista Estructural', 'Revit Structure', 'Completado', 'Ingeniería de detalles para proyecto hidroeléctrico Los Cóndores en el Maule.', 'Modelado BIM, planos estructurales, cubicaciones, coordinación especialidades'),
('P-005', 'Proyecto Atrio Sur (OT-1301)', '–', 'JQ Proyectos', 'Chile', 'Santiago', 'Ene 2012–Dic 2013', 2012, 2013, 'Edificación / Comercial', 'Acero Estructural', 'Proyectista Estructural', 'Tekla Structures', 'Completado', 'Fabricación de estructuras metálicas para Atrio Sur. Planos de taller (singles, conjuntos, montaje).', 'Planos singles, conjuntos y montaje; listado de materiales; visitas a terreno'),
('P-004', 'Casino Costanera Norte (OT-1302)', '–', 'JQ Proyectos', 'Chile', 'Santiago', 'Ene 2012–Dic 2013', 2012, 2013, 'Edificación / Entretenimiento', 'Acero Estructural', 'Proyectista Estructural', 'Tekla Structures', 'Completado', 'Fabricación de estructuras metálicas para Casino Costanera Norte.', 'Planos singles, conjuntos y montaje; listado de materiales; visitas a terreno'),
('P-003', 'Viga Puente (OT-1303)', '–', 'JQ Proyectos', 'Chile', 'Santiago', 'Ene 2012–Dic 2013', 2012, 2013, 'Infraestructura / Vial', 'Acero Estructural', 'Proyectista Estructural', 'Tekla Structures', 'Completado', 'Fabricación de vigas de puente metálico; planos de taller con Tekla Structures.', 'Planos singles, conjuntos y montaje; listado de materiales'),
('P-002', 'Ingeniería Detalles Edificio Quitmetal', 'Quitmetal', 'FUSI', 'Chile', 'Santiago', 'Ene 2010–Dic 2011', 2010, 2011, 'Edificación / Industrial', 'Acero Estructural', 'Proyectista Estructural', 'Tekla Structures', 'Completado', 'Planos de fabricación de estructura metálica para edificio industrial Quitmetal.', 'Planos singles, conjuntos y montaje; listado de materiales; visitas a terreno'),
('P-001', 'Planimetría Arquitectura Municipal – Práctica Profesional', 'I. Municipalidad de Lampa', 'I. Municipalidad de Lampa', 'Chile', 'Lampa', 'Ene–May 2006', 2006, 2006, 'Edificación / Municipal', '–', 'Dibujante Técnico (Práctica)', 'AutoCAD', 'Completado', 'Práctica profesional para titulación como Dibujante Técnico. Apoyo al área de arquitectura.', 'Desarrollo de planimetría arquitectónica')
ON CONFLICT (project_id) DO NOTHING;
