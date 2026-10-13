
// Let the CSS know JavaScript is available.
document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.nav-toggle');
const menu = document.querySelector('.site-nav');

// Open or close the mobile menu.
function setMenu(isOpen) {
  if (!header || !menuButton || !menu) return;

  menu.classList.toggle('open', isOpen);
  header.classList.toggle('menu-open', isOpen);

  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute(
    'aria-label',
    isOpen ? 'Close menu' : 'Open menu'
  );

  document.body.style.overflow = isOpen ? 'hidden' : '';
}

// Toggle the menu when the button is clicked.
if (header && menuButton && menu) {
  menuButton.addEventListener('click', () => {
    setMenu(!menu.classList.contains('open'));
  });

  // Close the menu when a navigation link is clicked.
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setMenu(false);
    });
  });

  // Close the menu when Escape is pressed.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      setMenu(false);
    }
  });

  // Close the mobile menu when the screen becomes desktop-sized.
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 960) {
      setMenu(false);
    }
  });
}

// Change the header style when the page is scrolled.
function updateHeader() {
  if (!header) return;

  header.classList.toggle('scrolled', window.scrollY > 40);
}

window.addEventListener('scroll', updateHeader, {
  passive: true
});

updateHeader();

// Reveal sections when they enter the screen.
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');

      window.setTimeout(() => {
        entry.target.classList.remove('reveal', 'visible');
      }, 800);

      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.12
  });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach(item => {
    item.classList.remove('reveal');
  });
}

// Gallery arrows move horizontally through the photos.
const gallery = document.querySelector('.gallery');
const previousGalleryButton = document.querySelector('.gallery-prev');
const nextGalleryButton = document.querySelector('.gallery-next');

if (gallery && previousGalleryButton && nextGalleryButton) {
  previousGalleryButton.addEventListener('click', () => {
    gallery.scrollBy({
      left: -gallery.clientWidth * 0.8,
      behavior: 'smooth'
    });
  });

  nextGalleryButton.addEventListener('click', () => {
    gallery.scrollBy({
      left: gallery.clientWidth * 0.8,
      behavior: 'smooth'
    });
  });
}

// Leader arrows move through the two-row leaders carousel.
const leadersTrack = document.querySelector('#leaders-track');
const previousLeadersButton = document.querySelector('.leaders-prev');
const nextLeadersButton = document.querySelector('.leaders-next');

if (leadersTrack && previousLeadersButton && nextLeadersButton) {
  previousLeadersButton.addEventListener('click', () => {
    leadersTrack.scrollBy({
      left: -leadersTrack.clientWidth * 0.8,
      behavior: 'smooth'
    });
  });

  nextLeadersButton.addEventListener('click', () => {
    leadersTrack.scrollBy({
      left: leadersTrack.clientWidth * 0.8,
      behavior: 'smooth'
    });
  });
}

// Automatically update the copyright year.
const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}
