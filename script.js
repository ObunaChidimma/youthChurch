
/* ==================== 1. ENABLE ANIMATIONS ==================== */
document.documentElement.classList.add("js");

/* ==================== 2. SELECT ELEMENTS ==================== */
const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

/* ==================== 3. MOBILE MENU ==================== */
function setMenu(open) {
  nav.classList.toggle("open", open);
  header.classList.toggle("menu-open", open);

  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");

  document.body.style.overflow = open ? "hidden" : "";
}

// Open and close the menu
toggle.addEventListener("click", () => {
  setMenu(!nav.classList.contains("open"));
});

// Close the menu when a link is clicked
nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => setMenu(false));
});

// Close the menu with Escape
document.addEventListener("keydown", event => {
  if (event.key === "Escape") setMenu(false);
});

// Close the menu when switching to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth >= 900) setMenu(false);
});

/* ==================== 4. HEADER SCROLL EFFECT ==================== */
function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 40);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* ==================== 5. SCROLL REVEAL ANIMATIONS ==================== */
const items = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      element.classList.add("visible");

      // Remove animation classes after the animation finishes
      setTimeout(() => {
        element.classList.remove("reveal", "visible");
      }, 800);

      observer.unobserve(element);
    });
  }, { threshold: 0.12 });

  items.forEach(element => observer.observe(element));
} else {
  // Show everything if animations are unsupported
  items.forEach(element => element.classList.remove("reveal"));
}

/* ==================== 6. AUTOMATIC FOOTER YEAR ==================== */
document.getElementById("year").textContent = new Date().getFullYear();
