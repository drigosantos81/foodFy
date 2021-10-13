const User = require('../models/User');
const { compare } = require('bcryptjs');

function checkAllFields(body) {  
  const keys = Object.keys(body);
  
  for (key of keys) {
    if (body[key] == "") {
      return {
        user: body,
        error: 'Por favor, preencha todos os campos.'
      };
    }
  }
}

async function showUSer(req, res, next) {
  const { userId: id } = req.session;
  const user = await User.findOne({ where: {id} });
  const results = await User.showUser(req.params.id);
  const userParamsId = results.rows[0];

  if (!user) {
    return res.render(`admin/user/criar`, {
      error: 'Usuário não encontrado.'
    });
  }

  req.user = user;

  next();
}

async function updateUser(req, res, next) {
  // Verifica se todos os campos estão preenchidos
  // const fillAllFields = checkAllFields(req.body);
  // const { id } = req.body;
  const { id } = req.params;

  if (fillAllFields) {
    return res.render(`admin/users/user`, fillAllFields);
  }
  
  const user = await User.findOne({ where: {id} });

  req.user = user;

  next();
}

async function postRecipe(req, res, next) {
  // Verifica se todos os campos estão preenchidos
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) {
    return res.render('admin/recipes/criar', fillAllFields);
  }

  next();
}

module.exports = {
  showUSer,
  updateUser,
  postRecipe
}