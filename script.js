
"use strict";

// Let CSS know that JavaScript is working.
document.documentElement.classList.add("js");

// Warn about missing images in the browser Console.
document.addEventListener("error", event => {
  if (event.target.tagName === "IMG") {
    console.warn("Image not found:", event.target.getAttribute("src"));
  }
}, true);

// ----- Mobile menu -----
const menuButton = document.querySelector(".nav-toggle");
const menu = document.querySelector(".site-nav");

function setMenu(open) {
  menu.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
}

// Open and close the menu.
menuButton.addEventListener("click", () => {
  setMenu(!menu.classList.contains("open"));
});

// Close the menu when a navigation link is clicked.
menu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => setMenu(false));
});

// Close the menu with Escape or when the screen becomes wider.
document.addEventListener("keydown", event => {
  if (event.key === "Escape") setMenu(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 960) setMenu(false);
});

// ----- Fade in sections as they appear -----
const items = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      element.classList.add("visible");

      setTimeout(() => {
        element.classList.remove("reveal", "visible");
      }, 600);

      observer.unobserve(element);
    });
  }, {
    threshold: 0.08
  });

  items.forEach(element => observer.observe(element));
} else {
  // Show sections immediately if IntersectionObserver isn't supported.
  items.forEach(element => element.classList.remove("reveal"));
}

// ----- Leaders carousel arrows -----
const track = document.getElementById("leaders-track");
const previousButton = document.querySelector(".leaders-prev");
const nextButton = document.querySelector(".leaders-next");

// Enable or disable arrows based on the carousel's position.
function updateArrows() {
  previousButton.disabled = track.scrollLeft <= 2;

  nextButton.disabled =
    track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
}

// Scroll the carousel when an arrow is clicked.
previousButton.addEventListener("click", () => {
  track.scrollBy({
    left: -track.clientWidth * 0.8,
    behavior: "smooth"
  });
});

nextButton.addEventListener("click", () => {
  track.scrollBy({
    left: track.clientWidth * 0.8,
    behavior: "smooth"
  });
});

// Update arrows when the carousel scrolls or the window resizes.
track.addEventListener("scroll", updateArrows, { passive: true });
window.addEventListener("resize", updateArrows);

updateArrows();

// ----- Footer year -----
document.getElementById("year").textContent = new Date().getFullYear();
