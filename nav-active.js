(function () {
    var path = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(function (a) {
        var href = a.getAttribute('href');
        if (href === '/club#experiencia') {
            if (path.startsWith('/club/experiencia')) a.classList.add('active');
        } else if (href !== '/' && href !== '/club' && path.startsWith(href)) {
            a.classList.add('active');
        }
    });
})();
