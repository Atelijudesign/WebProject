import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export default function Iso19650Validation() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  const pythonValidatorCode = `import re
from dataclasses import dataclass
from typing import List, Dict, Optional

@dataclass
class Iso19650Container:
    project: str      # Código del Proyecto (ej: PRJ26)
    originator: str   # Originador / Empresa (ej: STR, ATEL)
    volume_system: str # Zona o Sistema espacial (ej: ZZ, 01)
    level: str        # Nivel o Piso (ej: 00, 01, RF)
    doc_type: str     # Tipo de información (ej: M3, DR, SH)
    role: str         # Rol disciplinar (ej: S para Estructuras, A para Arq)
    number: str       # Secuencial numérico de 4 a 6 dígitos
    suitability: str  # Código de idoneidad (ej: S1, S2, S3, A1)
    revision: str     # Revisión preliminar o contractual (ej: P01.01, C01)

class Iso19650Validator:
    # Patrón estándar del Anexo Nacional para contenedores de información
    NAMING_REGEX = re.compile(
        r"^(?P<project>[A-Z0-9]{3,6})-"
        r"(?P<originator>[A-Z0-9]{3,4})-"
        r"(?P<volume>[A-Z0-9]{2})-"
        r"(?P<level>[A-Z0-9]{2})-"
        r"(?P<type>[A-Z]{2})-"
        r"(?P<role>[A-Z]{1})-"
        r"(?P<number>\d{4,6})$"
    )

    VALID_SUITABILITY = {
        "S0": "Borrador de Trabajo en Progreso (WIP)",
        "S1": "Apto para Coordinación Interdisciplinaria (SHARED)",
        "S2": "Apto para Información / Consulta",
        "S3": "Apto para Revisión y Comentarios",
        "S4": "Apto para Aprobación de Etapa",
        "A1": "Aprobado para Construcción (PUBLISHED)",
        "CR": "Rechazado y Requerido para Corrección"
    }

    @classmethod
    def validate_container_name(cls, filename: str) -> Dict[str, any]:
        base_name = filename.split(".")[0]
        match = cls.NAMING_REGEX.match(base_name)
        
        if not match:
            return {
                "is_valid": False,
                "error": "El nombre no cumple la convención de nomenclatura ISO 19650 (Campos requeridos: PROJ-ORIG-VOL-LVL-TYPE-ROLE-NUM)"
            }
        
        data = match.groupdict()
        return {
            "is_valid": True,
            "fields": data,
            "message": "Nomenclatura ISO 19650 conforme."
        }

    @classmethod
    def audit_model_metadata(cls, element_parameters: Dict[str, str]) -> List[str]:
        missing_fields = []
        required_loin_params = ["IfcExportAs", "ClassificationCode", "StructuralStatus", "OmniClass_23"]
        
        for param in required_loin_params:
            if param not in element_parameters or not element_parameters[param]:
                missing_fields.append(f"Parámetro crítico faltante: '{param}'")
                
        return missing_fields

# Ejemplo de ejecución en tiempo real:
test_model = "PRJ26-ATEL-ZZ-01-M3-S-000101.rvt"
validation_result = Iso19650Validator.validate_container_name(test_model)
print(f"Resultado de Validación: {validation_result}")
`;

  const csharpRevitHook = `using System;
using System.Text.RegularExpressions;
using Autodesk.Revit.DB;
using Autodesk.Revit.DB.Events;

namespace BimQualityGate.ISO19650
{
    public class RealtimeModelValidator
    {
        private static readonly Regex IsoPattern = new Regex(
            @"^[A-Z0-9]{3,6}-[A-Z0-9]{3,4}-[A-Z0-9]{2}-[A-Z0-9]{2}-[A-Z]{2}-[A-Z]{1}-\\d{4,6}$",
            RegexOptions.Compiled);

        public static void OnDocumentSaving(object sender, DocumentSavingEventArgs e)
        {
            Document doc = e.Document;
            string docTitle = doc.Title;

            if (!IsoPattern.IsMatch(docTitle))
            {
                TaskDialog.Show("Quality Gate ISO 19650 Error",
                    $"El nombre del archivo '{docTitle}' no cumple el estándar ISO 19650.\\n" +
                    "Asegúrese de respetar el formato: [PROY]-[ORIG]-[ZONA]-[NIVEL]-[TIPO]-[ROL]-[NUM]");
                
                // Si la política de la empresa es estricta, se puede cancelar el guardado:
                // e.Cancel();
            }
        }
    }
}`;

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        setScrollProgress((winScroll / height) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shareUrl = getShareUrl("/blog/validacion-automatizada-iso-19650-tiempo-real");
  const shareTitle = encodeURIComponent(isEn ? "Real-Time Automated ISO 19650 Standards Validation: From the CDE to Native Authoring Models" : "Validación Automatizada de Estándares ISO 19650 en Tiempo Real");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "Real-Time Automated ISO 19650 Standards Validation: From the CDE to Native Authoring Models" : "Validación Automatizada de Estándares ISO 19650 en Tiempo Real | BIM & CDE"}
        description={isEn ? "How to implement continuous compliance validation engines and ISO 19650 Quality Gates across Common Data Environments (CDE) and BIM authoring tools (Revit, Tekla, ACC)." : "Cómo implementar motores de validación continua y Quality Gates basados en ISO 19650 para CDEs y software de autoría BIM (Revit, Tekla, ACC)."}
        path="/blog/validacion-automatizada-iso-19650-tiempo-real"
      />
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* HERO */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/60 transition-colors duration-300 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <Link to="/blog" className="text-bim-blue hover:text-cyan-400 text-sm font-medium transition-colors inline-flex items-center gap-1">
              <i className="fa-solid fa-arrow-left text-xs" /> {isEn ? "Back to Blog" : "Volver al Blog"}
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-indigo-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-shield-halved mr-1" /> ISO 19650 & Quality Gates
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 17 Ago 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "8 min read" : "8 min lectura"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            {isEn ? "Real-Time Automated ISO 19650 Standards Validation: From the CDE to Native Authoring Models" : (
              <>Validación Automatizada de Estándares ISO 19650 en Tiempo Real: <span className="text-cyan-400 font-mono">Del CDE a los Modelos Nativos</span></>
            )}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isEn ? "How to implement continuous compliance validation engines and ISO 19650 Quality Gates across Common Data Environments (CDE) and BIM authoring tools (Revit, Tekla, ACC)." : (
              <>La transición de auditorías manuales reactivas hacia <strong>Quality Gates automatizados</strong>. Cómo verificar sintaxis de contenedores, estados de idoneidad (Suitability Codes), niveles de información requerida (LOIN) y parámetros OpenBIM antes de que la información ingrese al CDE.</>
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.kaarwan.com/blog/architecture/automation-ai-data-aec-2025?id=2051"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-cyan-400 font-bold shadow-lg hover:text-cyan-300 transition-colors"
            >
              <i className="fa-solid fa-newspaper" /> Fuente: Kaarwan Architecture & AI
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
            <a
              href="https://www.ukbimframework.org/guidance/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-emerald-400 font-bold shadow-lg hover:text-emerald-300 transition-colors"
            >
              <i className="fa-solid fa-landmark" /> UK BIM Framework Guidance
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </div>
        </div>
      </section>

      {/* BODY CONTENT */}
      <main className="max-w-4xl mx-auto px-4 py-12 text-slate-200">
        
        {/* RESUMEN EJECUTIVO (BENTO STYLE) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-cyan-400 text-2xl mb-2"><i className="fa-solid fa-stopwatch" /></div>
            <h4 className="text-white font-bold text-base mb-1">Cero Auditorías Tardías</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detección de incongruencias en el momento de creación del modelo, evitando entregas rechazadas en hitos contractuales.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-indigo-400 text-2xl mb-2"><i className="fa-solid fa-network-wired" /></div>
            <h4 className="text-white font-bold text-base mb-1">Estados CDE Precisos</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gobierno de metadatos estricto entre estados WIP (Work in Progress), SHARED, PUBLISHED y ARCHIVED.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-emerald-400 text-2xl mb-2"><i className="fa-solid fa-code-merge" /></div>
            <h4 className="text-white font-bold text-base mb-1">Interoperabilidad OpenBIM</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verificación automática de esquemas IFC 4x3 y propiedades LOIN antes de exportar a plataformas multi-disciplinares.
            </p>
          </div>
        </div>

        {/* SECCIÓN 1: EL PROBLEMA HISTÓRICO */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation text-amber-400" />
            1. El Cuello de Botella: Auditoría Forense vs. Validación en Tiempo Real
          </h2>
          <p className="leading-relaxed mb-4 text-slate-300">
            Durante años, la gestión de información BIM bajo la serie <strong>ISO 19650</strong> ha sufrido del síndrome de la "auditoría forense". Los equipos de modelado trabajan semanas en entornos locales o nubes sin supervisión continua; al momento de subir los modelos para un hito de entrega (MIDP - <em>Master Information Delivery Plan</em>), el BIM Manager o Coordinador pasa días inspeccionando manualmente:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-slate-300 pl-2">
            <li>Nombres de archivos que violan el Anexo Nacional acordado en el BEP.</li>
            <li>Códigos de Idoneidad (<em>Suitability Codes</em>) confusos (ej: usar S1 para licitaciones o A1 en fases preliminares).</li>
            <li>Elementos sin códigos de clasificación Uniclass / OmniClass / Guía BIM Chile.</li>
            <li>Parámetros de exportación IFC mal asignados que rompen la federación en Navisworks o Solibri.</li>
          </ul>
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-sm text-amber-200">
            <strong>El Impacto:</strong> Retrasos en la aprobación de pagos por hitos, reprocesamiento de decenas de modelos y fricción innecesaria entre proyectistas y la gerencia de proyectos.
          </div>
        </section>

        {/* SECCIÓN 2: ARQUITECTURA QUALITY GATE */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-sitemap text-cyan-400" />
            2. Arquitectura de un Quality Gate ISO 19650
          </h2>
          <p className="leading-relaxed mb-4 text-slate-300">
            Un <strong>Quality Gate</strong> moderno opera en 3 capas sincrónicas:
          </p>

          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs">1</span>
                Nivel 1: Capa de Autoría (Revit / Tekla / CAD)
              </h3>
              <p className="text-sm text-slate-300">
                Hooks de guardado en C# (.NET) o pyRevit que interceptan eventos como <code>DocumentSaving</code> o <code>DocumentSynchronizingWithCentral</code>. Si el nombre del contenedor o los parámetros globales no cumplen con la expresión regular del proyecto, se alerta inmediatamente al modelador.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
                Nivel 2: Capa CDE y Webhooks (ACC / Trimble Connect / Dalux)
              </h3>
              <p className="text-sm text-slate-300">
                Al transferir archivos desde la carpeta <strong>WIP</strong> a <strong>SHARED</strong>, un servicio serverless procesa los metadatos. Si el archivo no cuenta con el código de idoneidad correcto o falla la validación de nomenclatura, el flujo de aprobación rechaza la carga automáticamente con un reporte detallado.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">3</span>
                Nivel 3: Capa Semántica LOIN (ISO 7817 / IDS buildingSMART)
              </h3>
              <p className="text-sm text-slate-300">
                Validación de especificaciones de intercambio de información (IDS - <em>Information Delivery Specification</em>) sobre modelos IFC generados, asegurando que cada perfil estructural posea su grado de acero, peso por metro y resistencia nominal.
              </p>
            </div>
          </div>

          {/* FIGURA 1: DIAGRAMA CDE QUALITY GATE */}
          <figure className="my-8 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img
              src={asset("/assets/img/blog/news/iso19650_cde_quality_gate.png")}
              alt="Diagrama de flujo e infraestructura CDE Quality Gate ISO 19650"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
              <i className="fa-solid fa-camera mr-1 text-cyan-400" /> {isEn ? "Figure 1:" : "Figura 1:"} Arquitectura de un Quality Gate ISO 19650 en Common Data Environment (CDE) verificando estados WIP → SHARED → PUBLISHED en tiempo real.
            </figcaption>
          </figure>
        </section>

        {/* SECCIÓN 3: ESTRUCTURA DE CONTENEDORES */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-cubes-stacked text-indigo-400" />
            3. Anatomía Estándar del Contenedor de Información
          </h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/80 text-cyan-400 font-mono">
                  <th className="p-3">Campo</th>
                  <th className="p-3">Descripción</th>
                  <th className="p-3">Ejemplo</th>
                  <th className="p-3">Regla de Validación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-white">Proyecto</td>
                  <td className="p-3">Código único de la obra</td>
                  <td className="p-3 font-mono text-cyan-300">PRJ26</td>
                  <td className="p-3 text-xs">3 a 6 caracteres alfanuméricos</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Originador</td>
                  <td className="p-3">Organización responsable</td>
                  <td className="p-3 font-mono text-cyan-300">ATEL</td>
                  <td className="p-3 text-xs">3 a 4 caracteres alfabéticos</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Zona / Sistema</td>
                  <td className="p-3">Subdivisión espacial o sector</td>
                  <td className="p-3 font-mono text-cyan-300">ZZ (Todo el edificio)</td>
                  <td className="p-3 text-xs">2 caracteres (ZZ si no aplica)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Nivel</td>
                  <td className="p-3">Piso o cota geométrica</td>
                  <td className="p-3 font-mono text-cyan-300">01 / RF / B1</td>
                  <td className="p-3 text-xs">2 caracteres estandarizados</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Tipo</td>
                  <td className="p-3">Naturaleza del entregable</td>
                  <td className="p-3 font-mono text-cyan-300">M3 (Modelo 3D), DR (Plano)</td>
                  <td className="p-3 text-xs">Catálogo cerrado de 2 letras</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Rol</td>
                  <td className="p-3">Disciplina profesional</td>
                  <td className="p-3 font-mono text-cyan-300">S (Estructural), A (Arq)</td>
                  <td className="p-3 text-xs">1 letra según tabla nacional</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Número</td>
                  <td className="p-3">Identificador secuencial</td>
                  <td className="p-3 font-mono text-cyan-300">000101</td>
                  <td className="p-3 text-xs">4 a 6 dígitos con ceros iniciales</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECCIÓN 4: IMPLEMENTACIÓN EN CÓDIGO */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-code text-cyan-400" />
            4. Implementación Práctica: Validador en Python
          </h2>
          <p className="leading-relaxed mb-4 text-slate-300">
            A continuación se presenta un motor liviano de validación en Python que puedes integrar en tus pipelines CI/CD, scripts de exportación o dashboards de control:
          </p>
          <CodeBlock code={pythonValidatorCode} language="python" />
        </section>

        {/* SECCIÓN 5: IMPLEMENTACIÓN NATIVA EN REVIT */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-brands fa-windows text-blue-400" />
            5. Hook en Tiempo Real para Autodesk Revit (.NET C#)
          </h2>
          <p className="leading-relaxed mb-4 text-slate-300">
            Para prevenir el error desde el origen, podemos capturar el evento de guardado en la API nativa de Revit mediante C#:
          </p>
          <CodeBlock code={csharpRevitHook} language="csharp" />

          {/* FIGURA 2: INTERFAZ DE VALIDACIÓN EN TIEMPO REAL */}
          <figure className="my-8 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img
              src={asset("/assets/img/blog/news/iso19650_realtime_validator.png")}
              alt="Interfaz de validación en tiempo real de modelos BIM bajo norma ISO 19650"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
              <i className="fa-solid fa-camera mr-1 text-cyan-400" /> {isEn ? "Figure 2:" : "Figura 2:"} Panel HUD de validación interactiva dentro del entorno de modelado, verificando nomenclatura, códigos de idoneidad S1/S2/S3, parámetros IFC y tablas Uniclass 2015.
            </figcaption>
          </figure>
        </section>

        {/* SECCIÓN 6: CONCLUSIONES */}
        <section className="mb-12 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-800/40">
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <i className="fa-solid fa-lightbulb text-cyan-400" />
            Conclusión: Hacia una Gestión de Información Autónoma
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4 text-sm">
            La adopción de la norma <strong>ISO 19650</strong> no debe consistir en memorizar manuales extensos de gestión documental. El verdadero salto productivo se logra cuando <strong>el software y los agentes de automatización asumen la carga de validación</strong> en tiempo real, permitiendo que los proyectistas estructurales y modeladores BIM se concentren en lo que mejor saben hacer: diseñar estructuras seguras, eficientes y construibles.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/herramientas"
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-toolbox" /> Explorar Herramientas BIM
            </Link>
            <Link
              to="/proyectos-bim"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-eye" /> Ver Proyectos Estructurales
            </Link>
          </div>
        </section>

        {/* SECCIÓN: FUENTES Y ENLACES OFICIALES */}
        <section className="mb-12 p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-link text-cyan-400" />
            Fuentes, Referencias Oficiales y Documentación Técnica
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Para garantizar la máxima credibilidad técnica y respaldar los flujos de trabajo presentados, consulta los artículos originales y guías de implementación:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://www.kaarwan.com/blog/architecture/automation-ai-data-aec-2025?id=2051"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 text-sm group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-newspaper" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>Kaarwan Architecture & AI</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500" />
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  automation-ai-data-aec-2025 (ID: 2051)
                </div>
              </div>
            </a>

            <a
              href="https://www.ukbimframework.org/guidance/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/50 transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 text-sm group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-landmark" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                  <span>UK BIM Framework</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500" />
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  Guidance Part 1, 2 & CDE Standards
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* BOTONES DE COMPARTIR */}
        <ShareArticle title={shareTitle} url={shareUrl} />

      </main>
    </div>
  );
}
