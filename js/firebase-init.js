/* ==============================================================
   FUSIONX — Firebase connection
   --------------------------------------------------------------
   This is what makes admin edits truly automatic: instead of
   saving to localStorage (one browser only) or a downloaded file
   (manual copy step), admin-portal.html writes straight to this
   Firestore database, and every visitor's browser (index.html,
   the mobile view, anywhere the site is opened — local file or
   hosted) listens to the SAME database in real time.

   Edit in admin -> Firestore updates -> every open copy of the
   site updates itself automatically, no reload, no redeploy.
   ============================================================== */
(function () {
  var firebaseConfig = {
    apiKey: "AIzaSyDofSibHR1gUVzLy2McDpWbBdkvHla2r_A",
    authDomain: "fusionx--1.firebaseapp.com",
    projectId: "fusionx--1",
    storageBucket: "fusionx--1.firebasestorage.app",
    messagingSenderId: "971237946128",
    appId: "1:971237946128:web:4bc23068da749b01da6b95"
  };

  try {
    if (typeof firebase === 'undefined') {
      console.warn('[FusionX] Firebase SDK did not load (no internet, or CDN blocked). Falling back to local data only.');
      return;
    }
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    window.FX_DB = firebase.firestore();
    // Single shared document holding everything the site needs live:
    // partners[], team{}, registrationLink
    window.FX_DOC = window.FX_DB.collection('fusionx').doc('live');
  } catch (e) {
    console.warn('[FusionX] Firebase init failed, falling back to local data only.', e);
  }
})();
