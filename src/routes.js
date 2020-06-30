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
routes.get('/admin', admin.index);
routes.get('/admin/criar', admin.create);
routes.post('/admin', admin.post);
routes.get('/admin/prato/:id', admin.exibe);
// routes.get("/admin/prato/:id/edit", admin.edita);
// routes.put("/admin/prato", admin.put);
// routes.delete("/admin", admin.delete);

// ROTAS CHEFS
routes.get('/admin/chefs', admin.indexChefs);
routes.get('/admin/chefs/criar', admin.createChef);
routes.post('/admin/chefs', admin.postChefs);
routes.get('/admin/chefs/chef/:id', admin.exibeChef); 
routes.get('/admin/chefs/chef/:id/editar', admin.editaChef);

module.exports = routes;
