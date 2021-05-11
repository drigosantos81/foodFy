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

async function post(req, res, next) {
  // Verifica se todos os campos estão preenchidos
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) {
    return res.render('admin/users/criar', fillAllFields);
  }
  
  let { email } = req.body;

  const user = await User.findOne({
    where: { email },
  });
  // Verifica se o usuário já existe
  if (user) {
    return res.render('admin/users/criar', {
      user: req.body,
      error: 'Usuário já cadastrado.'
    });
  }

  next();
}

async function showProfile(req, res, next) {
  console.log('{ userId: id }: ', req.session);
  
  const { userId: id } = req.session;

  const user = await User.findOne({ where: {id} });

  console.log('ShowUser-profile:', user);

  if (!user) {
    return res.render(`admin/user/profile`, {
      error: 'Usuário não encontrado.'
    });
  }

  req.user = user;

  next();
}

async function updateProfile(req, res, next) {
  // Verifica se todos os campos estão preenchidos
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) {
    return res.render('admin/users/profile', fillAllFields);
  }
// Verifica a senha
  const { id, password } = req.body;

  if (!password) {
    return res.render('admin/users/profile', {
      user: req.body,
      error: 'Informe sua senha para atualizar seu cadastro.'
    });
  }

  const user = await User.findOne({ where: {id} });

  const passed = await compare(password, user.password);

  if (!passed) {
    return res.render('admin/users/profile', {
      user: req.body,
      error: 'Senha incorreta.'
    });
  }

  req.user = user;

  next();
}

async function showUSer(req, res, next) {
  console.log('{ userId: id }: ', req.session);
  
  const { userId: id } = req.session;

  const user = await User.findOne({ where: {id} });

  // const results = await User.showUser(req.params.id);
  // const user = results.rows[0];

  console.log('ShowUser-user:', user);

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
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) {
    return res.render('admin/users/user', fillAllFields);
  }

  const { id } = req.params;

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
  post,
  showUSer,
  showProfile,
  updateProfile,
  updateUser,
  postRecipe
}