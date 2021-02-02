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

// Abrir o modal da página inicial
function modal() {
	const modal = document.querySelector('.modal');
	const grids = document.querySelectorAll('.receita');
	for (let grid of grids) {
		grid.addEventListener("click", function() {
			const imageId = grid.querySelector("input").name;
			const imageSrc = grid.querySelector("img").style.backgroundImage;
			const titulo = grid.querySelector("h3").innerHTML;
			const dono = grid.querySelector("p").innerHTML;

			modal.classList.add("active");
			
			modal.querySelector(".image-modal").id = imageId;
			modal.querySelector("img").style.backgroundImage = imageSrc;
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
			window.location.href = `/recipe/${pratoId}`;
		});
	}
}

function modalDescPrato() {
	const idRecipe = document.querySelector('.image-modal');
	idRecipe.addEventListener("click", function() {
		const pratoId = idRecipe.getAttribute("id");
		window.location.href = `/recipe/${pratoId}`;
	});
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