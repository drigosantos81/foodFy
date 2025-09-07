const User = require('../models/User');
const { compare } = require('bcryptjs');
// const checkAllFields = require('.checkAllFields');

function checkAllFields(body, ignoreFields = []) {  
  const keys = Object.keys(body);
  
  for (key of keys) {
    if (ignoreFields.includes(key)) {
      continue
    }

    if (!body[key] || body[key].trim() === "") {
      return {
        user: body,
        error: 'Por favor, preencha todos os campos.'
      };
    }
  }
  //   if (body[key] == "") {
  //     return {
  //       user: body,
  //       error: 'Por favor, preencha todos os campos.'
  //     };
  //   }
  // }
}

async function showUser(req, res, next) {
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
  console.log("REQ.BODY:", req.body);
  console.log(req.session.userId);
  // const loggedUserId = req.params.userId;

  const { id } = req.params;
  const loggedUserId = req.session.userId;

  // Busca os usuários envolvidos
  const userToUpdate = await User.findOne({ where: { id }});
  const loggedUser = await User.findOne({ where: { id: loggedUserId }});

  if (!userToUpdate || !loggedUser) {
    return res.render(`admin/users/user`, {
      error: `Usuário não encontrado.`
    });
  }

  const isAdmin = loggedUser.is_admin;
  const isSelfUpdate = id == loggedUserId;

  // Ignora o campo 'password' se for admin ou se estiver atualizando outro usuário
  const ignoreFields = isAdmin ? ['password'] : [];

  // Valida se todos os campos obrigatórios foram preenchidos
  const fillAllFields = checkAllFields(req.body, ignoreFields);
  // const fillAllFields = checkAllFields(req.body, [`password`]);

  if (fillAllFields) {
    return res.render(`admin/users/user`, fillAllFields);
  }

  // Se não for admin e estiver tentando atualizar o próprio perfil, exige senha
  if (!isAdmin && isSelfUpdate) {
    const { password } = req.body;

    if (!password) {
      return res.render(`admin/users/user`, {
        user: req.body,
        error: 'Informe sua senha para atualizar seu cadastro.'
      });
    }

    const passwordMatch = await compare(password, loggedUser.password);

    if (!passwordMatch) {
      return res.render(`admin/users/user`, {
        user: req.body,
        error: 'Senha incorreta.'
      });
    }
  }

  req.user = userToUpdate;
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
  showUser,
  updateUser,
  postRecipe
}