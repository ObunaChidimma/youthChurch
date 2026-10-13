
"use strict";

// Tell the CSS that JavaScript is working.
document.documentElement.classList.add("js");

// Show a warning if an image cannot load.
document.addEventListener("error", event => {
  if (event.target.tagName === "IMG") {
    console.warn("Image not found:", event.target.getAttribute("src"));
  }
}, true);


// ----- Mobile menu -----

const menuButton = document.querySelector(".nav-toggle");
const menu = document.querySelector(".site-nav");

// Open or close the menu.
function setMenu(open) {
  menu.classList.toggle("open", open);

  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? "Close menu" : "Open menu"
  );

  document.body.style.overflow = open ? "hidden" : "";
}

// Toggle the menu when the button is clicked.
menuButton.addEventListener("click", () => {
  setMenu(!menu.classList.contains("open"));
});

// Close the menu when a link is clicked.
menu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => setMenu(false));
});

// Close the menu when Escape is pressed.
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    setMenu(false);
  }
});

// Close the menu on larger screens.
window.addEventListener("resize", () => {
  if (window.innerWidth >= 960) {
    setMenu(false);
  }
});


// ----- Fade in sections as they appear -----

const items = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const element = entry.target;

      element.classList.add("visible");

      // Remove animation classes after the animation finishes.
      setTimeout(() => {
        element.classList.remove("reveal", "visible");
      }, 600);

      observer.unobserve(element);
    });
  }, {
    threshold: 0.08
  });

  items.forEach(item => observer.observe(item));

} else {
  // Show the sections if animations are not supported.
  items.forEach(item => {
    item.classList.remove("reveal");
  });
}


// ----- Leaders' carousel arrows -----

const track = document.getElementById("leaders-track");
const prev = document.querySelector(".leaders-prev");
const next = document.querySelector(".leaders-next");

// Enable or disable arrows based on the scroll position.
function updateArrows() {
  prev.disabled = track.scrollLeft <= 2;

  next.disabled =
    track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
}

// Scroll left when the previous arrow is clicked.
prev.addEventListener("click", () => {
  track.scrollBy({
    left: -track.clientWidth * 0.8,
    behavior: "smooth"
  });
});

// Scroll right when the next arrow is clicked.
next.addEventListener("click", () => {
  track.scrollBy({
    left: track.clientWidth * 0.8,
    behavior: "smooth"
  });
});

// Update the arrows when the carousel scrolls or the window resizes.
track.addEventListener("scroll", updateArrows, {
  passive: true
});

window.addEventListener("resize", updateArrows);

// Set the correct arrow states when the page loads.
updateArrows();


// ----- Automatic footer year -----

document.getElementById("year").textContent = new Date().getFullYear();
