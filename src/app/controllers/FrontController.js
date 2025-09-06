const Front = require('../models/Front');
const Recipes = require('../models/Recipes');
const Chefs = require('../models/Chefs');
const User = require('../models/User');
const LoadRecipeService = require('../services/LoadRecipeService');

const { date } = require('../../lib/utils');

module.exports = {
	// ==== PÁGINA INICIAL DO SITE ====
	async index(req, res) {
		try {
			let resultesSessionId = await User.userLogged(req.session.userId);
			const sessionName = resultesSessionId.rows[0];

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

			return res.render('visit/index', { recipes: allRecipe, sessionName });

		} catch (error) {
			console.log(error);
		}
	},

	// ==== PÁGINA RECEITAS ====
	async recipes(req, res) {
		try {
			let resultesSessionId = await User.userLogged(req.session.userId);
			const sessionName = resultesSessionId.rows[0];

			let results = await Front.allRecipes();
			const recipes = results.rows;

			async function getImage(recipeId) {
				let results = await Recipes.files(recipeId);
				const files = results.rows.map(file => 
					`${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
				);

				return files[0];
			}

			recipes.created_at = date(recipes.created_at).format;

			const filesPromise = recipes.map(async recipe => {
				recipe.img = await getImage(recipe.id);

				recipe.created_at = date(recipe.created_at).format;

				return recipe;
			});

			const allRecipe = await Promise.all(filesPromise);

			return res.render('visit/recipes', { recipes: allRecipe, sessionName });

		} catch (error) {
			console.log(error);
		}
	},

	// ==== PÁGINA DE UMA RECEITA ====
	async recipe(req, res) {
		try {
			let resultesSessionId = await User.userLogged(req.session.userId);
			const sessionName = resultesSessionId.rows[0];

			let results = await Front.findSelectedRecipe(req.params.id);
			const recipe = results.rows[0];

			if (!recipe) {
				return res.send('Receita não encontrada');
			}

			recipe.created_at = date(recipe.created_at).format;

			const { year, month, day } = date(recipe.updated_at);

			recipe.published = {
				year,
				month,
				day: `${day}/${month}/${year}`
			}
			
			recipe.updated_at = date(recipe.updated_at).format;

			// Buscando imagens(arquivo)
			results = await Recipes.files(recipe.id);
			let files = results.rows.map(file => ({
				...file,
				src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
			}));


			return res.render('visit/recipe', { recipe, files, sessionName });

		} catch (error) {
				console.log(error);
		}
	},

	// ==== PáGINA SOBRE ====
	async sobre(req, res) {
		let resultesSessionId = await User.userLogged(req.session.userId);
		const sessionName = resultesSessionId.rows[0];

		return res.render('visit/sobre', { sessionName });
	},

	// ==== CHEFS ====
	async chefs(req, res) {
		try {
			let resultesSessionId = await User.userLogged(req.session.userId);
			const sessionName = resultesSessionId.rows[0];

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

			return res.render('visit/chefs', { chefs: allChefs, sessionName });

		} catch (error) {
			console.log(error);
		}
	},

	// ==== PÁGINA NÃO ENCONTRADA ====
	async notFound(req, res) {
		let resultesSessionId = await User.userLogged(req.session.userId);
		const sessionName = resultesSessionId.rows[0];

		return res.status(404).render('visit/not-found', { sessionName });
	}
}