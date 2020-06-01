// Ressaltar o link atual da página
const currentPage = location.pathname;
const menuItens = document.querySelectorAll(".links a");

for (item of menuItens) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active");
    }
}

// Abrir o modal da página inicial
function modal() {
    const modal = document.querySelector('.modal');
    const grids = document.querySelectorAll('.receita');
    for (let grid of grids) {
        grid.addEventListener("click", function() {
            const imageId = grid.getAttribute("id");
            const titulo = grid.querySelector("h3").innerHTML;
            const dono = grid.querySelector("p").innerHTML;

            modal.classList.add("active");
            
            modal.querySelector("img").src = imageId;
            modal.querySelector("h3").innerHTML = titulo;
            modal.querySelector("p").innerHTML = dono;
        });
    }

    document.querySelector(".close").addEventListener("click", function(event) {
        event.preventDefault(event);
        modal.classList.remove("active");
    });
}

// Ir para página de detalhes da receita escolhida
function descPrato() {
    const grids = document.querySelectorAll('.receita');
    for (let grid of grids) {
        grid.addEventListener("click", function() {
            const pratoId = grid.getAttribute("id");
            window.location.href = `/prato/${pratoId}`;
        });
    }
}

// Botão ESCONDER/MOSTRAR detalhes da receita
const contents = document.getElementsByClassName("showHide");
for (let content of contents) {
    const buttonH4 = content.querySelector('h4');
    buttonH4.addEventListener("click", function() {
        const view = content.querySelector(".conteudo-text");
        if (buttonH4.innerHTML == "ESCONDER") {
            view.style.display = "none";
            buttonH4.innerHTML = "MOSTRAR";            
        } else {
            view.style.display = "block";
            buttonH4.innerHTML = "ESCONDER";
        }
    });
}

// Adicionar campos em ingredientes
function addIngredient() {
    const ingredients = document.querySelector("#ingredientes");
    const campoContainer = document.querySelectorAll("#ingrediente");

    // Clone do último campo pr eenchido
    const newCampo = campoContainer[campoContainer.length - 1].cloneNode(true);

    // Não adiciona novo input se o último estiver vazio
    if (newCampo.children[0].value == "") {
        return false;
    }

    // Deixa o novo input vazio
    newCampo.children[0].value = "";
    ingredients.appendChild(newCampo);    
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
