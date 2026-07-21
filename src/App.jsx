import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

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
const StaircaseCalculator = lazy(() => import("./pages/StaircaseCalculator"));
const AdminDashboard      = lazy(() => import("./pages/AdminDashboard"));
const ProfileCalculator   = lazy(() => import("./pages/ProfileCalculator"));
const BucklingShorteners  = lazy(() => import("./pages/BucklingShorteners"));

// Blog pages — lazy-loaded (content-heavy, visited on demand)
const BlogCatalog           = lazy(() => import("./pages/blog/BlogCatalog"));
const PyRevitVolumen        = lazy(() => import("./pages/blog/PyRevitVolumen"));
const BimDevRoadmap         = lazy(() => import("./pages/blog/BimDevRoadmap"));
const HerramientasBimAcero  = lazy(() => import("./pages/blog/HerramientasBimAcero"));
const PyRevitAccelerator    = lazy(() => import("./pages/blog/PyRevitAccelerator"));
const RevitStructureFuturo  = lazy(() => import("./pages/blog/RevitStructureFuturo"));
const RevitSupportClinic    = lazy(() => import("./pages/blog/RevitSupportClinic"));
const KonstrueduRevit       = lazy(() => import("./pages/blog/KonstrueduRevit"));

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

// Layout compartido con Navbar, Footer y ScrollToTop
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Route — sin Navbar/Footer */}
        <Route path="/admin" element={
          <Suspense fallback={<PageLoader />}>
            <AdminDashboard />
          </Suspense>
        } />

        {/* Public Routes con Navbar y Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/proyectos-bim" element={<ProjectsCatalog />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/herramientas" element={<ToolsCatalog />} />
          <Route path="/herramientas/icha" element={<IchaCatalog />} />
          <Route path="/herramientas/escaleras" element={<StaircaseCalculator />} />
          <Route path="/herramientas/perfiles" element={<ProfileCalculator />} />
          <Route path="/herramientas/acortadores" element={<BucklingShorteners />} />
          <Route path="/export" element={<ExportModel />} />

          {/* Blog Routes */}
          <Route path="/blog" element={<BlogCatalog />} />
          <Route path="/blog/konstruedu-especialista-bim-revit" element={<KonstrueduRevit />} />
          <Route path="/blog/pyrevit-peso-volumen" element={<PyRevitVolumen />} />
          <Route path="/blog/herramientas-bim-acero" element={<HerramientasBimAcero />} />
          <Route path="/blog/pyrevit-accelerator" element={<PyRevitAccelerator />} />
          <Route path="/blog/bim-dev-roadmap" element={<BimDevRoadmap />} />
          <Route path="/blog/revit-structure-futuro" element={<RevitStructureFuturo />} />
          <Route path="/blog/revit-support-clinic" element={<RevitSupportClinic />} />

          {/* 404 — captura cualquier ruta no encontrada */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

