const express = require('express');
const routes = express.Router();

const profile = require('../app/controllers/ProfileController');

const UserValidator = require('../app/validators/users');

const { onlyUsers, isAdmin, aUser } = require('../app/middlewares/session');

// USÚARIOS COMUNS
routes.get('/profile', onlyUsers, UserValidator.showProfile, profile.showProfile);
routes.get('/busca-user/:id', onlyUsers, profile.showRecipesProfile);

// ADMIN
routes.get('/', onlyUsers, isAdmin, profile.listUsers);
routes.get('/criar', onlyUsers, isAdmin, profile.create);
routes.get('/user/:id', onlyUsers, isAdmin, UserValidator.showUSer, profile.showUser);

routes.post('/', onlyUsers, isAdmin, UserValidator.post, profile.post);
routes.put('/', onlyUsers,  UserValidator.updateProfile, profile.updateProfile);
routes.put('/', onlyUsers,  UserValidator.updateUser, profile.updateUser);
routes.delete('/', isAdmin, profile.delete);

module.exports = routes;