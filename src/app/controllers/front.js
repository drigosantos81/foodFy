const Front = require('../models/Front');
const Recipes = require('../models/Recipes');
const Chefs = require('../models/Chefs');
const Files = require('../models/Files');
const { age, date, birthDay } = require('../../lib/utils');

module.exports = {
    // ==== PÁGINA INICIAL DO USÁRIO ====
    async index(req, res) {
        const { filter } = req.query;
        console.log(filter);

        if (filter) {
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
            // Front.findBy(filter, function(recipes) {
            //     return res.render('user/busca', { recipes, filter });
            // });
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

                return res.render('user/index', { recipes: allRecipe, filter });
            } catch (error) {
                console.log(error);
            }
        }
    },

    sobre(req, res) {
        return res.render('user/sobre');
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

            return res.render('user/receitas', { recipes: allRecipe });
        } catch (error) {
                console.log(error);
        }
    },

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

    async recipe(req, res) {
            try {
                let results = await Front.findSelectedRecipe(req.params.id);
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
    
                return res.render('user/recipe', { recipe, files });
            } catch (error) {
                console.log(error);
            }
        },

    // ==== CHEFS ====
    chefs(req, res) {
        Front.allChefs(function(chefs) {
            return res.render('user/chefs', { chefs });
        });
    },

    notFound(req, res) {
        return res.status(404).render('user/not-found');
    }

}