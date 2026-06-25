import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProjectsCatalog from "./pages/ProjectsCatalog";
import ProjectDetail from "./pages/ProjectDetail";
import ExportModel from "./pages/ExportModel";
import ToolsCatalog from "./pages/ToolsCatalog";
import IchaCatalog from "./pages/IchaCatalog";
import StaircaseCalculator from "./pages/StaircaseCalculator";
import AdminDashboard from "./pages/AdminDashboard";
import ProfileCalculator from "./pages/ProfileCalculator";
import BucklingShorteners from "./pages/BucklingShorteners";
import BlogCatalog from "./pages/blog/BlogCatalog";
import PyRevitVolumen from "./pages/blog/PyRevitVolumen";
import BimDevRoadmap from "./pages/blog/BimDevRoadmap";
import HerramientasBimAcero from "./pages/blog/HerramientasBimAcero";
import PyRevitAccelerator from "./pages/blog/PyRevitAccelerator";
import RevitStructureFuturo from "./pages/blog/RevitStructureFuturo";
import RevitSupportClinic from "./pages/blog/RevitSupportClinic";
import KonstrueduRevit from "./pages/blog/KonstrueduRevit";
import ScrollToTopButton from "./components/ScrollToTopButton";
import NotFound from "./pages/NotFound";

// Layout compartido con Navbar, Footer y ScrollToTop
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
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
        <Route path="/admin" element={<AdminDashboard />} />

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
