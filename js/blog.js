// --- Blog Filter Logic ---
const categoryPills = document.querySelectorAll(".category-pill");
const blogCards = document.querySelectorAll(".blog-card");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const visibleCountEl = document.getElementById("visibleCount");
let activeCategory = "all";
function filterPosts() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  let visibleCount = 0;
  blogCards.forEach((card) => {
    const cardCategory = card.dataset.category;
    // Content-aware search
    const title =
      card.querySelector("h3")?.textContent.toLowerCase() || "";
    const desc = card.querySelector("p")?.textContent.toLowerCase() || "";
    const meta = card.dataset.title || ""; // Keep data-title as fallback/keyword store
    const matchesCategory =
      activeCategory === "all" || cardCategory === activeCategory;
    const matchesSearch =
      !searchTerm ||
      title.includes(searchTerm) ||
      desc.includes(searchTerm) ||
      meta.includes(searchTerm);
    if (matchesCategory && matchesSearch) {
      card.hidden = false;
      visibleCount++;
    } else {
      card.hidden = true;
    }
  });
  if (visibleCountEl) visibleCountEl.textContent = visibleCount;
  if (emptyState) emptyState.classList.toggle("hidden", visibleCount > 0);
  const blogGrid = document.getElementById("blogGrid");
  if (blogGrid) blogGrid.classList.toggle("hidden", visibleCount === 0);
}
categoryPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    categoryPills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    activeCategory = pill.dataset.category;
    filterPosts();
  });
});
if (searchInput) searchInput.addEventListener("input", filterPosts);
// Reading times are pre-calculated at build time (see calc-reading-time.js)