const Front = require('../models/Front');
const Recipes = require('../models/Recipes');
const Chefs = require('../models/Chefs');
const Files = require('../models/Files');
const { age, date, birthDay } = require('../../lib/utils');

module.exports = {
    
    async index(req, res) {
        const { filter } = req.query;

        if (filter) {
            Front.findBy(filter, function(recipes) {
                return res.render('frontend/busca', { recipes });
            }); 
        } else {
            try {
                let results = await Front.allIndex();
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

                return res.render('frontend/index', { recipes: allRecipe });
            } catch (error) {
                    console.log(error);
            }
        }
    },

    sobre(req, res) {
        return res.render('frontend/sobre');
    },

    // ==== RECEITAS ====
    async receitas(req, res) {
        try {
            let results = await Front.all();
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

            return res.render('frontend/receitas', { recipes: allRecipe });
        } catch (error) {
                console.log(error);
        }

        // Front.all(function(recipes) {
        //     return res.render('frontend/receitas', { recipes });
        // });
    },

	buscaRecipe(req, res) {
		Front.findBy(function(recipes, filter) {
            return res.render('frontend/busca', { recipes, filter });
        }); 
	},

    prato(req, res) {
        Front.find(req.params.id ,function(recipe) {
            if (!recipe) {
                return res.send('Receita não encontrada');
            }

            return res.render('frontend/prato', { recipe });
        });
    },

    // ==== CHEFS ====
    chefs(req, res) {
        Front.allChefs(function(chefs) {
            return res.render('frontend/chefs', { chefs });
        });
    },

    notFound(req, res) {
        res.status(404).render("/frontend/not-found");
    }

}
