/**
 * Language Switcher Script - Clean Version (ohne Flaggen)
 * Nur Text: DE / EN
 */

(function() {
  'use strict';

  // Warte bis die Navbar geladen ist
  function waitForNavbar(callback) {
    const checkNavbar = setInterval(function() {
      const desktopSwitcher = document.getElementById('langSwitcher');
      const mobileSwitcher = document.getElementById('langSwitcherMobile');
      
      if (desktopSwitcher || mobileSwitcher) {
        clearInterval(checkNavbar);
        callback();
      }
    }, 100);
    
    setTimeout(function() {
      clearInterval(checkNavbar);
    }, 5000);
  }

  // Mapping der Seiten (EN -> DE und umgekehrt)
  const pageMap = {
    // Root / Index
    'index.html': 'de/index.html',
    'de/index.html': 'index.html',
    '/': 'de/',
    '/de/': '/',
    '': 'de/',
    
    // Hauptseiten
    'timor-leste-blue-whale.html': 'de/timor-leste-blue-whale.html',
    'de/timor-leste-blue-whale.html': 'timor-leste-blue-whale.html',
    
    'papua.html': 'de/papua.html',
    'de/papua.html': 'papua.html',

    'flores.html': 'de/flores.html',
    'de/flores.html': 'flores.html',
    
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
    return path.includes('/de/');
  }

  /**
   * Normalisiert den Pfad
   */
  function normalizePath() {
    let path = window.location.pathname;
    
    path = path.replace(/^\/+/, '');
    
    if (path === '' || path === '/') {
      path = 'index.html';
    }
    
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
    
    console.log('🌍 Current path:', currentPath);
    console.log('🌍 Is German?', isGermanVersion());
    
    if (pageMap[currentPath]) {
      console.log('✅ Found in pageMap:', pageMap[currentPath]);
      return '/' + pageMap[currentPath];
    }
    
    if (isGermanVersion()) {
      const enPath = currentPath.replace(/^de\//, '');
      console.log('✅ Fallback DE->EN:', enPath);
      return '/' + enPath;
    } else {
      const dePath = 'de/' + currentPath;
      console.log('✅ Fallback EN->DE:', dePath);
      return '/' + dePath;
    }
  }

  /**
   * Wechselt zur anderen Sprache
   */
  function switchLanguage(event) {
    event.preventDefault();
    
    const alternateUrl = getAlternateLanguageUrl();
    console.log('🚀 Switching to:', alternateUrl);
    
    window.location.href = alternateUrl;
  }

  /**
   * Aktualisiert die Switcher Buttons (ohne Flaggen!)
   */
  function updateSwitcherButtons() {
    const desktopSwitcher = document.getElementById('langSwitcher');
    const mobileSwitcher = document.getElementById('langSwitcherMobile');
    
    const alternateUrl = getAlternateLanguageUrl();
    const isDE = isGermanVersion();
    
    console.log('🔄 Updating switchers...');
    console.log('📍 Target URL:', alternateUrl);
    
    // Desktop Switcher
    if (desktopSwitcher) {
      desktopSwitcher.href = alternateUrl;
      desktopSwitcher.onclick = switchLanguage;
      
      const text = desktopSwitcher.querySelector('.lang-text');
      
      if (isDE) {
        // Auf DE → zeige EN
        if (text) text.textContent = 'EN';
        desktopSwitcher.setAttribute('aria-label', 'Switch to English');
      } else {
        // Auf EN → zeige DE
        if (text) text.textContent = 'DE';
        desktopSwitcher.setAttribute('aria-label', 'Switch to German');
      }
      
      console.log('✅ Desktop switcher updated');
    }
    
    // Mobile Switcher
    if (mobileSwitcher) {
      mobileSwitcher.href = alternateUrl;
      mobileSwitcher.onclick = switchLanguage;
      
      if (isDE) {
        mobileSwitcher.textContent = 'English';
      } else {
        mobileSwitcher.textContent = 'Deutsch';
      }
      
      console.log('✅ Mobile switcher updated');
    }
  }

  /**
   * Initialisiert die Sprachumschalter
   */
  function initLanguageSwitchers() {
    console.log('🚀 Initializing language switchers...');
    
    waitForNavbar(function() {
      updateSwitcherButtons();
      console.log('✅ Language switchers ready!');
    });
  }

  // Initialisiere beim Laden der Seite
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitchers);
  } else {
    initLanguageSwitchers();
  }

})();
