function loadTest(test) {

    "use strict";

    if (test) {

        testDeploy.call(test);

    }
    else {
        location.href = "index.html";
    }
}
function testDeploy() {

    "use strict";

    let test = this;

    testSetCaption(test.name, test.id);

    testDeployProgressBar(test.questions.length);

    testDeployQuestion.call(test.questions, 0);

    testDeployPartyProcess.call(test);

    //console.log(test);

}
function testSetCaption(caption, testId) {
    "use strict";

    let testTitle = document.querySelector(".test-caption");

    testTitle.textContent = caption;
    testTitle.ariaLabel = `test ${testId}`;
}
function testDeployProgressBar(nodesNumber) {
    "use strict";

    let parentNode = document.querySelector(".test-progress-bar-wrapper");
    parentNode.firstElementChild.dataset.ariaLabel = "mad jun progressbar"

    for (let i = 0; i < nodesNumber; i++) {

        let node = document.createElement("div");
        node.classList.add("progress-bar-item", "flex", "items-center");
        node.dataset.nodeIndex = `${i}`;

        if (i === 0) {

            node.classList.add("is-next");
        }

        let circle = document.createElement("div");
        circle.classList.add("progress-bar-circle", "rounded-full");

        node.appendChild(circle);

        if (i < nodesNumber - 1) {

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

function testDeployQuestion(index) {
    "use strict";

    let questions = this;
    let currentQuestion = questions[index];

    let title = document.querySelector('.question-title');

    title.dataset.nodeId = `${index+1}`;
    title.firstElementChild.dataset.nodeId = `${currentQuestion.id}`;

    let span = document.createElement("span");
    span.classList.add("text-primary");
    span.textContent = currentQuestion.question;

    title.firstElementChild.textContent = `Вопрос ${index+1}: `;
    title.firstElementChild.appendChild(span);

    testDeployAnswers.call(currentQuestion.answers);
}

function testDeployAnswers() {
    "use strict";

    let parentNode = document.querySelector(".options-wrapper");

    for (let i = 0; i < this.length; ++i) {

        let option = this[i];

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
function testDeployPartyProcess() {
    "use strict";

    let test = this;
    let userResult = [];
    let timer = {
        timerId: 0,
        seconds: 60,
    }
    let timerCounter = document.querySelector(".timer-counter");

    let nextButtons = document.querySelectorAll(".app-button.next");

    nextButtons.forEach(button => {
        button.dataset.nodeIndex = '1';
        button.dataset.maxNodes = `${test.questions.length}`;
        button.addEventListener("click", nextButtonHandler);
    })

    let omitButton = document.querySelector(".omit-question");
    omitButton.dataset.nodeIndex = '1';
    omitButton.dataset.maxNodes = `${test.questions.length}`;
    omitButton.addEventListener("click", omitButtonHandler);

    timerCounter.textContent = `${timer.seconds}`;

    function testCheckMadJunResult() {

        //console.log(userResult);
        //console.log(test);

        let params = new URLSearchParams(document.location.search);
        let firstname = params.get("firstname");
        let lastname = params.get("lastname");
        let email = params.get("email");

        let body = JSON.stringify({

            name: firstname,
            lastName: lastname,
            email: email,
            results: userResult,
        });

        function processPostRequest() {

            if (this.readyState === 4 && this.status === 200) {

                let response = JSON.parse(this.responseText);
                // time to party!!!
                location.href = `result.html?id=${test.id}` + "&score=" + response.score + "&total=" + response.total;
                sessionStorage.setItem("madJunUser", JSON.stringify({
                    name: firstname,
                    lastName: lastname,
                    email: email,
                    results: userResult,
                }));

            }
            else {
                location.href = "index.html";
            }
        }

        makeHttpPostRequest(`https://testologia.ru/pass-quiz?id=${test.id}`, body, processPostRequest);

    }

    timer.timerId = setInterval(() => {

        if (timer.seconds < 10) {
            timerCounter.textContent = `0${timer.seconds}`;
        }
        else {
            timerCounter.textContent = `${timer.seconds}`;
        }

        if (--timer.seconds < 0) {

            testStopProcess(false);
        }

    }, 1000);

    function testStopProcess(bResult) {

        clearInterval(timer.timerId);
        timer.timerId = 0;
        testStop(bResult);
    }

    function nextButtonHandler(e) {

        e.preventDefault();

        let currentIndex = parseInt(e.target.dataset.nodeIndex);
        let maxNodes = parseInt(e.target.dataset.maxNodes);

        if (e.target.dataset.nodeType === "button-prev") {

            if (currentIndex === 1) {

                //location.href = "select.html?firstname=" + getLocationParam("firstname") + "&lastname=" + getLocationParam("lastname") + "&email=" + getLocationParam("email");
                madJunSaysOops(e.target, "Oops... :)");
            }
            else {
                testDeployNextQuestion.call(test.questions, currentIndex - 2);
                testRestoreOptions();
            }

        }
        else if (e.target.dataset.nodeType === "button-next") {

                if (currentIndex > maxNodes) {

                    testCheckMadJunResult();

                    return;
                }
                if (isOptionChecked() && timer.timerId !== 0) {

                    let result = {
                        questionId: 0,
                        chosenAnswerId: 0,
                    };

                    result.questionId = getCurrentQuestionId();
                    result.chosenAnswerId = getOptionValue();

                    testSave.call(userResult, result);

                    let curQuestionIndex = getCurrentQuestion();

                    testProgressBarSetCompletedItem(curQuestionIndex);

                    if (currentIndex === maxNodes && testIsCompleted()) {

                        e.target.textContent = "Проверить";
                        e.target.dataset.nodeIndex = `${currentIndex+1}`;
                        // Clean up
                        testStopProcess(true);
                    }
                    else if (currentIndex === maxNodes && !testIsCompleted()) {

                        madJunSaysOops(e.target, "Oops... :)");
                    }
                    else if (currentIndex < maxNodes) {

                        testDeployNextQuestion.call(test.questions, curQuestionIndex + 1);
                        testRestoreOptions();
                    }
                }
                else {

                    if (timer.timerId === 0) {
                        location.href = "index.html";
                    }
                    else {
                        madJunSaysOops(e.target, "Oops... :)");
                    }
                }
        }

    }

    function testRestoreOptions() {

        let currentQuestion = getCurrentQuestionId();

        if (userResult.length > 0) {

            for (let i = 0; i < userResult.length; i++) {

                if (userResult[i].questionId === currentQuestion) {

                    testSetOption(userResult[i].chosenAnswerId);

                }
            }
        }
    }

    function testStop(bResult) {

        testHideButtons();
        testHideOptions();
        testHideQuestion();

        if (bResult) {
            testShowSnackbar();
        }
        else {
            testShowSnackbarError();
        }
    }

    function omitButtonHandler(e) {

        e.preventDefault();

        if (!isOptionChecked()) {
            let currentIndex = parseInt(e.target.dataset.nodeIndex);
            let maxNodes = parseInt(e.target.dataset.maxNodes);

            if (currentIndex < maxNodes) {

                testDeployNextQuestion.call(test.questions, currentIndex);

            }
            else {
                madJunSaysOops(e.target, "Oops... :)");
            }
        }
        else {
            madJunSaysOops(e.target, "Oops... :)");
        }

    }
}
function testDeployNextQuestion(index) {
    "use strict";
    let questions = this;

    testProgressBarSetNextItem(index);

    testClearOptions();

    testDeployQuestion.call(questions, index);

    testSetNextButtonsIndex(index + 1);

    testSetOmitButtonIndex(index+1);
}

function testSetNextButtonsIndex(index) {
    "use strict";

    let nextButtons = document.querySelectorAll(".app-button.next");

    nextButtons[0].dataset.nodeIndex = `${index}`;
    nextButtons[1].dataset.nodeIndex = `${index}`;
}

function testSetOmitButtonIndex(index) {
    "use strict";

    let omit = document.querySelector(".omit-question");
    omit.dataset.nodeIndex = `${index}`;
}

function testClearOptions() {
    "use strict";

    let options = document.querySelectorAll(".radio-button-container");

    for (let i = 0; i < options.length; ++i) {
        options[i].remove();
    }
}

function testProgressBarSetNextItem(index) {
    "use strict";

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

function testProgressBarSetCompletedItem(index) {
    "use strict";

    let pBar = document.querySelector(".test-progress-bar");

    if (pBar.children[index].classList.contains("is-next")) {

        pBar.children[index].classList.remove("is-next");
        pBar.children[index].classList.add("is-active");
    }

}

function getOptionValue() {
    "use strict";

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

function isOptionChecked() {
    "use strict";

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
function getCurrentQuestionId() {

    "use strict";

    let question = document.querySelector(".question-title");

    return parseInt(question.firstElementChild.dataset.nodeId, 10);

}
function getCurrentQuestion() {

    "use strict";

    let question = document.querySelector(".question-title");
    let value = parseInt(question.dataset.nodeId, 10);
    --value;
    return value;
}
function testIsCompleted() {
    "use strict";

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
function testHideButtons() {

    "use strict";

    let prev = document.querySelector(".app-button.next[data-node-type='button-prev']");
    let omit = document.querySelector(".omit-question");

    prev.style.visibility = "hidden";
    omit.style.visibility = "hidden";
}
function testHideOptions() {
    "use strict";

    let options = document.querySelectorAll(".radio-button-container");

    for (let i = 0; i < options.length; ++i) {

        options[i].style.visibility = "hidden";
    }
}

function testHideQuestion() {
    "use strict";
    let question = document.querySelector(".question-title");

    question.firstElementChild.style.visibility = "hidden";
}

function testShowSnackbar() {
    "use strict";

    let snackbar = document.querySelector(".snackbar.snackbar-question");
    snackbar.classList.add("is-active");
}

function testShowSnackbarError() {
    "use strict";

    let snackbar = document.querySelector(".snackbar.snackbar-timeout");
    snackbar.classList.add("is-active");
}

function testSave(result) {
    "use strict";

    let userResults = this;

    if (userResults.length === 0) {

        userResults.push(result);
    }
    else {

        let ok = true;

        for (let i = 0; i < userResults.length; i++) {

            let curResult = userResults[i];

            if ( curResult.questionId === result.questionId) {

                curResult.chosenAnswerId = result.chosenAnswerId;
                ok = false;
                break;
            }
        }

        if (ok) {
            userResults.push(result);
        }
    }
}

function testSetOption(optionId) {
    "use strict";
    let options = document.querySelectorAll(".radio-button-input");

    for (let i = 0; i < options.length; ++i) {

        let value = parseInt(options[i].value);
        if (value === optionId) {
            options[i].checked = true;
        }
    }
}