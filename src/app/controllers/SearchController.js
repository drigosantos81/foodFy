const Recipes = require('../models/Recipes');
const Chefs = require('../models/Chefs');

module.exports = {
    // ==== PÁGINA DOS RESULTADOS DE UMA BUSCA ====
    async index(req, res) {
        try {
            let results,
            params = {}
        
            const { filter, chef } = req.query;
            // Se a busca não tiver resultado, retorna para a Home
            if (!filter) {
                return res.redirect('/');
            }

            params.filter = filter;

            if (chef) {
                params.chef = chef;
            }

            results = await Recipes.search(params);

            async function getImage(recipeId) {
                let results =  await Recipes.files(recipeId);
                const files = results.rows.map(file => ({
                    ...file,
                    src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
                }));

                return files[0];
            }

            const recipesPromise = results.rows.map(async recipe => {
                recipe.img = await getImage(recipe.id);

                return recipe;
            });

            const recipes = await Promise.all(recipesPromise);

            const search = {
                term: req.query.filter,
                total: recipes.length
            }

            const chefs = recipes.map(recipe => ({
                id: recipe.chef_id,
                name: recipe.chef_name
            })).reduce((chefsFiltered, chef) => {
                const found = chefsFiltered.some(chefFound => chefFound.id == chef.id);

                if (!found) {
                    chefsFiltered.push(chef);
                }

                return chefsFiltered
            }, []);

            return res.render('user/busca', { recipes, search, chefs });
        } catch (error) {
            console.log(error);
        }
    }
}