const mailer = require('../../lib/mailer');
const User = require('../models/User');

module.exports = {
  async listUsers(req, res) {
    try {
      let resultesSessionId = await User.userLogged(req.session.userId);
      const userLogged = resultesSessionId.rows[0].name;

      let { success, error } = req.session;
      req.session.success = "", req.session.error = "";

      let results = await User.allUsers();
      const usersIndex = results.rows;

      if (!usersIndex) {
        return res.send('Nenhum registro encontrado');
      }

      return res.render('admin/users/index', { usersIndex, userLogged, success, error });
  } catch (error) {
      console.error(error);
    }
  },

  async create(req, res) {
    try {
      let resultesSessionId = await User.userLogged(req.session.userId);
      const userLogged = resultesSessionId.rows[0].name;

      return res.render('admin/users/criar', { userLogged });
    } catch (error) {
      console.error(error);
    }
  },

  async post(req, res) {
    try {
      let results = await User.post(req.body);
      const user = results.rows[0].id;

      req.session.user = user;

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

  async showUser(req, res) {
    try {
      let resultesSessionId = await User.userLogged(req.session.userId);
      const userLogged = resultesSessionId.rows[0].name;

      const results = await User.showUser(req.params.id);
      const user = results.rows[0];

      console.log('ShowUser Logado: ', user);

      return res.render(`admin/users/user`, { userLogged, user });
    } catch (error) {
      console.error(error);
    }
  },

  async showProfile(req, res) {
    try {
      let resultesSessionId = await User.userLogged(req.session.userId);
      const userLogged = resultesSessionId.rows[0].name;

      const { user } = req;

      console.log('ShowProfile Logado: ', user);

      return res.render(`admin/users/profile`, { userLogged, user });
    } catch (error) {
      console.error(error);
    }
  },

  async updateProfile(req, res) {
    // * Acesso do usuário ao próprio perfíl (ADMIN))
    try {
      const { user } = req;

      let { name, email } = req.body;

      await User.updateProfile(user.id, {
        name,
        email
      });

      return res.render('admin/users/profile', {
        user: req.body,
        success: 'Conta de Usuário atualizada com sucesso.'
      });

    } catch (error) {
      console.error(error);
      return res.render('admin/users/profile', {
        error: 'Erro inesperado, tente novamente.'
      });
    }
  },

  async updateUser(req, res) {
    // * Apenas o ADMIN acessa essa página (Visuzliza o perfíl de todos)
    try {
      console.log('REQ: ', req);
      const { user } = req;

      let { name, email, is_admin } = req.body;

      await User.updateUser(user.id, { // user
        name,
        email,
        is_admin
      });
      // const keys = Object.keys(req.body);

      // for (key of keys) {
      //   if (req.body[key] == "" && key != "removed_files") {
      //     return res.send("Por favor, preencha todos os campos.");
      //   }
      // }

      // await User.updateUser(req.body.id);

      req.session.success = 'Conta de Usuário atualizada com sucesso';

      return res.redirect('/admin/users');

    } catch (error) {
      console.error(error);
        req.session.error = 'Error inesperado, tente novamente.';
        return res.redirect('/admin/users');
    }
  },

  async delete(req, res) {
    try {
      const user = req.body.id;
      const userIndex = user.id;

      if (user) {
        await User.delete(user);
      }

      if (userIndex) {
        await User.delete(userIndex);
      }

      req.session.success = 'Conta de Usuário excluída com sucesso';

      return res.redirect('/admin/users');

    } catch (error) {
      console.error(error);
      return res.render('admin/users', {
        error: 'Erro ao tentar deletar a conta.'
      });
    }
  }

}