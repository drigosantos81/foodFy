const mailer = require('../../lib/mailer');
const User = require('../models/User');
const Recipes = require('../models/Recipes');

module.exports = {
  async listUsers(req, res) {
    try {
      // Menu de opções do Usúario
      let resultesSessionId = await User.userLogged(req.session.userId);
      const userLoggedId = resultesSessionId.rows[0].id;
      const userLogged = resultesSessionId.rows[0].name;
      
      // Mensagem para o Usuário
      let { success, error } = req.session;
      req.session.success = "", req.session.error = "";

      // Retorna todos os Usúarios dos sistema
      let results = await User.allUsers();
      const usersIndex = results.rows;

      if (!usersIndex) {
        return res.send('Nenhum registro encontrado');
      }

      return res.render('admin/users/index', { userLogged, userLoggedId, usersIndex, success, error });
    } catch (error) {
        console.error(error);
      }
  },

  async create(req, res) {
    try {
      let resultesSessionId = await User.userLogged(req.session.userId);
      const userLoggedId = resultesSessionId.rows[0].id;
      const userLogged = resultesSessionId.rows[0].name;

      return res.render('admin/users/criar', { userLoggedId, userLogged });
    } catch (error) {
      console.error(error);
    }
  },

  async post(req, res) {
    try {
      // POST do novo Usúario
      let results = await User.post(req.body);
      const user = results.rows[0].id;

      req.session.user = user;

      // Retorna os dados do novo Usúario criado
      const resultUser = await User.showUser(user);
      const userData = resultUser.rows[0];

      await mailer.sendMail({
        to: userData.email,
        from: 'nao-responda@foodfy.com.br',
        subject: 'Acesso ao FoodFy',
        html: `
          <h2>Bem vindo ao FoodFy</h2>
          <p>Clique no link abaixo criar sua senha.</p>
          <p>
            <a href="http://localhost:3000/login/new-password?token=${userData.reset_token}" target="_blank">
              Criar senha.
            </a>
          </p>
        `
      });

      req.session.success = 'Nova conta de Usuário criada com sucesso.';

      return res.redirect('/admin/users');

    } catch (error) {
      console.error(error);
      return res.render('admin/users/criar', {
        error: 'Erro inesperado. Tente novamente.'
      });
    }
  },

  async showProfile(req, res) {
    try {
      // Menu de opções do Usúario
      let resultesSessionId = await User.userLogged(req.session.userId);
      const userLoggedId = resultesSessionId.rows[0].id;
      const userLogged = resultesSessionId.rows[0].name;
      const { user } = req;

      return res.render(`admin/users/profile`, { userLogged, userLoggedId, user });
    } catch (error) {
      console.error(error);
    }
  },

  async updateProfile(req, res) { // * Acesso do Usuário ao próprio perfíl
    try {
      const { user } = req;
      let { name, email } = req.body;

      await User.updateProfile(user.id, {
        name,
        email
      });

      let resultesSessionId = await User.userLogged(req.session.userId);
      const userLoggedId = resultesSessionId.rows[0].id;
      const userLogged = resultesSessionId.rows[0].name;

      return res.render('admin/users/profile', {
        userLoggedId,
        userLogged,
        user,
        success: 'Conta de Usuário atualizada com sucesso.'
      });

    } catch (error) {
      console.error(error);
      return res.render('admin/users/profile', {
        error: 'Erro inesperado, tente novamente.'
      });
    }
  },

  async showRecipesProfile(req, res) {
    try {
      // Menu de opções do Usúario
      let resultesSessionId = await User.userLogged(req.session.userId);
      const userLoggedId = resultesSessionId.rows[0].id;
      const userLogged = resultesSessionId.rows[0].name;
      let results = await User.recipesUser(userLoggedId);
      const userRecipe = results.rows;
      
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

      return res.render(`admin/users/busca-user`, { userLogged, userLoggedId, userRecipe, recipes, search, chefs });
    } catch (error) {
      console.error(error);
    }
  },

  async delete(req, res) {
    try {
      const user = req.body.id;
      const userIndex = user.id;
      let resultesSessionId = await User.userLogged(req.session.userId);
      const userLoggedId = resultesSessionId.rows[0].id;

      if (userLoggedId != user) {
        if (user) {
          await User.delete(user);
        }
  
        if (userIndex) {
          await User.delete(userIndex);
        }
  
        req.session.success = 'Conta de Usuário excluída com sucesso';
  
        return res.redirect('/admin/users');
      } else {
        req.session.error = 'Usuário não pode excluir a própria conta!'

        return res.redirect(`/admin/users`);
      }
    } catch (error) {
      console.error(error);
      return res.render('admin/users', {
        error: 'Erro ao tentar deletar a conta.'
      });
    }
  }
}