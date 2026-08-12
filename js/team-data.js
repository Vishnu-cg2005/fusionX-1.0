/* ============================================================
   FUSIONX — Shared Team / Organizer Data
   ------------------------------------------------------------
   Single source of truth for the "Guide the Vision" and "Organizers"
   groups shown on:
     - Desktop:  #people section + members modal (index.html)
     - Mobile:   #organizers accordion (js/mobile-view.js)
     - Admin:    Team Deck tab (admin-portal.html)

   Editing FX_TEAM_DEFAULT below and re-deploying updates BOTH the
   desktop and mobile layouts at once, since they both read from
   this one file.

   PERMANENT DATA vs DRAFT DATA — read this if edits aren't sticking:
   - The real, permanent source of truth is window.FX_PUBLISHED_DATA
     (from data/site-data.js), a real file that ships with the code.
     This is what every visitor sees, on every device, always —
     including after the admin's browser is closed or the code is
     re-shared/re-hosted.
   - localStorage (FX_TEAM_KEY) is only an "unpublished draft" layer
     used inside admin-portal.html so the admin sees instant live
     previews while editing. It is local to one browser and is NOT
     included when the code is shared, so it must never be the final
     source for real visitors.
   - FX_getTeamData() below therefore prefers localStorage (an
     in-progress draft, if any) over the published file, and falls
     back to the published file, and only falls back to the
     hardcoded FX_TEAM_DEFAULT below if neither exists yet. Once the
     admin clicks "Download & Publish" in admin-portal.html and the
     downloaded data/site-data.js replaces this project's copy, that
     becomes the new permanent baseline for everyone.
   ============================================================ */
(function () {
  window.FX_TEAM_KEY = 'fusionx_team_store';

  window.FX_TEAM_DEFAULT = {
    order: ['GV'],
    groups: {
      GV: {
        title: 'Guide the Vision',
        icon: 'fa-graduation-cap',
        blurb: 'Overall guidance & faculty direction',
        members: [
          { name: 'Shri. CA. N.V. Natarajan', role: 'Chairman of Institutions', tag: 'Chief Patron', img: 'assets/team/chairman.jpg' },
          { name: '', role: '', tag: 'Chief Patron', img: 'assets/team/ccmam.jpg' },
          { name: 'Dr. M. Perm Kumar', role: 'Principal of Paavai Engineering College', tag: 'Patron', img: 'assets/team/principal.jpg' },
          { name: 'Dr. B. Venkatesan', role: 'Head of IT', tag: 'Convener', img: 'assets/team/hod.jpg' },
          { name: 'Mr. R. Rakesh', role: 'AP/IT', tag: 'Faculty Co-ordinator', img: '' },
          { name: 'Mrs. B. Deepa', role: 'AP/IT', tag: 'Faculty Co-ordinator', img: 'assets/team/deepa.jpg' }
        ]
      }
    }
  };

  function publishedTeam() {
    return (window.FX_PUBLISHED_DATA && window.FX_PUBLISHED_DATA.team) || null;
  }

  window.FX_getTeamData = function () {
    // 1) In-progress draft edit in THIS browser (admin-portal.html live preview)
    try {
      var raw = localStorage.getItem(window.FX_TEAM_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.groups && parsed.order) return parsed;
      }
    } catch (e) { /* fall through */ }
    // 2) The real published, permanent data baked into the code
    var pub = publishedTeam();
    if (pub && pub.groups && pub.order) return pub;
    // 3) Last-resort hardcoded fallback (only if data/site-data.js is missing)
    return window.FX_TEAM_DEFAULT;
  };
})();
