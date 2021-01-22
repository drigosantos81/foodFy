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
      console.log(error);
    }
  },

  create(req, res) {
    try {
      return res.render('admin/users/criar');
    } catch (error) {
      console.log(error);
    }
  },

  async post(req, res) {
    try {
      let results = await User.post(req.body);
      const userId = results.rows[0].id;

      req.session.userId = userId;

      return res.redirect(`/admin/users/user/${userId}`);
    } catch (error) {
      console.log(error);
    }
  },

  async showUser(req, res) {
    try {
      const { user } = req;

      return res.render(`admin/users/user`, { user });
    } catch (error) {
      console.log(error);
    }
  },

  async showProfile(req, res) {
    try {
      const results = await User.showUser(req.params.id);
      const user = results.rows[0];

      return res.render(`admin/users/profile`, { user });
    } catch (error) {
      console.log(error);
    }
  },

  async update(req, res) {
    try {
      
    } catch (error) {
      console.log(error);
    }
  }

}