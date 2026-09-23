import { Helmet } from "react-helmet-async";

const SITE_URL = "https://atelijudesign.com";

/**
 * SEOHead – Inyecta meta tags dinámicos, Open Graph, Twitter Cards y Schema.org JSON-LD
 * para optimizar la indexación en Google y las previsualizaciones en redes sociales.
 *
 * @param {string} title       – Título de la página o artículo
 * @param {string} description – Resumen optimizado para SERP (150-160 caracteres)
 * @param {string} path        – Ruta relativa, ej: "/herramientas/icha" o "/blog/..."
 * @param {string} image       – URL relativa o absoluta de la imagen para compartir
 * @param {string} type        – "website" | "article"
 * @param {string} keywords    – Palabras clave complementarias
 * @param {object} schema      – Objeto JSON-LD estructurado de Schema.org
 */
export default function SEOHead({
  title,
  description,
  path = "",
  image = "/assets/img/og-preview.jpg",
  type = "website",
  keywords = "",
  schema = null,
}) {
  const canonicalUrl = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const ogImage = image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;
  const fullTitle = title.includes("Andrés Gallo") ? title : `${title} | Andrés Gallo P. · BIM Developer`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Andrés Gallo P. | Proyectista Estructural BIM" />
      <meta property="og:locale" content="es_CL" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data (Schema.org JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

/**
 * Genera la URL de producción para compartir en redes sociales.
 *
 * @param {string} path – Ruta relativa
 * @returns {string} URL codificada
 */
export function getShareUrl(path) {
  const baseUrl = typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? window.location.origin
    : SITE_URL;
  return encodeURIComponent(`${baseUrl}${path}`);
}
