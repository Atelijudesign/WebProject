# Guía Maestra de Normas Estructurales: Chile & Estados Unidos
## La Biblia Práctica del Diseñador Estructural y Modelador BIM (Acero y Hormigón Armado)

**Autor:** Andrés Gallo Parra · Diseñador Estructural Senior & Especialista en Automatización BIM  
**Fecha de Publicación:** 29 de Septiembre de 2026  
**Especialidad:** Ingeniería de Detalle, Modelado 3D (Tekla Structures, Autodesk Revit, AutoCAD) y Automatización (Python/C#)  
**Alcance:** Edificación de Alta Complejidad, Infraestructura Crítica y Plantas Industriales / Gran Minería  

---

## 🏗️ 1. Manifiesto del Diseñador Estructural: De la Memoria de Cálculo a la Maestranza

En una oficina de proyectos de ingeniería estructural, existe una brecha histórica que todo diseñador estructural senior conoce:
> *“El ingeniero calculista define los esfuerzos axiales, momentos flectores y las secciones mínimas. Pero somos nosotros, los **diseñadores estructurales y modeladores BIM**, quienes materializamos el modelo tridimensional, resolvemos las interferencias geométricas de armado, garantizamos el paso del hormigón entre barras, definimos las holguras de pernos pretensados y redactamos las Notas Generales que van a maestranza o a enfierradores en obra.”*

Un modelador BIM que desconoce las normas solo copia bocetos. Un **Diseñador Estructural de Alto Valor** entiende qué norma gobierna cada componente, anticipa los cuellos de botella de fabricación (AISC 303), evita la congestión de barras en cabezales de muros sísmicos (DS 60 / ACI 315R) y asegura que las tolerancias en terreno (ACI 117) permitan montar la estructura sin tener que cortar ni barrenar perfiles en faena.

A continuación, se presenta la selección estructurada de **35 normas, códigos y especificaciones críticas** (14 chilenas y 21 estadounidenses), su función analítica, su impacto directo en el modelado 3D y las transiciones normativas de 2026.

---

## 🇨🇱 2. Ecosistema Normativo de Chile (14 Normas Clave)

### 2.1 Cargas y Criterios Sísmicos

| Norma / Código | Nombre Oficial | ¿Para qué la usa el Calculista? | Impacto Directo en el Modelado 3D & Planos (Diseñador Estructural) |
|---|---|---|---|
| **NCh3171:2017** | Disposiciones generales y combinaciones de cargas | Define las combinaciones gobernantes de diseño (LRFD / ASD) ponderando cargas muertas, vivas, sismo y viento. | Base para estructurar el cuadro de "Cargas y Combinaciones" en la primera lámina de Notas Generales. Permite verificar si las reacciones de anclaje son últimas o de servicio. |
| **NCh1537:2009** | Cargas permanentes y sobrecargas de uso | Asigna sobrecargas mínimas según destino: oficinas, pasarelas, escaleras y plataformas industriales (300 a 500 kgf/m²). | Define el dimensionamiento de perfiles portantes de pasarelas (canales C), planchas de piso diamantadas y paneles grating electroforjados (resistencia a flexión local). |
| **NCh432:2025** | Cargas de viento | Nueva norma de presiones y succiones de viento sobre naves, galpones y cerramientos perimetrales. | Influye directamente en la cantidad y espaciamiento de fijaciones (tornillos autoperforantes) y la modulación de costaneras en zonas de cumbrera, aleros y esquinas. |
| **NCh431:2010** | Cargas de nieve | Establece solicitaciones de nieve acumulada y sobrecargas asimétricas por viento (actualmente en revisión INN). | Condiciona pendientes mínimas de cubiertas cordilleranas en minería y evita acumulaciones críticas en canoas o encuentros de naves adosadas. |
| **NCh433:2026** | Diseño sísmico de edificios | Actualiza espectros de aceleración y requisitos de derivas de entrepiso (transición de 6 meses según Decreto Exento 28). | Define el ancho milimétrico de las **juntas de dilatación sísmica** entre cuerpos de edificios y holguras en pasarelas de conexión o muros cortina. |
| **DS N.º 61/2011** | Reglamento de diseño sísmico de edificios | Complemento legal de NCh433 post-27F. Clasifica los suelos de fundación (Tipos A al F) y redefine espectros elásticos. | Determina la necesidad de vigas de atado o losa continua de fundación para evitar desplazamientos relativos en suelos compresibles (Suelos D, E, F). |
| **NCh2369:2025** | Diseño sísmico de estructuras e instalaciones industriales | **La norma madre en minería e industria pesada chilena.** Fija requisitos estrictos de amortiguamiento y ductilidad. | Obliga a modelar arriostramientos concéntricos con cartelas robustas, respetar zonas de rótula plástica y diseñar anclajes con pernos de cuello elástico. |

---

### 2.2 Acero Estructural en Chile

| Norma / Código | Nombre Oficial | ¿Para qué la usa el Calculista? | Impacto Directo en el Modelado 3D & Planos (Diseñador Estructural) |
|---|---|---|---|
| **NCh427/1:2016** | Cálculo de estructuras de acero para edificios | Especificación chilena de acero homologada con ANSI/AISC 360 (LRFD y ASD). | Establece límites de esbeltez (KL/r), pandeo local de alas y almas, y reglas para detallar empalmes de columnas a tercio de altura libre. |
| **NCh427/2:2019** | Miembros de acero conformados en frío | Regula perfiles plegados en frío a partir de flejes o bobinas delgadas de acero (galvanizado o negro). | **¡Regla de oro al modelar!**: Se debe usar el espesor base del acero sin considerar el recubrimiento de zinc ($t_{base}$) y respetar radios de curvatura interiores de plegado. |
| **NCh203** | Acero para uso estructural: requisitos | Define las calidades mecánicas del acero laminado en Chile: A270ES (Fy=270 MPa) y A345ES (Fy=345 MPa). | Todo plano de acero con perfiles ICHA nacionales debe especificar expresamente si el acero es A270ES o A345ES (con tenacidad sísmica garantizada). |

---

### 2.3 Hormigón Armado en Chile

| Norma / Código | Nombre Oficial | ¿Para qué la usa el Calculista? | Impacto Directo en el Modelado 3D & Planos (Diseñador Estructural) |
|---|---|---|---|
| **DS N.º 60/2011 MINVU** | Reglamento de diseño y cálculo para hormigón armado | **La ley en Chile para hormigón armado.** Adopta ACI 318S-08 con adecuaciones severas tras el terremoto del 27F. | **Exigencias obligatorias de modelado**: Espesores de muros e ≥ h/25 (mínimo 20 cm en subterráneos), confinamiento de cabezales y estribos cerrados a 135°. |
| **NCh430:2008** | Hormigón armado: requisitos de diseño y cálculo | Norma de referencia chilena (su actualización basada en ACI 318-19 + DS 60 está próxima a oficializarse por el INN). | Define cuantías mínimas de armadura de repartición y temperatura en losas macizas, vigas de fundación y fundaciones directas. |
| **NCh170:2016** | Hormigón: requisitos generales | Especifica el hormigón como material: resistencia (G20, G25, G30, G35), durabilidad y condiciones de colocación. | Fija los **recubrimientos libres mínimos**: 75 mm en fundaciones contra terreno; 50 mm en caras expuestas a intemperie; 25 mm en losas y vigas interiores. |
| **NCh204:2020** | Barras laminadas en caliente para hormigón armado | Regula las barras corrugadas de acero para refuerzo: calidad estándar nacional **A630-420H** (Fy=420 MPa). | Base para configurar las tablas de despiece y cubicaciones automáticas en Revit/Tekla: diámetros nominales comerciales disponibles (Ø8 a Ø36 mm). |

---

## 🇺🇸 3. Ecosistema Normativo de Estados Unidos (21 Normas Clave)

En proyectos de gran minería (Codelco, BHP, Antofagasta Minerals, Teck, Collahuasi) y plantas industriales desarrolladas por ingenierías multinacionales (Bechtel, Fluor, Wood, Hatch, Ausenco), los códigos estadounidenses son el estándar contractual diario.

### 3.1 Cargas y Diseño General

| Norma / Código | Nombre Oficial | ¿Para qué la usa el Calculista? | Impacto Directo en el Modelado 3D & Planos (Diseñador Estructural) |
|---|---|---|---|
| **IBC (International Building Code)** | Código Internacional de Edificación | Código modelo rector adoptado en EE.UU. y marco legal para especificaciones de proyectos internacionales. | Clasifica el tipo de ocupación y los requerimientos de protección pasiva contra el fuego (ignifugado de perfiles metálicos). |
| **ASCE/SEI 7-22** | Cargas mínimas de diseño para edificios | Estándar madre de solicitaciones ambientales: viento, sismo, nieve, hielo y combinaciones. | Define solicitaciones en componentes y soportes no estructurales (bandejas eléctricas, racks de cañerías, soportes de piping). |

---

### 3.2 Acero Estructural: Diseño, Sísmica, Maestranza y Pernos

| Norma / Código | Nombre Oficial | ¿Para qué la usa el Calculista? | Impacto Directo en el Modelado 3D & Planos (Diseñador Estructural) |
|---|---|---|---|
| **ANSI/AISC 360-22** | Especificación para edificios de acero estructural | La norma mundial de diseño en acero: miembros en tracción, compresión, flexión y diseño de conexiones. | Regula distancias mínimas al borde en perforaciones de pernos (1.25d a 1.75d), espaciamiento paso (3d) y límites de desgarramiento por bloque de corte. |
| **ANSI/AISC 341-22** | Disposiciones sísmicas para edificios de acero | Requisitos de ductilidad para zonas sísmicas: marcos de momento (SMF/IMF) y arriostramientos (SCBF/BRBF). | **Identifica las "Zonas Protegidas" (Protected Zones)**: Áreas del perfil donde queda estrictamente prohibido taladrar o soldar orejas de montaje. |
| **ANSI/AISC 358-22** | Conexiones precalificadas para marcos de momento | Estandariza geometrías de conexiones viga-columna sin necesidad de ensayos individuales de laboratorio. | Entrega las ecuaciones geométricas exactas para modelar en 3D la viga de sección reducida (**RBS Dogbone**) o placas extremas empernadas (**Bolted Extended End-Plate**). |
| **ANSI/AISC 303-22** | Código de práctica estándar de acero | **La biblia contractual del modelador y taller de maestranza.** Regula planos de fabricación y tolerancias de montaje. | **Mandatorio para diseñadores estructurales**: Define la información mínima que debe tener el plano de diseño y fija la tolerancia de verticalidad en columnas (1:500). |
| **RCSC 2020** | Especificación para uniones apernadas de alta resistencia | Regula el diseño, apriete y verificación de conjuntos de pernos estructurales de alta resistencia. | Fija los tipos de unión: **Aplastamiento** (Bearing: rosca N o X) vs **Deslizamiento Crítico** (Slip-Critical) y las holguras de orificios ranurados o sobredimensionados. |
| **ASTM F3125/F3125M** | Pernos estructurales de alta resistencia | Especificación que engloba y reemplazó a los históricos pernos **A325 y A490** (Tipos 1 y 3). | En planos se debe indicar: "Pernos ASTM F3125 Grado A325 con tuerca pesada ASTM A563 DH y arandela endurecida ASTM F436". |
| **ASTM F1554** | Pernos de anclaje de acero para fundaciones | La única norma de anclajes con garantía de ductilidad en tres grados: Grado 36, Grado 55 y Grado 105. | Define anclajes de placas base. **Exige pernos de barra lisa roscada** (no barras de hormigón roscadas) con arandela de anclaje y tuercas niveladoras. |
| **ASTM A36/A36M** | Acero estructural al carbono | Acero al carbono con límite de fluencia nominal Fy = 250 MPa (36 ksi). | Material por excelencia para planchas de nudo, cartelas secundarias, atiesadores y perfiles angulares ligeros. |
| **ASTM A992/A992M** | Perfiles laminados de alta resistencia (Fy=50 ksi) | Diseñada exclusivamente para perfiles laminados en caliente tipo W (Wide Flange), con Fy = 345 MPa y relación Fy/Fu ≤ 0.85. | El acero por defecto para todas las vigas y columnas W importadas que modelamos en Revit o Tekla en proyectos industriales. |
| **ASTM A500/A500M** | Tubos estructurales conformados en frío (HSS) | Especifica tubos cuadrados, rectangulares y redondos en Grado B (Fy=46 ksi) o Grado C (Fy=50 ksi). | **¡Alerta de cálculo!**: AISC exige calcular y detallar con un espesor efectivo del 93% del espesor nominal (0.93 tnom) debido al rolado. |

---

### 3.3 Hormigón Armado: Código, Tolerancias, Armaduras y Pernos

| Norma / Código | Nombre Oficial | ¿Para qué la usa el Calculista? | Impacto Directo en el Modelado 3D & Planos (Diseñador Estructural) |
|---|---|---|---|
| **ACI CODE-318-25** | Código para hormigón estructural | La última edición publicada en EE.UU. para requisitos de diseño, durabilidad y armaduras. | **¡Ojo en Chile!**: No sustituye automáticamente al DS 60/2011; solo se aplica si las bases contractuales de la minera lo exigen formalmente. |
| **ACI SPEC-301-20** | Especificaciones para construcción de hormigón | Especificación contractual de referencia para colocación, curado y control de calidad en obra. | Dicta la ubicación de separadores, calugas y la separación mínima entre barras para permitir el vibrado sin segregación. |
| **ACI SPEC-117-10 (R2015)** | Tolerancias para construcción de hormigón | **Norma maestra de tolerancias dimensionales en hormigón.** Fija límites de desplome, nivelación y recubrimientos reales. | **Vital en interfaces hormigón-acero**: Fija la tolerancia de colocación de pernos de anclaje e insertos metálicos (±6 mm a ±12 mm) para dimensionar orificios en placas. |
| **ACI 315R-18** | Guía para presentar detalles de armaduras | **El manual sagrado del detallador de enfierradura.** Estandariza la elaboración de planos de colocación y despiece de barras. | Define tablas de doblado, radios de mandril, traslapes Clase A y B, y estandariza las figuras de barras para cubicación en Revit/Tekla. |
| **ASTM A615/A615M** | Barras de acero al carbono corrugadas para refuerzo | Barras de refuerzo estándar en EE.UU. (Grado 60, Fy = 420 MPa). | Barras de armadura convencional. **No aptas para soldadura reglamentaria**; requieren empalmes por traslape o coplas mecánicas. |
| **ASTM A706/A706M** | Barras de acero de baja aleación soldables | Barras corrugadas con composición química controlada (CE ≤ 0.55%) y ductilidad controlada para zonas sísmicas. | **Mandatoria si en los planos se deben soldar barras a insertos metálicos** o en cabezales con demandas inelásticas extremas. |

---

### 3.4 Soldadura Estructural (AWS)

| Norma / Código | Nombre Oficial | ¿Para qué la usa el Calculista? | Impacto Directo en el Modelado 3D & Planos (Diseñador Estructural) |
|---|---|---|---|
| **AWS D1.1/D1.1M:2025** | Código de soldadura estructural de acero | El código canónico de soldadura para acero al carbono: calificación de WPS, soldadores e inspección. | Estandariza los símbolos de soldadura en láminas (garganta efectiva, longitud, bisel CJP/PJP, soldadura de taller vs terreno). |
| **AWS D1.8/D1.8M:2025** | Suplemento sísmico de soldadura estructural | Requisitos adicionales para uniones soldadas en estructuras sismorresistentes que disipan energía plástica. | Exige electrodos con tenacidad al impacto Charpy garantizada a baja temperatura y orificios de acceso para soldadura (*rat holes*) con radios amplios. |
| **AWS D1.4/D1.4M:2018** | Soldadura de barras de acero de refuerzo | Regula uniones soldadas entre barras corrugadas o entre barras e insertos embebidos de acero. | **¡Peligro crítico en obra!**: Prohíbe terminantemente soldar barras NCh204 A630-420H o ASTM A615 comunes. Exige usar barras soldables ASTM A706. |

---

## ⚡ 4. Los 3 Puntos Ciegos de Transición Normativa 2026

Al diseñar o modelar en 2026, cometer errores de citación en los rótulos o aplicar versiones incorrectas puede generar observaciones de revisores independientes o rechazos de la ITO. Toma nota de estos tres puntos:

1. **NCh433:2026 fue promulgada, pero opera bajo un período de transición.**  
   El Decreto Exento N.º 28 del MINVU (publicado el 10 de agosto de 2026) estableció un plazo diferido de **6 meses** antes de que la nueva edición sea legalmente exigible en los permisos de edificación. Durante este período, se debe coordinar con el ingeniero calculista si el proyecto ingresa bajo NCh433:1996 Mod. 2009 + DS 61 o bajo la nueva versión.
2. **NCh430 se encuentra en proceso final de modernización en el INN.**  
   La nueva versión armonizará ACI 318-19 con el DS 60 en un solo cuerpo normativo. Mientras el decreto oficial no esté publicado en el Diario Oficial, el marco legal vinculante en Chile continúa siendo el **Decreto Supremo N.º 60/2011 del MINVU**.
3. **ACI CODE-318-25 ya está publicado en EE.UU., pero no rige automáticamente en Chile.**  
   Aunque el ACI publicó su edición 2025, el marco legal chileno está anclado por decreto al texto de ACI 318S-08 con modificaciones nacionales. Nunca reemplaces requisitos del DS 60 por ediciones recientes de ACI sin la instrucción escrita del Ingeniero Patrocinante.

---

## 📋 5. Plantilla de Notas Generales para Planos Estructurales

Puedes copiar directamente estos bloques de texto para incorporarlos en las láminas de criterios generales en AutoCAD o Revit Drafting Views:

### Bloque A: Estructuras de Acero
```text
NOTAS GENERALES DE ESTRUCTURAS DE ACERO (INGENIERÍA DE DETALLE)

1. CÓDIGOS Y NORMAS DE DISEÑO:
   - DISEÑO ESTRUCTURAL: NCh427/1:2016 / ANSI/AISC 360-22 (MÉTODO LRFD).
   - DISEÑO SÍSMICO INDUSTRIAL: NCh2369:2025 / ANSI/AISC 341-22.
   - CÓDIGO DE PRÁCTICA ESTÁNDAR: ANSI/AISC 303-22.
   - SOLDADURA ESTRUCTURAL: AWS D1.1/D1.1M:2025 (ELECTRODOS SERIE E70XX).
   - UNIONES APERNADAS: RCSC 2020 / ASTM F3125.

2. MATERIALES:
   - PERFILES LAMINADOS W Y SECCIONES ARMADAS: ASTM A992 GRADO 50 O NCh203 A345ES (Fy = 345 MPa).
   - PLANCHAS, CARTELAS Y ATIESADORES: ASTM A36 O NCh203 A270ES (Fy = 250 MPa).
   - PERFILES TUBULARES HSS: ASTM A500 GRADO B O C.
   - PERFILES CONFORMADOS EN FRÍO (COSTANERAS): NCh427/2:2019 / ASTM A653 SQ GRADO 50 GALVANIZADO.

3. CONEXIONES APERNADAS Y ANCLAJES:
   - PERNOS ESTRUCTURALES: ASTM F3125 GRADO A325 TIPO 1, EN UNIONES DE APLASTAMIENTO CON ROSCA EXCLUIDA (X).
   - PERNOS DE ANCLAJE: ASTM F1554 GRADO 55 CON TUERCA PESADA ASTM A563 DH Y ARANDELA ASTM F436 SEGÚN DETALLE.
   - MORTERO DE NIVELACIÓN (GROUT): AUTONIVELANTE SIN RETRACCIÓN, f'c MÍNIMO = 50 MPa A 28 DÍAS.

4. TOLERANCIAS Y FABRICACIÓN:
   - LAS TOLERANCIAS DE FABRICACIÓN EN MAESTRANZA Y MONTAJE SE REGIRÁN POR AISC 303-22.
   - QUEDA PROHIBIDO PERFORAR O SOLDAR EN LAS "ZONAS PROTEGIDAS" DEFINIDAS EN AISC 341-22 SIN APROBACIÓN PREVIA.
```

### Bloque B: Hormigón Armado
```text
NOTAS GENERALES DE HORMIGÓN ARMADO (ENFIERRADURAS Y MONOLITISMO)

1. REGLAMENTACIÓN Y CÓDIGOS:
   - REGLAMENTO DE DISEÑO: DECRETO SUPREMO N.º 60/2011 MINVU / ACI 318S-08.
   - DISEÑO SÍSMICO: NCh433:2026 (RÉGIMEN DE TRANSICIÓN DTO. 28) Y DS N.º 61/2011 MINVU.
   - HORMIGÓN MATERIAL: NCh170:2016.
   - DETALLAMIENTO DE ARMADURAS: ACI 315R-18.
   - TOLERANCIAS DIMENSIONALES: ACI 117-10 (REAPROBADA 2015).

2. ESPECIFICACIÓN DEL HORMIGÓN Y RECUBRIMIENTOS (NCh170:2016):
   - FUNDACIONES Y VIGAS DE ATADO: HORMIGÓN G25 (f'c = 25 MPa). RECUBRIMIENTO LIBRE = 75 mm (CONTRA TERRENO).
   - MUROS Y COLUMNAS: HORMIGÓN G30 (f'c = 30 MPa). RECUBRIMIENTO = 25 mm (INTERIOR) / 50 mm (EXTERIOR).
   - LOSAS Y VIGAS SUPERIORES: HORMIGÓN G25 (f'c = 25 MPa). RECUBRIMIENTO = 25 mm.
   - TAMAÑO MÁXIMO DEL ÁRIDO (TM): 3/4" (19 mm) PARA GARANTIZAR FLUJO ENTRE ARMADURAS Y EVITAR NIDOS DE PIEDRA.

3. ACERO DE REFUERZO (ENFIERRADURA):
   - BARRAS CORRUGADAS: NCh204:2020 CALIDAD A630-420H (Fy = 420 MPa).
   - RADIOS DE MANDRIL MÍNIMOS: Ø8 A Ø25: 4db; Ø28 A Ø36: 6db (CONFORME A ACI 315R-18).
   - ESTRIBOS DE CONFINAMIENTO: CERRADOS CON GANCHOS SÍSMICOS A 135° Y REMATE MÍNIMO DE 6db (>= 75 mm).
   - PROHIBICIÓN DE SOLDADURA: PROHIBIDO SOLDAR BARRAS DE ACERO A630-420H (AWS D1.4). EMPALMES MEDIANTE TRASLAPE TRADICIONAL O CONECTORES MECÁNICOS CERTIFICADOS.
```

---

## 🎯 6. Conclusión para el Diseñador Estructural de Hoy

El modelado estructural contemporáneo ya no es un dibujo plano: es una base de datos tridimensional que alimenta a los robots de corte CNC en maestranzas y a las dobladoras automatizadas de enfierradura en planta.

Dominar estas 35 normas permite:
1. **Evitar sobrecostos y atrasos:** Detectar interferencias normativas antes de emitir planos para fabricación.
2. **Ganar autoridad técnica:** Fundamentar ante calculistas, jefes de proyecto e ITOs por qué un radio de doblado, una holgura de perno o un espesor de muro no pueden ser modificados arbitrariamente.
3. **Liderar la transición tecnológica:** Vincular modelos BIM en Tekla y Revit con automatizaciones en Python y Dynamo bajo las exigencias reales de la ingeniería chilena e internacional.
