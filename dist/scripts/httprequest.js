function makeHttpGetRequest(url, callback) {

    let xhr = new XMLHttpRequest();

    xhr.open("GET", url, false);
    xhr.send();
    xhr.onreadystatechange = callback.call(xhr);
}