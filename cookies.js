(function () {
    var GA_ID      = 'G-88T7H6RYPE';
    var STORE_KEY  = 'ezsencia_cookies';

    function loadGA() {
        if (window._gaLoaded) return;
        window._gaLoaded = true;
        var s   = document.createElement('script');
        s.src   = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        s.async = true;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_ID);
    }

    function hideBanner() {
        var b = document.getElementById('cookieBanner');
        if (!b) return;
        b.style.opacity   = '0';
        b.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(function () { b.style.display = 'none'; }, 400);
    }

    window.acceptCookies = function () {
        localStorage.setItem(STORE_KEY, 'accepted');
        hideBanner();
        loadGA();
    };

    window.declineCookies = function () {
        localStorage.setItem(STORE_KEY, 'declined');
        hideBanner();
    };

    function injectBanner() {
        var style = document.createElement('style');
        style.textContent = [
            '#cookieBanner{',
                'position:fixed;bottom:1.5rem;left:50%;',
                'transform:translateX(-50%);',
                'background:#1a1814;color:#f5f0e8;',
                'padding:1.2rem 1.8rem;',
                'display:flex;align-items:center;gap:2rem;',
                'z-index:9999;max-width:680px;width:calc(100% - 3rem);',
                'font-family:"Lato",sans-serif;font-size:0.78rem;line-height:1.6;',
                'box-shadow:0 8px 40px rgba(0,0,0,0.22);',
                'transition:opacity 0.4s,transform 0.4s;',
            '}',
            '#cookieBanner p{margin:0;flex:1;opacity:0.82;}',
            '.cookie-btns{display:flex;gap:0.8rem;flex-shrink:0;}',
            '.cookie-btn-decline{',
                'background:transparent;',
                'border:1px solid rgba(245,240,232,0.3);',
                'color:#f5f0e8;font-family:"Lato",sans-serif;',
                'font-size:0.62rem;letter-spacing:0.16em;text-transform:uppercase;',
                'padding:0.55rem 1rem;cursor:pointer;',
                'transition:border-color 0.3s;white-space:nowrap;',
            '}',
            '.cookie-btn-decline:hover{border-color:rgba(245,240,232,0.7);}',
            '.cookie-btn-accept{',
                'background:#9a7d4a;border:1px solid #9a7d4a;color:#f5f0e8;',
                'font-family:"Lato",sans-serif;',
                'font-size:0.62rem;letter-spacing:0.16em;text-transform:uppercase;',
                'padding:0.55rem 1.2rem;cursor:pointer;',
                'transition:opacity 0.3s;white-space:nowrap;',
            '}',
            '.cookie-btn-accept:hover{opacity:0.82;}',
            '@media(max-width:600px){',
                '#cookieBanner{flex-direction:column;gap:1.2rem;align-items:flex-start;}',
                '.cookie-btns{width:100%;}',
                '.cookie-btn-decline,.cookie-btn-accept{flex:1;text-align:center;}',
            '}'
        ].join('');
        document.head.appendChild(style);

        var banner = document.createElement('div');
        banner.id  = 'cookieBanner';
        banner.innerHTML =
            '<p>Usamos cookies anal&iacute;ticas para entender c&oacute;mo se usa la web y mejorarla.</p>' +
            '<div class="cookie-btns">' +
                '<button class="cookie-btn-decline" onclick="declineCookies()">Solo esenciales</button>' +
                '<button class="cookie-btn-accept"  onclick="acceptCookies()">Aceptar</button>' +
            '</div>';
        document.body.appendChild(banner);
    }

    var consent = localStorage.getItem(STORE_KEY);
    if (consent === 'accepted') {
        loadGA();
    } else if (!consent) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', injectBanner);
        } else {
            injectBanner();
        }
    }

})();
