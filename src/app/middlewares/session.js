const User = require('../models/User');

async function onlyUsers(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  next();
}

async function aUser(req, res, next) {
  const results = await User.showUser(req.session.userId);
  const userSessionLogged = results.rows[0];

  next(userSessionLogged);
}

async function isAdmin(req, res, next) {
  const results = await User.showUser(req.session.userId);
  const user = results.rows[0];

  if (user.is_admin != true) {
    return res.render('admin/users/profile', {
      user: req.body,
      error: 'Acesso permitido apenas para o Administrador'
    });
  } 

  next();
}

module.exports = {
  onlyUsers,
  isAdmin,
  aUser
}