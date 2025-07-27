import {checkUser, getLocationParam, madJunSaysOops} from "../../dist/scripts/utils.js";

export class QuizTest {

    constructor() {

        this.test = null;

        if (!checkUser()) {
            location.href = "index.html";
        }

        this.testId = parseInt(getLocationParam("id"), 10);

        if (isNaN(this.testId)) {
            location.href = "index.html";
        }

        this.userResult = [];
        this.timer = {
            timerId: 0,
            seconds: 60,
        }
        this.timerCounter = document.querySelector(".timer-counter");
    }

    Init() {

        let xhr = new XMLHttpRequest();

        xhr.open("GET", `https://testologia.ru/get-quiz?id=${this.testId}`, false);
        xhr.send();

        if (xhr.readyState === 4 && xhr.status === 200) {

            // time to party!!!

            try {
                this.test = JSON.parse(xhr.responseText);

                this.#testSetCaption();
                this.#testDeployProgressBar();
                this.#testDeployQuestion(0);
                this.#testDeployPartyProcess();
            }
            catch (e) {
                location.href = "index.html";
            }
        }
        else {
            location.href = "index.html";
        }
    }

    #testSetCaption() {

        let testTitle = document.querySelector(".test-caption");

        testTitle.textContent = this.test.name;
        testTitle.ariaLabel = `test ${this.test.id}`;
    }

    #testDeployProgressBar() {

        let parentNode = document.querySelector(".test-progress-bar-wrapper");
        parentNode.firstElementChild.dataset.ariaLabel = "mad jun progressbar"

        for (let i = 0; i < this.test.questions.length; i++) {

            let node = document.createElement("div");
            node.classList.add("progress-bar-item", "flex", "items-center");
            node.dataset.nodeIndex = `${i}`;

            if (i === 0) {

                node.classList.add("is-next");
            }

            let circle = document.createElement("div");
            circle.classList.add("progress-bar-circle", "rounded-full");

            node.appendChild(circle);

            if (i < this.test.questions.length - 1) {

                let line = document.createElement("div");
                line.classList.add("progress-bar-line", "transition-400");

                node.appendChild(line);
            }

            parentNode.firstElementChild.appendChild(node);

            // Question number
            let nodeQuestion = document.createElement("div");
            nodeQuestion.classList.add("text-size-progress-bar");
            nodeQuestion.textContent = `Вопрос ${i+1}`;

            parentNode.lastElementChild.appendChild(nodeQuestion);
        }
    }

    #testDeployQuestion(index) {

        let currentQuestion = this.test.questions[index];

        let title = document.querySelector('.question-title');

        title.dataset.nodeId = `${index+1}`;
        title.firstElementChild.dataset.nodeId = `${currentQuestion.id}`;

        let span = document.createElement("span");
        span.classList.add("text-primary");
        span.textContent = currentQuestion.question;

        title.firstElementChild.textContent = `Вопрос ${index+1}: `;
        title.firstElementChild.appendChild(span);

        this.#testDeployAnswers(currentQuestion.answers);
    }

    #testDeployAnswers(answers) {

        let parentNode = document.querySelector(".options-wrapper");

        for (let i = 0; i < answers.length; ++i) {

            let option = answers[i];

            let label = document.createElement("label");
            label.classList.add("radio-button-container", "text-size-medium");
            label.textContent = option.answer;

            let input = document.createElement("input");
            input.classList.add("radio-button-input");
            input.type = "radio";
            input.name = "radio";
            input.value = `${option.id}`;
            input.id = `answer-${i+1}`;

            let span = document.createElement("span");
            span.classList.add("radio-button-checkmark");

            label.appendChild(input);
            label.appendChild(span);
            parentNode.appendChild(label);
        }
    }

    #testDeployPartyProcess() {

        this.timerCounter.textContent = `${this.timer.seconds}`;

        let nextButtons = document.querySelectorAll(".app-button.next");

        nextButtons.forEach(button => {
            button.dataset.nodeIndex = '1';
            button.dataset.maxNodes = `${this.test.questions.length}`;
            button.addEventListener("click", this.#nextButtonHandler.bind(this));
        });

        let omitButton = document.querySelector(".omit-question");
        omitButton.dataset.nodeIndex = '1';
        omitButton.dataset.maxNodes = `${this.test.questions.length}`;
        omitButton.addEventListener("click", this.#omitButtonHandler.bind(this));

        this.timer.timerId = setInterval(this.#timerCounter.bind(this), 1000);

    }

    #timerCounter() {

        if (this.timer.seconds < 10) {
            this.timerCounter.textContent = `0${this.timer.seconds}`;
        }
        else {
            this.timerCounter.textContent = `${this.timer.seconds}`;
        }

        if (--this.timer.seconds < 0) {

            this.#testStopProcess(false);
        }
    }

    #testCheckMadJunResult() {

        let params = new URLSearchParams(document.location.search);
        let firstname = params.get("firstname");
        let lastname = params.get("lastname");
        let email = params.get("email");

        let body = JSON.stringify({

            name: firstname,
            lastName: lastname,
            email: email,
            results: this.userResult,
        });

        let xhr = new XMLHttpRequest();
        xhr.open("POST", `https://testologia.ru/pass-quiz?id=${this.test.id}`, false);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        xhr.send(body);

        if (xhr.readyState === 4 && xhr.status === 200) {

            try {

                let response = JSON.parse(xhr.responseText);
                // time to party!!!
                location.href = `result.html?id=${this.test.id}` + "&score=" + response.score + "&total=" + response.total;
                sessionStorage.setItem("madJunUser", JSON.stringify({
                    name: firstname,
                    lastName: lastname,
                    email: email,
                    results: this.userResult,
                }));
            }
            catch (e) {
                console.error(e);
                location.href = "index.html";
            }
        }
    }

    #nextButtonHandler(e) {

        e.preventDefault();

        let currentIndex = parseInt(e.target.dataset.nodeIndex);
        let maxNodes = parseInt(e.target.dataset.maxNodes);

        if (e.target.dataset.nodeType === "button-prev") {

            if (currentIndex === 1) {

                madJunSaysOops(e.target, "Oops... :)");
            }
            else {
                this.#testDeployNextQuestion(currentIndex - 2);
                this.#testRestoreOptions();
            }

        }
        else if (e.target.dataset.nodeType === "button-next") {

            if (currentIndex > maxNodes) {

                this.#testCheckMadJunResult();

                return;
            }
            if (this.#isOptionChecked() && this.timer.timerId !== 0) {

                let result = {
                    questionId: 0,
                    chosenAnswerId: 0,
                };

                result.questionId = this.#getCurrentQuestionId();
                result.chosenAnswerId = this.#getOptionValue();

                this.#testSave(result);

                let curQuestionIndex = this.#getCurrentQuestion();

                this.#testProgressBarSetCompletedItem(curQuestionIndex);

                if (currentIndex === maxNodes && this.#testIsCompleted()) {

                    e.target.textContent = "Проверить";
                    e.target.dataset.nodeIndex = `${currentIndex+1}`;
                    // Clean up
                    this.#testStopProcess(true);
                }
                else if (currentIndex === maxNodes && !this.#testIsCompleted()) {

                    madJunSaysOops(e.target, "Oops... :)");
                }
                else if (currentIndex < maxNodes) {

                    this.#testDeployNextQuestion(curQuestionIndex + 1);
                    this.#testRestoreOptions();
                }
            }
            else {

                madJunSaysOops(e.target, "Oops... :)");
            }
        }
    }

    #omitButtonHandler(e) {

        e.preventDefault();

        if (!this.#isOptionChecked()) {

            let currentIndex = parseInt(e.target.dataset.nodeIndex);
            let maxNodes = parseInt(e.target.dataset.maxNodes);

            if (currentIndex < maxNodes) {

                this.#testDeployNextQuestion(currentIndex);

            }
            else {
                madJunSaysOops(e.target, "Oops... :)");
            }
        }
        else {
            madJunSaysOops(e.target, "Oops... :)");
        }
    }

    #testDeployNextQuestion(index) {

        this.#testProgressBarSetNextItem(index);

        this.#testClearOptions();

        this.#testDeployQuestion(index);

        this.#testSetNextButtonsIndex(index + 1);

        this.#testSetOmitButtonIndex(index+1);
    }

    #testSetOmitButtonIndex(index) {

        let omit = document.querySelector(".omit-question");
        omit.dataset.nodeIndex = `${index}`;
    }

    #testSetNextButtonsIndex(index) {

        let nextButtons = document.querySelectorAll(".app-button.next");

        nextButtons[0].dataset.nodeIndex = `${index}`;
        nextButtons[1].dataset.nodeIndex = `${index}`;
    }

    #testClearOptions() {

        let options = document.querySelectorAll(".radio-button-container");

        for (let i = 0; i < options.length; ++i) {
            options[i].remove();
        }
    }

    #testProgressBarSetNextItem(index) {

        let pBar = document.querySelector(".test-progress-bar");

        for (let i = 0; i < pBar.children.length; ++i) {

            if (pBar.children[i].classList.contains("is-next")) {
                pBar.children[i].classList.remove("is-next");
            }
        }

        if (!pBar.children[index].classList.contains("is-active")) {

            pBar.children[index].classList.add("is-next");
        }
    }

    #testProgressBarSetCompletedItem(index) {

        let pBar = document.querySelector(".test-progress-bar");

        if (pBar.children[index].classList.contains("is-next")) {

            pBar.children[index].classList.remove("is-next");
            pBar.children[index].classList.add("is-active");
        }
    }

    #isOptionChecked() {

        let result = false;
        let optionsNodes = document.querySelectorAll(".radio-button-input");

        for (let i = 0; i < optionsNodes.length; ++i) {
            if (optionsNodes[i].checked) {
                result = true;
                break;
            }
        }

        return result;
    }

    #getOptionValue() {

        let value = 0;

        let optionsNodes = document.querySelectorAll(".radio-button-input");

        for (let i = 0; i < optionsNodes.length; ++i) {
            if (optionsNodes[i].checked) {
                value = parseInt(optionsNodes[i].value, 10);
                break;
            }
        }
        return value;
    }

    #testRestoreOptions() {

        let currentQuestion = this.#getCurrentQuestionId();

        if (this.userResult.length > 0) {

            for (let i = 0; i < this.userResult.length; i++) {

                if (this.userResult[i].questionId === currentQuestion) {

                    this.#testSetOption(this.userResult[i].chosenAnswerId);

                }
            }
        }
    }

    #testSetOption(optionId) {

        let options = document.querySelectorAll(".radio-button-input");

        for (let i = 0; i < options.length; ++i) {

            let value = parseInt(options[i].value);
            if (value === optionId) {
                options[i].checked = true;
            }
        }
    }

    #getCurrentQuestionId() {

        let question = document.querySelector(".question-title");

        return parseInt(question.firstElementChild.dataset.nodeId, 10);

    }

    #getCurrentQuestion() {

        let question = document.querySelector(".question-title");
        let value = parseInt(question.dataset.nodeId, 10);
        --value;
        return value;
    }

    #testSave(result) {

        if (this.userResult.length === 0) {

            this.userResult.push(result);
        }
        else {

            let ok = true;

            for (let i = 0; i < this.userResult.length; i++) {

                let curResult = this.userResult[i];

                if ( curResult.questionId === result.questionId) {

                    curResult.chosenAnswerId = result.chosenAnswerId;
                    ok = false;
                    break;
                }
            }

            if (ok) {
                this.userResult.push(result);
            }
        }
    }

    #testIsCompleted() {

        let result = true;

        let items = document.querySelectorAll(".progress-bar-item");

        for (let i = 0; i < items.length; ++i) {

            if (!items[i].classList.contains("is-active")) {

                result = false;
                break;
            }
        }
        return result;
    }

    #testStopProcess(bResult) {

        clearInterval(this.timer.timerId);
        this.timer.timerId = 0;
        this.#testStop(bResult);
    }

    #testStop(bResult) {

        this.#testHideButtons();
        this.#testHideOptions();
        this.#testHideQuestion();

        if (bResult) {
            this.#testShowSnackbar();
        }
        else {
            this.#testShowSnackbarError();
        }
    }

    #testHideButtons() {

        let prev = document.querySelector(".app-button.next[data-node-type='button-prev']");
        let omit = document.querySelector(".omit-question");

        prev.style.visibility = "hidden";
        omit.style.visibility = "hidden";
    }

    #testHideOptions() {

        let options = document.querySelectorAll(".radio-button-container");

        for (let i = 0; i < options.length; ++i) {

            options[i].style.visibility = "hidden";
        }
    }

    #testHideQuestion() {

        let question = document.querySelector(".question-title");

        question.firstElementChild.style.visibility = "hidden";
    }

    #testShowSnackbar() {

        let snackbar = document.querySelector(".snackbar.snackbar-question");
        snackbar.classList.add("is-active");
    }

    #testShowSnackbarError() {

        let snackbar = document.querySelector(".snackbar.snackbar-timeout");
        snackbar.classList.add("is-active");
    }
}