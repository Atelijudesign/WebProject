import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";

export default function PyRevitVolumen() {
 
 const chartRef = useRef(null);
 useEffect(() => {
 if (!chartRef.current) return;
 const ctx = chartRef.current.getContext("2d");
 const chart = new Chart(ctx, {
 type: "bar",
 data: {
 labels: ["Exportar\ndatos", "Clasificar\nmateriales", "Calcular\npesos", "Verificar\nresultados", "Total"],
 datasets: [
 { label: "Manual (minutos)", data: [20, 45, 40, 15, 120], backgroundColor: "rgba(239,68,68,0.7)", borderColor: "rgba(239,68,68,1)", borderWidth: 1, borderRadius: 6 },
 { label: "Plugin pyRevit (~0 min)", data: [0, 0, 0, 0.17, 0.17], backgroundColor: "rgba(34,197,94,0.7)", borderColor: "rgba(34,197,94,1)", borderWidth: 1, borderRadius: 6 }
 ]
 },
 options: {
 responsive: true, maintainAspectRatio: false,
 scales: { y: { beginAtZero: true, grid: { color: "#1f2937" }, ticks: { color: "#9ca3af", callback: v => v + " min" } }, x: { grid: { color: "#1f2937" }, ticks: { color: "#9ca3af" } } },
 plugins: { legend: { position: "bottom", labels: { color: "#9ca3af", padding: 16 } } }
 }
 });
 return () => chart.destroy();
 }, []);
 

 const copyBlock = (e) => {
 const pre = e.target.closest('.code-block').querySelector('pre');
 navigator.clipboard.writeText(pre.innerText.trim()).then(() => {
 e.target.textContent = '✓ Copiado';
 setTimeout(() => e.target.textContent = 'Copiar', 2000);
 });
 };

 return (
 <div className="bg-bim-dark min-h-screen transition-colors duration-300">
 <section className="pt-28 pb-16 px-4 bg-[#030712]/40 transition-colors duration-300 relative overflow-hidden">
 <div className="absolute inset-0 opacity-5">
 <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl"></div>
 <div className="absolute bottom-10 right-10 w-96 h-96 bg-bim-blue rounded-full blur-3xl"></div>
 </div>
 <div className="max-w-4xl mx-auto text-center relative z-10">
 <div className="mb-6">
 <Link to="/blog" className="text-bim-blue hover:text-blue-400 text-sm font-medium transition-colors">
 <i className="fa-solid fa-arrow-left mr-1"></i> Volver al Blog
 </Link>
 </div>
 <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
 <span className="bg-orange-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
 <i className="fa-solid fa-weight-hanging mr-1"></i> Plugin BIM
 </span>
 <span className="bg-green-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
 <i className="fa-brands fa-python mr-1"></i> pyRevit
 </span>
 <span className="text-gray-400 text-sm"><i className="fa-regular fa-calendar mr-1"></i> 22 Mar 2026</span>
 <span className="text-gray-400 text-sm"><i className="fa-regular fa-clock mr-1"></i> 12 min lectura</span>
 </div>
 <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
 <span className="text-5xl">⚖️</span> Cubicación Automática en Revit con
 <span className="text-gradient-article">pyRevit y Python</span>
 </h1>
 <p className="text-lg text-slate-400 max-w-2xl mx-auto">
 Calcular cubicaciones en Revit siempre fue un proceso que me molestó. Exportabas a Excel, filtrabas a mano, y si el modelo cambiaba — cosa que siempre pasa — volvías a empezar. En este artículo te muestro cómo construí un script que resuelve eso en 10 segundos.
 </p>
 </div>
 </section>
{/* Article Content */}
 <section className="py-12 bg-[#0b1220]/60 transition-colors duration-300">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">
{/* Stats Banner */}
 <div className="grid grid-cols-3 gap-4 mb-10">
 <div className="stat-card glass-card rounded-2xl p-6 border border-slate-800/60 text-center">
 <p className="text-4xl font-extrabold text-red-400 mb-1">2 h</p>
 <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Proceso manual</p>
 </div>
 <div className="stat-card glass-card rounded-2xl p-6 border border-bim-blue text-center">
 <p className="text-4xl font-extrabold text-green-400 mb-1">10 s</p>
 <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Con el plugin</p>
 </div>
 <div className="stat-card glass-card rounded-2xl p-6 border border-slate-800/60 text-center">
 <p className="text-4xl font-extrabold text-bim-blue mb-1">720x</p>
 <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Más rápido</p>
 </div>
 </div>
{/* El Problema */}
 <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
 <h3 className="text-2xl font-extrabold text-white mb-4">
 <i className="fa-solid fa-triangle-exclamation text-red-400 mr-2"></i>
 El Problema Real
 </h3>
 <p className="text-slate-400">
 El flujo clásico de cubicación en cualquier oficina de proyectos se ve más o menos así: abres una vista en Revit, exportas una planilla de cantidades, la abres en Excel, filtras por tipo de material, calculas los pesos con fórmulas que alguien hizo hace tres años y nadie sabe si son correctas, y al final generas un reporte.
 </p>
 <p className="text-slate-400">
 El problema no es que sea lento — aunque lo es. El problema es que <strong className="text-white">el modelo y la planilla se desconectan desde el momento en que exportas</strong>. Cualquier cambio en el modelo requiere repetir todo el proceso desde cero.
 </p>
 <div className="callout callout-orange">
 <div className="callout-label">💡 El costo real</div>
 <p className="text-gray-400 text-sm">En un proyecto de mediana envergadura, un ciclo completo de cubicación manual puede tomar entre 2 y 4 horas. Si el modelo cambia dos veces a la semana — lo cual es normal — estás gastando casi un día completo en extraer datos que ya existen en el modelo. <strong className="text-gray-200">La solución no es trabajar más rápido. Es no hacer ese trabajo en absoluto.</strong></p>
 </div>
 </div>
 {/* ¿Qué hace el script */}
 <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
 <h3 className="text-2xl font-extrabold text-white mb-4">
 <i className="fa-solid fa-wand-magic-sparkles text-green-400 mr-2"></i>
 ¿Qué Hace el Script
 </h3>
 <p className="text-slate-400">
 El script extrae directamente desde el modelo Revit, a través de su API, toda la información necesaria para generar una cubicación completa de acero y HORMIGÓN. Sin exportar nada, sin abrir Excel, sin fórmulas manuales.
 </p>
 <ul className="space-y-2 text-slate-400 text-sm">
 <li className="flex items-start gap-2"><span className="text-bim-blue mt-1"><i className="fa-solid fa-check"></i></span><span><strong className="text-gray-200">Detecta el material automáticamente</strong> — lee la propiedad de material de cada elemento estructural y determina si es acero u HORMIGÓN.</span></li>
 <li className="flex items-start gap-2"><span className="text-bim-blue mt-1"><i className="fa-solid fa-check"></i></span><span><strong className="text-gray-200">Extrae el volumen real</strong> — usa el parámetro de volumen calculado por Revit, no una estimación.</span></li>
 <li className="flex items-start gap-2"><span className="text-bim-blue mt-1"><i className="fa-solid fa-check"></i></span><span><strong className="text-gray-200">Calcula el peso con densidad real</strong> — aplica 7.850 kg/m³ para acero y 2.400 kg/m³ para HORMIGÓN por defecto, con valores configurables.</span></li>
 <li className="flex items-start gap-2"><span className="text-bim-blue mt-1"><i className="fa-solid fa-check"></i></span><span><strong className="text-gray-200">Clasifica el acero por Nominal Weight</strong> — Liviana, Media, Pesada y Extrapesada según el peso lineal del perfil.</span></li>
 <li className="flex items-start gap-2"><span className="text-bim-blue mt-1"><i className="fa-solid fa-check"></i></span><span><strong className="text-gray-200">Agrega factor de conexiones</strong> — un porcentaje configurable que se suma al peso total de acero.</span></li>
 <li className="flex items-start gap-2"><span className="text-bim-blue mt-1"><i className="fa-solid fa-check"></i></span><span><strong className="text-gray-200">Muestra el reporte en consola</strong> — tablas interactivas en pyRevit, sin abrir ningún archivo externo.</span></li>
 </ul>
 </div>
{/* Prerrequisitos */}
 <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
 <h3 className="text-2xl font-extrabold text-white mb-4">
 <i className="fa-solid fa-list-check text-bim-blue mr-2"></i>
 Prerrequisitos
 </h3>
 <ul className="space-y-2 text-slate-400 text-sm mb-4">
 <li className="flex items-start gap-2"><span className="text-orange-400 mt-1"><i className="fa-solid fa-circle-dot"></i></span><span><strong className="text-gray-200">Revit 2022 o superior</strong> — el script fue probado en 2024 y 2025.</span></li>
 <li className="flex items-start gap-2"><span className="text-orange-400 mt-1"><i className="fa-solid fa-circle-dot"></i></span><span><strong className="text-gray-200">pyRevit 4.8+</strong> — descárgalo desde <span className="ic">github.com/eirannejad/pyRevit</span>.</span></li>
 <li className="flex items-start gap-2"><span className="text-orange-400 mt-1"><i className="fa-solid fa-circle-dot"></i></span><span><strong className="text-gray-200">Un modelo estructural activo</strong> — con elementos de categoría Framing o Columns con materiales asignados.</span></li>
 </ul>
 <div className="callout">
 <div className="callout-label">💡 Nota</div>
 <p className="text-gray-400 text-sm">No necesitas saber Python para usar este script. El tutorial te explica dónde poner cada archivo. Si quieres entender cómo funciona el código, las secciones de explicación son para ti.</p>
 </div>
 </div>
{/* Paso a Paso */}
 <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
 <h3 className="text-2xl font-extrabold text-white mb-6">
 <i className="fa-solid fa-list-ol text-bim-blue mr-2"></i>
 Paso a Paso
 </h3>
<div className="steps-list">
 {/* Step 1 */}
 <div className="step-item">
 <div className="step-num">1</div>
 <div className="step-body">
 <div className="step-title">Crea la estructura de carpetas</div>
 <div className="step-desc">pyRevit convierte carpetas en botones automáticamente. La estructura de nombres es el único "framework" que necesitas entender.</div>
 </div>
 </div>
 </div>
<div className="folder-tree mb-6">
            <span className="ft-folder">AG_Tools.extension/</span>      <span className="ft-comment"># Carpeta principal de la extensión</span><br />
            &nbsp;&nbsp;<span className="ft-folder">Cubicación.tab/</span>      <span className="ft-comment"># Pestaña personalizada en el ribbon de Revit</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="ft-folder">Reportes.panel/</span>  <span className="ft-comment"># Panel de herramientas</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="ft-folder">Cubicacion.pushbutton/</span> <span className="ft-comment"># Botón de ejecución del plugin</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="ft-file">script.py</span>   <span className="ft-comment"># Script de Python con el código fuente</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="ft-file">icon.png</span>    <span className="ft-comment"># Ícono del botón (opcional, 32x32 px)</span>
          </div>
<div className="steps-list">
 {/* Step 2 */}
 <div className="step-item">
 <div className="step-num">2</div>
 <div className="step-body">
 <div className="step-title">Crea el archivo <span className="ic">script.py</span></div>
 <div className="step-desc">Dentro de la carpeta <span className="ic">Cubicacion.pushbutton/</span>, crea un archivo llamado exactamente <span className="ic">script.py</span> y pega el código completo de la siguiente sección.</div>
 </div>
 </div>
 </div>
 </div>
{/* Script Completo */}
 <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl"></div>
 <h3 className="text-2xl font-extrabold text-white mb-2 relative z-10">
 <i className="fa-brands fa-python text-green-400 mr-2"></i>
 Código Completo
 </h3>
 <p className="text-slate-400 mb-5 relative z-10 text-sm">Script listo para producción. Cópialo directamente en tu <span className="ic">script.py</span>:</p>
 <div className="code-block relative z-10">
 <div className="code-header">
 <span className="code-lang">Python · pyRevit</span>
 <button className="code-copy" onClick={(e) => copyBlock(e)}>Copiar</button>
 </div>
 <pre id="codigo-principal">{`# -*- coding: utf-8 -*-
# Cubicación Automática — Andrés Gallo P.
# atelijudesign.com

import clr
clr.AddReference('RevitAPI')
clr.AddReference('RevitAPIUI')

from Autodesk.Revit.DB import (
    FilteredElementCollector,
    BuiltInCategory,
    BuiltInParameter,
    UnitUtils,
    UnitTypeId
)
from pyrevit import revit, DB, forms, script

# ─── CONFIGURACIÓN ──────────────────────────────────────────────
DENSIDAD_ACERO    = 7850   # kg/m³
DENSIDAD_HORMIGON = 2400   # kg/m³
FACTOR_CONEXIONES = 0.05   # 5% por defecto — ajústalo según proyecto

# Clasificación Nominal Weight (kg/m)
CLASES_NW = [
    (0,   20,  "Liviana"),
    (20,  40,  "Media"),
    (40,  80,  "Pesada"),
    (80,  9999, "Extrapesada"),
]

# ─── FUNCIONES AUXILIARES ────────────────────────────────────────
def m3_a_kg(volumen_m3, densidad):
    """Convierte volumen en m³ a kilogramos."""
    return volumen_m3 * densidad

def clasificar_nw(peso_lineal_kg_m):
    """Clasifica un perfil por Nominal Weight según su peso lineal."""
    for min_nw, max_nw, nombre in CLASES_NW:
        if min_nw <= peso_lineal_kg_m < max_nw:
            return nombre
    return "Sin clasificar"

def obtener_volumen_m3(elemento):
    """Extrae el volumen del elemento en m³ desde la API de Revit."""
    try:
        param = elemento.get_Parameter(BuiltInParameter.HOST_VOLUME_COMPUTED)
        if param and param.HasValue:
            # Revit almacena en pies³ — convertimos a m³
            return UnitUtils.ConvertFromInternalUnits(
                param.AsDouble(),
                UnitTypeId.CubicMeters
            )
    except:
        pass
    return 0.0

def obtener_nombre_material(elemento):
    """Obtiene el nombre del material estructural del elemento."""
    try:
        param = elemento.get_Parameter(BuiltInParameter.STRUCTURAL_MATERIAL_PARAM)
        if param and param.HasValue:
            mat_id = param.AsElementId()
            material = elemento.Document.GetElement(mat_id)
            if material:
                return material.Name.upper()
    except:
        pass
    return ""

def es_acero(nombre_material):
    """Determina si el material es acero por palabras clave."""
    keywords = ["ACERO", "STEEL", "A36", "A572", "A992", "ER70", "METAL"]
    return any(k in nombre_material for k in keywords)

def es_hormigon(nombre_material):
    """Determina si el material es hormigón por palabras clave."""
    keywords = ["HORMIGON", "HORMIGÓN", "CONCRETE", "HA", "H20", "H25", "H30"]
    return any(k in nombre_material for k in keywords)

# ─── RECOLECCIÓN DE ELEMENTOS ────────────────────────────────────
doc = revit.doc

categorias = [
    BuiltInCategory.OST_StructuralFraming,    # vigas, diagonales
    BuiltInCategory.OST_StructuralColumns,    # columnas
    BuiltInCategory.OST_StructuralFoundation  # fundaciones
]

elementos = []
for cat in categorias:
    collector = FilteredElementCollector(doc)\\
        .OfCategory(cat)\\
        .WhereElementIsNotElementType()
    elementos.extend(list(collector))

# ─── PROCESAMIENTO ───────────────────────────────────────────────
resultado_acero   = {}   # {clase_nw: [pesos]}
total_hormigon_m3 = 0.0
elementos_sin_mat = 0

for elem in elementos:
    volumen = obtener_volumen_m3(elem)
    if volumen <= 0:
        continue

    nombre_mat = obtener_nombre_material(elem)

    if es_acero(nombre_mat):
        # Peso lineal para clasificación NW
        try:
            param_largo = elem.get_Parameter(BuiltInParameter.STRUCTURAL_FRAME_CUT_LENGTH)
            largo_m = UnitUtils.ConvertFromInternalUnits(
                param_largo.AsDouble(), UnitTypeId.Meters
            ) if param_largo and param_largo.HasValue else 1.0
        except:
            largo_m = 1.0

        peso_total_kg = m3_a_kg(volumen, DENSIDAD_ACERO)
        peso_lineal   = peso_total_kg / largo_m if largo_m > 0 else 0
        clase_nw      = clasificar_nw(peso_lineal)

        if clase_nw not in resultado_acero:
            resultado_acero[clase_nw] = []
        resultado_acero[clase_nw].append(peso_total_kg)

    elif es_hormigon(nombre_mat):
        total_hormigon_m3 += volumen

    else:
        elementos_sin_mat += 1

# ─── CÁLCULO DE TOTALES ──────────────────────────────────────────
total_acero_kg   = sum(sum(p) for p in resultado_acero.values())
total_con_conx   = total_acero_kg * (1 + FACTOR_CONEXIONES)
total_hormigon_kg = m3_a_kg(total_hormigon_m3, DENSIDAD_HORMIGON)

# ─── GENERACIÓN DEL REPORTE ──────────────────────────────────────
output = script.get_output()
output.close_others()
output.set_title("Cubicación Estructural — {}".format(doc.Title))

output.print_md("# 📊 Reporte de Cubicación Estructural")
output.print_md("**Proyecto:** {}".format(doc.Title))
output.print_md("**Elementos procesados:** {}".format(len(elementos)))
if elementos_sin_mat > 0:
    output.print_md("⚠️ **Elementos sin material asignado:** {}".format(elementos_sin_mat))

# Tabla acero por clase NW
output.print_md("---")
output.print_md("## 🔩 Acero Estructural")

tabla_acero = [["Clase NW", "N° Elementos", "Peso (kg)", "Peso (ton)"]]
for clase in ["Liviana", "Media", "Pesada", "Extrapesada"]:
    if clase in resultado_acero:
        pesos = resultado_acero[clase]
        total = sum(pesos)
        tabla_acero.append([
            clase,
            str(len(pesos)),
            "{:,.1f}".format(total),
            "{:,.2f}".format(total / 1000)
        ])

output.print_table(
    table_data=tabla_acero[1:],
    title="Clasificación por Nominal Weight",
    columns=tabla_acero[0]
)

output.print_md("**Subtotal acero:** {:,.1f} kg  ({:,.2f} ton)".format(
    total_acero_kg, total_acero_kg / 1000))
output.print_md("**Factor conexiones ({:.0f}%):** + {:,.1f} kg".format(
    FACTOR_CONEXIONES * 100, total_acero_kg * FACTOR_CONEXIONES))
output.print_md("### ✅ Total acero c/conexiones: {:,.1f} kg  ({:,.2f} ton)".format(
    total_con_conx, total_con_conx / 1000))

# Tabla hormigón
output.print_md("---")
output.print_md("## 🏗️ Hormigón Estructural")
output.print_md("**Volumen total:** {:,.2f} m³".format(total_hormigon_m3))
output.print_md("**Peso total:** {:,.1f} kg  ({:,.2f} ton)".format(
    total_hormigon_kg, total_hormigon_kg / 1000))

output.print_md("---")
output.print_md("*Generado con pyRevit · atelijudesign.com*")`}</pre>
 </div>
 </div>
{/* CONFIGURACIÓN */}
 <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
 <div className="steps-list">
 <div className="step-item">
 <div className="step-num">3</div>
 <div className="step-body w-full">
 <div className="step-title">Configura los valores de tu proyecto</div>
 <div className="step-desc mb-4">Al inicio del script hay una sección de configuración. Ajusta el porcentaje de conexiones según las especificaciones de tu proyecto. El 5% es un valor estándar conservador.</div>
 </div>
 </div>
 </div>
 
 <div className="code-block w-full">
 <div className="code-header">
 <span className="code-lang">Python · Configuración</span>
 <button className="code-copy" onClick={(e) => copyBlock(e)}>Copiar</button>
 </div>
 <pre className="text-green-300">
 <span className="text-emerald-500"># ─── CONFIGURACIÓN ──────────────────────────────────────────────</span>{"\n"}
 DENSIDAD_ACERO    = 7850   <span className="text-emerald-500"># kg/m³ — no cambiar</span>{"\n"}
 DENSIDAD_HORMIGON = 2400   <span className="text-emerald-500"># kg/m³ — ajusta si tu especificación difiere</span>{"\n"}
 FACTOR_CONEXIONES = 0.05   <span className="text-emerald-500">{`# 5% estándar\n                           # 0.08 = 8% para proyectos industriales\n                           # 0.12 = 12% para estructuras complejas`}</span>
 </pre>
 </div>

 <div className="steps-list mt-6">
 <div className="step-item">
 <div className="step-num">4</div>
 <div className="step-body">
 <div className="step-title">Agrega tu extensión a pyRevit</div>
 <div className="step-desc">Abre Revit → pestaña pyRevit → Settings → Custom Extensions. Agrega la ruta a tu carpeta <span className="ic">AG_Tools.extension</span>. Luego haz clic en Reload.</div>
 </div>
 </div>

 <div className="step-item">
 <div className="step-num">5</div>
 <div className="step-body">
 <div className="step-title">Abre un modelo y ejecuta el script</div>
 <div className="step-desc">Con un modelo estructural abierto, busca la pestaña "Cubicación" en el ribbon. Haz clic en el botón "Cubicacion". El reporte aparece en la consola de pyRevit en segundos.</div>
 </div>
 </div>
 </div>
 </div>
{/* Resultado esperado */}
 <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
 <h3 className="text-2xl font-extrabold text-white mb-4">
 <i className="fa-solid fa-terminal text-green-400 mr-2"></i>
 Resultado Esperado
 </h3>
 <p className="text-slate-400 mb-5">Si el modelo tiene materiales correctamente asignados, el reporte se ve así en la consola de pyRevit:</p>
 <div className="result-box">
 <h4>// Output consola pyRevit</h4>
 <pre>
 → ? Reporte de Cubicación Estructural
Proyecto: Proyecto_Arqueros_Rev3
Elementos procesados: 847
 // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
🏗️ Acero Estructural — Clasificación por NW
 // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
Clase NW N° Elementos Peso (kg) Peso (ton)
Liviana 124 8.420,3 8,42
Media 298 42.180,7 42,18
Pesada 201 89.340,2 89,34
Extrapesada 48 38.920,1 38,92
<strong>Subtotal acero: 178.861,3 kg (178,86 ton)</strong>
Factor conexiones (5%): + 8.943,1 kg
<strong> — Total c/conexiones: 187.804,4 kg (187,80 ton)</strong>
 // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
⚖️ HORMIGÓN Estructural
 // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
Volumen total: 1.240,50 m³
<strong>Peso total: 2.977.200 kg (2.977,20 ton)</strong></pre>
 </div>
 </div>
{/* Cómo funciona el código */}
 <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
 <h3 className="text-2xl font-extrabold text-white mb-6">
 <i className="fa-solid fa-gears text-bim-blue mr-2"></i>
 Cómo Funciona el Código
 </h3>
<h4 className="font-bold text-gray-200 mb-2">Detección de material</h4>
 <p className="text-slate-400 text-sm">La función <span className="ic">obtener_nombre_material()</span> lee el parámetro <span className="ic">STRUCTURAL_MATERIAL_PARAM</span> de cada elemento, obtiene el ID del material asignado y consulta su nombre en el documento. Las funciones <span className="ic">es_acero()</span> y <span className="ic">es_hormigon()</span> buscan palabras clave en ese nombre — por eso es importante que tus materiales en Revit tengan nombres descriptivos.</p>
<h4 className="font-bold text-gray-200 mb-2 mt-6">Extracción del volumen</h4>
 <p className="text-slate-400 text-sm">Revit calcula el volumen real de cada elemento estructural y lo almacena en el parámetro <span className="ic">HOST_VOLUME_COMPUTED</span>. La API lo entrega en pies cúbicos — la conversión a m³ la hace <span className="ic">UnitUtils.ConvertFromInternalUnits()</span>. Este valor ya considera la geometría exacta del perfil, no una aproximación.</p>
<div className="callout callout-green mt-4">
 <div className="callout-label">💡 Por qué esto es más preciso que Excel</div>
 <p className="text-gray-400 text-sm">El volumen calculado por Revit considera los cortes, uniones y modificaciones de geometría que aplicaste al modelo. Una tabla de Excel con fórmulas de largo × área de sección no hace eso. <strong className="text-gray-200">La diferencia puede ser de hasta 3,5% en estructuras con muchas uniones</strong>.</p>
 </div>
<h4 className="font-bold text-gray-200 mb-2 mt-6">Clasificación Nominal Weight</h4>
 <p className="text-slate-400 text-sm">El script calcula el peso lineal de cada elemento dividiendo el peso total por el largo de corte estructural. Con ese valor clasifica el perfil en una de las cuatro categorías estándar. Esto es útil para separar las cotizaciones por tipo de perfil, que en Chile generalmente tienen precios distintos por categoría NW.</p>
 </div>
{/* Comparativa de Tiempo */}
 <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
 <h3 className="text-2xl font-extrabold text-white mb-4">
 <i className="fa-solid fa-chart-bar text-cyan-400 mr-2"></i>
 Antes vs. Después: La Diferencia Real
 </h3>
 <p className="text-slate-400 mb-6 text-sm">Tiempo invertido por tarea en el flujo manual versus el flujo automatizado:</p>
 <div className="chart-container">
 <canvas id="timeComparisonChart" ref={chartRef}></canvas>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
 <div className="p-4 bg-red-900/20 rounded-xl border border-red-800/30">
 <h4 className="font-bold text-red-400 text-sm mb-2"><i className="fa-solid fa-xmark mr-1"></i> Flujo Manual (~2 horas)</h4>
 <ul className="text-gray-400 text-xs space-y-1 mb-0">
 <li>• Exportar schedule a Excel</li>
 <li>• Filtrar y clasificar manualmente</li>
 <li>• Buscar densidades de materiales</li>
 <li>• Calcular pesos con fórmulas</li>
 <li>• Repetir si el modelo cambia</li>
 </ul>
 </div>
 <div className="p-4 bg-green-900/20 rounded-xl border border-green-800/30">
 <h4 className="font-bold text-green-400 text-sm mb-2"><i className="fa-solid fa-check mr-1"></i> Con el Plugin (~10 segundos)</h4>
 <ul className="text-gray-400 text-xs space-y-1 mb-0">
 <li>• Presionar el botón en Revit</li>
 <li>• Revisar tablas en la consola</li>
 <li>• Listo → </li>
 </ul>
 </div>
 </div>
 </div>
{/* Troubleshooting */}
 <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
 <h3 className="text-2xl font-extrabold text-white mb-6">
 <i className="fa-solid fa-bug text-orange-400 mr-2"></i>
 Troubleshooting
 </h3>
<div className="space-y-5">
 <div>
 <h4 className="font-bold text-gray-200 mb-1 text-sm">El botón no aparece en el ribbon</h4>
 <p className="text-slate-600 text-sm mb-0">Verifica que el nombre de tu carpeta termine exactamente en <span className="ic">.extension</span>, <span className="ic">.tab</span>, <span className="ic">.panel</span> y <span className="ic">.pushbutton</span>. Un espacio de más o una mayúscula incorrecta hace que pyRevit no lo reconozca. Luego haz Reload.</p>
 </div>
 <div className="border-t border-gray-800 pt-5">
 <h4 className="font-bold text-gray-200 mb-1 text-sm">Elementos sin material asignado</h4>
 <p className="text-slate-600 text-sm mb-0">Si el reporte muestra elementos sin material, abre el modelo, selecciona esos elementos y asigna el material estructural correcto en las propiedades. El script avisa cuántos tienen ese problema.</p>
 </div>
 <div className="border-t border-gray-800 pt-5">
 <h4 className="font-bold text-gray-200 mb-1 text-sm">Error de conversión de unidades (Revit &lt; 2022)</h4>
 <p className="text-slate-600 text-sm mb-0">En versiones anteriores a 2022, <span className="ic">UnitTypeId</span> no existe. Reemplaza la conversión por <span className="ic">DisplayUnitType.DUT_CUBIC_METERS</span>, que es el equivalente en versiones más antiguas.</p>
 </div>
 </div>
 </div>
{/* Por qué importa + Conclusiones */}
 <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-bim-blue">
 <h3 className="text-xl font-extrabold text-white mb-4">
 <i className="fa-solid fa-lightbulb text-yellow-400 mr-2"></i>
 Conclusiones Clave
 </h3>
 <ul className="space-y-3 mb-0">
 <li className="flex items-start text-slate-400">
 <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
 <span><strong className="text-white">El modelo es la fuente de verdad.</strong> Si el modelo cambia, el reporte también. Sin exportar nada, sin versiones desactualizadas.</span>
 </li>
 <li className="flex items-start text-slate-400">
 <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
 <span><strong className="text-white">La detección por palabras clave es frágil si los materiales no tienen nombres descriptivos.</strong> Estandariza los nombres de materiales en tu plantilla de proyecto.</span>
 </li>
 <li className="flex items-start text-slate-400">
 <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
 <span><strong className="text-white">pyRevit hace que la automatización sea accesible.</strong> Sin compilar DLLs ni configurar Visual Studio. Solo Python y la estructura de carpetas correcta.</span>
 </li>
 <li className="flex items-start text-slate-400">
 <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
 <span><strong className="text-white">Cuando el proceso tarda 10 segundos, puedes iterar. Cuando tarda 2 horas, evitas hacerlo.</strong> Esa diferencia cambia cómo diseñas.</span>
 </li>
 </ul>
 </div>
</div>
 </section>

 </div>
 );
}
