"use strict";

// Lets the CSS know JavaScript is working.
document.documentElement.classList.add("js");

// Tip: missing photos are listed in the browser Console (press F12).
document.addEventListener("error", e => {
  if (e.target.tagName === "IMG") console.warn("Image not found:", e.target.getAttribute("src"));
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

menuButton.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
window.addEventListener("resize", () => { if (window.innerWidth >= 960) setMenu(false); });

// ----- Fade in sections as they appear -----
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");
      setTimeout(() => el.classList.remove("reveal", "visible"), 600);
      observer.unobserve(el);
    });
  }, { threshold: 0.08 });
  items.forEach(el => observer.observe(el));
} else {
  items.forEach(el => el.classList.remove("reveal"));
}

// ----- Leaders arrows -----
const track = document.getElementById("leaders-track");
const prev = document.querySelector(".leaders-prev");
const next = document.querySelector(".leaders-next");

function updateArrows() {
  prev.disabled = track.scrollLeft <= 2;
  next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
}
prev.addEventListener("click", () => track.scrollBy({ left: -track.clientWidth * 0.8, behavior: "smooth" }));
next.addEventListener("click", () => track.scrollBy({ left: track.clientWidth * 0.8, behavior: "smooth" }));
track.addEventListener("scroll", updateArrows, { passive: true });
window.addEventListener("resize", updateArrows);
updateArrows();

// ----- Footer year -----
document.getElementById("year").textContent = new Date().getFullYear();