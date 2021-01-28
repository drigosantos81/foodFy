const User = require('../models/User');

function onlyUsers(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  next();
}

async function isAdmin(req, res, next) {
  const results = await User.showUser(req.session.userId);
  const user = results.rows[0].is_admin;

  console.log('Campos userId.is_admin: ', user);

  if (user != true) {
    return res.render('admin/users', {
      error: 'Acesso permitido apenas para o Administrador'
    });
  } 

  next();
}

module.exports = {
  onlyUsers,
  isAdmin
}