const express = require('express');
const routes = express.Router();

const login = require('../app/controllers/LoginController');

const LoginValidator = require('../app/validators/session');

routes.get('/', login.login);
routes.get('/forgot', login.forgot);
routes.get('/new-password', login.newPassword);

routes.post('/login', LoginValidator.post, login.postLogin);
routes.post('/logout', login.logout);

module.exports = routes;