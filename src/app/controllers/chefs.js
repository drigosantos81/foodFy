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
            let results = await Chefs.showChef(req.params.id);
            const chef = results.rows[0];

            if (!chef) {
                return res.send('Receita não encontrada');
            }

            chef.created_at = date(chef.created_at).format;

            results = await Chefs.chefFile(chef.id);
            let files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
            }));

            let resultsRecipes = await Chefs.recipesFromChefs(req.params.id);
            const recipes = resultsRecipes.rows;

            results = await Chefs.filesRecipesFromChef(chef.id);
            let filesRecipes = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
            }));
            console.log(files);
            console.log(filesRecipes);

            return res.render('admin/chefs/chef', { chef, files, recipes, filesRecipes });
        } catch (error) {
            console.log(error);
        }
    },
    async editaChef(req, res) {
        try {
            let results = await Chefs.showChef(req.params.id);
            const chef = results.rows[0];

            return res.render('admin/chefs/editar', { chef });
        } catch (error) {
            console.log(error);
        }
        // Chefs.showChef(req.params.id, function(chef) {
        //     if (!chef) {
        //         return res.send('Chef não cadastrado ou não encontrado.');
        //     }

        //     chef.created_at = date(chef.created_at).format;

        //     return res.render('admin/chefs/editar', { chef });
        // });
    },
    async putChef(req, res) {
        try {
            const keys = Object.keys(req.body);

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send('Preencha todos os campos.');
                }
            }

            if (req.file == 0) {
                return res.send("Por favor, envie uma imagem.");
            }

            let results = await Files.createFile({ ...req.file });
            const fileId = results.rows[0].id;

            await Chefs.update(req.body, fileId);

            return res.redirect(`/admin/chefs/chef/${req.body.id}`);
        } catch (error) {
            console.log(error);
        }
    },
    deletaChef(req, res) {
        Chefs.delete(req.body.id, function() {
            return res.redirect('/admin/chefs');
        });
    }
}
// exports.notFound = function(req, res) {
//     res.status(404).render("/frontend/not-found");
// };