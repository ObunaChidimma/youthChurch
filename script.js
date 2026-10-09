// Tells the CSS that JavaScript is running (so reveal animations can be used safely)
document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

// ----- Mobile menu: open and close -----
function setMenu(open) {
  nav.classList.toggle('open', open);
  header.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.style.overflow = open ? 'hidden' : '';
}

toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
window.addEventListener('resize', () => { if (window.innerWidth >= 900) setMenu(false); });

// ----- Header turns solid navy after scrolling a little -----
function onScroll() { header.classList.toggle('scrolled', window.scrollY > 40); }
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ----- Gentle fade-in as sections scroll into view -----
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('visible');
      // Remove the animation classes afterwards so hover effects work normally
      setTimeout(() => el.classList.remove('reveal', 'visible'), 800);
      observer.unobserve(el);
    });
  }, { threshold: 0.12 });
  items.forEach(el => observer.observe(el));
} else {
  items.forEach(el => el.classList.remove('reveal'));
}

// ----- Footer year -----
document.getElementById('year').textContent = new Date().getFullYear();