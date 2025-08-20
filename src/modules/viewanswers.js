import {Auth} from "../scripts/auth.js";
import config from "../scripts/config.js";
import {HttpRequest} from "../scripts/validation.utils";

export class ViewAnswer {

    constructor() {

        this.refreshRequestUrl = config.host + "/refresh";
        this.accessToken = Auth.getAccessToken();
        this.refreshToken = Auth.getRefreshToken();
        this.header = {
            name: "x-access-token",
            value: this.accessToken,
        };
        this.refBody = {
            refreshToken: this.refreshToken,
        };
        this.errMessage = "Oops, something went wrong!";
        this.testResponse = null;
        this.test = null;
        this.userData = [];

        let storage = sessionStorage.getItem("madJunUser");

        if (storage) {
            this.userData = JSON.parse(storage);
            this.resultRequestUrl = config.host + "/tests/" + this.userData.testId + "/result/details?userId=" + Auth.userInfo.userId;
            //console.log(this.userData.results);
            this.#init();
        }
        else {
            location.href = "#/";
        }
    }

    async #init() {


            try {
                this.testResponse = await HttpRequest.sendRequest(this.resultRequestUrl,"GET",null, this.header);

                if (this.testResponse) {
                    this.test = this.testResponse.test;
                    this.#loadAnswers();
                }
                else {
                    throw new TypeError(this.errMessage);
                }
            }
            catch (e) {
                if (e.message === "jwt expired") {

                    try {

                        const result = await HttpRequest.sendRequest(this.refreshRequestUrl,"POST", this.refBody);

                        if (result.error || !result.accessToken) {
                            throw new TypeError(this.errMessage);
                        }
                        this.header.value = result.accessToken;
                        this.accessToken = result.accessToken;
                        this.refreshToken = result.refreshToken;

                        Auth.clearAccessTokens();
                        Auth.setTokens(this.accessToken, this.refreshToken);

                        this.testResponse = await HttpRequest.sendRequest(this.resultRequestUrl,"GET",null, this.header);

                        if (this.testResponse) {
                            this.test = this.testResponse.test;
                            this.#loadAnswers();
                        }
                        else {
                            throw new TypeError(this.errMessage);
                        }
                    }
                    catch (e) {
                        console.error(e.message);
                        location.href = "#/";
                    }
                }
                else {
                    console.log(e.message);
                    location.href = "#/";
                }
            }
    }

    #backToResult(e) {
        e.preventDefault();
        location.href = "#/result";
    }

    #loadAnswers() {

        document.querySelector('.view-test-name').textContent = this.test.name;
        document.querySelector('.mad-jun-user-info').textContent = Auth.userInfo.name + " " + Auth.userInfo.lastName + ", " + Auth.userInfo.email;
        document.querySelector('.back-to-result').addEventListener('click', this.#backToResult.bind(this));

        this.#deployAnswers();
    }

    #deployAnswers() {

        let parentNode = document.querySelector('.answers-wrapper');

        for (let i = 0; i < this.test.questions.length; i++) {

            this.#deployAnswer(parentNode, this.test.questions[i], i + 1);
        }
    }

    #deployAnswer(parentNode, question, questionNumber) {

        let answerItem = document.createElement("div");
        answerItem.classList.add("view-answer-item");

        //Question text
        let div = document.createElement("div");

        let h3 = document.createElement("h3");
        h3.classList.add("h3", "text-accent");
        h3.textContent = `Вопрос ${questionNumber}: `;

        let span = document.createElement("span");
        span.classList.add("text-primary");
        span.textContent = question.question;

        h3.appendChild(span);
        div.appendChild(h3);

        answerItem.appendChild(div);

        //Answer List
        let answerList = document.createElement("div");
        answerList.classList.add("answers-list");

        for (let i = 0; i < question.answers.length; ++i) {

            let answerOption = document.createElement("div");
            answerOption.classList.add("answer-option");

            let answerIcon = document.createElement("div");
            answerIcon.classList.add("answer-option-icon");

            let text = document.createElement("div");
            text.classList.add("text-size-medium");
            text.textContent = question.answers[i].answer;

            let userAnswerId = this.#getUserAnswerId(question.id);

            if (userAnswerId === question.answers[i].id) {

                if (question.answers[i].correct) {

                    answerOption.classList.add("valid");
                    answerIcon.classList.add("valid");
                }
                else {
                    answerOption.classList.add("invalid");
                    answerIcon.classList.add("invalid");
                }
            }

            answerOption.appendChild(answerIcon);
            answerOption.appendChild(text);

            answerList.appendChild(answerOption);
        }

        answerItem.appendChild(answerList);
        parentNode.appendChild(answerItem);
    }
    #getUserAnswerId(questionId) {
        let answer = this.userData.results.find(element => element.questionId === questionId);
        if (answer) {
            return answer.chosenAnswerId;
        }
        return null;
    }
}