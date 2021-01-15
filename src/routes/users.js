const express = require('express');
const routes = express.Router();

const users = require('../app/controllers/ProfileController');

const Validator = require('../app/validators/users');

routes.get('/', users.list);
routes.get('/criar', users.showUsers);

// routes.get('/register', users);
routes.post('/', Validator.post, users.post);
// routes.put('/', /*Validator.post,*/ users.post);
// routes.delete('/', /*Validator.post,*/ users.post);

module.exports = routes;