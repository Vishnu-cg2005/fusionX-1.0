# Footer Cleanup + Partners/Register Gap Fix (latest)

- **Removed "Student Coordinators"** from the desktop footer (was Column 3)
  and from the mobile footer's accordion. Faculty Coordinators, Contact Us,
  and Organized By are unaffected.
- **Removed the "GCC Members" group** everywhere it was defined —
  `js/team-data.js` (shared data used by the desktop People section AND the
  mobile Organizers accordion) and `admin-portal.html`'s Team Deck default.
  "Guide the Vision" and "Organizers" are unaffected and still editable from
  the admin panel.
- **Rebalanced the desktop footer from 4 columns to 3** now that Student
  Coordinators is gone — Column 3 (Organized By) was left short next to
  Column 2 (Faculty Coordinators + Contact Us) and Column 4 (Collaboration
  Partner + Follow Us). Merged Organized By, Collaboration Partner, and
  Follow Us into one column alongside the unchanged Faculty/Contact column,
  so both content columns read as roughly even blocks again. Mobile/tablet
  breakpoints (2-col / 1-col stacking) already used generic rules, not
  per-column selectors, so no other responsive changes were needed.
- **Closed the gap between the Partners carousel and the Register banner**:
  `#partners` had 8vh/10vh top/bottom padding plus a 560px-tall carousel
  stage, and `#register` added another 20px top margin on top of that —
  stacking into a noticeable dead-black band between the two sections.
  Trimmed `#partners` padding to 6vh/4vh (5vh/8vh on the small-screen
  breakpoint, stage min-height reduced to match), and dropped `#register`'s
  top margin to 0 so the rounded register card sits right up against the
  partners section.

# What's At Stake — Full Redesign + Real 3D (latest)

- **Completely redesigned the "What's At Stake" prize section** (both the
  `#prizes` block in `index.html` and the standalone `whats-at-stake.html`)
  with fresh layout and copy, replacing the old flat trophy/cube images
  and separate red color scheme with the site's actual orange/black brand.
- **Added genuine 3D animation** — not a drop-shadow trick: a real CSS
  `transform-style: preserve-3d` cube (6 true faces built with
  `rotateX/Y` + `translateZ`) auto-rotates continuously and tilts toward
  the cursor on desktop (verified in-browser: computed style resolves to
  an actual `matrix3d(...)`, not a flat 2D transform). Two orbiting rings
  spin around it in 3D space. Below it, four prize-detail cards flip in
  from `rotateY(-85deg)` to flat as they scroll into view.
  `prefers-reduced-motion` freezes the spin and skips the flip-in.
- All prize facts carried over unchanged: ₹50,000+ total pool, ₹10,000
  per theme winner, 5+ themes (Smart Campus, AI, Sustainability,
  Healthcare, Open Innovation), equal-reward-equal-recognition policy.

# Cleanup & Bug-Fix Pass (latest)

- **Removed unused files/folders** to cut the project from 34MB to 19MB:
  `hero section/` (old superseded prototype), `reg/` (unused prototype +
  images), `partners/components/` (leftover unused React files),
  `partners/css/` + `partners/style.css` (unused — the real partners UI
  lives in `index.html`), `process_images.py` (dev-only script),
  `.vscode/`, and 6 confirmed-unused images.
- **Fixed the real cause of the broken mobile layout**: the navbar's HTML
  had mismatched tags — the nav links and the Register/hamburger buttons
  were accidentally nested *inside* an unclosed `<a>`/`<span>` (the logo).
  On top of that the hamburger button had no JS wired to it at all, and
  `.nav-links{display:flex!important}` in `css/style.css` permanently
  overrode the "hide behind hamburger" rule that already existed in
  `css/responsive.css`. Also fixed: the "REGISTER NOW" button in the top
  bar didn't shrink/hide on small screens, which pushed the hamburger
  completely off-screen (untappable). It's now moved into the mobile
  dropdown instead. Fixed a broken `bg-texture.png` path (missing
  `assets/` prefix, 404) along the way.
- **Fixed the admin ↔ live site disconnect, especially Partners**:
  `admin-portal.html` was saving partner add/edit/delete/reorder to
  `localStorage`, but `index.html`'s partners section was 100% static
  hardcoded HTML that never read that data — so admin changes never
  showed up live. The partners carousel now renders dynamically from the
  admin's saved data (with a safe fallback to the current content if
  nothing's been edited yet), and updates live across tabs. Also removed
  a hidden bug in the admin that silently deleted the "Growing Coders
  Club" partner from storage on every save.
- **Added an entrance animation**: a "FUSIONX 1.0 × GDG" splash plays
  once per session when someone lands on the homepage, then reveals the
  site (skippable by tap/click/Escape, respects
  `prefers-reduced-motion`).

# FUSIONX 1.0 — Redesign Notes

This is a full redesign, not a re-skin of the old template. Same brand
colors (white / black / #FF5A00 orange), same registration flow
(register → invite → join → status → payment → confirmation), everything
else — layout, components, copy, motion — rebuilt from scratch.

## Design direction

A clean, confident "editorial-tech" look instead of the previous dark
cyberpunk/neon-glow style: white as the primary canvas, black for
high-contrast sections, orange used deliberately as the one accent
(buttons, highlights, numbers) rather than glowing everywhere at once.
Two-font system (Space Grotesk for display, Inter for body) instead of
the old three-font stack.

## What actually changed

- **New homepage (`index.html`)**, written and structured from scratch:
  sticky nav, black hero with a live countdown, a stat strip, an About
  section built around your real campus photo, a plain (non-scroll-jacked)
  timeline, a five-track grid, a "how team formation works" step grid,
  a prize-tier layout, and a final CTA — all with fresh copy.
- **Removed the scroll-jacked "trump card" stack and spinning trophy
  entirely.** Those were the source of the repeated "blank space while
  scrolling" complaints, because pinned scroll-jacking is inherently
  fragile to tune. Replaced with plain scroll-reveal grids that animate
  in once and never trap the scroll — same information, none of the risk.
- **New shared design system (`style.css`)**, built around CSS variables
  so the palette is a single source of truth, plus reusable components
  (buttons, cards, badges, form fields, step tracker, progress bar).
- **Funnel pages (register/invite/join/status/payment/confirmation) were
  restyled for the new light canvas**, keeping every element ID and all
  existing JS logic intact so nothing about the actual registration
  functionality changed — only how it looks. Along the way I also fixed
  a couple of small pre-existing issues I found while doing this:
  - `payment.html`'s fee breakdown (`.fee-box`/`.row`) was referenced in
    the markup but never actually had CSS — it was rendering as
    unstyled inline text. Now properly styled.
  - `join.html`'s "collide" animation had a **white dot on a white
    background** (invisible) — now a black dot instead.
- **Admin portal** keeps its own dark dashboard theme (a reasonable,
  common choice for an internal tool) but its accent colors are aligned
  to the same orange/white brand tokens as the rest of the site.
- Kept the shared `animations.js` engine (page fade-in, scroll-reveal,
  button ripple) from the previous round — it's generic enough to work
  with the new component classes as-is.

## Still true from before

⚠️ `.env` and `test_email.py` now use Brevo SMTP (`smtp-relay.brevo.com`:587) configured via environment variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL`).

