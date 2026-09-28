/**
 * EliteHomes — real estate marketing site.
 *
 * Sections:
 *  1. Desktop "Properties" mega menu
 *  2. Mobile menu
 *  3. Mobile dropdown accordions
 *  4. Services tabs (Buying / Selling / Renting / Investing / Commercial)
 *  5. Testimonials carousel
 *  6. FAQ accordion
 *  7. Smooth scrolling for anchor links
 *  8. Scroll-spy navigation
 */

// 1. Desktop "Properties" mega menu
const desktopPropertiesToggle = document.getElementById(
  "desktop-properties-toggle",
);
const desktopMegaMenu = document.getElementById("desktop-mega-menu");

desktopPropertiesToggle?.addEventListener("click", function (event) {
  // attach listener if button exists
  event.preventDefault();

  if (desktopMegaMenu.classList.contains("hidden")) {
    desktopMegaMenu.classList.remove("hidden");
    desktopPropertiesToggle.classList.add("active-link");
  } else {
    desktopMegaMenu.classList.add("hidden");
    desktopPropertiesToggle.classList.remove("active-link");
  }
});

// Close mega menu when clicking anywhere outside its dropdown wrapper
document.addEventListener("click", function (event) {
  const dropdownWrapper = document.getElementById(
    "desktop-properties-dropdown",
  );
  if (dropdownWrapper && !dropdownWrapper.contains(event.target)) {
    desktopMegaMenu?.classList.add("hidden");
    desktopPropertiesToggle?.classList.remove("active-link");
  }
});

// 2. Mobile menu
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const menuIcon = document.getElementById("menu-icon");
const closeIcon = document.getElementById("close-icon");

mobileMenuButton?.addEventListener("click", function () {
  if (mobileMenu.classList.contains("hidden")) {
    mobileMenu.classList.remove("hidden");
    menuIcon.classList.add("hidden");
    closeIcon.classList.remove("hidden");
  } else {
    mobileMenu.classList.add("hidden");
    menuIcon.classList.remove("hidden");
    closeIcon.classList.add("hidden");
  }
});

// 3. Mobile dropdown accordions
document.querySelectorAll(".mobile-dropdown-button").forEach((button) => {
  button.addEventListener("click", function () {
    const dropdownPanel = this.nextElementSibling;
    const chevronIcon = this.querySelector("i");

    if (dropdownPanel.classList.contains("hidden")) {
      dropdownPanel.classList.remove("hidden");
      chevronIcon.style.transform = "rotate(180deg)";
    } else {
      dropdownPanel.classList.add("hidden");
      chevronIcon.style.transform = "rotate(0deg)";
    }
  });
});

// Close whole mobile menu whenever any mobile nav link is clicked
document.querySelectorAll(".mobile-nav-link").forEach((link) => {
  link.addEventListener("click", function () {
    mobileMenu.classList.add("hidden");
    menuIcon.classList.remove("hidden");
    closeIcon.classList.add("hidden");
  });
});

// 4. Services tabs
function showTab(tabId) {
  // Hide all panels
  document.querySelectorAll(".tab-content").forEach((panel) => {
    panel.classList.remove("active");
    panel.style.display = "none";
  });

  // Reset all buttons to "inactive" styling
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.remove(
      "text-violet-600",
      "border-violet-600",
      "bg-violet-50",
    );
    button.classList.add("text-gray-600", "border-transparent");
  });

  // Activate the target panel
  const activePanel = document.getElementById(tabId);
  if (activePanel) {
    activePanel.classList.add("active");
    activePanel.style.display = "block";
  }

  // Highlight the matching button
  const activeButton = document.querySelector(`button[data-tab="${tabId}"]`);
  if (activeButton) {
    activeButton.classList.remove("text-gray-600", "border-transparent");
    activeButton.classList.add(
      "text-violet-600",
      "border-violet-600",
      "bg-violet-50",
    );
  }
}

// Wiring up click listeners
document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", function () {
    const tabId = this.getAttribute("data-tab");
    showTab(tabId);
  });
});

// 5. Testimonials carousel
let currentSlideIndex = 0;
const totalSlides = 4;

function goToNextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
  renderSlide();
}

function goToPrevSlide() {
  currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
  renderSlide();
}

function goToSlide(index) {
  currentSlideIndex = index;
  renderSlide();
}

function renderSlide() {
  const track = document.getElementById("testimonialSlider");
  const dots = document.querySelectorAll(".carousel-dot");

  track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

  dots.forEach((dot) => {
    const dotIndex = parseInt(dot.getAttribute("data-slide"));
    if (dotIndex === currentSlideIndex) {
      dot.classList.remove("bg-white/30", "bg-white/50");
      dot.classList.add("bg-white");
    } else {
      dot.classList.remove("bg-white", "bg-white/50");
      dot.classList.add("bg-white/30");
    }
  });
}

document
  .getElementById("prev-testimonial")
  ?.addEventListener("click", goToPrevSlide);
document
  .getElementById("next-testimonial")
  ?.addEventListener("click", goToNextSlide);

document.querySelectorAll(".carousel-dot").forEach((dot) => {
  dot.addEventListener("click", function () {
    const index = parseInt(this.getAttribute("data-slide"));
    goToSlide(index);
  });
});

// Auto-advance the carousel every 5 seconds
setInterval(goToNextSlide, 5000);

// 6. FAQ accordion
function toggleFaq(faqIndex) {
  const contentPanel = document.getElementById(`faq-content-${faqIndex}`);
  const chevronIcon = document.getElementById(`faq-icon-${faqIndex}`);
  const allContentPanels = document.querySelectorAll(".faq-content");
  // document.querySelectorAll('[id^="faq-icon-"]');

  const wasOpen = contentPanel.classList.contains("active");

  // Close every other open FAQ item
  allContentPanels.forEach((panel, panelIndex) => {
    if (panel.id !== `faq-content-${faqIndex}`) {
      const otherIcon = document.getElementById(`faq-icon-${panelIndex + 1}`);
      if (panel.classList.contains("active")) {
        // Animate from its current height down to 0
        panel.style.height = panel.scrollHeight + "px";
        panel.offsetHeight; // force reflow so the browser registers the starting height
        panel.style.height = "0px";
        panel.classList.remove("active");
        otherIcon?.classList.remove("rotate-180");
      }
    }
  });

  // Close clicked FAQ item
  if (wasOpen) {
    contentPanel.style.height = contentPanel.scrollHeight + "px";
    contentPanel.offsetHeight; // force reflow
    contentPanel.style.height = "0px";
    contentPanel.classList.remove("active");
    chevronIcon.classList.remove("rotate-180");
  } else {
    contentPanel.classList.add("active");
    const targetHeight = contentPanel.scrollHeight;
    contentPanel.style.height = "0px";
    contentPanel.offsetHeight; // force reflow so the transition animates from 0
    contentPanel.style.height = targetHeight + "px";
    chevronIcon.classList.add("rotate-180");

    // Once opening transition finishes, switch to "auto" height so panel can grow/shrink naturally afterwards
    contentPanel.addEventListener("transitionend", function onTransitionEnd() {
      if (contentPanel.classList.contains("active")) {
        contentPanel.style.height = "auto";
      }
      contentPanel.removeEventListener("transitionend", onTransitionEnd);
    });
  }
}

document.querySelectorAll(".faq-toggle").forEach((button) => {
  button.addEventListener("click", function () {
    const faqIndex = parseInt(this.getAttribute("data-faq"));
    toggleFaq(faqIndex);
  });
});

// 7. Smooth scrolling for in-page anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (event) {
    event.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// 8. Scroll-spy navigation
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveNavLink() {
  let currentSectionId = "";
  const scrollPosition = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    // "Properties" mega menu toggle is <button>, not section link — skip it here (it's handled separately by the mega menu logic above)
    if (link.tagName === "BUTTON") return;
    link.classList.remove("active-link");

    const href = link.getAttribute("href");
    if (
      href &&
      href.startsWith("#") &&
      href.substring(1) === currentSectionId
    ) {
      link.classList.add("active-link");
    }
  });
}

window.addEventListener("scroll", updateActiveNavLink);
updateActiveNavLink();
