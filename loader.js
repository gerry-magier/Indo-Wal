// ============================================================
// CENTRAL LOADER FOR NAVBAR AND FOOTER
// Include this before script.js in all HTML files
// ============================================================

(function() {
  'use strict';
  
  // Load partial HTML components
  async function loadPartial(selector, url) {
    const el = document.querySelector(selector);
    if (!el) {
      console.warn(`Element ${selector} not found for loading ${url}`);
      return;
    }

    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
      el.innerHTML = await res.text();
      console.log(`✓ Loaded ${url}`);
    } catch (err) {
      console.error(`✗ Error loading ${url}:`, err);
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
  } else {
    initLoader();
  }

  async function initLoader() {
    // Decide which partials to load (EN root vs DE folder)
    const isDE = window.location.pathname.startsWith("/de/");
    const navPath = isDE ? "/de/navbar.html" : "/navbar.html";
    const footPath = isDE ? "/de/footer.html" : "/footer.html";

    // Load navbar and footer in parallel
    await Promise.all([
      loadPartial("#navbar-placeholder", navPath),
      loadPartial("#footer-placeholder", footPath)
    ]);

    // After footer is loaded, initialize burger menu
    initBurgerMenu();
  }

  // Initialize burger menu (mobile navigation)
  function initBurgerMenu() {
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (burger && mobileMenu) {
      burger.addEventListener('click', () => {
        const isExpanded = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', !isExpanded);
        burger.classList.toggle('active');
        
        if (!isExpanded) {
          mobileMenu.hidden = false;
          document.body.style.overflow = 'hidden';
        } else {
          mobileMenu.hidden = true;
          document.body.style.overflow = '';
        }
      });

      // Close mobile menu when clicking a link
      const mobileLinks = mobileMenu.querySelectorAll('a, button[data-open-request]');
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          burger.setAttribute('aria-expanded', 'false');
          burger.classList.remove('active');
          mobileMenu.hidden = true;
          document.body.style.overflow = '';
        });
      });
    }
  }
})();