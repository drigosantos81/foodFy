const express = require('express');
const routes = express.Router();

const login = require('../app/controllers/LoginController');

routes.get('/', login.login);
routes.get('/forgot', login.forgot);
routes.get('/new-password', login.newPassword);

module.exports = routes;