const express = require('express');
const routes = express.Router();

const UserController = require('../app/controllers/UsersControllers');
const UserValidator = require('../app/validators/users');

const { onlyUsers, isAdmin, aUser } = require('../app/middlewares/session');

// ADMIN
routes.get('/', onlyUsers, isAdmin, UserController.showUser);
routes.get('/user/:id', onlyUsers, isAdmin, UserValidator.showUSer, UserController.showUser);

routes.put('/', onlyUsers, UserValidator.updateUser, UserController.updateUser);

module.exports = routes;