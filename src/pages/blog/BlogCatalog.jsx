import { useState } from "react";
import { Link } from "react-router-dom";
import SEOHead from "../../components/SEOHead";
import { BLOG_POSTS, BLOG_CATEGORIES } from "../../data/blog_data";
import { useTranslation } from "../../context/LanguageContext";

export default function BlogCatalog() {
  const { language, t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Search and filter logic
  const filteredPosts = BLOG_POSTS.filter((post) => {
    let matchesCategory = activeCategory === "all";

    if (!matchesCategory) {
      if (post.filterCategory === activeCategory) {
        matchesCategory = true;
      } else {
        const catMap = {
          "tekla": ["tekla"],
          "advance-steel": ["advance steel", "graitec"],
          "dynamo": ["dynamo"],
          "ia-aec": ["ia", "machine learning", "clash", "takeoff"],
          "revit-structure": ["revit"],
          "pyrevit": ["pyrevit", "python"],
          "csharp": ["c#", "revit api", "sdk"],
          "cubicaciones": ["cubicaciones", "qto", "peso", "masa"],
          "automatizacion": ["automatizacion", "roadmap"],
          "soporte": ["soporte", "it", "redes"],
          "herramientas": ["herramientas"]
        };
        const keywords = catMap[activeCategory] || [activeCategory];
        matchesCategory = keywords.some(kw =>
          (post.categories && post.categories.some(c => c.toLowerCase().includes(kw))) ||
          post.title.toLowerCase().includes(kw) ||
          (post.filterCategory && post.filterCategory.toLowerCase().includes(kw))
        );
      }
    }

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchLower) ||
      post.description.toLowerCase().includes(searchLower) ||
      post.categories.some((cat) => cat.toLowerCase().includes(searchLower));

    return matchesCategory && matchesSearch;
  });

  const isEn = language === "en";

  return (
    <div className="bg-bim-dark min-h-screen pt-28 pb-12 text-slate-100 relative">
      <SEOHead
        title={isEn ? "BIM & Automation Technical Blog · Python, Revit, Tekla & AI" : "Blog Técnico BIM & Automatización · Python, Revit, Tekla e IA"}
        description={isEn ? "Specialized technical articles on Revit API, Python (pyRevit) scripting, Tekla Structures, Dynamo, ISO 19650 validation, and AI applied to structural design." : "Artículos técnicos especializados sobre Revit API, scripts en Python (pyRevit), Tekla Structures, Dynamo, validación ISO 19650 e inteligencia artificial aplicada al diseño estructural."}
        path="/blog"
        keywords={isEn ? "BIM Developer Blog, Revit API C#, pyRevit Python, Tekla Structures automation, Dynamo BIM tutorials, ISO 19650 AI" : "Blog BIM Developer, Revit API C#, pyRevit Python, Tekla Structures automatización, Dynamo BIM tutoriales, ISO 19650 IA"}
        schema={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": isEn ? "BIM Technical & Structural Automation Blog" : "Blog Técnico BIM & Automatización Estructural",
          "url": "https://atelijudesign.com/blog",
          "description": isEn ? "Technical publications on programming applied to BIM, structural engineering, and workflow optimization." : "Publicaciones técnicas sobre programación aplicada a BIM, ingeniería estructural y optimización de flujos de trabajo."
        }}
      />
      {/* Mesh and Noise Background Effects to match Projects Catalog */}
      <div className="bg-mesh" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />

      {/* Hero Section */}
      <section className="px-4 relative overflow-hidden mb-12 z-10">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-10 w-72 h-72 bg-bim-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 p-2 bg-blue-900/20 rounded-lg border border-bim-blue/20">
            <span className="text-bim-blue font-bold text-sm">
              <i className="fa-solid fa-blog mr-1"></i> {t("blog_badge", "Blog BIM Developer")}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight font-grotesk">
            {t("blog_title_prefix", "Ideas, Código y ")}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-bim-blue via-purple-500 to-cyan-400">
              {t("blog_title_highlight", "Automatización")}
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            {t("blog_subtitle", "Artículos sobre desarrollo BIM, Revit API, pyRevit, Python, C# y todo lo que un Proyectista Estructural necesita para automatizar su trabajo.")}
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
            <input
              type="text"
              placeholder={t("blog_search_placeholder", "Buscar artículos...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-bim-blue focus:ring-1 focus:ring-bim-blue transition-all shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full font-bold text-sm border transition-all duration-300 ${
                activeCategory === cat.id
                  ? "border-bim-blue bg-bim-blue text-white shadow-md shadow-blue-500/20"
                  : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-bim-blue hover:text-bim-blue hover:bg-slate-800/50"
              }`}
            >
              {cat.icon && <i className={`${cat.icon} mr-1 text-xs`}></i>}
              {isEn ? (cat.name_en || cat.name) : cat.name}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            const formattedReadingTime = isEn
              ? post.readingTime.replace("lectura", "read")
              : post.readingTime;

            return (
              <article
                key={post.id}
                className="flex flex-col bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-bim-blue/50 hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300 group"
              >
                <div
                  className={`relative h-48 bg-gradient-to-br ${post.thumbnail.gradient} overflow-hidden`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-6xl">{post.thumbnail.icon}</span>
                      <p className="text-white font-bold text-lg mt-2">
                        {isEn ? (post.thumbnail.title_en || post.thumbnail.title) : post.thumbnail.title}
                      </p>
                      <p className="text-white/70 text-sm">
                        {isEn ? (post.thumbnail.subtitle_en || post.thumbnail.subtitle) : post.thumbnail.subtitle}
                      </p>
                    </div>
                  </div>
                  {post.isNew && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase shadow-sm">
                        {t("blog_new_badge", "Nuevo")}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`${post.thumbnail.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm`}
                    >
                      {post.thumbnail.badgeIcon && (
                        <i className={`fa-solid ${post.thumbnail.badgeIcon} mr-1`}></i>
                      )}
                      {isEn ? (post.thumbnail.badgeText_en || post.thumbnail.badgeText) : post.thumbnail.badgeText}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <span>
                      <i className="fa-regular fa-calendar mr-1"></i> {post.date}
                    </span>
                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                    <span>
                      <i className="fa-regular fa-clock mr-1"></i>{" "}
                      {formattedReadingTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-bim-blue transition-colors leading-tight font-grotesk">
                    {isEn ? (post.title_en || post.title) : post.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-5 line-clamp-3 flex-1">
                    {isEn ? (post.description_en || post.description) : post.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div className="flex gap-2 flex-wrap">
                      {(isEn && post.categories_en ? post.categories_en : post.categories).slice(0, 3).map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md font-medium"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-bim-blue font-bold text-sm hover:text-blue-400 transition-colors group/link ml-2 whitespace-nowrap"
                    >
                      {t("blog_read_more", "Leer más")}
                      <i className="fa-solid fa-arrow-right ml-2 text-xs group-hover/link:translate-x-1 transition-transform"></i>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Placeholder: Coming Soon C# */}
          {activeCategory === "all" || activeCategory === "csharp" ? (
            <div className="flex flex-col bg-slate-900/20 rounded-2xl overflow-hidden border border-slate-700/30 border-dashed opacity-60">
              <div className="relative h-48 bg-slate-900/30 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl opacity-40">🏗️</span>
                  <p className="text-slate-400 font-medium text-sm mt-2">
                    {t("blog_coming_soon", "Próximamente")}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span>
                    <i className="fa-regular fa-calendar mr-1"></i>{" "}
                    --
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-400 mb-3 leading-tight font-grotesk">
                  {t("blog_coming_soon_title", "Tu Primer Plugin en C# para Revit: Guía Paso a Paso")}
                </h3>
                <p className="text-slate-500 text-sm mb-5 line-clamp-2">
                  {t("blog_coming_soon_desc", "Configura Visual Studio, crea tu primer ExternalCommand y muestra un TaskDialog.")}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
