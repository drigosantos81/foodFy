const express = require('express');
const routes = express.Router();

const search = require('../app/controllers/SearchController');

/* ------- PESQUISA ------- */

routes.get('/busca', search.index);

module.exports = routes;