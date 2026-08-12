/* ==================================================================
   FUSIONX — PUBLISHED SITE DATA (the real, permanent source of truth)
   ------------------------------------------------------------------
   This file is what makes admin edits PERMANENT.

   - Admin edits in admin-portal.html normally live only in that
     browser's localStorage (temporary, lost on browser close, not
     included when you zip/share the code, not shared between your
     laptop and your phone).
   - This file is a real file on disk. Whatever is written here ships
     with the code every time you zip/share/host the project, and is
     read the same way by every visitor, on every device, every time.

   HOW TO PUBLISH AN ADMIN EDIT PERMANENTLY:
   1. Make your edits in admin-portal.html as usual (Partners Deck /
      Team Deck tabs). You'll see them live-update instantly — that
      live preview still uses localStorage, same as before.
   2. When you're happy with the result, click the
      "⬇ Download & Publish" button (top of the Partners Deck and
      Team Deck tabs).
   3. That downloads an updated copy of THIS exact file
      (site-data.js). Replace this file in your project's /data/
      folder with the downloaded one.
   4. Re-zip / re-upload / redeploy. Now every visitor — web or
      mobile, any browser, even after you close yours — sees your
      edit, because it's baked into the code itself.

   index.html, js/mobile-view.js and js/team-data.js all read from
   window.FX_PUBLISHED_DATA first. localStorage is only used as a
   short-lived "unpublished draft" layer inside admin-portal.html
   itself, so the admin's own edits always win locally right up until
   they're published here.
   ================================================================== */
window.FX_PUBLISHED_DATA = {
  partners: [
    {id:'p1', logo:'assets/gdg-logo.png', type:'Community Partner', eyebrow:'Together We Build', headingWhite:'Community', headingAccent:'Partners', desc:'We collaborate with forward-thinking organizations and communities to empower builders, innovators, and future leaders.', name:'Google Developer Groups', role:'Community Partner', partnerDesc:'Empowering student developers through learning, sharing, and building cutting-edge applications together.', linkText:'', linkUrl:''},
    {id:'p2', logo:'assets/gcc-logo.png', type:'Organizing Partner', eyebrow:'Powering The Build', headingWhite:'Organizing', headingAccent:'Partners', desc:'Fostering programmatic excellence, peer learning, and hands-on developer experiences across the ecosystem.', name:'Growing Coders Club', role:'Organizing Partner', partnerDesc:'Building a community of passionate developers through workshops, hackathons, and collaborative projects.', linkText:'', linkUrl:''},
    {id:'p3', logo:'partners/devfolio-mark.svg', type:'Platform Partner', eyebrow:'Ideas Today, Impact Tomorrow', headingWhite:'Platform', headingAccent:'Partners', desc:'We team up with platforms that power builders across the ecosystem, from first commit to demo day.', name:'Devfolio', role:'Platform Partner', partnerDesc:"Powering India's largest hackathons with seamless project submission, judging, and builder ecosystem tools.", linkText:'', linkUrl:''}
  ],
  team: {
    order: ['GV'],
    groups: {
      GV: { title:'Guide the Vision', icon:'fa-graduation-cap', blurb:'Overall guidance & faculty direction', members:[
        {name:'Shri. CA. N.V. Natarajan', role:'Chairman of Institutions', tag:'Chief Patron', img:'assets/team/chairman.jpg'},
        {name:'', role:'', tag:'Chief Patron', img:'assets/team/ccmam.jpg'},
        {name:'Dr. M. Perm Kumar', role:'Principal of Paavai Engineering College', tag:'Patron', img:'assets/team/principal.jpg'},
        {name:'Dr. B. Venkatesan', role:'Head of IT', tag:'Convener', img:'assets/team/hod.jpg'},
        {name:'Mr. R. Rakesh', role:'AP/IT', tag:'Faculty Co-ordinator', img:''},
        {name:'Mrs. B. Deepa', role:'AP/IT', tag:'Faculty Co-ordinator', img:'assets/team/deepa.jpg'}
      ]}
    }
  }
};
