const crypto = require('crypto');
const { hash } = require('bcryptjs');

const mailer = require('../../lib/mailer');
const User = require('../models/User');

module.exports = {
  access(req, res) {
    try {
      return res.render('login/new-access');
    } catch (error) {
      console.log(error);
    }    
  },

  async postAccess(req, res) {
    try {

      await mailer.sendMail({
        to: user.email,
        from: 'nao-responda@foodfy.com.br',
        subject: 'Solicitação de acesso ao FoodFy',
        html: `
          <h2>Dados para cadastro de novo Usuário</h2>
          <p>Clique no link abaixo criar sua senha.</p>
          <p>
            <a href="http://localhost:3000/admin/users/criar?token=${token}" target="_blank">
            Criar senha.
          </a>
          </p>
        `
      });
    } catch (error) {
      console.error(error);
    }
  },

  login(req, res) {
    try {
      return res.render('login/login');
    } catch (error) {
      console.log(error);
    }    
},

  postLogin(req, res) {
    try {
      req.session.userId = req.user.id;

      return res.redirect(`/admin/users/profile`);
    } catch (error) {
      console.log(error);
    }    
  },

  forgot(req, res) {
    try {
      return res.render('login/forgot');
    } catch (error) {
      console.log(error);
    }
  },

  async postForgot(req, res) {
    const user = req.user;
    
    try {
      // Criação do Token
      const token = crypto.randomBytes(20).toString('hex');
      // Expiração do TOken
      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      await User.updateProfile(user.id, {
        reset_token: token,
        reset_token_expires: now
      });

      await mailer.sendMail({
        to: user.email,
        from: 'nao-responda@foodfy.com.br',
        subject: 'Recuperação de senha',
        html: `
          <h2>Esqueceu a senha?</h2>
          <p>Clique no link abaixo para recuperar.</p>
          <p>
            <a href="http://localhost:3000/login/new-password?token=${token}" target="_blank">
            Recuperar senha
          </a>
          </p>
        `
      });

      return res.render('login/forgot', {
        success: 'Verifique seu E-mail.'
      });
    } catch (error) {
      console.error(error);
      return res.render('login/forgot', {
        error: 'Erro inesperado. Tente novamente.'
      });
    }
  },

  newPassword(req, res) {
    try {
      return res.render('login/new-password', { token: req.query.token });
    } catch (error)  {
      console.log(error);
    }
  },

  async postReset(req, res) {
    const user = req.user;
    const { password, token } = req.body;

    try {
      // Cria novo hash de senha
      const newPassword = await hash(password, 8);

      // Atualiza o Usuário
      await User.updateProfile(user.id, {
        password: newPassword,
        reset_token: '',
        reset_token_expires: ''
      });

      // Avisa o Usuário que ele tem uma nova senha
      return res.render('login/login', {
        user: req.body,
        success: 'Senha atualizada. Faça seu login.'
      });

    } catch (error) {
      console.error(error);
      return res.render('login/new-password', {
        user: req.body,
        token,
        error: 'Erro inesperado. Tente novamente.'
      });
    }
  },

  logout(req, res) {
    req.session.destroy();
    return res.redirect('/');
  }
}