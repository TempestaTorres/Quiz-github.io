import {Auth} from "../scripts/auth.js";
import {HttpRequest} from "../scripts/validation.utils.js";
import config from "../scripts/config.js";

export class Select {

    constructor() {

        this.requestUrl = config.host + "/tests";
        this.refreshRequestUrl = config.host + "/refresh";
        this.accessToken = Auth.getAccessToken();
        this.refreshToken = Auth.getRefreshToken();
        this.header = {
            name: "x-access-token",
            value: this.accessToken,
        }
        this.errMessage = "Oops, something went wrong!";

        sessionStorage.removeItem("madJunUser");

        this.#init();
    }

    async #init() {

        try {
            const result = await HttpRequest.sendRequest(this.requestUrl,"GET",null, this.header);

            // time to party!!!
            this.#loadTests(result);
        }
        catch (e) {
            console.error(e.message);

            if (e.message === "jwt expired") {

                const body = {
                    refreshToken: this.refreshToken,
                };

                try {
                    const r = await HttpRequest.sendRequest(this.refreshRequestUrl,"POST",body);

                    if (r.error || !r.accessToken) {
                        throw new TypeError(this.errMessage);
                    }
                    this.header.value = r.accessToken;
                    this.accessToken = r.accessToken;
                    this.refreshToken = r.refreshToken;

                    Auth.clearAccessTokens();
                    Auth.setTokens(this.accessToken, this.refreshToken);

                    const r2 = await HttpRequest.sendRequest(this.requestUrl,"GET",null, this.header);

                    // time to party!!!
                    this.#loadTests(r2);

                }
                catch (e) {
                    console.error(e.message);
                    location.href = "#/";
                }
            }
            else {
                console.error(e.message);
                location.href = "#/";
            }
        }
    }

    #eventHandler(e) {

        if (e.target.parentElement.dataset.nodeType === "test-button") {
            e.preventDefault();

            let dataId = e.target.parentElement.dataset.nodeData;

            location.href = "#/test?id=" + dataId;

            e.stopPropagation();
        }
    }

    #loadTests(dataTests) {

        const parentNode = document.querySelector('.test-selection');

        if (dataTests && dataTests.length > 0) {

            for (const node of dataTests) {

                this.#loadTest(parentNode, node);
            }

            parentNode.addEventListener('click', this.#eventHandler.bind(this));
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