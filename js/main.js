// Interactive 3D Cube Mouse Parallax
document.addEventListener('DOMContentLoaded', () => {
    const cubeImg = document.getElementById('cubeImg');

    if (cubeImg) {
        window.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.clientX) / 45;
            const yAxis = (window.innerHeight / 2 - e.clientY) / 45;
            cubeImg.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
    }

    const magneticBtns = document.querySelectorAll('.magnetic');
    magneticBtns.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // Mobile nav toggle — this alone was previously harmless-but-inert
    // because css/style.css forced `.nav-links{display:flex!important}`,
    // permanently overriding the mobile "hidden until toggled" rule in
    // responsive.css. That !important has been removed, so this now
    // actually opens/closes the mobile menu. Added: icon swap, close on
    // outside click / Escape / link tap / resize back to desktop.
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navIcon = navToggle ? navToggle.querySelector('i') : null;
    if (navToggle && navLinks) {
        const closeNav = () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
            if (navIcon) { navIcon.classList.remove('fa-xmark'); navIcon.classList.add('fa-bars'); }
        };
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = navLinks.classList.toggle('active');
            navToggle.classList.toggle('active', open);
            if (navIcon) { navIcon.classList.toggle('fa-bars', !open); navIcon.classList.toggle('fa-xmark', open); }
        });
        navLinks.querySelectorAll('.nav-link').forEach((a) => a.addEventListener('click', closeNav));
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) closeNav();
        });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
        window.addEventListener('resize', () => { if (window.innerWidth > 840) closeNav(); });
    }

    // Animated Counters on Scroll Into View
    function initCounters() {
        const counters = document.querySelectorAll('.counter[data-target]');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'), 10);
                    const prefix = el.getAttribute('data-prefix') || '';
                    const suffix = el.getAttribute('data-suffix') || '';
                    const duration = 1800;
                    const startTime = performance.now();

                    function updateNumber(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(easeProgress * target);

                        el.textContent = `${prefix}${current}${suffix}`;

                        if (progress < 1) {
                            requestAnimationFrame(updateNumber);
                        } else {
                            el.textContent = `${prefix}${target}${suffix}`;
                        }
                    }

                    requestAnimationFrame(updateNumber);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.25 });

        counters.forEach((counter) => observer.observe(counter));
    }

    initCounters();
});