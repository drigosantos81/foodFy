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

        const filesPromise = req.files.map(async (fileRecipe, file) => {
            let fileResults = await Files.createFile({ ...fileRecipe });
            const fileId = fileResults.rows[0].id;
            Files.createRecipeFile({ ...file, recipe_id: recipeId, file_id: fileId }); 
        });
        await Promise.all(filesPromise);

        return res.redirect(`/admin/recipes/prato/${recipeId}`);
    },

    async exibe(req, res) {
        let results = await Admin.find(req.params.id);
        const recipe = results.rows[0];

        if (!recipe) {
            return res.send('Receita não encontrada');
        }

        recipe.created_at = date(recipe.created_at).format;

        // Buscando imagens(arquivo)
        results = await Admin.files(recipe.id);
        let files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
        }));

        return res.render('admin/recipes/prato', { recipe, files });
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
    }

}