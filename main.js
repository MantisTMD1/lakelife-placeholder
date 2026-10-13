// Mobile menu, nav show/hide on scroll, and fade-in on scroll
(function () {
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");

  toggle.addEventListener("click", function () {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });

  // Hide the nav when scrolling down, bring it back when scrolling up
  let lastY = window.scrollY;
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    if (!nav.classList.contains("is-open")) {
      nav.classList.toggle("is-hidden", y > lastY && y > 200);
    }
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  items.forEach(function (el) { observer.observe(el); });
})();

// Keep the footer copyright year current
document.querySelectorAll("[data-year]").forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Background video: only on larger screens, after the page has loaded,
// and not for visitors who prefer reduced motion or are saving data.
// Phones keep the still poster image.
(function () {
  const video = document.querySelector(".hero-video[data-src]");
  if (!video) return;
  const saveData = navigator.connection && navigator.connection.saveData;
  const wide = window.matchMedia("(min-width: 768px)").matches;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!wide || still || saveData) return;
  window.addEventListener("load", function () {
    video.src = video.dataset.src;
    video.play().catch(function () {});
  });
})();

// Google Maps embeds are heavy, so load them only when scrolled near
(function () {
  const maps = document.querySelectorAll("iframe[data-src]");
  function load(frame) { frame.src = frame.dataset.src; }
  if (!("IntersectionObserver" in window)) {
    maps.forEach(load);
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        load(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "400px 0px" });
  maps.forEach(function (frame) { observer.observe(frame); });
})();
