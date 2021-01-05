const express = require('express');
const routes = express.Router();

const chefs = require('../app/controllers/ChefsController');
const multerChefs = require('../app/middlewares/multerChefs');

// ROTAS CHEFS
routes.get('/', chefs.index);
routes.get('/criar', chefs.createChef);
routes.get('/chef/:id', chefs.exibeChef); 
routes.get('/chef/:id/editar', chefs.editaChef);

routes.post('/', multerChefs.single('photo'), chefs.postChefs);
routes.put('/', multerChefs.single('photo'), chefs.putChef);
routes.delete('/', chefs.deletaChef);

routes.use('/not-found', chefs.notFound);

module.exports = routes;