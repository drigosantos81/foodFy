const Admin = require('../models/Admin');
const Files = require('../models/Files');
const { age, date, birthDay } = require('../../lib/utils');

const Intl = require('intl');

module.exports = {

    // ===================== RECIPES =====================

    index(req, res) {
        Admin.all(function(recipes) {
            return res.render("admin/recipes/index", { recipes });    
        });
    },

    create(req, res) {
        Admin.chefSelector(function(selection) {
            return res.render('admin/recipes/criar', { chefSelection: selection });
        });
    },

    async post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos.");
            }
        }

        if (req.files.length == 0) {
            return res.send("Por favor, envie pelo menos uma imagem.");
        }

        let results = await Admin.post(req.body);
        const recipeId = results.rows[0].id;

        const filesPromise = req.files.map(file => Files.createImageRecipe({ ...file, recipe_id: recipeId }));
        await Promise.all(filesPromise);

        return res.redirect(`/admin/recipes/prato/${recipeId}`);

        // Admin.post(req.body, function(recipe) {
        //     return res.redirect(`/admin/recipes/prato/${recipeId}`);
        //     // return res.redirect(`/admin/recipes/prato/${recipe.id}`);
        // });
    },

    exibe(req, res) {
        Admin.find(req.params.id, function(recipe) {
            if (!recipe) {
                return res.send('Receita não encontrada!');
            }

            recipe.created_at = date(recipe.created_at).format;

            return res.render('admin/recipes/prato', { recipe });
        });
    },

    edita(req, res) {
        Admin.find(req.params.id, function(recipe) {
            if (!recipe) {
                return res.send('Receita não encontrada.');
            }

            recipe.created_at = date(recipe.created_at).format;

            Admin.chefSelector(function(selection) {
                return res.render('admin/recipes/editar', { recipe, chefSelection: selection });
            });
        });
    },

    putRecipe(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Preencha todos os campos.');
            }
        }

        Admin.updateRecipe(req.body, function() {
            return res.redirect(`/admin/recipes/prato/${req.body.id}`);
        });
    },

    deleteRecipe(req, res) {
        Admin.deleteReceita(req.body.id, function() {
            return res.redirect('/admin/recipes');
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
    },

    editaChef(req, res) {
        Admin.findChef(req.params.id, function(chef) {
            if (!chef) {
                return res.send('Chef não cadastrado ou não encontrado.');
            }

            chef.created_at = date(chef.created_at).format;

            return res.render('admin/chefs/editar', { chef });
        });
    },

    putChef(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Preencha todos os campos.');
            }
        }

        Admin.updateChef(req.body, function() {
            return res.redirect(`/admin/chefs/chef/${req.body.id}`);
        });
    },

    deletaChef(req, res) {
        Admin.deleteChef(req.body.id, function() {
            return res.redirect('/admin/chefs');
        });
    }

}

// exports.notFound = function(req, res) {
//     res.status(404).render("/frontend/not-found");
// };
