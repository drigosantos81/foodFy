const User = require('../models/User');
const { compare } = require('bcryptjs');

async function login(req, res, next) {
  let { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
    });
    // Verifica se o usuário já existe
    if (!user) {
      return res.render('login/login', {
        user: req.body,
        error: 'Usuário não cadastrado. Clique no link abaixo.'
      });
    }
    // Verifica se a senha está correta
    const passed = await compare(password, user.password);
  
    if (!passed) {
      return res.render('login/login', {
        user: req.body,
        error: 'Senha incorreta.'
      });
    }
  
    req.user = user;
  
    next();
  } catch (error) {
    console.error(error);
  }
}

// Posto do Forgot password
async function forgot(req, res, next) {
  const { email } = req.body;
  try {
    let user = await User.findOne({ where: { email }});

    if (!user) {
      return res.render('login/forgot', {
        user: req.body,
        error: 'E-mail não cadastrado.'
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
  }
}

async function reset(req, res, next) {
  const { email, password, passwordRepeat, token } = req.body;

  // Procurar Usuário
  const user = await User.findOne({
    where: { email },
  });

  // Verifica se o usuário já existe
  if (!user) {
    return res.render('login/new-password', {
      user: req.body,
      token,
      error: 'Usuário não cadastrado.'
    });
  }

  // Conferir as senhas
  if (password != passwordRepeat) {
    return res.render('login/new-password', {
      user: req.body,
      token,
      error: 'As senhas digitadas não estão iguais.'
    });
  }

  // Verificar se o Token está correto
  if (token != user.reset_token) {
    return res.render('login/new-password', {
      user: req.body,
      token,
      error: 'Token inválido. Faça uma nova solicitação.'
    });
  }

  // Verificar se o Token expirou
  let now = new Date();
  now = now.setHours(now.getHours());

  if (now > user.reset_token_expires) {
    return res.render('login/new-password', {
      user: req.body,
      token,
      error: 'Token expirado. Faça uma nova solicitação.'
    });
  }

  req.user = user;

  next();
}

module.exports = {
  login,
  forgot,
  reset
}