/* ============================================================
   FUSIONX -- Mobile App View
   ------------------------------------------------------------
   Full mobile layout (markup + styles + behaviour), mounted into
   index.html inside a Shadow DOM so its ids/classes (#hero,
   #partners, #prizes, .rail, etc.) never collide with the
   desktop layout's own ids/classes of the same name.

   index.html shows/hides the two layouts with a plain CSS media
   query (see the #fx-desktop-view / #fx-mobile-view-mount rules
   in index.html) -- there is no redirect and no page reload, so
   the same document adapts automatically to the device.

   Partners render from the SAME localStorage key the desktop
   carousel and admin-portal.html Control Deck use
   (fusionx_partners_store), so anything an admin publishes shows
   up here too, live, no rebuild, no redeploy.
   ============================================================ */
(function () {
  var MOBILE_CSS = `
/* ============================================================
   FUSIONX MOBILE — purpose-built app layout (not a squeezed desktop site)
   ============================================================ */
:host{
  --black:#0A0A0A;
  --panel:#141110;
  --panel-2:#1B1614;
  --line:rgba(255,255,255,0.10);
  --orange:#FF5A00;
  --orange-2:#FF8A3D;
  --amber:#FFB020;
  --white:#F7F5F2;
  --grey:#9C9691;
  --grey-dim:#6E6A66;
  --safe-b: env(safe-area-inset-bottom, 0px);
  --safe-t: env(safe-area-inset-top, 0px);
  --font-d:'Space Grotesk', sans-serif;
  --font-b:'Inter', sans-serif;
}
*{box-sizing:border-box; -webkit-tap-highlight-color:transparent;}
:host{display:block; margin:0; padding:0; background:var(--black); color:var(--white); font-family:var(--font-b); overflow-x:hidden;}
:host{-webkit-font-smoothing:antialiased; padding-bottom: calc(72px + var(--safe-b));}
img{max-width:100%; display:block;}
a{color:inherit; text-decoration:none;}
button{font-family:inherit;}
.container{padding:0 18px;}
::-webkit-scrollbar{display:none;}
* { scrollbar-width: none; }

/* ---------- App bar ---------- */
.appbar{
  position:sticky; top:0; z-index:40;
  display:flex; align-items:center; justify-content:space-between;
  padding: calc(12px + var(--safe-t)) 16px 12px;
  background:rgba(10,10,10,0.86);
  backdrop-filter: blur(14px);
  border-bottom:1px solid var(--line);
}
.appbar-brand{display:flex; align-items:center; gap:8px; font-family:var(--font-d); font-weight:800; font-size:1.05rem; letter-spacing:0.5px;}
.appbar-brand .ver{color:var(--orange); font-size:0.65em; vertical-align:super; margin-left:2px;}
.appbar-gdg{display:flex; align-items:center; gap:5px; font-size:0.62rem; font-weight:700; letter-spacing:1px; color:var(--grey); border:1px solid var(--line); padding:4px 8px; border-radius:100px;}
.appbar-gdg img{width:14px; height:14px; border-radius:3px;}
.appbar-menu-btn{
  width:38px; height:38px; border-radius:11px; background:var(--panel); border:1px solid var(--line);
  display:flex; align-items:center; justify-content:center; color:var(--white); font-size:1rem;
}

/* ---------- Slide-over nav ---------- */
.nav-overlay{
  position:fixed; inset:0; z-index:80; background:rgba(5,5,5,0.7); backdrop-filter: blur(4px);
  opacity:0; pointer-events:none; transition:opacity .25s ease;
}
.nav-overlay.open{opacity:1; pointer-events:auto;}
.nav-sheet{
  position:absolute; top:0; right:0; height:100%; width:78%; max-width:320px;
  background:var(--panel); border-left:1px solid var(--line);
  padding: calc(20px + var(--safe-t)) 22px 24px;
  transform:translateX(100%); transition:transform .32s cubic-bezier(.16,1,.3,1);
  display:flex; flex-direction:column; gap:4px;
}
.nav-overlay.open .nav-sheet{transform:translateX(0);}
.nav-close{align-self:flex-end; width:36px; height:36px; border-radius:10px; background:var(--panel-2); border:1px solid var(--line); color:var(--white); display:flex; align-items:center; justify-content:center; margin-bottom:18px;}
.nav-sheet a{padding:14px 4px; border-bottom:1px solid var(--line); font-family:var(--font-d); font-weight:600; font-size:1.05rem; display:flex; align-items:center; justify-content:space-between; color:var(--white);}
.nav-sheet a i{color:var(--orange); font-size:0.85rem;}
.nav-sheet .nav-cta{margin-top:18px; background:var(--orange); color:#fff; text-align:center; padding:14px; border-radius:12px; border:none; font-weight:700;}

/* ---------- Section scaffolding ---------- */
section{padding:44px 0 8px; position:relative;}
.eyebrow{
  display:inline-flex; align-items:center; gap:7px; font-family:var(--font-d); font-size:0.68rem; font-weight:700;
  letter-spacing:1.6px; text-transform:uppercase; color:var(--orange);
  background:rgba(255,90,0,0.10); border:1px solid rgba(255,90,0,0.35); border-radius:100px; padding:6px 12px 6px 10px;
}
.eyebrow .dot{width:5px; height:5px; border-radius:50%; background:var(--orange); box-shadow:0 0 8px var(--orange);}
h2.head{font-family:var(--font-d); font-weight:800; font-size:1.7rem; line-height:1.18; margin:14px 0 8px; letter-spacing:-0.3px;}
h2.head .accent{color:var(--orange);}
p.lede{color:var(--grey); font-size:0.92rem; line-height:1.6; margin:0 0 22px;}
.section-head{padding:0 18px;}

/* ---------- Horizontal scroll rail (shared) ---------- */
.rail{display:flex; gap:12px; overflow-x:auto; padding:2px 18px 14px; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;}
.rail::after{content:''; flex:0 0 4px;}
.rail-hint{display:flex; align-items:center; gap:6px; padding:0 18px; color:var(--grey-dim); font-size:0.72rem; margin-bottom:10px;}
.rail-hint i{font-size:0.7rem; animation:swipeHint 1.6s ease-in-out infinite;}
@keyframes swipeHint{0%,100%{transform:translateX(0);}50%{transform:translateX(4px);}}

/* ---------- HERO ---------- */
.hero{position:relative; padding-top:26px; overflow:hidden;}
.hero-bg{position:absolute; inset:0; z-index:0;}
.hero-bg img{width:100%; height:100%; object-fit:cover; opacity:0.55;}
.hero-bg::after{content:''; position:absolute; inset:0; background:linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.55) 40%, var(--black) 96%);}
.hero-inner{position:relative; z-index:2; padding:0 18px;}
.hero-tag{font-family:var(--font-d); font-size:0.7rem; font-weight:700; letter-spacing:2px; color:var(--orange-2); display:inline-flex; align-items:center; gap:6px; background:rgba(255,90,0,0.08); border:1px solid rgba(255,90,0,0.3); padding:6px 12px; border-radius:100px;}
.hero-title{font-family:var(--font-d); font-weight:800; font-size:clamp(2.2rem, 11vw, 2.7rem); line-height:1.04; margin:16px 0 12px; letter-spacing:-0.5px;}
.hero-title .grad{background:linear-gradient(90deg, var(--orange), var(--amber)); -webkit-background-clip:text; background-clip:text; color:transparent;}
.hero-desc{color:#D8D3CD; font-size:0.98rem; line-height:1.6; max-width:34rem; margin-bottom:22px;}
.hero-ctas{display:flex; flex-direction:column; gap:10px; margin-bottom:26px;}
.btn{
  display:flex; align-items:center; justify-content:center; gap:8px;
  font-family:var(--font-d); font-weight:700; font-size:0.92rem; letter-spacing:0.3px;
  padding:15px 20px; border-radius:13px; border:none; width:100%;
}
.btn-primary{background:var(--orange); color:#fff; box-shadow:0 10px 26px rgba(255,90,0,0.35);}
.btn-secondary{background:transparent; color:var(--white); border:1px solid var(--line);}
.btn i{font-size:0.8rem;}

/* Countdown strip */
.countdown{
  display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin:0 18px 8px;
  background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:14px 10px;
  position:relative; z-index:2;
}
.countdown-label{grid-column:1/-1; display:flex; align-items:center; gap:8px; color:var(--grey); font-size:0.68rem; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px; font-family:var(--font-d); font-weight:600;}
.countdown-label b{color:var(--white); font-weight:700;}
.cd-block{text-align:center;}
.cd-num{font-family:var(--font-d); font-weight:800; font-size:1.5rem; color:var(--orange-2); display:block; line-height:1;}
.cd-unit{font-size:0.6rem; color:var(--grey-dim); letter-spacing:1px; text-transform:uppercase;}

/* ---------- Stats rail ---------- */
.stat-card{
  scroll-snap-align:start; flex:0 0 132px; background:var(--panel); border:1px solid var(--line); border-radius:16px;
  padding:16px 14px; display:flex; flex-direction:column; gap:10px;
}
.stat-card i{color:var(--orange); font-size:1.15rem;}
.stat-card .n{font-family:var(--font-d); font-weight:800; font-size:1.3rem;}
.stat-card .l{font-size:0.72rem; color:var(--grey); line-height:1.3;}

/* ---------- About / feature cards ---------- */
.about-media{margin:0 18px 20px; border-radius:18px; overflow:hidden; border:1px solid var(--line); position:relative;}
.about-media img{width:100%; height:170px; object-fit:cover;}
.feature-card{
  scroll-snap-align:start; flex:0 0 216px; background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:18px;
}
.feature-ic{width:40px; height:40px; border-radius:11px; background:rgba(255,90,0,0.14); color:var(--orange); display:flex; align-items:center; justify-content:center; font-size:1rem; margin-bottom:12px;}
.feature-card h4{font-family:var(--font-d); font-size:0.95rem; margin:0 0 6px;}
.feature-card p{font-size:0.8rem; color:var(--grey); line-height:1.5; margin:0;}

/* ---------- Mission clock timeline ---------- */
.tl-rail{display:flex; gap:14px; overflow-x:auto; padding:2px 18px 6px; scroll-snap-type:x mandatory;}
.tl-card{
  scroll-snap-align:center; flex:0 0 82%; max-width:320px; background:var(--panel); border:1px solid var(--line);
  border-radius:18px; padding:20px; position:relative;
}
.tl-card.now{border-color:rgba(255,90,0,0.55); background:linear-gradient(160deg, rgba(255,90,0,0.10), var(--panel) 60%);}
.tl-step-row{display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;}
.tl-num{font-family:var(--font-d); font-weight:800; color:var(--grey-dim); font-size:0.75rem;}
.tl-day{font-family:var(--font-d); font-weight:700; font-size:0.65rem; letter-spacing:1px; color:var(--orange); background:rgba(255,90,0,0.12); padding:4px 9px; border-radius:100px;}
.tl-time{font-size:0.72rem; color:var(--grey); margin-bottom:6px; font-family:var(--font-d);}
.tl-title{font-family:var(--font-d); font-weight:700; font-size:1.08rem; margin-bottom:10px;}
.tl-chip-wrap{display:flex; flex-wrap:wrap; gap:6px;}
.tl-chip{font-size:0.68rem; background:var(--panel-2); border:1px solid var(--line); color:#D8D3CD; padding:5px 9px; border-radius:8px;}
.tl-desc{font-size:0.85rem; color:var(--grey); line-height:1.55;}
.tl-dots{display:flex; justify-content:center; gap:6px; margin-top:14px;}
.tl-dots span{width:6px; height:6px; border-radius:50%; background:var(--line);}
.tl-dots span.active{background:var(--orange); width:18px; border-radius:4px; transition:all .25s ease;}

/* ---------- Tracks ---------- */
.track-card{
  margin:0 18px 14px; background:var(--panel); border:1px solid var(--line); border-radius:18px; padding:20px;
  display:flex; flex-direction:column; gap:12px;
}
.track-card.featured{border-color:rgba(255,90,0,0.5); background:linear-gradient(160deg, rgba(255,90,0,0.09), var(--panel) 55%);}
.track-top{display:flex; align-items:center; justify-content:space-between;}
.track-ic{width:44px; height:44px; border-radius:12px; background:rgba(255,90,0,0.14); color:var(--orange); display:flex; align-items:center; justify-content:center; font-size:1.1rem;}
.track-tag{font-family:var(--font-d); font-size:0.62rem; font-weight:700; letter-spacing:1px; color:var(--grey-dim);}
.track-tag.hi{color:var(--orange);}
.track-card h4{font-family:var(--font-d); font-weight:700; font-size:1.05rem; margin:0;}
.track-card p{font-size:0.85rem; color:var(--grey); line-height:1.55; margin:0;}
.track-link{display:inline-flex; align-items:center; gap:6px; font-family:var(--font-d); font-weight:700; font-size:0.8rem; color:var(--orange);}

/* ---------- Team formation ---------- */
.formation{margin:0 18px; position:relative; padding-left:26px;}
.formation::before{content:''; position:absolute; left:9px; top:6px; bottom:6px; width:1px; background:var(--line);}
.f-step{position:relative; padding-bottom:26px;}
.f-step::before{content:''; position:absolute; left:-26px; top:2px; width:19px; height:19px; border-radius:50%; background:var(--black); border:2px solid var(--orange);}
.f-step .tag{font-family:var(--font-d); font-size:0.65rem; font-weight:700; color:var(--orange); letter-spacing:1px; margin-bottom:4px;}
.f-step h4{font-family:var(--font-d); font-size:0.95rem; margin:0 0 4px;}
.f-step p{font-size:0.82rem; color:var(--grey); margin:0; line-height:1.5;}

/* ---------- Prizes ---------- */
.prize-hero{margin:0 18px 18px; background:linear-gradient(160deg, #17110C, #0A0A0A); border:1px solid rgba(255,90,0,0.3); border-radius:20px; padding:26px 20px; text-align:center; position:relative; overflow:hidden;}
.prize-hero img{width:96px; margin:0 auto 12px; filter:drop-shadow(0 8px 20px rgba(255,90,0,0.35));}
.prize-amt{font-family:var(--font-d); font-weight:800; font-size:2.1rem; color:var(--white);}
.prize-amt span{color:var(--orange);}
.prize-sub{font-size:0.8rem; color:var(--grey); margin-top:4px;}
.prize-list{margin:0 18px; display:flex; flex-direction:column; gap:10px;}
.prize-row{display:flex; gap:14px; align-items:flex-start; background:var(--panel); border:1px solid var(--line); border-radius:14px; padding:14px 16px;}
.prize-row i{color:var(--orange); font-size:1rem; margin-top:2px;}
.prize-row h5{font-family:var(--font-d); font-size:0.88rem; margin:0 0 3px;}
.prize-row p{font-size:0.78rem; color:var(--grey); margin:0; line-height:1.45;}

/* ---------- Organizers accordion ---------- */
.org-accordion{margin:0 18px; display:flex; flex-direction:column; gap:10px;}
.org-item{background:var(--panel); border:1px solid var(--line); border-radius:14px; overflow:hidden;}
.org-item-head{display:flex; align-items:center; justify-content:space-between; padding:16px; }
.org-item-head-l{display:flex; align-items:center; gap:12px;}
.org-avatar{width:38px; height:38px; border-radius:10px; background:rgba(255,90,0,0.14); color:var(--orange); display:flex; align-items:center; justify-content:center; font-size:0.95rem;}
.org-item-head h5{font-family:var(--font-d); font-size:0.92rem; margin:0;}
.org-item-head small{color:var(--grey); font-size:0.72rem;}
.org-item-head i.chev{color:var(--grey-dim); transition:transform .25s ease;}
.org-item.open i.chev{transform:rotate(180deg);}
.org-body{max-height:0; overflow:hidden; transition:max-height .3s ease;}
.org-item.open .org-body{max-height:900px;}
.org-member{display:flex; gap:12px; padding:12px 16px; border-top:1px solid var(--line);}
.org-member img{width:42px; height:42px; border-radius:10px; object-fit:cover; background:var(--panel-2);}
.org-member .m-name{font-family:var(--font-d); font-weight:700; font-size:0.85rem;}
.org-member .m-role{font-size:0.74rem; color:var(--grey); margin:2px 0 5px; line-height:1.4;}
.m-role-heading{padding:10px 16px 2px; font-family:var(--font-d); font-weight:700; font-size:0.68rem; letter-spacing:0.04em; text-transform:uppercase; color:var(--orange); border-top:1px solid var(--line);}
.org-body>.m-role-heading:first-child{border-top:none;}

/* ---------- Partners rail ---------- */
.partner-card{
  scroll-snap-align:start; flex:0 0 260px; background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:18px; display:flex; flex-direction:column; gap:10px;
}
.partner-logo-frame{width:52px; height:52px; border-radius:12px; background:#fff; display:flex; align-items:center; justify-content:center; padding:8px;}
.partner-logo-frame img{width:100%; height:100%; object-fit:contain;}
.partner-card h5{font-family:var(--font-d); font-size:0.95rem; margin:0;}
.partner-role{font-size:0.68rem; color:var(--orange); letter-spacing:0.5px; text-transform:uppercase;}
.partner-card p{font-size:0.78rem; color:var(--grey); line-height:1.5; margin:0;}

/* ---------- Register banner ---------- */
.register-banner{margin:36px 18px 8px; background:radial-gradient(ellipse at top, rgba(255,90,0,0.16), transparent 60%), #0D0A08; border:1px solid rgba(255,90,0,0.3); border-radius:20px; padding:34px 22px; text-align:center;}
.register-banner .eyebrow{margin-bottom:14px;}
.register-banner h3{font-family:var(--font-d); font-weight:800; font-size:1.5rem; line-height:1.2; margin:0 0 10px;}
.register-banner p{color:var(--grey); font-size:0.88rem; margin:0 0 22px; line-height:1.5;}

/* ---------- Footer ---------- */
footer{margin-top:38px; padding:30px 18px 26px; border-top:1px solid var(--line);}
.foot-brand{font-family:var(--font-d); font-weight:800; font-size:1.3rem; margin-bottom:6px;}
.foot-brand .x{color:var(--orange);}
.foot-tag{font-size:0.68rem; letter-spacing:1.5px; color:var(--grey-dim); margin-bottom:18px;}
.foot-accordion{display:flex; flex-direction:column; gap:8px; margin-bottom:20px;}
.foot-item summary{list-style:none; display:flex; align-items:center; justify-content:space-between; padding:14px 4px; border-bottom:1px solid var(--line); font-family:var(--font-d); font-weight:700; font-size:0.86rem; cursor:pointer;}
.foot-item summary::-webkit-details-marker{display:none;}
.foot-item summary i{color:var(--grey-dim); transition:transform .2s ease;}
.foot-item[open] summary i{transform:rotate(180deg);}
.foot-person{padding:12px 4px 4px;}
.foot-person .n{font-family:var(--font-d); font-weight:700; font-size:0.85rem;}
.foot-person .r{font-size:0.75rem; color:var(--grey); margin:2px 0;}
.foot-person .p{font-size:0.78rem; color:var(--orange-2);}
.foot-contact{font-size:0.82rem; color:var(--grey); line-height:1.7; padding:8px 4px;}
.foot-contact a{color:var(--orange-2);}
.foot-bottom{padding-top:18px; border-top:1px solid var(--line); font-size:0.72rem; color:var(--grey-dim); line-height:1.6; text-align:center;}
.foot-bottom .copy{color:var(--grey); font-family:var(--font-d); font-weight:700; margin-bottom:6px; font-size:0.78rem;}

/* ---------- Bottom tab bar ---------- */
.tabbar{
  position:fixed; left:0; right:0; bottom:0; z-index:60;
  display:flex; align-items:stretch; justify-content:space-between;
  background:rgba(15,13,12,0.92); backdrop-filter:blur(16px);
  border-top:1px solid var(--line);
  padding: 6px 6px calc(6px + var(--safe-b));
}
.tab{
  flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px;
  padding:8px 2px; border-radius:12px; color:var(--grey-dim); font-size:0.6rem; font-weight:600; font-family:var(--font-d);
}
.tab i{font-size:1.02rem;}
.tab.active{color:var(--orange);}
.tab.cta{color:#fff;}
.tab.cta .tab-pill{background:var(--orange); width:38px; height:38px; border-radius:11px; display:flex; align-items:center; justify-content:center; margin-bottom:2px; box-shadow:0 6px 16px rgba(255,90,0,0.4);}

/* ---------- Utility / motion respect ---------- */
@media (prefers-reduced-motion: reduce){
  *{animation:none !important; transition:none !important;}
}
.reveal{opacity:0; transform:translateY(14px); transition:opacity .5s ease, transform .5s ease;}
.reveal.in{opacity:1; transform:translateY(0);}
`;

  var MOBILE_HTML = `
<!-- APP BAR -->
<div class="appbar">
  <a href="#hero" class="appbar-brand">FUSIONX<span class="ver">1.0</span></a>
  <div style="display:flex; align-items:center; gap:8px;">
    <span class="appbar-gdg"><img src="assets/gdg-logo.png" alt="GDG">GDG</span>
    <button class="appbar-menu-btn" id="menuBtn" aria-label="Open menu"><i class="fa-solid fa-bars"></i></button>
  </div>
</div>

<!-- SLIDE-OVER NAV -->
<div class="nav-overlay" id="navOverlay">
  <div class="nav-sheet">
    <button class="nav-close" id="navClose" aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button>
    <a href="#about" class="nav-link">About <i class="fa-solid fa-arrow-right"></i></a>
    <a href="#timeline" class="nav-link">Timeline <i class="fa-solid fa-arrow-right"></i></a>
    <a href="#tracks" class="nav-link">Tracks <i class="fa-solid fa-arrow-right"></i></a>
    <a href="#prizes" class="nav-link">Prizes <i class="fa-solid fa-arrow-right"></i></a>
    <a href="#organizers" class="nav-link">Organizers <i class="fa-solid fa-arrow-right"></i></a>
    <a href="#partners" class="nav-link">Partners <i class="fa-solid fa-arrow-right"></i></a>
    <a href="#site-footer" class="nav-link">Contact <i class="fa-solid fa-arrow-right"></i></a>
    <a href="register.html" class="nav-cta">Register Now</a>
  </div>
</div>

<!-- HERO -->
<main class="hero" id="hero">
  <div class="hero-bg"><img src="assets/images/hero-bg.png" alt=""></div>
  <div class="hero-inner">
    <span class="hero-tag">&lt; CODE • COLLABORATE • CREATE /&gt;</span>
    <h1 class="hero-title">BUILD. INNOVATE.<br><span class="grad">DISRUPT.</span></h1>
    <p class="hero-desc">FusionX 1.0 is a 24-hour hackathon celebrating the spirit of Programmers' Day — where ideas turn into innovation and developers build solutions for real-world challenges.</p>
    <div class="hero-ctas">
      <a href="register.html" class="btn btn-primary">Register Now <i class="fa-solid fa-arrow-right"></i></a>
      <a href="#tracks" class="btn btn-secondary">Explore Tracks <i class="fa-solid fa-arrow-right"></i></a>
    </div>
  </div>
  <div class="countdown">
    <div class="countdown-label"><i class="fa-regular fa-calendar-check" style="color:var(--orange);"></i> Hackathon starts <b>Sept 18–19, 2026</b></div>
    <div class="cd-block"><span class="cd-num" id="cd-days">00</span><span class="cd-unit">Days</span></div>
    <div class="cd-block"><span class="cd-num" id="cd-hours">00</span><span class="cd-unit">Hrs</span></div>
    <div class="cd-block"><span class="cd-num" id="cd-minutes">00</span><span class="cd-unit">Min</span></div>
    <div class="cd-block"><span class="cd-num" id="cd-seconds">00</span><span class="cd-unit">Sec</span></div>
  </div>
</main>

<!-- STATS -->
<section id="stats" style="padding-top:28px;">
  <div class="rail">
    <div class="stat-card reveal"><i class="fa-solid fa-user-group"></i><span class="n">100+</span><span class="l">Participants expected</span></div>
    <div class="stat-card reveal"><i class="fa-solid fa-trophy"></i><span class="n">₹50K+</span><span class="l">Total prize pool</span></div>
    <div class="stat-card reveal"><i class="fa-regular fa-clock"></i><span class="n">24hr</span><span class="l">Non-stop building</span></div>
    <div class="stat-card reveal"><i class="fa-solid fa-layer-group"></i><span class="n">5</span><span class="l">Open themes</span></div>
    <div class="stat-card reveal"><i class="fa-solid fa-gift"></i><span class="n">Exciting</span><span class="l">Rewards for all</span></div>
  </div>
</section>

<!-- ABOUT -->
<section id="about">
  <div class="section-head">
    <div class="eyebrow"><span class="dot"></span> Why Choose FusionX</div>
    <h2 class="head">More than a hackathon. A launchpad for <span class="accent">innovation.</span></h2>
    <p class="lede">A 24-hour experience where students collaborate, solve real-world problems, get mentor guidance, and present impactful solutions before industry experts.</p>
  </div>
  <div class="about-media reveal">
    <img src="assets/about-chip.png" alt="FusionX processor architecture">
  </div>
  <div class="rail-hint"><span>Swipe for what's included</span> <i class="fa-solid fa-chevron-right"></i></div>
  <div class="rail">
    <div class="feature-card"><div class="feature-ic"><i class="fa-solid fa-rocket"></i></div><h4>24-Hour Challenge</h4><p>A non-stop innovation sprint from first line of code to final demo.</p></div>
    <div class="feature-card"><div class="feature-ic"><i class="fa-solid fa-user-tie"></i></div><h4>Industry Mentors</h4><p>Guidance from experienced professionals throughout the build.</p></div>
    <div class="feature-card"><div class="feature-ic"><i class="fa-solid fa-trophy"></i></div><h4>Exciting Prizes</h4><p>Cash prizes and rewards across every theme, not just one winner.</p></div>
    <div class="feature-card"><div class="feature-ic"><i class="fa-solid fa-users"></i></div><h4>Networking</h4><p>Meet developers, designers, and founders from across campuses.</p></div>
    <div class="feature-card"><div class="feature-ic"><i class="fa-solid fa-lightbulb"></i></div><h4>Real-World Problems</h4><p>Work on challenges that matter and ship something impactful.</p></div>
    <div class="feature-card"><div class="feature-ic"><i class="fa-solid fa-certificate"></i></div><h4>Certificate</h4><p>Every participant walks away with an official certificate.</p></div>
  </div>
</section>

<!-- TIMELINE -->
<section id="timeline">
  <div class="section-head">
    <div class="eyebrow"><span class="dot"></span> Mission Clock</div>
    <h2 class="head">How the 24 hours <span class="accent">unfold</span></h2>
    <p class="lede">Swipe through the journey — from check-in to the grand finale.</p>
  </div>
  <div class="tl-rail" id="tlRail">
    <div class="tl-card now">
      <div class="tl-step-row"><span class="tl-num">01</span><span class="tl-day">DAY 1</span></div>
      <div class="tl-time">09:00 AM – 11:15 AM</div>
      <div class="tl-title">📝 Registration &amp; Kickoff</div>
      <div class="tl-chip-wrap">
        <span class="tl-chip">Registration</span><span class="tl-chip">Inauguration</span><span class="tl-chip">Welcome Address</span><span class="tl-chip">Snacks &amp; Networking</span>
      </div>
    </div>
    <div class="tl-card">
      <div class="tl-step-row"><span class="tl-num">02</span><span class="tl-day">DAY 1</span></div>
      <div class="tl-time">11:15 AM</div>
      <div class="tl-title">🚀 Hackathon Begins</div>
      <p class="tl-desc">The official 24-hour hackathon begins. Teams start ideation, planning, and initial development.</p>
    </div>
    <div class="tl-card">
      <div class="tl-step-row"><span class="tl-num">03</span><span class="tl-day">DAY 1</span></div>
      <div class="tl-time">11:15 AM – 09:45 PM</div>
      <div class="tl-title">💻 Development Sprint</div>
      <div class="tl-chip-wrap">
        <span class="tl-chip">Ideation</span><span class="tl-chip">Initial Dev</span><span class="tl-chip">Lunch</span><span class="tl-chip">Continued Dev</span><span class="tl-chip">Evening Snacks</span><span class="tl-chip">Dinner</span><span class="tl-chip">Night Coding</span>
      </div>
    </div>
    <div class="tl-card">
      <div class="tl-step-row"><span class="tl-num">04</span><span class="tl-day">DAY 2</span></div>
      <div class="tl-time">12:00 AM – 06:30 AM</div>
      <div class="tl-title">🌙 Overnight Build</div>
      <div class="tl-chip-wrap">
        <span class="tl-chip">Midnight Snacks</span><span class="tl-chip">Overnight Dev</span><span class="tl-chip">Final Integration</span><span class="tl-chip">Bug Fixing</span>
      </div>
    </div>
    <div class="tl-card">
      <div class="tl-step-row"><span class="tl-num">05</span><span class="tl-day">DAY 2</span></div>
      <div class="tl-time">06:30 AM – 08:15 AM</div>
      <div class="tl-title">🧑‍🏫 Mentor Review</div>
      <div class="tl-chip-wrap">
        <span class="tl-chip">Phase 2 Evaluation</span><span class="tl-chip">Breakfast</span><span class="tl-chip">Final Improvements</span>
      </div>
    </div>
    <div class="tl-card">
      <div class="tl-step-row"><span class="tl-num">06</span><span class="tl-day">DAY 2</span></div>
      <div class="tl-time">08:15 AM – 10:30 AM</div>
      <div class="tl-title">📤 Submission &amp; Demo</div>
      <div class="tl-chip-wrap">
        <span class="tl-chip">Final Submission</span><span class="tl-chip">Live Demo</span><span class="tl-chip">Jury Evaluation</span>
      </div>
    </div>
    <div class="tl-card">
      <div class="tl-step-row"><span class="tl-num">07</span><span class="tl-day">DAY 2</span></div>
      <div class="tl-time">10:30 AM – 11:30 AM</div>
      <div class="tl-title">🏆 Grand Finale</div>
      <div class="tl-chip-wrap">
        <span class="tl-chip">Valedictory</span><span class="tl-chip">Winner Announcement</span><span class="tl-chip">Prize Distribution</span><span class="tl-chip">Closing Ceremony</span>
      </div>
    </div>
  </div>
  <div class="tl-dots" id="tlDots"></div>
</section>

<!-- TRACKS -->
<section id="tracks">
  <div class="section-head">
    <div class="eyebrow"><span class="dot"></span> Pick Your Lane</div>
    <h2 class="head">Five open <span class="accent">tracks</span></h2>
    <p class="lede">Choose the track your team is most passionate about — your registration locks in your domain.</p>
  </div>
  <div class="track-card">
    <div class="track-top"><div class="track-ic"><i class="fa-solid fa-graduation-cap"></i></div><span class="track-tag">TRACK 01</span></div>
    <h4>Smart Campus &amp; Education</h4>
    <p>Next-gen digital tools, automated campus workflows, and interactive learning platforms.</p>
    <a href="register.html" class="track-link">Register Track <i class="fa-solid fa-arrow-right"></i></a>
  </div>
  <div class="track-card">
    <div class="track-top"><div class="track-ic"><i class="fa-solid fa-robot"></i></div><span class="track-tag">TRACK 02</span></div>
    <h4>AI for Social Good</h4>
    <p>Applied ML, computer vision, and generative AI built for real communities and human impact.</p>
    <a href="register.html" class="track-link">Register Track <i class="fa-solid fa-arrow-right"></i></a>
  </div>
  <div class="track-card">
    <div class="track-top"><div class="track-ic"><i class="fa-solid fa-seedling"></i></div><span class="track-tag">TRACK 03</span></div>
    <h4>Sustainability &amp; Environment</h4>
    <p>Clean-tech, renewable energy optimization, and climate-facing software platforms.</p>
    <a href="register.html" class="track-link">Register Track <i class="fa-solid fa-arrow-right"></i></a>
  </div>
  <div class="track-card">
    <div class="track-top"><div class="track-ic"><i class="fa-solid fa-heart-pulse"></i></div><span class="track-tag">TRACK 04</span></div>
    <h4>Healthcare &amp; Medical Tech</h4>
    <p>Telemedicine, AI diagnostics, emergency response, and patient care innovations.</p>
    <a href="register.html" class="track-link">Register Track <i class="fa-solid fa-arrow-right"></i></a>
  </div>
  <div class="track-card featured">
    <div class="track-top"><div class="track-ic"><i class="fa-solid fa-rocket"></i></div><span class="track-tag hi">TRACK 05 · WILD CARD</span></div>
    <h4>Open Innovation &amp; Emerging Tech</h4>
    <p>No boundaries! Web3, AR/VR, Robotics, IoT, or any breakthrough moonshot idea.</p>
    <a href="register.html" class="track-link">Register Track <i class="fa-solid fa-arrow-right"></i></a>
  </div>
</section>

<!-- TEAM FORMATION -->
<section id="team">
  <div class="section-head">
    <div class="eyebrow"><span class="dot"></span> Team Up</div>
    <h2 class="head">From solo sign-up to full <span class="accent">squad</span></h2>
    <p class="lede">Only the Team Lead handles the entire registration — from team details to payment.</p>
  </div>
  <div class="formation">
    <div class="f-step"><div class="tag">STEP 01</div><h4>Team Lead registers the team</h4><p>Only the Team Lead completes the registration and provides the team and problem statement details.</p></div>
    <div class="f-step"><div class="tag">STEP 02</div><h4>Add your teammates</h4><p>The Team Lead enters the details of all team members, including their name, phone number, department, and year.</p></div>
    <div class="f-step"><div class="tag">STEP 03</div><h4>Confirm team details</h4><p>The Team Lead reviews and confirms all team members' details before submitting the registration.</p></div>
    <div class="f-step" style="padding-bottom:6px;"><div class="tag">STEP 04</div><h4>Team Lead completes the payment</h4><p>The Team Lead makes a single payment for the entire team and completes the registration.</p></div>
  </div>
  <div class="container" style="margin-top:8px;">
    <a href="register.html" class="btn btn-primary">Start Your Team <i class="fa-solid fa-arrow-right"></i></a>
  </div>
</section>

<!-- PRIZES -->
<section id="prizes">
  <div class="section-head">
    <div class="eyebrow"><span class="dot"></span> What's At Stake</div>
    <h2 class="head">Innovate. Compete. <span class="accent">Win.</span></h2>
    <p class="lede">Bring your ideas to life and stand a chance to win big — every top team walks away rewarded.</p>
  </div>
  <div class="prize-hero">
    <img src="assets/trophy.png" alt="Trophy">
    <div class="prize-amt"><span>₹50,000+</span></div>
    <div class="prize-sub">Total prize pool · ₹10,000 per theme winner</div>
  </div>
  <div class="prize-list">
    <div class="prize-row"><i class="fa-solid fa-medal"></i><div><h5>1 Top Team, Every Theme</h5><p>Judges crown one top-ranking team per theme — no runners-up, no fine print.</p></div></div>
    <div class="prize-row"><i class="fa-solid fa-scale-balanced"></i><div><h5>Equal ₹10,000, Every Theme</h5><p>No tier differences: every theme winner takes home the exact same prize.</p></div></div>
    <div class="prize-row"><i class="fa-solid fa-layer-group"></i><div><h5>5+ Themes To Choose From</h5><p>Smart Campus, AI, Sustainability, Healthcare &amp; Open Innovation.</p></div></div>
    <div class="prize-row"><i class="fa-solid fa-handshake"></i><div><h5>Every Innovator Valued</h5><p>Equal reward. Equal recognition. Every win is celebrated the same way.</p></div></div>
  </div>
</section>

<!-- ORGANIZERS (data-driven: rendered from the same shared team data,
     window.FX_getTeamData() in js/team-data.js, that the desktop
     #people section and admin-portal.html's Team Deck use, so edits
     from either the code or the admin panel show up here too) -->
<section id="organizers">
  <div class="section-head">
    <div class="eyebrow"><span class="dot"></span> Behind FusionX</div>
    <h2 class="head">Organized by <span class="accent">Growing Coders Club</span></h2>
    <p class="lede">Tap a role below to view the people behind it.</p>
  </div>
  <div class="org-accordion" id="orgAccordion"></div>
</section>

<!-- PARTNERS (data-driven: populated live from the same
     fusionx_partners_store admin data the desktop carousel uses, so any
     add/edit/delete/reorder in admin-portal.html shows up here too) -->
<section id="partners">
  <div class="section-head">
    <div class="eyebrow"><span class="dot"></span> Together We Build</div>
    <h2 class="head">Community &amp; <span class="accent">Partners</span></h2>
    <p class="lede">Forward-thinking organizations empowering builders, innovators, and future leaders.</p>
  </div>
  <div class="rail" id="m-partners-rail"></div>
</section>

<!-- REGISTER BANNER -->
<div class="register-banner">
  <div class="eyebrow"><span class="dot"></span> Slots Are Limited</div>
  <h3>Ready to build the next big thing?</h3>
  <p>Lock in your track, gather your squad, and be part of FusionX 1.0.</p>
  <a href="register.html" class="btn btn-primary">Register Now <i class="fa-solid fa-arrow-right"></i></a>
</div>

<!-- FOOTER -->
<footer id="site-footer">
  <div class="foot-brand">FUSION<span class="x">X</span> 1.0</div>
  <div class="foot-tag">BUILD • INNOVATE • COLLABORATE • IMPACT</div>

  <div class="foot-accordion">
    <details class="foot-item">
      <summary>Faculty Coordinators <i class="fa-solid fa-chevron-down"></i></summary>
      <div class="foot-person"><div class="n">Mrs. B. Deepa</div><div class="r">AP / IT Department</div><div class="p">+91 99940 25811</div></div>
      <div class="foot-person"><div class="n">Mr. R. Rakesh</div><div class="r">AP / IT Department</div><div class="p">+91 90940 33538</div></div>
    </details>
    <details class="foot-item">
      <summary>Student Coordinators <i class="fa-solid fa-chevron-down"></i></summary>
      <div class="foot-person"><div class="n">Vishal Kowsik K</div><div class="r">IV / IT</div><div class="p">+91 75581 07252</div></div>
      <div class="foot-person"><div class="n">Janani A</div><div class="r">III / IT</div><div class="p">+91 88382 51767</div></div>
    </details>
    <details class="foot-item">
      <summary>Organized By <i class="fa-solid fa-chevron-down"></i></summary>
      <div class="foot-person"><div class="n">Growing Coders Club</div><div class="r">Department of Information Technology, Paavai Engineering College</div></div>
      <div class="foot-person"><div class="n">In collaboration with</div><div class="r">Google Developer Groups On Campus, Paavai Engineering College</div></div>
    </details>
    <details class="foot-item">
      <summary>Contact Us <i class="fa-solid fa-chevron-down"></i></summary>
      <div class="foot-contact">
        Department of Information Technology<br>
        Paavai Engineering College<br>
        NH-44, Pachal, Namakkal, Tamil Nadu - 637018<br>
        <a href="mailto:growingcodersclubit@gmail.com">growingcodersclubit@gmail.com</a>
      </div>
    </details>
  </div>

  <div class="foot-bottom">
    <div class="copy">© 2026 FusionX 0.1</div>
    Organized by Growing Coders Club ✕ Department of Information Technology, Paavai Engineering College,<br>
    in collaboration with Google Developer Groups On Campus – Paavai Engineering College.<br><br>
    All Rights Reserved.
  </div>
</footer>

<!-- BOTTOM TAB BAR -->
<nav class="tabbar" id="tabbar">
  <a href="#hero" class="tab active" data-tab="hero"><i class="fa-solid fa-house"></i>Home</a>
  <a href="#timeline" class="tab" data-tab="timeline"><i class="fa-solid fa-clock"></i>Timeline</a>
  <a href="#tracks" class="tab" data-tab="tracks"><i class="fa-solid fa-layer-group"></i>Tracks</a>
  <a href="#prizes" class="tab" data-tab="prizes"><i class="fa-solid fa-trophy"></i>Prizes</a>
  <a href="register.html" class="tab cta"><span class="tab-pill"><i class="fa-solid fa-arrow-right"></i></span>Join</a>
</nav>
`;

  var PARTNERS_KEY = 'fusionx_partners_store';
  var FALLBACK_PARTNERS = [
    {id:'p1', logo:'assets/gdg-logo.png', name:'Google Developer Groups', role:'Community Partner', partnerDesc:'Empowering student developers through learning, sharing, and building cutting-edge applications together.'},
    {id:'p2', logo:'assets/gcc-logo.png', name:'Growing Coders Club', role:'Organizing Partner', partnerDesc:'Building a community of passionate developers through workshops, hackathons, and collaborative projects.'},
    {id:'p3', logo:'partners/devfolio-mark.svg', name:'Devfolio', role:'Platform Partner', partnerDesc:"Powering India's largest hackathons with seamless submission, judging, and builder ecosystem tools."}
  ];

  // Priority: 1) unpublished draft in this browser (localStorage, admin
  // live preview) 2) the real published, permanent data baked into the
  // code (data/site-data.js) 3) hardcoded fallback above.
  function loadPartners() {
    try {
      var raw = localStorage.getItem(PARTNERS_KEY);
      if (raw) {
        var draft = JSON.parse(raw);
        if (Array.isArray(draft) && draft.length) return draft;
      }
    } catch (e) { /* fall through */ }
    var pub = window.FX_PUBLISHED_DATA && window.FX_PUBLISHED_DATA.partners;
    if (Array.isArray(pub) && pub.length) return pub;
    return FALLBACK_PARTNERS;
  }

  function esc(s) { var d = document.createElement('div'); d.textContent = (s == null ? '' : s); return d.innerHTML; }

  function cardTemplate(p) {
    return '<div class="partner-card">'
      + '<div class="partner-logo-frame"><img src="' + esc(p.logo || '') + '" alt="' + esc(p.name || '') + ' logo"></div>'
      + '<h5>' + esc(p.name || 'Partner') + '</h5>'
      + '<span class="partner-role">' + esc(p.role || p.type || '') + '</span>'
      + '<p>' + esc(p.partnerDesc || p.desc || '') + '</p>'
      + '</div>';
  }

  function init() {
    var mount = document.getElementById('fx-mobile-view-mount');
    if (!mount || mount.shadowRoot) return; // already mounted
    var root = mount.attachShadow({ mode: 'open' });
    // BUGFIX: the mobile layout lives inside a Shadow DOM, and the
    // Font Awesome <link> in the main document's <head> can't reach
    // inside a shadow root (styles don't cross the shadow boundary).
    // Every <i class="fa-solid ..."> icon in MOBILE_HTML (menu button,
    // nav arrows, stat cards, feature icons, etc.) was rendering blank
    // as a result. Loading the same Font Awesome stylesheet again here,
    // scoped to this shadow root, fixes all of them at once.
    var FA_HREF = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css';
    root.innerHTML = '<link rel="stylesheet" href="' + FA_HREF + '">'
      + '<style>' + MOBILE_CSS + '</style>' + MOBILE_HTML;

    // ---- Partners (data-driven, shared with admin portal) ----
    function renderPartners() {
      var rail = root.getElementById('m-partners-rail');
      if (!rail) return;
      var partners = loadPartners();
      rail.innerHTML = partners.map(cardTemplate).join('');
    }
    renderPartners();
    window.addEventListener('storage', function (e) { if (e.key === PARTNERS_KEY) renderPartners(); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) renderPartners(); });
    // Real-time: admin publishes a Partners Deck change -> Firestore
    // updates -> this fires automatically, even on someone's phone.
    window.addEventListener('fx:live-update', renderPartners);

    // Register buttons in this shadow root: point them at the admin's
    // registration link (e.g. Hack2Skill form) the moment it's set, and
    // whenever it changes live.
    if (window.FX_applyRegisterLinks) window.FX_applyRegisterLinks(root);
    window.addEventListener('fx:live-update', function () {
      if (window.FX_applyRegisterLinks) window.FX_applyRegisterLinks(root);
    });

    // ---- Countdown ----
    (function () {
      var target = new Date('September 18, 2026 09:00:00').getTime();
      var d = root.getElementById('cd-days'), h = root.getElementById('cd-hours'),
          m = root.getElementById('cd-minutes'), s = root.getElementById('cd-seconds');
      function tick() {
        var diff = target - Date.now();
        if (diff <= 0) { d.textContent = '00'; h.textContent = '00'; m.textContent = '00'; s.textContent = '00'; return; }
        var days = Math.floor(diff / 86400000), hrs = Math.floor(diff % 86400000 / 3600000),
            mins = Math.floor(diff % 3600000 / 60000), secs = Math.floor(diff % 60000 / 1000);
        d.textContent = String(days).padStart(2, '0');
        h.textContent = String(hrs).padStart(2, '0');
        m.textContent = String(mins).padStart(2, '0');
        s.textContent = String(secs).padStart(2, '0');
      }
      tick(); setInterval(tick, 1000);
    })();

    // ---- Slide-over nav ----
    (function () {
      var overlay = root.getElementById('navOverlay');
      root.getElementById('menuBtn').addEventListener('click', function () { overlay.classList.add('open'); });
      root.getElementById('navClose').addEventListener('click', function () { overlay.classList.remove('open'); });
      overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.classList.remove('open'); });
      overlay.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { overlay.classList.remove('open'); }); });
    })();

    // ---- In-page "#section" links (nav menu + bottom tab bar) ----
    // Everything here lives inside a Shadow DOM, so the browser's normal
    // "scroll to #id" behaviour doesn't work — it only looks at the main
    // document, not inside shadow trees. This finds the target INSIDE
    // this shadow root and scrolls to it manually instead.
    (function () {
      root.querySelectorAll('a[href^="#"]').forEach(function (a) {
        var id = a.getAttribute('href').slice(1);
        if (!id) return;
        a.addEventListener('click', function (e) {
          var target = root.getElementById(id);
          if (!target) return; // not an in-page id (shouldn't happen here)
          e.preventDefault();
          var appbar = root.querySelector('.appbar');
          var offset = appbar ? appbar.getBoundingClientRect().height + 10 : 10;
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        });
      });
    })();

    // ---- Timeline swipe dots ----
    (function () {
      var rail = root.getElementById('tlRail');
      var cards = Array.prototype.slice.call(rail.querySelectorAll('.tl-card'));
      var dotsWrap = root.getElementById('tlDots');
      cards.forEach(function (_, i) {
        var dot = document.createElement('span');
        if (i === 0) dot.className = 'active';
        dotsWrap.appendChild(dot);
      });
      var dots = Array.prototype.slice.call(dotsWrap.children);
      var ticking = false;
      rail.addEventListener('scroll', function () {
        if (ticking) return; ticking = true;
        requestAnimationFrame(function () {
          var railCenter = rail.scrollLeft + rail.clientWidth / 2;
          var closest = 0, min = Infinity;
          cards.forEach(function (c, i) {
            var c_center = c.offsetLeft + c.offsetWidth / 2;
            var dist = Math.abs(c_center - railCenter);
            if (dist < min) { min = dist; closest = i; }
          });
          dots.forEach(function (dt, i) { dt.classList.toggle('active', i === closest); });
          cards.forEach(function (c, i) { c.classList.toggle('now', i === closest); });
          ticking = false;
        });
      }, { passive: true });
    })();

    // ---- Organizers accordion (data-driven, shared with desktop + admin) ----
    (function () {
      var wrap = root.getElementById('orgAccordion');
      if (!wrap) return;

      function iconFor(key, g) { return g.icon || 'fa-users'; }

      function renderOrganizers() {
        var data = window.FX_getTeamData ? window.FX_getTeamData() : { order: [], groups: {} };
        var order = data.order || [];
        var groups = data.groups || {};
        var openKey = null;
        var openEl = wrap.querySelector('.org-item.open');
        if (openEl) openKey = openEl.getAttribute('data-org-key');

        wrap.innerHTML = order.map(function (key) {
          var g = groups[key];
          if (!g) return '';
          var sections = [];
          var byTag = {};
          (g.members || []).forEach(function (m) {
            var tag = m.tag || 'Team';
            if (!byTag[tag]) { byTag[tag] = []; sections.push(tag); }
            byTag[tag].push(m);
          });
          var members = sections.map(function (tag) {
            var cards = byTag[tag].map(function (m) {
              return '<div class="org-member"><img src="' + esc(m.img || 'org/img1.avif') + '" alt="">'
                + '<div><div class="m-name">' + esc(m.name || '') + '</div>'
                + '<div class="m-role">' + esc(m.role || '') + '</div></div></div>';
            }).join('');
            return '<div class="m-role-heading">' + esc(tag) + '</div>' + cards;
          }).join('');
          return '<div class="org-item' + (key === openKey ? ' open' : '') + '" data-org-key="' + key + '">'
            + '<div class="org-item-head" data-org="' + key + '">'
            + '<div class="org-item-head-l"><div class="org-avatar"><i class="fa-solid ' + iconFor(key, g) + '"></i></div>'
            + '<div><h5>' + esc(g.title || key) + '</h5><small>' + esc(g.blurb || '') + '</small></div></div>'
            + '<i class="fa-solid fa-chevron-down chev"></i>'
            + '</div>'
            + '<div class="org-body">' + members + '</div>'
            + '</div>';
        }).join('');
      }

      wrap.addEventListener('click', function (e) {
        var head = e.target.closest ? e.target.closest('.org-item-head') : null;
        if (!head || !wrap.contains(head)) return;
        var item = head.parentElement;
        var wasOpen = item.classList.contains('open');
        wrap.querySelectorAll('.org-item.open').forEach(function (el) { el.classList.remove('open'); });
        if (!wasOpen) item.classList.add('open');
      });

      renderOrganizers();
      window.addEventListener('storage', function (e) {
        if (e.key === (window.FX_TEAM_KEY || 'fusionx_team_store')) renderOrganizers();
      });
      document.addEventListener('visibilitychange', function () { if (!document.hidden) renderOrganizers(); });
      // Real-time: admin publishes a Team Deck change -> Firestore updates
      // -> this fires automatically, even on someone's phone.
      window.addEventListener('fx:live-update', renderOrganizers);
    })();

    // ---- Bottom tab active state on scroll ----
    (function () {
      var sections = ['hero', 'timeline', 'tracks', 'prizes'].map(function (id) { return root.getElementById(id); });
      var tabs = root.querySelectorAll('.tab[data-tab]');
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var id = entry.target.id;
              tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.tab === id); });
            }
          });
        }, { rootMargin: '-40% 0px -50% 0px' });
        sections.forEach(function (s) { if (s) io.observe(s); });
      }
    })();

    // ---- Reveal on scroll ----
    (function () {
      var els = root.querySelectorAll('.reveal');
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
          });
        }, { threshold: 0.15 });
        els.forEach(function (el) { io.observe(el); });
      } else {
        els.forEach(function (el) { el.classList.add('in'); });
      }
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
