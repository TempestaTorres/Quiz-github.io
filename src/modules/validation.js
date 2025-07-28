export class FormValidation {

    constructor(form) {
        this.emailRegExp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        this.nameRegExp = /^[A-Z][a-zA-Z]+\s*$/;
        this.valid = false;
        this.form = document.querySelector(form);

        if(this.form) {
            this.inputs = this.form.querySelectorAll('input');
        }

        if (this.inputs) {

            for (let i = 0; i < this.inputs.length; i++) {

                const input = this.inputs[i];

                if (input.type === 'checkbox') {
                    input.addEventListener("click", this.#handleCheckbox.bind(this));
                    continue;
                }
                input.addEventListener("input", this.#handleInput.bind(this));
            }

            this.form.addEventListener("submit", this.#handleValidate.bind(this));
        }
    }

    #handleValidate(event) {
        event.preventDefault();

        if (this.form.checkValidity() && this.valid) {

            let user = {
                firstname: "",
                lastname: "",
                email: "",
            }

            for (let i = 0; i < this.inputs.length; i++) {

                const input = this.inputs[i];

                if (input.name === 'firstname') {
                    user.firstname = input.value.trim();
                }
                if (input.name === 'lastname') {
                    user.lastname = input.value.trim();
                }
                if (input.type === 'email') {
                    user.email = input.value.trim();
                }

            }

            this.form.reset();

            location.href = "#/select?firstname=" + user.firstname + "&lastname=" + user.lastname + "&email=" + user.email;
        }
    }

    #handleInput(event){

        switch (event.target.name) {
            case 'firstname':
                this.#handleInputName(event.target);
                break;
            case 'lastname':
                this.#handleInputName(event.target);
                break;
            case 'email':
                this.#handleInputUserEmail(event.target);
                break;
        }
    }

    #isValidName(name) {
        return name.value.length > 1 && this.nameRegExp.test(name.value);
    }

    #handleInputName(target){

        this.valid = this.#isValidName(target);

        if (this.valid) {
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
    }

    #handleInputUserEmail(target) {

        this.valid = this.#isValidEmail(target);

        if (this.valid) {
            target.nextElementSibling.nextElementSibling.textContent = '';
            target.setCustomValidity('');
        }
        else {
            target.nextElementSibling.nextElementSibling.textContent = 'Please enter a valid email address';
            target.setCustomValidity('invalid');
        }
    }

    #isValidEmail(target) {
        return target.value.length > 6 && this.emailRegExp.test(target.value);
    }

    #handleCheckbox(e) {

        this.valid = e.target.checked;

        if (this.valid) {
            e.target.parentElement.nextElementSibling.textContent = '';
            e.target.setCustomValidity('');
        }
        else {
            e.target.parentElement.nextElementSibling.textContent = 'Please check the box';
            e.target.setCustomValidity('invalid');
        }

    }
}