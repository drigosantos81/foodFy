const express = require('express');
const routes = express.Router();

const recipes = require('../app/controllers/RecipesController');
const multer = require('../app/middlewares/multer');

// ROTAS RECEITAS
routes.get('/admin/recipes', recipes.index);
routes.get('/admin/recipes/criar', recipes.create);
routes.get('/admin/recipes/recipe/:id', recipes.exibe);
routes.get('/admin/recipes/recipe/:id/editar', recipes.edita);

routes.post('/admin/recipes', multer.array('photos', 5), recipes.post);
routes.put('/admin/recipes', multer.array('photos', 5), recipes.putRecipe);
routes.delete('/admin/recipes', recipes.deleteRecipe);

routes.use('/admin/recipes/not-found', recipes.notFound);

module.exports = routes;