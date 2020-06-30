const Admin = require('../models/Admin');
const { age, date, birthDay } = require('../../lib/utils');
const Intl = require('intl');

module.exports = {

    // ===================== RECIPES =====================

    index(req, res) {
        Admin.all(function(recipes) {
            return res.render("admin/index", { recipes });    
        });
    },

    create(req, res) {
        Admin.chefSelector(function(selection) {
            return res.render('admin/criar', { chefSelection: selection });
        });
    },

    post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos.");
            }
        }

        Admin.post(req.body, function(recipe) {
            return res.redirect(`/admin/prato/${recipe.id}`);
        });
    },

    exibe(req, res) {
        Admin.find(req.params.id, function(recipe) {
            if (!recipe) {
                return res.send('Receita não encontrada!');
            }

            recipe.created_at = date(recipe.created_at).format;

            return res.render('admin/prato', { recipe });
        });
    },

    // ===================== CHEFS =====================

    indexChefs(req, res) {
        Admin.allChefs(function(chefs) {
            return res.render("admin/chefs/index", { chefs });
        });
    },

    createChef(req, res) {
        return res.render("admin/chefs/criar");
    },

    postChefs(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos.");
            }
        }

        Admin.postChef(req.body, function(chef) {
            return res.redirect(`/admin/chefs/chef/${chef.id}`);
        });
    },

    exibeChef(req, res) {
        Admin.findChef(req.params.id, function(chef) {
            if (!chef) {
                return res.send('Chef não encontrado');
            }

            chef.created_at = date(chef.created_at).format;

            Admin.recipesFromChefs(req.params.id, function(recipes) {
                return res.render('admin/chefs/chef', { chef, recipes });
            });

            
        });
    }

}

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

