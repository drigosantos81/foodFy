const mailer = require('../../lib/mailer');
const User = require('../models/User');

module.exports = {
  async listUsers(req, res) {
    try {
      let results = await User.allUsers();
      const users = results.rows;

      if (!users) {
        return res.send('Nenhum registro encontrado');
      }

      return res.render('admin/users/index', { users });
  } catch (error) {
      console.error(error);
    }
  },

  create(req, res) {
    try {
      const userLogin = req.session.userId;

      return res.render('admin/users/criar', { userLogin });
    } catch (error) {
      console.error(error);
    }
  },

  async post(req, res) {
    try {
      // // Criação do Token
      // const token = crypto.randomBytes(20).toString('hex');
      // // Expiração do TOken
      // let now = new Date();
      // now = now.setHours(now.getHours() + 1);

      // // await User.updateProfile(user.id, {
      // //   reset_token: token,
      // //   reset_token_expires: now
      // // });      

      let results = await User.post(req.body);
      const user = results.rows[0].id;

      req.session.user = user;

      const resultEmail = await User.showUser(user);
      const userEmail = resultEmail.rows[0];

      await mailer.sendMail({
        to: userEmail.email,
        from: 'nao-responda@foodfy.com.br',
        subject: 'Acesso ao FoodFy',
        html: `
          <h2>Bem vindo ao FoodFy</h2>
          <p>Clique no link abaixo criar sua senha.</p>
          <p>
            <a href="http://localhost:3000/login/new-password" target="_blank">
            Criar senha.
          </a>
          </p>
        `
      });
      // ?token=${token}
      
      return res.render('admin/users/criar', {
        success: 'Token do novo Usuário enviado com sucesso.'
      });
    } catch (error) {
      console.error(error);
    }
  },

  async showUser(req, res) {
    try {
      const results = await User.showUser(req.params.id);
      const user = results.rows[0];

      console.log('ShowUser de qualquer um selecionado: ', user);

      return res.render(`admin/users/user`, { user });
    } catch (error) {
      console.error(error);
    }
  },

  async showProfile(req, res) {
    try {
      const { user } = req;

      console.log('ShowProfile Logado: ', user);

      return res.render(`admin/users/profile`, { user });
    } catch (error) {
      console.error(error);
    }
  },

  async updateProfile(req, res) {
    // * Acesso do usuário ao próprio perfíl
    try {
      const { user } = req;

      let { name, email } = req.body;

      await User.updateProfile(user.id, {
        name,
        email/*,
        password*/
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
    // * Apenas o ADMIN acessa essa página(Visuzliza o perfíl de todos)
    try {
      let { name, email, is_admin } = req.body;


    } catch (error) {
      console.error(error);
      return res.render('admin/users/user', {
        error: 'Erro inesperado, tente novamente.'
      });
    }
  }

}