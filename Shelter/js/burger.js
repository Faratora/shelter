document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.header__nav');
    const overlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.header-nav__link');

    function closeMenu() {
        burger.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.position = '';
        document.body.style.top = '';
        if (overlay) overlay.classList.remove('active');
    }

    function openMenu() {
        const scrollTop = window.scrollY;
        burger.classList.add('active');
        nav.classList.add('active');
        document.body.classList.add('menu-open');
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollTop}px`;
        document.body.style.left = '0';
        document.body.style.width = '100%';
        if (overlay) overlay.classList.add('active');
    }

    if (burger && nav) {
        burger.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});
