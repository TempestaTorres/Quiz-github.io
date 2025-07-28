import {queryUrlparams} from "../../dist/scripts/utils.js";

export class ViewAnswer {

    constructor() {

        let params = queryUrlparams();

        this.id = parseInt(params.id, 10);
        this.score = params.score;
        this.total = params.total;
        this.testResponse = null;
        this.answersResponse = null;
        this.user = [];

        if (isNaN(this.id)) {
            location.href = "#/";
        }
        else {
            this.#init();
        }
    }

    #init() {

        let xhr = new XMLHttpRequest();

        xhr.open("GET", `https://testologia.ru/get-quiz?id=${this.id}`, false);
        xhr.send();

        if (xhr.readyState === 4 && xhr.status === 200) {

            try {
                this.testResponse = JSON.parse(xhr.responseText);

                let xhr2 = new XMLHttpRequest();

                xhr2.open("GET", `https://testologia.ru/get-quiz-right?id=${this.id}`, false);
                xhr2.send();

                if (xhr2.readyState === 4 && xhr2.status === 200) {

                    this.answersResponse = JSON.parse(xhr2.responseText);

                    this.#loadAnswers();
                    document.querySelector('.back-to-result').addEventListener('click', this.#backToResult.bind(this));
                }

            }
            catch (e) {
                console.error(e);
                location.href = "index.html";
            }
        }
        else {
            location.href = "index.html";
        }
    }

    #backToResult(e) {
        e.preventDefault();

        location.href = `#/result?id=${this.id}` + "&score=" + `${this.score}` + "&total=" + `${this.total}`;
    }

    #loadAnswers() {

        document.querySelector('.view-test-name').textContent = this.testResponse.name;

        let storage = sessionStorage.getItem("madJunUser");

        if (storage) {

            this.user = JSON.parse(storage);

            document.querySelector('.mad-jun-user-info').textContent = this.user.name + " " + this.user.lastName + ", " + this.user.email;

            this.#deployAnswers();
        }
        else {
            location.href = "#/";
        }
    }

    #deployAnswers() {

        let parentNode = document.querySelector('.answers-wrapper');

        for (let i = 0; i < this.testResponse.questions.length; i++) {

            this.#deployAnswer(parentNode, this.testResponse.questions[i], i + 1, this.answersResponse[i]);
        }
    }

    #deployAnswer(parentNode, question, questionNumber,rightAnswerId) {

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

            if (question.answers[i].id === rightAnswerId) {

                if (this.#isAnswerValid(question.id, rightAnswerId)) {

                    answerOption.classList.add("valid");
                    answerIcon.classList.add("valid");
                }
            }
            else if (this.#isUserAnswer(question.id, question.answers[i].id)) {
                answerOption.classList.add("invalid");
                answerIcon.classList.add("invalid");
            }

            answerOption.appendChild(answerIcon);
            answerOption.appendChild(text);

            answerList.appendChild(answerOption);
        }

        answerItem.appendChild(answerList);
        parentNode.appendChild(answerItem);
    }

    #isUserAnswer(questionId, answerId) {

        let result = false;

        for (let i = 0; i < this.user.results.length; i++) {

            if (this.user.results[i].questionId === questionId && this.user.results[i].chosenAnswerId === answerId) {
                result = true;
                break;
            }
        }

        return result;
    }

    #isAnswerValid(questionId, rightAnswerId) {

        let result = false;

        for (let i = 0; i < this.user.results.length; i++) {

            if (this.user.results[i].questionId === questionId && this.user.results[i].chosenAnswerId === rightAnswerId) {
                result = true;
                break;
            }
        }

        return result;
    }
}