const modal = document.querySelector('.modal-menu');
const grids = document.querySelectorAll('.grid-prato');

for (grid of grids) {
    grid.addEventListenr("click"), function() {
        modal.classList.add("active");
    }
}