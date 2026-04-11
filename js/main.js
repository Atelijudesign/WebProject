/**
 * Main.js - Unified site scripts
 * Handles: counters, animations, nav, portfolio, contact form
 */

(function () {
  "use strict";

  /* ========================================
     MOBILE MENU
     ======================================== */
  var mobileMenuButton = document.getElementById("mobile-menu-button");
  var mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
      var expanded = !mobileMenu.classList.contains("hidden");
      mobileMenuButton.setAttribute("aria-expanded", expanded);
    });

    mobileMenu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        mobileMenu.classList.add("hidden");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ========================================
     SMOOTH SCROLL
     ======================================== */
  var navLinks = document.querySelectorAll(
    '#desktop-menu a[href^="#"], #mobile-menu a[href^="#"]'
  );

  navLinks.forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  /* ========================================
     NAV SCROLL SPY
     ======================================== */
  var sections = document.querySelectorAll("section[id]");
  var desktopNavLinks = document.querySelectorAll(
    '#desktop-menu a[href^="#"]'
  );

  if (sections.length > 0 && desktopNavLinks.length > 0) {
    var NAV_HEIGHT = 72;

    function updateActiveLink() {
      var currentId = "";
      var scrollY = window.scrollY + NAV_HEIGHT + 10;

      sections.forEach(function (section) {
        if (section.offsetTop <= scrollY) currentId = section.id;
      });

      desktopNavLinks.forEach(function (link) {
        var isActive = link.getAttribute("href") === "#" + currentId;
        link.classList.toggle("text-bim-blue", isActive);
        link.classList.toggle("hover:text-blue-400", isActive);
        link.classList.toggle("text-gray-700", !isActive);
        link.classList.toggle("dark:text-white", !isActive);
        link.classList.toggle("hover:text-bim-blue", !isActive);
      });
    }

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    updateActiveLink();
  }

  /* ========================================
     LOGO CLICK �’ SCROLL TO TOP
     ======================================== */
  var logo = document.getElementById("logo");
  if (logo) {
    logo.addEventListener("click", function (e) {
      var href = logo.getAttribute("href") || "";
      if (href === "#home" || href === "#" || href === "./") {
        e.preventDefault();
        var homeSection = document.getElementById("home");
        if (homeSection) {
          homeSection.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    });
  }

  /* ========================================
     COUNTER ANIMATION (respects reduced motion)
     ======================================== */
  function animateCounter(el, target, duration) {
    duration = duration || 2000;
    el.textContent = "0";
    var start = 0;
    var step = target / (duration / 16);
    var timer = setInterval(function () {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(start);
    }, 16);
  }

  function runCounters() {
    var yearsEl = document.getElementById("counter-years");
    var m2El = document.getElementById("counter-m2");
    var bimEl = document.getElementById("counter-bim");
    if (yearsEl) animateCounter(yearsEl, 15);
    if (m2El) animateCounter(m2El, 500);
    if (bimEl) animateCounter(bimEl, 100);
  }

  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var statsSection = document.getElementById("statsSection");
  if (statsSection) {
    if (prefersReducedMotion) {
      // Skip animation, show final values
      var yearsEl = document.getElementById("counter-years");
      var m2El = document.getElementById("counter-m2");
      var bimEl = document.getElementById("counter-bim");
      if (yearsEl) yearsEl.textContent = "15";
      if (m2El) m2El.textContent = "500";
      if (bimEl) bimEl.textContent = "100";
    } else if (
      statsSection.getBoundingClientRect().top < window.innerHeight
    ) {
      runCounters();
    } else {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            runCounters();
            counterObserver.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      counterObserver.observe(statsSection);
    }
  }

  /* ========================================
     FADE-UP ANIMATIONS
     ======================================== */
  var fadeObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".fade-up").forEach(function (el) {
    fadeObs.observe(el);
  });

  /* ========================================
     CONTACT FORM �” Formspree AJAX
     ======================================== */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = document.getElementById("formBtn");
      var btnText = document.getElementById("formBtnText");
      var msg = document.getElementById("formMsg");
      btn.disabled = true;
      btnText.textContent = "Enviando...";
      msg.className = "form-msg";

      fetch("https://formspree.io/f/mojkoayd", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm),
      })
        .then(function (res) {
          if (res.ok) {
            msg.textContent = "�“ Mensaje enviado. Te respondo pronto.";
            msg.className = "form-msg success";
            msg.setAttribute("role", "alert");
            contactForm.reset();
          } else {
            return res.json().then(function (data) {
              throw data;
            });
          }
        })
        .catch(function () {
          msg.textContent = "��” Error al enviar. Escríbeme a andresgallo@pm.me";
          msg.className = "form-msg error";
          msg.setAttribute("role", "alert");
        })
        .finally(function () {
          btn.disabled = false;
          btnText.textContent = "Enviar mensaje";
        });
    });
  }

  /* ========================================
     PORTFOLIO FILTER
     ======================================== */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var portfolioCards = document.querySelectorAll(".portfolio-card");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("active");
      });
      this.classList.add("active");

      var filterVal = this.getAttribute("data-filter");

      portfolioCards.forEach(function (card) {
        if (filterVal === "all") {
          card.style.display = "";
        } else {
          var tags = Array.from(card.querySelectorAll(".portfolio-tag")).map(
            function (t) {
              return t.textContent.trim();
            }
          );
          if (tags.indexOf(filterVal) !== -1) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        }
      });
    });
  });

  /* ========================================
     SORT CERTIFICATIONS BY YEAR
     ======================================== */
  var certGrids = document.querySelectorAll(".certs-grid");
  certGrids.forEach(function (grid) {
    var cards = Array.from(grid.querySelectorAll(".cert-card"));
    if (cards.length > 1) {
      cards.sort(function (a, b) {
        var textA = (a.querySelector(".cert-org") && a.querySelector(".cert-org").textContent) || "";
        var textB = (b.querySelector(".cert-org") && b.querySelector(".cert-org").textContent) || "";
        var matchA = textA.match(/\b(19|20)\d{2}\b/g);
        var matchB = textB.match(/\b(19|20)\d{2}\b/g);
        var yearA = matchA ? parseInt(matchA[matchA.length - 1], 10) : 0;
        var yearB = matchB ? parseInt(matchB[matchB.length - 1], 10) : 0;
        return yearB - yearA;
      });
      cards.forEach(function (card) {
        grid.appendChild(card);
      });
    }
  });

  /* ========================================
     SORT PORTFOLIO BY YEAR
     ======================================== */
  var portfolioGrid = document.querySelector(".portfolio-grid");
  if (portfolioGrid) {
    var pCards = Array.from(
      portfolioGrid.querySelectorAll(".portfolio-card")
    );
    pCards.sort(function (a, b) {
      var textA =
        (a.querySelector(".portfolio-year") && a.querySelector(".portfolio-year").textContent) || "";
      var textB =
        (b.querySelector(".portfolio-year") && b.querySelector(".portfolio-year").textContent) || "";
      var matchA = textA.match(/\b(19|20)\d{2}\b/);
      var matchB = textB.match(/\b(19|20)\d{2}\b/);
      var yearA = textA.toLowerCase().includes("curso")
        ? 9999
        : matchA
        ? parseInt(matchA[0], 10)
        : 0;
      var yearB = textB.toLowerCase().includes("curso")
        ? 9999
        : matchB
        ? parseInt(matchB[0], 10)
        : 0;
      return yearB - yearA;
    });
    pCards.forEach(function (card) {
      portfolioGrid.appendChild(card);
    });
  }

  /* ========================================
     ACCORDION (for sub-pages)
     ======================================== */
  var accordion = document.getElementById("experience-accordion");
  if (accordion) {
    accordion
      .querySelectorAll(".accordion-item button")
      .forEach(function (button) {
        button.addEventListener("click", function () {
          var item = button.closest(".accordion-item");
          var content = item.querySelector(".accordion-content");
          var wasActive = item.classList.contains("active");

          accordion.querySelectorAll(".accordion-item").forEach(function (
            other
          ) {
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

  /* ========================================
     LIGHTBOX (for sub-page galleries)
     ======================================== */
  function initLightbox() {
    var images = document.querySelectorAll(".glass-card img");
    if (images.length === 0) return;

    var overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Image gallery");
    overlay.innerHTML =
      '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button class="lightbox-prev" aria-label="Previous">&#10094;</button>' +
      '<button class="lightbox-next" aria-label="Next">&#10095;</button>' +
      '<div class="lightbox-content">' +
      '<img class="lightbox-image" src="" alt="">' +
      "</div>";
    document.body.appendChild(overlay);

    var imgElement = overlay.querySelector(".lightbox-image");
    var closeBtn = overlay.querySelector(".lightbox-close");
    var prevBtn = overlay.querySelector(".lightbox-prev");
    var nextBtn = overlay.querySelector(".lightbox-next");
    var currentIndex = 0;
    var previousFocus = null;

    function showImage(index) {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      currentIndex = index;
      imgElement.src = images[currentIndex].src;
      imgElement.alt = images[currentIndex].alt || "";
      
      // Copy rotation class if present on image, its container, or its wrapper
      var currentImg = images[currentIndex];
      var isRotated = currentImg.classList.contains("rotate-180") || 
                     (currentImg.parentElement && currentImg.parentElement.classList.contains("rotate-180")) ||
                     (currentImg.parentElement && currentImg.parentElement.parentElement && currentImg.parentElement.parentElement.classList.contains("rotate-180"));
      
      if (isRotated) {
        imgElement.classList.add("rotate-180");
      } else {
        imgElement.classList.remove("rotate-180");
      }
    }

    function openLightbox(index) {
      previousFocus = document.activeElement;
      showImage(index);
      overlay.classList.add("active");
      closeBtn.focus();
    }

    function closeLightbox() {
      overlay.classList.remove("active");
      if (previousFocus) previousFocus.focus();
    }

    images.forEach(function (img, index) {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", function () {
        openLightbox(index);
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLightbox();
    });

    prevBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });

    nextBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });

    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      if (e.key === "ArrowRight") showImage(currentIndex + 1);
      // Focus trap: keep focus inside overlay
      if (e.key === "Tab") {
        var focusable = overlay.querySelectorAll(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  initLightbox();

  /* ========================================
     BACK TO TOP BUTTON
     ======================================== */
  var backToTopButton = document.getElementById("back-to-top");
  if (backToTopButton) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        backToTopButton.classList.remove("opacity-0", "invisible");
        backToTopButton.classList.add("opacity-100", "visible");
      } else {
        backToTopButton.classList.add("opacity-0", "invisible");
        backToTopButton.classList.remove("opacity-100", "visible");
      }
    }, { passive: true });

    backToTopButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
