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