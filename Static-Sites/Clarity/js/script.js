/**
 * Handles:
 *  - Smooth scrolling for anchor links
 *  - Mobile menu toggle
 *  - Mobile "Services" accordion
 *  - Desktop "Services" mega menu
 *  - Header background change on scroll
 *  - Scroll-spy for nav links (highlights active section)
 *  - Contact form validation
 *  - Fade-in-on-scroll animations (IntersectionObserver)
 *  - Testimonials carousel
 *  - Technology stack tabs
 *  - FAQ accordion
 */

// 1. Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (event) {
    event.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      const mobileMenu = document.getElementById("mobile-menu"); // closes the mobile menu when clicking on a link
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
      }
    }
  });
});

// 2. Mobile menu toggle
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuIcon = mobileMenuToggle?.querySelector("i");

if (mobileMenuToggle && mobileMenu) {
  mobileMenuToggle.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");

    if (mobileMenuIcon) {
      if (mobileMenu.classList.contains("hidden")) {
        mobileMenuIcon.classList.remove("fa-times");
        mobileMenuIcon.classList.add("fa-bars");
      } else {
        mobileMenuIcon.classList.remove("fa-bars");
        mobileMenuIcon.classList.add("fa-times");
      }
    }
  });
}

// 3. Mobile "Services" accordion
const mobileServicesToggle = document.getElementById("mobile-services-toggle");
const mobileServicesMenu = document.getElementById("mobile-services-menu");
const mobileServicesIcon = document.getElementById("mobile-services-icon");

if (mobileServicesToggle && mobileServicesMenu) {
  mobileServicesToggle.addEventListener("click", function () {
    if (mobileServicesMenu.classList.contains("hidden")) {
      mobileServicesMenu.classList.replace("hidden", "grid");
    } else {
      mobileServicesMenu.classList.replace("grid", "hidden");
    }
    mobileServicesIcon.classList.toggle("rotate-180");
  });
}

// 4. Desktop "Services" mega menu
const servicesMenuBtn = document.getElementById("services-menu-btn");
const servicesMegaMenu = document.getElementById("services-mega-menu");
const servicesChevron = document.getElementById("services-chevron");

if (servicesMenuBtn && servicesMegaMenu) {
  let isMegaMenuOpen = false;

  function openMegaMenu() {
    servicesMegaMenu.classList.remove(
      "opacity-0",
      "invisible",
      "translate-y-2",
    );
    servicesMegaMenu.classList.add("opacity-100", "visible", "translate-y-0");
    servicesChevron.classList.add("rotate-180");
  }

  function closeMegaMenu() {
    servicesMegaMenu.classList.add("opacity-0", "invisible", "translate-y-2");
    servicesMegaMenu.classList.remove(
      "opacity-100",
      "visible",
      "translate-y-0",
    );
    servicesChevron.classList.remove("rotate-180");
  }

  servicesMenuBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    isMegaMenuOpen = !isMegaMenuOpen;
    if (isMegaMenuOpen) {
      openMegaMenu();
    } else {
      closeMegaMenu();
    }
  });

  // Close the mega menu when clicking anywhere outside of it
  document.addEventListener("click", function (event) {
    const clickedOutside =
      !servicesMenuBtn.contains(event.target) &&
      !servicesMegaMenu.contains(event.target);

    if (clickedOutside && isMegaMenuOpen) {
      isMegaMenuOpen = false;
      closeMegaMenu();
    }
  });

  // Close the mega menu whenever a link inside it is clicked
  servicesMegaMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", function () {
      isMegaMenuOpen = false;
      closeMegaMenu();
    });
  });
}

// 5. Header background change
window.addEventListener("scroll", function () {
  const header = document.getElementById("header");
  if (window.scrollY > 100) {
    header.classList.add("bg-white/98");
    header.classList.remove("bg-white/95");
  } else {
    header.classList.add("bg-white/95");
    header.classList.remove("bg-white/98");
  }
});

// 6. Scroll-spy
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(
  'nav a[href^="#"]:not(#services-mega-menu a)',
);

function updateActiveNavLink() {
  const scrollPosition = window.scrollY + 150;
  let currentSectionId = "";

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollPosition >= top && scrollPosition < top + height) {
      currentSectionId = id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    // Skip links inside the mega menu (handled separately)
    if (link.closest("#services-mega-menu")) return;

    if (href === `#${currentSectionId}`) {
      link.classList.remove("text-gray-700");
      link.classList.add("text-primary", "font-bold", "nav-active");
    } else {
      link.classList.remove("text-primary", "font-bold", "nav-active");
      link.classList.add("text-gray-700");
    }
  });
}

window.addEventListener("scroll", updateActiveNavLink);
document.addEventListener("DOMContentLoaded", updateActiveNavLink);

// 7. Contact form validation
document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();
  //new FormData(this); // (collected but unused beyond validation)

  const requiredFields = ["firstName", "lastName", "email"];
  let isValid = true;

  requiredFields.forEach((fieldName) => {
    const field = this.querySelector(`[name="${fieldName}"]`);
    if (field && !field.value.trim()) {
      // If field exists and its trimmed value is empty
      isValid = false;
      field.classList.add("border-red-500");
    } else if (field) {
      field.classList.remove("border-red-500");
    }
  });

  if (isValid) {
    alert("Thank you for your message! We'll get back to you soon.");
    this.reset();
  } else {
    alert("Please fill in all required fields.");
  }
});

// 8. Fade-in-on-scroll animation
const fadeInObserverOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const fadeInObserver = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-fade-in-up");
    }
  });
}, fadeInObserverOptions);

document.querySelectorAll("section").forEach((section) => {
  fadeInObserver.observe(section);
});

// 9. Testimonials carousel
(function initTestimonialsCarousel() {
  let currentIndex = 0;

  const track = document.getElementById("testimonials-track");
  const indicators = document.querySelectorAll(".testimonial-indicator");
  const slideCount = indicators.length;

  function renderSlide() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.remove("bg-gray-300");
        indicator.classList.add("bg-primary");
      } else {
        indicator.classList.remove("bg-primary");
        indicator.classList.add("bg-gray-300");
      }
    });
  }

  function goToNextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    renderSlide();
  }

  function goToSlide(index) {
    currentIndex = index;
    renderSlide();
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => goToSlide(index));
  });

  setInterval(goToNextSlide, 5000);
  renderSlide();
})();

// 10. Technology stack tabs
document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tech-tab");
  const panels = document.querySelectorAll(".tech-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const targetPanelId = this.dataset.tab;

      // Reset all tabs to inactive state
      tabs.forEach((t) => {
        t.classList.remove("active", "text-primary", "border-primary");
        t.classList.add("text-gray-600", "border-transparent");
      });

      // Hide all panels
      panels.forEach((panel) => {
        panel.classList.remove("active");
      });

      // Activate the clicked tab
      this.classList.remove("text-gray-600", "border-transparent");
      this.classList.add("active", "text-primary", "border-primary");

      // Show the matching panel
      document.getElementById(targetPanelId).classList.add("active");
    });
  });
});

// 11. FAQ accordion
window.toggleFAQ = function (questionButton) {
  const faqItem = questionButton.closest(".faq-item");
  const answer = faqItem.querySelector(".faq-answer");
  const icon = questionButton.querySelector("i");

  const isCurrentlyOpen =
    answer.style.maxHeight && answer.style.maxHeight !== "0px";

  // Close every other open FAQ item
  document.querySelectorAll(".faq-item").forEach((item) => {
    if (item !== faqItem) {
      const otherAnswer = item.querySelector(".faq-answer");
      const otherIcon = item.querySelector(".faq-question i");
      otherAnswer.style.maxHeight = "0px";
      otherIcon.classList.remove("rotate-180");
    }
  });

  // Toggle the clicked FAQ item
  if (isCurrentlyOpen) {
    answer.style.maxHeight = "0px";
    icon.classList.remove("rotate-180");
  } else {
    answer.style.maxHeight = answer.scrollHeight + "px";
    icon.classList.add("rotate-180");
  }
};
