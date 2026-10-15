
"use strict";

// ----- Tell the CSS that JavaScript is working -----
document.documentElement.classList.add("js");


// ----- Warn when an image cannot load -----
document.addEventListener("error", event => {
  if (event.target.tagName === "IMG") {
    console.warn(
      "Image not found:",
      event.target.getAttribute("src")
    );
  }
}, true);


// ----- Mobile menu -----
const menuButton = document.querySelector(".nav-toggle");
const menu = document.querySelector(".site-nav");

function setMenu(open) {
  if (!menu || !menuButton) return;

  menu.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? "Close menu" : "Open menu"
  );

  document.body.style.overflow = open ? "hidden" : "";
}

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    setMenu(!menu.classList.contains("open"));
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMenu(false));
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


// ----- Section fade-in animations -----
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const element = entry.target;

      element.classList.add("visible");

      setTimeout(() => {
        element.classList.remove("reveal", "visible");
      }, 600);

      revealObserver.unobserve(element);
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


// ----- Carousels: leaders, gallery and unit photo stages -----
document.querySelectorAll(
  ".leaders-carousel, [data-carousel]"
).forEach(box => {
  const track = box.querySelector(".leaders-track, .c-track");
  const prevButton = box.querySelector(".leaders-prev, .c-prev");
  const nextButton = box.querySelector(".leaders-next, .c-next");
  const count = box.querySelector(".stage-count");

  if (!track || !prevButton || !nextButton) return;

  const step = Number(box.dataset.step) || 0.8;

  function updateCarousel() {
    const maxScroll = track.scrollWidth - track.clientWidth;

    prevButton.disabled = track.scrollLeft <= 2;
    nextButton.disabled = track.scrollLeft >= maxScroll - 2;

    if (count) {
      const total = track.children.length;
      const index = Math.round(
        track.scrollLeft / track.clientWidth
      ) + 1;

      count.textContent =
        Math.min(index, total) + " / " + total;
    }
  }

  prevButton.addEventListener("click", () => {
    track.scrollBy({
      left: -track.clientWidth * step,
      behavior: "smooth"
    });
  });

  nextButton.addEventListener("click", () => {
    track.scrollBy({
      left: track.clientWidth * step,
      behavior: "smooth"
    });
  });

  track.addEventListener("scroll", updateCarousel, {
    passive: true
  });

  window.addEventListener("resize", updateCarousel);

  updateCarousel();
});


// ----- Gallery filter buttons -----
const galleryFilters = document.querySelectorAll(".g-filter");
const galleryItems = document.querySelectorAll(".g-item");
const galleryTrack = document.querySelector(".gallery-scroller");

galleryFilters.forEach(button => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    galleryFilters.forEach(filter => {
      filter.setAttribute(
        "aria-pressed",
        String(filter === button)
      );
    });

    galleryItems.forEach(item => {
      item.hidden =
        selectedFilter !== "all" &&
        item.dataset.cat !== selectedFilter;
    });

    if (galleryTrack) {
      galleryTrack.scrollTo({ left: 0 });
      galleryTrack.dispatchEvent(new Event("scroll"));
    }
  });
});


// ----- Units page: highlight the unit being viewed -----
const unitLinks = [
  ...document.querySelectorAll(".unit-nav a")
];

const unitList = document.querySelector(".unit-nav-list");

if (
  unitLinks.length &&
  "IntersectionObserver" in window
) {
  let lastActive = null;

  const unitObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const activeLink = unitLinks.find(link => {
        return link.getAttribute("href") ===
          "#" + entry.target.id;
      });

      if (!activeLink || activeLink === lastActive) return;

      lastActive = activeLink;

      unitLinks.forEach(link => {
        link.classList.toggle("active", link === activeLink);
      });

      // Move the navigation row without interrupting page scrolling.
      if (unitList) {
        const left =
          activeLink.offsetLeft -
          unitList.offsetLeft -
          (unitList.clientWidth - activeLink.offsetWidth) / 2;

        unitList.scrollTo({
          left,
          behavior: "smooth"
        });
      }
    });
  }, {
    rootMargin: "-40% 0px -50% 0px"
  });

  unitLinks.forEach(link => {
    const target = document.querySelector(
      link.getAttribute("href")
    );

    if (target) {
      unitObserver.observe(target);
    }
  });
}


// ----- Join Unit buttons: open WhatsApp -----

// Use international format without + or the leading 0.
// Example: 2348012345678

const DEFAULT_WHATSAPP = "2347063697174";

const UNIT_LEADERS = {
  choir: "2347063697174",
  drama: "2347063697174",
  prayer: "2347063697174",
  evangelism: "2347063697174",
  welfare: "2347063697174",
  ushering: "2347063697174",
  media: "2347063697174",
  tigers: "2347063697174"
};

document.querySelectorAll("[data-unit]").forEach(link => {
  const unit = link.dataset.unit;
  const number = UNIT_LEADERS[unit] || DEFAULT_WHATSAPP;
  const unitName = link.dataset.name || unit;

  const message =
    "Hello, I would like to join the " +
    unitName +
    " of The SJYF Tribe.";

  link.href =
    "https://wa.me/" +
    number +
    "?text=" +
    encodeURIComponent(message);
});


// ----- Prophetic Declaration: See More / See Less -----
const propheticToggle = document.querySelector("#prophetic-toggle");
const propheticExtra = document.querySelector("#prophetic-extra");

if (propheticToggle && propheticExtra) {
  propheticToggle.addEventListener("click", () => {
    const isExpanded =
      propheticToggle.getAttribute("aria-expanded") === "true";

    propheticExtra.hidden = isExpanded;

    propheticToggle.setAttribute(
      "aria-expanded",
      String(!isExpanded)
    );

    propheticToggle.innerHTML = isExpanded
      ? 'See More <span aria-hidden="true">↓</span>'
      : 'See Less <span aria-hidden="true">↑</span>';
  });
}


// ----- Automatic footer year -----
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
