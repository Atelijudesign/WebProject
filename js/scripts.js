document.addEventListener("DOMContentLoaded", () => {
  // --- Animaciones de Entrada y Contador ---
  const animatedElements = document.querySelectorAll(
    ".fade-in-up, #stats-container"
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === "stats-container") {
            const statNumbers = entry.target.querySelectorAll(".stat-number");
            statNumbers.forEach((stat) => {
              const target = +stat.getAttribute("data-target");
              const suffix = stat.innerText.replace(/[0-9+]/g, "");
              const duration = 2000;
              let start = 0;
              const stepTime = Math.abs(Math.floor(duration / target));
              const timer = setInterval(() => {
                start += 1;
                stat.textContent = `+${start}${suffix}`;
                if (start >= target) {
                  clearInterval(timer);
                  stat.textContent =
                    target === 100 ? `${target}%` : `+${target}${suffix}`;
                }
              }, stepTime);
            });
          } else {
            entry.target.classList.add("is-visible");
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach((el) => observer.observe(el));

  // --- Lógica del Menú Móvil ---
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      mobileMenuButton.setAttribute(
        "aria-expanded",
        !mobileMenu.classList.contains("hidden")
      );
    });
    mobileMenu.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        mobileMenu.classList.add("hidden");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  // --- Lógica del Logo y Botón "Volver Arriba" ---
  document
    .getElementById("logo")
    ?.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );

  const backToTopButton = document.getElementById("back-to-top");
  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.remove("opacity-0", "invisible");
        backToTopButton.classList.add("opacity-100", "visible");
      } else {
        backToTopButton.classList.add("opacity-0", "invisible");
        backToTopButton.classList.remove("opacity-100", "visible");
      }
    });
    backToTopButton.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  // --- Lógica del Acordeón ---
  const accordion = document.getElementById("experience-accordion");
  if (accordion) {
    accordion.querySelectorAll(".accordion-item button").forEach((button) => {
      button.addEventListener("click", () => {
        const item = button.closest(".accordion-item");
        const content = item.querySelector(".accordion-content");
        const wasActive = item.classList.contains("active");

        accordion.querySelectorAll(".accordion-item").forEach((other) => {
          other.classList.remove("active");
          other.querySelector(".accordion-content").style.maxHeight = null;
        });

        if (!wasActive) {
          item.classList.add("active");
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    });
  }

  // --- Lógica de Scroll Suave ---
  document
    .querySelectorAll("#desktop-menu a, #mobile-menu a")
    .forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        if (this.getAttribute("href").startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });

  // --- Lógica de Filtrado de Proyectos ---
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Actualizar estado activo de los botones
        filterButtons.forEach((btn) => {
          btn.classList.remove("bg-bim-blue", "text-white", "border-bim-blue");
          btn.classList.add("bg-gray-800", "text-gray-300", "border-gray-700");
        });
        button.classList.remove(
          "bg-gray-800",
          "text-gray-300",
          "border-gray-700"
        );
        button.classList.add("bg-bim-blue", "text-white", "border-bim-blue");

        const filterValue = button.getAttribute("data-filter");

        projectCards.forEach((card) => {
          const software = card.getAttribute("data-software");
          if (filterValue === "all" || software.includes(filterValue)) {
            card.classList.remove("hidden");
            card.classList.add("fade-in-up"); // Re-trigger animation if needed
          } else {
            card.classList.add("hidden");
            card.classList.remove("fade-in-up");
          }
        });
      });
    });
  }
});
