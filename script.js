"use strict";

// Tell the CSS that JavaScript is working.
document.documentElement.classList.add("js");

// Warn us (in the browser Console, press F12) when an image cannot load.
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

if (menuButton && menu) {
  menuButton.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth >= 960) setMenu(false); });
}


// ----- Section fade-in animations -----
const items = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      element.classList.add("visible");
      setTimeout(() => element.classList.remove("reveal", "visible"), 600);
      observer.unobserve(element);
    });
  }, { threshold: 0.08 });
  items.forEach(item => observer.observe(item));
} else {
  items.forEach(item => item.classList.remove("reveal"));
}


// ----- Carousels: leaders, gallery and unit photo stages -----
// Works for anything with the old leaders classes or a data-carousel attribute.
document.querySelectorAll(".leaders-carousel, [data-carousel]").forEach(box => {
  const track = box.querySelector(".leaders-track, .c-track");
  const prev = box.querySelector(".leaders-prev, .c-prev");
  const next = box.querySelector(".leaders-next, .c-next");
  const count = box.querySelector(".stage-count");
  if (!track || !prev || !next) return;

  const step = Number(box.dataset.step) || 0.8;

  function update() {
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    if (count) {
      const total = track.children.length;
      const index = Math.round(track.scrollLeft / track.clientWidth) + 1;
      count.textContent = Math.min(index, total) + " / " + total;
    }
  }

  prev.addEventListener("click", () => track.scrollBy({ left: -track.clientWidth * step, behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: track.clientWidth * step, behavior: "smooth" }));
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
});


// ----- Gallery filter buttons -----
const filters = document.querySelectorAll(".g-filter");
const galleryItems = document.querySelectorAll(".g-item");
const galleryTrack = document.querySelector(".gallery-scroller");

filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(b => b.setAttribute("aria-pressed", String(b === button)));

    galleryItems.forEach(item => {
      item.hidden = button.dataset.filter !== "all" && item.dataset.cat !== button.dataset.filter;
    });

    if (galleryTrack) {
      galleryTrack.scrollTo({ left: 0 });
      galleryTrack.dispatchEvent(new Event("scroll"));
    }
  });
});


// ----- Units page: highlight the unit you are reading -----
const unitLinks = [...document.querySelectorAll(".unit-nav a")];
const unitList = document.querySelector(".unit-nav-list");

if (unitLinks.length && "IntersectionObserver" in window) {
  let lastActive = null;

  const unitObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const active = unitLinks.find(link => link.getAttribute("href") === "#" + entry.target.id);
      if (!active || active === lastActive) return;
      lastActive = active;

      unitLinks.forEach(link => link.classList.toggle("active", link === active));

      // Slide only the button row sideways. (scrollIntoView would interrupt your swiping.)
      if (unitList) {
        const left = active.offsetLeft - unitList.offsetLeft - (unitList.clientWidth - active.offsetWidth) / 2;
        unitList.scrollTo({ left: left, behavior: "smooth" });
      }
    });
  }, { rootMargin: "-40% 0px -50% 0px" });

  unitLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section) unitObserver.observe(section);
  });
}


// ----- "Join Unit" buttons open WhatsApp with each unit's leader -----
// EDIT HERE: for each unit, paste the leader's WhatsApp number OR a full WhatsApp link.
//   Number: international format, for example "2348012345678" (no + and no leading 0;
//           "0801 234 5678" or "+234 801 234 5678" also work).
//   Link:   for example "https://wa.me/2348012345678"
// Leave a unit as "" to use the link already written in units.html (or the default number).
const DEFAULT_WHATSAPP = "2347063697174";
const UNIT_LEADERS = {
  choir: "https://wa.me/2347033605723",
  drama: "https://wa.me/qr/RQNOXDQYBVJWF1",
  prayer: "https://wa.me/message/VKJUU2P3N4EJB1",
  evangelism: "https://wa.me/qr/D3QJJU46ORKSC1",
  welfare: "https://wa.me/2347063697174",
  ushering: "https://wa.me/qr/A3LKFLQU4GR5A1",
  media: "https://wa.me/message/VKJUU2P3N4EJB1",
  tigers: "https://wa.me/message/VKJUU2P3N4EJB1"
};

function whatsappLink(value, message) {
  value = value.trim();

  // A full link was pasted: use it exactly as it is.
  if (/^https?:\/\//i.test(value)) {
    // Only plain number links (wa.me/234...) can carry a ready-made message.
    // QR and message links (wa.me/qr/..., wa.me/message/...) must stay untouched.
    if (/^https?:\/\/wa\.me\/\d+$/i.test(value)) {
      return value + "?text=" + encodeURIComponent(message);
    }
    return value;
  }

  // A phone number was typed: clean it up.
  let number = value.replace(/\D/g, "");
  if (number.startsWith("0")) number = "234" + number.slice(1);
  return "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
}

document.querySelectorAll("[data-unit]").forEach(link => {
  const message = "Hello, I would like to join the " + link.dataset.name + " of The SJYF Tribe.";
  const typed = (UNIT_LEADERS[link.dataset.unit] || "").trim();

  if (typed) {
    link.href = whatsappLink(typed, message);
  } else {
    // Nothing typed above: keep a custom link written in units.html,
    // and only fall back to the default number when there isn't one.
    const current = link.getAttribute("href") || "";
    if (!current || current === "#" || current.includes(DEFAULT_WHATSAPP)) {
      link.href = whatsappLink(DEFAULT_WHATSAPP, message);
    }
  }
});


// ----- Prophetic Declaration: See More / See Less -----
const propheticToggle = document.querySelector("#prophetic-toggle");
const propheticExtra = document.querySelector("#prophetic-extra");

if (propheticToggle && propheticExtra) {
  propheticToggle.addEventListener("click", () => {
    const isExpanded = propheticToggle.getAttribute("aria-expanded") === "true";
    propheticExtra.hidden = isExpanded;
    propheticToggle.setAttribute("aria-expanded", String(!isExpanded));
    propheticToggle.innerHTML = isExpanded
      ? 'See More <span aria-hidden="true">↓</span>'
      : 'See Less <span aria-hidden="true">↑</span>';
  });
}


// ----- Automatic footer year -----
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();