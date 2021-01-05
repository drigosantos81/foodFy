const express = require('express');
const routes = express.Router();

const chefs = require('../app/controllers/ChefsController');
const multerChefs = require('../app/middlewares/multerChefs');

// ROTAS CHEFS
routes.get('/admin/chefs', chefs.index);
routes.get('/admin/chefs/criar', chefs.createChef);
routes.get('/admin/chefs/chef/:id', chefs.exibeChef); 
routes.get('/admin/chefs/chef/:id/editar', chefs.editaChef);

routes.post('/admin/chefs', multerChefs.single('photo'), chefs.postChefs);
routes.put('/admin/chefs', multerChefs.single('photo'), chefs.putChef);
routes.delete('/admin/chefs', chefs.deletaChef);

routes.use('/admin/chefs/not-found', chefs.notFound);
routes.use('/admin/chefs/chef/not-found', chefs.notFound);

module.exports = routes;