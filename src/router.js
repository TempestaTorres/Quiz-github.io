import {FormValidation} from './modules/validation.js';
import {Select} from "./modules/selection.js";
import {QuizTest} from "./modules/quiztest.js";
import {QuizResult} from "./modules/quizresult.js";
import {ViewAnswer} from "./modules/viewanswers.js";
import {setUserAccountState} from "./scripts/utils.js";

export class Router {
    constructor() {

        this.routes = [
            {
                route: '#/',
                pageTitle: 'Itlogia Quiz',
                template: './templates/index.html',
                load: () => {
                    setUserAccountState(false);
                }
            },
            {
                route: '#/signup',
                pageTitle: 'Sign Up',
                template: './templates/signup.html',
                load: () => {

                    setUserAccountState(false);
                    new FormValidation('#form');
                }
            },
            {
                route: '#/login',
                pageTitle: 'Login',
                template: './templates/login.html',
                load: () => {

                    setUserAccountState(false);
                    new FormValidation('#form');
                }
            },
            {
                route: '#/select',
                pageTitle: 'Test Select',
                template: './templates/select.html',
                load: () => {

                    setUserAccountState(true);
                    new Select();
                }
            },
            {
                route: '#/test',
                pageTitle: 'Test',
                template: './templates/test.html',
                load: () => {

                    setUserAccountState(true);
                    new QuizTest();
                }
            },
            {
                route: '#/result',
                pageTitle: 'Result',
                template: './templates/result.html',
                load: () => {

                    setUserAccountState(true);
                    new QuizResult();
                }
            },
            {
                route: '#/view',
                pageTitle: 'Answers',
                template: './templates/view.html',
                load: () => {

                    setUserAccountState(true);
                    new ViewAnswer();
                }
            },
        ];
    }

    async openRoute() {

        const route = this.routes.find(routeItem => {

            return routeItem.route === window.location.hash.split('?')[0];
        });

        if (route) {

            document.querySelector(".main-content-wrapper").innerHTML = await fetch(route.template)
                .then(response => response.text());

            document.querySelector("#page-title").textContent = route.pageTitle;

            route.load();

        } else {
            location.href = '#/';
        }

    }
}