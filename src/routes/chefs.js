const express = require('express');
const routes = express.Router();

const chefs = require('../app/controllers/ChefsController');

const { onlyUsers, isAdmin } = require('../app/middlewares/session');
const multer = require('../app/middlewares/multer');

// ROTAS CHEFS
routes.get('/', onlyUsers, chefs.index);
routes.get('/criar', onlyUsers, isAdmin, chefs.createChef);
routes.get('/chef/:id', onlyUsers, chefs.exibeChef); 
routes.get('/chef/:id/editar', onlyUsers, isAdmin, chefs.editaChef);

routes.post('/', onlyUsers, isAdmin, multer.single('photo'), chefs.postChefs);
routes.put('/', onlyUsers, isAdmin, multer.single('photo'), chefs.putChef);
routes.delete('/', onlyUsers, isAdmin, chefs.deletaChef);

routes.use('/not-found', chefs.notFound);

module.exports = routes;