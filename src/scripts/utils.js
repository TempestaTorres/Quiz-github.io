function checkUser() {

    "use strict";

    let params = queryUrlparams();

    return !!params.firstname || !!params.lastName || !!params.email;
}
function queryUrlparams() {

    const queryParams = document.location.hash.split('+').join(' ');

    let params = {},
        tokens,
        regExp = /[?&]([^=]+)=([^&]*)/g;

    while (tokens = regExp.exec(queryParams)) {

        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}
function getLocationParam(paramName) {

    "use strict";

    let params = new URLSearchParams(document.location.search);

    return params.get(paramName);
}
function madJunSaysOops(sibling, oops) {
    "use strict";

    sibling.nextElementSibling.textContent = oops;
    sibling.nextElementSibling.classList.toggle("is-active");

    setTimeout(() => {
        sibling.nextElementSibling.classList.toggle("is-active");
    }, 1000);
}

export {checkUser,getLocationParam,madJunSaysOops, queryUrlparams};