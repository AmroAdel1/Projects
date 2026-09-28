/**
 * Sections:
 *  1. Utility: debounce
 *  2. Mobile menu
 *  3. Scroll-spy navigation
 *  4. Settings sidebar (fonts + theme colors) // reset
 *  5. Theme color application helpers
 *  6. Dark/light mode toggle
 *  7. Portfolio filter
 *  8. Testimonials carousel
 *  9. Scroll-to-top button
 * 10. Custom select dropdowns (project type / budget)
 * 11. Contact form validation + success popup
 * 12. App bootstrap
 */

// 1. Utility: debounce          // throttle scroll/resize handlers.
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    const runNow = () => {
      clearTimeout(timeoutId);
      fn.apply(this, args);
    };
    clearTimeout(timeoutId);
    timeoutId = setTimeout(runNow, delay);
  };
}

// 2. Mobile menu
function initMobileMenu() {
  document.querySelector("#header");
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) return;

  const menuButton = document.createElement("button");
  menuButton.className =
    "mobile-menu-btn lg:hidden text-slate-900 dark:text-white text-2xl focus:outline-none";
  menuButton.setAttribute("aria-label", "Open menu");
  menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';

  document.querySelector("#header .container").appendChild(menuButton);

  menuButton.addEventListener("click", function () {
    navLinks.classList.toggle("active");
    const icon = menuButton.querySelector("i");

    if (navLinks.classList.contains("active")) {
      icon.className = "fa-solid fa-times";
      menuButton.setAttribute("aria-label", "Close menu");
    } else {
      icon.className = "fa-solid fa-bars";
      menuButton.setAttribute("aria-label", "Open menu");
    }
  });

  // Close the mobile menu whenever a nav link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.classList.remove("active");
      menuButton.querySelector("i").className = "fa-solid fa-bars";
      menuButton.setAttribute("aria-label", "Open menu");
    });
  });
}

// 3. Scroll-spy navigation
function initScrollSpyNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveLink() {
    let currentSectionId = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 100) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", debounce(updateActiveLink, 50));
  updateActiveLink();
}

// 4. Settings sidebar (fonts + theme colors)
function initSettingsSidebar() {
  const sidebar = document.getElementById("settings-sidebar");
  const openButton = document.getElementById("settings-toggle");
  const closeButton = document.getElementById("close-settings");
  const resetButton = document.getElementById("reset-settings");
  const fontOptionButtons = document.querySelectorAll(".font-option");
  const themeColorsGrid = document.getElementById("theme-colors-grid");

  if (!sidebar || !openButton) return;

  const themeOptions = [
    {
      name: "Purple Blue",
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#a855f7",
    },
    {
      name: "Pink Orange",
      primary: "#ec4899",
      secondary: "#f97316",
      accent: "#fb923c",
    },
    {
      name: "Green Emerald",
      primary: "#10b981",
      secondary: "#059669",
      accent: "#34d399",
    },
    {
      name: "Blue Cyan",
      primary: "#3b82f6",
      secondary: "#06b6d4",
      accent: "#22d3ee",
    },
    {
      name: "Red Rose",
      primary: "#ef4444",
      secondary: "#f43f5e",
      accent: "#fb7185",
    },
    {
      name: "Amber Orange",
      primary: "#f59e0b",
      secondary: "#ea580c",
      accent: "#fbbf24",
    },
  ];

  // NOTE: the sidebar and its toggle button now live on the LEFT edge of
  // the page (LTR layout), so the hidden/off-canvas state uses
  // "-translate-x-full" (not "translate-x-full"), and the button's inline
  // offset is applied via style.left (not style.right).
  function openSidebar() {
    sidebar.classList.remove("-translate-x-full");
    openButton.style.left = "20rem";
  }

  function closeSidebar() {
    sidebar.classList.add("-translate-x-full");
    openButton.style.left = "0";
  }

  openButton.addEventListener("click", openSidebar);
  closeButton.addEventListener("click", closeSidebar);

  // Close the sidebar when clicking anywhere outside it (and the toggle button)
  document.addEventListener("click", (event) => {
    const clickedOutside =
      !sidebar.contains(event.target) && !openButton.contains(event.target);

    if (clickedOutside && !sidebar.classList.contains("-translate-x-full")) {
      closeSidebar();
    }
  });

  fontOptionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const fontKey = button.getAttribute("data-font");
      applyFont(fontKey);
    });
  });

  function applyFont(fontKey) {
    document.body.classList.remove(
      "font-alexandria",
      "font-tajawal",
      "font-cairo",
    );
    document.body.classList.add(`font-${fontKey}`);

    fontOptionButtons.forEach((button) => {
      if (button.getAttribute("data-font") === fontKey) {
        button.classList.add(
          "active",
          "border-primary",
          "bg-slate-50",
          "dark:bg-slate-800",
        );
        button.classList.remove("border-slate-200", "dark:border-slate-700");
      } else {
        button.classList.remove(
          "active",
          "border-primary",
          "bg-slate-50",
          "dark:bg-slate-800",
        );
        button.classList.add("border-slate-200", "dark:border-slate-700");
      }
    });

    localStorage.setItem("selectedFont", fontKey);
  }

  // Build the color-swatch grid
  if (themeColorsGrid) {
    themeColorsGrid.innerHTML = "";

    themeOptions.forEach((theme) => {
      const swatchButton = document.createElement("button");
      swatchButton.className =
        "w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 border-slate-200 dark:border-slate-700 hover:border-primary shadow-sm";
      swatchButton.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
      swatchButton.setAttribute("title", theme.name);
      swatchButton.setAttribute("data-primary", theme.primary);
      swatchButton.setAttribute("data-secondary", theme.secondary);

      swatchButton.addEventListener("click", () => {
        applyThemeColors(theme.primary, theme.secondary, theme.accent);

        themeColorsGrid.querySelectorAll("button").forEach((otherButton) => {
          otherButton.classList.remove(
            "ring-2",
            "ring-primary",
            "ring-offset-2",
            "ring-offset-white",
            "dark:ring-offset-slate-900",
          );
        });
        swatchButton.classList.add(
          "ring-2",
          "ring-primary",
          "ring-offset-2",
          "ring-offset-white",
          "dark:ring-offset-slate-900",
        );

        localStorage.setItem(
          "selectedTheme",
          JSON.stringify({
            primary: theme.primary,
            secondary: theme.secondary,
            accent: theme.accent,
          }),
        );
      });

      themeColorsGrid.appendChild(swatchButton);
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      localStorage.removeItem("selectedTheme");
      localStorage.removeItem("selectedFont");
      applyFont("tajawal");

      const defaultTheme = themeOptions[0];
      applyThemeColors(
        defaultTheme.primary,
        defaultTheme.secondary,
        defaultTheme.accent,
      );

      // Re-trigger the first swatch's click handler to update its highlight ring too
      const firstSwatch = themeColorsGrid.querySelector("button");
      if (firstSwatch) firstSwatch.click();

      closeSidebar();
    });
  }

  function restoreSavedFont() {
    const savedFont = localStorage.getItem("selectedFont");
    applyFont(savedFont || "tajawal");
  }

  restoreSavedFont();
}

// 5. Theme color application helpers
function applyThemeColors(primary, secondary, accent) {
  document.documentElement.style.setProperty("--color-primary", primary);
  document.documentElement.style.setProperty("--color-secondary", secondary);
  document.documentElement.style.setProperty("--color-accent", accent);

  document
    .querySelectorAll(
      '[class*="from-primary"], [class*="to-secondary"], [class*="from-secondary"]',
    )
    .forEach((element) => {
      element.offsetHeight; // eslint-disable-line no-unused-expressions
    });

  updateInlineGradientSwatches(primary, secondary);
}

function updateInlineGradientSwatches(primary, secondary) {
  document.querySelectorAll('[style*="linear-gradient"]').forEach((element) => {
    const currentBackground = element.style.background;
    if (currentBackground.includes("linear-gradient")) {
      const gradientPattern = /linear-gradient\([^)]+\)/;
      const newGradient = `linear-gradient(135deg, ${primary}, ${secondary})`;
      element.style.background = currentBackground.replace(
        gradientPattern,
        newGradient,
      );
    }
  });
}

function loadSavedTheme() {
  const savedThemeJson = localStorage.getItem("selectedTheme");
  if (!savedThemeJson) return;

  try {
    const savedTheme = JSON.parse(savedThemeJson);
    const primary = savedTheme.primary || savedTheme.from;
    const secondary = savedTheme.secondary || savedTheme.to;
    const accent = savedTheme.accent || savedTheme.primary || savedTheme.from;

    applyThemeColors(primary, secondary, accent);

    // Wait a tick for the swatch grid to exist, then highlight the match
    setTimeout(() => {
      const swatchButtons = document.querySelectorAll(
        "#theme-colors-grid button",
      );
      swatchButtons.forEach((swatchButton) => {
        if (
          swatchButton.getAttribute("data-primary") === primary &&
          swatchButton.getAttribute("data-secondary") === secondary
        ) {
          swatchButtons.forEach((btn) =>
            btn.classList.remove(
              "ring-2",
              "ring-primary",
              "ring-offset-2",
              "ring-offset-white",
              "dark:ring-offset-slate-900",
            ),
          );
          swatchButton.classList.add(
            "ring-2",
            "ring-primary",
            "ring-offset-2",
            "ring-offset-white",
            "dark:ring-offset-slate-900",
          );
        }
      });
    }, 100);
  } catch (error) {
    console.error("Error loading saved theme:", error);
  }
}

// 6. Dark/light mode toggle
function initDarkModeToggle() {
  const toggleButton = document.getElementById("theme-toggle-button");
  const htmlElement = document.documentElement;
  if (!toggleButton) return;

  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "dark") {
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.remove("dark");
  }

  toggleButton.addEventListener("click", function () {
    const isNowDark = htmlElement.classList.toggle("dark");
    localStorage.setItem("theme", isNowDark ? "dark" : "light");
  });
}

// 7. Portfolio filter
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll(".portfolio-filter");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  document.getElementById("portfolio-grid");
  if (filterButtons.length === 0 || portfolioItems.length === 0) return;

  filterButtons.forEach((filterButton) => {
    filterButton.addEventListener("click", function () {
      const selectedFilter = this.getAttribute("data-filter");

      // Reset every filter button to its inactive style
      filterButtons.forEach((button) => {
        button.classList.remove(
          "active",
          "bg-linear-to-r",
          "from-primary",
          "to-secondary",
          "text-white",
          "shadow-lg",
          "shadow-primary/50",
        );
        button.classList.add(
          "bg-white",
          "dark:bg-slate-800",
          "text-slate-600",
          "dark:text-slate-300",
          "border",
          "border-slate-300",
          "dark:border-slate-700",
        );
      });

      // Activate the clicked filter button
      this.classList.remove(
        "bg-white",
        "dark:bg-slate-800",
        "text-slate-600",
        "dark:text-slate-300",
        "border",
        "border-slate-300",
        "dark:border-slate-700",
      );
      this.classList.add(
        "active",
        "bg-linear-to-r",
        "from-primary",
        "to-secondary",
        "text-white",
        "shadow-lg",
        "shadow-primary/50",
      );

      // Fade everything out first...
      portfolioItems.forEach((item) => {
        item.style.opacity = "0";
        item.style.transform = "scale(0.8)";
      });

      // ...then swap visibility based on category...
      setTimeout(() => {
        portfolioItems.forEach((item) => {
          const category = item.getAttribute("data-category");
          if (selectedFilter === "all" || category === selectedFilter) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });

        // ...then fade the matching items back in
        setTimeout(() => {
          portfolioItems.forEach((item) => {
            const category = item.getAttribute("data-category");
            if (selectedFilter === "all" || category === selectedFilter) {
              item.style.opacity = "1";
              item.style.transform = "scale(1)";
            }
          });
        }, 50);
      }, 300);
    });
  });

  portfolioItems.forEach((item) => {
    item.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  });
}

// 8. Testimonials carousel
function initTestimonialsCarousel() {
  const track = document.getElementById("testimonials-carousel");
  const prevButton = document.getElementById("prev-testimonial");
  const nextButton = document.getElementById("next-testimonial");
  const indicators = document.querySelectorAll(".carousel-indicator");
  const cards = document.querySelectorAll(".testimonial-card");

  if (!track || !prevButton || !nextButton || cards.length === 0) return;

  let currentIndex = 0;
  const totalCards = cards.length;

  function getCardsPerView() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  let cardsPerView = getCardsPerView();
  let maxIndex = totalCards - cardsPerView;

  function render() {
    cardsPerView = getCardsPerView();
    maxIndex = totalCards - cardsPerView;

    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    // Each card occupies (100 / cardsPerView)% of track's width, so shifting by one card = shifting by that percentage.
    // The track is shifted in the negative direction (toward the start) to reveal later cards in an LTR layout.
    const percentPerCard = 100 / cardsPerView;
    const offsetPercent = currentIndex * percentPerCard;
    track.style.transform = `translateX(-${offsetPercent}%)`;

    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.add("active", "bg-accent", "scale-125");
        indicator.classList.remove("bg-slate-400", "dark:bg-slate-600");
      } else {
        indicator.classList.remove("active", "bg-accent", "scale-125");
        indicator.classList.add("bg-slate-400", "dark:bg-slate-600");
      }
    });
  }

  function goToNext() {
    currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
    render();
  }

  function goToPrev() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
    render();
  }

  function goToIndex(index) {
    if (index >= 0 && index <= maxIndex) {
      currentIndex = index;
      render();
    }
  }

  nextButton.addEventListener("click", () => goToNext());
  prevButton.addEventListener("click", () => goToPrev());

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => goToIndex(index));
  });

  window.addEventListener(
    "resize",
    debounce(() => render(), 150),
  );

  render();
}

// 9. Scroll-to-top button
function initScrollToTopButton() {
  const button = document.getElementById("scroll-to-top");
  if (!button) return;

  window.addEventListener(
    "scroll",
    debounce(() => {
      if (window.scrollY > 300) {
        button.classList.remove("opacity-0", "invisible");
        button.classList.add("opacity-100", "visible");
      } else {
        button.classList.remove("opacity-100", "visible");
        button.classList.add("opacity-0", "invisible");
      }
    }, 100),
  );

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// 10. Custom select dropdowns (project type / budget)
function initCustomSelectDropdowns() {
  document.querySelectorAll(".custom-select").forEach((selectTrigger) => {
    const selectedTextEl = selectTrigger.querySelector(".selected-text");
    const chevronIcon = selectTrigger.querySelector(".fa-chevron-down");
    const optionsPanel = selectTrigger.nextElementSibling;
    const optionEls = optionsPanel.querySelectorAll(".custom-option");

    selectTrigger.addEventListener("click", (event) => {
      event.stopPropagation();

      // Close any other open dropdowns first
      document.querySelectorAll(".custom-options").forEach((otherPanel) => {
        if (otherPanel !== optionsPanel) {
          otherPanel.classList.add("hidden");
          otherPanel.previousElementSibling.querySelector(
            ".fa-chevron-down",
          ).style.transform = "rotate(0deg)";
        }
      });

      optionsPanel.classList.toggle("hidden");
      chevronIcon.style.transform = optionsPanel.classList.contains("hidden")
        ? "rotate(0deg)"
        : "rotate(180deg)";
    });

    optionEls.forEach((optionEl) => {
      optionEl.addEventListener("click", (event) => {
        event.stopPropagation();
        const value = optionEl.getAttribute("data-value");

        selectedTextEl.textContent = value;
        selectedTextEl.classList.remove(
          "text-slate-400",
          "text-slate-500",
          "dark:text-slate-400",
        );
        selectedTextEl.classList.add("text-slate-800", "dark:text-white");

        optionEls.forEach((el) => el.classList.remove("bg-primary/10"));
        optionEl.classList.add("bg-primary/10");

        optionsPanel.classList.add("hidden");
        chevronIcon.style.transform = "rotate(0deg)";
      });
    });
  });

  // Close all dropdowns when clicking anywhere else on the page
  document.addEventListener("click", () => {
    document.querySelectorAll(".custom-options").forEach((panel) => {
      panel.classList.add("hidden");
      panel.previousElementSibling.querySelector(
        ".fa-chevron-down",
      ).style.transform = "rotate(0deg)";
    });
  });
}

// 11. Contact form validation + success popup
function initContactFormValidation() {
  const form = document.querySelector("#contact form");
  if (!form) return;

  const fields = form.querySelectorAll("input, textarea");
  const fieldKeysInOrder = ["name", "email", "phone", "message"];

  fields.forEach((field, index) => {
    if (fieldKeysInOrder[index]) {
      field.id = `contact-${fieldKeysInOrder[index]}`;
      const label = field.previousElementSibling;
      if (label && label.tagName === "LABEL") {
        label.setAttribute("for", field.id);
      }
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let isValid = true;

    // Clear any previous error state
    form.querySelectorAll(".error-message").forEach((el) => el.remove());
    form.querySelectorAll(".border-red-500").forEach((el) => {
      el.classList.remove("border-red-500");
    });

    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const messageTextarea = form.querySelector("textarea");
    const projectTypeSelectedText = form.querySelector(
      '.custom-select[data-name="project-type"] .selected-text',
    );

    if (!nameInput.value.trim()) {
      showFieldError(nameInput, "Please enter your full name");
      isValid = false;
    }

    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim()) {
      if (!EMAIL_PATTERN.test(emailInput.value)) {
        showFieldError(emailInput, "Please enter a valid email address");
        isValid = false;
      }
    } else {
      showFieldError(emailInput, "Please enter your email address");
      isValid = false;
    }

    if (phoneInput.value.trim()) {
      const PHONE_PATTERN =
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      if (!PHONE_PATTERN.test(phoneInput.value.replace(/\s/g, ""))) {
        showFieldError(phoneInput, "Please enter a valid phone number");
        isValid = false;
      }
    }

    // The custom "project type" select still shows its placeholder text
    // (styled with text-slate-400) if nothing has been chosen yet
    if (projectTypeSelectedText.classList.contains("text-slate-400")) {
      const wrapper = projectTypeSelectedText.closest(".custom-select-wrapper");
      wrapper.querySelector(".custom-select").classList.add("border-red-500");
      showFieldError(wrapper, "Please select a project type");
      isValid = false;
    }

    if (messageTextarea.value.trim()) {
      if (messageTextarea.value.trim().length < 10) {
        showFieldError(messageTextarea, "Please provide more details");
        isValid = false;
      }
    } else {
      showFieldError(messageTextarea, "Please enter your project details");
      isValid = false;
    }

    if (isValid) {
      showSuccessPopup();
      form.reset();

      // Reset the custom selects back to their placeholder state
      form.querySelectorAll(".selected-text").forEach((el) => {
        el.classList.add("text-slate-500", "dark:text-slate-400");
        el.classList.remove("text-slate-800", "dark:text-white");
      });
      form.querySelector(
        '.custom-select[data-name="project-type"] .selected-text',
      ).textContent = "Select project type";
      form.querySelector(
        '.custom-select[data-name="budget"] .selected-text',
      ).textContent = "Select budget";
    }
  });

  // Appends a small red error message under (or inside, for the custom
  // select wrapper) the given field, and marks the field itself invalid
  function showFieldError(field, message) {
    const errorEl = document.createElement("p");
    errorEl.className = "error-message text-red-400 text-sm mt-1";
    errorEl.textContent = message;

    if (field.classList.contains("custom-select-wrapper")) {
      field.appendChild(errorEl);
    } else {
      field.classList.add("border-red-500");
      field.parentElement.appendChild(errorEl);
    }
  }

  // Shows a full-screen "message sent" confirmation modal that
  // auto-dismisses after 5 seconds (or immediately on button click)
  function showSuccessPopup() {
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 flex items-center justify-center z-50 bg-slate-950/80 backdrop-blur-sm";
    overlay.innerHTML = `
        <div class="bg-slate-800 rounded-2xl p-8 max-w-md mx-4 text-center border border-slate-700 shadow-2xl transform animate-fade-in">
          <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fa-solid fa-check text-4xl text-white"></i>
          </div>
          <h3 class="text-2xl font-bold mb-3">Your message has been sent!</h3>
          <p class="text-slate-400 mb-6">Thanks for reaching out. I'll get back to you as soon as possible.</p>
          <button class="success-popup-close bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300">
            OK
          </button>
        </div>
      `;

    document.body.appendChild(overlay);

    overlay
      .querySelector(".success-popup-close")
      .addEventListener("click", () => {
        overlay.remove();
      });

    setTimeout(() => {
      if (overlay.parentNode) overlay.remove();
    }, 5000);
  }

  // Clear a field's error state as soon as the user starts fixing it
  fields.forEach((field) => {
    field.addEventListener("input", function () {
      this.classList.remove("border-red-500");
      const errorEl = this.parentElement.querySelector(".error-message");
      if (errorEl) errorEl.remove();
    });
  });
}

// 12. App bootstrap
document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initScrollSpyNav();
  initSettingsSidebar();
  initDarkModeToggle();
  initPortfolioFilter();
  initTestimonialsCarousel();
  initScrollToTopButton();
  initCustomSelectDropdowns();
  initContactFormValidation();
  loadSavedTheme();

  console.log("All features initialized successfully!");
});
