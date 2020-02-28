const modal = document.querySelector('.modal-menu');
const grids = document.querySelectorAll('.grid-prato');
const modalOn = document.querySelector('.modal-on')

for (let grid of grids) {
    grid.addEventListener("click", function() {
        const imageId = grid.getAttribute("id");
        modal.classList.add("active");
        modal.querySelector("iframe").src=`/${imageId}`;
    })
}

document.querySelector('.fechar-modal').addEventListener("click", function(event) {
    event.preventDefault();
    modal.classList.remove("active");
    modal.querySelector("iframe").src="";
})