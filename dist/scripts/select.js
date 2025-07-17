document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    (function() {

        if (!checkUser()) {
            location.href = "index.html";
        }

        function processRequest(e) {

            if (this.readyState === 4 && this.status === 200) {

                // time to party!!!
                loadTests(JSON.parse(this.responseText), eventHandler);

            }
            else {
                location.href = "index.html";
            }

        }
        makeHttpGetRequest("https://testologia.ru/get-quizzes", processRequest);

    })();

    function eventHandler(e) {

        if (e.target.parentElement.dataset.nodeType === "test-button") {
            e.preventDefault();

            let dataId = e.target.parentElement.dataset.nodeData;

            location.href = "test.html" + location.search + "&id=" + dataId;

            e.stopPropagation();
        }
    }
});