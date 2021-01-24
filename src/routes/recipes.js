const express = require('express');
const routes = express.Router();

const recipes = require('../app/controllers/RecipesController');
const multer = require('../app/middlewares/multer');

const { onlyUsers } = require('../app/middlewares/session');

// ROTAS RECEITAS
routes.get('/', onlyUsers, recipes.index);
routes.get('/criar', onlyUsers, recipes.create);
routes.get('/recipe/:id', onlyUsers, recipes.exibe);
routes.get('/recipe/:id/editar', onlyUsers, recipes.edita);

routes.post('/', onlyUsers, multer.array('photos', 5), recipes.post);
routes.put('/', onlyUsers, multer.array('photos', 5), recipes.putRecipe);
routes.delete('/', onlyUsers, recipes.deleteRecipe);

routes.use('/not-found', recipes.notFound);

module.exports = routes;