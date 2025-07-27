
export class QuizResult {

    constructor() {

        let params = new URLSearchParams(document.location.search);

        this.id = params.get("id");
        this.score = params.get("score");
        this.total = params.get("total");
        this.data = [];

        let storageItem = sessionStorage.getItem("madJunUser");

        if (storageItem) {
            this.data = JSON.parse(storageItem);
        }
        else {
            location.href = "index.html";
        }
    }
    Init() {

        document.querySelector(".user-answers-number").textContent = `${this.score}/${this.total}`;

        document.querySelector(".back-to-selection").addEventListener("click", this.#backToSelection.bind(this));

        document.querySelector(".view-answers").addEventListener("click", this.#viewAnswers.bind(this));
    }

    #backToSelection(e) {

        e.preventDefault();

        sessionStorage.removeItem("madJunUser");
        location.href = "select.html?firstname=" + this.data.name + "&lastname=" + this.data.lastName + "&email=" + this.data.email;
    }

    #viewAnswers(e) {
        e.preventDefault();

        location.href = "view.html?score=" + this.score + "&total=" + this.total + "&id=" + this.id;
    }
}