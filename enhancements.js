/* ─────────────────────────────────────────────────────────────
   enhancements.js  — Arpit's portfolio subtle additions
   Add before </body>: <script src="enhancements.js"></script>
───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ══════════════════════════════════════════
     1.  INJECT STYLES
  ══════════════════════════════════════════ */
  const css = `
    /* Scroll reveal */
    .eh-hidden { opacity: 0; transform: translateY(22px); }
    .eh-shown  {
      opacity: 1 !important;
      transform: none !important;
      transition: opacity .7s cubic-bezier(.22,1,.36,1),
                  transform .7s cubic-bezier(.22,1,.36,1);
    }

    /* ── Experience Timeline ── */
    .eh-timeline { position: relative; margin-top: 8px; }
    .eh-timeline::before {
      content: '';
      position: absolute;
      left: 0; top: 14px; bottom: 40px;
      width: 1.5px;
      background: linear-gradient(to bottom,
        rgba(123,108,255,0.9),
        rgba(123,108,255,0.3) 60%,
        transparent);
      border-radius: 4px;
    }
    .eh-entry {
      position: relative;
      padding-left: 28px;
      padding-bottom: 44px;
    }
    .eh-entry:last-child { padding-bottom: 0; }
    .eh-dot {
      position: absolute;
      left: -5px; top: 6px;
      width: 11px; height: 11px;
      border-radius: 50%;
      background: #7b6cff;
      border: 2.5px solid #0b0f1e;
      box-shadow: 0 0 0 3px rgba(123,108,255,0.18);
      transition: box-shadow 0.3s ease, background 0.3s ease;
      z-index: 1;
      display: inline-block;
    }
    .eh-entry:hover .eh-dot {
      background: #a49cff;
      box-shadow: 0 0 0 8px rgba(123,108,255,0.12);
    }

    /* ── Skill list item underline swipe ── */
    .eh-skill-li {
      position: relative;
      cursor: default;
    }
    .eh-skill-li::after {
      content: '';
      position: absolute;
      left: 0; bottom: 0;
      height: 1px; width: 0;
      background: linear-gradient(90deg, rgba(123,108,255,0.7), transparent);
      transition: width 0.35s cubic-bezier(.22,1,.36,1);
    }
    .eh-skill-li:hover::after { width: 100%; }
    .eh-skill-li:hover { color: #c5c2ff !important; transition: color 0.2s; }

    /* ── Skill card gentle lift ── */
    .eh-skill-card {
      transition:
        transform 0.32s cubic-bezier(.22,1,.36,1),
        border-color 0.3s,
        box-shadow 0.3s !important;
    }
    .eh-skill-card:hover {
      transform: translateY(-5px) !important;
      border-color: rgba(123,108,255,0.30) !important;
      box-shadow: 0 18px 44px rgba(0,0,0,0.28),
                  0 0 28px rgba(123,108,255,0.06) !important;
    }

    /* ── Stagger helpers ── */
    .eh-d1 { transition-delay: 0.04s !important; }
    .eh-d2 { transition-delay: 0.10s !important; }
    .eh-d3 { transition-delay: 0.16s !important; }
    .eh-d4 { transition-delay: 0.22s !important; }
    .eh-d5 { transition-delay: 0.28s !important; }
    .eh-d6 { transition-delay: 0.34s !important; }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);


  /* ══════════════════════════════════════════
     2.  REMOVE "MEDIUM TECHNICAL AUTHOR" ENTRY
  ══════════════════════════════════════════ */
  document.querySelectorAll('h3').forEach(h3 => {
    if (!/medium technical author/i.test(h3.textContent)) return;
    const victims = [h3];
    let next = h3.nextElementSibling;
    let count = 0;
    while (next && count < 3 && next.tagName !== 'H3') {
      victims.push(next);
      next = next.nextElementSibling;
      count++;
    }
    const prev = h3.previousElementSibling;
    if (prev && /ongoing|^\d{4}/i.test(prev.textContent.trim())) victims.push(prev);
    victims.forEach(el => el.remove());
  });


  /* ══════════════════════════════════════════
     3.  BUILD TIMELINE in EXPERIENCE section
  ══════════════════════════════════════════ */
  (function buildTimeline() {
    // Find the direct parent of the Campus Tech h3
    let host = null;
    document.querySelectorAll('h3').forEach(h3 => {
      if (/campus tech initiative/i.test(h3.textContent)) host = h3.parentElement;
    });
    if (!host) return;

    const h3s = Array.from(host.querySelectorAll('h3'));
    if (!h3s.length) return;

    // Each group: [optional-date, h3, role, desc] — all direct children of host
    const groups = h3s.map(h3 => {
      const nodes = [];
      // date before h3
      const prev = h3.previousElementSibling;
      if (prev && /\d{4}|ongoing/i.test(prev.textContent.trim())) nodes.push(prev);
      // h3 itself
      nodes.push(h3);
      // up to 2 siblings after
      let sib = h3.nextElementSibling;
      let i = 0;
      while (sib && i < 2 && sib.tagName !== 'H3') {
        if (sib.parentElement === host) {
          nodes.push(sib);
          sib = sib.nextElementSibling;
          i++;
        } else break;
      }
      return nodes;
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'eh-timeline';

    groups.forEach((group, idx) => {
      const entry = document.createElement('div');
      entry.className = 'eh-entry eh-hidden eh-d' + (idx + 1);

      // dot
      const dot = document.createElement('span');
      dot.className = 'eh-dot';
      entry.appendChild(dot);

      // move nodes
      group.forEach(el => entry.appendChild(el));
      wrapper.appendChild(entry);
    });

    // Clear any leftover blank text nodes then append
    host.appendChild(wrapper);
  })();


  /* ══════════════════════════════════════════
     4.  SKILLS — underline swipe + card lift
  ══════════════════════════════════════════ */
  (function enhanceSkills() {
    let skillSection = null;
    document.querySelectorAll('section').forEach(s => {
      if (/work with/i.test(s.textContent) && /backend/i.test(s.textContent)) skillSection = s;
    });
    if (!skillSection) return;

    // underline swipe on each li
    skillSection.querySelectorAll('li').forEach((li, i) => {
      li.classList.add('eh-skill-li', 'eh-hidden', 'eh-d' + ((i % 6) + 1));
    });

    // lift on cards that contain h4 + ul
    skillSection.querySelectorAll('div').forEach(div => {
      if (div.querySelector(':scope > h4') || div.querySelector(':scope > ul, :scope > h4')) {
        if (div.querySelector('h4') && div.querySelector('ul')) {
          div.classList.add('eh-skill-card', 'eh-hidden', 'eh-d' + Math.min(div.closest('section').querySelectorAll('.eh-skill-card').length + 1, 6));
        }
      }
    });
  })();


  /* ══════════════════════════════════════════
     5.  SCROLL REVEAL
  ══════════════════════════════════════════ */
  setTimeout(function () {
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.remove('eh-hidden');
          e.target.classList.add('eh-shown');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.eh-hidden').forEach(function (el) { obs.observe(el); });
  }, 100);

})();
