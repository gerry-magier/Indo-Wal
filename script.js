(() => {
  const onReady = (fn) => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  };

  onReady(() => {
    const $ = (s, el = document) => el.querySelector(s);
    const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
    // ============================================================
  // PARTIALS: NAVBAR + FOOTER (root-relative, works everywhere)
  // ============================================================
  async function loadPartial(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return;

    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
      el.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
    }
  }

  // load them
  loadPartial("#navbar-placeholder", "/navbar.html");
  loadPartial("#footer-placeholder", "/footer.html");

  // ============================================================
  // FOOTER MODALS (AGB / Impressum / Privacy) – event delegation
  // works even if footer is injected after DOMContentLoaded
  // ============================================================
  document.addEventListener("click", (e) => {
    const openAgb = e.target.closest("#openAgbFooter, #openAgbInline");
    const openImpressum = e.target.closest("#openImpressumFooter, #openImpressumInline");
    const openPrivacy = e.target.closest("#openPrivacyFooter, #openPrivacyInline");

    const closeAgb = e.target.closest("#closeAgb");
    const closeImpressum = e.target.closest("#closeImpressum");
    const closePrivacy = e.target.closest("#closePrivacy");

    const agbModal = document.querySelector("#agbModal");
    const impressumModal = document.querySelector("#impressumModal");
    const privacyModal = document.querySelector("#privacyModal");

    // OPEN
    if (openAgb && agbModal) {
      e.preventDefault();
      document.body.classList.add("agb-open");
      agbModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      return;
    }
    if (openImpressum && impressumModal) {
      e.preventDefault();
      document.body.classList.add("impressum-open");
      impressumModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      return;
    }
    if (openPrivacy && privacyModal) {
      e.preventDefault();
      document.body.classList.add("privacy-open");
      privacyModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      return;
    }

    // CLOSE
    if (closeAgb && agbModal) {
      e.preventDefault();
      document.body.classList.remove("agb-open");
      agbModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      return;
    }
    if (closeImpressum && impressumModal) {
      e.preventDefault();
      document.body.classList.remove("impressum-open");
      impressumModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      return;
    }
    if (closePrivacy && privacyModal) {
      e.preventDefault();
      document.body.classList.remove("privacy-open");
      privacyModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      return;
    }
  });


    // ============================================================
    // WEB3FORMS CONFIGURATION
    // ============================================================
    // Get your free access key from: https://web3forms.com
    const WEB3FORMS_ACCESS_KEY = "3831585c-b896-4509-8b56-d697171762c8";

    // ===== Smooth scroll
    function closeMobileMenu() {
      const mobile = $('#mobileMenu');
      const burger = $('#burger');
      if (!mobile || !burger) return;
      mobile.hidden = true;
      burger.classList.remove('open');

      if (!document.body.classList.contains('booking-open') &&
          !document.body.classList.contains('privacy-open') &&
          !document.body.classList.contains('terms-open') &&
          !document.body.classList.contains('lightbox-open')) {
        document.body.style.overflow = '';
      }
    }

    function bindSmoothScroll() {
      $$('[data-scroll]').forEach((a) => {
        a.addEventListener('click', (e) => {
          const href = a.getAttribute('href');
          if (!href || !href.startsWith('#')) return;
          const target = document.querySelector(href);
          if (!target) return;
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          closeMobileMenu();
        });
      });
    }

    function bindActiveNav() {
      const links = $$('.nav a[data-scroll]');
      const sections = links.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
      if (!sections.length) return;

      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = '#' + entry.target.id;
          links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === id));
        }
      }, { threshold: 0.35 });

      sections.forEach((s) => io.observe(s));
    }

    // ===== Mobile menu
    function bindMobileMenu() {
      const burger = $('#burger');
      const mobile = $('#mobileMenu');
      if (!burger || !mobile) return;

      burger.addEventListener('click', () => {
        const open = mobile.hidden;
        mobile.hidden = !open;
        burger.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
      });
    }

    // ===== Reveal
    function bindReveal() {
      const items = $$('.reveal');
      if (!items.length) return;

      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) if (entry.isIntersecting) entry.target.classList.add('in');
      }, { threshold: 0.16 });

      items.forEach((it) => io.observe(it));
    }

    // ===== Back to top
    function bindToTop() {
      const toTop = $('#toTop');
      if (!toTop) return;

      window.addEventListener('scroll', () => {
        toTop.classList.toggle('show', window.scrollY > 600);
      });

      toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // ===== Toast
    const toast = $('#toast');
    let toastTimer = null;
    function showToast(msg, ms = 2800) {
      if (!toast) return;
      toast.hidden = false;
      toast.textContent = msg;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.hidden = true;
        toast.textContent = '';
      }, ms);
    }

    // ===== Privacy date
    const privacyDate = $('#privacyDate');
    if (privacyDate) {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      privacyDate.textContent = `${yyyy}-${mm}-${dd}`;
    }

    // ============================================================
    // LIGHTBOX
    // ============================================================
    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightboxImg');
    const lightboxCap = $('#lightboxCap');
    const lightboxClose = $('#lightboxClose');

    let lbScrollY = 0;
    let lbPrev = { overflow:'', position:'', top:'', width:'', touchAction:'' };

    function lockScrollLightbox() {
      lbScrollY = window.scrollY || 0;
      lbPrev.overflow = document.body.style.overflow;
      lbPrev.position = document.body.style.position;
      lbPrev.top = document.body.style.top;
      lbPrev.width = document.body.style.width;
      lbPrev.touchAction = document.body.style.touchAction;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${lbScrollY}px`;
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none';
    }

    function unlockScrollLightbox() {
      document.body.style.overflow = lbPrev.overflow || '';
      document.body.style.position = lbPrev.position || '';
      document.body.style.top = lbPrev.top || '';
      document.body.style.width = lbPrev.width || '';
      document.body.style.touchAction = lbPrev.touchAction || '';
      window.scrollTo(0, lbScrollY);
    }

    function openLightbox(imgEl) {
      if (!lightbox || !lightboxImg) return;
      const src = imgEl.getAttribute('src');
      if (!src) return;

      const fig = imgEl.closest('figure');
      const cap = fig ? fig.querySelector('figcaption') : null;

      lightboxImg.src = src;
      lightboxImg.alt = imgEl.alt || '';
      if (lightboxCap) lightboxCap.textContent = cap ? cap.textContent.trim() : '';

      document.body.classList.add('lightbox-open');
      lightbox.setAttribute('aria-hidden', 'false');
      lockScrollLightbox();
      try { lightboxClose?.focus({ preventScroll: true }); } catch(_) {}
    }

    function closeLightbox() {
      if (!lightbox) return;
      document.body.classList.remove('lightbox-open');
      lightbox.setAttribute('aria-hidden', 'true');
      if (lightboxImg) lightboxImg.src = '';
      unlockScrollLightbox();
    }

    function bindLightbox() {
      $$('img[data-lightbox]').forEach((img) => {
        img.addEventListener('click', () => openLightbox(img));
      });

      lightboxClose?.addEventListener('click', closeLightbox);
      lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('lightbox-open')) closeLightbox();
      });
    }

    // ============================================================
    // REQUEST MODAL (Contact vs Request expedition)
    // ============================================================
    const bookingView = $('#bookingView');
    const closeBtn = $('#closeBooking');

    const tabContact = $('#tabContact');
    const tabBooking = $('#tabBooking');

    const requestTitle = $('#requestTitle');
    const requestSubtitle = $('#requestSubtitle');
    const requestType = $('#requestType');

    const passportWrap = $('#passportWrap');
    const agbWrap = $('#agbWrap');
    const acceptAgb = $('#acceptAgb');

    const startHint = $('#startHint');
    const endHint = $('#endHint');
    const tourStart = $('#tourStart');
    const tourEnd = $('#tourEnd');
    const submitBtn = $('#submitBtn');
    const submitHint = $('#submitHint');

    // Modal scroll lock (prevents scrolling behind)
    let lockedScrollY = 0;
    let prevBody = { overflow:'', position:'', top:'', width:'', touchAction:'' };

    function lockPageScroll() {
      lockedScrollY = window.scrollY || window.pageYOffset || 0;

      prevBody.overflow = document.body.style.overflow;
      prevBody.position = document.body.style.position;
      prevBody.top = document.body.style.top;
      prevBody.width = document.body.style.width;
      prevBody.touchAction = document.body.style.touchAction;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none';
    }

    function unlockPageScroll() {
      document.body.style.overflow = prevBody.overflow || '';
      document.body.style.position = prevBody.position || '';
      document.body.style.top = prevBody.top || '';
      document.body.style.width = prevBody.width || '';
      document.body.style.touchAction = prevBody.touchAction || '';
      window.scrollTo(0, lockedScrollY);
    }

    function setTabActive(mode) {
      if (!tabContact || !tabBooking) return;
      const isContact = mode === 'contact';
      tabContact.classList.toggle('active', isContact);
      tabBooking.classList.toggle('active', !isContact);
      tabContact.setAttribute('aria-selected', String(isContact));
      tabBooking.setAttribute('aria-selected', String(!isContact));
    }

    function setMode(mode) {
      if (!requestType) return;
      const isContact = mode === 'contact';
      requestType.value = mode;
      setTabActive(mode);

      if (requestTitle) requestTitle.textContent = isContact ? 'Ask a question' : 'Request expedition';
      if (requestSubtitle) {
        requestSubtitle.textContent = isContact
          ? 'Ask anything — we’ll reply with clear answers and whether it’s a good fit.'
          : 'Send a non-binding request — we’ll reply with availability + a fit-check. Contract only after we send an offer and you accept it (payment within 5 business days).';
      }
      if (submitBtn) submitBtn.textContent = isContact ? 'Send' : 'Send request';
      if (submitHint) {
        submitHint.textContent = isContact
          ? 'Questions don’t require passport details. Share expectations and concerns — we’ll be honest.'
          : 'Passport details are optional now. We’ll collect what’s needed later via a secure channel if required. After contract confirmation, payment is due within 5 business days.';
      }

      if (passportWrap) passportWrap.hidden = isContact;
      if (agbWrap) agbWrap.hidden = isContact;

      if (startHint) startHint.textContent = isContact ? '(optional for questions)' : '(required for requests)';
      if (endHint) endHint.textContent = isContact ? '(optional for questions)' : '(required for requests)';

      if (acceptAgb) {
        acceptAgb.required = !isContact;
        if (isContact) acceptAgb.checked = false;
      }
    }

    function openModal(mode = 'contact') {
      if (!bookingView) {
        showToast('Booking module missing in HTML (bookingView not found).');
        return;
      }
      closeMobileMenu();

      document.body.classList.add('booking-open');
      bookingView.setAttribute('aria-hidden', 'false');

      lockPageScroll();
      setMode(mode);

      const first = $('#firstName', bookingView) || bookingView;
      try { first.focus({ preventScroll: true }); } catch(_) {}
    }

    function closeModal() {
      if (!bookingView) return;
      document.body.classList.remove('booking-open');
      bookingView.setAttribute('aria-hidden', 'true');
      unlockPageScroll();
    }

    function bindModal() {
      // Use event delegation for dynamically loaded navbar buttons
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-open-request]');
        if (btn) {
          e.preventDefault();
          openModal(btn.dataset.mode || 'contact');
        }
      });

      if (closeBtn) closeBtn.addEventListener('click', closeModal);

      // Close modal when clicking outside the panel
      if (bookingView) {
        bookingView.addEventListener('click', (e) => {
          if (e.target === bookingView) closeModal();
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('booking-open')) closeModal();
      });

      if (tabContact) tabContact.addEventListener('click', () => setMode('contact'));
      if (tabBooking) tabBooking.addEventListener('click', () => setMode('booking'));
    }

    // ===== FAQ accordion
    function bindFaq() {
      $$('.faq-q').forEach((btn) => {
        btn.addEventListener('click', () => {
          const expanded = btn.getAttribute('aria-expanded') === 'true';
          const answer = btn.nextElementSibling;
          const ic = btn.querySelector('.faq-ic');
          btn.setAttribute('aria-expanded', String(!expanded));
          if (answer) answer.hidden = expanded;
          if (ic) ic.textContent = expanded ? '+' : '−';
        });
      });
    }

    // ============================================================
    // CALENDAR + AVAILABILITY (Oct/Nov only, jump years)
    // ============================================================
    const SEASON_MONTHS = [9, 10]; // Oct=9, Nov=10
    const MIN_YEAR = 2026;
    const MAX_YEAR = 2029;
    const MAX_DAYS = 5;

    // Fixed pricing per day (total, not per person)
    const PRICE_PER_DAY = {
      1: 3000,
      2: 3200,
      3: 3400,
      4: 3600,
      5: 3800
    };

    // ---- Google Sheet availability (CSV)
    // Paste your published CSV URL here:
    const AVAILABILITY_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSnt-PosUrWCjXTaoxy0nq9-phcCmBkonDjtQ3kF9VRaexQ5QCxaDnk3H85-Sg3ZIlTm3H7NFI6s-bQ/pub?gid=0&single=true&output=csv";

    const blockedDays = new Set();
    const state = { year: 2026, month: 9, start: null, end: null, persons: 1 };

    function dateToISO(d) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }

    function parseISO(s) {
      const [y, m, d] = s.split('-').map(Number);
      return new Date(y, m - 1, d);
    }

    function sameDay(a, b) {
      return a && b &&
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
    }

    function daysBetweenInclusive(a, b) {
      const start = new Date(a.getFullYear(), a.getMonth(), a.getDate());
      const end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
      return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }

    function formatNice(d) {
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function monthName(y, m) {
      const d = new Date(y, m, 1);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
    }

    function nextSeasonMonth(y, m) {
      if (m === 9) return { y, m: 10 };
      if (m === 10) return { y: y + 1, m: 9 };
      return { y, m: 9 };
    }
    function prevSeasonMonth(y, m) {
      if (m === 10) return { y, m: 9 };
      if (m === 9) return { y: y - 1, m: 10 };
      return { y, m: 9 };
    }

    function isOutsideAllowedYear(y) {
      return y < MIN_YEAR || y > MAX_YEAR;
    }

    function isBlockedDate(d) {
      return blockedDays.has(dateToISO(d));
    }

    function selectionContainsBlockedDays(start, end) {
      if (!start || !end) return false;
      const a = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const b = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      for (let t = new Date(a); t <= b; t.setDate(t.getDate() + 1)) {
        if (blockedDays.has(dateToISO(t))) return true;
      }
      return false;
    }

    function renderCalendar(prefix) {
      const cal = $(`#${prefix}Calendar`);
      const title = $(`#${prefix}MonthName`);
      if (!cal || !title) return;

      title.textContent = monthName(state.year, state.month);
      cal.innerHTML = '';

      const first = new Date(state.year, state.month, 1);
      const last = new Date(state.year, state.month + 1, 0);
      const startWeekDay = (first.getDay() + 6) % 7; // Monday=0
      const daysInMonth = last.getDate();

      for (let i = 0; i < startWeekDay; i++) {
        const div = document.createElement('div');
        div.className = 'cell blank';
        cal.appendChild(div);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(state.year, state.month, day);

        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'cell';
        cell.textContent = String(day);

        if (isOutsideAllowedYear(state.year)) {
          cell.disabled = true;
          cell.classList.add('blocked');
          cal.appendChild(cell);
          continue;
        }

        if (isBlockedDate(d)) {
          cell.disabled = true;
          cell.classList.add('blocked');
          cell.title = 'Fully booked';
        }

        const isSelected =
          (state.start && sameDay(d, state.start)) ||
          (state.end && sameDay(d, state.end)) ||
          (state.start && state.end &&
            d >= new Date(state.start.getFullYear(), state.start.getMonth(), state.start.getDate()) &&
            d <= new Date(state.end.getFullYear(), state.end.getMonth(), state.end.getDate()));

        if (isSelected) cell.classList.add('selected');

        cell.addEventListener('click', () => {
          if (cell.disabled) return;

          if (!state.start || (state.start && state.end)) {
            state.start = d;
            state.end = null;
          } else {
            if (d < state.start) { state.end = state.start; state.start = d; }
            else { state.end = d; }

            const n = daysBetweenInclusive(state.start, state.end);
            if (n > MAX_DAYS) {
              showToast(`Max ${MAX_DAYS} days. Please choose a shorter range.`);
              state.end = null;
            } else if (selectionContainsBlockedDays(state.start, state.end)) {
              showToast('Your selected range contains fully booked day(s). Please pick different dates.');
              state.end = null;
            }
          }

          syncFormDates();
          updateMeta('main');
          updateMeta('booking');
          renderAllCalendars();
        });

        cal.appendChild(cell);
      }
    }

    function renderAllCalendars() {
      renderCalendar('main');
      renderCalendar('booking');
    }

    function updateSummary(meta) {
      const sDates = $('#summaryDates');
      const sGuests = $('#summaryGuests');
      const sPrice = $('#summaryPrice');

      if (sGuests) sGuests.textContent = `Guests: ${state.persons}`;

      if (!meta || !state.start || !state.end) {
        if (sDates) sDates.textContent = state.start ? `Dates: ${formatNice(state.start)} (end optional)` : 'Dates: (optional)';
        if (sPrice) sPrice.textContent = 'Price: –';
        return;
      }

      if (sDates) sDates.textContent = `Dates: ${formatNice(state.start)} → ${formatNice(state.end)} (${meta.nDays} day${meta.nDays > 1 ? 's' : ''})`;
      if (sPrice) sPrice.textContent = `Total price: €${meta.all.toLocaleString()} fixed`;
    }

    function updateMeta(prefix) {
      const selected = $(`#${prefix}SelectedDays`);
      const price = $(`#${prefix}Price`);
      const total = $(`#${prefix}TotalPrice`);
      if (!selected || !price || !total) return;

      if (!state.start) {
        selected.textContent = 'Select a start date (Oct/Nov only).';
        price.textContent = 'Price: €0';
        total.textContent = '';
        updateSummary(null);
        return;
      }

      if (state.start && !state.end) {
        selected.textContent = `Selected: ${formatNice(state.start)} (choose end date, max ${MAX_DAYS} days)`;
        price.textContent = 'Price: €0';
        total.textContent = '';
        updateSummary(null);
        return;
      }

      const nDays = daysBetweenInclusive(state.start, state.end);
      const totalPrice = PRICE_PER_DAY[nDays] || 0;
      const perPerson = state.persons > 0 ? Math.round(totalPrice / state.persons) : 0;

      selected.textContent = `Selected: ${formatNice(state.start)} → ${formatNice(state.end)} (${nDays} day${nDays > 1 ? 's' : ''})`;
      price.textContent = `Total price: €${totalPrice.toLocaleString()} (€${perPerson.toLocaleString()}/person)`;
      total.textContent = `Note: Fixed total price regardless of group size`;

      updateSummary({ nDays, all: totalPrice });
    }

    function bindCalendarNav(prefix) {
      const prev = $(`#${prefix}PrevMonth`);
      const next = $(`#${prefix}NextMonth`);

      if (prev) prev.addEventListener('click', () => {
        const nm = prevSeasonMonth(state.year, state.month);
        state.year = nm.y;
        state.month = nm.m;
        if (state.year < MIN_YEAR) { state.year = MIN_YEAR; state.month = 9; }
        renderAllCalendars();
        updateMeta('main'); updateMeta('booking');
      });

      if (next) next.addEventListener('click', () => {
        const nm = nextSeasonMonth(state.year, state.month);
        state.year = nm.y;
        state.month = nm.m;
        if (state.year > MAX_YEAR) { state.year = MAX_YEAR; state.month = 10; }
        renderAllCalendars();
        updateMeta('main'); updateMeta('booking');
      });
    }

    function bindPersons() {
      const mainSel = $('#mainPersons');
      const bookingSel = $('#bookingPersons');
      const formSel = $('#tourPersons');

      function setPersons(n) {
        state.persons = Number(n) || 1;
        if (mainSel) mainSel.value = String(state.persons);
        if (bookingSel) bookingSel.value = String(state.persons);
        if (formSel) formSel.value = String(state.persons);
        updateMeta('main'); updateMeta('booking');
        buildAdditionalGuests();
      }

      [mainSel, bookingSel, formSel].filter(Boolean).forEach((sel) => {
        sel.addEventListener('change', () => setPersons(sel.value));
      });

      setPersons(1);
    }

    function syncFormDates() {
      if (!tourStart || !tourEnd) return;
      if (state.start) tourStart.value = dateToISO(state.start);
      if (state.end) tourEnd.value = dateToISO(state.end);
      if (state.start && !state.end) tourEnd.value = '';
    }

    function bindDateInputs() {
      if (!tourStart || !tourEnd) return;

      tourStart.addEventListener('change', () => {
        if (!tourStart.value) return;
        state.start = parseISO(tourStart.value);
        state.end = null;
        renderAllCalendars();
        updateMeta('main'); updateMeta('booking');
      });

      tourEnd.addEventListener('change', () => {
        if (!tourEnd.value) return;
        if (!state.start) { state.start = parseISO(tourEnd.value); state.end = null; return; }

        const e = parseISO(tourEnd.value);
        if (e < state.start) { state.end = state.start; state.start = e; }
        else { state.end = e; }

        const n = daysBetweenInclusive(state.start, state.end);
        if (n > MAX_DAYS) {
          showToast(`Max ${MAX_DAYS} days. Please choose a shorter range.`);
          state.end = null;
          tourEnd.value = '';
        } else if (selectionContainsBlockedDays(state.start, state.end)) {
          showToast('Your selected range contains fully booked day(s). Please pick different dates.');
          state.end = null;
          tourEnd.value = '';
        }

        renderAllCalendars();
        updateMeta('main'); updateMeta('booking');
      });
    }

    // Extra guests
    const additionalGuests = $('#additionalGuests');
    function buildAdditionalGuests() {
      if (!additionalGuests) return;
      additionalGuests.innerHTML = '';

      const extra = Math.max(0, state.persons - 1);
      for (let i = 0; i < extra; i++) {
        const idx = i + 2;
        const wrap = document.createElement('div');
        wrap.className = 'guest';

        const head = document.createElement('button');
        head.type = 'button';
        head.className = 'guest-head';
        head.innerHTML = `<span>Guest ${idx} details (optional)</span><span>+</span>`;

        const body = document.createElement('div');
        body.className = 'guest-body';
        body.hidden = true;

        body.innerHTML = `
          <div class="form-grid" style="margin-top:.8rem;">
            <div>
              <label for="g${idx}First">First name</label>
              <input id="g${idx}First" name="g${idx}First" type="text" />
            </div>
            <div>
              <label for="g${idx}Last">Last name</label>
              <input id="g${idx}Last" name="g${idx}Last" type="text" />
            </div>
          </div>
        `;

        head.addEventListener('click', () => {
          const open = !body.hidden;
          body.hidden = open;
          head.querySelector('span:last-child').textContent = open ? '+' : '−';
        });

        wrap.appendChild(head);
        wrap.appendChild(body);
        additionalGuests.appendChild(wrap);
      }
    }

    // ============================================================
    // Availability CSV (Google Sheet)
    // ============================================================
    const availabilityNote = $('#availabilityNote');
    const availabilityNoteField = $('#availabilityNoteField');

        function parseCsv(text) {
      // Robust CSV parser for Google Sheets "Publish to web".
      // Handles:
      // - leading empty columns (e.g. ",,,,dates,status")
      // - empty lines (e.g. ",,,,,")
      // - headers: date,status OR dates,status
      // - delimiters: comma, semicolon, or tab
      // - missing status (defaults to "booked")

      const lines = text
        .replace(/^\uFEFF/, '') // remove BOM
        .split(/\r?\n/)
        // keep left-side commas (so don't full-trim), only trim end whitespace
        .map(l => (l ?? '').replace(/\s+$/g, ''))
        // drop lines that are effectively empty (only delimiters/whitespace)
        .filter(l => l && l.replace(/[;,\t,]/g, '').trim() !== '');

      if (!lines.length) return [];

      // Find the real header line (sometimes it's not the first line)
      const headerIndex = lines.findIndex(l => {
        const low = l.toLowerCase();
        return low.includes('date') || low.includes('dates');
      });
      if (headerIndex === -1) return [];

      const headerLine = lines[headerIndex];

      // Detect delimiter
      const delim =
        headerLine.includes('\t') ? '\t' :
        (headerLine.includes(';') && !headerLine.includes(',')) ? ';' :
        ',';

      const split = (line) =>
        line.split(delim).map(s => (s ?? '').trim().replace(/^"|"$/g, ''));

      const header = split(headerLine).map(h => h.toLowerCase());

      const dateIdx = header.includes('date') ? header.indexOf('date') : header.indexOf('dates');
      const statusIdx = header.indexOf('status'); // can be -1

      const out = [];
      for (let i = headerIndex + 1; i < lines.length; i++) {
        const cols = split(lines[i]);

        const date = (cols[dateIdx] || '').trim();
        // accept ISO date only
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;

        const status = statusIdx >= 0
          ? (((cols[statusIdx] || '').trim().toLowerCase()) || 'booked')
          : 'booked';

        out.push({ date, status });
      }

      return out;
    }

    async function loadAvailability() {
      if (!AVAILABILITY_CSV_URL) {
        if (availabilityNote) availabilityNote.textContent = 'Availability feed: not connected yet (paste Google Sheet CSV URL in script.js).';
        if (availabilityNoteField) availabilityNoteField.value = 'Availability feed not connected.';
        return;
      }

      try {
        const res = await fetch(AVAILABILITY_CSV_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const rows = parseCsv(text);

        blockedDays.clear();
        for (const r of rows) {
          if (r.status === 'booked') blockedDays.add(r.date);
        }

        renderAllCalendars();
        if (availabilityNote) availabilityNote.textContent = blockedDays.size ? `Fully booked dates are blocked automatically (${blockedDays.size} day(s)).` : 'No booked dates loaded (or none marked as booked).';
        if (availabilityNoteField) availabilityNoteField.value = blockedDays.size ? `Blocked booked days: ${blockedDays.size}` : 'No blocked days.';
      } catch (e) {
        console.error(e);
        if (availabilityNote) availabilityNote.textContent = 'Availability feed failed to load (calendar still works).';
        if (availabilityNoteField) availabilityNoteField.value = 'Availability feed failed.';
      }
    }

    // ============================================================
    // Netlify form submission (fix the “error” feeling)
    // ============================================================
    const requestForm = $('#requestForm');

    function encodeFormData(form) {
      const fd = new FormData(form);
      const params = new URLSearchParams();
      for (const [k, v] of fd.entries()) params.append(k, v);
      return params.toString();
    }

    function isLikelyNetlifyRuntime() {
      const host = window.location.hostname.toLowerCase();
      return host.includes('netlify.app') || !!document.querySelector('meta[name="netlify"]');
    }

    function validateBeforeSubmit(mode) {
      const isContact = mode === 'contact';
      if (isContact) return true;

      if (!state.start || !state.end) {
        showToast('For requests, please select a date range (start + end).');
        const calCard = $('#bookingCalendarCard');
        if (calCard) calCard.classList.add('needs-attention');
        setTimeout(() => calCard && calCard.classList.remove('needs-attention'), 1600);
        return false;
      }

      if (selectionContainsBlockedDays(state.start, state.end)) {
        showToast('Your range includes fully booked day(s). Please choose different dates.');
        return false;
      }

      if (acceptAgb && !acceptAgb.checked) {
        showToast('Please accept the Terms & Conditions to send a request.');
        acceptAgb.closest('label')?.classList.add('needs-attention');
        setTimeout(() => acceptAgb.closest('label')?.classList.remove('needs-attention'), 1600);
        return false;
      }

      return true;
    }

    function bindForm() {
      if (!requestForm) return;

      requestForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const mode = requestType ? requestType.value : 'contact';
        if (!validateBeforeSubmit(mode)) return;

        // Check if access key is configured
        if (WEB3FORMS_ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY_HERE") {
          showToast('Error: Web3Forms access key not configured. Please add your key in script.js');
          console.error('Web3Forms access key not set. Get one free at https://web3forms.com');
          return;
        }

        if (tourStart && state.start) tourStart.value = dateToISO(state.start);
        if (tourEnd && state.end) tourEnd.value = dateToISO(state.end);

        const submit = $('#submitBtn');
        const oldText = submit ? submit.textContent : '';
        if (submit) {
          submit.disabled = true;
          submit.textContent = 'Sending…';
        }

        try {
          // Prepare form data for Web3Forms
          const formData = new FormData(requestForm);
          
          // Add Web3Forms access key
          formData.append('access_key', WEB3FORMS_ACCESS_KEY);
          
          // Add custom subject line based on mode
          const subject = mode === 'contact' 
            ? '🐋 New Question - Blue Whales Timor Leste'
            : '🐋 New Expedition Request - Blue Whales Timor Leste';
          formData.append('subject', subject);

          // Send to Web3Forms
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
          });

          const result = await response.json();

          if (result.success) {
            requestForm.reset();
            setMode(mode);
            const formSel = $('#tourPersons');
            if (formSel) formSel.value = String(state.persons);

            showToast(mode === 'contact' 
              ? 'Message sent - we will reply soon.' 
              : 'Request sent - we will reply with next steps.');
            closeModal();
          } else {
            throw new Error(result.message || 'Submission failed');
          }
        } catch (err) {
          console.error('Form submission error:', err);
          showToast('Submission failed. Please try again or email us directly.');
        } finally {
          if (submit) {
            submit.disabled = false;
            submit.textContent = oldText || (mode === 'contact' ? 'Send' : 'Send request');
          }
        }
      });
    }

    
    // ===== Terms modal
    const termsModal = $('#termsModal');
    const openTermsInline = $('#openTermsInline');
    const openTermsInline2 = $('#openTermsInline2');
    const openTermsFooter = $('#openTermsFooter');
    const closeTerms = $('#closeTerms');

    let termsLockedScrollY = 0;
    let termsPrev = { overflow:'', position:'', top:'', width:'', touchAction:'' };

    function lockScrollTerms() {
      termsLockedScrollY = window.scrollY || 0;
      termsPrev.overflow = document.body.style.overflow;
      termsPrev.position = document.body.style.position;
      termsPrev.top = document.body.style.top;
      termsPrev.width = document.body.style.width;
      termsPrev.touchAction = document.body.style.touchAction;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${termsLockedScrollY}px`;
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none';
    }

    function unlockScrollTerms() {
      document.body.style.overflow = termsPrev.overflow || '';
      document.body.style.position = termsPrev.position || '';
      document.body.style.top = termsPrev.top || '';
      document.body.style.width = termsPrev.width || '';
      document.body.style.touchAction = termsPrev.touchAction || '';
      window.scrollTo(0, termsLockedScrollY);
    }

    function openTermsModal(e) {
      if (e) e.preventDefault();
      if (!termsModal) return;
      closeMobileMenu();
      document.body.classList.add('terms-open');
      termsModal.setAttribute('aria-hidden', 'false');
      lockScrollTerms();
      try { closeTerms?.focus({ preventScroll: true }); } catch(_) {}
    }

    function closeTermsModal() {
      if (!termsModal) return;
      document.body.classList.remove('terms-open');
      termsModal.setAttribute('aria-hidden', 'true');
      unlockScrollTerms();
    }

    function bindTerms() {
      [openTermsInline, openTermsInline2, openTermsFooter].filter(Boolean).forEach((el) => {
        el.addEventListener('click', openTermsModal);
      });
      if (closeTerms) closeTerms.addEventListener('click', closeTermsModal);

      termsModal?.addEventListener('click', (e) => {
        if (e.target === termsModal) closeTermsModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('terms-open')) closeTermsModal();
      });
    }

// ===== Privacy modal
    const privacyModal = $('#privacyModal');
    const openPrivacyFooter = $('#openPrivacyFooter');
    const openPrivacyFooterInline = $('#openPrivacyFooterInline');
    const closePrivacy = $('#closePrivacy');

    let privacyLockedScrollY = 0;
    let privacyPrev = { overflow:'', position:'', top:'', width:'', touchAction:'' };

    function lockScrollPrivacy() {
      privacyLockedScrollY = window.scrollY || 0;
      privacyPrev.overflow = document.body.style.overflow;
      privacyPrev.position = document.body.style.position;
      privacyPrev.top = document.body.style.top;
      privacyPrev.width = document.body.style.width;
      privacyPrev.touchAction = document.body.style.touchAction;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${privacyLockedScrollY}px`;
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none';
    }
    function unlockScrollPrivacy() {
      document.body.style.overflow = privacyPrev.overflow || '';
      document.body.style.position = privacyPrev.position || '';
      document.body.style.top = privacyPrev.top || '';
      document.body.style.width = privacyPrev.width || '';
      document.body.style.touchAction = privacyPrev.touchAction || '';
      window.scrollTo(0, privacyLockedScrollY);
    }

    function openPrivacyFooterModal(e) {
      if (e) e.preventDefault();
      if (!privacyModal) return;
      closeMobileMenu();
      document.body.classList.add('privacy-open');
      privacyModal.setAttribute('aria-hidden', 'false');
      lockScrollPrivacy();
    }
    function closePrivacyModal() {
      if (!privacyModal) return;
      document.body.classList.remove('privacy-open');
      privacyModal.setAttribute('aria-hidden', 'true');
      unlockScrollPrivacy();
    }

    // ===== Gallery Carousel
    function initCarousel() {
      const track = $('#carouselTrack');
      const slides = $$('.carousel-slide');
      const prevBtn = $('#carouselPrev');
      const nextBtn = $('#carouselNext');
      const indicatorsContainer = $('#carouselIndicators');
      const currentSlideEl = $('#currentSlide');
      const totalSlidesEl = $('#totalSlides');

      if (!track || !slides.length) return;

      let currentIndex = 0;
      const totalSlides = slides.length;

      // Update total slides counter
      if (totalSlidesEl) totalSlidesEl.textContent = totalSlides;

      // Create indicator dots
      if (indicatorsContainer) {
        for (let i = 0; i < totalSlides; i++) {
          const dot = document.createElement('button');
          dot.className = 'carousel-dot';
          dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
          dot.addEventListener('click', () => goToSlide(i));
          indicatorsContainer.appendChild(dot);
        }
      }

      const dots = $$('.carousel-dot');

      function updateCarousel() {
        // Move track
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update counter
        if (currentSlideEl) currentSlideEl.textContent = currentIndex + 1;

        // Update dots
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });
      }

      function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
      }

      function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
      }

      function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
      }

      // Event listeners
      if (prevBtn) prevBtn.addEventListener('click', prevSlide);
      if (nextBtn) nextBtn.addEventListener('click', nextSlide);

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
      });

      // Touch/swipe support
      let touchStartX = 0;
      let touchEndX = 0;

      track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });

      function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            nextSlide(); // Swipe left
          } else {
            prevSlide(); // Swipe right
          }
        }
      }

      // Auto-play (optional - can be removed)
      let autoplayInterval;
      const autoplayDelay = 5000; // 5 seconds

      function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
      }

      function stopAutoplay() {
        clearInterval(autoplayInterval);
      }

      // Start autoplay
      startAutoplay();

      // Stop autoplay on user interaction
      [prevBtn, nextBtn].forEach(btn => {
        if (btn) {
          btn.addEventListener('click', () => {
            stopAutoplay();
            setTimeout(startAutoplay, autoplayDelay * 2);
          });
        }
      });

      // Stop autoplay when user manually changes slide
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          stopAutoplay();
          setTimeout(startAutoplay, autoplayDelay * 2);
        });
      });

      // Initialize
      updateCarousel();
    }

    // ===== AGB modal
    const agbModal = $('#agbModal');
    const openAgbFooter = $('#openAgbFooter');
    const openAgbInline = $('#openAgbInline');
    const closeAgb = $('#closeAgb');

    let agbLockedScrollY = 0;
    let agbPrev = { overflow:'', position:'', top:'', width:'', touchAction:'' };

    function lockScrollAgb() {
      agbLockedScrollY = window.scrollY || 0;
      agbPrev.overflow = document.body.style.overflow;
      agbPrev.position = document.body.style.position;
      agbPrev.top = document.body.style.top;
      agbPrev.width = document.body.style.width;
      agbPrev.touchAction = document.body.style.touchAction;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${agbLockedScrollY}px`;
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none';
    }

    function unlockScrollAgb() {
      document.body.style.overflow = agbPrev.overflow || '';
      document.body.style.position = agbPrev.position || '';
      document.body.style.top = agbPrev.top || '';
      document.body.style.width = agbPrev.width || '';
      document.body.style.touchAction = agbPrev.touchAction || '';
      window.scrollTo(0, agbLockedScrollY);
    }

    function openAgbModal(e) {
      if (e) e.preventDefault();
      if (!agbModal) return;
      closeMobileMenu();
      document.body.classList.add('agb-open');
      agbModal.setAttribute('aria-hidden', 'false');
      lockScrollAgb();
      try { closeAgb?.focus({ preventScroll: true }); } catch(_) {}
    }

    function closeAgbModal() {
      if (!agbModal) return;
      document.body.classList.remove('agb-open');
      agbModal.setAttribute('aria-hidden', 'true');
      unlockScrollAgb();
    }

    function bindAgb() {
      [openAgbFooter, openAgbInline].filter(Boolean).forEach((el) => {
        el.addEventListener('click', openAgbModal);
      });
      if (closeAgb) closeAgb.addEventListener('click', closeAgbModal);

      agbModal?.addEventListener('click', (e) => {
        if (e.target === agbModal) closeAgbModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('agb-open')) closeAgbModal();
      });
    }

    // ===== Impressum modal
    const impressumModal = $('#impressumModal');
    const openImpressumFooter = $('#openImpressumFooter');
    const openImpressumInline = $('#openImpressumInline');
    const closeImpressum = $('#closeImpressum');

    let impressumLockedScrollY = 0;
    let impressumPrev = { overflow:'', position:'', top:'', width:'', touchAction:'' };

    function lockScrollImpressum() {
      impressumLockedScrollY = window.scrollY || 0;
      impressumPrev.overflow = document.body.style.overflow;
      impressumPrev.position = document.body.style.position;
      impressumPrev.top = document.body.style.top;
      impressumPrev.width = document.body.style.width;
      impressumPrev.touchAction = document.body.style.touchAction;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${impressumLockedScrollY}px`;
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none';
    }

    function unlockScrollImpressum() {
      document.body.style.overflow = impressumPrev.overflow || '';
      document.body.style.position = impressumPrev.position || '';
      document.body.style.top = impressumPrev.top || '';
      document.body.style.width = impressumPrev.width || '';
      document.body.style.touchAction = impressumPrev.touchAction || '';
      window.scrollTo(0, impressumLockedScrollY);
    }

    function openImpressumModal(e) {
      if (e) e.preventDefault();
      if (!impressumModal) return;
      closeMobileMenu();
      document.body.classList.add('impressum-open');
      impressumModal.setAttribute('aria-hidden', 'false');
      lockScrollImpressum();
      try { closeImpressum?.focus({ preventScroll: true }); } catch(_) {}
    }

    function closeImpressumModal() {
      if (!impressumModal) return;
      document.body.classList.remove('impressum-open');
      impressumModal.setAttribute('aria-hidden', 'true');
      unlockScrollImpressum();
    }

    function bindImpressum() {
      [openImpressumFooter, openImpressumInline].filter(Boolean).forEach((el) => {
        el.addEventListener('click', openImpressumModal);
      });
      if (closeImpressum) closeImpressum.addEventListener('click', closeImpressumModal);

      impressumModal?.addEventListener('click', (e) => {
        if (e.target === impressumModal) closeImpressumModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('impressum-open')) closeImpressumModal();
      });
    }

    function bindPrivacy() {
      if (openPrivacyFooter) openPrivacyFooter.addEventListener('click', openPrivacyFooterModal);
      if (openPrivacyFooterInline) openPrivacyFooterInline.addEventListener('click', openPrivacyFooterModal);
      if (closePrivacy) closePrivacy.addEventListener('click', closePrivacyModal);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('privacy-open')) closePrivacyModal();
      });
    }

    // ===== Init
    bindSmoothScroll();
    bindActiveNav();
    bindMobileMenu();
    bindReveal();
    bindToTop();
    bindFaq();
    bindModal();
    bindTerms();
    bindPrivacy();
    bindAgb();
    bindImpressum();
    bindLightbox();
    initCarousel();

    bindCalendarNav('main');
    bindCalendarNav('booking');
    renderAllCalendars();
    bindPersons();
    bindDateInputs();
    updateMeta('main');
    updateMeta('booking');
    buildAdditionalGuests();
    bindForm();
    setMode('contact');

    loadAvailability();
  });
})();