function loadAnswers(answers) {

    "use strict";

    if (answers) {

        answersTestDeploy.call(this, answers);
    }
    else {
        location.href = "index.html";
    }
}
function answersTestDeploy(answers) {
    "use strict";

    document.querySelector('.view-test-name').textContent = this.name;

    let storage = sessionStorage.getItem("madJunUser");
    let user = [];

    if (storage) {
        user = JSON.parse(storage);
        document.querySelector('.mad-jun-user-info').textContent = user.name + " " + user.lastName + ", " + user.email;
        deployAnswers.call(this.questions, answers, user.results);
    }
    else {
        location.href = "index.html";
    }
}

function deployAnswers(answers, userResult) {
    "use strict";

    let parentNode = document.querySelector('.answers-wrapper');

    for (let i = 0; i < this.length; i++) {

        deployAnswer.call(parentNode, this[i], i + 1, answers[i], userResult);
    }
}
function deployAnswer(question, questionNumber,rightAnswerId, userResult) {
    "use strict";

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

            if (isAnswerValid(question.id, rightAnswerId, userResult)) {

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


    this.appendChild(answerItem);
}
function isAnswerValid(questionId, rightAnswerId, userResult) {
    "use strict";

    let result = false;

    for (let i = 0; i < userResult.length; i++) {

        if (userResult[i].questionId === questionId && userResult[i].chosenAnswerId === rightAnswerId) {
            result = true;
            break;
        }
    }

    return result;
}