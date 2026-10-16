# ==============================================================================
# SCRIPT MAESTRO DE ORGANIZACIÓN DE PORTAFOLIO PROFESIONAL
# ANDRÉS GALLO P. - SENIOR STRUCTURAL BIM DESIGNER
# ==============================================================================
param(
    [string]$TargetRoot = "G:\Mi unidad\Atelijudesign\01_Profesional\PORTAFOLIO_MASTER_PROYECTOS",
    [switch]$VerboseLog = $true
)

$ErrorActionPreference = "SilentlyContinue"

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " INICIANDO ENSAMBLAJE DE PORTAFOLIO MASTER DE PROYECTOS " -ForegroundColor Cyan
Write-Host " Destino: $TargetRoot" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan

if (!(Test-Path $TargetRoot)) {
    New-Item -ItemType Directory -Path $TargetRoot -Force | Out-Null
}

$MasterCatalog = @()

function Safe-CopyFiles {
    param(
        [string[]]$SourcePaths,
        [string]$DestFolder,
        [string]$FilterRegex,
        [int]$MaxFiles = 30
    )
    if (!(Test-Path $DestFolder)) {
        New-Item -ItemType Directory -Path $DestFolder -Force | Out-Null
    }
    
    $copied = 0
    foreach ($src in $SourcePaths) {
        if ($src -and (Test-Path $src)) {
            $files = Get-ChildItem -Path $src -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Extension -match $FilterRegex }
            foreach ($f in $files) {
                if ($copied -ge $MaxFiles) { break }
                $destFile = Join-Path $DestFolder $f.Name
                if (!(Test-Path $destFile)) {
                    Copy-Item -Path $f.FullName -Destination $destFile -Force
                    $copied++
                }
            }
        }
        if ($copied -ge $MaxFiles) { break }
    }
    return $copied
}

function Build-ProjectPackage {
    param(
        [hashtable]$Proj
    )

    $folderName = "$($Proj.Id)_$($Proj.ShortName)"
    $projDir = Join-Path $TargetRoot $folderName
    $imgDir  = Join-Path $projDir "imagenes"
    $modDir  = Join-Path $projDir "modelos"
    $docDir  = Join-Path $projDir "informes"

    Write-Host "`n[+] Procesando: $($Proj.Id) - $($Proj.Name)" -ForegroundColor Green

    # Crear carpetas base
    New-Item -ItemType Directory -Path $imgDir -Force | Out-Null
    New-Item -ItemType Directory -Path $modDir -Force | Out-Null
    New-Item -ItemType Directory -Path $docDir -Force | Out-Null

    # Copiar Imágenes (.jpg, .jpeg, .png, .webp)
    $imgCopied = Safe-CopyFiles -SourcePaths $Proj.ImageSources -DestFolder $imgDir -FilterRegex '\.(jpg|jpeg|png|webp|bmp)$' -MaxFiles 35

    # Copiar Modelos 3D y Planos (.rvt, .nwd, .ifc, .skp, .dwg, .dxf)
    $modCopied = Safe-CopyFiles -SourcePaths $Proj.ModelSources -DestFolder $modDir -FilterRegex '\.(rvt|nwd|ifc|skp|dwg|dxf|tekla)$' -MaxFiles 15

    # Copiar Informes y Memorias (.pdf, .docx, .xlsx, .pptx)
    $docCopied = Safe-CopyFiles -SourcePaths $Proj.DocSources -DestFolder $docDir -FilterRegex '\.(pdf|docx|xlsx|pptx)$' -MaxFiles 20

    # Crear metadata.json
    $meta = [ordered]@{
        id             = $Proj.Id
        name           = $Proj.Name
        name_en        = $Proj.NameEn
        client         = $Proj.Client
        company        = $Proj.Company
        country        = $Proj.Country
        city           = $Proj.City
        year           = $Proj.Year
        project_type   = $Proj.Type
        project_type_en= $Proj.TypeEn
        material       = $Proj.Material
        role           = $Proj.Role
        role_en        = $Proj.RoleEn
        software       = $Proj.Software
        lod            = $Proj.LOD
        metrics        = $Proj.Metrics
        description    = $Proj.Description
        description_en = $Proj.DescriptionEn
        assets         = [ordered]@{
            total_imagenes = (Get-ChildItem -Path $imgDir -File).Count
            total_modelos  = (Get-ChildItem -Path $modDir -File).Count
            total_informes = (Get-ChildItem -Path $docDir -File).Count
            imagenes = (Get-ChildItem -Path $imgDir -File | Select-Object -ExpandProperty Name)
            modelos  = (Get-ChildItem -Path $modDir -File | Select-Object -ExpandProperty Name)
            informes = (Get-ChildItem -Path $docDir -File | Select-Object -ExpandProperty Name)
        }
    }

    $jsonPath = Join-Path $projDir "metadata.json"
    $meta | ConvertTo-Json -Depth 5 | Set-Content -Path $jsonPath -Encoding UTF8

    Write-Host "    -> Imagenes: $imgCopied | Modelos: $modCopied | Informes: $docCopied | metadata.json OK" -ForegroundColor Gray

    return [PSCustomObject]@{
        Id          = $Proj.Id
        Name        = $Proj.Name
        NameEn      = $Proj.NameEn
        Company     = $Proj.Company
        Client      = $Proj.Client
        Year        = $Proj.Year
        Type        = $Proj.Type
        Folder      = $folderName
        Imagenes    = (Get-ChildItem -Path $imgDir -File).Count
        Modelos     = (Get-ChildItem -Path $modDir -File).Count
        Informes    = (Get-ChildItem -Path $docDir -File).Count
    }
}

# Base Paths
$fOffice = "F:\06-A.G.P_INFO_TECNICA\02-OFFICE"
$gBase   = "G:\Mi unidad\Atelijudesign\01_Profesional"
$gHist   = "$gBase\01.2_Trabajo_Privado\00_HISTORIAL_LABORAL"
$gObras  = "$gHist\Portafolio_y_CV\Portafolio_Obras_Historicas"
$gFotos  = "$gObras\Fotos_y_Renders_Proyectos"
$webImg  = "c:\Users\andre\Documents\Proyectos26\proyectos\WebProject\public\assets\img"
$ghdAct  = "$gBase\01.2_Trabajo_Privado\GHD\02_Proyectos_Activos"

# ==============================================================================
# DEFINICIÓN DEL CATÁLOGO MAESTRO DE PROYECTOS
# ==============================================================================

$ProjectsDefinitions = @(
    # --- 1. GHD & MINERÍA 2026 ---
    @{
        Id           = "P-044"
        ShortName    = "Puentes_Gruas_DSAL_Codelco"
        Name         = "Normalización Puentes Grúas Fundición Potrerillos (DSAL)"
        NameEn       = "Overhead Cranes Normalization Potrerillos Smelter (DSAL)"
        Client       = "CODELCO Chile (División Salvador)"
        Company      = "GHD"
        Country      = "Chile"
        City         = "Potrerillos, Atacama"
        Year         = 2026
        Type         = "Minería"
        TypeEn       = "Mining"
        Material     = "Acero Estructural"
        Role         = "Proyectista / Diseñador Estructural"
        RoleEn       = "Structural Project Designer"
        Software     = "AutoCAD, Detallamiento Estructural CMAA-70"
        LOD          = "LOD 350"
        Metrics      = "Nave de Fundición y Taller de Moldes, CMAA-70, ECF-7"
        Description  = "Ingeniería estructural para la evaluación de integridad, mapeo de hallazgos y normalización operacional de los Puentes Grúas N° 1 y N° 2 de la Nave de Fundición Potrerillos y Taller de Moldes en Codelco División Salvador. Elaboración de planos estructurales de disposición general, mapeo de grietas, refuerzos de vigas principales, testeras y consolas bajo norma CMAA-70 y estándar corporativo ECF-7."
        DescriptionEn= "Structural engineering for structural integrity assessment, defect mapping, and operational normalization of Overhead Cranes No. 1 and No. 2 at Potrerillos Smelter Aisle and Mold Shop in Codelco Salvador Division. Structural general arrangement drawings, crack mapping, box girder reinforcements, end trucks, and bracket details under CMAA-70 and Codelco ECF-7 standards."
        ImageSources = @("$webImg\codelco_dsal*")
        ModelSources = @((Get-ChildItem -Path $ghdAct -Directory | Where-Object { $_.Name -like "*12684444*" }).FullName)
        DocSources   = @((Get-ChildItem -Path $ghdAct -Directory | Where-Object { $_.Name -like "*12684444*" }).FullName)
    },
    @{
        Id           = "P-043"
        ShortName    = "EFE_Santiago_Batuco_OT181"
        Name         = "Segundo Acceso Estaciones Tramo Santiago - Batuco (OT181)"
        NameEn       = "Second Access Stations Santiago - Batuco Railway (OT181)"
        Client       = "EFE Trenes de Chile"
        Company      = "GHD"
        Country      = "Chile"
        City         = "Santiago / Batuco"
        Year         = 2026
        Type         = "Infraestructura"
        TypeEn       = "Infrastructure"
        Material     = "Hormigón Armado + Acero"
        Role         = "Proyectista Estructural BIM"
        RoleEn       = "Structural BIM Designer"
        Software     = "Autodesk Revit, Navisworks, AutoCAD"
        LOD          = "LOD 350"
        Metrics      = "5 Modelos RVT Estructurales Federados, Túneles Peatonales"
        Description  = "Modelado y coordinación BIM multidisciplinaria para los segundos accesos peatonales de las estaciones del tramo ferroviario Santiago - Batuco de EFE Trenes de Chile. Modelado paramétrico en Revit de estructuras de hormigón armado, escaleras pedestres, rampas accesibles, marquesinas de acero y muros de contención con estricto control de interferencias."
        DescriptionEn= "Multidisciplinary BIM modeling and coordination for the secondary passenger station accesses along the Santiago - Batuco commuter rail line for EFE Trenes de Chile. Parametric Revit modeling of reinforced concrete structures, pedestrian stairs, accessible ramps, steel canopies, and retaining walls."
        ImageSources = @("$webImg\efe_ot181*")
        ModelSources = @((Get-ChildItem -Path $ghdAct -Directory | Where-Object { $_.Name -like "*12673272*" }).FullName)
        DocSources   = @((Get-ChildItem -Path $ghdAct -Directory | Where-Object { $_.Name -like "*12673272*" }).FullName)
    },
    @{
        Id           = "P-042"
        ShortName    = "Reemplazo_Centrifuga_Lodos_OT25029"
        Name         = "Reemplazo Centrífuga Desaguado Lodos (OT-25029)"
        NameEn       = "Sludge Dewatering Centrifuge Replacement (OT-25029)"
        Client       = "Aguas Andinas / Minería"
        Company      = "GHD"
        Country      = "Chile"
        City         = "Santiago"
        Year         = 2026
        Type         = "Industrial"
        TypeEn       = "Industrial"
        Material     = "Acero Estructural + Hormigón"
        Role         = "Proyectista Estructural"
        RoleEn       = "Structural Designer"
        Software     = "AutoCAD, Detallamiento Industrial"
        LOD          = "LOD 300"
        Metrics      = "Plataformas metálicas, pernos de anclaje, soporte vibratorio"
        Description  = "Ingeniería de detalle para el reemplazo y montaje electromecánico de la centrífuga de desaguado de lodos en planta de tratamiento. Diseño de pedestales de hormigón armado con aislamiento vibratorio y plataformas metálicas de mantenimiento."
        DescriptionEn= "Detail engineering for the replacement and electromechanical mounting of the sludge dewatering centrifuge at treatment plant. Concrete pedestal vibration isolation design and steel maintenance platforms."
        ImageSources = @()
        ModelSources = @((Get-ChildItem -Path $ghdAct -Directory | Where-Object { $_.Name -like "*12688063*" }).FullName)
        DocSources   = @((Get-ChildItem -Path $ghdAct -Directory | Where-Object { $_.Name -like "*12688063*" }).FullName)
    },
    @{
        Id           = "P-041"
        ShortName    = "Proteccion_Contra_Socavacion_12640527"
        Name         = "Servicio de Asesoría para Protección contra la Socavación"
        NameEn       = "Scour Protection Advisory Engineering Services"
        Client       = "Dirección de Vialidad MOP"
        Company      = "GHD"
        Country      = "Chile"
        City         = "Región Metropolitana"
        Year         = 2026
        Type         = "Infraestructura"
        TypeEn       = "Infrastructure"
        Material     = "Enrocados + Gaviones + Hormigón"
        Role         = "Proyectista / Modelador Civil Estructural"
        RoleEn       = "Civil Structural Modeler"
        Software     = "AutoCAD, Civil 3D"
        LOD          = "LOD 300"
        Metrics      = "Defensas fluviales, gaviones, espigones de protección"
        Description  = "Servicio de ingeniería y planimetría civil-estructural para obras de protección hidráulica contra socavación en estribos de puentes y terraplenes de acceso vial."
        DescriptionEn= "Civil-structural engineering drafting and design for hydraulic scour protection around bridge abutments and approach embankments."
        ImageSources = @()
        ModelSources = @((Get-ChildItem -Path $ghdAct -Directory | Where-Object { $_.Name -like "*12640527*" }).FullName, "$fOffice\00-GHD\01-Proyectos\12640527 - SERVICIO DE ASESORA PARA LA PROTECCIN CONTRA SOCAVACIN")
        DocSources   = @((Get-ChildItem -Path $ghdAct -Directory | Where-Object { $_.Name -like "*12640527*" }).FullName, "$fOffice\00-GHD\01-Proyectos\12640527 - SERVICIO DE ASESORA PARA LA PROTECCIN CONTRA SOCAVACIN")
    },
    @{
        Id           = "P-040"
        ShortName    = "Garden_City_Skyway_Ontario"
        Name         = "Garden City Skyway Substructure & Bridge Rehabilitation"
        NameEn       = "Garden City Skyway Substructure & Bridge Rehabilitation"
        Client       = "Ministry of Transportation of Ontario (MTO)"
        Company      = "GHD"
        Country      = "Canadá"
        City         = "St. Catharines, Ontario"
        Year         = 2026
        Type         = "Infraestructura"
        TypeEn       = "Infrastructure"
        Material     = "Acero Estructural + Hormigón Armado"
        Role         = "Senior Bridge Modeler / BIM Specialist"
        RoleEn       = "Senior Bridge Modeler / BIM Specialist"
        Software     = "Revit, AutoCAD, Bridge Detailing CISC"
        LOD          = "LOD 350"
        Metrics      = "Puente Mayor 2.2 km, Vigas cajón de acero, Pilares masivos"
        Description  = "Ingeniería de rehabilitación y refuerzo estructural del emblemático viaducto Garden City Skyway sobre el Canal Welland en Ontario. Modelado y cubicación de placas de refuerzo de acero estructural, diafragmas, vigas cajón y cepas de hormigón armado bajo estándar canadiense MTO y CISC."
        DescriptionEn= "Structural rehabilitation and reinforcement engineering for the iconic Garden City Skyway over the Welland Canal in Ontario. Structural steel retrofit plates, diaphragms, box girders, and piers under Canadian MTO/CISC standards."
        ImageSources = @()
        ModelSources = @((Get-ChildItem -Path $ghdAct -Directory | Where-Object { $_.Name -like "*12593017*" }).FullName)
        DocSources   = @((Get-ChildItem -Path $ghdAct -Directory | Where-Object { $_.Name -like "*12593017*" }).FullName)
    },

    # --- 2. BIOSMI & MINERÍA 2026 ---
    @{
        Id           = "P-039"
        ShortName    = "Lavado_SX_Planta_Franke_Cenizas"
        Name         = "Integración Segunda Etapa Lavado SX Planta Raimundo Langlois"
        NameEn       = "Second Stage SX Washing Integration Raimundo Langlois Plant"
        Client       = "Grupo Minero Las Cenizas"
        Company      = "BIOSmi"
        Country      = "Chile"
        City         = "Taltal, Antofagasta"
        Year         = 2026
        Type         = "Minería"
        TypeEn       = "Mining"
        Material     = "Acero Estructural + FRP"
        Role         = "Lead Structural BIM Modeler"
        RoleEn       = "Lead Structural BIM Modeler"
        Software     = "Autodesk Revit, Navisworks, Advance Steel"
        LOD          = "LOD 350"
        Metrics      = "Planta SX-EW, Cañerías de lavado, Estructuras soporte"
        Description  = "Modelado BIM LOD 350 para la incorporación de una etapa adicional de lavado en la planta de Extracción por Solventes (SX) y Electro-Obtención (EW) en Minera Franke. Diseño de estructuras metálicas soporte, piping racks, pasarelas de operación y canaletas resistentes a corrosión ácida."
        DescriptionEn= "LOD 350 BIM modeling for additional wash stage integration at SX-EW plant (Franke Mine). Structural steel supports, pipe racks, operation walkways, and acid-resistant launders."
        ImageSources = @()
        ModelSources = @("$gHist\2026_BIOSmi\01-Proyectos\1820 - MLC - Integracin Segunda Etapa Lavado SX-")
        DocSources   = @("$gHist\2026_BIOSmi\01-Proyectos\1820 - MLC - Integracin Segunda Etapa Lavado SX-")
    },
    @{
        Id           = "P-038"
        ShortName    = "Planta_Lavado_Sales_SQM"
        Name         = "Ingeniería Básica Planta Lavado de Sales SQM"
        NameEn       = "Basic Engineering Salt Washing Plant SQM"
        Client       = "SQM Salar"
        Company      = "BIOSmi"
        Country      = "Chile"
        City         = "Salar de Atacama"
        Year         = 2026
        Type         = "Minería"
        TypeEn       = "Mining"
        Material     = "Acero Estructural Anticorrosivo"
        Role         = "Proyectista Estructural BIM"
        RoleEn       = "Structural BIM Designer"
        Software     = "Revit, AutoCAD"
        LOD          = "LOD 300"
        Metrics      = "Naves de procesos químicos, tolvas de alimentación"
        Description  = "Diseño y modelado civil-estructural para la nueva planta de lavado de sales de litio y potasio en faena salar. Galpones industriales, silos, tolvas y fundaciones especiales sobre terreno salino."
        DescriptionEn= "Civil-structural design and modeling for the new lithium and potassium salt wash plant at Atacama Salar. Industrial sheds, silos, hoppers, and special foundations on salt terrain."
        ImageSources = @()
        ModelSources = @("$gHist\2026_BIOSmi\01-Proyectos\1822 - SQM - Ingeniera Bsica Planta Lavado de Sales")
        DocSources   = @("$gHist\2026_BIOSmi\01-Proyectos\1822 - SQM - Ingeniera Bsica Planta Lavado de Sales")
    },
    @{
        Id           = "P-037"
        ShortName    = "Obras_Mayores_PSIQ"
        Name         = "Ingeniería de Detalles Obras Mayores Proyecto PSIQ"
        NameEn       = "Detail Engineering Major Works PSIQ Project"
        Client       = "Compañía Minera del Pacífico (CMP)"
        Company      = "BIOSmi"
        Country      = "Chile"
        City         = "Huasco / Caldera"
        Year         = 2026
        Type         = "Minería"
        TypeEn       = "Mining"
        Material     = "Acero + Hormigón Masivo"
        Role         = "Modelador Estructural Senior"
        RoleEn       = "Senior Structural Modeler"
        Software     = "Revit, Navisworks"
        LOD          = "LOD 350"
        Metrics      = "Obras portuarias, cargadores de barco, correas transportadoras"
        Description  = "Ingeniería de detalles civil y estructural para obras mayores e infraestructura portuaria minera de CMP. Modelado de fundaciones masivas, estructuras de transferencia de mineral y correas transportadoras."
        DescriptionEn= "Civil and structural detail engineering for port terminal and bulk material handling works at CMP. Mass concrete foundations, transfer towers, and overland conveyors."
        ImageSources = @()
        ModelSources = @("$gHist\2026_BIOSmi\01-Proyectos\1750-0 - PSIQ - Ingeniera de Detalles Obras Mayores Proyecto PSIQ")
        DocSources   = @("$gHist\2026_BIOSmi\01-Proyectos\1750-0 - PSIQ - Ingeniera de Detalles Obras Mayores Proyecto PSIQ")
    },

    # --- 3. BLACK & VEATCH 2025 ---
    @{
        Id           = "P-035"
        ShortName    = "Proyecto_Santo_Domingo_BV"
        Name         = "Proyecto Minero Santo Domingo (Concentradora & Desaladora)"
        NameEn       = "Santo Domingo Copper-Iron Mining Project (Concentrator & Desalination)"
        Client       = "Capstone Copper"
        Company      = "Black & Veatch"
        Country      = "Chile"
        City         = "Diego de Almagro, Atacama"
        Year         = 2025
        Type         = "Minería"
        TypeEn       = "Mining"
        Material     = "Acero Estructural Pesado + Hormigón"
        Role         = "Lead Structural BIM Designer"
        RoleEn       = "Lead Structural BIM Designer"
        Software     = "Autodesk Revit, Navisworks, Tekla"
        LOD          = "LOD 350 / 400"
        Metrics      = "Planta Concentradora 60 ktpd, Molienda SAG, Espesadores"
        Description  = "Proyecto minero greenfield de cobre y hierro de US$ 2.300M. Liderazgo en el modelado BIM estructural de los edificios de molienda SAG y bolas, flotación, espesadores de relaves y acueducto de impulsión de agua de mar desalinizada. Generación de planos de disposición general y planos de armaduras de fundaciones masivas."
        DescriptionEn= "US$ 2.3B Greenfield copper-iron mining project. Leadership in structural BIM modeling for SAG and ball mill buildings, flotation circuits, tailings thickeners, and desalinated seawater pump stations."
        ImageSources = @("$gFotos\*Santo*", "$gFotos\*Collahuasi*")
        ModelSources = @("$gHist\2025_Black & Veatch\01-Proyectos\423129 - PROYECTO SANTO DOMINGO")
        DocSources   = @("$gHist\2025_Black & Veatch\01-Proyectos\423129 - PROYECTO SANTO DOMINGO")
    },

    # --- 4. DRA GLOBAL & ARCADIS 2024 ---
    @{
        Id           = "P-033"
        ShortName    = "Chancador_Primario_Arqueros"
        Name         = "Chancador Primario Besalco (Proyecto Arqueros)"
        NameEn       = "Besalco Primary Crusher (Arqueros Mining Project)"
        Client       = "Besalco Minería / Minera Arqueros"
        Company      = "DRA Global / Arcadis"
        Country      = "Chile"
        City         = "Condoriaco, Coquimbo"
        Year         = 2024
        Type         = "Minería"
        TypeEn       = "Mining"
        Material     = "Acero Estructural Grado A572 Gr.50"
        Role         = "Lead 3D Structural Modeler"
        RoleEn       = "Lead 3D Structural Modeler"
        Software     = "Autodesk Revit, Tekla Structures, Navisworks"
        LOD          = "LOD 400"
        Metrics      = "Estructura soporte chancador giratorio, tolva recepción 250t"
        Description  = "Modelado 3D de alta precisión (LOD 400) de la estructura de acero del chancador primario, tolva de vaciado para camiones CAEX de 150t, plataformas operativas, escaleras industriales con canal C250 y conexiones soldadas y empernadas para fabricación directa en taller."
        DescriptionEn= "High-precision LOD 400 3D structural steel modeling for primary gyratory crusher, 250-ton dump hopper for 150t haul trucks, operating platforms, C250 industrial staircases, and full shop fabrication drawings."
        ImageSources = @("$gObras\08-Chancador Primario", "$webImg\arqueros*", "$gFotos\*Chancador*")
        ModelSources = @("$fOffice\00-Arcadis\ACL-00005507-Ing Detalles EPC Besalco", "$fOffice\01-DRA Global\Project Files\06_3DM")
        DocSources   = @("$gObras\08-Chancador Primario", "$fOffice\00-Arcadis\ACL-00005507-Ing Detalles EPC Besalco")
    },
    @{
        Id           = "P-032"
        ShortName    = "Asesoria_Minera_Caserones"
        Name         = "Asesoría de Ingeniería y Refuerzos Mina Caserones"
        NameEn       = "Caserones Copper Mine Structural Advisory & Retrofit"
        Client       = "SCM Minera Lumina Copper Chile"
        Company      = "Arcadis"
        Country      = "Chile"
        City         = "Copiapó, Atacama (4.300 msnm)"
        Year         = 2024
        Type         = "Minería"
        TypeEn       = "Mining"
        Material     = "Acero Estructural Pesado"
        Role         = "Proyectista Estructural Senior"
        RoleEn       = "Senior Structural Designer"
        Software     = "AutoCAD, Detallamiento de Refuerzos"
        LOD          = "LOD 300"
        Metrics      = "Refuerzos tolvas, galpones de acopio, perfiles armados"
        Description  = "Servicios de consultoría y diseño estructural para refuerzos de naves industriales, racks de cañerías y tolvas de mineral en alta montaña (4.300 msnm) bajo extremas cargas sísmicas y de nieve."
        DescriptionEn= "Structural engineering consultancy and retrofit design for industrial sheds, heavy pipe racks, and ore chutes at extreme high altitude (4,300 masl) under high seismic and snow loads."
        ImageSources = @("$fOffice\09-Arcadis\4896 - Asesoria Caserones")
        ModelSources = @("$fOffice\09-Arcadis\4896 - Asesoria Caserones")
        DocSources   = @("$fOffice\09-Arcadis\4896 - Asesoria Caserones")
    },
    @{
        Id           = "P-031"
        ShortName    = "BHP_Spence_Remediacion"
        Name         = "Remediación y Obras Civiles Mina Spence"
        NameEn       = "Spence Copper Mine Remediation & Civil Works"
        Client       = "BHP Minerals"
        Company      = "Arcadis"
        Country      = "Chile"
        City         = "Sierra Gorda, Antofagasta"
        Year         = 2024
        Type         = "Minería"
        TypeEn       = "Mining"
        Material     = "Hormigón Armado + Acero"
        Role         = "Proyectista Civil Estructural"
        RoleEn       = "Civil Structural Designer"
        Software     = "AutoCAD, Civil 3D"
        LOD          = "LOD 300"
        Metrics      = "Canaletas de relave, diques de contención, losas de bombeo"
        Description  = "Desarrollo de planos de construcción para obras de remediación ambiental, canaletas de conducción de relaves ODS 007 e infraestructura de captación superficial en faena minera Spence."
        DescriptionEn= "Construction drawing package for environmental remediation works, tailings launders ODS 007, and surface drainage infrastructure at BHP Spence."
        ImageSources = @("$fOffice\09-Arcadis\5510 Spence")
        ModelSources = @("$fOffice\09-Arcadis\5510 Spence")
        DocSources   = @("$fOffice\09-Arcadis\5510 Spence")
    },
    @{
        Id           = "P-030"
        ShortName    = "BHP_Antamina_Obras_Civiles"
        Name         = "Compañía Minera Antamina - Obras Civiles"
        NameEn       = "Compañía Minera Antamina - Civil Infrastructure"
        Client       = "Antamina / BHP / Glencore"
        Company      = "Arcadis"
        Country      = "Perú"
        City         = "Huari, Ancash"
        Year         = 2024
        Type         = "Minería"
        TypeEn       = "Mining"
        Material     = "Hormigón Armado"
        Role         = "Proyectista Estructural"
        RoleEn       = "Structural Designer"
        Software     = "AutoCAD, Civil 3D"
        LOD          = "LOD 300"
        Metrics      = "Cajas de traspaso, drenajes industriales, losas masivas"
        Description  = "Ingeniería de detalle para obras civiles e hidráulicas en el complejo minero Antamina en Perú. Planimetría de fundaciones, muros de contención y sumideros de alta resistencia a la abrasión."
        DescriptionEn= "Detail civil and hydraulic engineering drawings for Antamina copper-zinc mine in Peru. Abrasion-resistant sumps, massive foundations, and retaining walls."
        ImageSources = @("$fOffice\00-Arcadis\01-Proyectos\5469 BHP Antamina")
        ModelSources = @("$fOffice\00-Arcadis\01-Proyectos\5469 BHP Antamina")
        DocSources   = @("$fOffice\00-Arcadis\01-Proyectos\5469 BHP Antamina")
    },
    @{
        Id           = "P-029"
        ShortName    = "Anglo_American_Quellaveco"
        Name         = "Anglo American Quellaveco (Descarga Norte, Estribo Norte, Canal Sur)"
        NameEn       = "Anglo American Quellaveco (North Discharge, North Abutment, South Canal)"
        Client       = "Anglo American / Fluor"
        Company      = "Arcadis"
        Country      = "Perú"
        City         = "Moquegua"
        Year         = 2024
        Type         = "Minería"
        TypeEn       = "Mining"
        Material     = "Hormigón Masivo + Acero Estructural"
        Role         = "Proyectista Estructural BIM"
        RoleEn       = "Structural BIM Designer"
        Software     = "AutoCAD, Revit, Modelado 3D de Estribos"
        LOD          = "LOD 350"
        Metrics      = "Estructuras hidráulicas masivas, túneles, canales de desvío"
        Description  = "Mega proyecto minero Quellaveco. Planimetría y modelado estructural de las obras de descarga norte, estribos de apoyo del canal de desvío del Río Asana y canal sur. Obras críticas de protección hidráulica para permitir la explotación del tajo abierto."
        DescriptionEn= "Mega copper project Quellaveco. Structural modeling and civil detailing for North Discharge, Asana River diversion canal North Abutment, and South Canal. Critical river diversion infrastructure."
        ImageSources = @("$fOffice\09-Arcadis\5123*", "$fOffice\00-Arcadis\01-Proyectos\5123*")
        ModelSources = @("$fOffice\09-Arcadis\5123*", "$fOffice\00-Arcadis\01-Proyectos\5123*")
        DocSources   = @("$fOffice\09-Arcadis\5123*", "$fOffice\00-Arcadis\01-Proyectos\5123*")
    },
    @{
        Id           = "P-028"
        ShortName    = "Aeropuerto_El_Tepual_Puerto_Montt"
        Name         = "Ampliación Aeropuerto El Tepual de Puerto Montt"
        NameEn       = "El Tepual International Airport Expansion Puerto Montt"
        Client       = "Dirección de Aeropuertos MOP"
        Company      = "Arcadis"
        Country      = "Chile"
        City         = "Puerto Montt, Los Lagos"
        Year         = 2024
        Type         = "Infraestructura"
        TypeEn       = "Infrastructure"
        Material     = "Acero Estructural + Hormigón"
        Role         = "Proyectista Estructural BIM"
        RoleEn       = "Structural BIM Designer"
        Software     = "Revit, AutoCAD, Navisworks"
        LOD          = "LOD 350"
        Metrics      = "Nuevo terminal de pasajeros, puentes de embarque, 30 modelos 3D"
        Description  = "Proyecto de ampliación y modernización del terminal de pasajeros del Aeropuerto El Tepual. Modelado BIM de estructuras de acero para salas de embarque, puentes de conexión aeronáutica y fundaciones aisladas sobre suelo blando."
        DescriptionEn= "Passenger terminal expansion and modernization for El Tepual Airport. Structural steel BIM modeling for boarding lounges, jet bridge connectors, and foundation engineering."
        ImageSources = @("$fOffice\09-Arcadis\5291 - Aeropuerto El Tepual")
        ModelSources = @("$fOffice\09-Arcadis\5291 - Aeropuerto El Tepual")
        DocSources   = @("$fOffice\09-Arcadis\5291 - Aeropuerto El Tepual")
    },

    # --- 5. AFRY & INDUSTRIA CELULOSA 2022-2024 ---
    @{
        Id           = "P-025"
        ShortName    = "Maquina_Papelera_MP05_Absormex"
        Name         = "Máquina Papelera MP05 ABSORMEX"
        NameEn       = "MP05 Tissue Paper Machine ABSORMEX"
        Client       = "ABSORMEX / High Life Tissue"
        Company      = "AFRY"
        Country      = "México"
        City         = "Altamira, Tamaulipas"
        Year         = 2023
        Type         = "Industrial"
        TypeEn       = "Industrial"
        Material     = "Acero Estructural Grado A36 / A572"
        Role         = "Lead Structural BIM Modeler"
        RoleEn       = "Lead Structural BIM Modeler"
        Software     = "Autodesk Revit, Navisworks, BIM 360"
        LOD          = "LOD 350 / 400"
        Metrics      = "Nave de 10 hectáreas, 8.000 m² de plataformas, 26 modelos RVT"
        Description  = "Ingeniería de detalle y modelado BIM estructural completo para la nueva planta de fabricación de papel tissue MP05 en el Puerto Industrial de Altamira. Modelado paramétrico de estructuras de acero en áreas de Conversión, Jumbos, Producto Terminado y Descarga. Coordinación interdisciplinaria con equipos mecánicos y piping para cero interferencias."
        DescriptionEn= "Detail engineering and full structural BIM modeling for the new MP05 tissue paper manufacturing plant at Altamira Industrial Port. Parametric Revit steel modeling across Conversion, Jumbo roll storage, Finished product, and Unloading areas."
        ImageSources = @("$gObras\07-Maquina Papelera MP5", "$fOffice\00-Afry\00-2022\Abosrmex Projects", "$webImg\mp05*", "$gFotos\*Papelera*")
        ModelSources = @("$fOffice\00-Afry\00-2022\Abosrmex Projects")
        DocSources   = @("$fOffice\00-Afry\00-2022\Abosrmex Projects")
    },
    @{
        Id           = "P-024"
        ShortName    = "CMPC_Santa_Fe_y_Laja"
        Name         = "Modernización Plantas CMPC Santa Fe & Laja"
        NameEn       = "CMPC Santa Fe & Laja Pulp Mills Modernization"
        Client       = "CMPC Pulp"
        Company      = "AFRY"
        Country      = "Chile"
        City         = "Nacimiento / Laja, Biobío"
        Year         = 2023
        Type         = "Industrial"
        TypeEn       = "Industrial"
        Material     = "Acero Estructural + Hormigón"
        Role         = "Proyectista Estructural Senior"
        RoleEn       = "Senior Structural Designer"
        Software     = "Revit, AutoCAD, Navisworks"
        LOD          = "LOD 350"
        Metrics      = "Pipe racks de proceso, calderas de biomasa, torres de blanqueo"
        Description  = "Modelado y planimetría estructural para modernización de líneas de producción de celulosa en plantas Santa Fe y Laja. Racks de cañerías pesadas, plataformas para intercambiadores de calor y refuerzos de fundaciones."
        DescriptionEn= "Structural modeling and drawings for pulp production modernization at Santa Fe and Laja mills. Heavy pipe racks, heat exchanger support platforms, and foundation retrofits."
        ImageSources = @("$fOffice\00-Afry\00-2022\CMPC Projects", "$gFotos\*Laja*")
        ModelSources = @("$fOffice\00-Afry\00-2022\CMPC Projects")
        DocSources   = @("$fOffice\00-Afry\00-2022\CMPC Projects")
    },
    @{
        Id           = "P-023"
        ShortName    = "Montes_del_Plata_Depurador"
        Name         = "Depurador Secundario Planta Montes del Plata"
        NameEn       = "Secondary Scrubber Montes del Plata Pulp Mill"
        Client       = "Montes del Plata (Stora Enso / Arauco)"
        Company      = "AFRY"
        Country      = "Uruguay"
        City         = "Punta Pereira, Colonia"
        Year         = 2023
        Type         = "Industrial"
        TypeEn       = "Industrial"
        Material     = "Acero Inoxidable / Estructural"
        Role         = "Proyectista Estructural"
        RoleEn       = "Structural Designer"
        Software     = "Revit, AutoCAD"
        LOD          = "LOD 350"
        Metrics      = "Torre de lavado de gases, conductos de evacuación"
        Description  = "Diseño y modelado estructural de la torre soporte del nuevo depurador secundario a primario en la planta de celulosa Montes del Plata en Uruguay. Cumplimiento de normas de resistencia ambiental marina y eólica extrema."
        DescriptionEn= "Structural design and modeling for gas scrubber support tower at Montes del Plata pulp mill in Uruguay. Engineered for harsh marine corrosive and wind environments."
        ImageSources = @("$fOffice\00-Afry\00-2022\MDP Projects")
        ModelSources = @("$fOffice\00-Afry\00-2022\MDP Projects")
        DocSources   = @("$fOffice\00-Afry\00-2022\MDP Projects")
    },

    # --- 6. SINCAL & PUENTES 2020-2021 ---
    @{
        Id           = "P-021"
        ShortName    = "Puente_Rapel_G102"
        Name         = "Ingeniería de Puentes: Puente Rapel (G-102)"
        NameEn       = "Bridge Engineering: Rapel Bridge (G-102)"
        Client       = "Dirección de Vialidad MOP"
        Company      = "SINCAL"
        Country      = "Chile"
        City         = "Navidad / Litueche, O'Higgins"
        Year         = 2021
        Type         = "Infraestructura"
        TypeEn       = "Infrastructure"
        Material     = "Hormigón Postensado + Vigas Metálicas"
        Role         = "Proyectista Estructural de Puentes"
        RoleEn       = "Bridge Structural Designer"
        Software     = "AutoCAD, Detallamiento de Puentes MOP"
        LOD          = "LOD 300"
        Metrics      = "149 imágenes, 41 planos DWG, vigas cajón, cepas en lecho fluvial"
        Description  = "Ingeniería de detalle estructural para el puente mayor sobre el Río Rapel. Planimetría completa de armaduras de cepas, estribos, pilotes de fundación profunda y tablero mixto con vigas de acero postensadas."
        DescriptionEn= "Detail bridge engineering for the Rapel River bridge. Complete reinforcement detailing for piers, abutments, deep drilled shaft piles, and composite steel girder deck."
        ImageSources = @("$fOffice\00-SINCAL\G-102 Puente Rapel")
        ModelSources = @("$fOffice\00-SINCAL\G-102 Puente Rapel")
        DocSources   = @("$fOffice\00-SINCAL\G-102 Puente Rapel")
    },
    @{
        Id           = "P-020"
        ShortName    = "Ruta5_Temuco_Rio_Bueno_G88"
        Name         = "Ruta 5 Tramo Temuco - Río Bueno (G-88)"
        NameEn       = "Route 5 Highway Temuco - Río Bueno Section (G-88)"
        Client       = "Sociedad Concesionaria Ruta de los Ríos"
        Company      = "SINCAL"
        Country      = "Chile"
        City         = "Región de Los Ríos"
        Year         = 2021
        Type         = "Infraestructura"
        TypeEn       = "Infrastructure"
        Material     = "Hormigón Armado + Prefabricado"
        Role         = "Proyectista Estructural"
        RoleEn       = "Structural Designer"
        Software     = "AutoCAD, Civil 3D, Revit"
        LOD          = "LOD 300"
        Metrics      = "Pasos superiores, alcantarillas tipo cajón, defensas camineras"
        Description  = "Planimetría estructural y cubicaciones para enlaces, pasos sobre nivel y estructuras de drenaje mayor a lo largo de la concesión vial Ruta 5 Sur."
        DescriptionEn= "Structural drawing sets and quantity takeoffs for grade separations, overpasses, and box culverts along Route 5 South highway."
        ImageSources = @("$gFotos\*Rio Bueno*")
        ModelSources = @("$fOffice\00-SINCAL\G-88 Ruta 5 Temuco Rio Bueno")
        DocSources   = @("$fOffice\00-SINCAL\G-88 Ruta 5 Temuco Rio Bueno")
    },
    @{
        Id           = "P-019"
        ShortName    = "Pasarelas_Peatonales_Maule_G97"
        Name         = "Pasarelas Peatonales Ruta 5 Maule (Longaví, Copihue, Gaona)"
        NameEn       = "Pedestrian Overpasses Route 5 Maule (Longaví, Copihue, Gaona)"
        Client       = "Ruta del Maule / MOP"
        Company      = "SINCAL"
        Country      = "Chile"
        City         = "Maule (Longaví, Retiro, Linares)"
        Year         = 2021
        Type         = "Infraestructura"
        TypeEn       = "Infrastructure"
        Material     = "Hormigón Armado + Pasarelas Metálicas"
        Role         = "Proyectista Estructural"
        RoleEn       = "Structural Designer"
        Software     = "AutoCAD, Detallamiento Normativo"
        LOD          = "LOD 300"
        Metrics      = "3 Pasarelas peatonales accesibles, rampas helicoidales"
        Description  = "Diseño estructural y desarrollo de planos para pasarelas peatonales con rampas de acceso universal sobre la Autopista Ruta 5 Sur en las localidades de Longaví, Copihue y Gaona."
        DescriptionEn= "Structural design and plan drafting for universal accessibility pedestrian bridges with switchback ramps over Route 5 South at Longaví, Copihue, and Gaona."
        ImageSources = @("$fOffice\00-SINCAL\G-97 Puentes Maule")
        ModelSources = @("$fOffice\00-SINCAL\G-97 Puentes Maule")
        DocSources   = @("$fOffice\00-SINCAL\G-97 Puentes Maule")
    },

    # --- 7. CJV & AEROPUERTO AMB 2018-2019 ---
    @{
        Id           = "P-018"
        ShortName    = "Aeropuerto_AMB_Terminal_2_CJV"
        Name         = "Nuevo Aeropuerto Internacional Pudahuel AMB (Terminal 2 & Espigones)"
        NameEn       = "Arturo Merino Benítez International Airport Expansion (Terminal 2 & Piers)"
        Client       = "Nuevo Pudahuel / MOP"
        Company      = "VCGP - ASTALDI (CJV Construction)"
        Country      = "Chile"
        City         = "Santiago, Pudahuel"
        Year         = 2018
        Type         = "Infraestructura"
        TypeEn       = "Infrastructure"
        Material     = "Hormigón Armado + Acero Estructural + Postensado"
        Role         = "Coordinador & Modelador BIM Estructural Senior"
        RoleEn       = "Senior Structural BIM Modeler & Coordinator"
        Software     = "Autodesk Revit, Navisworks Manage, Tekla, AutoCAD"
        LOD          = "LOD 350 / 400"
        Metrics      = "320.000 m², US$ 900M, 4 Espigones, 217 fotos de obra, 42 modelos 3D"
        Description  = "Mega proyecto de infraestructura de transporte aéreo más grande de Chile. Coordinación espacial BIM y modelado estructural de los edificios Terminal 2 (T2M), Espigones C, D, E y F, pasarelas de conexión y edificios de estacionamientos. Detección y resolución de miles de interferencias con redes MEP y equipamiento aeroportuario (BHS, Puentes de Embarque)."
        DescriptionEn= "Chile's largest airport infrastructure expansion project (320,000 m²). Spatial BIM coordination and structural modeling for Terminal 2 Processor (T2M), Piers C, D, E, F, connectors, and multi-level parking garages. Clash mitigation with MEP and airport Baggage Handling Systems."
        ImageSources = @("$gObras\01-Proyecto Aeropuerto arturo merino benites", "$fOffice\06-SCL-CJV\2018\01-TRABAJOS", "$webImg\amb_*", "$gFotos\*Aeropuerto*")
        ModelSources = @("$fOffice\06-SCL-CJV\2018\01-TRABAJOS", "$gObras\O0015 Aeropuerto AMB")
        DocSources   = @("$fOffice\06-SCL-CJV\2018\01-TRABAJOS", "$gObras\01-Proyecto Aeropuerto arturo merino benites")
    },
    @{
        Id           = "P-016"
        ShortName    = "Viaducto_El_Salto_OHL"
        Name         = "Viaducto El Salto & Pasos Superiores OHL"
        NameEn       = "El Salto Viaduct & Highway Overpasses OHL"
        Client       = "Sacyr / OHL Concesiones"
        Company      = "OHL"
        Country      = "Chile"
        City         = "Santiago, Huechuraba"
        Year         = 2018
        Type         = "Infraestructura"
        TypeEn       = "Infrastructure"
        Material     = "Hormigón Armado Postensado + Vigas Prefabricadas"
        Role         = "Proyectista Estructural"
        RoleEn       = "Structural Designer"
        Software     = "AutoCAD, Modelado 3D de Estructuras Viales"
        LOD          = "LOD 300"
        Metrics      = "Viaducto de gran gálibo, vigas postensadas de 40m"
        Description  = "Desarrollo de planos estructurales de construcción para el viaducto El Salto en la autopista Américo Vespucio Oriente (AVO) y pasos superiores. Planimetría de encepados, cepas de gran altura y losas de tablero."
        DescriptionEn= "Construction drawings for El Salto highway viaduct on AVO urban tollway and grade separations. Detailing of deep pier caps, tall columns, and post-tensioned bridge decks."
        ImageSources = @("$gObras\Viaducto el Salto (Sacyr)", "$gFotos\*El salto*")
        ModelSources = @("$fOffice\05-OHL\OHL-TRABAJOS\MODELO 3D")
        DocSources   = @("$fOffice\05-OHL")
    },

    # --- 8. SIRVE & EDIFICACIÓN EN SALUD 2015-2017 ---
    @{
        Id           = "P-015"
        ShortName    = "Hospital_Felix_Bulnes"
        Name         = "Hospital Clínico Félix Bulnes (Aislación Sísmica)"
        NameEn       = "Félix Bulnes Clinical Hospital (Seismic Isolation)"
        Client       = "Ministerio de Salud / Astaldi Concesiones"
        Company      = "SIRVE"
        Country      = "Chile"
        City         = "Cerro Navia, Santiago"
        Year         = 2016
        Type         = "Salud"
        TypeEn       = "Healthcare"
        Material     = "Hormigón Armado + Disipadores Sísmicos Elastoméricos"
        Role         = "Proyectista Estructural Senior Especialista en Aislación"
        RoleEn       = "Senior Structural Seismic Isolation Designer"
        Software     = "AutoCAD, Revit, Detallamiento Sísmico"
        LOD          = "LOD 350"
        Metrics      = "125.000 m², 500+ fotos de obra, 250+ aisladores elastoméricos"
        Description  = "Complejo hospitalario de alta complejidad de 125.000 m² dotado de tecnología de aislación sísmica basal con aisladores elastoméricos y deslizadores friccionales. Planimetría de detalle de capiteles de aislación, juntas de dilatación sísmica de 60 cm, muros cortantes y losas postensadas."
        DescriptionEn= "High-complexity 125,000 m² hospital facility equipped with base seismic isolation technology (elastomeric bearings and flat sliders). Structural shop drawings for isolation pedestals, 60 cm seismic expansion joints, and post-tensioned slabs."
        ImageSources = @("$gObras\03-Hospital Felix Bulnes", "$fOffice\02-SIRVE\2015-2017\01-15-120-NYN_EM_HOSP_FELIX_BULNES", "$webImg\felix_bulnes*")
        ModelSources = @("$fOffice\02-SIRVE\2015-2017\01-15-120-NYN_EM_HOSP_FELIX_BULNES")
        DocSources   = @("$gObras\03-Hospital Felix Bulnes", "$fOffice\02-SIRVE\2015-2017\01-15-120-NYN_EM_HOSP_FELIX_BULNES")
    },
    @{
        Id           = "P-014"
        ShortName    = "Paso_Fronterizo_Los_Libertadores"
        Name         = "Nuevo Complejo Fronterizo Los Libertadores (3.200 msnm)"
        NameEn       = "Los Libertadores Border Control Complex (3,200 masl)"
        Client       = "Ministerio del Interior / MOP"
        Company      = "SIRVE"
        Country      = "Chile"
        City         = "Paso Los Libertadores, Los Andes"
        Year         = 2016
        Type         = "Infraestructura"
        TypeEn       = "Infrastructure"
        Material     = "Hormigón Armado + Acero Estructural + Aislación Sísmica"
        Role         = "Proyectista Estructural Senior"
        RoleEn       = "Senior Structural Designer"
        Software     = "Revit, Tekla Structures, AutoCAD"
        LOD          = "LOD 350 / 400"
        Metrics      = "35.000 m², 14.000+ archivos, 462 fotos, 86 modelos 3D"
        Description  = "Edificio de control fronterizo internacional en plena Cordillera de los Andes a 3.200 metros sobre el nivel del mar. Estructuras preparadas para sobrecargas extremas de avalanchas de nieve (hasta 2.000 kg/m²), sismos severos y vientos cordilleranos. Aislación sísmica basal y cubierta metálica de grandes luces."
        DescriptionEn= "International border control complex in the Andes Mountains at 3,200 meters above sea level. Designed for extreme snow avalanche loads (up to 2,000 kg/m²), severe earthquakes, and mountain winds. Base isolated with large-span steel roof structure."
        ImageSources = @("$gObras\02- Proyecto Paso fronterizo los libertadores", "$fOffice\02-SIRVE\2015-2017\02-15-009-IIM_CEE_PASO_LIBERTADORES", "$webImg\libertadores*")
        ModelSources = @("$fOffice\02-SIRVE\2015-2017\02-15-009-IIM_CEE_PASO_LIBERTADORES")
        DocSources   = @("$gObras\02- Proyecto Paso fronterizo los libertadores", "$fOffice\02-SIRVE\2015-2017\02-15-009-IIM_CEE_PASO_LIBERTADORES")
    },
    @{
        Id           = "P-013"
        ShortName    = "Hospital_Provincial_Marga_Marga"
        Name         = "Hospital Provincial Marga Marga"
        NameEn       = "Marga Marga Provincial Hospital"
        Client       = "Servicio de Salud Viña del Mar - Quillota"
        Company      = "SIRVE"
        Country      = "Chile"
        City         = "Villa Alemana, Valparaíso"
        Year         = 2017
        Type         = "Salud"
        TypeEn       = "Healthcare"
        Material     = "Hormigón Armado + Sistema Aislación Sísmica"
        Role         = "Proyectista Estructural"
        RoleEn       = "Structural Designer"
        Software     = "Revit, AutoCAD"
        LOD          = "LOD 350"
        Metrics      = "75.000 m², 282 aisladores sísmicos, 392 planos y documentos"
        Description  = "Recinto hospitalario de 75.000 m² con 9 niveles. Modelado estructural de muros de corte, columnas reforzadas, pedestales de aislación elastomérica y losas de entrepiso bajo estricta normativa de diseño sísmico hospitalario NCh433 y NCh2745."
        DescriptionEn= "75,000 m² hospital facility across 9 levels. Structural modeling of shear walls, reinforced columns, elastomeric isolation pedestals, and floor slabs under Chilean seismic hospital codes NCh433 and NCh2745."
        ImageSources = @("$gObras\04-Hospital Marga Marga", "$fOffice\02-SIRVE\2019\18003--HOSPITAL PROVINCIAL MARGA MARGA", "$webImg\marga_marga*")
        ModelSources = @("$fOffice\02-SIRVE\2019\18003--HOSPITAL PROVINCIAL MARGA MARGA")
        DocSources   = @("$gObras\04-Hospital Marga Marga", "$fOffice\02-SIRVE\2019\18003--HOSPITAL PROVINCIAL MARGA MARGA")
    },

    # --- 9. TYPSA & METRO DE SANTIAGO 2014 ---
    @{
        Id           = "P-009"
        ShortName    = "Metro_L3_Talleres_y_Cocheras"
        Name         = "Metro de Santiago Línea 3 (Talleres y Cocheras Los Libertadores)"
        NameEn       = "Santiago Metro Line 3 (Los Libertadores Maintenance Depot & Yards)"
        Client       = "Metro de Santiago S.A."
        Company      = "TYPSA"
        Country      = "Chile"
        City         = "Quilicura, Santiago"
        Year         = 2014
        Type         = "Infraestructura"
        TypeEn       = "Infrastructure"
        Material     = "Hormigón Armado + Estructuras Metálicas"
        Role         = "Proyectista Estructural Civil"
        RoleEn       = "Civil Structural Designer"
        Software     = "AutoCAD, Detallamiento de Estructuras Metro"
        LOD          = "LOD 300"
        Metrics      = "Máquina Lavado L3-359, Casetas L3-362, Tracción L3-363, Compresores L3-368"
        Description  = "Ingeniería de detalle civil y estructural para los recintos del taller de mantenimiento de trenes de la Línea 3 del Metro de Santiago. Planimetría de fosas de lavado, subestaciones eléctricas de tracción, casetas de seguridad y galpones de compresores."
        DescriptionEn= "Civil and structural detail engineering for train maintenance yard facilities on Santiago Metro Line 3. Train wash pits, traction electrical substations, security booths, and compressor sheds."
        ImageSources = @("$gFotos\*Metro*", "$gFotos\*L3*")
        ModelSources = @("$gHist\2014_Typsa\L3*")
        DocSources   = @("$gHist\2014_Typsa\L3*")
    },
    @{
        Id           = "P-008"
        ShortName    = "Metro_L6_Bodegas_y_Compresores"
        Name         = "Metro de Santiago Línea 6 (Talleres y Edificios Técnicos Cerrillos)"
        NameEn       = "Santiago Metro Line 6 (Cerrillos Yards & Technical Buildings)"
        Client       = "Metro de Santiago S.A."
        Company      = "TYPSA"
        Country      = "Chile"
        City         = "Cerrillos, Santiago"
        Year         = 2014
        Type         = "Infraestructura"
        TypeEn       = "Infrastructure"
        Material     = "Hormigón Armado + Albañilería Armada"
        Role         = "Proyectista Estructural"
        RoleEn       = "Structural Designer"
        Software     = "AutoCAD"
        LOD          = "LOD 300"
        Metrics      = "Bodega Residuos L6-860, Sala Compresores L6-868, Lubricantes L6-869"
        Description  = "Desarrollo de planos para los edificios auxiliares y salas técnicas de la estación terminal y talleres Cerrillos de la Línea 6 del Metro de Santiago."
        DescriptionEn= "Structural plan drafting for auxiliary service buildings and technical equipment rooms at Cerrillos terminus depot for Santiago Metro Line 6."
        ImageSources = @("$gFotos\*L6*")
        ModelSources = @("$gHist\2014_Typsa\L6*")
        DocSources   = @("$gHist\2014_Typsa\L6*")
    },
    @{
        Id           = "P-007"
        ShortName    = "Hidroelectrico_Los_Condores"
        Name         = "Proyecto Hidroeléctrico Los Cóndores (OH1737)"
        NameEn       = "Los Cóndores Hydroelectric Power Plant Project (OH1737)"
        Client       = "ENEL Generación Chile"
        Company      = "TYPSA"
        Country      = "Chile"
        City         = "San Clemente, Maule"
        Year         = 2014
        Type         = "Energía"
        TypeEn       = "Energy"
        Material     = "Hormigón Masivo Hidráulico + Blindaje Acero"
        Role         = "Proyectista Estructural Hidráulico"
        RoleEn       = "Hydraulic Structural Designer"
        Software     = "AutoCAD, Civil 3D"
        LOD          = "LOD 300"
        Metrics      = "150 MW de potencia, caverna de máquinas subterránea, túneles"
        Description  = "Central hidroeléctrica de pasada subterránea de 150 MW. Planimetría de obras civiles de toma de agua, blindaje de pique vertical de presión, caverna de máquinas y canal de descarga en roca profunda."
        DescriptionEn= "150 MW underground run-of-river hydroelectric project. Structural drafting for water intake works, steel-lined vertical pressure shaft, cavern powerhouse, and tailrace tunnel."
        ImageSources = @()
        ModelSources = @("$gHist\2014_Typsa\OH1737-PROYECTO HIDROELECTRICO LOS CONDORES")
        DocSources   = @("$gHist\2014_Typsa\OH1737-PROYECTO HIDROELECTRICO LOS CONDORES")
    },

    # --- 10. ARRIGONI & ACERO ESTRUCTURAL 2012-2014 ---
    @{
        Id           = "P-004"
        ShortName    = "Minera_Sierra_Gorda_Arrigoni"
        Name         = "Estructuras de Acero Minera Sierra Gorda (C0028)"
        NameEn       = "Structural Steel Fabrication Sierra Gorda Copper Mine (C0028)"
        Client       = "Sierra Gorda SCM / KGHM"
        Company      = "Arrigoni Metalúrgica"
        Country      = "Chile"
        City         = "Sierra Gorda, Antofagasta"
        Year         = 2013
        Type         = "Minería"
        TypeEn       = "Mining"
        Material     = "Acero Estructural Pesado ASTM A572 / A36"
        Role         = "Detallador Estructural Tekla Structures"
        RoleEn       = "Tekla Structures Steel Detailer"
        Software     = "Tekla Structures, FabTrol, AutoCAD"
        LOD          = "LOD 400"
        Metrics      = "497 fotos de fabricación y montaje, +15.000 ton de acero"
        Description  = "Modelado y detallamiento de fabricación (LOD 400) para las estructuras de acero de la concentradora Sierra Gorda. Planos de taller de vigas armadas, celosías, columnas cajón, placas de conexión de momento y listas de despacho CNC para maestranza."
        DescriptionEn= "Shop detailing and fabrication modeling (LOD 400) for structural steel at Sierra Gorda copper concentrator. Fabrication shop drawings for built-up plate girders, box columns, moment connections, and CNC files."
        ImageSources = @("$gObras\C0028 Sierra Gorda", "$gFotos\*Sierra Gorda*")
        ModelSources = @("$fOffice\04-ARRIGONI\C0125*", "$fOffice\04-ARRIGONI\02_ModelosVigentes")
        DocSources   = @("$fOffice\04-ARRIGONI\Fabtrol")
    },
    @{
        Id           = "P-003"
        ShortName    = "Planta_Industrial_Quimetal"
        Name         = "Ingeniería de Detalles Galpones Industriales Quimetal"
        NameEn       = "Detail Engineering Quimetal Chemical Industrial Plants"
        Client       = "Quimetal Industrial S.A."
        Company      = "FUSI"
        Country      = "Chile"
        City         = "Maipú, Santiago"
        Year         = 2010
        Type         = "Industrial"
        TypeEn       = "Industrial"
        Material     = "Acero Estructural"
        Role         = "Modelador y Detallador de Acero"
        RoleEn       = "Steel Detailer and Modeler"
        Software     = "Revit, Tekla Structures, AutoCAD"
        LOD          = "LOD 400"
        Metrics      = "24 archivos de planos, galpones de almacenamiento químico"
        Description  = "Modelado y detallamiento completo de galpones industriales de acero estructural para Quimetal. Generación de planos de montaje, detalles de nudos viga-columna y anclajes resistentes a vapores químicos."
        DescriptionEn= "Full structural steel warehouse modeling and fabrication detailing for Quimetal chemical plant. Erection drawings, beam-column connection details, and chemical-resistant base plates."
        ImageSources = @("$gObras\06-QUIMETAL", "$gFotos\*Quitmetal*")
        ModelSources = @("$gObras\06-QUIMETAL")
        DocSources   = @("$gObras\06-QUIMETAL")
    },
    @{
        Id           = "P-002"
        ShortName    = "Puentes_Viales_Historicos_Arrigoni"
        Name         = "Colección de Puentes Viales (Laja, Río Bueno, Santa Elvira, Llacolén)"
        NameEn       = "Highway Bridges Collection (Laja, Río Bueno, Santa Elvira, Llacolén)"
        Client       = "Dirección de Vialidad MOP"
        Company      = "Arrigoni / JQ Proyectos"
        Country      = "Chile"
        City         = "Biobío / Los Ríos"
        Year         = 2012
        Type         = "Infraestructura"
        TypeEn       = "Infrastructure"
        Material     = "Vigas Cajón de Acero + Losa Mixta"
        Role         = "Detallador de Puentes Metálicos"
        RoleEn       = "Steel Bridge Detailer"
        Software     = "Tekla Structures, AutoCAD"
        LOD          = "LOD 400"
        Metrics      = "Puente Laja (65 fotos), Río Bueno (29 fotos), Santa Elvira (65 fotos), Chamiza (39 fotos)"
        Description  = "Modelado y detallamiento de vigas metálicas cajón continuas para los principales puentes carreteros construidos en el sur de Chile. Empalmes de terreno con pernos de alta resistencia ASTM A325/A490, diafragmas de rigidización y aparatos de apoyo elastoméricos."
        DescriptionEn= "Shop modeling and detailing of continuous steel tub and box girders for major highway bridges in Southern Chile. High-strength bolted field splices, internal bracing diaphragms, and elastomeric bearings."
        ImageSources = @("$gObras\C0033 Puente Laja", "$gObras\C0059 Puente Ro Bueno", "$gObras\C0062 Puente Santa Elvira", "$gObras\C0050 Viaducto Chamiza", "$gFotos\*Puente*")
        ModelSources = @("$gObras\C0033 Puente Laja", "$gObras\C0059 Puente Ro Bueno", "$gObras\C0062 Puente Santa Elvira")
        DocSources   = @("$gObras\C0033 Puente Laja", "$gObras\C0059 Puente Ro Bueno")
    },
    @{
        Id           = "P-001"
        ShortName    = "Planimetria_Municipal_Lampa"
        Name         = "Planimetría y Arquitectura Municipal - Práctica Profesional"
        NameEn       = "Municipal Architecture Drafting - Professional Internship"
        Client       = "Ilustre Municipalidad de Lampa"
        Company      = "I. Municipalidad de Lampa"
        Country      = "Chile"
        City         = "Lampa, Región Metropolitana"
        Year         = 2006
        Type         = "Edificación"
        TypeEn       = "Building"
        Material     = "Albañilería + Madera + Hormigón"
        Role         = "Dibujante Proyectista en Práctica"
        RoleEn       = "Intern Architectural Draftsman"
        Software     = "AutoCAD"
        LOD          = "LOD 200"
        Metrics      = "Planimetrías de regularización municipal, sedes comunitarias"
        Description  = "Inicio de la trayectoria profesional. Elaboración de planimetría oficial de loteos, equipamientos comunitarios y regularización de viviendas para la Dirección de Obras Municipales de Lampa."
        DescriptionEn= "Early career milestone. Official drafting for municipal zoning plans, civic centers, and building permits for the Lampa Municipal Works Department."
        ImageSources = @("$gFotos\*2008*", "$gFotos\*autocad*")
        ModelSources = @()
        DocSources   = @()
    }
)

Write-Host "Total de proyectos a procesar: $($ProjectsDefinitions.Count)" -ForegroundColor Yellow

$SummaryResults = @()

foreach ($proj in $ProjectsDefinitions) {
    $res = Build-ProjectPackage -Proj $proj
    $SummaryResults += $res
}

# ==============================================================================
# GENERACIÓN DE ARCHIVOS MAESTROS DE RESUMEN
# ==============================================================================

Write-Host "`n==================================================================" -ForegroundColor Cyan
Write-Host " GENERANDO INVENTARIO MAESTRO Y DOCUMENTO EJECUTIVO " -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan

# 1. 00_INVENTARIO_MAESTRO.json
$invJsonPath = Join-Path $TargetRoot "00_INVENTARIO_MAESTRO.json"
$SummaryResults | ConvertTo-Json -Depth 4 | Set-Content -Path $invJsonPath -Encoding UTF8
Write-Host "[✓] Creado: $invJsonPath" -ForegroundColor Green

# 2. 00_PORTAFOLIO_RESUMEN_EJECUTIVO.md
$totImg = ($SummaryResults | Measure-Object -Property Imagenes -Sum).Sum
$totMod = ($SummaryResults | Measure-Object -Property Modelos -Sum).Sum
$totDoc = ($SummaryResults | Measure-Object -Property Informes -Sum).Sum
$dateStr = Get-Date -Format 'dd MMMM yyyy, HH:mm'

$mdLines = @(
    "# Catálogo Maestro de Proyectos de Ingeniería Estructural y BIM",
    "**Andrés Gallo Parra** - Senior Structural BIM Designer y Developer",
    "**Ruta Maestra**: $TargetRoot",
    "**Total Proyectos Catalogados**: $($SummaryResults.Count)",
    "**Fecha de Generación**: $dateStr",
    "",
    "---",
    "",
    "## 1. Resumen Estadístico de Activos",
    "",
    "| Métrica | Total Consolidado |",
    "| :--- | :---: |",
    "| **Proyectos Principales Documentados** | **$($SummaryResults.Count)** |",
    "| **Total de Imágenes / Renders / Fotos de Obra** | **$totImg** |",
    "| **Total de Modelos 3D BIM y Planos CAD** | **$totMod** |",
    "| **Total de Informes, Memorias y Documentos PDF** | **$totDoc** |",
    "",
    "---",
    "",
    "## 2. Índice General de Proyectos por Carpeta",
    "",
    "| ID | Proyecto | Empresa | Año | Disciplina | Fotos | 3D/CAD | Docs | Carpeta |",
    "| :- | :--- | :--- | :-: | :--- | :-: | :-: | :-: | :--- |"
)

foreach ($p in $SummaryResults) {
    $mdLines += "| **$($p.Id)** | $($p.Name) | $($p.Company) | $($p.Year) | $($p.Type) | $($p.Imagenes) | $($p.Modelos) | $($p.Informes) | ``$($p.Folder)`` |"
}

$mdLines += ""
$mdLines += "---"
$mdLines += ""
$mdLines += "## 3. Estructura Estandarizada de Cada Proyecto"
$mdLines += ""
$mdLines += "Cada carpeta de proyecto dentro del repositorio maestro contiene:"
$mdLines += ""
$mdLines += "```"
$mdLines += "[ID]_[Nombre_Proyecto]/"
$mdLines += "├── imagenes/          # Fotografías de obra, renders 3D, capturas de planos en alta resolución (.jpg, .png, .webp)"
$mdLines += "├── modelos/           # Modelos nativos Revit (.rvt), Navisworks (.nwd), OpenBIM (.ifc) y planos (.dwg)"
$mdLines += "├── informes/          # Memorias de cálculo, especificaciones técnicas, planos PDF (.pdf, .docx, .xlsx)"
$mdLines += "└── metadata.json      # Ficha técnica estructurada en JSON (bilingüe Español / Inglés)"
$mdLines += "```"
$mdLines += ""
$mdLines += "---"
$mdLines += "*Generado automáticamente por Antigravity IDE para el ecosistema de AtelijuDesign.*"

$mdPath = Join-Path $TargetRoot "00_PORTAFOLIO_RESUMEN_EJECUTIVO.md"
$mdLines | Set-Content -Path $mdPath -Encoding UTF8
Write-Host "[✓] Creado: $mdPath" -ForegroundColor Green

Write-Host "`n==================================================================" -ForegroundColor Cyan
Write-Host " PROCESO COMPLETADO EXITOSAMENTE " -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Cyan
