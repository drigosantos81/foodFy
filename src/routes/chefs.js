const express = require('express');
const routes = express.Router();

const chefs = require('../app/controllers/ChefsController');

const multerChefs = require('../app/middlewares/multerChefs');
const { onlyUsers, isAdmin } = require('../app/middlewares/session');

// ROTAS CHEFS
routes.get('/', onlyUsers, chefs.index);
routes.get('/criar', onlyUsers, isAdmin, chefs.createChef);
routes.get('/chef/:id', onlyUsers, chefs.exibeChef); 
routes.get('/chef/:id/editar', onlyUsers, isAdmin, chefs.editaChef);

routes.post('/', onlyUsers, isAdmin, multerChefs.single('photo'), chefs.postChefs);
routes.put('/', onlyUsers, isAdmin, multerChefs.single('photo'), chefs.putChef);
routes.delete('/', onlyUsers, isAdmin, chefs.deletaChef);

routes.use('/not-found', chefs.notFound);

module.exports = routes;