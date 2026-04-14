/**
 * Twin Expeditions — Cookie Consent Manager
 * Implements Google Consent Mode v2 (GDPR-compliant, opt-in)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'twin_cookie_consent';

  var isDE =
    document.documentElement.lang === 'de' ||
    location.pathname.indexOf('/de/') === 0;

  var t = isDE
    ? {
        text: 'Wir nutzen Google Analytics, um zu verstehen, wie Besucher unsere Website nutzen. Du kannst ablehnen — die Website funktioniert genauso gut ohne.',
        accept: 'Analytics akzeptieren',
        reject: 'Ablehnen',
        policy: 'Datenschutz',
        policyHref: '/de/#',
        ariaLabel: 'Cookie-Einstellungen',
      }
    : {
        text: 'We use Google Analytics to understand how visitors use our site. You can decline — the site works just as well without it.',
        accept: 'Accept Analytics',
        reject: 'Decline',
        policy: 'Privacy Policy',
        policyHref: '/#',
        ariaLabel: 'Cookie Settings',
      };

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function saveConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  function updateGtag(granted) {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
  }

  function removeBanner() {
    var el = document.getElementById('cookie-banner');
    if (el) {
      el.classList.remove('cookie-visible');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
    }
  }

  function openPrivacyModal() {
    // Try the footer Privacy button (id used by loader.js)
    var btn = document.getElementById('openPrivacyFooter');
    if (btn) { btn.click(); return; }
    // Fallback: open modal directly
    var modal = document.getElementById('privacyModal');
    if (modal) {
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function showBanner() {
    if (document.getElementById('cookie-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-label', t.ariaLabel);

    banner.innerHTML =
      '<div class="cookie-inner">' +
        '<p class="cookie-text">' +
          t.text +
          ' <button type="button" class="cookie-policy-btn">' + t.policy + '</button>' +
        '</p>' +
        '<div class="cookie-btns">' +
          '<button id="cookie-reject" class="cookie-btn cookie-btn-secondary" type="button">' + t.reject + '</button>' +
          '<button id="cookie-accept" class="cookie-btn cookie-btn-primary" type="button">' + t.accept + '</button>' +
        '</div>' +
        '<button id="cookie-close" class="cookie-close" type="button" aria-label="Close">\u00d7</button>' +
      '</div>';

    document.body.appendChild(banner);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { banner.classList.add('cookie-visible'); });
    });

    document.getElementById('cookie-accept').addEventListener('click', function () {
      saveConsent('granted');
      updateGtag(true);
      removeBanner();
    });

    document.getElementById('cookie-reject').addEventListener('click', function () {
      saveConsent('denied');
      updateGtag(false);
      removeBanner();
    });

    // X close = same as decline
    document.getElementById('cookie-close').addEventListener('click', function () {
      saveConsent('denied');
      updateGtag(false);
      removeBanner();
    });

    banner.querySelector('.cookie-policy-btn').addEventListener('click', function () {
      openPrivacyModal();
    });
  }

  // Public: re-open settings from footer link
  window.openCookieSettings = function () {
    removeBanner();
    setTimeout(showBanner, 350);
  };

  // Initialize
  var stored = getConsent();
  if (stored === 'granted') {
    updateGtag(true);
  } else if (!stored) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { setTimeout(showBanner, 600); });
    } else {
      setTimeout(showBanner, 600);
    }
  }
}());
