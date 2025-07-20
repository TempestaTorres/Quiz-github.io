document.addEventListener("DOMContentLoaded", () => {

   "use strict";
    (function () {

        let params = new URLSearchParams(document.location.search);
        let id = params.get("id");
        let score = params.get("score");
        let total = params.get("total");
        let storageItem = sessionStorage.getItem("madJunUser");
        let arr = [];

        if (storageItem) {
            arr = JSON.parse(storageItem);
        }

        document.querySelector(".user-answers-number").textContent = `${score}/${total}`;

        document.querySelector(".back-to-selection").addEventListener("click", (e) => {
            e.preventDefault();

            if (arr) {
                sessionStorage.removeItem("madJunUser");
                location.href = "select.html?firstname=" + arr.name + "&lastname=" + arr.lastName + "&email=" + arr.email;
            }
        });

        document.querySelector(".view-answers").addEventListener("click", (e) => {
            e.preventDefault();

            location.href = "view.html?score=" + score + "&total=" + total + "&id=" + id;

        });

    })();
});