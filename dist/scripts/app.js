function checkUser() {

    "use strict";

    let url = new URL(window.location.href);

    let firstName = url.searchParams.get('firstname');
    let lastName = url.searchParams.get('lastname');
    let email = url.searchParams.get('email');

    return !!firstName || !!lastName || !!email;
}