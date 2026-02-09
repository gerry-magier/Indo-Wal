/**
 * Language Switcher Script
 * Automatisches Wechseln zwischen EN und DE Versionen der Website
 */

(function() {
  'use strict';

  // Mapping der Seiten (EN -> DE und umgekehrt)
  const pageMap = {
    // Englisch zu Deutsch
    '/index.html': '/de/index.html',
    '/timor-leste-blue-whale.html': '/de/timor-leste-blue-whale.html',
    '/papua.html': '/de/papua.html',
    '/blog/index.html': '/de/blog/index.html',
    '/faq.html': '/de/faq.html',
    '/contact.html': '/de/contact.html',
    
    // Deutsch zu Englisch
    '/de/index.html': '/index.html',
    '/de/': '/index.html',
    '/de/timor-leste-blue-whale.html': '/timor-leste-blue-whale.html',
    '/de/papua.html': '/papua.html',
    '/de/blog/index.html': '/blog/index.html',
    '/de/faq.html': '/faq.html',
    '/de/contact.html': '/contact.html'
  };

  /**
   * Erkennt, ob wir auf der deutschen Version sind
   */
  function isGermanVersion() {
    return window.location.pathname.startsWith('/de/');
  }

  /**
   * Gibt die URL der anderen Sprachversion zurück
   */
  function getAlternateLanguageUrl() {
    let currentPath = window.location.pathname;
    
    // Falls wir auf der Root sind
    if (currentPath === '/' || currentPath === '') {
      return isGermanVersion() ? '/index.html' : '/de/index.html';
    }
    
    // Suche nach gemappter Seite
    if (pageMap[currentPath]) {
      return pageMap[currentPath];
    }
    
    // Fallback: Einfach /de/ hinzufügen oder entfernen
    if (isGermanVersion()) {
      // Von DE zu EN: entferne /de/
      return currentPath.replace('/de/', '/');
    } else {
      // Von EN zu DE: füge /de/ hinzu
      return '/de' + currentPath;
    }
  }

  /**
   * Initialisiert die Sprachumschalter
   */
  function initLanguageSwitchers() {
    const desktopSwitcher = document.getElementById('langSwitcher');
    const mobileSwitcher = document.getElementById('langSwitcherMobile');
    
    const alternateUrl = getAlternateLanguageUrl();
    
    // Setze href für beide Switcher
    if (desktopSwitcher) {
      desktopSwitcher.href = alternateUrl;
    }
    
    if (mobileSwitcher) {
      mobileSwitcher.href = alternateUrl;
    }
  }

  // Initialisiere beim Laden der Seite
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitchers);
  } else {
    initLanguageSwitchers();
  }

})();