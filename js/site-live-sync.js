/* ==============================================================
   FUSIONX — Live sync
   --------------------------------------------------------------
   Subscribes to the shared Firestore document and keeps
   window.FX_PUBLISHED_DATA up to date in real time. Whenever the
   admin saves a change (partners, team, or the registration link),
   this fires on every open copy of the site — desktop, mobile,
   local file, or hosted — and re-renders automatically.

   Priority for what a page shows, everywhere this project reads
   window.FX_PUBLISHED_DATA:
     1) Live Firestore data (this file) — real, permanent, instant.
     2) data/site-data.js — a static fallback baked into the code,
        used only if Firestore can't be reached (offline / SDK
        blocked / no config yet).
     3) Small hardcoded defaults inside each script, as a last
        resort so the page never breaks.
   ============================================================== */
(function () {
  window.FX_PUBLISHED_DATA = window.FX_PUBLISHED_DATA || {};

  function applyLiveData(data) {
    if (!data) return;
    if (data.partners) window.FX_PUBLISHED_DATA.partners = data.partners;
    if (data.team) window.FX_PUBLISHED_DATA.team = data.team;
    window.FX_PUBLISHED_DATA.registrationLink = data.registrationLink || '';
    window.FX_LIVE_CONNECTED = true;
    window.dispatchEvent(new CustomEvent('fx:live-update', { detail: data }));
    applyRegisterLinks(document);
  }

  // Points every "Register" style link on the page at the admin's
  // registration link (e.g. a Hack2Skill form URL). Purely cosmetic —
  // makes the href/status-bar preview accurate. Actual click behaviour
  // (redirect vs "coming soon") is handled by the click handler below,
  // which doesn't depend on this having run yet.
  // root can be `document` or a shadow root (mobile view).
  window.FX_applyRegisterLinks = function (root) {
    if (!root) return;
    var link = window.FX_PUBLISHED_DATA && window.FX_PUBLISHED_DATA.registrationLink;
    var nodes = root.querySelectorAll('a[href="register.html"], a[data-register-link]');
    nodes.forEach(function (el) {
      if (link) {
        el.setAttribute('href', link);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
      } else {
        el.setAttribute('data-register-link', '');
      }
    });
  };
  function applyRegisterLinks(root) { window.FX_applyRegisterLinks(root); }

  /* ==============================================================
     REGISTER BUTTON CLICKS — every "Register" / "Join" button on the
     site (desktop AND the mobile view inside its Shadow DOM) goes
     through here. Decided fresh at the moment of the click, straight
     from window.FX_PUBLISHED_DATA, so it's always correct even if the
     link was just published seconds ago:
       - No registration link published yet -> show a "coming soon"
         toast, don't navigate anywhere.
       - Link published -> open it in a new tab immediately.
     e.composedPath() is used (not e.target) specifically so this also
     catches clicks on buttons rendered inside the mobile Shadow DOM.
     ============================================================== */
  function isRegisterLink(node) {
    return node && node.tagName === 'A' &&
      (node.getAttribute('href') === 'register.html' || node.hasAttribute('data-register-link'));
  }

  document.addEventListener('click', function (e) {
    var path = typeof e.composedPath === 'function' ? e.composedPath() : [e.target];
    var el = null;
    for (var i = 0; i < path.length; i++) { if (isRegisterLink(path[i])) { el = path[i]; break; } }
    if (!el) return;
    e.preventDefault();
    var link = window.FX_PUBLISHED_DATA && window.FX_PUBLISHED_DATA.registrationLink;
    if (link) {
      window.open(link, '_blank', 'noopener');
    } else {
      showComingSoonToast();
    }
  }, true);

  var toastTimer = null;
  function showComingSoonToast() {
    var t = document.getElementById('fxRegToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'fxRegToast';
      t.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(8px);'
        + 'background:#171717;color:#fff;padding:13px 22px;border-radius:100px;'
        + "font-family:'Inter',-apple-system,sans-serif;font-size:14px;font-weight:600;"
        + 'box-shadow:0 12px 32px rgba(0,0,0,0.4);border:1px solid rgba(255,90,0,0.45);'
        + 'z-index:2147483647;opacity:0;transition:opacity .25s ease, transform .25s ease;'
        + 'pointer-events:none;white-space:nowrap;';
      document.body.appendChild(t);
    }
    t.textContent = '\u23F3 Registration will be coming soon';
    requestAnimationFrame(function () {
      t.style.opacity = '1';
      t.style.transform = 'translateX(-50%) translateY(0)';
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.style.opacity = '0';
      t.style.transform = 'translateX(-50%) translateY(8px)';
    }, 2400);
  }

  function start() {
    if (!window.FX_DOC) { setTimeout(start, 250); return; }
    window.FX_DOC.onSnapshot(function (snap) {
      if (snap.exists) applyLiveData(snap.data());
    }, function (err) {
      console.warn('[FusionX] Live sync error — showing local fallback data instead.', err);
    });
  }
  start();
})();
