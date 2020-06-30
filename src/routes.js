const express = require('express');
const routes = express.Router();
const front = require('./app/controllers/front');
const admin = require('./app/controllers/admin');

// HOME/START
routes.get('/', function(req, res) {
    return res.redirect('/frontend');
});

// FRONTEND
routes.get('/frontend', front.index);
routes.get('/sobre', front.sobre);
routes.get('/receitas', front.receitas);
routes.get('/prato/:id', front.prato);
routes.use('/not-found', front.notFound);

//ADMIN

// ROTAS RECEITAS
routes.get('/admin/recipes', admin.index);
routes.get('/admin/recipes/criar', admin.create);
routes.post('/admin/recipes', admin.post);
routes.get('/admin/recipes/prato/:id', admin.exibe);
routes.get('/admin/recipes/prato/:id/editar', admin.edita);
routes.put('/admin/recipes', admin.putRecipe);
routes.delete("/admin/recipes", admin.deleteRecipe);

// ROTAS CHEFS
routes.get('/admin/chefs', admin.indexChefs);
routes.get('/admin/chefs/criar', admin.createChef);
routes.post('/admin/chefs', admin.postChefs);
routes.get('/admin/chefs/chef/:id', admin.exibeChef); 
routes.get('/admin/chefs/chef/:id/editar', admin.editaChef);
routes.put('/admin/chefs', admin.putChef);
routes.delete('/admin/chefs', admin.deletaChef);

module.exports = routes;
