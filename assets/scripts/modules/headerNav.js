export const toggleHeaderNav = () => {
    const headerNav = document.querySelector('.header__nav');
    const toggleIcon = document.querySelector('.header__nav-list-toggle i');
    if (headerNav.dataset.open === 'true') {
        headerNav.dataset.open = 'false';

        toggleIcon.classList.remove('fa-xmark');
        toggleIcon.classList.add('fa-bars');

    } else {
        headerNav.dataset.open = 'true';

        toggleIcon.classList.remove('fa-bars');
        toggleIcon.classList.add('fa-xmark');
    }
}