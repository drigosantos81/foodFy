const modal = document.querySelector('.modal-menu');
const grids = document.querySelectorAll('.grid-prato');
// const gridsRec = document.querySelectorAll('.grid-home-receita');
const gridsRec = document.querySelectorAll('.grid-prato-rec');
const modalOn = document.querySelector('.modal-on');

for (let grid of grids) {
    grid.addEventListener("click", function() {
        const imageId = grid.getAttribute("id");
        const title = grid.querySelector("h4").innerHTML;
        const author = grid.querySelector("p").innerHTML;

        modal.classList.add("active");

        modal.querySelector("iframe").src=`/${imageId}.png`;
        modal.querySelector("h4").innerHTML = `${title}`;
        modal.querySelector("p").innerHTML = `${author}`;
  });
};

for (let gridRec of gridsRec) {
    gridRec.addEventListener("click", function() {
        const pratoId = gridRec.getAttribute("id");
        window.location.href = `/receita?id=${pratoId}`;
    });
};

document.querySelector('.fechar-modal').addEventListener("click", function(event) {
    event.preventDefault();
    modal.classList.remove("active");
    modal.querySelector("iframe").src="";
});
