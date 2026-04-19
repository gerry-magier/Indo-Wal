/**
 * Twin Expeditions - Cookie Consent Manager
 * Provides a common banner pattern with optional analytics consent.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'twin_cookie_consent';
  var BANNER_ID = 'cookie-banner';
  var SETTINGS_ID = 'cookie-settings-modal';

  var isDE =
    document.documentElement.lang === 'de' ||
    location.pathname.indexOf('/de/') === 0;

  var t = isDE
    ? {
        title: 'Wir verwenden Cookies',
        text: 'Wir verwenden Cookies und vergleichbare Technologien, um die Website zu betreiben und optional die Nutzung mit Google Analytics zu messen.',
        acceptAll: 'Alle akzeptieren',
        necessaryOnly: 'Alle ablehnen',
        customize: 'Einstellungen',
        saveSelection: 'Auswahl speichern',
        settingsTitle: 'Cookie-Einstellungen',
        settingsText: 'Du kannst selbst festlegen, welche optionalen Cookies aktiviert werden. Notwendige Cookies bleiben immer aktiv.',
        necessaryTitle: 'Notwendige Cookies',
        necessaryDescription: 'Diese Cookies sind f\u00fcr Grundfunktionen wie Sicherheit, Sprache oder die Anzeige der Seite erforderlich.',
        analyticsTitle: 'Analyse / Statistik',
        analyticsDescription: 'Hilft uns mit Google Analytics zu verstehen, welche Inhalte besucht werden und wie wir die Website verbessern k\u00f6nnen.',
        alwaysActive: 'Immer aktiv',
        active: 'Aktiv',
        inactive: 'Inaktiv',
        close: 'Schlie\u00dfen',
        policy: 'Datenschutz',
        ariaBanner: 'Cookie-Hinweis',
        ariaSettings: 'Cookie-Einstellungen'
      }
    : {
        title: 'We use cookies',
        text: 'We use cookies and similar technologies to run the website and optionally measure usage with Google Analytics.',
        acceptAll: 'Accept all',
        necessaryOnly: 'Reject all',
        customize: 'Customize',
        saveSelection: 'Save selection',
        settingsTitle: 'Cookie settings',
        settingsText: 'You can decide which optional cookies are enabled. Necessary cookies always stay active.',
        necessaryTitle: 'Necessary cookies',
        necessaryDescription: 'These cookies are required for core features such as security, language handling or page rendering.',
        analyticsTitle: 'Analytics / statistics',
        analyticsDescription: 'Lets us use Google Analytics to understand which content is visited and how we can improve the website.',
        alwaysActive: 'Always active',
        active: 'Active',
        inactive: 'Inactive',
        close: 'Close',
        policy: 'Privacy Policy',
        ariaBanner: 'Cookie notice',
        ariaSettings: 'Cookie settings'
      };

  function getRawConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function getConsentState() {
    var stored = getRawConsent();

    if (stored === 'granted') {
      return { necessary: true, analytics: true };
    }

    if (stored === 'denied') {
      return { necessary: true, analytics: false };
    }

    if (!stored) {
      return null;
    }

    try {
      var parsed = JSON.parse(stored);
      return {
        necessary: true,
        analytics: !!(parsed && parsed.analytics)
      };
    } catch (error) {
      return null;
    }
  }

  function saveConsent(state) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          necessary: true,
          analytics: !!state.analytics,
          updatedAt: new Date().toISOString()
        })
      );
    } catch (error) {}
  }

  function updateGtag(granted) {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
  }

  function applyConsent(state) {
    var granted = !!(state && state.analytics);
    saveConsent({ analytics: granted });
    updateGtag(granted);
  }

  function removeElement(id) {
    var el = document.getElementById(id);
    if (!el) {
      return;
    }

    el.classList.remove('cookie-visible');
    window.setTimeout(function () {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 220);
  }

  function closeBanner() {
    removeElement(BANNER_ID);
  }

  function closeSettings(restoreBanner) {
    var modal = document.getElementById(SETTINGS_ID);
    if (!modal) {
      if (restoreBanner && !getConsentState()) {
        showBanner();
      }
      return;
    }

    modal.classList.remove('cookie-visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cookie-modal-open');

    window.setTimeout(function () {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
      if (restoreBanner && !getConsentState()) {
        showBanner();
      }
    }, 220);
  }

  function openPrivacyModal() {
    var btn = document.getElementById('openPrivacyFooter');
    if (btn) {
      btn.click();
      return;
    }

    var modal = document.getElementById('privacyModal');
    if (modal) {
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function buildToggle(isActive) {
    return (
      '<button type="button" class="cookie-toggle' +
      (isActive ? ' is-active' : '') +
      '" id="cookie-analytics-toggle" role="switch" aria-checked="' +
      (isActive ? 'true' : 'false') +
      '">' +
      '<span class="cookie-toggle-track"><span class="cookie-toggle-thumb"></span></span>' +
      '<span class="cookie-toggle-label">' +
      (isActive ? t.active : t.inactive) +
      '</span>' +
      '</button>'
    );
  }

  function showSettings() {
    closeBanner();
    closeSettings();

    var consent = getConsentState() || { necessary: true, analytics: true };
    var modal = document.createElement('div');

    modal.id = SETTINGS_ID;
    modal.className = 'cookie-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-label', t.ariaSettings);

    modal.innerHTML =
      '<div class="cookie-modal__backdrop" data-cookie-close="true"></div>' +
      '<div class="cookie-modal__panel">' +
        '<button type="button" class="cookie-close cookie-modal__close" id="cookie-settings-close" aria-label="' + t.close + '">&times;</button>' +
        '<div class="cookie-modal__header">' +
          '<p class="cookie-eyebrow">Cookies</p>' +
          '<h2>' + t.settingsTitle + '</h2>' +
          '<p>' + t.settingsText + ' <button type="button" class="cookie-policy-btn" id="cookie-open-policy">' + t.policy + '</button></p>' +
        '</div>' +
        '<div class="cookie-pref-list">' +
          '<section class="cookie-pref-item cookie-pref-item--locked">' +
            '<div class="cookie-pref-copy">' +
              '<h3>' + t.necessaryTitle + '</h3>' +
              '<p>' + t.necessaryDescription + '</p>' +
            '</div>' +
            '<span class="cookie-chip">' + t.alwaysActive + '</span>' +
          '</section>' +
          '<section class="cookie-pref-item">' +
            '<div class="cookie-pref-copy">' +
              '<h3>' + t.analyticsTitle + '</h3>' +
              '<p>' + t.analyticsDescription + '</p>' +
            '</div>' +
            buildToggle(!!consent.analytics) +
          '</section>' +
        '</div>' +
        '<div class="cookie-modal__actions">' +
          '<button type="button" class="cookie-btn cookie-btn-secondary" id="cookie-settings-deny">' + t.necessaryOnly + '</button>' +
          '<button type="button" class="cookie-btn cookie-btn-secondary" id="cookie-settings-accept">' + t.acceptAll + '</button>' +
          '<button type="button" class="cookie-btn cookie-btn-primary" id="cookie-settings-save">' + t.saveSelection + '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    document.body.classList.add('cookie-modal-open');

    requestAnimationFrame(function () {
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('cookie-visible');
    });

    var toggle = document.getElementById('cookie-analytics-toggle');
    var label = toggle.querySelector('.cookie-toggle-label');

    function setToggleState(enabled) {
      toggle.classList.toggle('is-active', enabled);
      toggle.setAttribute('aria-checked', enabled ? 'true' : 'false');
      label.textContent = enabled ? t.active : t.inactive;
    }

    toggle.addEventListener('click', function () {
      setToggleState(toggle.getAttribute('aria-checked') !== 'true');
    });

    document.getElementById('cookie-settings-close').addEventListener('click', function () {
      closeSettings(true);
    });
    document.getElementById('cookie-open-policy').addEventListener('click', openPrivacyModal);
    document.getElementById('cookie-settings-deny').addEventListener('click', function () {
      applyConsent({ analytics: false });
      closeSettings();
    });
    document.getElementById('cookie-settings-accept').addEventListener('click', function () {
      applyConsent({ analytics: true });
      closeSettings();
    });
    document.getElementById('cookie-settings-save').addEventListener('click', function () {
      applyConsent({ analytics: toggle.getAttribute('aria-checked') === 'true' });
      closeSettings();
    });

    modal.addEventListener('click', function (event) {
      if (event.target && event.target.getAttribute('data-cookie-close') === 'true') {
        closeSettings(true);
      }
    });
  }

  function showBanner() {
    if (document.getElementById(BANNER_ID) || getConsentState()) {
      return;
    }

    var banner = document.createElement('div');
    banner.id = BANNER_ID;
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-label', t.ariaBanner);

    banner.innerHTML =
      '<div class="cookie-inner cookie-card">' +
        '<div class="cookie-copy">' +
          '<p class="cookie-eyebrow">Cookies</p>' +
          '<h2 class="cookie-title">' + t.title + '</h2>' +
          '<p class="cookie-text">' + t.text + ' <button type="button" class="cookie-policy-btn" id="cookie-banner-policy">' + t.policy + '</button></p>' +
        '</div>' +
        '<div class="cookie-btns">' +
          '<button id="cookie-banner-customize" class="cookie-btn cookie-btn-ghost" type="button">' + t.customize + '</button>' +
          '<button id="cookie-banner-accept" class="cookie-btn cookie-btn-primary" type="button">' + t.acceptAll + '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('cookie-visible');
      });
    });

    document.getElementById('cookie-banner-policy').addEventListener('click', openPrivacyModal);
    document.getElementById('cookie-banner-customize').addEventListener('click', showSettings);
    document.getElementById('cookie-banner-accept').addEventListener('click', function () {
      applyConsent({ analytics: true });
      closeBanner();
    });
  }

  window.openCookieSettings = function () {
    showSettings();
  };

  var stored = getConsentState();
  if (stored) {
    updateGtag(!!stored.analytics);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.setTimeout(showBanner, 500);
    });
  } else {
    window.setTimeout(showBanner, 500);
  }
}());
