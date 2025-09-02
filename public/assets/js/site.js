// Shared site-wide JavaScript for Board Game Awards API
// Handles partial loading, dark mode toggle, mobile navigation, analytics, and helper utilities.

window.analyticsQueue = window.analyticsQueue || [];
export function track(event, meta = {}) {
  window.analyticsQueue.push({ event, meta, ts: Date.now() });
  if (window.console && console.log) console.log('[analytics]', event, meta);
}

export async function loadPartials() {
  const slots = document.querySelectorAll('[data-include]');
  for (const el of slots) {
    const name = el.getAttribute('data-include');
    try {
      const res = await fetch(`/partials/${name}.html`);
      if (res.ok) {
        el.outerHTML = await res.text();
      }
    } catch (e) {
      console.warn('Partial load failed', name, e);
    }
  }
}

export function initSharedUI({ enableScrollSpy = true } = {}) {
  // Dark mode toggle
  const root = document.documentElement;
  const btn = document.getElementById('darkToggle');
  if (btn) {
    const stored = localStorage.getItem('bgawards.dark');
    if (stored === '1') root.classList.add('dark');
    const sync = () => {
      const dark = root.classList.contains('dark');
      btn.setAttribute('aria-pressed', dark);
      btn.textContent = dark ? 'Light' : 'Dark';
    };
    sync();
    btn.addEventListener('click', () => {
      root.classList.toggle('dark');
      const dark = root.classList.contains('dark');
      localStorage.setItem('bgawards.dark', dark ? '1' : '0');
      sync();
      track(dark ? 'dark_mode_enable' : 'dark_mode_disable');
    });
  }

  // Mobile nav (if present)
  const toggle = document.getElementById('mobileNavToggle');
  const panel = document.getElementById('mobileNavPanel');
  const overlay = document.getElementById('mobileNavOverlay');
  const openIcon = document.getElementById('mobileNavIconOpen');
  const closeIcon = document.getElementById('mobileNavIconClose');
  const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  function openMenu() {
    lastFocused = document.activeElement;
    toggle.setAttribute('aria-expanded', 'true');
    panel.style.transform = 'scaleY(1)';
    panel.style.opacity = '1';
    overlay.classList.add('active');
    openIcon?.classList.add('hidden');
    closeIcon?.classList.remove('hidden');
    const first = panel.querySelector(focusableSelectors);
    first && first.focus();
    document.addEventListener('keydown', handleKey);
  }
  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    panel.style.transform = 'scaleY(0)';
    panel.style.opacity = '0';
    overlay.classList.remove('active');
    openIcon?.classList.remove('hidden');
    closeIcon?.classList.add('hidden');
    document.removeEventListener('keydown', handleKey);
    lastFocused && lastFocused.focus();
  }
  function handleKey(e) {
    if (e.key === 'Escape') closeMenu();
    if (e.key === 'Tab') {
      const f = Array.from(panel.querySelectorAll(focusableSelectors));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  if (toggle && panel && overlay) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      expanded ? closeMenu() : openMenu();
    });
    overlay.addEventListener('click', closeMenu);
    panel.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));
  }

  // Analytics automatic binding
  document.querySelectorAll('[data-analytics]').forEach(el => el.addEventListener('click', () => track(el.getAttribute('data-analytics'))));

  // Scroll spy (only when on a page containing sections)
  if (enableScrollSpy) {
    const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
    if (navLinks.length) {
      const sections = navLinks.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
      if (sections.length) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              navLinks.forEach(l => l.classList.toggle('nav-link-active', l.getAttribute('href') === '#' + id));
            }
          });
        }, { rootMargin: '-50% 0px -40% 0px', threshold: [0, 0.25, 0.6] });
        sections.forEach(sec => observer.observe(sec));
      }
    }
  }

  // Smooth internal nav from other pages: convert nav links to index if not on index
  const isIndex = /(?:^|\/)index\.html?$/.test(window.location.pathname) || window.location.pathname === '/';
  document.querySelectorAll('nav a[data-section]').forEach(a => {
    const section = a.getAttribute('data-section');
    if (!isIndex) {
      // Ensure returning to index page
      a.setAttribute('href', `/index.html#${section}`);
    } else {
      // On index we want hash only to avoid reload
      a.setAttribute('href', `#${section}`);
    }
  });
}

// Utility to initialize once partials are loaded
export async function boot({ animations } = {}) {
  await loadPartials();
  initSharedUI();
  if (typeof animations === 'function') animations();
}
