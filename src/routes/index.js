const express = require('express');
const routes = express.Router();

const front = require('../app/controllers/FrontController');

const recipes = require('./recipes');
const chefs = require('./chefs');
const search = require('./search');

// HOME/START
routes.get('/', front.home);

// NAVEGAÇÃO USUÁRIO
routes.get('/user', front.index);
routes.get('/sobre', front.sobre);
routes.get('/receitas', front.receitas);
routes.get('/chefs', front.chefs);
routes.get('/recipe/:id', front.recipe);
routes.use('/not-found', front.notFound);

routes.use('/', recipes);
routes.use('/', chefs);
routes.use('/', search);

module.exports = routes;