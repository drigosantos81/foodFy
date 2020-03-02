const modal = document.querySelector('.modal-menu');
const grids = document.querySelectorAll('.grid-prato');
const modalOn = document.querySelector('.modal-on');
var recipeName;  

for (let grid of grids) {
    grid.addEventListener("click", function() {
        const imageId = grid.getAttribute("id");
        modal.classList.add("active");
        modal.querySelector("iframe").src=`/${imageId}.png`; 
        setTextsToModalQuerys(imageId);
        modal.querySelectorAll('p')[1].textContent = recipeName;
    })
}

document.querySelector('.fechar-modal').addEventListener("click", function(event) {
    event.preventDefault();
    modal.classList.remove("active");
    modal.querySelector("iframe").src="";
})

function setTextToModalQuery(grid){ // hardcode
    switch (grid) {
      case 'burger':
        recipeName = "Triplo bacon burger"
        autor = "Jorge Relato"
        break;
      case 'pizza':
        recipeName = "Pizza 4 estações"
        autor = "Fabiana Melo"
      break;
      case 'espaguete':
        recipeName = "Espaguete ao molho"
        autor = "Júlia Kinoto"
      break;
      case 'lasanha':
        recipeName = "Lasanha mac n' cheese"
        autor = "Juliano Vieira"
      break;
      case 'doce':
        recipeName = "Docinhos pão-do-céu"
        autor = "Ricardo Golvea"
      break;
      case 'asinha':
        recipeName = "Asinhas de frango ao barbecue"
        autor = "Vania Steroski"
      break;
    
      default:
  
    break;
    }
    return 0;
}