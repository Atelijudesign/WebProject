import React from "react";
import { Link } from "react-router-dom";

export default function PyRevitAccelerator() {
  return (
    <div className="bg-bim-dark min-h-screen pt-32 pb-12 text-slate-100 flex items-center justify-center relative">
      <div className="bg-mesh" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />
      
      <div className="text-center max-w-xl mx-auto px-4 relative z-10">
        <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-4xl text-bim-blue mb-8 mx-auto shadow-sm border border-slate-700/50">
          <i className="fa-solid fa-bolt"></i>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 font-grotesk leading-tight">
          pyRevit Accelerator: El Camino Rápido para Crear Apps en Revit
        </h1>
        <p className="text-slate-400 mb-8">
          Este artículo detallado sobre la anatomía de una extensión en pyRevit y cómo estructurar tus scripts en Python estará disponible muy pronto.
        </p>
        <Link to="/blog" className="inline-flex items-center text-bim-blue font-bold hover:text-blue-400 transition-colors">
          <i className="fa-solid fa-arrow-left mr-2"></i> Volver al Blog
        </Link>
      </div>
    </div>
  );
}
