import {FormValidation} from './modules/validation.js';
import {Select} from "./modules/selection.js";
import {QuizTest} from "./modules/quiztest.js";
import {QuizResult} from "./modules/quizresult.js";
import {ViewAnswer} from "./modules/viewanswers.js";
import {Auth} from "./scripts/auth.js";

export class Router {
    constructor() {
        this.logo = null;
        this.logout = null;
        this.routes = [
            {
                route: '#/',
                pageTitle: 'Itlogia Quiz',
                template: './templates/index.html',
                load: () => {

                }
            },
            {
                route: '#/signup',
                pageTitle: 'Sign Up',
                template: './templates/signup.html',
                load: () => {
                    new FormValidation('#form');
                }
            },
            {
                route: '#/login',
                pageTitle: 'Login',
                template: './templates/login.html',
                load: () => {
                    new FormValidation('#form');
                }
            },
            {
                route: '#/select',
                pageTitle: 'Test Select',
                template: './templates/select.html',
                load: () => {
                    new Select();
                }
            },
            {
                route: '#/test',
                pageTitle: 'Test',
                template: './templates/test.html',
                load: () => {
                    new QuizTest();
                }
            },
            {
                route: '#/result',
                pageTitle: 'Result',
                template: './templates/result.html',
                load: () => {
                    new QuizResult();
                }
            },
            {
                route: '#/view',
                pageTitle: 'Answers',
                template: './templates/view.html',
                load: () => {
                    new ViewAnswer();
                }
            },
            {
                route: '#/logout',
                pageTitle: "",
                template: "",
                load: () => {
                    Auth.logoutManager();
                }
            },
        ];
    }

    controller(route) {

        if (this.logo === null) {
            this.logo = document.querySelector("a.logo");
        }
        if (this.logout === null) {
            this.logout = document.querySelector("#logout-link");
        }
        switch (route.route) {
            case '#/test':
                this.logo.addEventListener('click', this.#preventDefault, false);
                this.logout.addEventListener('click', this.#preventDefault, false);
                break;
            default:
                this.logo.removeEventListener('click', this.#preventDefault, false);
                this.logout.removeEventListener('click', this.#preventDefault, false);
        }
    }
    async openRoute() {

        const route = this.routes.find(routeItem => {

            return routeItem.route === window.location.hash.split('?')[0];
        });
        if (!route) {
            location.href = '#/';
        }
        else if (Auth.accountManager(route)) {

            document.querySelector(".main-content-wrapper").innerHTML = await fetch(route.template)
                    .then(response => response.text());

            document.querySelector("#page-title").textContent = route.pageTitle;

            this.controller(route);
            route.load();
        }
    }
    #preventDefault(e) {
        e.preventDefault();
    }
}