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
      return res.render('admin/users/criar');
    } catch (error) {
      console.error(error);
    }
  },

  async post(req, res) {
    try {
      let results = await User.post(req.body);
      const userId = results.rows[0].id;

      req.session.userId = userId;

      return res.redirect(`/admin/users/user/${userId}`);
    } catch (error) {
      console.error(error);
    }
  },

  async showUser(req, res) {
    try {
      const { user } = req;

      return res.render(`admin/users/user`, { user });
    } catch (error) {
      console.error(error);
    }
  },

  async showProfile(req, res) {
    try {
      const results = await User.showUser(req.params.id);
      const user = results.rows[0];

      return res.render(`admin/users/profile`, { user });
    } catch (error) {
      console.error(error);
    }
  },

  async updateProfile(req, res) {
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