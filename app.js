// Fury FC simple UI behaviors (no dependencies)
(function () {
  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Smooth scroll for in-page anchors
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href === "#") return;

    const el = document.querySelector(href);
    if (!el) return;

    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // Close mobile nav after click
    if (nav && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    }
  });

  // Optional: Animate the "Gear Reused" number on load
  const gearEl = document.getElementById("gearCount");
  if (gearEl) {
    const target = parseInt(gearEl.textContent.replace(/[^\d]/g, ""), 10) || 0;
    let current = 0;
    const durationMs = 700;
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / durationMs);
      current = Math.floor(target * (0.15 + 0.85 * t));
      gearEl.textContent = String(current);
      if (t < 1) requestAnimationFrame(tick);
      else gearEl.textContent = String(target);
    }
    requestAnimationFrame(tick);
  }

  // Optional: Active nav link on scroll (lightweight)
  const sections = ["#home", "#recreation", "#select", "#travel", "#about"]
    .map((id) => document.querySelector(id))
    .filter(Boolean);

  const links = Array.from(document.querySelectorAll(".nav-link"));

  function setActive(hash) {
    links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === hash));
  }

  if (sections.length && links.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((x) => x.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

        if (!visible) return;
        const id = "#" + visible.target.id;
        setActive(id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0.05, 0.15, 0.3] }
    );

    sections.forEach((s) => obs.observe(s));
  }
})();
