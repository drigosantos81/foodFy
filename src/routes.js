const express = require('express');
const routes = express.Router();

const front = require('./app/controllers/front');
const recipes = require('./app/controllers/recipes');
const chefs = require('./app/controllers/chefs');
const multer = require('./app/middlewares/multer');

// HOME/START
routes.get('/', function(req, res) {
    return res.redirect('/user');
});

/* ------- USER ------- */

routes.get('/user', front.index);
routes.get('/sobre', front.sobre);
routes.get('/receitas', front.receitas);
routes.get('/chefs', front.chefs);
routes.get('/busca', front.index);
routes.get('/prato/:id', front.prato);
routes.use('/not-found', front.notFound);

/* ------- ADMIN ------- */

// ROTAS RECEITAS
routes.get('/admin/recipes', recipes.index);
routes.get('/admin/recipes/criar', recipes.create);
routes.get('/admin/recipes/prato/:id', recipes.exibe);
routes.get('/admin/recipes/prato/:id/editar', recipes.edita);

routes.post('/admin/recipes', multer.array('photos', 5), recipes.post);
routes.put('/admin/recipes', multer.array('photos', 5), recipes.putRecipe);
routes.delete("/admin/recipes", recipes.deleteRecipe);

// ROTAS CHEFS
routes.get('/admin/chefs', chefs.indexChefs);
routes.get('/admin/chefs/criar', chefs.createChef);
routes.get('/admin/chefs/chef/:id', chefs.exibeChef); 
routes.get('/admin/chefs/chef/:id/editar', chefs.editaChef);

routes.post('/admin/chefs', chefs.postChefs);
routes.put('/admin/chefs', chefs.putChef);
routes.delete('/admin/chefs', chefs.deletaChef);

module.exports = routes;
