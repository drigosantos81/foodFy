const express = require('express');
const routes = express.Router();

const front = require('../app/controllers/FrontController');

const recipes = require('./recipes');
const chefs = require('./chefs');
const search = require('./search');
const users = require('./users');

// NAVEGAÇÃO USUÁRIO VISITANTE
routes.get('/', front.index);
routes.get('/sobre', front.sobre);
routes.get('/receitas', front.receitas);
routes.get('/chefs', front.chefs);
routes.get('/recipe/:id', front.recipe);
routes.use('/not-found', front.notFound);

routes.use('/', search);

// VALIDAÇÃO DE USUÁRIOS
routes.use('/users', users);

// ROTAS ADMINISTRATIVAS
routes.use('/admin/recipes', recipes);
routes.use('/admin/chefs', chefs);

module.exports = routes;