const express = require('express');
const routes = express.Router();

const profile = require('../app/controllers/ProfileController');

const UserValidator = require('../app/validators/users');

const { onlyUsers, isAdmin } = require('../app/middlewares/session');

routes.get('/', onlyUsers, profile.listUsers);
routes.get('/criar', onlyUsers, profile.create);
routes.get('/user/:id', onlyUsers, UserValidator.showUSer, profile.showUser);
routes.get('/profile', onlyUsers, UserValidator.showProfile, profile.showProfile);

routes.post('/', onlyUsers, UserValidator.post, profile.post);
routes.put('/', onlyUsers, UserValidator.updateProfile, profile.updateProfile);
routes.put('/', onlyUsers, /*Validator.post,*/ profile.updateUser);
// routes.delete('/', /*Validator.post,*/ profile.post);

module.exports = routes;