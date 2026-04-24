/* enhancements.js — Arpit portfolio additions (fixed & improved v2) */
(function () {
  'use strict';

  /* ── 1. STYLES ─────────────────────────────────────── */
  const css = `
    /* Scroll reveal */
    .eh-hidden { opacity: 0; transform: translateY(24px); }
    .eh-shown  {
      opacity: 1 !important; transform: none !important;
      transition: opacity .65s cubic-bezier(.22,1,.36,1),
                  transform .65s cubic-bezier(.22,1,.36,1);
    }
    .eh-d1 { transition-delay:.06s!important }
    .eh-d2 { transition-delay:.14s!important }
    .eh-d3 { transition-delay:.22s!important }
    .eh-d4 { transition-delay:.30s!important }

    /* ── Timeline item hover ── */
    .timeline-item { transition: transform .3s ease; }
    .timeline-item:hover { transform: translateX(5px); }

    /* ── Skill li hover underline ── */
    .skill-group li {
      position: relative;
      cursor: default;
      transition: color .2s, padding-left .2s;
    }
    .skill-group li::before {
      content: '';
      position: absolute;
      left: 0; bottom: -2px;
      height: 1px; width: 0;
      background: linear-gradient(90deg, rgba(124,106,255,.8), transparent);
      transition: width .35s cubic-bezier(.22,1,.36,1);
    }
    .skill-group li:hover::before { width: 100%; }
    .skill-group li:hover { color: #c5c2ff !important; }

    /* ── Skill card enhanced hover ── */
    .skill-group {
      transition: transform .3s cubic-bezier(.22,1,.36,1),
                  border-color .3s, box-shadow .3s !important;
    }
    .skill-group:hover {
      transform: translateY(-6px) !important;
      border-color: rgba(124,106,255,.35) !important;
      box-shadow: 0 20px 50px rgba(0,0,0,.3),
                  0 0 30px rgba(124,106,255,.08) !important;
    }

    /* ── Project card tilt — handled via JS ── */
    .project-card {
      will-change: transform;
    }

    /* ── Cert card glow on hover ── */
    .cert-card {
      transition: transform .3s ease, box-shadow .3s, border-color .3s !important;
    }
    .cert-card:hover {
      border-color: rgba(124,106,255,.4) !important;
      box-shadow: 0 16px 48px rgba(0,0,0,.35),
                  0 0 24px rgba(124,106,255,.12) !important;
    }

    /* ── Coursework badge pop ── */
    .course-badge {
      transition: transform .25s ease, background .25s, color .25s,
                  box-shadow .25s !important;
    }
    .course-badge:hover {
      transform: translateY(-3px) scale(1.06) !important;
      background: rgba(124,106,255,.18) !important;
      color: #c5c2ff !important;
      box-shadow: 0 6px 20px rgba(124,106,255,.2) !important;
    }

    /* ── Nav link hover underline ── */
    .nav-center a {
      position: relative;
    }
    .nav-center a::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 50%; right: 50%;
      height: 1px;
      background: rgba(124,106,255,.7);
      transition: left .3s ease, right .3s ease;
    }
    .nav-center a:hover::after { left: 0; right: 0; }

    /* ── Blinking terminal cursor ── */
    .t-cursor {
      animation: ehBlink 1.1s step-end infinite;
      display: inline-block;
    }
    @keyframes ehBlink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    /* ── Detail card hover ── */
    .detail-card { transition: transform .3s ease, box-shadow .3s !important; }
    .detail-card:hover { transform: translateY(-5px) !important; }
    .detail-card i { transition: transform .4s cubic-bezier(.34,1.56,.64,1); }
    .detail-card:hover i { transform: scale(1.3) rotate(-8deg); }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── 2. SCROLL REVEAL ───────────────────────────────── */
  const revealTargets = [
    { sel: '.section-label', baseDelay: 1 },
    { sel: '.section-content > h2', baseDelay: 1 },
    { sel: '.project-card', baseDelay: 2 },
    { sel: '.cert-card', baseDelay: 2 },
    { sel: '.detail-card', baseDelay: 2 },
    { sel: '.skill-group', baseDelay: 2 },
    { sel: '.timeline-item', baseDelay: 2 },
    { sel: '.contact-inner', baseDelay: 1 },
    { sel: '.course-badge', baseDelay: 3 },
    { sel: '.quick-stats', baseDelay: 1 },
  ];

  revealTargets.forEach(({ sel, baseDelay }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.classList.contains('eh-hidden')) {
        el.classList.add('eh-hidden', `eh-d${Math.min(i % 4 + 1, 4)}`);
      }
    });
  });

  setTimeout(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.remove('eh-hidden');
          e.target.classList.add('eh-shown');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.eh-hidden').forEach(el => obs.observe(el));
    console.log('[enhancements v2] reveal observer on', document.querySelectorAll('.eh-hidden').length, 'elements');
  }, 250);

  /* ── 3. COUNT-UP ANIMATION FOR STATS ───────────────── */
  function countUp(el, target, suffix, duration) {
    const startTime = performance.now();
    const isFloat = String(target).includes('.');
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = isFloat
        ? (eased * target).toFixed(1)
        : Math.round(eased * target);
      el.textContent = val + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      statsObs.unobserve(entry.target);
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        const raw = el.textContent.trim();
        const suffix = raw.replace(/[\d.]/g, '');
        const num = parseFloat(raw);
        if (!isNaN(num)) countUp(el, num, suffix, 1400);
      });
    });
  }, { threshold: 0.5 });

  const quickStats = document.querySelector('.quick-stats');
  if (quickStats) statsObs.observe(quickStats);

  /* ── 4. PROJECT CARD 3D TILT ────────────────────────── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 3}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .4s cubic-bezier(.22,1,.36,1)';
      card.style.transform = '';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });

  /* ── 5. ACTIVE NAV LINK HIGHLIGHT ──────────────────── */
  const navLinks = document.querySelectorAll('.nav-center a');
  const sections = document.querySelectorAll('section[id]');

  const navObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const matches = link.getAttribute('href') === `#${id}`;
          link.style.color = matches ? 'var(--text-bright)' : '';
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => navObs.observe(s));

  console.log('[enhancements v2] loaded ✓');
})();