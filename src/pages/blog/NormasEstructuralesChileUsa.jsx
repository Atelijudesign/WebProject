import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../context/LanguageContext";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";
import BlogBackButton from "../../components/BlogBackButton";
import { BlogScrollSpyTOC } from "../../components/ui/BlogScrollSpyTOC";
import {
  NORMAS_DATABASE,
  NORMAS_METADATA,
  REFERENCIAS_CRUZADAS,
  CAMPOS_CATALOGO,
  CHECKLIST_MATRIZ_CONTRACTUAL
} from "../../data/normasEstructuralesData";

// Re-exportamos para asegurar compatibilidad total con cualquier consumidor
export {
  NORMAS_DATABASE,
  NORMAS_METADATA,
  REFERENCIAS_CRUZADAS,
  CAMPOS_CATALOGO,
  CHECKLIST_MATRIZ_CONTRACTUAL
};

const TOC_SECTIONS = [
  { id: "vision-general", title: "Visión General & Transición 2026", level: 2 },
  { id: "acero-estructural", title: "Acero (NCh427 / AISC / AWS)", level: 2 },
  { id: "hormigon-armado", title: "Hormigón (DS 60 / ACI / NCh170)", level: 2 },
  { id: "referencias-cruzadas", title: "Matriz de Referencias Cruzadas (29)", level: 2 },
  { id: "catalogo-normativo", title: "Buscador de las 72 Normas", level: 2 },
  { id: "criterios-catalogo", title: "6 Campos Clave del Catálogo", level: 2 },
  { id: "plantilla-notas", title: "Plantilla Notas de Planos", level: 2 },
];

export const NormasEstructuralesChileUsa = () => {
  const { language } = useTranslation();
  const isEn = language === "en";

  // Estados interactivos
  const [isSlideMode, setIsSlideMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("vision-general");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPais, setFilterPais] = useState("todos");
  const [filterCategoria, setFilterCategoria] = useState("todas");
  const [refSearchQuery, setRefSearchQuery] = useState("");
  const [refFilterTipo, setRefFilterTipo] = useState("todas");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  // Navegación suave a sección al pulsar tab superior
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    const targetElement = document.getElementById(tabId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Navegación por teclado en modo diapositivas (Flechas izquierda / derecha / Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isSlideMode) return;
      if (e.key === "ArrowRight" || e.key === "Space") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        setIsSlideMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSlideMode]);

  // Texto para síntesis de voz (Pitch técnico del Diseñador Estructural)
  const pitchText = `Como Diseñador Estructural en Chile, nuestro rol va mucho más allá de dibujar líneas: nosotros materializamos el modelo tridimensional de la obra y garantizamos que los planos se puedan fabricar y montar sin contratiempos. Conocer las 72 normas estructurales, reglamentos y métodos de ensayo de Chile y Estados Unidos es lo que separa a un modelador básico de un Diseñador Estructural Senior de alto valor. En acero, articulamos NCh427 con las especificaciones AISC 360, AISC 341 y AISC 358, entendemos el código de práctica AISC 303 para tolerancias de maestranza, y controlamos soldaduras bajo AWS D1.1 y pernos bajo RCSC y ASTM F3125. En hormigón armado, aplicamos el Decreto Supremo 60 y NCh430, modelamos barras bajo NCh204 y dominamos ACI 315R con las tolerancias de ACI 117 y los métodos de ensayo NCh170, NCh1017 y NCh1019. Además, comprendemos las referencias cruzadas y las transiciones legales de 2026, como la entrada diferida de NCh433 bajo el Decreto 28 y la transición ampliada de NCh2369 con el Decreto 36. Esta presentación es la herramienta de consulta definitiva para todos los profesionales que modelamos estructuras en Chile.`;

  // Web Speech API
  const handleToggleAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("La síntesis de voz no está soportada en tu navegador.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(pitchText);
    utterance.lang = "es-CL";
    utterance.rate = 1.02;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // Copiar Notas Generales al portapapeles
  const handleCopyNotas = (texto) => {
    navigator.clipboard.writeText(texto);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  // 10 Diapositivas para el Modo Presentación
  const slides = [
    {
      id: "slide-1",
      badge: "SLIDE 01 // PORTADA EJECUTIVA",
      title: "Normas Estructurales: Chile & Estados Unidos",
      subtitle: "Catálogo Maestro de 72 Normas, Ensayos, Materiales y Referencias Cruzadas",
      tagline: "El ingeniero calculista define los esfuerzos y los momentos; nosotros materializamos el modelo 3D, resolvemos las interferencias y garantizamos que el plano se construya sin errores en maestranza u obra.",
      puntosClave: [
        { label: "Universo Normativo", val: "72 Códigos, Reglamentos y Métodos de Ensayo (30 Chile / 42 USA)" },
        { label: "Referencias Cruzadas", val: "29 Relaciones e Interacciones Normativas Verificadas" },
        { label: "Rol del Diseñador Estructural", val: "De la geometría analítica a planos de taller, fabricación y colocación de armaduras" },
        { label: "Vigencias Legales 2026", val: "Transición NCh433:2026 (Decreto 28) y NCh2369:2025 (Decreto 36 18 meses)" }
      ]
    },
    {
      id: "slide-2",
      badge: "SLIDE 02 // SISMICIDAD Y CARGAS EN CHILE",
      title: "El Ecosistema Sísmico y Cargas en Chile",
      subtitle: "NCh433, NCh2369, NCh3171, NCh1537, NCh432, NCh431 y DS 61",
      points: [
        "NCh433:2026: Publicada por el INN con Decreto Exento N.º 28 (agosto 2026). Rige un período transitorio diferido de 6 meses; mientras tanto, se debe coordinar con DS 61.",
        "NCh2369:2025: La norma madre para la gran minería e infraestructura industrial en Chile. Decreto 36 amplía a 18 meses su transición y permite continuar con versión 2003 a proyectos en ejecución.",
        "NCh3171:2017 & NCh1537:2009: Definen las combinaciones gobernantes LRFD/ASD y las sobrecargas de uso en plataformas industriales, pasarelas y techumbres.",
        "NCh432:2025: Nueva norma de cargas de viento (con base informada en ASCE 7-22) con oficialización MOP informada en 2026.",
        "DS N.º 61/2011: Caracterización de tipos de suelo (A al F) y espectros de diseño sísmico para muros de contención y fundaciones."
      ]
    },
    {
      id: "slide-3",
      badge: "SLIDE 03 // HORMIGÓN ARMADO EN CHILE",
      title: "Hormigón Armado: El Marco Legal Vinculante",
      subtitle: "DS 60/2011 MINVU, NCh430, NCh170:2016 y NCh204:2020",
      points: [
        "DS N.º 60/2011: Es la ley en Chile para hormigón armado. Se basa en ACI 318S-08 con modificaciones chilenas críticas post-terremoto 27F.",
        "Espesores mínimos de muros sísmicos: e ≥ h/25 y no menos de 20 cm en subterráneos o zonas con confinamiento de borde.",
        "NCh430: En proceso de oficialización ante el INN para incorporar ACI 318-19 y armonizarse con el DS 60.",
        "NCh170:2016: Calidad del material (grados G), relación a/c y recubrimientos libres mínimos: 75 mm en fundaciones y 50 mm en exteriores.",
        "NCh204:2020: Acero para armaduras con vigencia legal confirmada desde 2022 (ALADI/MINVU). Diámetros nominales Ø8 a Ø36 y calidad A630-420H."
      ]
    },
    {
      id: "slide-4",
      badge: "SLIDE 04 // ACERO ESTRUCTURAL EN CHILE",
      title: "Acero Estructural: NCh427 y Manuales del ICHA",
      subtitle: "NCh427/1:2016, NCh427/2:2019, NCh203, NCh428 y Perfiles Chilenos",
      points: [
        "NCh427/1:2016: Armoniza el diseño de acero para edificios con ANSI/AISC 360, permitiendo métodos LRFD y ASD.",
        "NCh427/2:2019: Regula miembros conformados en frío (vigente legal desde 14-06-2022 según ICHA). Considerar espesor base sin zinc al modelar.",
        "NCh203: Especifica las calidades de acero estructural chilenas: A270ES para usos generales y A345ES para aplicaciones de mayor resistencia y soldabilidad garantizada.",
        "NCh428:2017: Requisitos de fabricación, tolerancias y montaje de estructuras de acero en maestranzas chilenas.",
        "Coordinación de planos: Obliga a especificar en notas generales si los perfiles son laminados ICHA o secciones armadas soldadas."
      ]
    },
    {
      id: "slide-5",
      badge: "SLIDE 05 // NORMAS DE EE.UU. EN MINERÍA",
      title: "El Estándar Estadounidense en Proyectos EPC",
      subtitle: "IBC 2024, ASCE 7-22, ANSI/AISC 360-22, AISC 341-22 y AISC 358-22",
      points: [
        "IBC 2024 & ASCE 7-22: El marco de referencia en proyectos mineros liderados por ingenierías internacionales (Bechtel, Fluor, Hatch, Wood, Ausenco).",
        "ANSI/AISC 360-22: La especificación maestra mundial para verificar perfiles, estabilidad y conexiones apernadas y soldadas.",
        "ANSI/AISC 341-22: Disposiciones sísmicas de alta ductilidad. Define sistemas SMF, IMF, SCBF y las 'Zonas Protegidas' donde está prohibido perforar o soldar.",
        "ANSI/AISC 358-22: Conexiones precalificadas de momento (End-Plate apernada, Dogbone RBS) con geometrías y parámetros validados para detallar en 3D.",
        "ACI 318-25: Publicado recientemente en EE.UU., pero NO aplicable automáticamente en Chile sin instrucción explícita del calculista."
      ]
    },
    {
      id: "slide-6",
      badge: "SLIDE 06 // LA BIBLIA DE MAESTRANZA Y MONTAJE",
      title: "AISC 303-22 & RCSC 2020: Fabricación y Montaje",
      subtitle: "De los Planos de Diseño a los Planos de Taller (Shop Drawings)",
      points: [
        "ANSI/AISC 303-22 (Code of Standard Practice): Define qué debe contener un plano de diseño (cargas de corte, momentos) y las responsabilidades del detallador de taller.",
        "Tolerancias de montaje: Desplomes admisibles en columnas (1:500), nivelación de placas base y holguras para colocación de pernos.",
        "RCSC 2020: Regula uniones apernadas de alta resistencia. Distingue uniones tipo aplastamiento (Bearing) de deslizamiento crítico (Slip-Critical).",
        "Pernos ASTM F3125: Unifica los antiguos grados A325 y A490. Requiere indicar condición de rosca incluida (N) o excluida (X) en el plano de corte.",
        "Pernos de Anclaje ASTM F1554: Grados 36, 55 y 105 para bases de columnas. Exige placas niveladoras, arandelas gruesas y mortero Grout autonivelante."
      ]
    },
    {
      id: "slide-7",
      badge: "SLIDE 07 // DETALLAMIENTO DE ENFIERRADURA",
      title: "ACI 315R-18 & ACI 117: La Biblia del Detallador",
      subtitle: "Radios de Mandril, Confinamiento Sísmico y Tolerancias en Obra",
      points: [
        "ACI 315R-18: La guía sagrada para planos de enfierradura y despieces de barras. Aclara que no es un código obligatorio por sí mismo, sino una guía que debe prescribirse en contrato.",
        "Radios mínimos de mandril: 4db para barras Ø10 a Ø25; 6db para Ø28 a Ø36. Previene que el acero A630-420H se microfisure durante el doblado en taller.",
        "Ganchos sísmicos a 135°: Exigidos con prolongación recta de 6db (mínimo 75 mm) para confinar cabezales de muros y núcleos de columnas.",
        "ACI 117-10 (R2015): Tolerancias dimensionales reales del hormigón. Fija tolerancias para recubrimiento (±6 a ±12 mm) y colocación de insertos embebidos.",
        "Traslapes Clase A y B: Deben desfasarse un 50% entre barras contiguas y ubicarse fuera de las zonas de rótula plástica."
      ]
    },
    {
      id: "slide-8",
      badge: "SLIDE 08 // SOLDADURA ESTRUCTURAL",
      title: "Soldaduras: AWS D1.1, D1.8 Sísmico, D1.4 y Simbología A2.4",
      subtitle: "Cordones, Zonas Sísmicas y Soldadura de Armaduras",
      points: [
        "AWS D1.1/D1.1M:2025: Código de soldadura en acero. Define símbolos de soldadura, gargantas efectivas en filetes y biseles CJP (penetración completa) o PJP.",
        "AWS D1.8/D1.8M:2025: Suplemento sísmico para uniones que disipan energía plástica. Exige electrodos con tenacidad Charpy V-Notch (CVN) garantizada y orificios de acceso especiales.",
        "AWS D1.4/D1.4M:2018: Soldadura de barras de hormigón armado. ¡Regla crítica!: Solo se permite soldar barras de baja aleación ASTM A706 o NCh204 especial soldable.",
        "AWS A2.4:2020: Simbología internacional unificada para comunicar gargantas, longitud, paso y ensayos NDT en planos.",
        "¡Nunca soldar barras A630-420H o ASTM A615 comunes!: Provoca fragilización inmediata en la zona afectada térmicamente (ZAT)."
      ]
    },
    {
      id: "slide-9",
      badge: "SLIDE 09 // REFERENCIAS CRUZADAS Y TRANSICIÓN 2026",
      title: "El Principio de Jerarquía Normativa y Transición 2026",
      subtitle: "Año de Edición vs. Año de Entrada en Vigencia Legal",
      points: [
        "Regla de Oro: El año de edición NO equivale al año de vigencia legal. La exigibilidad depende del decreto supremo, contrato o código adoptado.",
        "NCh433:2026 tiene vacancia legal diferida de 6 meses (Decreto 28). Proyectos en curso continúan con NCh433:1996 Mod.2009 + DS 61.",
        "NCh2369:2025 tiene transición ampliada de 18 meses (Decreto 36). Proyectos en ejecución pueden optar legalmente entre versión 2025 o 2003.",
        "Referencias Cruzadas: Una norma cita una edición específica. Una revisión posterior no la reemplaza automáticamente sin decreto de adecuación.",
        "Diferenciar Adopción Verificada (DS 60 -> ACI 318S-08) de Complementarias Propuestas (AISC 360 -> ASTM A992)."
      ]
    },
    {
      id: "slide-10",
      badge: "SLIDE 10 // CHECKLIST & PLANTILLA DE PLANOS",
      title: "Checklist Maestro para Diseñadores Estructurales y Modeladores BIM",
      subtitle: "10 Reglas de Oro para Láminas de Acero y Hormigón en Revit y Tekla",
      points: [
        "1. Especificar perfiles de acero: A345ES / A270ES (NCh203) o ASTM A992 Gr. 50 / ASTM A500 Gr. B/C.",
        "2. Indicar calidad de pernos de conexión: ASTM F3125 Gr. A325 con condición de rosca (N o X).",
        "3. Pernos de anclaje: ASTM F1554 Grado 55 o 36 con longitud embebida y mortero Grout no expansivo.",
        "4. Simbología de soldadura conforme a AWS D1.1 y A2.4, señalando claramente taller vs terreno.",
        "5. Hormigón: Grado de resistencia NCh170 (ej. G30), tamaño de árido y recubrimientos libres según exposición.",
        "6. Armaduras: Acero NCh204 Grado A630-420H, radios de curvatura según ACI 315R y estribos con gancho a 135°.",
        "7. Juntas de dilatación sísmica modeladas y acotadas respetando las derivas de cálculo.",
        "8. No realizar perforaciones ni soldaduras no autorizadas en 'Zonas Protegidas' sísmicas de vigas AISC 341.",
        "9. Generar tablas de despiece automáticas verificando longitudes comerciales máximas de barra (12 metros).",
        "10. Validar tolerancias de montaje según AISC 303 e interfaces con hormigón bajo ACI 117."
      ]
    }
  ];

  // Filtrado de las 72 normas del catálogo
  const filteredNormas = NORMAS_DATABASE.filter((norma) => {
    const matchesPais =
      filterPais === "todos" ||
      (filterPais === "chile" && norma.pais === "Chile") ||
      (filterPais === "usa" && norma.pais === "Estados Unidos");

    const matchesCategoria =
      filterCategoria === "todas" || norma.categoria === filterCategoria;

    const queryLower = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !queryLower ||
      norma.codigo.toLowerCase().includes(queryLower) ||
      norma.nombre.toLowerCase().includes(queryLower) ||
      norma.descripcion.toLowerCase().includes(queryLower) ||
      norma.paraQueSirve.toLowerCase().includes(queryLower) ||
      norma.enfoqueDisenador.toLowerCase().includes(queryLower) ||
      (norma.aplicabilidadEstado && norma.aplicabilidadEstado.toLowerCase().includes(queryLower)) ||
      (norma.anoVigenciaLegal && norma.anoVigenciaLegal.toLowerCase().includes(queryLower));

    return matchesPais && matchesCategoria && matchesQuery;
  });

  // Filtrado de las 29 referencias cruzadas
  const filteredReferencias = REFERENCIAS_CRUZADAS.filter((ref) => {
    const matchesTipo =
      refFilterTipo === "todas" ||
      (refFilterTipo === "verificadas" && ref.isVerified) ||
      (refFilterTipo === "propuestas" && !ref.isVerified);

    const queryLower = refSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !queryLower ||
      ref.origen.toLowerCase().includes(queryLower) ||
      ref.relacionada.toLowerCase().includes(queryLower) ||
      ref.tipoRelacion.toLowerCase().includes(queryLower) ||
      ref.interpretacion.toLowerCase().includes(queryLower);

    return matchesTipo && matchesQuery;
  });

  // Plantilla de Notas Generales para Planos
  const plantillaNotasAcero = `NOTAS GENERALES DE ESTRUCTURAS DE ACERO (DISEÑADOR ESTRUCTURAL / MODELADOR)
1. CÓDIGOS Y NORMAS DE REFERENCIA:
   - DISEÑO ESTRUCTURAL: NCh427/1:2016 / ANSI/AISC 360-22 (LRFD).
   - DISPOSICIONES SÍSMICAS: NCh2369:2025 (TRANSICIÓN DTO. 36) / ANSI/AISC 341-22.
   - CÓDIGO DE PRÁCTICA ESTÁNDAR: ANSI/AISC 303-22 / NCh428:2017.
   - SOLDADURA ESTRUCTURAL: AWS D1.1/D1.1M:2025-AMD1 (ELECTRODOS E70XX) Y AWS A2.4:2020.
   - UNIONES APERNADAS: RCSC 2020 / ASTM F3125/F3125M-26.

2. MATERIALES:
   - PERFILES LAMINADOS Y SECCIONES ARMADAS: ACERO NCh203 A345ES (Fy = 345 MPa) O ASTM A992 GRADO 50.
   - PLANCHAS, ATIESADORES Y CARTELAS: ACERO ASTM A36 O NCh203 A270ES (Fy = 250 MPa).
   - PERFILES TUBULARES HSS: ASTM A500 GRADO B O C / ASTM A1085 GRADO 50.
   - PERFILES CONFORMADOS EN FRÍO (COSTANERAS): NCh427/2:2019 / AISI S100-24 GRADO 50 GALVANIZADO.

3. CONEXIONES APERNADAS Y ANCLAJES:
   - PERNOS ESTRUCTURALES: ASTM F3125 GRADO A325 TIPO 1, APRIETE TIPO APLASTAMIENTO CON ROSCA EXCLUIDA (X).
   - TUERCAS Y ARANDELAS: TUERCAS ASTM A563 GRADO DH Y ARANDELAS ASTM F436.
   - PERNOS DE ANCLAJE: ASTM F1554-20 GRADO 55 CON TUERCA PESADA Y GOLILLA DE ACERO SEGÚN PLANO DE DETALLE.
   - MORTERO DE NIVELACIÓN (GROUT): AUTONIVELANTE SIN RETRACCIÓN, RESISTENCIA MÍNIMA f'c = 50 MPa A 28 DÍAS.

4. TOLERANCIAS Y FABRICACIÓN:
   - LAS TOLERANCIAS DE FABRICACIÓN Y MONTAJE SE REGIRÁN ESTRICTAMENTE POR AISC 303-22 Y NCh428:2017.
   - NO SE PERMITEN PERFORACIONES NI FIJACIONES SOLDADAS EN LAS "ZONAS PROTEGIDAS" DEFINIDAS EN AISC 341-22 SIN AUTORIZACIÓN DEL INGENIERO CALCULISTA.`;

  const plantillaNotasHormigon = `NOTAS GENERALES DE HORMIGÓN ARMADO (DISEÑADOR ESTRUCTURAL / MODELADOR)
1. CÓDIGOS Y REGLAMENTOS DE REFERENCIA:
   - REGLAMENTO DE DISEÑO: DECRETO SUPREMO N.º 60/2011 MINVU / ACI 318S-08.
   - DISEÑO SÍSMICO: NCh433:2026 (RÉGIMEN TRANSICIÓN DTO. 28) Y DS N.º 61/2011 MINVU.
   - ESPECIFICACIÓN DEL MATERIAL: NCh170:2016 / CONTROL DE ENSAYOS NCh1017, NCh1019, NCh1037.
   - DETALLAMIENTO DE ARMADURAS: ACI 315R-18 / NCh204:2020.
   - TOLERANCIAS DIMENSIONALES: ACI 117-10 (REAPROBADA 2015).

2. RESISTENCIA DEL HORMIGÓN Y RECUBRIMIENTOS (NCh170:2016):
   - FUNDACIONES Y ZAPATAS: HORMIGÓN GRADO G25 (f'c = 25 MPa). RECUBRIMIENTO LIBRE MÍNIMO = 75 mm (CONTRA TERRENO).
   - MUROS Y COLUMNAS: HORMIGÓN GRADO G30 (f'c = 30 MPa). RECUBRIMIENTO LIBRE MÍNIMO = 25 mm (INTERIOR) / 50 mm (EXTERIOR).
   - LOSAS Y VIGAS: HORMIGÓN GRADO G25 (f'c = 25 MPa). RECUBRIMIENTO LIBRE MÍNIMO = 25 mm.
   - TAMAÑO MÁXIMO DEL ÁRIDO (TM): 3/4" (19 mm) SEGÚN NCh163:2024 PARA ASEGURAR PASO ENTRE BARRAS.

3. ACERO DE REFUERZO (ENFIERRADURA):
   - CALIDAD DE BARRAS: NCh204:2020 GRADO A630-420H (Fy = 420 MPa) / ASTM A706 GRADO 60 PARA BARRAS SOLDABLES.
   - RADIOS DE DOBLADO: DIÁMETROS Ø8 A Ø25 MANDRIL MÍNIMO 4db; Ø28 A Ø36 MANDRIL MÍNIMO 6db (ACI 315R-18).
   - ESTRIBOS Y TRABAS: TODOS LOS ESTRIBOS DE CONFINAMIENTO DEBEN CERRARSE CON GANCHOS SÍSMICOS A 135° Y PROLONGACIÓN MÍNIMA DE 6db (>= 75 mm).
   - PROHIBIDO SOLDAR BARRAS DE ACERO A630-420H O ASTM A615 (AWS D1.4). UNIONES MEDIANTE TRASLAPE TRADICIONAL O CONECTORES MECÁNICOS CALIFICADOS.`;

  const shareTitle = "Guía Maestra de Normas Estructurales Chile & USA: La Biblia del Diseñador Estructural y Modelador BIM";
  const shareUrl = getShareUrl("/blog/normas-estructurales-chile-usa");

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-24 pb-16 selection:bg-cyan-500 selection:text-slate-950">
      <SEOHead
        title={shareTitle}
        description="Guía completa para diseñadores estructurales y modeladores BIM: 72 normas críticas de acero y hormigón (NCh, DS 60, AISC, ACI, AWS, ASTM), 29 referencias cruzadas, transiciones legales 2026 y checklist para planos BIM."
        path="/blog/normas-estructurales-chile-usa"
        keywords="Normas Estructurales Chile, NCh433 2026, NCh2369 2025, DS 60 Hormigon, NCh427 Acero, AISC 360, AISC 341, AISC 303, ACI 318, ACI 315R, Disenador Estructural Chile, Modelado BIM Revit Tekla"
        type="article"
      />

      {/* Encabezado Flotante de Modo Presentación */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                Dossier Técnico Especial para Diseñadores Estructurales & Modeladores
              </span>
              <span className="text-xs text-slate-400 font-sans">
                Por Andrés Gallo Parra · Estructuras de Acero & Hormigón Armado (Rev. 30 Septiembre 2026)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsSlideMode(!isSlideMode)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                isSlideMode
                  ? "bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30"
                  : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
              }`}
            >
              <i className={`fa-solid ${isSlideMode ? "fa-xmark" : "fa-expand"}`} />
              <span>{isSlideMode ? "Salir de Diapositivas" : "Modo Presentación (Slides)"}</span>
            </button>

            <button
              onClick={handleToggleAudio}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-2 ${
                isPlayingAudio
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
              }`}
              title="Escuchar audio resumen"
            >
              <i className={`fa-solid ${isPlayingAudio ? "fa-pause" : "fa-volume-high"}`} />
              <span>{isPlayingAudio ? "Pausar Audio" : "Escuchar Pitch"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODO SLIDE DECK (PRESENTACIÓN DE DIAPOSITIVAS INTERACTIVA) */}
      {isSlideMode ? (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 min-h-[78vh] flex flex-col justify-center">
          <div className="rounded-3xl p-8 sm:p-12 border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Luces de fondo */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Cabecera del Slide */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-8 flex-wrap gap-4">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                {slides[currentSlide].badge}
              </span>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>Diapositiva</span>
                <span className="text-white font-bold text-sm">{currentSlide + 1}</span>
                <span>de</span>
                <span className="text-slate-500">{slides.length}</span>
              </div>
            </div>

            {/* Cuerpo del Slide */}
            <div className="space-y-6 min-h-[340px]">
              <div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-sm sm:text-base font-mono text-cyan-300 mt-2 font-medium">
                  {slides[currentSlide].subtitle}
                </p>
              </div>

              {slides[currentSlide].tagline && (
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs sm:text-sm text-cyan-100 italic leading-relaxed">
                  "{slides[currentSlide].tagline}"
                </div>
              )}

              {/* Puntos destacados de Slide 1 */}
              {slides[currentSlide].puntosClave && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {slides[currentSlide].puntosClave.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 hover:border-slate-700 transition-colors"
                    >
                      <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                        {item.label}
                      </span>
                      <p className="text-sm font-semibold text-slate-200">{item.val}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Lista de viñetas en Slides 2 a 10 */}
              {slides[currentSlide].points && (
                <ul className="space-y-3.5 mt-6">
                  {slides[currentSlide].points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-200 text-sm sm:text-base leading-relaxed">
                      <span className="text-cyan-400 mt-1">
                        <i className="fa-solid fa-circle-check text-xs" />
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Controles de Navegación de Diapositivas */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-800/80 mt-8 relative z-10 flex-wrap gap-4">
              <button
                onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
                disabled={currentSlide === 0}
                className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-chevron-left" />
                <span>Anterior</span>
              </button>

              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentSlide === idx ? "bg-cyan-400 w-8" : "bg-slate-700 hover:bg-slate-500"
                    }`}
                    title={`Ir a diapositiva ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSlideMode(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-xmark" />
                  <span>Salir</span>
                </button>

                <button
                  onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))}
                  disabled={currentSlide === slides.length - 1}
                  className="px-4 py-2 rounded-xl text-xs font-mono bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-30"
                >
                  <span>Siguiente</span>
                  <i className="fa-solid fa-chevron-right" />
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* MODO ARTÍCULO COMPLETO / BENTO GRID TÉCNICO */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {/* HERO BANNER PRINCIPAL */}
          <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-slate-800 bg-gradient-to-br from-slate-900 via-[#050c18] to-slate-950 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5 font-bold">
                  <i className="fa-solid fa-drafting-compass" />
                  <span>Para Diseñadores Estructurales & Modeladores BIM</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-bold">
                  <i className="fa-solid fa-flag-checkered" />
                  <span>Chile vs Estados Unidos</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 font-bold">
                  <i className="fa-solid fa-calendar-check" />
                  <span>Revisión Oficial: 30 Septiembre 2026</span>
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-sans leading-tight">
                  Guía de Normas Estructurales:
                  <span className="block text-2xl sm:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-indigo-300 font-extrabold mt-2">
                    72 Registros de Acero, Hormigón, Ensayos y Referencias Cruzadas (Chile & USA)
                  </span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base max-w-4xl leading-relaxed">
                  En el día a día de una oficina de proyectos estructurales o maestranza, el ingeniero calculista entrega
                  momentos flectores, esfuerzos axiales y memorias de cálculo. Pero somos nosotros, los
                  <strong> diseñadores estructurales y modeladores BIM</strong>, quienes traducimos esas cifras en modelos 3D
                  precisos en <strong>Tekla Structures, Autodesk Revit y AutoCAD</strong>, resolvemos las interferencias geométricas
                  y redactamos las <strong>Notas Generales</strong> que gobiernan la fabricación y montaje en obra.
                </p>
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200/90 leading-relaxed max-w-4xl">
                  <strong className="text-amber-300 font-bold block mb-1">
                    <i className="fa-solid fa-triangle-exclamation mr-1.5" />
                    Principio Fundamental: El año de edición no equivale al año de vigencia legal
                  </strong>
                  La exigibilidad formal depende de la incorporación reglamentaria (decretos supremos), la jurisdicción del proyecto,
                  el contrato y los periodos de vacancia legal. Por ejemplo, NCh433:2026 tiene vacancia diferida de 6 meses (Decreto 28/2026),
                  y NCh2369:2025 cuenta con 18 meses de transición ampliada (Decreto 36/2026).
                </div>
              </div>

              {/* Botonera de Acción */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsSlideMode(true)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm font-mono transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <i className="fa-solid fa-play" />
                  <span>Ver Presentación en Diapositivas (10 Slides)</span>
                </button>

                <button
                  onClick={() => handleTabClick("referencias-cruzadas")}
                  className="px-4 py-2.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 font-mono text-xs sm:text-sm transition-all border border-indigo-500/30 flex items-center gap-2"
                >
                  <i className="fa-solid fa-diagram-project text-cyan-400" />
                  <span>Matriz de Referencias Cruzadas (29)</span>
                </button>

                <button
                  onClick={() => handleTabClick("catalogo-normativo")}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs sm:text-sm transition-all border border-slate-700 flex items-center gap-2"
                >
                  <i className="fa-solid fa-database text-cyan-400" />
                  <span>Explorar las 72 Normas con Buscador</span>
                </button>

                <button
                  onClick={() => handleTabClick("plantilla-notas")}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-mono text-xs sm:text-sm transition-all border border-emerald-500/30 flex items-center gap-2"
                >
                  <i className="fa-solid fa-clipboard-check" />
                  <span>Plantilla Notas para Planos</span>
                </button>
              </div>
            </div>
          </section>

          {/* SELECTOR DE PESTAÑAS TÉCNICAS */}
          <section className="pb-4 border-b border-slate-800 font-mono text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
              {[
                { id: "vision-general", label: "Visión General & 2026", icon: "fa-compass" },
                { id: "acero-estructural", label: "Acero (AISC/NCh427)", icon: "fa-layer-group" },
                { id: "hormigon-armado", label: "Hormigón (DS 60/ACI)", icon: "fa-cubes" },
                { id: "referencias-cruzadas", label: "Referencias Cruzadas (29)", icon: "fa-diagram-project" },
                { id: "catalogo-normativo", label: "Buscador (72 Normas)", icon: "fa-database" },
                { id: "criterios-catalogo", label: "6 Campos Clave", icon: "fa-table-list" },
                { id: "plantilla-notas", label: "Notas de Planos", icon: "fa-file-lines" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 text-center border ${
                    activeTab === tab.id
                      ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60 border-slate-800/80 bg-slate-900/40"
                  }`}
                >
                  <i className={`fa-solid ${tab.icon} shrink-0 text-[11px]`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* BANNER AVISO MODO ZEN */}
          {isZenMode && (
            <div className="sticky top-20 z-30 p-3.5 rounded-2xl bg-cyan-950/90 border border-cyan-500/40 backdrop-blur-md flex items-center justify-between gap-4 max-w-4xl mx-auto shadow-2xl">
              <div className="flex items-center gap-2.5 text-xs font-mono text-cyan-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-bold">MODO ZEN DE LECTURA TÉCNICA ACTIVO</span>
                <span className="hidden sm:inline text-cyan-400/70">· Sin distracciones visuales</span>
              </div>
              <button
                onClick={() => setIsZenMode(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors flex items-center gap-1.5 shadow-md"
              >
                <i className="fa-solid fa-xmark text-xs" />
                <span>Salir del Modo Zen</span>
              </button>
            </div>
          )}

          {/* GRID EDITORIAL: CONTENIDO + SCROLLSPY TOC LATERAL */}
          <div className={`grid grid-cols-1 ${isZenMode ? "max-w-4xl mx-auto" : "lg:grid-cols-12 gap-8 xl:gap-10"}`}>
            {/* Columna Principal de Lectura */}
            <article className={`${isZenMode ? "w-full" : "lg:col-span-8 2xl:col-span-9"} space-y-20 min-w-0`}>
              
              {/* SECCIÓN 1: VISIÓN GENERAL */}
              <section id="vision-general" data-title="Visión General & Transición 2026" className="scroll-mt-28 space-y-10">
                {/* Manifiesto Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
                      <i className="fa-solid fa-screwdriver-wrench" />
                      <span>La Perspectiva del Diseñador Estructural</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                      ¿Por qué las normas no son exclusivas del calculista?
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      Un error común en ingeniería es asumir que los códigos estructurales solo contienen fórmulas matemáticas
                      de resistencia y momentos. Para el diseñador estructural que está frente a la pantalla en Revit o Tekla, las normas son
                      el manual de instrucciones físicas:
                    </p>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                      <li className="flex items-start gap-2.5">
                        <span className="text-cyan-400 mt-1"><i className="fa-solid fa-check" /></span>
                        <span><strong>En Acero:</strong> AISC 303, NCh428 y RCSC dictan las holguras de orificios, distancias al borde, tolerancias de montaje de columnas y responsabilidades contractuales con maestranza.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-cyan-400 mt-1"><i className="fa-solid fa-check" /></span>
                        <span><strong>En Hormigón:</strong> DS 60, NCh170 y ACI 315R dictan cómo doblar un estribo a 135°, qué radio de mandril usar para no microfisurar el acero A630-420H y dónde ubicar traslapes fuera de rótulas plásticas.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-cyan-400 mt-1"><i className="fa-solid fa-check" /></span>
                        <span><strong>En Interfaces:</strong> ACI 117 define la tolerancia de nivelación y posición de pernos de anclaje (±6 a ±12 mm) para que las placas base no choquen en obra.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-[11px] font-mono font-bold uppercase">
                        Vigencias Legales 2026
                      </span>
                      <h4 className="text-lg font-bold text-white font-sans">
                        Puntos Ciegos de Transición Normativa
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        1. <strong>NCh433:2026:</strong> Decreto Exento N.º 28 fija 6 meses de vacancia diferida.
                        <br />2. <strong>NCh2369:2025:</strong> Decreto 36 amplía a 18 meses la transición y permite versión 2003 en obras en ejecución.
                        <br />3. <strong>NCh430:</strong> Próxima a oficializarse sobre ACI 318-19 + DS 60.
                        <br />4. <strong>ACI 318-25:</strong> Publicado en EE.UU., pero legalmente en Chile rige el DS 60/2011 sobre ACI 318S-08.
                      </p>
                    </div>

                    <button
                      onClick={() => handleTabClick("referencias-cruzadas")}
                      className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors text-center"
                    >
                      Ver Matriz de Interacción
                    </button>
                  </div>
                </div>

                {/* Bento de Estadísticas y Distribución */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                    <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono block">72</span>
                    <span className="text-xs text-slate-400 font-sans mt-1 block">Normas & Ensayos</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                    <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono block">30</span>
                    <span className="text-xs text-slate-400 font-sans mt-1 block">Normas Chile (INN/MINVU)</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                    <span className="text-3xl sm:text-4xl font-black text-blue-400 font-mono block">42</span>
                    <span className="text-xs text-slate-400 font-sans mt-1 block">Normas USA (AISC/ACI/AWS/ASTM)</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                    <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono block">29</span>
                    <span className="text-xs text-slate-400 font-sans mt-1 block">Referencias Cruzadas</span>
                  </div>
                </div>
              </section>

              {/* SECCIÓN 2: ACERO ESTRUCTURAL */}
              <section id="acero-estructural" data-title="Acero (NCh427 / AISC / AWS)" className="scroll-mt-28 space-y-8 pt-8 border-t border-slate-800/80">
                <div className="p-6 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex items-start gap-4">
                  <i className="fa-solid fa-info-circle text-blue-400 text-xl mt-1" />
                  <div className="text-xs sm:text-sm text-slate-300 space-y-1">
                    <strong className="text-white block font-bold">
                      El Flujo de Trabajo del Diseñador Estructural de Acero: De NCh427 a AISC 360/341/303
                    </strong>
                    <p>
                      En proyectos de minería e industria pesada en Chile (bajo NCh2369), la especificación de perfiles, placas y uniones
                      es híbrida: calculamos bajo NCh427/1 (armonizada con AISC 360), detallamos perfiles ICHA o perfiles W bajo ASTM A992,
                      aplicamos RCSC para pernos de alta resistencia y nos ceñimos a AISC 303 y NCh428 para entregables de maestranza.
                    </p>
                  </div>
                </div>

                {/* Bento Cards Acero */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: AISC 303 Código de Práctica Estándar */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">
                        ANSI/AISC 303-22 & NCh428:2017
                      </span>
                      <span className="text-xs font-mono text-slate-400">Fabricación & Montaje</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                      AISC 303: La Frontera entre el Plano de Diseño y el Plano de Taller
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      AISC 303 establece con rigor legal qué debe indicar el plano de cálculo del diseñador estructural:
                    </p>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-cyan-400 mt-0.5" />
                        <span>Fuerzas de reacción en cada nudo (corte vertical, tracción axial y momento flector).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-cyan-400 mt-0.5" />
                        <span>Definición clara de si la conexión la diseña la ingeniería o la maestranza detalladora.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-cyan-400 mt-0.5" />
                        <span>Tolerancias de montaje de columnas (desplome 1:500) y secuencia de apriete de pernos.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Card 2: RCSC & Pernos ASTM F3125 */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                        RCSC 2020 & ASTM F3125-26
                      </span>
                      <span className="text-xs font-mono text-slate-400">Pernos Estructurales</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                      Uniones Apernadas: Aplastamiento vs Deslizamiento Crítico
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      No todos los pernos se modelan ni aprietan igual. RCSC 2020 exige clarificar en los planos:
                    </p>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-amber-400 mt-0.5" />
                        <span><strong>Aplastamiento (Bearing):</strong> Rosca incluida (N) o excluida (X) del plano de corte.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-amber-400 mt-0.5" />
                        <span><strong>Deslizamiento Crítico (Slip-Critical):</strong> Obligatorio en orificios sobredimensionados o ranurados con inversión de carga sísmica.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-amber-400 mt-0.5" />
                        <span><strong>Conjunto de ensamble:</strong> Tuercas pesadas ASTM A563 DH y arandelas endurecidas ASTM F436.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Card 3: Anclajes ASTM F1554 */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                        ASTM F1554-20
                      </span>
                      <span className="text-xs font-mono text-slate-400">Pernos de Anclaje</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                      Bases de Columnas y Anclajes Dúctiles en Chile
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Bajo NCh2369:2025, el anclaje debe ser el elemento fusible dúctil o proteger la fundación:
                    </p>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-emerald-400 mt-0.5" />
                        <span>Usar ASTM F1554 Grado 55 o Grado 36. Prohibido usar barras de hormigón roscadas.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-emerald-400 mt-0.5" />
                        <span>Longitud libre de estiramiento no adherida para permitir deformación plástica del perno.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-emerald-400 mt-0.5" />
                        <span>Espesor de mortero Grout autonivelante sin retracción (típicamente 30 a 50 mm).</span>
                      </li>
                    </ul>
                  </div>

                  {/* Card 4: Soldaduras AWS D1.1 vs D1.8 */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                        AWS D1.1:2025 & AWS D1.8:2025
                      </span>
                      <span className="text-xs font-mono text-slate-400">Soldadura Sísmica & Simbología A2.4</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                      Soldadura Estructural: Biseles, Filetes y Zonas Protegidas
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      En marcos rígidos de momento (SMF) y arriostramientos concéntricos (SCBF):
                    </p>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-cyan-400 mt-0.5" />
                        <span>Biseles de penetración completa (CJP) en empalmes de alas de viga a columna.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-cyan-400 mt-0.5" />
                        <span>Uso de electrodos calificados bajo AWS D1.8 con tenacidad al impacto Charpy garantizada.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-cyan-400 mt-0.5" />
                        <span>Identificar en el modelo las 'Zonas Protegidas' donde maestranza no puede soldar orejas de izaje.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* SECCIÓN 3: HORMIGÓN ARMADO */}
              <section id="hormigon-armado" data-title="Hormigón (DS 60 / ACI / NCh170)" className="scroll-mt-28 space-y-8 pt-8 border-t border-slate-800/80">
                <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-4">
                  <i className="fa-solid fa-cube text-emerald-400 text-xl mt-1" />
                  <div className="text-xs sm:text-sm text-slate-300 space-y-1">
                    <strong className="text-white block font-bold">
                      El Flujo del Diseñador Estructural de Hormigón: DS 60, NCh430, ACI 315R y NCh204
                    </strong>
                    <p>
                      Modelar enfierradura en 3D (Revit Rebar o Tekla Rebar) exige un dominio riguroso de la geometría.
                      En Chile rige el Decreto Supremo N.º 60 del MINVU sobre ACI 318S-08, con estricto control de espesores
                      mínimos de muros de corte, estribos cerrados a 135° y tablas de doblado bajo NCh204 / ACI 315R.
                    </p>
                  </div>
                </div>

                {/* Bento Cards Hormigón */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: DS 60 Muros y Confinamiento */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                        DS N.º 60/2011 MINVU
                      </span>
                      <span className="text-xs font-mono text-slate-400">Muros Sísmicos Chilenos</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                      Espesores Mínimos y Confinamiento de Cabezales
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      El DS 60 incorporó lecciones críticas tras el sismo de 2010 para evitar pandeo de armaduras:
                    </p>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-emerald-400 mt-0.5" />
                        <span>Espesor mínimo de muros: e ≥ h/25, con un valor mínimo práctico de 20 cm en subterráneos.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-emerald-400 mt-0.5" />
                        <span>Doble malla obligatoria en todo muro con espesor mayor o igual a 20 cm.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-emerald-400 mt-0.5" />
                        <span>Elementos de borde (cabezales) confinados con estribos cerrados y trabas horizontales alternadas.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Card 2: ACI 315R Guía de Detallamiento */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                        ACI 315R-18 & NCh204:2020
                      </span>
                      <span className="text-xs font-mono text-slate-400">Despiece de Armaduras</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                      Radios de Mandril y Ganchos Estándar a 135°
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Al generar despieces automáticos en Revit o Tekla, el diámetro de mandril previene fracturas:
                    </p>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-cyan-400 mt-0.5" />
                        <span>Barras Ø8 a Ø25: Diámetro interior de doblado 4db.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-cyan-400 mt-0.5" />
                        <span>Barras Ø28 a Ø36: Diámetro interior de doblado 6db para evitar microfisuración.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-cyan-400 mt-0.5" />
                        <span>Ganchos sísmicos: 135° con prolongación de 6db (≥ 75 mm) rematando en el núcleo confinado.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Card 3: NCh170 y Recubrimientos */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                        NCh170:2016 & ACI 117
                      </span>
                      <span className="text-xs font-mono text-slate-400">Recubrimientos & Tolerancias</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                      Durabilidad y Espaciamiento Libre entre Barras
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Un modelo BIM sin espacio para el vibrado genera nidos de piedra graves en obra:
                    </p>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-amber-400 mt-0.5" />
                        <span>Recubrimiento libre mínimo: 75 mm en fundaciones; 50 mm en exteriores; 25 mm en vigas interiores.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-amber-400 mt-0.5" />
                        <span>Separación libre entre barras: No menor a db, 25 mm o 1.33 veces el tamaño máximo del árido (NCh163).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-amber-400 mt-0.5" />
                        <span>Tolerancia de colocación según ACI 117: ±6 mm en losas y ±10 mm en vigas perimetrales.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Card 4: Soldadura de barras AWS D1.4 */}
                  <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-300 text-xs font-mono font-bold">
                        AWS D1.4 & ASTM A706
                      </span>
                      <span className="text-xs font-mono text-slate-400">Soldabilidad de Armaduras</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                      ¿Cuándo se Puede Soldar una Barra de Refuerzo?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Uno de los errores más peligrosos en planos de detalle:
                    </p>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-triangle-exclamation text-red-400 mt-0.5" />
                        <span><strong>¡PROHIBIDO SOLDAR!</strong> barras estándar NCh204 A630-420H o ASTM A615 sin procedimiento WPS calificado.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-emerald-400 mt-0.5" />
                        <span>Solo se permite soldar barras de baja aleación <strong>ASTM A706</strong> con Carbono Equivalente controlado (CE ≤ 0.55%).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-emerald-400 mt-0.5" />
                        <span>En barras no soldables, emplear traslapes mecánicos (coplas de apriete o roscadas) certificadas.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* SECCIÓN 4: MATRIZ DE REFERENCIAS CRUZADAS */}
              <section id="referencias-cruzadas" data-title="Matriz de Referencias Cruzadas (29)" className="scroll-mt-28 space-y-8 pt-8 border-t border-slate-800/80">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
                      Interacción Normativa & Trazabilidad
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      29 Relaciones Analizadas (19 Verificadas / 10 Propuestas)
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans">
                    Cómo leer las referencias cruzadas entre normas de cálculo, materiales y ensayos
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Una norma de cálculo o reglamento (como DS 60 o AISC 360) puede citar otra norma para definir un material,
                    un método de ensayo, un procedimiento de control o tolerancias de montaje.
                    <strong> Debe consultarse siempre la edición citada por el documento de origen</strong>: una revisión posterior
                    del organismo emisor no reemplaza automáticamente esa referencia sin un decreto o adenda formal.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300 flex items-start gap-3">
                    <i className="fa-solid fa-lightbulb text-amber-400 text-sm mt-0.5" />
                    <span>
                      <strong>Distinción Crítica:</strong> La tabla siguiente diferencia las <em>relaciones comprobadas</em> (con citas verificadas en decretos o textos normativos)
                      de las <em>complementarias propuestas por utilidad práctica</em> para proyectistas y modeladores.
                    </span>
                  </div>
                </div>

                {/* Filtros de la Matriz de Referencias */}
                <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="relative flex-1">
                      <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                      <input
                        type="text"
                        placeholder="Filtrar por origen, norma relacionada o interpretación (ej. DS 60, NCh170, AISC 360, pernos)..."
                        value={refSearchQuery}
                        onChange={(e) => setRefSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-white placeholder-slate-500 font-mono"
                      />
                    </div>

                    <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-1 text-xs font-mono">
                      {[
                        { id: "todas", label: "Todas (29)" },
                        { id: "verificadas", label: "Verificadas (19)" },
                        { id: "propuestas", label: "Propuestas (10)" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setRefFilterTipo(item.id)}
                          className={`px-3 py-1 rounded-lg transition-all ${
                            refFilterTipo === item.id
                              ? "bg-indigo-500 text-white font-bold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Mostrando {filteredReferencias.length} de {REFERENCIAS_CRUZADAS.length} relaciones</span>
                    {refSearchQuery && (
                      <button
                        onClick={() => setRefSearchQuery("")}
                        className="text-cyan-400 hover:underline"
                      >
                        Limpiar filtro
                      </button>
                    )}
                  </div>
                </div>

                {/* Tabla Interactiva de Referencias Cruzadas */}
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Doc. de Origen</th>
                        <th className="py-3 px-4">Norma Relacionada</th>
                        <th className="py-3 px-4">Tipo de Relación</th>
                        <th className="py-3 px-4">Utilidad / Interpretación</th>
                        <th className="py-3 px-4 text-right">Fuente</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredReferencias.map((ref) => (
                        <tr key={ref.id} className="hover:bg-slate-900/90 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                            {ref.origen}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-cyan-300 font-semibold whitespace-nowrap">
                            {ref.relacionada}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold inline-block ${
                              ref.isVerified
                                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                                : "bg-slate-800 text-slate-300 border border-slate-700"
                            }`}>
                              {ref.tipoRelacion}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 leading-relaxed max-w-md">
                            {ref.interpretacion}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 text-[11px] font-mono transition-colors inline-flex items-center gap-1"
                            >
                              <span>Consultar</span>
                              <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* SECCIÓN 5: BUSCADOR DE LAS 72 NORMAS */}
              <section id="catalogo-normativo" data-title="Buscador de las 72 Normas" className="scroll-mt-28 space-y-6 pt-8 border-t border-slate-800/80">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                      Base de Datos Completa
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mt-1">
                      Catálogo Integral de las 72 Normas y Métodos de Ensayo
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
                    Revisión: {NORMAS_METADATA.fechaRevision}
                  </span>
                </div>

                {/* Barra de Filtros y Búsqueda */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="relative flex-1">
                      <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                      <input
                        type="text"
                        placeholder="Buscar por código, material (ej. ASTM A992, A630, pernos, probetas, sismo, soldadura)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Filtro País */}
                      <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-1 text-xs font-mono">
                        {[
                          { id: "todos", label: "Todos (72)" },
                          { id: "chile", label: "Chile (30)" },
                          { id: "usa", label: "USA (42)" }
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setFilterPais(item.id)}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                              filterPais === item.id
                                ? "bg-cyan-500 text-slate-950 font-bold"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>

                      {/* Filtro Categoría */}
                      <select
                        value={filterCategoria}
                        onChange={(e) => setFilterCategoria(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="todas">Todas las Disciplinas</option>
                        <option value="cargas">Cargas & Sismo</option>
                        <option value="acero">Acero Estructural</option>
                        <option value="hormigon">Hormigón Armado</option>
                        <option value="conexiones">Materiales & Conexiones</option>
                        <option value="ensayos">Ensayos & Control QA/QC</option>
                        <option value="geotecnia">Geotecnia & Suelos</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>Mostrando {filteredNormas.length} de {NORMAS_DATABASE.length} normas verificadas</span>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-cyan-400 hover:underline"
                      >
                        Limpiar búsqueda
                      </button>
                    )}
                  </div>
                </div>

                {/* Lista Interactiva de Normas */}
                <div className="space-y-4">
                  {filteredNormas.map((norma) => (
                    <div
                      key={norma.id}
                      className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-900/90 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                            norma.pais === "Chile"
                              ? "bg-red-500/10 text-red-400 border border-red-500/30"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          }`}>
                            {norma.pais}
                          </span>
                          <h4 className="text-base sm:text-lg font-bold text-white font-mono">
                            {norma.codigo}
                          </h4>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                            {norma.disciplina}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/40">
                            {norma.estado}
                          </span>
                          <a
                            href={norma.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1.5"
                          >
                            <span>Fuente Oficial</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                          </a>
                          {norma.urlVigencia && (
                            <a
                              href={norma.urlVigencia}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-mono border border-amber-500/30 transition-colors flex items-center gap-1"
                              title="Ver decreto o fuente oficial de vigencia legal"
                            >
                              <span>Decreto / Vigencia</span>
                              <i className="fa-solid fa-scale-balanced text-[10px]" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Información de Edición y Vigencia Legal */}
                      <div className="flex items-center gap-4 text-xs font-mono text-slate-400 flex-wrap">
                        <div>
                          <span className="text-slate-500">Año de Edición: </span>
                          <span className="text-white font-semibold">{norma.anoEdicion}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Año Vigencia Legal: </span>
                          <span className={`font-semibold ${
                            norma.anoVigenciaLegal === "2027" || norma.anoVigenciaLegal === "2022"
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }`}>
                            {norma.anoVigenciaLegal}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-semibold text-slate-200">
                          {norma.nombre}
                        </h5>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                          {norma.descripcion}
                        </p>
                      </div>

                      {norma.aplicabilidadEstado && (
                        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] font-mono text-slate-400 leading-relaxed">
                          <strong className="text-cyan-400 mr-1">Aplicabilidad y Estado:</strong>
                          {norma.aplicabilidadEstado}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                          <strong className="text-amber-400 font-mono text-[11px] uppercase block">
                            ¿Para qué se usa en el diseño?
                          </strong>
                          <p className="text-slate-300">{norma.paraQueSirve}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                          <strong className="text-emerald-400 font-mono text-[11px] uppercase block">
                            Enfoque del Diseñador Estructural / Modelador BIM:
                          </strong>
                          <p className="text-slate-300">{norma.enfoqueDisenador}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECCIÓN 6: CAMPOS CLAVE DEL CATÁLOGO NORMATIVO */}
              <section id="criterios-catalogo" data-title="6 Campos Clave del Catálogo" className="scroll-mt-28 space-y-8 pt-8 border-t border-slate-800/80">
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
                    <i className="fa-solid fa-table-list" />
                    <span>Metodología de Gestión Documental Técnica</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                    Los 6 Campos que Conviene Mantener en un Catálogo Normativo
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Para evitar incompatibilidades contractuales y retrasos en revisiones de cálculo o maestranza,
                    toda oficina de proyectos debe registrar estos 6 atributos mínimos en su repositorio de normas:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CAMPOS_CATALOGO.map((campo) => (
                    <div
                      key={campo.id}
                      className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                          CAMPO {campo.numero}
                        </span>
                        <h4 className="text-base font-bold text-white font-sans">
                          {campo.nombre}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {campo.descripcion}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-cyan-300/90 leading-relaxed">
                        <strong className="text-amber-400 block mb-0.5">Impacto en el Proyecto:</strong>
                        {campo.impacto}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checklist para Matriz Contractual */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-950/30 via-slate-900 to-slate-950 border border-cyan-500/30 space-y-4">
                  <h4 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                    <i className="fa-solid fa-list-check text-cyan-400" />
                    <span>Checklist para Convertir este Catálogo en Matriz Contractual de Proyecto</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Para un proyecto específico en ejecución, se deben añadir estos 5 campos complementarios
                    que requieren antecedentes particulares y revisión del texto íntegro de las normas:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                    {CHECKLIST_MATRIZ_CONTRACTUAL.map((chk, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-[11px] font-mono text-cyan-400 font-bold block uppercase">
                          {chk.item}
                        </span>
                        <p className="text-xs text-slate-400 leading-snug">{chk.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECCIÓN 7: PLANTILLA DE NOTAS PARA PLANOS */}
              <section id="plantilla-notas" data-title="Plantilla Notas de Planos" className="scroll-mt-28 space-y-8 pt-8 border-t border-slate-800/80">
                <div className="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-4">
                  <i className="fa-solid fa-copy text-cyan-400 text-xl mt-1" />
                  <div className="text-xs sm:text-sm text-slate-300 space-y-1">
                    <strong className="text-white block font-bold">
                      Plantillas Listas para AutoCAD, Revit Drafting Views y Planos de Fabricación
                    </strong>
                    <p>
                      Copia con un clic estos bloques de texto estandarizados con las referencias normativas exactas.
                      Aprobados habitualmente en revisiones estructurales independientes e Inspecciones Técnicas de Obra (ITO) en Chile.
                    </p>
                  </div>
                </div>

                {/* Bloque Acero */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-base sm:text-lg font-bold text-white font-sans flex items-center gap-2">
                      <i className="fa-solid fa-layer-group text-blue-400" />
                      <span>Notas Generales para Planos de Estructuras de Acero</span>
                    </h4>
                    <button
                      onClick={() => handleCopyNotas(plantillaNotasAcero)}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-clipboard" />
                      <span>{copySuccess ? "¡Copiado con Éxito!" : "Copiar Texto de Acero"}</span>
                    </button>
                  </div>

                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {plantillaNotasAcero}
                  </pre>
                </div>

                {/* Bloque Hormigón */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-base sm:text-lg font-bold text-white font-sans flex items-center gap-2">
                      <i className="fa-solid fa-cubes text-emerald-400" />
                      <span>Notas Generales para Planos de Hormigón Armado</span>
                    </h4>
                    <button
                      onClick={() => handleCopyNotas(plantillaNotasHormigon)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-colors flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-clipboard" />
                      <span>{copySuccess ? "¡Copiado con Éxito!" : "Copiar Texto de Hormigón"}</span>
                    </button>
                  </div>

                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {plantillaNotasHormigon}
                  </pre>
                </div>
              </section>
            </article>

            {/* BARRA LATERAL STICKY CON BLOGSCROLLSPYTOC (DESKTOP) */}
            {!isZenMode && (
              <aside className="hidden lg:block lg:col-span-4 2xl:col-span-3">
                <div className="sticky top-24">
                  <BlogScrollSpyTOC
                    items={TOC_SECTIONS}
                    title="Índice de Normas"
                    estimatedReadTime="18 min"
                    mode="sidebar"
                    isZenMode={isZenMode}
                    onZenModeToggle={() => setIsZenMode(!isZenMode)}
                  />
                </div>
              </aside>
            )}
          </div>

          {/* TOC MÓVIL Y FLOTANTE (FAB) */}
          <div className="lg:hidden">
            <BlogScrollSpyTOC
              items={TOC_SECTIONS}
              title="Índice de Normas"
              estimatedReadTime="18 min"
              mode="floating"
              isZenMode={isZenMode}
              onZenModeToggle={() => setIsZenMode(!isZenMode)}
            />
          </div>

          {/* PERFIL DEL AUTOR & COMPARTIR ARTÍCULO */}
          <section className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-lg font-mono">
                AG
              </div>
              <div className="text-xs font-mono">
                <span className="text-white font-bold block text-sm">Andrés Gallo Parra</span>
                <span className="text-slate-400">Diseñador Estructural Senior & Desarrollador BIM</span>
                <span className="text-slate-500 block">Especialista en Tekla, Revit, Python/C# y Normativas NCh/AISC/ACI</span>
              </div>
            </div>

            <ShareArticle url={shareUrl} title={shareTitle} />
          </section>

          <div className="flex justify-center pt-8">
            <BlogBackButton />
          </div>
        </main>
      )}
    </div>
  );
};

export default NormasEstructuralesChileUsa;
