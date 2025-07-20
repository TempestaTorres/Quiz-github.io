document.addEventListener('DOMContentLoaded', () => {

    "use strict";

    (function() {

        let params = new URLSearchParams(document.location.search);
        let id = parseInt(params.get("id"), 10);
        let testResponse = null;
        let answersResponse = null;

        if (!isNaN(id)) {

            function processRequest(e) {

                if (this.readyState === 4 && this.status === 200) {

                    // time to party!!!
                    testResponse = JSON.parse(this.responseText);

                    if (testResponse) {

                        let xhr = new XMLHttpRequest();

                        xhr.open("GET", `https://testologia.ru/get-quiz-right?id=${id}`, false);
                        xhr.send();

                        if (xhr.readyState === 4 && xhr.status === 200) {

                            answersResponse = JSON.parse(xhr.responseText);

                            loadAnswers.call(testResponse, answersResponse);

                            document.querySelector('.back-to-result').addEventListener('click', () => {

                                location.href = `result.html?id=${id}` + "&score=" + params.get("score") + "&total=" + params.get("total");
                            });
                        }
                        else {
                            location.href = "index.html";
                        }
                    }
                    else {
                        location.href = "index.html";
                    }
                }
                else {
                    location.href = "index.html";
                }
            }

            makeHttpGetRequest(`https://testologia.ru/get-quiz?id=${id}`, processRequest);
        }
        else {
            location.href = "index.html";
        }

    })();
});