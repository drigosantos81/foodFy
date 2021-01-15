const express = require('express');
const routes = express.Router();

const users = require('../app/controllers/ProfileController');

routes.get('/', users.list);
routes.get('/criar', users.showUser);

// routes.get('/register', users);
// routes.post('/register', Validator.post, UserController.post);

module.exports = routes;