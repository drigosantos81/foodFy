const Intl = require('intl');

const Chefs = require('../models/Chefs');
const Files = require('../models/Files');
const Recipes = require('../models/Recipes');
const { date } = require('../../lib/utils');

module.exports = {
    async index(req, res) {
        try {
            let results = await Chefs.all();
            const chefs = results.rows;

            if (!chefs) {
                return res.send('Nenhum registro encontrado');
            }

            async function getImage(chefId) {
                let results = await Chefs.chefFile(chefId);
                const files = results.rows.map(file => 
                    `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
                );

                return files[0];
            }

            const filesPromise = chefs.map(async chef => {
                chef.img = await getImage(chef.id);
                return chef;
            });
            
            const allChefs = await Promise.all(filesPromise);

            return res.render('admin/chefs/index', { chefs: allChefs });
        } catch (error) {
                console.log(error);
        }
    },

    createChef(req, res) {
        return res.render("admin/chefs/criar");
    },

    async postChefs(req, res) {
        try {
            const keys = Object.keys(req.body);

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send("Por favor, preencha todos os campos.");
                }
            }
    
            if (req.file == 0) {
                return res.send("Por favor, envie uma imagem.");
            }

            let results = await Files.createFile({ ...req.file });
            const fileId = results.rows[0].id;

            results = await Chefs.post(req.body, fileId);
            const chefId = results.rows[0].id;


            return res.redirect(`/admin/chefs/chef/${chefId}`);
        } catch (error) {
            console.log(error);
        }
    },

    async exibeChef(req, res) {
        try {
            // BUSCA DOS DADOS DO CHEF SELECIONADO
            let results = await Chefs.showChef(req.params.id);
            const chef = results.rows[0];

            if (!chef) {
                return res.send('Receita não encontrada');
            }

            chef.created_at = date(chef.created_at).format;
            chef.updated_at = date(chef.updated_at).format;
            
            // BUSCA DA IMGEM DO CHEF
            results = await Chefs.chefFile(chef.id);
            let files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
            }));

            // BUSCA DAS RECEITAS DO CHEF
            let resultsRecipes = await Chefs.recipesFromChefs(req.params.id);
            const recipes = resultsRecipes.rows;
            console.log("Receitas completas: ", recipes);

            // for (recipe in recipes) {
            //     results = await Chefs.filesRecipesFromChef(recipe.id);
            //     let filesRecipes = results.rows.map(file => ({
            //         ...file,
            //         src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
            //     }));
            //     return filesRecipes;
            // }

            console.log("Apenas o id das receitas: ", recipes.id);
            console.log("Apenas o título das receitas: ", recipes.title);

            // BUSCA DAS IMAGENS DE CADA RECEITA DO CHEF

            results = await Chefs.filesRecipesFromChef(chef.id);
            let filesRecipes = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
            }));
            console.log("Todas infos de fotos das receitas", filesRecipes);
            console.log("Apenas uma foto da receitas", filesRecipes.src);
            // console.log(filesRecipes[0].src);

            return res.render('admin/chefs/chef', { chef, files, recipes, filesRecipes });
        } catch (error) {
            console.log(error);
        }
    },

    async editaChef(req, res) {
        try {
            let results = await Chefs.showChef(req.params.id);
            const chef = results.rows[0];

            results = await Chefs.chefFile(chef.id);
            let files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
            }));

            return res.render('admin/chefs/editar', { chef, files });
        } catch (error) {
            console.log(error);
        }
    },

    async putChef(req, res) {
        try {
            const keys = Object.keys(req.body);

            for (key of keys) {
                if (req.body[key] == "" && key != "removed_files") {
                    return res.send('Preencha todos os campos.');
                }
            }

            if (req.file == 0) {
                return res.send("Por favor, envie uma imagem.");
            }

            if (req.file.length != 0) {
                let fileChef = await Chefs.chefFile(req.body.id);
                let fileChefDelete = fileChef.rows[0].id;
                Files.deleteFileChef(fileChefDelete);
            }

            let results = await Files.createFile({ ...req.file });
            const fileId = results.rows[0].id;
            
            console.log(fileId);
            await Chefs.update(req.body, fileId);

            // if (fileChefDelete != fileId) {
            //     Files.deleteFileChef(fileChefDelete)
            // }

            return res.redirect(`/admin/chefs/chef/${req.body.id}`);
        } catch (error) {
            console.log(error);
        }
    },

    async deletaChef(req, res) {
        await Chefs.delete(req.body.id);
        await Files.deleteFileChef(req.body.id);

        return res.redirect('/admin/chefs');
    }
}

// exports.notFound = function(req, res) {
//     res.status(404).render("/frontend/not-found");
// };