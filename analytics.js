/**
 * Centralized Google Analytics + Consent Mode bootstrap.
 * Keeps analytics opt-in while making the setup consistent across pages.
 */
(function () {
  'use strict';

  var GA_ID = 'G-SPLY0P4ZJE';
  var STORAGE_KEY = 'twin_cookie_consent';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  function getStoredConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function getAnalyticsConsent() {
    var stored = getStoredConsent();

    if (stored === 'granted') {
      return true;
    }

    if (stored === 'denied') {
      return false;
    }

    if (!stored) {
      return false;
    }

    try {
      var parsed = JSON.parse(stored);
      return !!(parsed && parsed.analytics);
    } catch (error) {
      return false;
    }
  }

  function applyConsent(state) {
    var granted = state === 'granted';

    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  }

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 1500
  });

  if (getAnalyticsConsent()) {
    applyConsent('granted');
  }

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
}());
