const Admin = require('../models/Admin');
const { age, date, birthDay } = require('../../lib/utils');
const Intl = require('intl');

module.exports = {

    index(req, res) {
        Admin.all(function(recipes) {
            return res.render("admin/index", { recipes });    
        });
    },

    indexChefs(req, res) {
        Admin.allChefs(function(chefs) {
            return res.render("admin/chefs/index", { chefs });
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
    },

    exibe(req, res) {
        Admin.find(req.params.id, function(recipe) {
            if (!recipe) {
                return res.send('Registro não encontrado!');
            }

            recipe.created_at = date(recipe.created_at).format;

            return res.render('admin/prato', { recipe });
        });
    }

}


// exports.exibe = function(req, res) {


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
