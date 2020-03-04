const modal = document.querySelector('.modal-menu');
const grids = document.querySelectorAll('.grid-prato');
const modalOn = document.querySelector('.modal-on');

for (let grid of grids) {
    grid.addEventListener("click", function() {
        const imageId = grid.getAttribute("id");
        const titleId = grid.getElementsByClassName("author");
        modal.classList.add("active");
        modal.querySelector("iframe").src=`/${imageId}.png`;
        // if (imageId == ) {
            modal.querySelector("p").textContent = `por ${titleId}`;
        // }        
  });
};

document.querySelector('.fechar-modal').addEventListener("click", function(event) {
    event.preventDefault();
    modal.classList.remove("active");
    modal.querySelector("iframe").src="";
});
