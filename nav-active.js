(function () {
    var path = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(function (a) {
        var href = a.getAttribute('href');
        if (href === '/#experiencia') {
            if (path.startsWith('/experiencia')) a.classList.add('active');
        } else if (href !== '/' && path.startsWith(href)) {
            a.classList.add('active');
        }
    });
})();
