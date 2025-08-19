
export class QuizResult {

    constructor() {

        this.data = [];

        let storageItem = sessionStorage.getItem("madJunUser");

        if (storageItem) {
            this.data = JSON.parse(storageItem);
            this.scoreEl = document.querySelector(".user-answers-number");
            this.scoreEl.textContent = `${this.data.score}/${this.data.total}`;

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
        location.href = "#/select";
    }

    #viewAnswers(e) {
        e.preventDefault();

        //location.href = "#/view?score=" + this.score + "&total=" + this.total + "&id=" + this.id;
        location.href = "#/view";
    }
}