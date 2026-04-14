export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-logo">
            Andrés Gallo <span>P.BIM</span>
          </div>
          <div className="footer-copy">
            © {new Date().getFullYear()} Andrés Gallo P. Todos los derechos
            reservados.
          </div>
          <div className="footer-tagline">
            // Diseñado con ingeniería y código
          </div>
        </div>
      </div>
    </footer>
  );
}
