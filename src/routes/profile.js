const express = require('express');
const routes = express.Router();

const profileController = require('../app/controllers/ProfileController');
const UserValidator = require('../app/validators/profileValidator');
const { onlyUsers, isAdmin, aUser } = require('../app/middlewares/session');

// USÚARIOS COMUNS (Que não são administradores)
routes.get('/busca-user/:id', onlyUsers, profileController.showRecipesProfile);

// ADMIN
routes.get('/', onlyUsers, profileController.listUsers);
routes.get('/criar', onlyUsers, isAdmin, profileController.create);
routes.get('/profile', onlyUsers, UserValidator.showProfile, profileController.showProfile);

routes.post('/', onlyUsers, isAdmin, UserValidator.post, profileController.post);
routes.put('/', onlyUsers, UserValidator.updateProfile, profileController.updateProfile);
routes.delete('/', isAdmin, profileController.delete);

module.exports = routes;