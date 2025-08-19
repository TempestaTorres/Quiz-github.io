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
        let mJunInfo = localStorage.getItem("madJunUserInfo");

        if (mJunInfo) {
            let user = JSON.parse(mJunInfo);
            this.requestTestResults = config.host + "/tests/results?userId=" + user.userId;
        }

        this.#init();
    }

    async #init() {

        let result = null;

        try {
            result = await HttpRequest.sendRequest(this.requestUrl,"GET",null, this.header);
        }
        catch (e) {
            console.error(e.message);

            if (e.message === "jwt expired") {

                try {
                    const r = await HttpRequest.sendRequest(this.refreshRequestUrl,"POST", {
                        refreshToken: this.refreshToken,
                    });

                    if (r.error || !r.accessToken) {
                        throw new TypeError(this.errMessage);
                    }
                    this.header.value = r.accessToken;
                    this.accessToken = r.accessToken;
                    this.refreshToken = r.refreshToken;

                    Auth.clearAccessTokens();
                    Auth.setTokens(this.accessToken, this.refreshToken);

                    result = await HttpRequest.sendRequest(this.requestUrl,"GET",null, this.header);

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

        try {
            this.testResults = await HttpRequest.sendRequest(this.requestTestResults,"GET",null, this.header);
        }
        catch (e) {
            console.error(e.message);
        }

        // time to party!!!
        this.#loadTests(result);
    }
    #eventHandler(e) {

        e.preventDefault();

        if (e.target.dataset.nodeType === "test-button") {

            let dataId = e.target.dataset.nodeData;

            location.href = "#/test?id=" + dataId;

        }
        else {
            console.log(e.target);
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
        let testScore = {
            passed: "no",
            score: "0/0",
        };

        if (this.testResults && this.testResults.length > 0) {

            for (let i = 0; i < this.testResults.length; ++i) {

                if (this.testResults[i].testId === id) {
                    testScore.passed = "yes";
                    testScore.score = `${this.testResults[i].score}/${this.testResults[i].total}`;
                    break;
                }
            }
        }

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
        testButton.dataset.passed = testScore.passed;

        let img = document.createElement('img');
        img.classList.add('svg');
        img.src = './assets/img/arrow-right-thin.svg';
        img.loading = 'lazy';
        img.alt = "";

        testButton.appendChild(img);

        let userTestResult = document.createElement("div");
        userTestResult.classList.add('user-test-result', 'text-accent', 'text-size-tiny');


        let resultDiv = document.createElement("div");
        resultDiv.textContent = "Результат";

        let scoreDiv = document.createElement("div");
        scoreDiv.textContent = testScore.score;

        userTestResult.appendChild(resultDiv);
        userTestResult.appendChild(scoreDiv);

        testButton.appendChild(userTestResult);

        parentChildNode.appendChild(testName);
        parentChildNode.appendChild(testButton);

        parent.appendChild(parentChildNode);
    }
}