document.addEventListener("DOMContentLoaded", function(e) {

    "use strict";

    (function() {

        if (!checkUser()) {
            location.href = "index.html";
        }

        let testId = parseInt(getLocationParam("id"), 10);

        if (!isNaN(testId)) {

            function processRequest(e) {

                if (this.readyState === 4 && this.status === 200) {

                    // time to party!!!
                    loadTest(JSON.parse(this.responseText));

                }
                else {
                    location.href = "index.html";
                }

            }
            makeHttpGetRequest(`https://testologia.ru/get-quiz?id=${testId}`, processRequest);
        }
        else {
            location.href = "index.html";
        }
    })();
});