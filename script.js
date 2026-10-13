
"use strict";

// Let CSS know JavaScript is available.
document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".nav-toggle");
const menu = document.querySelector(".site-nav");

// Mobile navigation.
function setMenu(isOpen) {
  if (!header || !menuButton || !menu) return;

  menu.classList.toggle("open", isOpen);
  header.classList.toggle("menu-open", isOpen);

  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close menu" : "Open menu"
  );

  document.body.style.overflow = isOpen ? "hidden" : "";
}

if (header && menuButton && menu) {
  menuButton.addEventListener("click", () => {
    setMenu(!menu.classList.contains("open"));
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      setMenu(false);
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      setMenu(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 960) {
      setMenu(false);
    }
  });
}

// Header scroll effect.
function updateHeader() {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
}

window.addEventListener("scroll", updateHeader, {
  passive: true
});

updateHeader();

// Reveal elements as they enter the screen.
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");

      window.setTimeout(() => {
        entry.target.classList.remove("reveal", "visible");
      }, 550);

      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.08
  });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach(item => {
    item.classList.remove("reveal");
  });
}

// Gallery carousel arrows.
const gallery = document.querySelector(".gallery");
const galleryPrev = document.querySelector(".gallery-prev");
const galleryNext = document.querySelector(".gallery-next");

if (gallery && galleryPrev && galleryNext) {
  galleryNext.addEventListener("click", () => {
    gallery.scrollBy({
      left: gallery.clientWidth * 0.8,
      behavior: "smooth"
    });
  });

  galleryPrev.addEventListener("click", () => {
    gallery.scrollBy({
      left: -gallery.clientWidth * 0.8,
      behavior: "smooth"
    });
  });
}

// Leaders carousel arrows.
const leadersTrack = document.querySelector("#leaders-track");
const leadersPrev = document.querySelector(".leaders-prev");
const leadersNext = document.querySelector(".leaders-next");

if (leadersTrack && leadersPrev && leadersNext) {
  leadersNext.addEventListener("click", () => {
    leadersTrack.scrollBy({
      left: leadersTrack.clientWidth * 0.8,
      behavior: "smooth"
    });
  });

  leadersPrev.addEventListener("click", () => {
    leadersTrack.scrollBy({
      left: -leadersTrack.clientWidth * 0.8,
      behavior: "smooth"
    });
  });
}

// Update the copyright year automatically.
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}
