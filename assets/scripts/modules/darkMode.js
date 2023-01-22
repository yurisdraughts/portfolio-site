const toggleIcon = document.querySelector('.header__dark-mode-toggle i');

export const disableDarkmode = () => {
    document.body.dataset.darkmode = 'false';
    localStorage.setItem('darkMode', 'disabled');

    toggleIcon.classList.remove('fa-sun');
    toggleIcon.classList.add('fa-moon');
};

export const enableDarkmode = () => {
    document.body.dataset.darkmode = 'true';
    localStorage.setItem('darkMode', 'enabled');

    toggleIcon.classList.remove('fa-moon');
    toggleIcon.classList.add('fa-sun');
};

export const toggleDarkmode = () => {
    if (document.body.dataset.darkmode === 'true') {
        disableDarkmode();
    } else {
        enableDarkmode();
    }
};