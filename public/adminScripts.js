// Adicionar campos em ingredientes
function addIngredient() {
    const ingredients = document.querySelector("#ingredientes");
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
}

function removeIngredient() {
    const ingredients = document.querySelectorAll("#itemsIngredientes");
    for (let ingredient of ingredients) {        
        const campoContainer = ingredient.querySelector("#ingrediente");
        ingredient.removeChild(campoContainer);
    }
}

// Adicionar campos em prepado
function addPreparo() {
    const preparos = document.querySelector("#preparos");
    const campoContainer = document.querySelectorAll("#preparo");

    const newCampo = campoContainer[campoContainer.length - 1].cloneNode(true);

    if (newCampo.children[0].value == "") {
        return false;
    }

    newCampo.children[0].value = "";
    preparos.appendChild(newCampo);    
}

function removePreparo() {
    const preparos = document.querySelectorAll("#itemsPreparo");
    for (let preparo of preparos) {
        const botaoRemove = preparo.querySelector(".del-preparo");
        const campoContainer = preparo.querySelector("#preparo");
            // campoContainer.removeChild(campoContainer);
        preparo.removeChild(campoContainer);
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