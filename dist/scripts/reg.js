import {FormValidation} from "../../src/modules/validation.js";

document.addEventListener("DOMContentLoaded", () => {

    'use strict';

    const formValidation = new FormValidation("#form", formValidate);

    function formValidate(user) {

        this.reset();

        location.href = "select.html?firstname=" + user.firstname + "&lastname=" + user.lastname + "&email=" + user.email;

    }
});