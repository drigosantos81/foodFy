const express = require('express');
const routes = express.Router();

const login = require('../app/controllers/LoginController');

const LoginValidator = require('../app/validators/session');

routes.get('/', login.login);
routes.get('/forgot', login.forgot);
routes.get('/new-access', login.access);
routes.get('/new-password', login.newPassword);

routes.post('/new-access', login.postAccess);
routes.post('/login', LoginValidator.login, login.postLogin);
routes.post('/forgot', LoginValidator.forgot, login.postForgot);
routes.post('/new-password', LoginValidator.reset, login.postReset);
routes.post('/logout', login.logout);

module.exports = routes;