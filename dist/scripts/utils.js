function checkUser() {

    "use strict";

    let url = new URL(window.location.href);

    let firstName = url.searchParams.get('firstname');
    let lastName = url.searchParams.get('lastname');
    let email = url.searchParams.get('email');

    return !!firstName || !!lastName || !!email;
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

export {checkUser,getLocationParam,madJunSaysOops};