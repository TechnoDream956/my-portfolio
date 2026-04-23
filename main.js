// ── Scroll Progress Bar ──
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) progressBar.style.width = scrolled + '%';
});

// ── Ping Simulator ──
const pingVal = document.getElementById('ping-val');
if (pingVal) {
  setInterval(() => {
    const p = Math.floor(Math.random() * (35 - 18 + 1)) + 18;
    pingVal.textContent = p;
  }, 3000);
}

// ── Particles.js Initialization ──
if (window.particlesJS) {
  particlesJS('particles-js', {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: "#7c6aff" },
      shape: { type: "circle" },
      opacity: { value: 0.2, random: true },
      size: { value: 2, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#7c6aff",
        opacity: 0.1,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        grab: { distance: 200, line_linked: { opacity: 0.3 } },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
}

// ── Navbar Scroll Effect ──
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Staggered Scroll Reveal ──
const revealGroups = [
  { selector: '.section-grid', delay: 0 },
  { selector: '.project-card', delay: 0 },
  { selector: '.cert-card', delay: 0 },
  { selector: '.detail-card', delay: 0 },
  { selector: '.skill-group', delay: 0 },
  { selector: '.contact-inner', delay: 0 },
];

revealGroups.forEach(({ selector }) => {
  const els = document.querySelectorAll(selector);
  els.forEach((el, i) => {
    el.classList.add('reveal');
    if (els.length > 1) {
      el.style.transitionDelay = `${i * 0.1}s`;
    }
  });
});

const allRevealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);
allRevealEls.forEach(el => revealObserver.observe(el));

// ── Smooth Scroll ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Active Nav Highlight ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--text-bright)';
    }
  });
});

// ── Parallax & Interactive Effects ──
document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  // Move blobs subtly for parallax
  document.querySelectorAll('.blob').forEach((blob, index) => {
    const depth = (index + 1) * 30;
    const moveX = (x - 0.5) * depth;
    const moveY = (y - 0.5) * depth;
    blob.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  // Cursor glow
  const glowEl = document.getElementById('cursor-glow');
  if (glowEl && window.innerWidth > 768) {
    glowEl.style.left = e.clientX + 'px';
    glowEl.style.top = e.clientY + 'px';
  }
});


