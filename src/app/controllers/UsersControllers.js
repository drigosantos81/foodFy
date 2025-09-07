const mailer = require('../../lib/mailer');
const User = require('../models/User');

module.exports = {
  async showUser(req, res) {
    try {
      console.log("REQ.BODY:", req.body);

      // Menu de opções do Usúario
      let resultesSessionId = await User.userLogged(req.session.userId);
      const userLoggedId = resultesSessionId.rows[0].id;
      const userLogged = resultesSessionId.rows[0].name;
      const { user } = req;
      const results = await User.showUser(req.params.id);
      const userNoAdmin = results.rows[0];

      return res.render(`admin/users/user`, { userLogged, userLoggedId, user, userNoAdmin });
    } catch (error) {
      console.error(error);
    }
  },

  async updateUser(req, res) { // * Apenas o ADMIN acessa essa página (Pode visuzlizar e alterar o perfíl de todos)
    try {
      console.log("REQ.BODY:", req.body);
      console.log(req.session.userId);

      // const { user } = req;
      let { name, email } = req.body;
      const is_admin = req.body.is_admin ? true : false;

      const results = await User.showUser(req.params.id);
      const userNotLogged = results.rows[0];
      console.log("REQ.BODY:", req.body);

      await User.updateUser(userNotLogged.id, { // user
        name,
        email,
        is_admin: is_admin || false
      });

      req.session.success = 'Conta de Usuário atualizada com sucesso';

      return res.redirect(`/admin/users/user/${userNotLogged.id}`);

    } catch (error) {
      console.error(error);
        req.session.error = 'Erro inesperado, tente novamente.';
        return res.redirect('/admin/users');
    }
  },
}