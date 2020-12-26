const Chefs = require('../models/Chefs');
const Files = require('../models/Files');
const { date } = require('../../lib/utils');

module.exports = {
    // Carrega a página com a listagem de todos os Chefs
    async index(req, res) {
        try { 
            // Retorna todos os dados dos Chefs cadastrados
            let results = await Chefs.all();
            const chefs = results.rows;

            if (!chefs) {
                return res.send('Nenhum registro encontrado');
            }

            // Retorna as imagens respectivas dos Chefs cadastrados
            async function getImage(chefId) {
                let results = await Chefs.chefFile(chefId);
                const files = results.rows.map(file => 
                    `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
                );

                return files[0];
            }

            // Retorna as imagens de todos os Chefs
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
    // Carrega página de cadastro de novo Chef
    createChef(req, res) {
        return res.render("admin/chefs/criar");
    },
    // Comando POST do novo Chef
    async postChefs(req, res) {
        try {
            const keys = Object.keys(req.body);

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send("Por favor, preencha todos os campos.");
                }
            }
                        
            if (req.file == undefined) {
                return res.send("Por favor, envie uma imagem.");
            }
            // Salva o arquivo da imagem do Chef
            let results = await Files.createFile({ ...req.file });
            const fileId = results.rows[0].id;

            // Salva os dados do Chef
            results = await Chefs.post(req.body, fileId);
            const chefId = results.rows[0].id;

            return res.redirect(`/admin/chefs/chef/${chefId}`);
        } catch (error) {
            console.log(error);
        }
    },
    // Carrega a página com as informações de um Chef
    async exibeChef(req, res) {
        try {
            // Retorna os dados do Chef selecionado
            let results = await Chefs.showChef(req.params.id);
            const chef = results.rows[0];

            if (!chef) {
                return res.send('Receita não encontrada');
            }
            // Formatação de datas
            chef.created_at = date(chef.created_at).format;

            const { year, month, day } = date(chef.updated_at);

            chef.published = {
                year,
                month,
                day: `${day}/${month}/${year}`
            }

            chef.updated_at = date(chef.updated_at).format;

            // Retorna a imagem do Chef
            results = await Chefs.chefFile(chef.id);
            let files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
            }));

            // Retorna os dados das receitas do Chef
            let resultsRecipes = await Chefs.recipesFromChefs(req.params.id);
            const recipes = resultsRecipes.rows;

            async function getImageRecipe(recipeId) {
                let resultImageRecipe = await Chefs.filesRecipesFromChef(recipeId);
                const imageRecipe = resultImageRecipe.rows.map(file => ({
                    ...file,
                    src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
                }));

                return imageRecipe[0];
            }

            // Retorna as imagens das receitas do Chef
            const filePromiseRecipe = recipes.map(async recipe => {
                recipe.img = await getImageRecipe(recipe.id);
                
                return recipe;
            });

            const allRecipes = await Promise.all(filePromiseRecipe);

            return res.render('admin/chefs/chef', { chef, files, recipes: allRecipes });
        } catch (error) {
            console.log(error);
        }
    },
    // Carrega a página de edição de um Chef
    async editaChef(req, res) {
        try {
            /* Busca os dados do Chef para edição */
            let results = await Chefs.showChef(req.params.id);
            
            const chef = results.rows[0];
            // Busca a imagem do Chef
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
    // Comando PUT para do Chef editado
    async putChef(req, res) {
        try {
            const keys = Object.keys(req.body);
            // Verifica se todos os campos estão preenchidos
            for (key of keys) {
                if ((req.body.path == '' && req.file != undefined) || req.body[key] == '') {
                    return res.send('Preencha todos os campos.');
                }
            }
            // Update dos dados caso não seja alterado a imagem
            if (req.body.path != '' && req.file == undefined) {
                let resultIdImageChef = await Chefs.chefFile(req.body.id);
                const imageChef = resultIdImageChef.rows[0].id;
                
                resultIdImageChef = await Chefs.update(req.body, imageChef);
            } else {
                // Caso seja carregada uma imagem
                if (req.file == undefined || req.body.path == '') {
                    return res.send("Por favor, envie uma imagem.");
                }
                
                if (req.file != undefined) {
                    let fileChef = await Chefs.chefFile(req.body.id);

                    await Chefs.updateChefFileId(req.body.id);
                    
                    let fileChefDelete = fileChef.rows[0].id;

                    Files.deleteFileChef(fileChefDelete);
                }
                
                let results = await Files.createFile({ ...req.file });
                const fileId = results.rows[0].id;
                
                await Chefs.update(req.body, fileId);
            }

            return res.redirect(`/admin/chefs/chef/${req.body.id}`);
        } catch (error) {
            console.log(error);
            res.status(404).render("admin/chefs/chef/not-found");
        }   
    },
    // Comendo DELETE para registro do Chef
    async deletaChef(req, res) {
        let fileChef = await Chefs.chefFile(req.body.id);

        await Chefs.updateChefFileId(req.body.id);
        let fileChefDelete = fileChef.rows[0].id;
        
        Files.deleteFileChef(fileChefDelete);

        await Chefs.delete(req.body.id);

        return res.redirect('/admin/chefs');
    },

    notFound(req, res) {
        res.status(404).render("admin/chefs/not-found");
    }
}