const Admin = require('../models/Admin');
const Intl = require('intl');

module.exports = {

    index(req, res) {
        Admin.all(function(recipes) {
            return res.render("admin/index", { recipes });    
        });
    },

    create(req, res) {
        return res.render('admin/criar');
    },

    post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos.");
            }
        }

        Admin.post(req.body, function(recipe) {
            return res.redirect(`/admin/${recipe.id}`);
        });
    }

}


// exports.post = function(req, res) {

//     const chaves = Object.keys(req.body);

//     for (chave of chaves) {
//         if (req.body[chave] == "") {
//             return res.send("Preencha todos os campos");
//         }
//     }

//     let { image, title, author, ingredients, preparation, information } = req.body;

//     const id = Number(receitas.receitas.length + 1);
//     const criadoEm = Date.now();

//     receitas.receitas.push({
//         id, 
//         image,
//         title,
//         author,
//         ingredients, 
//         preparation,
//         information,
//         criadoEm
//     });

//     fs.writeFile("dados.json", JSON.stringify(receitas, null, 2), function(err) {
//         if (err) {
//             return res.send("Erro ao salvar as informações.");
//         }
//         return res.redirect("admin");
//     });

// };

// exports.exibe = function(req, res) {

//     const { id } = req.params;

//     const foundPrato = receitas.receitas.find(function(item) {
//         return item.id == id;
//     });

//     if (!foundPrato) {
//         return res.render("frontend/not-found");
//     }

//     const item = {
//         ...foundPrato,
//         criadoEm: new Intl.DateTimeFormat("pt-BR").format(foundPrato.criadoEm),
//     }

//     return res.render("admin/prato", { item });
// };

// exports.edita = function(req, res) {
    
//     const { id } = req.params;

//     const foundPrato = receitas.receitas.find(function(item) {
//         return item.id == id;
//     });

//     if (!foundPrato) {
//         return res.render("frontend/not-found");
//     }

//     return res.render("admin/editar", { item: foundPrato });

// };

// exports.put = function(req, res) {
    
//     const { id } = req.body;
    
//     let index = 0;

//         const foundPrato = receitas.receitas.find(function(item, foundIndex) {
//         if (id == item.id) {
//             index = foundIndex;
//             return true;
//         }
//     });

//     if (!foundPrato) {
//         return res.render("frontend/not-found");
//     }

//     const item = {
//         ...foundPrato,
//         ...req.body
//     }

//     receitas.receitas[index] = item;

//     fs.writeFile("dados.json", JSON.stringify(receitas, null, 2), function(err) {
//         if (err) {
//             return res.send("Erro ao salvar a informação");
//         }

//         return res.redirect(`prato/${id}`);
//     });
// };

// exports.delete = function(req, res) {
//     const { id } = req.body;
    
//     const filtroPrato = receitas.receitas.filter(function(item) {
//         return item.id != id;
//     });

//     receitas.receitas = filtroPrato;

//     console.log(filtroPrato);   
    
//     fs.writeFile("dados.json", JSON.stringify(receitas, null, 2), function(err) {
//         if (err) {
//             return res.send("Erro ao salvar a informação");
//         }
//         return res.redirect("/admin");
//     });
// };

// exports.notFound = function(req, res) {
//     res.status(404).render("/frontend/not-found");
// };
