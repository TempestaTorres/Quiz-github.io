function makeHttpGetRequest(url, callback) {

    "use strict";

    let xhr = new XMLHttpRequest();

    xhr.open("GET", url, false);
    xhr.send();
    xhr.onreadystatechange = callback.call(xhr);
}
function makeHttpPostRequest(url, body, callback) {

    "use strict";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.send(body);
    xhr.onreadystatechange = callback.call(xhr);
}