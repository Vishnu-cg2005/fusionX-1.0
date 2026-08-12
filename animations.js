/* ==========================================================================
   FUSIONX SHARED ANIMATION ENGINE
   Loaded on every page — gives a consistent "stunning" motion layer:
   1) Page-load fade-in (no flash of unstyled content)
   2) Scroll-reveal for cards/sections as they enter the viewport
   3) Ripple + magnetic hover feedback on buttons
   ========================================================================== */
(function () {
  // ---- 1. Page-load fade-in ------------------------------------------------
  document.documentElement.style.setProperty('--page-enter-ready', '0');
  function triggerPageEnter() {
    if (document.body.classList.contains('fx-page-enter')) return;
    document.body.classList.add('fx-page-enter');
    requestAnimationFrame(function () {
      document.body.classList.add('fx-page-enter-active');
    });
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', triggerPageEnter);
  } else {
    triggerPageEnter();
  }

  // ---- 2. Scroll-reveal -----------------------------------------------------
  function initReveal() {
    const candidates = document.querySelectorAll(
      '.card, .track-3d-card, .step-track, .done-wrap, main > h1, main > .lede, main > .eyebrow, #tracks .track-3d-card'
    );
    candidates.forEach((el) => el.classList.add('fx-reveal'));

    if (!('IntersectionObserver' in window)) {
      candidates.forEach((el) => el.classList.add('fx-reveal-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fx-reveal-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.02, rootMargin: '100px 0px 100px 0px' }
    );

    candidates.forEach((el) => io.observe(el));

    // Fallback: Reveal all elements after 800ms to guarantee visibility regardless of scroll triggers
    setTimeout(() => {
      candidates.forEach((el) => el.classList.add('fx-reveal-in'));
    }, 800);
  }

  // ---- 3. Button ripple + magnetic hover ------------------------------------
  function initButtons() {
    document.querySelectorAll('.btn, button').forEach((btn) => {
      if (btn.dataset.fxBound) return;
      btn.dataset.fxBound = '1';
      btn.classList.add('fx-btn');

      btn.addEventListener('click', function (e) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'fx-ripple';
        const size = Math.max(rect.width, rect.height) * 1.4;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  // ---- 4. Hero canvas particle engine --------------------------------------
  function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 12000), 65);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.8 + 0.6,
          alpha: Math.random() * 0.45 + 0.15
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 90, 0, ${p.alpha})`;
        ctx.shadowColor = 'rgba(255, 90, 0, 0.4)';
        ctx.shadowBlur = 8;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 90, 0, ${(1 - dist / 110) * 0.18})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); createParticles(); });
    resize();
    createParticles();
    draw();
  }

  // ---- 5. 3D Tilt Engine for Vision Tracks, Person Cards & Prizes -------
  function init3DTilt() {
    const cards = document.querySelectorAll('.track-3d-card, .person-card, .prize-card, .prize-card-animated, .card.dark, .card-member');
    cards.forEach((card) => {
      const inner = card.querySelector('.track-3d-inner') || card;
      card.style.perspective = '1000px';
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -14; // 3D tilt max 14 deg
        const rotateY = ((x - centerX) / centerX) * 14;
        
        inner.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px) scale3d(1.04, 1.04, 1.04)`;
        inner.style.boxShadow = `0 25px 50px rgba(255, 90, 0, 0.4), 0 0 35px rgba(255, 90, 0, 0.25)`;
      });

      card.addEventListener('mouseleave', () => {
        inner.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)`;
        inner.style.boxShadow = '';
      });
    });
  }

  // ---- Interactive Trophy Click Sparkles Effect -------------------------
  function initTrophySparkles() {
    const medals = document.querySelectorAll('.prize-medal-animated, .prize-medal');
    medals.forEach(medal => {
      medal.addEventListener('click', (e) => {
        const rect = medal.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 20; i++) {
          const spark = document.createElement('div');
          const angle = Math.random() * Math.PI * 2;
          const dist = 35 + Math.random() * 70;
          const tx = Math.cos(angle) * dist;
          const ty = Math.sin(angle) * dist - 25;
          const colors = ['#FF5A00', '#FFC700', '#FFFFFF', '#FFA066'];
          const color = colors[Math.floor(Math.random() * colors.length)];

          spark.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: ${6 + Math.random() * 6}px;
            height: ${6 + Math.random() * 6}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 12px ${color};
            transform: translate(-50%, -50%) scale(1);
            transition: transform 0.8s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.8s ease;
          `;

          document.body.appendChild(spark);

          requestAnimationFrame(() => {
            spark.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
            spark.style.opacity = '0';
          });

          setTimeout(() => spark.remove(), 850);
        }
      });
    });
  }

  // ---- 6. Dynamic Track Slot Status Fetcher for index.html ----------------
  function loadIndexTrackSlots() {
    const badges = document.querySelectorAll('[data-theme-name]');
    if (!badges.length) return;

    let data = null;
    try {
      const raw = localStorage.getItem('fusionx_slots_store');
      if (raw) data = JSON.parse(raw);
    } catch (err) {}

    const themesMap = (data && data.themes) ? data.themes : {};
    badges.forEach(badge => {
      const themeName = badge.getAttribute('data-theme-name');
      const info = themesMap[themeName] || { used: 0, remaining: 6, total: 6, isFull: false };
      const total = info.total || 6;
      const remaining = info.remaining !== undefined ? info.remaining : total;
      
      if (info.isFull || remaining <= 0) {
        badge.classList.add('is-full');
        badge.innerHTML = `<i class="fa-solid fa-ban"></i> FULL · 0 / ${total} Slots Left`;
      } else {
        badge.classList.remove('is-full');
        badge.innerHTML = `<i class="fa-solid fa-bolt"></i> ${remaining} / ${total} Slots Left`;
      }
    });
  }

  function initAll() {
    initReveal();
    initButtons();
    initHeroCanvas();
    init3DTilt();
    initTrophySparkles();
    loadIndexTrackSlots();
    setInterval(loadIndexTrackSlots, 2000);
    window.addEventListener('storage', loadIndexTrackSlots);
    setInterval(initButtons, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
