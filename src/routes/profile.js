const express = require('express');
const routes = express.Router();

const profileController = require('../app/controllers/ProfileController');
const UserValidator = require('../app/validators/profileValidator');
const { onlyUsers, isAdmin, aUser } = require('../app/middlewares/session');

// USÚARIOS COMUNS (Que não são administradores)
routes.get('/busca-user/:id', onlyUsers, profileController.showRecipesProfile);

// ADMIN
routes.get('/', onlyUsers, isAdmin, profileController.listUsers);
routes.get('/criar', onlyUsers, isAdmin, profileController.create);
routes.get('/profile', onlyUsers, isAdmin, UserValidator.showProfile, profileController.showProfile);

routes.post('/', onlyUsers, isAdmin, UserValidator.post, profileController.post);
routes.put('/', onlyUsers, UserValidator.updateProfile, profileController.updateProfile);
routes.delete('/', isAdmin, profileController.delete);

module.exports = routes;