const express = require('express');
const routes = express.Router();

const users = require('../app/controllers/UsersController');

routes.get('/', users.list);
routes.get('/login', users.login);
routes.get('/forgot', users.forgot);
routes.get('/new-password', users.newPassword);

// routes.get('/register', users);
// routes.post('/register', Validator.post, UserController.post);

module.exports = routes;