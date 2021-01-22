const express = require('express');
const routes = express.Router();

const profile = require('../app/controllers/ProfileController');

const Validator = require('../app/validators/users');

routes.get('/', profile.listUsers);
routes.get('/criar', profile.create);
routes.get('/user/:id', Validator.show, profile.showUser);
routes.get('/profile/:id', /*Validator.show,*/ profile.showProfile);

routes.post('/', Validator.post, profile.post);
routes.put('/', /*Validator.post,*/ profile.update);
// routes.delete('/', /*Validator.post,*/ profile.post);

module.exports = routes;