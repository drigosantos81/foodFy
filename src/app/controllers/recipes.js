const Recipes = require('../models/Recipes');
const Files = require('../models/Files');
const { age, date, birthDay } = require('../../lib/utils');

const Intl = require('intl');
const Chefs = require('../models/Chefs');

module.exports = {
    async index(req, res) {
        try {
            let results = await Recipes.all();
            const recipes = results.rows;

            if (!recipes) {
                return res.send('Receita não encontrada');
            }

            async function getImage(recipeId) {
                let results = await Recipes.files(recipeId);
                const files = results.rows.map(file => 
                    `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
                );

                return files[0];
            }

            const filesPromise = recipes.map(async recipe => {
                recipe.img = await getImage(recipe.id);
                return recipe;
            });

            const allRecipe = await Promise.all(filesPromise);

            return res.render('admin/recipes/index', { recipes: allRecipe });
        } catch (error) {
                console.log(error);
        }
    },
    
    // index(req, res) {
    //     Recipes.allOld(function(recipes) {
    //         return res.render("admin/recipes/index", { recipes });    
    //     });
    // },

    create(req, res) {
        Chefs.chefSelector(function(selection) {
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

        let results = await Recipes.post(req.body);
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
        let results = await Recipes.find(req.params.id);
        const recipe = results.rows[0];

        if (!recipe) {
            return res.send('Receita não encontrada');
        }

        recipe.created_at = date(recipe.created_at).format;

        // Buscando imagens(arquivo)
        results = await Recipes.files(recipe.id);
        let files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
        }));

        return res.render('admin/recipes/prato', { recipe, files });
    },

    edita(req, res) {
        Recipes.find(req.params.id, function(recipe) {
            if (!recipe) {
                return res.send('Receita não encontrada.');
            }

            recipe.created_at = date(recipe.created_at).format;

            Recipes.chefSelector(function(selection) {
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

        Recipes.update(req.body, function() {
            return res.redirect(`/admin/recipes/prato/${req.body.id}`);
        });
    },

    deleteRecipe(req, res) {
        Recipes.delete(req.body.id, function() {
            return res.redirect('/admin/recipes');
        });
    }
}