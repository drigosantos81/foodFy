const User = require('../models/User');

async function post(req, res, next) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "") {
      return res.render('admin/users/criar', {
        user: req.body,
        error: 'Por favor, preencha todos os campos.'
      });
    }
  }

  const { email } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (user) {
    return res.render('admin/users/criar', {
      user: req.body,
      error: 'Usuário já cadastrado.'
    });
  }

  next();
}

async function show(req, res, next) {
  const { userId: id } = req.session;

  const user = await User.findOne({ where: {id} });

  if (!user) {
    return res.render(`admin/user/criar`, {
      error: 'Usuário não encontrado.'
    });
  }

  req.user = user;

  next();
}

module.exports = {
  post,
  show
}