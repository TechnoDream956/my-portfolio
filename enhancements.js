/* enhancements.js — Arpit portfolio additions */
(function () {
  'use strict';

  /* ── 1. STYLES ─────────────────────────────────────── */
  const css = `
    .eh-hidden { opacity: 0; transform: translateY(20px); }
    .eh-shown  {
      opacity: 1 !important; transform: none !important;
      transition: opacity .65s cubic-bezier(.22,1,.36,1),
                  transform .65s cubic-bezier(.22,1,.36,1);
    }
    .eh-d1 { transition-delay:.05s!important }
    .eh-d2 { transition-delay:.12s!important }
    .eh-d3 { transition-delay:.19s!important }

    /* Timeline */
    .eh-timeline { position:relative; padding-top:4px; }
    .eh-timeline::before {
      content:''; position:absolute;
      left:0; top:14px; bottom:40px; width:1.5px;
      background: linear-gradient(to bottom,
        rgba(123,108,255,.9), rgba(123,108,255,.25) 70%, transparent);
      border-radius:4px;
    }
    .eh-entry { position:relative; padding-left:26px; padding-bottom:40px; }
    .eh-entry:last-child { padding-bottom:0; }
    .eh-dot {
      position:absolute; left:-4.5px; top:5px;
      width:10px; height:10px; border-radius:50%;
      background:#7b6cff; border:2px solid #0b0f1e;
      box-shadow: 0 0 0 3px rgba(123,108,255,.2);
      transition: box-shadow .3s, background .3s;
      display:block;
    }
    .eh-entry:hover .eh-dot {
      background:#a49cff;
      box-shadow: 0 0 0 8px rgba(123,108,255,.12);
    }

    /* Skill li */
    .eh-skill-li { position:relative; cursor:default; }
    .eh-skill-li::after {
      content:''; position:absolute;
      left:0; bottom:0; height:1px; width:0;
      background:linear-gradient(90deg,rgba(123,108,255,.7),transparent);
      transition: width .35s cubic-bezier(.22,1,.36,1);
    }
    .eh-skill-li:hover::after { width:100%; }
    .eh-skill-li:hover { color:#c5c2ff !important; transition:color .2s; }

    /* Skill card */
    .eh-skill-card {
      transition: transform .3s cubic-bezier(.22,1,.36,1),
                  border-color .3s, box-shadow .3s !important;
    }
    .eh-skill-card:hover {
      transform:translateY(-5px) !important;
      border-color:rgba(123,108,255,.3) !important;
      box-shadow:0 18px 44px rgba(0,0,0,.28),
                 0 0 28px rgba(123,108,255,.06) !important;
    }
  `;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);

  /* ── 2. DEBUG: log what h3s exist ─────────────────── */
  console.log('[enhancements] loaded. h3s found:',
    Array.from(document.querySelectorAll('h3')).map(h => h.textContent.trim()));

  /* ── 3. REMOVE MEDIUM ENTRY ────────────────────────── */
  document.querySelectorAll('h3, strong').forEach(el => {
    if (!/medium technical author/i.test(el.textContent)) return;
    // go up to nearest block-level ancestor that is a direct child of the exp area
    let target = el;
    while (target.parentElement && target.parentElement.tagName !== 'SECTION'
      && !target.parentElement.classList.contains('experience-content')
      && target.parentElement.childElementCount <= 4) {
      target = target.parentElement;
    }
    // collect: the element + previous "Ongoing" sibling + following role/desc
    const toRemove = new Set([target]);
    const prev = target.previousElementSibling;
    if (prev && /ongoing/i.test(prev.textContent)) toRemove.add(prev);
    let next = target.nextElementSibling;
    let n = 0;
    while (next && n < 2 && !/\d{4}/i.test(next.textContent.slice(0, 8))) {
      toRemove.add(next); next = next.nextElementSibling; n++;
    }
    toRemove.forEach(el => { console.log('[enhancements] removing:', el.textContent.trim().slice(0, 40)); el.remove(); });
  });

  /* ── 4. TIMELINE ────────────────────────────────────── */
  // Strategy: find exp section, collect all experience blocks,
  // wrap in timeline entries. We detect exp section by its h2 text.
  let expSection = null;
  document.querySelectorAll('section').forEach(sec => {
    if (/ecosystem/i.test(sec.textContent) && /campus tech/i.test(sec.textContent)) {
      expSection = sec;
    }
  });

  if (expSection) {
    console.log('[enhancements] found exp section');

    // Find all h3s in section
    const allH3 = Array.from(expSection.querySelectorAll('h3'));
    console.log('[enhancements] exp h3s:', allH3.map(h => h.textContent.trim()));

    if (allH3.length > 0) {
      // Find the container that holds the first h3
      const container = allH3[0].parentElement;

      // Snapshot all direct children of container that come after the h2
      const h2 = container.querySelector('h2') || expSection.querySelector('h2');
      let children = Array.from(container.children);

      // Split children into groups, each starting with a date or h3
      // First pass: flatten into a node list after the h2
      const afterH2 = [];
      let pastH2 = !h2; // if no h2 found, include everything
      children.forEach(child => {
        if (!pastH2) { if (child === h2 || child.contains(h2)) { pastH2 = true; } return; }
        afterH2.push(child);
      });

      // Group: a group starts when we see an h3 (or element just before an h3 that looks like a date)
      const groups = [];
      let current = null;
      afterH2.forEach(el => {
        const isTitle = el.tagName === 'H3' || el.querySelector('h3');
        const isDate = !isTitle && /^\s*(\d{4}|ongoing)/i.test(el.textContent.trim());
        if (isDate) {
          current = { nodes: [el] };
          groups.push(current);
        } else if (isTitle) {
          if (!current) { current = { nodes: [] }; groups.push(current); }
          current.nodes.push(el);
        } else {
          if (current) current.nodes.push(el);
        }
      });

      console.log('[enhancements] groups found:', groups.length);

      if (groups.length > 0) {
        const wrapper = document.createElement('div');
        wrapper.className = 'eh-timeline';

        groups.forEach((g, i) => {
          const entry = document.createElement('div');
          entry.className = `eh-entry eh-hidden eh-d${Math.min(i + 1, 3)}`;
          const dot = document.createElement('span');
          dot.className = 'eh-dot';
          entry.appendChild(dot);
          g.nodes.forEach(n => entry.appendChild(n)); // move (not clone)
          wrapper.appendChild(entry);
        });

        // Insert timeline after h2 in container
        if (h2 && h2.parentElement === container) {
          h2.after(wrapper);
        } else {
          container.appendChild(wrapper);
        }
      }
    }
  } else {
    console.warn('[enhancements] exp section NOT found');
  }

  /* ── 5. SKILLS ──────────────────────────────────────── */
  const skillSec = document.getElementById('skills');
  if (skillSec) {
    skillSec.querySelectorAll('li').forEach((li, i) => {
      li.classList.add('eh-skill-li', 'eh-hidden', `eh-d${(i % 3) + 1}`);
    });
    skillSec.querySelectorAll('div').forEach(div => {
      if (div.querySelector('h4') && div.querySelector('ul')) {
        div.classList.add('eh-skill-card', 'eh-hidden', 'eh-d1');
      }
    });
  }

  /* ── 6. SCROLL REVEAL ───────────────────────────────── */
  setTimeout(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.remove('eh-hidden');
          e.target.classList.add('eh-shown');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.eh-hidden').forEach(el => obs.observe(el));
    console.log('[enhancements] reveal observer set up on', document.querySelectorAll('.eh-hidden').length, 'elements');
  }, 150);

})();