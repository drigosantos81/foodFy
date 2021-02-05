// ==== RECIPES ====

// Adicionar campos em ingredientes
function addIngredient() {
    const ingredients = document.querySelector("#itemsIngredientes");
    const campoContainer = document.querySelectorAll("#ingrediente");

    // Clone do último campo preenchido
    const newCampo = campoContainer[campoContainer.length - 1].cloneNode(true);

    // Não adiciona novo input se o último estiver vazio
    if (newCampo.children[0].value == "") {
        return false;
    }

    // Deixa o novo input vazio
    newCampo.children[0].value = "";
    ingredients.appendChild(newCampo);

    const ingredientField = document.querySelectorAll('#ingredientField');
    for (let ingredient of ingredientField) {
        ingredient.focus();
    }
    
}

function removeIngredient() {
    const ingredients = document.querySelectorAll("#ingrediente");
    for (let ingredient of ingredients) {
        ingredient.addEventListener('click', function() {
            const campoContainer = ingredient.querySelector("#ingrediente");            
            ingredient.remove(campoContainer);
        });
    }
}

// Adicionar campos em prepado
function addPreparo() {
    const preparos = document.querySelector("#itemsPreparo");
    const campoContainer = document.querySelectorAll("#preparo");

    const newCampo = campoContainer[campoContainer.length - 1].cloneNode(true);

    if (newCampo.children[0].value == "") {
        return false;
    }

    newCampo.children[0].value = "";
    preparos.appendChild(newCampo);

    const preparoField = document.querySelectorAll('#prepadoField');
    for (let preparo of preparoField) {
        preparo.focus();
    }
}

function removePreparo() {
    const preparos = document.querySelectorAll("#preparo");
    for (let preparo of preparos) {
        preparo.addEventListener('click', function() {
            const campoContainer = preparo.querySelector('#preparo');
            preparo.remove(campoContainer);
        });
    }    
}

// Alerta de confirmação de deletar um registro
function alertDelete() {
    const formDelete = document.querySelector("#form-delete");
    formDelete.addEventListener("submit", function(event) {
        const confirmation = confirm("Deseja mesmo deletar este registro?");
        if (!confirmation) {
            event.preventDefault();
        }
    });
}

// ==== CHEFS ====

function setPathImage() {
    const pathFiled = document.getElementById('input-photo-chef');
    pathFiled.textContent = req.file.path;
}

function alertBlankField(event) {
    const alert = alert('Por favor, envie uma imagem.');
    event.preventDefault();
}

const Validate = {
    apply(input, func) {
        Validate.clearErrors(input);

        let results = Validate[func](input.value);
        input.value = results.value;

        if (results.error) {
            Validate.displayError(input, results.error);
            input.focus();
        }        
    },
    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector('.error');

        if (errorDiv) {
            errorDiv.remove();
            input.style.border = "1px solid #DDDDDD";
        }
    },
    displayError(input, error) {
        const div = document.createElement('div');

        div.classList.add('error');
        div.innerHTML = error;
        
        input.parentNode.appendChild(div);

        input.style.border = "1px solid red";
        input.focus();
    },
    isEmail(value) {
        let error = null;
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!value.match(mailFormat)) {
            error = 'E-mail inválido';
        }

        return {
            error,
            value
        }
    }
}

const ValidateField = {
    apply(input, func) {
        Validate.clearErrors(input);

        let results = Validate[func](input.value);
        input.value = results.value;

        if (results.error) {
            Validate.displayError(input, results.error);
            input.focus();
        }        
    },
    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector('.error');

        if (errorDiv) {
            errorDiv.remove();
            input.style.border = "1px solid #DDDDDD";
        }
    },
    displayError(input, error) {
        const div = document.createElement('div');

        div.classList.add('error');
        div.innerHTML = error;
        
        input.parentNode.appendChild(div);

        input.style.border = "1px solid red";
        input.focus();
    },
    erro(value) {
        let error = null;

        if (value == '') {
            error = '* Senha';
        }

        return {
            error,
            value
        }
    }
}