
function validateForm(callback) {
    'use strict';

    const emailRegExp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    const nameRegExp = /^[A-Z][a-zA-Z]+\s*$/;
    //const usernameRegExp = /^[a-zA-Z0-9_-]+\s*$/;
    //const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const form = document.querySelector("#form");
    const inputs = form.querySelectorAll('input');

    let valid = false;

    // Check if the name is valid
    const isValidName = (name) => {
        return name.value.length > 1 && nameRegExp.test(name.value);
    };
    const handleInputName = (target) => {

        valid = isValidName(target);

        if (valid) {
            target.nextElementSibling.nextElementSibling.textContent = '';
            target.setCustomValidity('');
        }
        else {
            if (target.value.length < 2) {
                target.nextElementSibling.nextElementSibling.textContent = 'Name must be at least 2 characters long';
            }
            else {
                target.nextElementSibling.nextElementSibling.textContent = 'First letter is capital';
                target.setCustomValidity('invalid');
            }
        }
    };

    // Check if the email is valid
    const isValidEmail = (target) => {
        return target.value.length > 6 && emailRegExp.test(target.value);
    };
    const handleInputUserEmail = (target) => {

        valid = isValidEmail(target);

        if (valid) {
            target.nextElementSibling.nextElementSibling.textContent = '';
            target.setCustomValidity('');
        }
        else {
            target.nextElementSibling.nextElementSibling.textContent = 'Please enter a valid email address';
            target.setCustomValidity('invalid');
        }
    };

    function handleCheckbox(e) {

        valid = e.target.checked;

        if (valid) {
            e.target.parentElement.nextElementSibling.textContent = '';
            e.target.setCustomValidity('');
        }
        else {
            e.target.parentElement.nextElementSibling.textContent = 'Please check the box';
            e.target.setCustomValidity('invalid');
        }

    }

    const handleInput = (event) => {

        switch (event.target.name) {
            case 'firstname':
                handleInputName(event.target);
                break;
            case 'lastname':
                handleInputName(event.target);
                break;
            case 'email':
                handleInputUserEmail(event.target);
                break;
        }
    };

    // Handle form submission
    function handleValidate(event) {
        event.preventDefault();

        if (form.checkValidity() && valid) {

            callback.call(form);

        }
    }
    // Form Entry point
    if (inputs) {

        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];

            if (input.type === 'checkbox') {
                input.addEventListener("click", handleCheckbox);
                continue;
            }
            input.addEventListener("input", handleInput);
        }
    }

    form.addEventListener("submit", handleValidate);
}