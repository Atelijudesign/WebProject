import { useState } from "react";
import { Link } from "react-router-dom";
import { BLOG_POSTS, BLOG_CATEGORIES } from "../../data/blog_data";

export default function BlogCatalog() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Search and filter logic
  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      activeCategory === "all" || post.filterCategory === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(searchLower) ||
      post.description.toLowerCase().includes(searchLower) ||
      post.categories.some((cat) => cat.toLowerCase().includes(searchLower));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gray-50 dark:bg-bim-dark min-h-screen pt-28 pb-12 transition-colors duration-300">
      {/* Hero Section */}
      <section className="px-4 relative overflow-hidden mb-12">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-10 w-72 h-72 bg-bim-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 p-2 bg-blue-900/20 rounded-lg border border-blue-800/30">
            <span className="text-bim-blue font-bold text-sm">
              <i className="fa-solid fa-blog mr-1"></i> Blog BIM Developer
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900 dark:text-white tracking-tight">
            Ideas, Código y{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-bim-blue via-purple-500 to-cyan-400">
              Automatización
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Artículos sobre desarrollo BIM, Revit API, pyRevit, Python, C# y todo
            lo que un Proyectista Estructural necesita para automatizar su trabajo.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-bim-blue transition-all shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full font-bold text-sm border transition-all duration-300 ${
                activeCategory === cat.id
                  ? "border-bim-blue bg-bim-blue text-white shadow-md shadow-blue-500/20"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-bim-blue hover:text-bim-blue"
              }`}
            >
              {cat.icon && <i className={`${cat.icon} mr-1 text-xs`}></i>}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col bg-white dark:bg-bim-card rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-bim-blue hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300 group"
            >
              <div
                className={`relative h-48 bg-gradient-to-br ${post.thumbnail.gradient} overflow-hidden`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl">{post.thumbnail.icon}</span>
                    <p className="text-white font-bold text-lg mt-2">
                      {post.thumbnail.title}
                    </p>
                    <p className="text-white/70 text-sm">
                      {post.thumbnail.subtitle}
                    </p>
                  </div>
                </div>
                {post.isNew && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase shadow-sm">
                      Nuevo
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
                    {post.thumbnail.badgeText}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span>
                    <i className="fa-regular fa-calendar mr-1"></i> {post.date}
                  </span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>
                    <i className="fa-regular fa-clock mr-1"></i>{" "}
                    {post.readingTime}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-bim-blue transition-colors leading-tight font-grotesk">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 line-clamp-3 flex-1">
                  {post.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex gap-2 flex-wrap">
                    {post.categories.slice(0, 3).map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-bim-blue font-bold text-sm hover:text-blue-400 transition-colors group/link ml-2 whitespace-nowrap"
                  >
                    Leer más
                    <i className="fa-solid fa-arrow-right ml-2 text-xs group-hover/link:translate-x-1 transition-transform"></i>
                  </Link>
                </div>
              </div>
            </article>
          ))}

          {/* Placeholder: Coming Soon C# */}
          {activeCategory === "all" || activeCategory === "csharp" ? (
            <div className="flex flex-col bg-white/50 dark:bg-bim-card/50 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 border-dashed opacity-60">
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl opacity-40">🏗️</span>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-2">
                    Próximamente
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span>
                    <i className="fa-regular fa-calendar mr-1"></i>{" "}
                    --
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-600 dark:text-gray-500 mb-3 leading-tight font-grotesk">
                  Tu Primer Plugin en C# para Revit: Guía Paso a Paso
                </h3>
                <p className="text-gray-500 dark:text-gray-600 text-sm mb-5 line-clamp-2">
                  Configura Visual Studio, crea tu primer ExternalCommand y muestra
                  un TaskDialog.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
