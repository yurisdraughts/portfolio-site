import { enableDarkmode, disableDarkmode, toggleDarkmode } from './modules/darkMode.js';
import { toggleHeaderNav } from './modules/headerNav.js';
import { Game } from './modules/game.js';
import { createApp } from 'https://unpkg.com/vue@3.2.45/dist/vue.esm-browser.prod.js'

// Darkmode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (e.matches) enableDarkmode();
});

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    if (e.matches) disableDarkmode();
});

document.querySelector('.header__dark-mode-toggle').addEventListener('click', toggleDarkmode);

// Mobile header navigation
document.querySelector('.header__nav-list-toggle').addEventListener('click', toggleHeaderNav);

document.addEventListener('click', event => {
    if (
        document.querySelector('.header__nav').dataset.open === 'true'
        && !document.querySelector('.header__nav-list-toggle').contains(event.target)
    ) {
        toggleHeaderNav();
    };
});

// Send message
const popup = document.querySelector('.message-sent_success');
const errorPopup = document.querySelector('.message-sent_error');
const background = document.querySelector('.message-sent__background');

document.querySelector('.contact__form').addEventListener('submit', function (event) {
    event.preventDefault();

    emailjs.sendForm('service_r185bav', 'template_0tz4rrn', this)
        .then(() => {
            this.querySelectorAll('.form__element_input').forEach(element => {
                element.value = '';
            });

            popup.classList.remove('display-none');
        })
        .catch((error) => {
            console.log('EmailJS Error: ', error);

            errorPopup.classList.remove('display-none');
        });

        background.classList.remove('display-none');
});

document.addEventListener('click', event => {
    if (!popup.classList.contains('display-none') && event.target !== popup) {
        popup.classList.add('display-none');
        background.classList.add('display-none');
    }
});

// Tic tac toe game
createApp({
    data() {
        return new Game();
    },
    computed: {
        showMessage() {
            return this.inProgress ? '' : 'game__board_show-message';
        },
        whoseTurn() {
            return this.playersTurn ? 'game_x' : 'game_circle';
        },
    },
    methods: {
        value(square) {
            if (square.value === Game.playerMark) return 'game__cell_x';
            else if (square.value === Game.programMark) return 'game__cell_circle';
            else return '';
        }
    }
}).mount('#game');

