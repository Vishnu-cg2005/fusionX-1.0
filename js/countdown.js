// Countdown Timer
//
// This script is loaded dynamically (see index.html's desktop-only
// script loader), i.e. it's injected into the page well AFTER the
// initial page load — so document.addEventListener('DOMContentLoaded')
// would never fire (that event already happened before this script
// even existed on the page), leaving the countdown frozen at its
// static placeholder numbers forever. Since this script only ever runs
// after being injected, the DOM is already guaranteed to be ready, so
// we just run immediately instead of waiting for an event that's
// already in the past.
(function () {
    function init() {
        const targetDate = new Date('September 18, 2026 09:00:00').getTime();

        const dEl = document.getElementById('cd-days');
        const hEl = document.getElementById('cd-hours');
        const mEl = document.getElementById('cd-minutes');
        const sEl = document.getElementById('cd-seconds');

        if (!dEl) return;

        function updateTimer() {
            const now = new Date().getTime();
            const diff = targetDate - now;

            if (diff <= 0) {
                dEl.textContent = '000';
                hEl.textContent = '00';
                mEl.textContent = '00';
                sEl.textContent = '00';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            dEl.textContent = days < 100 ? (days < 10 ? `00${days}` : `0${days}`) : days;
            hEl.textContent = hours < 10 ? `0${hours}` : hours;
            mEl.textContent = minutes < 10 ? `0${minutes}` : minutes;
            sEl.textContent = seconds < 10 ? `0${seconds}` : seconds;
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();