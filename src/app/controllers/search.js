const Front = require('../models/Front');
const Recipes = require('../models/Recipes');
const Chefs = require('../models/Chefs');
const { date } = require('../../lib/utils');

module.exports = {
    // ==== PÁGINA DOS RESULTADOS DE UMA BUSCA ====
    async index(req, res) {
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

            return res.render('user/busca', { recipes: allRecipe });
        } catch (error) {
            console.log(error);
        }
    }
}