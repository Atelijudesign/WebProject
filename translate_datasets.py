import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
PROYECTOS_PATH = BASE_DIR / "src" / "data" / "proyectos.json"
FEATURED_PATH = BASE_DIR / "src" / "data" / "featured_details.json"

# Type translations
TYPE_MAP = {
    "Minería": "Mining",
    "Infraestructura / Ferroviario": "Infrastructure / Railway",
    "Infraestructura / Metro": "Infrastructure / Metro Subways",
    "Infraestructura / Aviación": "Infrastructure / Aviation",
    "Infraestructura / Fronterizo": "Infrastructure / Border Facilities",
    "Infraestructura / Pasarela Peatonal": "Infrastructure / Pedestrian Footbridges",
    "Infraestructura / Vial": "Infrastructure / Roadways",
    "Industrial / Manufactura": "Industrial / Manufacturing",
    "Edificación / Industrial": "Building / Industrial",
    "Edificación / Salud": "Building / Healthcare & Hospitals",
    "Edificación / Municipal": "Building / Civic & Municipal",
    "Edificación / Comercial": "Building / Commercial",
    "Fabricación/Comercial": "Fabrication / Commercial",
    "Energía / Hidroeléctrica": "Energy / Hydroelectric"
}

MATERIAL_MAP = {
    "Hormigón Armado": "Reinforced Concrete",
    "Acero Estructural": "Structural Steel",
    "Acero + Hormigón": "Structural Steel & Concrete",
    "—": "—"
}

ROLE_MAP = {
    "Proyectista Estructural": "Structural BIM Designer",
    "Proyectista / Diseñador Estructural": "Structural Project Designer",
    "Modelador / Proyectista Estructural BIM": "Structural BIM Modeler & Detailer",
    "Diseñador Estructural": "Structural Designer",
    "Dibujante Técnico (Práctica)": "Technical Drafter (Internship)"
}

PHASE_MAP = {
    "Ingeniería de detalles": "Detailed Engineering",
    "Ingeniería de Perfil": "Scoping / Profile Engineering",
    "Ingeniería Conceptual": "Conceptual Engineering",
    "Fase Factibilidad": "Feasibility Phase"
}

STATUS_MAP = {
    "Completado": "Completed"
}

# Individual project translations dictionary by project_id
PROJECT_TRANS = {
    "P-044": {
        "name_en": "Overhead Cranes Normalization Potrerillos Smelter (DSAL)",
        "description_en": "Structural engineering for structural integrity assessment, defect mapping, and operational normalization of Overhead Cranes No. 1 and No. 2 at Potrerillos Smelter Aisle and Mold Shop in Codelco Salvador Division. Structural general arrangement drawings, crack mapping, box girder reinforcements, end trucks, and bracket details under CMAA-70 and Codelco ECF-7 standards.",
        "activities_en": "General arrangement drawing development, structural reinforcement detailing, discontinuity mapping on crane runway girders and end trucks"
    },
    "P-043": {
        "name_en": "Second Access Stations Santiago - Batuco Railway (OT181)",
        "description_en": "Detailed engineering for right-of-way civil works implementation for second access to passenger stations on the Santiago - Batuco railway line (OT181). 3D reinforcement rebar modeling and construction rebar shop drawings in Autodesk Revit 2025.",
        "activities_en": "3D rebar modeling, construction rebar detailing drawings, material takeoff and bending schedules"
    },
    "P-042": {
        "name_en": "SX Washing Second Stage Integration (P1820)",
        "description_en": "Structural BIM design and industrial detailing for the integration of the second stage SX solvent extraction washing process at Minera Los Pelambres (MLC). Structural steel platforms, equipment foundations, and piping supports.",
        "activities_en": "Structural BIM modeling in Revit, steel framing detailing, industrial equipment pedestal coordination"
    },
    "P-041": {
        "name_en": "Pérez Caldera Tailings Removal Project (PCTR)",
        "description_en": "Multidisciplinary structural BIM engineering for the removal and environmental remediation of the Pérez Caldera tailings dam (Los Bronces). 3D modeling of deep foundations, retaining structures, pumping stations, and heavy steel structures under AISC and NCh2369 standards.",
        "activities_en": "BIM structural modeling, heavy steel connection detailing, multidisciplinary coordination in Autodesk Construction Cloud (ACC)"
    },
    "P-040": {
        "name_en": "Arqueros Mining Project — Primary Crusher",
        "description_en": "Detailed structural engineering for the Arqueros mining project. 3D modeling of the primary crushing facility, massive retaining walls, truck dump slabs, and heavy steel structures.",
        "activities_en": "Structural modeling of crusher building, heavy industrial connections, retaining wall reinforcement detailing"
    },
    "P-039": {
        "name_en": "Santo Domingo Seawater Desalination Plant",
        "description_en": "Detailed engineering of civil works for seawater intake sump, electrical rooms, and reverse osmosis building. Integral reinforced concrete modeling and hydraulic/piping multidisciplinary coordination.",
        "activities_en": "Civil works BIM modeling in Revit and Civil 3D, reinforced concrete detailing, underground duct bank takeoff"
    },
    "P-038": {
        "name_en": "Centrifuge Replacement Project (12673268)",
        "description_en": "Structural adaptation and dynamic foundation verification for industrial centrifuge replacement in a chemical processing plant. Reinforced concrete pedestals and vibration isolation.",
        "activities_en": "Equipment foundation modeling, anchorage design, structural drawings for fabrication and erection"
    },
    "P-037": {
        "name_en": "MP05 Tissue Paper Converting Machine — ABSORMEX",
        "description_en": "Detailed structural and architectural engineering for an 8,000 m² industrial converting plant in Zárate, Argentina. Heavy steel warehouse framing, crane beams, mezzanines, and machine foundations in Revit and BIM 360.",
        "activities_en": "Integral structural and architectural BIM modeling, crane runway beam detailing, earthwork and concrete takeoffs"
    },
    "P-036": {
        "name_en": "CMPC Laja Mill — Operational Continuity & Asset Integrity",
        "description_en": "Structural asset integrity analysis, reinforcement detailing, and operational continuity engineering for pulping and chemical recovery facilities at CMPC Laja mill.",
        "activities_en": "Existing structures field survey, steel reinforcement drawings, heavy duct bank coordination"
    },
    "P-035": {
        "name_en": "Santa Fe Mill — Class 10 Water Reduction Project",
        "description_en": "Industrial engineering for water consumption reduction and effluent recovery plants in Nacimiento, Biobío. Process buildings, treatment tank foundations, and pipe bridges.",
        "activities_en": "Industrial structures BIM modeling, rebar schedules, pipe rack detailing in Revit"
    },
    "P-034": {
        "name_en": "Softys Zárate Water Treatment & Intake Facilities",
        "description_en": "Civil and structural engineering for water intake, clarifiers, and filtration facilities for the Softys paper mill in Argentina. Water retaining concrete structures.",
        "activities_en": "Water-retaining reinforced concrete modeling, pipe penetrations coordination, structural layout drawings"
    },
    "P-033": {
        "name_en": "La Finca Highway Footbridge",
        "description_en": "Structural parametric modeling in Tekla Structures for highway pedestrian footbridge: steel box girders, access ramps, towers, and elastomeric bearings.",
        "activities_en": "3D Tekla modeling, fabrication single-part and assembly drawings, material lists and erection plans"
    },
    "P-032": {
        "name_en": "Paine Highway Footbridge",
        "description_en": "Complete structural modeling and steel detailing of highway footbridge over Route 5 South, including foundations, central pier, and steel superstructure.",
        "activities_en": "Structural modeling in Tekla, rebar detailing of footings and columns, fabrication drawings"
    },
    "P-031": {
        "name_en": "El Retiro Highway Footbridge",
        "description_en": "Tekla structural detailing for pedestrian footbridge, featuring tubular steel trusses, anti-vandalism mesh screens, and reinforced concrete access ramps.",
        "activities_en": "Steel truss modeling, connection detailing, bolt lists and cutting patterns"
    },
    "P-030": {
        "name_en": "Campamento 4 Highway Footbridge",
        "description_en": "Detailed engineering and shop drawings for highway pedestrian crossing: concrete abutments, steel span, and safety stairways.",
        "activities_en": "Tekla Structures 3D modeling, quantity takeoffs, fabrication assembly drawings"
    },
    "P-029": {
        "name_en": "Cerrillos Highway Footbridge",
        "description_en": "Parametric modeling of steel and concrete footbridge over urban highway. Navisworks model coordination for road clearance validation.",
        "activities_en": "3D structural modeling, clash detection with urban utilities, shop and erection drawings"
    },
    "P-028": {
        "name_en": "Las Miras Norte Highway Footbridge",
        "description_en": "Structural design and detailing for highway pedestrian bridge: superstructure steel framing, piers, and drilled shaft foundation rebar.",
        "activities_en": "Superstructure detailing, rebar schedules for foundations, workshop fabrication sheets"
    },
    "P-027": {
        "name_en": "Copihue Highway Footbridge",
        "description_en": "Complete Tekla modeling for highway footbridge in Southern Chile: seismic stops, pot bearings, precast deck slabs, and access ramps.",
        "activities_en": "3D model detailing, material takeoff reports, assembly and single part drawing generation"
    },
    "P-026": {
        "name_en": "Longaví Highway Footbridge",
        "description_en": "Detailed engineering and workshop drawings for pedestrian bridge: steel box girder spans, structural handrails, and lighting supports.",
        "activities_en": "Tekla steel detailing, bolt schedules, erection sequencing drawings"
    },
    "P-025": {
        "name_en": "Gaona Highway Footbridge",
        "description_en": "Structural detailing in Tekla Structures for highway footbridge: pedestrian cage, spiral ramp stairs, and deep foundation rebar.",
        "activities_en": "Tekla modeling, foundation rebar detailing, full fabrication documentation package"
    },
    "P-024": {
        "name_en": "AMB International Airport Expansion — Terminal 2 (T2M)",
        "description_en": "BIM structural modeling for the 320,000 m² expansion of Santiago International Airport. Main terminal building steel roof trusses, concourses, and seismic expansion joints in Revit Structures.",
        "activities_en": "3D BIM structural modeling, complex steel connection detailing, interdisciplinary MEP clash detection in Navisworks"
    },
    "P-023": {
        "name_en": "AMB Airport Expansion — Pier Concourse T2D",
        "description_en": "Detailed structural modeling for Pier D passenger boarding gates: spatial tubular steel trusses, boarding bridge anchorages, and baggage handling mezzanines.",
        "activities_en": "Revit Structures modeling, workshop connection review, construction issue drawing production"
    },
    "P-022": {
        "name_en": "AMB Airport Expansion — Pier Concourse T2F",
        "description_en": "BIM structural modeling of Pier F: steel framing, high-performance curtain wall supports, and technical service walkways.",
        "activities_en": "Structural steel detailing, interface coordination with facade engineering, BIM 360 collaboration"
    },
    "P-021": {
        "name_en": "AMB Airport — Tower Crane 11 Dismantling Engineering",
        "description_en": "Temporary works and dismantling structural engineering for Tower Crane 11 located in active terminal area. Structural verification of crane base and lifting frames.",
        "activities_en": "Temporary works structural modeling, lifting lug detailing, safety sequencing plans"
    },
    "P-020": {
        "name_en": "AMB Airport — West Multi-Level Parking Garage",
        "description_en": "Structural modeling of post-tensioned and reinforced concrete multi-level parking garage. Structural joints, ramp reinforcement, and foundation slabs.",
        "activities_en": "3D concrete modeling in Revit, rebar detailing, quantity takeoffs for concrete and formwork"
    },
    "P-019": {
        "name_en": "AMB Airport — South Multi-Level Parking Garage",
        "description_en": "BIM detailing of South multi-level parking structure: prefabricated precast beams, cast-in-place columns, and foundation grid.",
        "activities_en": "BIM modeling, precast element connection details, construction drawings"
    },
    "P-018": {
        "name_en": "Los Libertadores International Border Complex",
        "description_en": "Detailed structural modeling of the new 35,000 m² high-altitude border control complex at 3,200 m above sea level in the Andes. Heavy snow loads, seismic isolation, and complex steel canopy trusses in Tekla and Revit.",
        "activities_en": "Tekla and Revit structural modeling, high-altitude snow load connection detailing, clash detection"
    },
    "P-017": {
        "name_en": "Marga Marga Provincial Hospital",
        "description_en": "75,000 m² hospital complex with seismic isolation. Integral reinforced concrete modeling, base isolators, shear walls, and intensive care unit floors.",
        "activities_en": "3D reinforced concrete modeling, base isolator pedestal detailing, MEP clash coordination"
    },
    "P-016": {
        "name_en": "Dr. Gustavo Fricke Hospital — Phase 2",
        "description_en": "High-complexity hospital engineering: reinforced concrete structures, seismic energy dissipation dampers, heliport, and underground service tunnels.",
        "activities_en": "Revit structural modeling, seismic damper anchorage detailing, technical drawing packages"
    },
    "P-015": {
        "name_en": "Dr. Félix Bulnes Clinical Hospital",
        "description_en": "Structural modeling of 125,000 m² public hospital: reinforced concrete frames, shear walls, expansion joints, and radiological bunker shielding.",
        "activities_en": "Structural BIM modeling, rebar clash detection, concrete placement schedule extraction"
    },
    "P-014": {
        "name_en": "Metro Line 3 — Train Washing Facility (L3-359)",
        "description_en": "Detailed engineering of civil and structural works for underground automated train washing facility: drainage pits, waterproofed pits, and maintenance platforms.",
        "activities_en": "Underground concrete modeling, track bed interface detailing, construction drawings"
    },
    "P-013": {
        "name_en": "Metro Line 3 — North Security Guardhouses (L3-362)",
        "description_en": "Structural detailing for perimeter security enclosures, reinforced masonry, and steel canopies for Metro depot yards.",
        "activities_en": "Structural drawings, rebar schedules, steel canopy detailing"
    },
    "P-012": {
        "name_en": "Metro Line 3 — Traction Power Substation (L3-363)",
        "description_en": "Structural design of underground traction electrical substation: heavy transformer foundations, bus duct penetrations, and blast-resistant walls.",
        "activities_en": "Heavy equipment pedestal modeling, electromagnetic interference shielding details, rebar schedules"
    },
    "P-011": {
        "name_en": "Metro Line 3 — Regenerated Water Reservoir (L3-363)",
        "description_en": "Waterproof reinforced concrete reservoir for industrial water reuse at Metro maintenance depot: baffles, pump pits, and valve chambers.",
        "activities_en": "Water-retaining structure detailing, construction joint waterstop detailing, reinforcement drawings"
    },
    "P-010": {
        "name_en": "Metro Line 3 — Compressor Building (L3-368)",
        "description_en": "Structural engineering for compressed air equipment building: vibration-isolated foundation slabs, acoustic treatment walls, and steel roof framing.",
        "activities_en": "Vibration foundation detailing, steel roof modeling, structural drawings"
    },
    "P-009": {
        "name_en": "Metro Line 3 — Lubricants Storage Facility (L3-369)",
        "description_en": "Hazardous materials containment building: spill containment curbs, fireproof coatings, and specialized structural drainage.",
        "activities_en": "Civil works modeling, chemical-resistant concrete detailing, permit drawings"
    },
    "P-008": {
        "name_en": "Metro Line 6 — Hazardous Waste Storage Facility (L6-860)",
        "description_en": "Hazardous waste storage facility at Metro Cerrillos depot: explosion relief framing, sump basins, and reinforced concrete structure.",
        "activities_en": "Structural steel detailing, containment pit drawings, safety code compliance review"
    },
    "P-007": {
        "name_en": "Metro Line 6 — Compressor Station (L6-868)",
        "description_en": "Pneumatic equipment facility: reinforced concrete pedestals, acoustic wall supports, and overhead crane monorail beams.",
        "activities_en": "Monorail beam detailing, equipment anchor bolt plans, construction documentation"
    },
    "P-006": {
        "name_en": "Metro Line 6 — Lubricants Facility (L6-869)",
        "description_en": "Specialized industrial building for railway lubricant storage and distribution: containment berms, equipment foundations, and ventilation duct supports.",
        "activities_en": "Structural BIM modeling, containment detailing, reinforcement drawings"
    },
    "P-005": {
        "name_en": "Los Cóndores Hydroelectric Plant (OH1737)",
        "description_en": "Major 150 MW run-of-the-river hydroelectric project in the Andes mountains: 12 km headrace tunnel, 40-meter-high underground machine cavern, steel-lined pressure shaft, and surface valve chambers.",
        "activities_en": "Underground cavern concrete modeling, penstock support detailing, civil works takeoffs"
    },
    "P-004": {
        "name_en": "South Atrium Steel Structure (OT-1301)",
        "description_en": "Detailed shop modeling in Tekla Structures for architectural steel atrium: tapered tubular columns, curved glazed canopy framing, and shop assembly drawings.",
        "activities_en": "Tekla 3D modeling, CNC cutting file generation, workshop single part and assembly drawings"
    },
    "P-003": {
        "name_en": "Costanera Norte Casino Steel Building (OT-1302)",
        "description_en": "Structural steel fabrication detailing for commercial casino complex: long-span trusses, composite floor framing, and erection sequence planning.",
        "activities_en": "Tekla Structures modeling, shop drawing production, bolt schedules and erection plans"
    },
    "P-002": {
        "name_en": "Bridge Plate Girder Fabrication (OT-1303)",
        "description_en": "Fabrication detailing of welded steel plate girders for heavy highway bridge: flange and web splices, stiffener plates, camber curves, and weld inspection sheets.",
        "activities_en": "Girder camber calculations, weld detailing, single part fabrication sheets"
    },
    "P-001": {
        "name_en": "Quimetal Industrial Facility Building",
        "description_en": "Detailed engineering and shop drawings in Tekla Structures for chemical plant industrial warehouse: portal frames, crane runway beams, purlins, and bracing systems.",
        "activities_en": "Tekla 3D structural modeling, fabrication and erection drawings, material bills"
    }
}

def translate_proyectos():
    with open(PROYECTOS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    for p in data.get("value", []):
        pid = p.get("project_id")
        
        # Types, materials, roles, status, phase
        pt = p.get("project_type")
        p["project_type_en"] = TYPE_MAP.get(pt, pt)
        
        mat = p.get("material")
        p["material_en"] = MATERIAL_MAP.get(mat, mat)
        
        role = p.get("role")
        p["role_en"] = ROLE_MAP.get(role, role)
        
        phase = p.get("phase")
        p["phase_en"] = PHASE_MAP.get(phase, phase)
        
        status = p.get("status")
        p["status_en"] = STATUS_MAP.get(status, status)
        
        # Specific project translation
        t_info = PROJECT_TRANS.get(pid)
        if t_info:
            p["name_en"] = t_info["name_en"]
            p["description_en"] = t_info["description_en"]
            p["activities_en"] = t_info["activities_en"]
        else:
            p["name_en"] = p.get("name")
            p["description_en"] = p.get("description")
            p["activities_en"] = p.get("activities")

    with open(PROYECTOS_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Updated proyectos.json with English translations for all 44 projects!")


FEATURED_TRANS = {
    "P-044": {
        "name_en": "Overhead Cranes Normalization Potrerillos Smelter (DSAL)",
        "description_paragraphs_en": [
            "The Potrerillos industrial complex of Codelco Salvador Division, located in Diego de Almagro (Atacama Region), operates two heavy overhead bridge cranes in its Smelter Aisle for the transfer of high-temperature molten metals.",
            "The Scoping Study 'Overhead Cranes Normalization Potrerillos Smelter' (API S25F105) developed by GHD aimed to evaluate structural integrity, perform comprehensive defect mapping (cracks, fatigue in welds of main box girders and end trucks), and formulate engineering solutions to restore operational reliability under CMAA-70 and Codelco ECF-7 Corporate Fatality Prevention Standard.",
            "As Structural Designer and BIM Detailer at GHD, I developed the complete set of engineering drawings at Rev.B (sheets 4600030447_14-05270-205ES-00001 through 00004), covering the Smelter Aisle general arrangement, structural repair mapping, main box girder reinforcement details, and crane reducer support brackets."
        ],
        "specs_en": [
            {"icon": "fa-solid fa-building", "label": "Client / Owner", "value": "CODELCO Chile (Salvador Division)"},
            {"icon": "fa-solid fa-briefcase", "label": "Engineering Firm", "value": "GHD (Contract 4600030447 - ODS 14)"},
            {"icon": "fa-solid fa-calendar-days", "label": "Year / Phase", "value": "2026 · Scoping Engineering"},
            {"icon": "fa-solid fa-location-dot", "label": "Location", "value": "Potrerillos, Atacama, Chile"},
            {"icon": "fa-solid fa-layer-group", "label": "Category", "value": "Mining / Smelter & Lifting Equipment"},
            {"icon": "fa-solid fa-cubes", "label": "Materiality", "value": "Heavy Structural Steel (CMAA-70)"}
        ]
    },
    "los-condores": {
        "name_en": "Los Cóndores Hydroelectric Plant",
        "description_paragraphs_en": [
            "360 kilometers south of Santiago, near the Pehuenche Andean mountain pass between Chile and Argentina, works for the hydroelectric plant proceed continuously. Most of the engineering is underground, hidden within the core of the Andes range.",
            "Underground works include the 12-kilometer headrace tunnel carrying water from Laguna del Maule to the turbines. A 40-meter-high underground machine cavern houses the power units, overcoming a 470-meter hydraulic head along the steel-lined pressure shaft.",
            "The objective is harnessing water power while preserving the natural ecosystem: balancing electrical grid demand with agricultural irrigation needs in the Maule Valley without disturbing the Andean environment."
        ],
        "specs_en": [
            {"icon": "fa-solid fa-building", "label": "Client / Owner", "value": "Enel Generación Chile"},
            {"icon": "fa-solid fa-briefcase", "label": "Engineering Firm", "value": "TYPSA"},
            {"icon": "fa-solid fa-calendar-days", "label": "Year / Phase", "value": "2014 · Detailed Engineering"},
            {"icon": "fa-solid fa-location-dot", "label": "Location", "value": "San Clemente, Maule Region, Chile"},
            {"icon": "fa-solid fa-layer-group", "label": "Category", "value": "Energy / Hydroelectric (150 MW)"},
            {"icon": "fa-solid fa-cubes", "label": "Materiality", "value": "Reinforced Concrete & Underground Caverns"}
        ]
    },
    "aeropuerto-amb": {
        "name_en": "AMB International Airport Expansion",
        "description_paragraphs_en": [
            "The expansion of Arturo Merino Benítez International Airport represents one of the largest public infrastructure developments in Chile, adding 320,000 m² of modern passenger terminal facilities and boarding concourses.",
            "The project involved massive steel roof trusses, concourses T2D, T2E, and T2F, high-performance facade framing, and multi-level parking garages with intensive multidisciplinary coordination.",
            "As Structural BIM Modeler at CJV / SINCAL, I developed parametric 3D models in Revit Structures, detailed heavy steel moment and brace connections, and coordinated with airport MEP systems in Navisworks."
        ],
        "specs_en": [
            {"icon": "fa-solid fa-building", "label": "Client / Owner", "value": "Ministry of Public Works (MOP) / Nuevo Pudahuel"},
            {"icon": "fa-solid fa-briefcase", "label": "Engineering Firm", "value": "CJV Construction / SINCAL"},
            {"icon": "fa-solid fa-calendar-days", "label": "Year / Phase", "value": "2018 · Detailed Engineering"},
            {"icon": "fa-solid fa-location-dot", "label": "Location", "value": "Pudahuel, Santiago, Chile"},
            {"icon": "fa-solid fa-layer-group", "label": "Category", "value": "Aviation / Transportation (320,000 m²)"},
            {"icon": "fa-solid fa-cubes", "label": "Materiality", "value": "Structural Steel & Concrete Framing"}
        ]
    },
    "maquina-papelera": {
        "name_en": "MP05 Tissue Paper Converting Machine — ABSORMEX",
        "description_paragraphs_en": [
            "Detailed structural and architectural engineering for the MP05 tissue paper manufacturing and converting machine at the ABSORMEX industrial complex in Zárate, Argentina, covering an 8,000 m² industrial facility.",
            "The engineering required deep foundation slabs for vibratory converting equipment, heavy structural steel building columns and trusses, crane runway beams, and elevated pipe and duct racks.",
            "Developed complete BIM 3D models in Revit Structures, multidisciplinary coordination in BIM 360, and detailed fabrication and erection drawings."
        ],
        "specs_en": [
            {"icon": "fa-solid fa-building", "label": "Client / Owner", "value": "ABSORMEX / Softys"},
            {"icon": "fa-solid fa-briefcase", "label": "Engineering Firm", "value": "AFRY Chile"},
            {"icon": "fa-solid fa-calendar-days", "label": "Year / Phase", "value": "2023 · Detailed Engineering"},
            {"icon": "fa-solid fa-location-dot", "label": "Location", "value": "Zárate, Buenos Aires, Argentina"},
            {"icon": "fa-solid fa-layer-group", "label": "Category", "value": "Industrial / Pulp & Paper (8,000 m²)"},
            {"icon": "fa-solid fa-cubes", "label": "Materiality", "value": "Heavy Structural Steel & Machine Foundations"}
        ]
    },
    "hospital-marga-marga": {
        "name_en": "Marga Marga Provincial Hospital Complex",
        "description_paragraphs_en": [
            "New 75,000 m² provincial hospital complex designed to provide high-complexity medical care in Villa Alemana, Valparaíso Region.",
            "Featuring state-of-the-art seismic isolation (elastomeric bearings and flat sliders), reinforced concrete shear wall systems, intensive care units, and technical subterranean floors.",
            "Responsible for complete reinforced concrete 3D BIM modeling, rebar clash detection, seismic isolator pedestal detailing, and advanced architectural/MEP coordination."
        ],
        "specs_en": [
            {"icon": "fa-solid fa-building", "label": "Client / Owner", "value": "Viña del Mar - Quillota Health Service"},
            {"icon": "fa-solid fa-briefcase", "label": "Engineering Firm", "value": "SIRVE S.A."},
            {"icon": "fa-solid fa-calendar-days", "label": "Year / Phase", "value": "2019 · Detailed Engineering"},
            {"icon": "fa-solid fa-location-dot", "label": "Location", "value": "Villa Alemana, Valparaíso, Chile"},
            {"icon": "fa-solid fa-layer-group", "label": "Category", "value": "Healthcare / High Complexity (75,000 m²)"},
            {"icon": "fa-solid fa-cubes", "label": "Materiality", "value": "Seismically Isolated Reinforced Concrete"}
        ]
    },
    "paso-los-libertadores": {
        "name_en": "Los Libertadores International Border Complex",
        "description_paragraphs_en": [
            "High-mountain international border control complex situated at 3,200 meters above sea level in the Andes, covering 35,000 m² of passenger and freight control facilities.",
            "Extreme design criteria including severe snow accumulation, sub-zero thermal gradients, and intense seismicity requiring heavy structural steel portal frames and precast concrete enclosures.",
            "Developed Tekla Structures models for main passenger terminal trusses, vehicle inspection canopies, and workshop fabrication single part and assembly sheets."
        ],
        "specs_en": [
            {"icon": "fa-solid fa-building", "label": "Client / Owner", "value": "Ministry of Public Works (MOP)"},
            {"icon": "fa-solid fa-briefcase", "label": "Engineering Firm", "value": "CJV Construction / SIRVE"},
            {"icon": "fa-solid fa-calendar-days", "label": "Year / Phase", "value": "2015 · Detailed Engineering"},
            {"icon": "fa-solid fa-location-dot", "label": "Location", "value": "Paso Los Libertadores, Andes Mountains (3,200m)"},
            {"icon": "fa-solid fa-layer-group", "label": "Category", "value": "Border Infrastructure (35,000 m²)"},
            {"icon": "fa-solid fa-cubes", "label": "Materiality", "value": "Heavy Structural Steel (Tekla Structures)"}
        ]
    },
    "proyecto-arqueros": {
        "name_en": "Arqueros Mining Project — Primary Crusher",
        "description_paragraphs_en": [
            "Detailed structural engineering for the Arqueros mining project, centered on the primary crushing facility, massive retaining walls, truck dump approach slabs, and auxiliary transfer towers.",
            "Heavy dynamic loads from primary gyratory crusher and haul truck dumping demanded robust reinforced concrete foundations and heavy structural steel frames conforming to AISC and Chilean mining standards.",
            "Conducted structural BIM modeling in Revit Structures, connection design for heavy steel framing, and multidisciplinary coordination in Autodesk Construction Cloud."
        ],
        "specs_en": [
            {"icon": "fa-solid fa-building", "label": "Client / Owner", "value": "Minera Arqueros"},
            {"icon": "fa-solid fa-briefcase", "label": "Engineering Firm", "value": "ARCADIS / GHD"},
            {"icon": "fa-solid fa-calendar-days", "label": "Year / Phase", "value": "2024 · Detailed Engineering"},
            {"icon": "fa-solid fa-location-dot", "label": "Location", "value": "Coquimbo Region, Chile"},
            {"icon": "fa-solid fa-layer-group", "label": "Category", "value": "Mining / Crushing & Ore Handling"},
            {"icon": "fa-solid fa-cubes", "label": "Materiality", "value": "Massive Concrete & Heavy Steel Framing"}
        ]
    },
    "desaladora-sto-domingo": {
        "name_en": "Santo Domingo Seawater Desalination Plant",
        "description_paragraphs_en": [
            "Detailed engineering for civil and marine works of the Santo Domingo reverse osmosis seawater desalination plant, providing industrial water supply.",
            "Includes the seawater intake sump, heavy brine discharge chambers, electrical distribution substations, and chemical treatment buildings.",
            "Modeled civil and structural elements in Revit and Civil 3D with special focus on marine exposure durability, waterstops, and pipe penetrations."
        ],
        "specs_en": [
            {"icon": "fa-solid fa-building", "label": "Client / Owner", "value": "Industrial Client"},
            {"icon": "fa-solid fa-briefcase", "label": "Engineering Firm", "value": "GHD"},
            {"icon": "fa-solid fa-calendar-days", "label": "Year / Phase", "value": "2025 · Detailed Engineering"},
            {"icon": "fa-solid fa-location-dot", "label": "Location", "value": "Santo Domingo, Valparaíso Region, Chile"},
            {"icon": "fa-solid fa-layer-group", "label": "Category", "value": "Hydraulics / Water Treatment & Desalination"},
            {"icon": "fa-solid fa-cubes", "label": "Materiality", "value": "Marine-grade Waterproofed Reinforced Concrete"}
        ]
    }
}

def translate_featured():
    with open(FEATURED_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    for slug, obj in data.items():
        t = FEATURED_TRANS.get(slug)
        if t:
            obj["name_en"] = t["name_en"]
            obj["description_paragraphs_en"] = t["description_paragraphs_en"]
            obj["specs_en"] = t["specs_en"]

    with open(FEATURED_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Updated featured_details.json with English translations!")

if __name__ == "__main__":
    translate_proyectos()
    translate_featured()
