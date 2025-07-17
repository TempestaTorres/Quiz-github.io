document.addEventListener("DOMContentLoaded", () => {

    'use strict';

    function formValidate(user) {

        this.reset();

        location.href = "select.html?firstname=" + user.firstname + "&lastname=" + user.lastname + "&email=" + user.email;

    }

    // Entry point
    (function () {

        validateForm(formValidate);


    })();

});