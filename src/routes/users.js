const express = require('express');
const routes = express.Router();

const profile = require('../app/controllers/ProfileController');

const UserValidator = require('../app/validators/users');

const { onlyUsers, isAdmin } = require('../app/middlewares/session');

routes.get('/', onlyUsers, profile.listUsers);
routes.get('/criar', onlyUsers, profile.create);
routes.get('/profile', onlyUsers, UserValidator.showProfile, profile.showProfile);
routes.get('/user/:id', onlyUsers, UserValidator.showUSer, profile.showUser);
routes.get('/busca-user/:id', profile.showRecipesProfile);

routes.post('/', onlyUsers, UserValidator.post, profile.post);
routes.put('/', onlyUsers, UserValidator.updateProfile, profile.updateProfile);
routes.put('/', onlyUsers, UserValidator.updateUser, profile.updateUser);
routes.delete('/', profile.delete);

module.exports = routes;