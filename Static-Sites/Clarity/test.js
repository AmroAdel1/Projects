(function () {
  const i = document.createElement("link").relList;
  if (i && i.supports && i.supports("modulepreload")) return;
  for (const t of document.querySelectorAll('link[rel="modulepreload"]')) o(t);
  new MutationObserver((t) => {
    for (const r of t)
      if (r.type === "childList")
        for (const a of r.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && o(a);
  }).observe(document, {
    childList: !0,
    subtree: !0,
  });
  function s(t) {
    const r = {};
    return (
      t.integrity && (r.integrity = t.integrity),
      t.referrerPolicy && (r.referrerPolicy = t.referrerPolicy),
      t.crossOrigin === "use-credentials"
        ? (r.credentials = "include")
        : t.crossOrigin === "anonymous"
          ? (r.credentials = "omit")
          : (r.credentials = "same-origin"),
      r
    );
  }
  function o(t) {
    if (t.ep) return;
    t.ep = !0;
    const r = s(t);
    fetch(t.href, r);
  }
})();
document.querySelectorAll('a[href^="#"]').forEach((e) => {
  e.addEventListener("click", function (i) {
    i.preventDefault();
    const s = document.querySelector(this.getAttribute("href"));
    if (s) {
      s.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      const o = document.getElementById("mobile-menu");
      o && !o.classList.contains("hidden") && o.classList.add("hidden");
    }
  });
});
const d = document.getElementById("mobile-menu-toggle"),
  v = document.getElementById("mobile-menu"),
  l = d == null ? void 0 : d.querySelector("i");
d &&
  v &&
  d.addEventListener("click", function () {
    (v.classList.toggle("hidden"),
      l &&
        (v.classList.contains("hidden")
          ? (l.classList.remove("fa-times"), l.classList.add("fa-bars"))
          : (l.classList.remove("fa-bars"), l.classList.add("fa-times"))));
  });
const g = document.getElementById("mobile-services-toggle"),
  m = document.getElementById("mobile-services-menu"),
  h = document.getElementById("mobile-services-icon");
g &&
  m &&
  g.addEventListener("click", function () {
    (m.classList.contains("hidden")
      ? m.classList.replace("hidden", "grid")
      : m.classList.replace("grid", "hidden"),
      h.classList.toggle("rotate-180"));
  });
const y = document.getElementById("services-menu-btn"),
  n = document.getElementById("services-mega-menu"),
  u = document.getElementById("services-chevron");
if (y && n) {
  let e = !1;
  (y.addEventListener("click", function (i) {
    (i.stopPropagation(),
      (e = !e),
      e
        ? (n.classList.remove("opacity-0", "invisible", "translate-y-2"),
          n.classList.add("opacity-100", "visible", "translate-y-0"),
          u.classList.add("rotate-180"))
        : (n.classList.add("opacity-0", "invisible", "translate-y-2"),
          n.classList.remove("opacity-100", "visible", "translate-y-0"),
          u.classList.remove("rotate-180")));
  }),
    document.addEventListener("click", function (i) {
      !y.contains(i.target) &&
        !n.contains(i.target) &&
        e &&
        ((e = !1),
        n.classList.add("opacity-0", "invisible", "translate-y-2"),
        n.classList.remove("opacity-100", "visible", "translate-y-0"),
        u.classList.remove("rotate-180"));
    }),
    n.querySelectorAll("a").forEach((i) => {
      i.addEventListener("click", function () {
        ((e = !1),
          n.classList.add("opacity-0", "invisible", "translate-y-2"),
          n.classList.remove("opacity-100", "visible", "translate-y-0"),
          u.classList.remove("rotate-180"));
      });
    }));
}
window.addEventListener("scroll", function () {
  const e = document.getElementById("header");
  window.scrollY > 100
    ? (e.classList.add("bg-white/98"), e.classList.remove("bg-white/95"))
    : (e.classList.add("bg-white/95"), e.classList.remove("bg-white/98"));
});
const p = document.querySelectorAll("section[id]"),
  b = document.querySelectorAll('nav a[href^="#"]:not(#services-mega-menu a)');
function L() {
  const e = window.scrollY + 150;
  let i = "";
  (p.forEach((s) => {
    const o = s.offsetTop,
      t = s.offsetHeight,
      r = s.getAttribute("id");
    e >= o && e < o + t && (i = r);
  }),
    b.forEach((s) => {
      const o = s.getAttribute("href");
      s.closest("#services-mega-menu") ||
        (o === `#${i}`
          ? (s.classList.remove("text-gray-700"),
            s.classList.add("text-primary", "font-bold", "nav-active"))
          : (s.classList.remove("text-primary", "font-bold", "nav-active"),
            s.classList.add("text-gray-700")));
    }));
}
window.addEventListener("scroll", L);
document.addEventListener("DOMContentLoaded", L);
document.querySelector("form").addEventListener("submit", function (e) {
  (e.preventDefault(), new FormData(this));
  const i = ["firstName", "lastName", "email", "message"];
  let s = !0;
  (i.forEach((o) => {
    const t = this.querySelector(`[name="${o}"]`);
    t && !t.value.trim()
      ? ((s = !1), t.classList.add("border-red-500"))
      : t && t.classList.remove("border-red-500");
  }),
    s
      ? (alert("Thank you for your message! We'll get back to you soon."),
        this.reset())
      : alert("Please fill in all required fields."));
});
const E = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  },
  q = new IntersectionObserver(function (e) {
    e.forEach((i) => {
      i.isIntersecting && i.target.classList.add("animate-fade-in-up");
    });
  }, E);
document.querySelectorAll("section").forEach((e) => {
  q.observe(e);
});
(function () {
  let e = 0;
  const i = document.getElementById("testimonials-track"),
    s = document.querySelectorAll(".testimonial-indicator"),
    o = s.length;
  function t() {
    ((i.style.transform = `translateX(-${e * 100}%)`),
      s.forEach((c, f) => {
        f === e
          ? (c.classList.remove("bg-gray-300"), c.classList.add("bg-primary"))
          : (c.classList.remove("bg-primary"), c.classList.add("bg-gray-300"));
      }));
  }
  function r() {
    ((e = (e + 1) % o), t());
  }
  function a(c) {
    ((e = c), t());
  }
  (s.forEach((c, f) => {
    c.addEventListener("click", () => a(f));
  }),
    setInterval(r, 5e3),
    t());
})();
document.addEventListener("DOMContentLoaded", function () {
  const e = document.querySelectorAll(".tech-tab"),
    i = document.querySelectorAll(".tech-panel");
  e.forEach((s) => {
    s.addEventListener("click", function () {
      const o = this.dataset.tab;
      (e.forEach((t) => {
        (t.classList.remove("active", "text-primary", "border-primary"),
          t.classList.add("text-gray-600", "border-transparent"));
      }),
        i.forEach((t) => {
          t.classList.remove("active");
        }),
        this.classList.remove("text-gray-600", "border-transparent"),
        this.classList.add("active", "text-primary", "border-primary"),
        document.getElementById(o).classList.add("active"));
    });
  });
});
window.toggleFAQ = function (e) {
  const i = e.closest(".faq-item"),
    s = i.querySelector(".faq-answer"),
    o = e.querySelector("i"),
    t = s.style.maxHeight && s.style.maxHeight !== "0px";
  (document.querySelectorAll(".faq-item").forEach((r) => {
    if (r !== i) {
      const a = r.querySelector(".faq-answer"),
        c = r.querySelector(".faq-question i");
      ((a.style.maxHeight = "0px"), c.classList.remove("rotate-180"));
    }
  }),
    t
      ? ((s.style.maxHeight = "0px"), o.classList.remove("rotate-180"))
      : ((s.style.maxHeight = s.scrollHeight + "px"),
        o.classList.add("rotate-180")));
};
