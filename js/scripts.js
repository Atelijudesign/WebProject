document.addEventListener("DOMContentLoaded", () => {
  // --- Animaciones de Entrada y Contador ---
  const animatedElements = document.querySelectorAll(
    ".fade-in-up, #stats-container",
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
    { threshold: 0.1 },
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
        !mobileMenu.classList.contains("hidden"),
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
      window.scrollTo({ top: 0, behavior: "smooth" }),
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
      window.scrollTo({ top: 0, behavior: "smooth" }),
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
          "border-gray-700",
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

  // --- Lightbox Gallery ---
  function initLightbox() {
    const images = document.querySelectorAll(".glass-card img");
    if (images.length === 0) return;

    // Create Lightbox DOM
    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.innerHTML = `
      <button class="lightbox-close">&times;</button>
      <button class="lightbox-prev">&#10094;</button>
      <button class="lightbox-next">&#10095;</button>
      <div class="lightbox-content">
        <img class="lightbox-image" src="" alt="Lightbox Image">
      </div>
    `;
    document.body.appendChild(overlay);

    const imgElement = overlay.querySelector(".lightbox-image");
    const closeBtn = overlay.querySelector(".lightbox-close");
    const prevBtn = overlay.querySelector(".lightbox-prev");
    const nextBtn = overlay.querySelector(".lightbox-next");

    let currentIndex = 0;

    function showImage(index) {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      currentIndex = index;
      imgElement.src = images[currentIndex].src;
      imgElement.alt = images[currentIndex].alt;
    }

    function openLightbox(index) {
      showImage(index);
      overlay.classList.add("active");
    }

    function closeLightbox() {
      overlay.classList.remove("active");
    }

    // Event Listeners
    images.forEach((img, index) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => openLightbox(index));
    });

    closeBtn.addEventListener("click", closeLightbox);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeLightbox();
    });

    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });

    document.addEventListener("keydown", (e) => {
      if (!overlay.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      if (e.key === "ArrowRight") showImage(currentIndex + 1);
    });
  }

  initLightbox();

  // --- Contact Form Handling ---
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const button = contactForm.querySelector("button[type='submit']");
      const originalText = button.innerHTML;

      button.disabled = true;
      button.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          button.classList.remove("bg-bim-blue", "hover:bg-blue-600");
          button.classList.add("bg-green-600", "hover:bg-green-500");
          button.innerHTML =
            '<i class="fa-solid fa-check"></i> ¡Mensaje Enviado!';
          contactForm.reset();
          setTimeout(() => {
            button.classList.remove("bg-green-600", "hover:bg-green-500");
            button.classList.add("bg-bim-blue", "hover:bg-blue-600");
            button.innerHTML = originalText;
            button.disabled = false;
          }, 5000);
        } else {
          throw new Error("Error al enviar");
        }
      } catch (error) {
        button.classList.remove("bg-bim-blue", "hover:bg-blue-600");
        button.classList.add("bg-red-600", "hover:bg-red-500");
        button.innerHTML =
          '<i class="fa-solid fa-triangle-exclamation"></i> Error';
        console.error(error);
        setTimeout(() => {
          button.classList.remove("bg-red-600", "hover:bg-red-500");
          button.classList.add("bg-bim-blue", "hover:bg-blue-600");
          button.innerHTML = originalText;
          button.disabled = false;
        }, 3000);
      }
    });
  }
});
