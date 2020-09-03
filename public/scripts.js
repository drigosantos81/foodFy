// Ressaltar o link atual da página
const currentPage = location.pathname;
const menuItens = document.querySelectorAll(".links a");
const linksAdmin = document.querySelectorAll(".linksAdmin a");

// Links Pagína dos visitantes
for (item of menuItens) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active");
    }
}

// Links do Admin
for (link of linksAdmin) {
    if (currentPage.includes(link.getAttribute("href"))) {
        link.classList.add("active");
    }
}

const PhotosUpload = {
    input: '',
    preview: document.querySelector("#photos-preview"),
    uploadLimit: 5,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target;
        PhotosUpload.input = event.target;

        if (PhotosUpload.hasLimit(event)) {
            PhotosUpload.updateInputFiles();
            return
        };
        
        Array.from(fileList).forEach(file => {
            PhotosUpload.files.push(file);

            const reader = new FileReader();

            reader.onload = () => {
                const image = new Image();
                image.src = String(reader.result);

                const container = PhotosUpload.getContainer(image);
                PhotosUpload.preview.appendChild(container);
            }

            reader.readAsDataURL(file);
        });

        PhotosUpload.updateInputFiles();
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload;
        const { files: fileList } = input;

        if (fileList.length > uploadLimit) {
            alert(`Você pode enviar até ${uploadLimit} fotos.`);
            event.preventDefault();
            return true;
        }

        const photosDiv = [];
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == 'photo') {
                photosDiv.push(item);
            }
        });
        const totalPhotos = fileList.length + photosDiv.length;
        if (totalPhotos > uploadLimit) {
            alert('Você atingiu o limite máximo de fotos.');
            event.preventDefault();
            return true;
        }

        return false;
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file));
        
        console.log(dataTransfer);
        return dataTransfer.files;
    },
    getContainer(image) {
        const container = document.createElement('div');
        container.classList.add('photo');
        
        container.onclick = PhotosUpload.removePhoto;

        container.appendChild(image);

        container.appendChild(PhotosUpload.getRemoveButton());

        return container;
    },
    getRemoveButton() {
        const button = document.createElement('i');
        button.classList.add('material-icons');
        button.innerHTML = 'close';

        return button;
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode;
        const newFiles = Array.from(PhotosUpload.preview.children).filter(function(file) {
            if (file.classList.contains('photo') && !file.getAttribute('id')) {
                return true;
            }
        });
        const index = newFiles.indexOf(photoDiv);
        PhotosUpload.files.splice(index, 1);

        PhotosUpload.updateInputFiles();
        
        photoDiv.remove();
    },
    removedOldPhoto(event) {
        const photoDiv = event.target.parentNode;

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]');
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`;
            }
        }

        photoDiv.remove();
    },
    updateInputFiles() {
        PhotosUpload.input.files = PhotosUpload.getAllFiles();
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

// Remover um ingrediente específico
function removeIngredient() {
    const ingredients = document.querySelectorAll("#itemsIngredientes");
    for (let ingredient of ingredients) {
        const botaoRemove = ingredient.querySelector(".del-ingredient");
        const campoContainer = ingredient.querySelector("#ingrediente");
            // campoContainer.removeChild(campoContainer);
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
const formDelete = document.querySelector("#form-delete");
    formDelete.addEventListener("submit", function(event) {
        const confirmation = confirm("Deseja mesmo deletar este registro?");
        if (!confirmation) {
            event.preventDefault();
    }
});
