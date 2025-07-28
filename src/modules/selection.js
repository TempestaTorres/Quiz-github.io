
import {checkUser, queryUrlparams} from "../scripts/utils.js";

export class Select {

    constructor() {

        if (!checkUser()) {
            location.href = "#/";
        }
        else {
            this.#init();
        }
    }

    #init() {

        let xhr = new XMLHttpRequest();

        xhr.open("GET", "https://testologia.ru/get-quizzes", false);
        xhr.send();

        if (xhr.readyState === 4 && xhr.status === 200) {

            // time to party!!!
            this.#loadTests(JSON.parse(xhr.responseText));

        }
        else {
            location.href = "#/";
        }
    }

    #eventHandler(e) {

        if (e.target.parentElement.dataset.nodeType === "test-button") {
            e.preventDefault();

            let dataId = e.target.parentElement.dataset.nodeData;
            let params = queryUrlparams();

            location.href = "#/test?firstname=" + params.firstname + "&lastname=" + params.lastname + "&email=" + params.email + "&id=" + dataId;

            e.stopPropagation();
        }
    }

    #loadTests(dataTests) {

        const parentNode = document.querySelector('.test-selection');

        if (dataTests && dataTests.length > 0) {

            for (const node of dataTests) {

                this.#loadTest(parentNode, node);
            }

            parentNode.addEventListener('click', this.#eventHandler);
        }
    }

    #loadTest(parent, child) {

        let {id, name} = child;

        let parentChildNode = document.createElement('div');
        parentChildNode.classList.add('select-wrapper');
        parentChildNode.dataset.nodeType = 'test';
        parentChildNode.dataset.nodeIndex = `${id}`;

        let testName = document.createElement('p');
        testName.classList.add("text-size-small", "font-600", "transition-color-300");
        testName.textContent = name;

        let testButton = document.createElement('a');
        testButton.classList.add("arrow-button");
        testButton.href = `#`;
        testButton.role = 'button';
        testButton.dataset.nodeType = 'test-button';
        testButton.dataset.nodeData = `${id}`;

        let img = document.createElement('img');
        img.classList.add('svg');
        img.src = './assets/img/arrow-right-thin.svg';
        img.loading = 'lazy';
        img.alt = "";

        testButton.appendChild(img);

        parentChildNode.appendChild(testName);
        parentChildNode.appendChild(testButton);

        parent.appendChild(parentChildNode);
    }
}