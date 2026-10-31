/* ====================================================
   EZSENCIA DISTRIBUCIÓN — comportamiento común
   Cursor, cabecera, reveal y menú: misma lógica que el club.
   ==================================================== */

(function () {

    /* ── Cursor personalizado ───────────────────────── */

    var cursor = document.getElementById('cursor');
    var ring   = document.getElementById('cursorRing');

    if (cursor && ring) {
        var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX; mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top  = mouseY + 'px';
        });

        (function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            ring.style.left = ringX + 'px';
            ring.style.top  = ringY + 'px';
            requestAnimationFrame(animateRing);
        })();

        document.querySelectorAll('a, button').forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                ring.style.transform   = 'translate(-50%, -50%) scale(1.5)';
            });
            el.addEventListener('mouseleave', function () {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                ring.style.transform   = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    /* ── Cabecera al hacer scroll ───────────────────── */

    var navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    /* ── Reveal ─────────────────────────────────────── */

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(function (el) {
        observer.observe(el);
    });

    /* ── Menú desplegable ───────────────────────────── */

    var hamburger   = document.getElementById('navHamburger');
    var drawer      = document.getElementById('navMobileDrawer');
    var backdrop    = document.getElementById('navBackdrop');
    var drawerClose = document.getElementById('navMobileClose');

    function openMenu() {
        hamburger.setAttribute('aria-expanded', 'true');
        drawer.setAttribute('aria-hidden', 'false');
        drawer.classList.add('open');
        backdrop.classList.add('open');
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
        drawerClose.focus();
    }

    function closeMenu() {
        hamburger.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
        hamburger.focus();
    }

    hamburger.addEventListener('click', openMenu);
    drawerClose.addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);
    drawer.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.classList.contains('open')) closeMenu();
    });

    /* ── Huecos de foto ─────────────────────────────────
       Si el archivo de data-src existe, sustituye al
       marcador; si no, el marcador sigue visible.        */

    document.querySelectorAll('.d-foto[data-src]').forEach(function (box) {
        var img = new Image();
        img.alt      = box.getAttribute('data-alt') || '';
        img.decoding = 'async';
        img.onload   = function () {
            box.appendChild(img);
            box.classList.add('has-img');
        };
        img.src = box.getAttribute('data-src');
    });

})();
