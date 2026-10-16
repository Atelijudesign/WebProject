import { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollToTopOnNavigation from "./components/ScrollToTopOnNavigation";
import { ScrollProgressBar } from "./components/ui/ScrollProgressBar";
import { AmbientCursorGlow } from "./components/ui/AmbientCursorGlow";
import { CommandPalette } from "./components/CommandPalette";
import { lazyWithRetry as lazy } from "./utils/lazyWithRetry";
import { databaseAdminUrl } from "./services/projectsApi";

// Lightweight pages — loaded eagerly (small bundle impact)
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Heavy pages — lazy-loaded so their deps (Three.js, ExcelJS, jsPDF,
// Chart.js, xlsx, dnd-kit, web-ifc) stay out of the initial bundle
const ProjectsCatalog     = lazy(() => import("./pages/ProjectsCatalog"));
const ProjectDetail       = lazy(() => import("./pages/ProjectDetail"));
const ExportModel         = lazy(() => import("./pages/ExportModel"));
const ToolsCatalog        = lazy(() => import("./pages/ToolsCatalog"));
const IchaCatalog         = lazy(() => import("./pages/IchaCatalog"));
const AiscCatalog         = lazy(() => import("./pages/AiscCatalog"));
const StaircaseCalculator = lazy(() => import("./pages/StaircaseCalculator"));

// Base del router: coincide con el `base` de Vite
// (por ejemplo "/WebProject/" al publicar en GitHub Pages).
const routerBasename = import.meta.env.BASE_URL.replace(/\/+$/, "") || "/";

const ProfileCalculator   = lazy(() => import("./pages/ProfileCalculator"));
const BucklingShorteners  = lazy(() => import("./pages/BucklingShorteners"));
const CvAtsBuilder        = lazy(() => import("./pages/CvAtsBuilder"));
const IfcViewer           = lazy(() => import("./pages/IfcViewer"));
const UnitConverter       = lazy(() => import("./pages/UnitConverter").then(m => ({ default: m.UnitConverter })));
const GeoCalc             = lazy(() => import("./pages/GeoCalc").then(m => ({ default: m.GeoCalc })));
const SmartPlant3DLab     = lazy(() => import("./pages/SmartPlant3DLab").then(m => ({ default: m.SmartPlant3DLab })));

// Blog pages — lazy-loaded (content-heavy, visited on demand)
const BlogCatalog           = lazy(() => import("./pages/blog/BlogCatalog"));
const PyRevitVolumen        = lazy(() => import("./pages/blog/PyRevitVolumen"));
const BimDevRoadmap         = lazy(() => import("./pages/blog/BimDevRoadmap"));
const HerramientasBimAcero  = lazy(() => import("./pages/blog/HerramientasBimAcero"));
const PyRevitAccelerator    = lazy(() => import("./pages/blog/PyRevitAccelerator"));
const RevitStructureFuturo  = lazy(() => import("./pages/blog/RevitStructureFuturo"));
const RevitSupportClinic    = lazy(() => import("./pages/blog/RevitSupportClinic"));
const KonstrueduRevit       = lazy(() => import("./pages/blog/KonstrueduRevit"));
const AiscCatalogPost       = lazy(() => import("./pages/blog/AiscCatalogPost"));
const WhatsNewRevit2027     = lazy(() => import("./pages/blog/WhatsNewRevit2027"));

// 10 Nuevas Noticias Técnicas
const Revit2027Rebar3D        = lazy(() => import("./pages/blog/Revit2027Rebar3D"));
const Revit2027RebarWeight    = lazy(() => import("./pages/blog/Revit2027RebarWeight"));
const Tekla2026SP3ModelSharing = lazy(() => import("./pages/blog/Tekla2026SP3ModelSharing"));
const GraitecSteel2027JointEdit = lazy(() => import("./pages/blog/GraitecSteel2027JointEdit"));
const TeklaCacheServerV4      = lazy(() => import("./pages/blog/TeklaCacheServerV4"));
const DynamoCore36Optimization = lazy(() => import("./pages/blog/DynamoCore36Optimization"));
const RevitSdk2027RevitLookup  = lazy(() => import("./pages/blog/RevitSdk2027RevitLookup"));
const VibeCodingRevitPython   = lazy(() => import("./pages/blog/VibeCodingRevitPython"));
const AIClashTriageBim       = lazy(() => import("./pages/blog/AIClashTriageBim"));
const AITakeoffStructuralSteel = lazy(() => import("./pages/blog/AITakeoffStructuralSteel"));
const Revit2025ApiNet8 = lazy(() => import("./pages/blog/Revit2025ApiNet8"));
const Revit2027RebarLongitudinal = lazy(() => import("./pages/blog/Revit2027RebarLongitudinal"));
const Iso19650Validation = lazy(() => import("./pages/blog/Iso19650Validation"));
const RevitScanToBimReality3D = lazy(() => import("./pages/blog/RevitScanToBimReality3D"));
const PlanBimChileEstandar = lazy(() => import("./pages/blog/PlanBimChileEstandar"));
const RevitEdgeWebView2 = lazy(() => import("./pages/blog/RevitEdgeWebView2"));
const MiningDigitalTwins = lazy(() => import("./pages/blog/MiningDigitalTwins"));
const SmartPlant3DInteractiveMasterLab = lazy(() => import("./pages/blog/SmartPlant3DInteractiveMasterLab"));
const PresentacionAndresGallo = lazy(() => import("./pages/blog/PresentacionAndresGallo"));
const NormasEstructuralesChileUsa = lazy(() => import("./pages/blog/NormasEstructuralesChileUsa"));
const ManualSmartPlant3DStructuralModeling = lazy(() => import("./pages/blog/ManualSmartPlant3DStructuralModeling"));
const SmartPlant3DFundamentosGrillas = lazy(() => import("./pages/blog/SmartPlant3DFundamentosGrillas"));


import ErrorBoundary from "./components/ErrorBoundary";
import SkipToContent from "./components/SkipToContent";

// Shared loading fallback for lazy routes
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-400 font-mono tracking-wider">
          Cargando...
        </p>
      </div>
    </div>
  );
}

function DatabaseAdminRedirect() {
  useEffect(() => {
    window.location.replace(databaseAdminUrl());
  }, []);
  return <PageLoader />;
}

// Layout compartido con Navbar, Footer y ScrollToTop
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <AmbientCursorGlow />
      <ScrollProgressBar />
      <SkipToContent />
      <Navbar />
      <CommandPalette />
      <main className="flex-grow" id="main-content">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export default function App() {
  return (
    <Router basename={routerBasename}>
      <ScrollToTopOnNavigation />
      <Routes>
        {/* El administrador histórico fue sustituido por el CRUD SQLite independiente. */}
        <Route path="/admin" element={<DatabaseAdminRedirect />} />

        {/* Visor IFC Estructural 3D — Herramienta interactiva de pantalla completa */}
        <Route path="/herramientas/visor-ifc" element={
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <IfcViewer />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="/herramientas/ifc" element={
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <IfcViewer />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="/visor-ifc" element={
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <IfcViewer />
            </Suspense>
          </ErrorBoundary>
        } />

        {/* Public Routes con Navbar y Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/proyectos-bim" element={<ProjectsCatalog />} />
          <Route path="/proyectos" element={<ProjectsCatalog />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/herramientas" element={<ToolsCatalog />} />
          <Route path="/herramientas/icha" element={<IchaCatalog />} />
          <Route path="/calculadora-icha" element={<IchaCatalog />} />
          <Route path="/icha" element={<IchaCatalog />} />
          <Route path="/herramientas/aisc" element={<AiscCatalog />} />
          <Route path="/herramientas/escaleras" element={<StaircaseCalculator />} />
          <Route path="/herramientas/perfiles" element={<ProfileCalculator />} />
          <Route path="/herramientas/acortadores" element={<BucklingShorteners />} />
          <Route path="/herramientas/cv-ats" element={<CvAtsBuilder />} />
          <Route path="/herramientas/convertidor" element={<UnitConverter />} />
          <Route path="/herramientas/geometria" element={<GeoCalc />} />
          <Route path="/herramientas/smartplant-3d" element={<SmartPlant3DLab />} />
          <Route path="/herramientas/sp3d" element={<SmartPlant3DLab />} />
          <Route path="/smartplant-3d" element={<SmartPlant3DLab />} />
          <Route path="/sp3d" element={<SmartPlant3DLab />} />
          <Route path="/export" element={<ExportModel />} />

          {/* Blog Routes */}
          <Route path="/blog" element={<BlogCatalog />} />
          <Route path="/blog/konstruedu-especialista-bim-revit" element={<KonstrueduRevit />} />
          <Route path="/blog/konstruedu-revit" element={<KonstrueduRevit />} />
          <Route path="/blog/konstruedu" element={<KonstrueduRevit />} />
          <Route path="/blog/pyrevit-peso-volumen" element={<PyRevitVolumen />} />
          <Route path="/blog/herramientas-bim-acero" element={<HerramientasBimAcero />} />
          <Route path="/blog/pyrevit-accelerator" element={<PyRevitAccelerator />} />
          <Route path="/blog/bim-dev-roadmap" element={<BimDevRoadmap />} />
          <Route path="/blog/revit-structure-futuro" element={<RevitStructureFuturo />} />
          <Route path="/blog/revit-support-clinic" element={<RevitSupportClinic />} />
          <Route path="/blog/catalogo-aisc-v150-online" element={<AiscCatalogPost />} />
          <Route path="/blog/whats-new-revit-2027-1" element={<WhatsNewRevit2027 />} />

          {/* 10 Nuevas Noticias Técnicas */}
          <Route path="/blog/revit-2027-1-enfierraduras-3d" element={<Revit2027Rebar3D />} />
          <Route path="/blog/revit-2027-peso-enfierradura-rule-numbering" element={<Revit2027RebarWeight />} />
          <Route path="/blog/tekla-structures-2026-sp3-model-sharing" element={<Tekla2026SP3ModelSharing />} />
          <Route path="/blog/graitec-steel-2027-joint-multi-edit" element={<GraitecSteel2027JointEdit />} />
          <Route path="/blog/tekla-model-sharing-cache-server-v4" element={<TeklaCacheServerV4 />} />
          <Route path="/blog/dynamo-core-3-6-optimizacion-rendimiento" element={<DynamoCore36Optimization />} />
          <Route path="/blog/revit-sdk-2027-2-revitlookup" element={<RevitSdk2027RevitLookup />} />
          <Route path="/blog/vibe-coding-revit-python-shell-pyrevit" element={<VibeCodingRevitPython />} />
          <Route path="/blog/ia-clash-triage-clasificacion-interferencias-bim" element={<AIClashTriageBim />} />
          <Route path="/blog/ia-takeoff-cubicacion-estructuras-acero" element={<AITakeoffStructuralSteel />} />
          <Route path="/blog/revit-2025-api-net8" element={<Revit2025ApiNet8 />} />
          <Route path="/blog/revit-2027-armaduras-longitudinales-transversales" element={<Revit2027RebarLongitudinal />} />
          <Route path="/blog/validacion-automatizada-iso-19650-tiempo-real" element={<Iso19650Validation />} />
          <Route path="/blog/revit-2027-scan-to-bim-vigas-acero-reality3d" element={<RevitScanToBimReality3D />} />
          <Route path="/blog/plan-bim-chile-estandar-proyectos-publicos" element={<PlanBimChileEstandar />} />
          <Route path="/blog/revit-api-webview2-migracion-cefsharp" element={<RevitEdgeWebView2 />} />
          <Route path="/blog/gemelos-digitales-prefabricacion-modular-mineria" element={<MiningDigitalTwins />} />
          <Route path="/blog/smartplant-3d-masterlab-simulador-interactivo" element={<SmartPlant3DInteractiveMasterLab />} />
          {/* Presentación Profesional Especial BBA Consultants */}
          <Route path="/blog/presentacion-andres-gallo-disenador-estructural-senior" element={<PresentacionAndresGallo />} />
          <Route path="/presentacion" element={<PresentacionAndresGallo />} />
          <Route path="/sobre-mi" element={<PresentacionAndresGallo />} />
          <Route path="/blog/smartplant-3d" element={<SmartPlant3DInteractiveMasterLab />} />
          <Route path="/blog/sp3d" element={<SmartPlant3DInteractiveMasterLab />} />
          {/* Normas Estructurales Chile & USA para Diseñadores Estructurales */}
          <Route path="/blog/normas-estructurales-chile-usa" element={<NormasEstructuralesChileUsa />} />
          <Route path="/blog/normas-chile-usa" element={<NormasEstructuralesChileUsa />} />
          <Route path="/normas-estructurales" element={<NormasEstructuralesChileUsa />} />

          {/* Fundamentos SmartPlant 3D: Common, Workspace y Grillas (Serie SP3D - Modulo 01) */}
          <Route path="/blog/smartplant-3d-fundamentos-grillas" element={<SmartPlant3DFundamentosGrillas />} />
          <Route path="/blog/sp3d-fundamentos" element={<SmartPlant3DFundamentosGrillas />} />

          {/* Manual Maestro de Modelado Estructural en SmartPlant 3D (201 Págs) */}
          <Route path="/blog/manual-smartplant-3d-structural-modeling" element={<ManualSmartPlant3DStructuralModeling />} />
          <Route path="/blog/manual-sp3d-estructuras" element={<ManualSmartPlant3DStructuralModeling />} />
          <Route path="/blog/manual-smartplant-3d" element={<ManualSmartPlant3DStructuralModeling />} />



          {/* 404 — captura cualquier ruta no encontrada */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}
