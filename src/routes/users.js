const express = require('express');
const routes = express.Router();

const profile = require('../app/controllers/ProfileController');

const Validator = require('../app/validators/users');

routes.get('/', profile.listUsers);
routes.get('/criar', profile.create);
routes.get('/user/:id', Validator.showUSer, profile.showUser);
routes.get('/profile/:id', Validator.showProfile, profile.showProfile);

routes.post('/', Validator.post, profile.post);
routes.put('/', Validator.updateProfile, profile.updateProfile);
routes.put('/', /*Validator.post,*/ profile.updateUser);
// routes.delete('/', /*Validator.post,*/ profile.post);

module.exports = routes;