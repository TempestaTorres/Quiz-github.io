import {queryUrlparams} from "../scripts/utils.js";

export class QuizResult {

    constructor() {

        let params = queryUrlparams();

        this.id = params.id;
        this.score = params.score;
        this.total = params.total;
        this.data = [];

        let storageItem = sessionStorage.getItem("madJunUser");

        if (storageItem) {
            this.data = JSON.parse(storageItem);

            document.querySelector(".user-answers-number").textContent = `${this.score}/${this.total}`;

            document.querySelector(".back-to-selection").addEventListener("click", this.#backToSelection.bind(this));

            document.querySelector(".view-answers").addEventListener("click", this.#viewAnswers.bind(this));
        }
        else {
            location.href = "#/";
        }
    }

    #backToSelection(e) {

        e.preventDefault();

        sessionStorage.removeItem("madJunUser");
        location.href = "#/select?firstname=" + this.data.name + "&lastname=" + this.data.lastName + "&email=" + this.data.email;
    }

    #viewAnswers(e) {
        e.preventDefault();

        location.href = "#/view?score=" + this.score + "&total=" + this.total + "&id=" + this.id;
    }
}