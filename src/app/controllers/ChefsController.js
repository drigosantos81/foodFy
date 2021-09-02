const Chefs = require('../models/Chefs');
const Files = require('../models/Files');
const User = require('../models/User')
const { date } = require('../../lib/utils');

module.exports = {
	// RETORNA OS DADOS DE TODOS OS CHEFS
	async index(req, res) {
		try {
			let resultesSessionId = await User.userLogged(req.session.userId);
			const userLoggedId = resultesSessionId.rows[0].id;
			const userLogged = resultesSessionId.rows[0].name;
			
			let { success, error } = req.session;
			req.session.success = "", req.session.error = "";

			// Retorna todos os dados dos Chefs cadastrados
			let results = await Chefs.all();
			const chefs = results.rows;

			const user = req.session.userId;

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

			return res.render('admin/chefs/index', { userLogged, userLoggedId, chefs: allChefs, user, success, error });
	} catch (error) {
			console.log(error);
		}
	},

	// CARREGA AS INFORMAÇÕES PARA UM NOVO CHEF
	async createChef(req, res) {
		let resultesSessionId = await User.userLogged(req.session.userId);
		const userLoggedId = resultesSessionId.rows[0].id;
		const userLogged = resultesSessionId.rows[0].name;
			
		let { success, error } = req.session;
		req.session.success = "", req.session.error = "";

		const user = req.session.userId;

		return res.render("admin/chefs/criar", { userLogged, userLoggedId, user, success, error });
	},

	// COMANDO POSTO PARA UM NOVO CHEF
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
			let fileResults = await Files.createFile({ ...req.file });
			const fileId = fileResults.rows[0].id;

			// Salva os dados do Chef
			const results = await Chefs.post(req.body, fileId);
			const chefId = results.rows[0].id;

			req.session.success = 'Chef cadastrado com sucesso.';

			return res.redirect(`/admin/chefs/chef/${chefId}`);

		} catch (error) {
			console.error(error);
			req.session.error = 'Erro inesperado, tente novamente.'
      return res.redirect(`/admin/chefs/criar`);
		}
	},

	// RETORNA OS DADOS DE UM CHEF
	async exibeChef(req, res) {
		try {
			let resultesSessionId = await User.userLogged(req.session.userId);
			const userLoggedId = resultesSessionId.rows[0].id;
			const userLogged = resultesSessionId.rows[0].name;
			
			let { success, error } = req.session;
			req.session.success = "", req.session.error = "";

			// Retorna os dados do Chef selecionado
			let results = await Chefs.showChef(req.params.id);
			const chef = results.rows[0];

			const user = req.session.userId;

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

			return res.render('admin/chefs/chef', { userLogged, userLoggedId, chef, files, recipes: allRecipes, user, success, error });
		} catch (error) {
			console.log(error);
		}
	},

	// RETORNA OS DADOS DOS CAMPOS PARA EDIÇÃO DO CHEF
	async editaChef(req, res) {
		try {
			let resultesSessionId = await User.userLogged(req.session.userId);
			const userLoggedId = resultesSessionId.rows[0].id;
			const userLogged = resultesSessionId.rows[0].name;
			
			/* Busca os dados do Chef para edição */
			let results = await Chefs.showChef(req.params.id);

			const user = req.session.userId;
			
			const chef = results.rows[0];
			// Busca a imagem do Chef
			results = await Chefs.chefFile(chef.id);
			let files = results.rows.map(file => ({
				...file,
				src: `${req.protocol}://${req.headers.host}${file.path.replace('img', '')}`
			}));

			return res.render('admin/chefs/editar', { userLogged, userLoggedId, chef, files, user });
		} catch (error) {
				console.log(error);
		}
	},

	// COMANDO PUT PARA ATUALIZAÇÃO DO CHEF
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

			req.session.success = 'Dados do Chef atualizado com sucesso.';
      
      return res.redirect(`/admin/chefs/chef/${req.body.id}`);

    } catch (error) {
      console.error(error);
      req.session.error = 'Erro inesperado, tente novamente.'
      return res.redirect(`/admin/chefs/chef/${req.body.id}`);
    }
	},

	// COMANDO DELETE PARA O REGISTRO DE UM CHEF
	async deletaChef(req, res) {
		try {
			let fileChef = await Chefs.chefFile(req.body.id);

			await Chefs.updateChefFileId(req.body.id);

			let fileChefDelete = fileChef.rows[0].id;        
			Files.deleteFileChef(fileChefDelete);

			await Chefs.delete(req.body.id);

			req.session.success = 'Chef excluído do FoodFy com sucesso.';

			return res.redirect('/admin/chefs');

		} catch (error) {
			console.error(error);
      req.session.error = 'Erro inesperado, tente novamente.'
      return res.redirect(`/admin/chefs`);
		}
	},

	// PÁGINA NÃO ENCONTRADA
	notFound(req, res) {
		res.status(404).render("admin/chefs/not-found");
	}
}