const User = require('../models/User');

async function post( req, res, next) {
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

  return next();
}

module.exports = {
  post
}