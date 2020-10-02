const Front = require('../models/Front');
const Recipes = require('../models/Recipes');
const Chefs = require('../models/Chefs');
const { date } = require('../../lib/utils');

module.exports = {
    // ==== PÁGINA INICIAL DO SITE ====
    async index(req, res) {
        const { filter } = req.query;
        
        if (filter) {
            try {
                console.log(filter);
                // let results = await Front.findBy();
                // const recipes = results.rows;

                // console.log(filter);

                // async function getImage(recipeId) {
                //     let results = await Recipes.files(recipeId);
                //     const files = results.rows.map(file => 
                //         `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
                //     );

                //     return files[0];
                // }

                // const filesPromise = recipes.map(async recipe => {
                //     recipe.img = await getImage(recipe.id);
                //     return recipe;
                // });

                // const allRecipe = await Promise.all(filesPromise);

                // return res.render('user/busca', { recipes: allRecipe, filter });

                // VERSÃO DE TESTE
                let results = await Front.findBy();
                const recipes = results.rows;

                return res.render('user/busca', { recipes, filter });                
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                let results = await Front.allIndex();
                const recipes = results.rows;

                if (!recipes) {
                    return res.send('Nenhuma receita encontrada');
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

                return res.render('user/index', { recipes: allRecipe });
            } catch (error) {
                console.log(error);
            }
        }
    },

    // ==== PÁGINA RECEITAS ====
    async receitas(req, res) {
        try {
            let results = await Front.allRecipes();
            const recipes = results.rows;

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

            return res.render('user/receitas', { recipes: allRecipe });
        } catch (error) {
                console.log(error);
        }
    },

    // ==== PÁGINA DE UMA RECEITA ====
    async recipe(req, res) {
        try {
            let results = await Front.findSelectedRecipe(req.params.id);
            const recipe = results.rows[0];

            if (!recipe) {
                return res.send('Receita não encontrada');
            }

            recipe.created_at = date(recipe.created_at).format;
            recipe.updated_at = date(recipe.updated_at).format;

            // Buscando imagens(arquivo)
            results = await Recipes.files(recipe.id);
            let files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
            }));

            return res.render('user/recipe', { recipe, files });
        } catch (error) {
            console.log(error);
        }
    },

    // ==== PáGINA SOBRE ====
    sobre(req, res) {
        return res.render('user/sobre');
    },

    // ============================== BUSCA ==============================
	async buscaRecipe(req, res) {
        try {
            let results,
                params = { }
            const { filter, chefs } = req.query;
            
            if (!filter) {
                return res.redirect('/');
            }
            
            params.filter = filter;
            
            if (chefs) {
                params.chefs = chefs;
            }
            
            results = await Front.findBy(params);        

            async function getImage(recipeId) {
                let results = await Recipes.files(recipeId);
                const files = results.rows.map(file => 
                    `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
                );
                return files[0];
            };

            const recipesPromise = results.rows.map(async recipe => {
                recipe.img = await getImage(recipe.id);
                return recipe;
            });

            const recipes = await Promise.all(recipesPromise);

            const search = {
                term: req.query.filter,
                total: recipes.length
            }

            const chefsAll = recipes.map(recipe => ({
                id: recipes.chef_id,
                name: recipes.chef_name
            })).reduce((chefsFiltered, chefs) => {
                const found = chefsFiltered.some(ch => ch.id == chefs.id);

                if (!found)
                    chefsFiltered.push(chefs);
                
                    return chefsFiltered;
            }, []);

            return res.render('user/busca', { recipes, search, chefsAll });
        } catch (error) {
            console.log(error);
        }

        // VERSÃO ORIGINAL SEM IMAGENS DO BANCO
		// Front.findBy(function(recipes, filter) {
        //     return res.render('user/busca', { recipes, filter });
        // }); 
	},

    // ==== CHEFS ====
    async chefs(req, res) {
        try {
            let results = await Front.allChefs();
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

            return res.render('user/chefs', { chefs: allChefs });
        } catch (error) {
            console.log(error);
        }

    },

    notFound(req, res) {
        return res.status(404).render('user/not-found');
    }
}