const Recipes = require('../models/Recipes');
const Chefs = require('../models/Chefs');
const Files = require('../models/Files');
const { date } = require('../../lib/utils');

module.exports = {
    // Retorna todas as Receita
    async index(req, res) {
        try {
            // Retorna todos os dados da Receita
            let results = await Recipes.all();
            const recipes = results.rows;

            if (!recipes) {
                return res.send('Receita não encontrada');
            }
            
            // Retorna todas as imagens da Receita
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
    // Retorna lista dos nome dos Chefs para vincular a Receita
    async create(req, res) {
        let results = await Chefs.chefSelector();
        const chefName = results.rows;

        return res.render('admin/recipes/criar', { chefName });
    },
    // Comando POST de nova Receita
    async post(req, res) {
        try {
            const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos.");
            }
        }

        if (req.files.length == 0) {
            return res.send("Por favor, envie pelo menos uma imagem.");
        }

        // Post da Receita com todos os campos preenchidos
        let results = await Recipes.post(req.body);
        const recipeId = results.rows[0].id;

        const filesPromise = req.files.map(async (fileRecipe, file) => {
            let fileResults = await Files.createFile({ ...fileRecipe });
            const fileId = fileResults.rows[0].id;
            Files.createRecipeFile({ ...file, recipe_id: recipeId, file_id: fileId }); 
        });
        await Promise.all(filesPromise);

        return res.redirect(`/admin/recipes/recipe/${recipeId}`);
        } catch (error) {
            console.log(error);
        }
    },
    // Carrega a página com as informações de uma Receita
    async exibe(req, res) {
        try {
            let results = await Recipes.find(req.params.id);
            const recipe = results.rows[0];

            if (!recipe) {
                return res.send('Receita não encontrada');
            }

            // Formatação das datas
            recipe.created_at = date(recipe.created_at).format;

            const { year, month, day } = date(recipe.updated_at);

            recipe.published = {
                year,
                month,
                day: `${day}/${month}/${year}`
            }
            
            recipe.updated_at = date(recipe.updated_at).format;
            
            // Retorna imagens(arquivo)
            results = await Recipes.files(recipe.id);
            let files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
            }));

            return res.render('admin/recipes/recipe', { recipe, files });
        } catch (error) {
            console.log(error);
        }
    },
    // Retorna todos campos da Receita para edição
    async edita(req, res) {
        try {
            let results = await Recipes.find(req.params.id);
            const recipe = results.rows[0];

            if (!recipe) {
                return res.send('Receita não encontrada');
            }

            // Retorna lista dos nome dos Chefs para vincular a Receita
            results = await Chefs.chefSelector();
            const chefName = results.rows;

            // Retorna imagens(arquivo)
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
            // VALIDAÇÃO E REMOÇÃO DAS IMAGENS NO BANCO (BackEnd)
            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",");
                const lastIndex = removedFiles.length - 1;
                removedFiles.splice(lastIndex, 1);
                
                const removedFilesPromise = removedFiles.map(async (idFile) => {
                    let fileRecipeRemoved = await Recipes.fileRecipeRemoved(idFile);
                    
                    Files.deleteRecipeFile(idFile);

                    let idFileRecipeRemoved = fileRecipeRemoved.rows[0].id;
                    
                    await Recipes.updateRecipeFilesFileId(idFile);
                    
                    Files.deleteFile(idFileRecipeRemoved);
                });

                await Promise.all(removedFilesPromise);
            }

            // VERIFICAÇÃO SE EXISTE IMAGENS
            if (req.files.length != 0) {
                const oldFiles = await Recipes.files(req.body.id);
                const totalFiles = oldFiles.rows.length + req.files.length;

                // VERIFICAÇÃO SE TEM ATÉ 5 IMAGENS
                if (totalFiles <= 5) {                    
                    const newFilesPromise = req.files.map(async (fileRecipe, file) => {
                        let fileResults = await Files.createFile({ ...fileRecipe });
                        const fileId = fileResults.rows[0].id;
                        Files.createRecipeFile({ ...file, recipe_id: req.body.id, file_id: fileId });
                    });
                    await Promise.all(newFilesPromise);
                }
            }            
            
            await Recipes.update(req.body);

            return res.redirect(`/admin/recipes/recipe/${req.body.id}`);
        } catch (error) {
            console.log(error);
        }
    },

    async deleteRecipe(req, res) {
        await Recipes.delete(req.body.id);
        await Files.deleteFileRecipe(req.body);

        return res.redirect('/admin/recipes');
    },

    notFound(req, res) {
        res.status(404).render("admin/recipes/not-found");
    }
}