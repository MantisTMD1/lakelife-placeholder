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

// Background video: loaded after the page so it never delays content.
// Phones get a smaller vertical cut. Skipped for visitors who prefer
// reduced motion or are saving data; they keep the still poster image.
(function () {
  const video = document.querySelector(".hero-video[data-src]");
  if (!video) return;
  const saveData = navigator.connection && navigator.connection.saveData;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still || saveData) return;
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  const src = narrow && video.dataset.srcMobile ? video.dataset.srcMobile : video.dataset.src;
  function start() {
    video.src = src;
    video.play().catch(function () {});
  }
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start);
  }
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
