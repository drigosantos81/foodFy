const express = require('express');
const routes = express.Router();

const recipes = require('../app/controllers/RecipesController');
const multer = require('../app/middlewares/multer');

// ROTAS RECEITAS
routes.get('/', recipes.index);
routes.get('/criar', recipes.create);
routes.get('/recipe/:id', recipes.exibe);
routes.get('/recipe/:id/editar', recipes.edita);

routes.post('/', multer.array('photos', 5), recipes.post);
routes.put('/', multer.array('photos', 5), recipes.putRecipe);
routes.delete('/', recipes.deleteRecipe);

routes.use('/not-found', recipes.notFound);

module.exports = routes;