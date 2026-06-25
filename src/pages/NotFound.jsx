import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-bim-blue text-sm font-bold tracking-widest uppercase mb-4">Error 404</p>
      <h1 className="text-8xl font-black text-white mb-4">Página no encontrada</h1>
      <p className="text-slate-400 max-w-md mb-10 text-lg">
        La ruta que buscas no existe o fue movida.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-bim-blue hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
      >
        <i className="fa-solid fa-arrow-left"></i> Volver al Inicio
      </Link>
    </div>
  );
}
