const express = require('express');
const routes = express.Router();

const chefs = require('../app/controllers/ChefsController');

const multerChefs = require('../app/middlewares/multerChefs');
const { onlyUsers } = require('../app/middlewares/session');

// ROTAS CHEFS
routes.get('/', onlyUsers, chefs.index);
routes.get('/criar', onlyUsers, chefs.createChef);
routes.get('/chef/:id', onlyUsers, chefs.exibeChef); 
routes.get('/chef/:id/editar', onlyUsers, chefs.editaChef);

routes.post('/', onlyUsers, multerChefs.single('photo'), chefs.postChefs);
routes.put('/', onlyUsers, multerChefs.single('photo'), chefs.putChef);
routes.delete('/', onlyUsers, chefs.deletaChef);

routes.use('/not-found', chefs.notFound);

module.exports = routes;