/**
 * Language Switcher Script - Verbesserte Version
 * Funktioniert auch auf localhost!
 */

(function() {
  'use strict';

  // Mapping der Seiten (EN -> DE und umgekehrt)
  const pageMap = {
    // Root / Index
    'index.html': 'de/index.html',
    'de/index.html': 'index.html',
    '/': 'de/',
    '/de/': '/',
    
    // Hauptseiten
    'timor-leste-blue-whale.html': 'de/timor-leste-blue-whale.html',
    'de/timor-leste-blue-whale.html': 'timor-leste-blue-whale.html',
    
    'papua.html': 'de/papua.html',
    'de/papua.html': 'papua.html',
    
    'faq.html': 'de/faq.html',
    'de/faq.html': 'faq.html',
    
    'contact.html': 'de/contact.html',
    'de/contact.html': 'contact.html',
    
    // Blog
    'blog/index.html': 'de/blog/index.html',
    'de/blog/index.html': 'blog/index.html'
  };

  /**
   * Erkennt, ob wir auf der deutschen Version sind
   */
  function isGermanVersion() {
    const path = window.location.pathname;
    const fullPath = window.location.href;
    
    // Prüfe ob /de/ im Pfad vorkommt
    return path.includes('/de/') || fullPath.includes('/de/');
  }

  /**
   * Normalisiert den Pfad (entfernt führenden Slash und localhost-Teile)
   */
  function normalizePath() {
    let path = window.location.pathname;
    
    // Entferne führenden Slash
    if (path.startsWith('/')) {
      path = path.substring(1);
    }
    
    // Falls leer (root), setze index.html
    if (path === '' || path === '/') {
      path = 'index.html';
    }
    
    // Falls path mit de/ startet und endet mit /, füge index.html hinzu
    if (path === 'de' || path === 'de/') {
      path = 'de/index.html';
    }
    
    return path;
  }

  /**
   * Gibt die URL der anderen Sprachversion zurück
   */
  function getAlternateLanguageUrl() {
    const currentPath = normalizePath();
    
    console.log('Current normalized path:', currentPath);
    
    // Direktes Mapping suchen
    if (pageMap[currentPath]) {
      console.log('Found in pageMap:', pageMap[currentPath]);
      return pageMap[currentPath];
    }
    
    // Fallback: Einfach /de/ hinzufügen oder entfernen
    if (isGermanVersion()) {
      // Von DE zu EN: entferne de/
      const enPath = currentPath.replace(/^de\//, '');
      console.log('Fallback DE->EN:', enPath);
      return enPath;
    } else {
      // Von EN zu DE: füge de/ hinzu
      const dePath = 'de/' + currentPath;
      console.log('Fallback EN->DE:', dePath);
      return dePath;
    }
  }

  /**
   * Wechselt zur anderen Sprache
   */
  function switchLanguage(event) {
    event.preventDefault();
    
    const alternateUrl = getAlternateLanguageUrl();
    
    // Für localhost: Relativer Pfad
    // Für Production: Auch relativer Pfad funktioniert
    window.location.href = alternateUrl;
  }

  /**
   * Initialisiert die Sprachumschalter
   */
  function initLanguageSwitchers() {
    const desktopSwitcher = document.getElementById('langSwitcher');
    const mobileSwitcher = document.getElementById('langSwitcherMobile');
    
    const alternateUrl = getAlternateLanguageUrl();
    
    console.log('Initializing switchers with URL:', alternateUrl);
    console.log('Is German version:', isGermanVersion());
    
    // Event Listener für beide Switcher
    if (desktopSwitcher) {
      desktopSwitcher.href = alternateUrl;
      desktopSwitcher.addEventListener('click', switchLanguage);
    }
    
    if (mobileSwitcher) {
      mobileSwitcher.href = alternateUrl;
      mobileSwitcher.addEventListener('click', switchLanguage);
    }
  }

  // Initialisiere beim Laden der Seite
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitchers);
  } else {
    initLanguageSwitchers();
  }

})();