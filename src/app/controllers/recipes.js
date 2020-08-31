const Recipes = require('../models/Recipes');
const Chefs = require('../models/Chefs');
const Files = require('../models/Files');
const { age, date, birthDay } = require('../../lib/utils');

const Intl = require('intl');

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

    async create(req, res) {
        let results = await Chefs.chefSelector();
        const chefSelector = results.rows;

        return res.render('admin/recipes/criar', { chefSelector });
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
        try {
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
        } catch (error) {
            console.log(error);
        }
    },

    async edita(req, res) {
        try {
            let results = await Recipes.find(req.params.id);
            const recipe = results.rows[0];

            if (!recipe) {
                return res.send('Receita não encontrada');
            }

            results = await Chefs.chefSelector();
            const chefName = results.rows;

            results = await Recipes.files(recipe.id);
            let files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
            }));

            return res.render('admin/recipes/editar', { recipe, chefName, files });

        } catch (error) {
            console.log(error);
        }        
    },

    async putRecipe(req, res) {
        try {
            const keys = Object.keys(req.body);

            for (key of keys) {
                if (req.body[key] == "" && key != "removed_files") {
                    return res.send("Por favor, preencha todos os campos.");
                }
            }
            // REMOÇÃO DAS IMAGENS NO BANCO
            // if (req.body.removed_files) {
            //     const removed_files = req.body.removed_files.split(",");
            //     const lastIndex = removedFiles.length - 1;
            //     removedFiles.splice(lastIndex, 1);

            //     const removedFilesPromise = removedFiles.map(id => Files.delete(id));

            //     await Promise.all(removedFilesPromise);
            // }
            // VALIDAÇÃO NO BANCO (BackEnd)
            if (req.files.length != 0) {
                const oldFiles = await Recipes.files(req.body.id);
                const totalFiles = oldFiles.rows.length + req.files.length;

                if (totalFiles <= 5) {
                    const newFilesPromise = req.files.map(async (fileRecipe, file) => {
                        let fileResults = await Files.createFile({ ...fileRecipe });
                        const fileId = fileResults.rows[0].id;
                        Files.createRecipeFile({ 
                            ...file,
                            recipe_id: oldFiles, 
                            file_id: fileId });
                    });
                    await Promise.all(newFilesPromise);
                }
            }
            
            await Recipes.update(req.body);

            return res.redirect(`/admin/recipes/prato/${req.body.id}`);
        } catch (error) {
            console.log(error);
        }

        // const keys = Object.keys(req.body);

        // for (key of keys) {
        //     if (req.body[key] == "") {
        //         return res.send('Preencha todos os campos.');
        //     }
        // }

        // Recipes.update(req.body, function() {
        //     return res.redirect(`/admin/recipes/prato/${req.body.id}`);
        // });
    },

    deleteRecipe(req, res) {
        Recipes.delete(req.body.id, function() {
            return res.redirect('/admin/recipes');
        });
    }
}