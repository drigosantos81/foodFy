const express = require('express');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');

const routes = require('./routes');
const session = require('./config/session');

const server = express();

server.use(session);
server.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
server.use(express.static('public'));
server.use(express.static('img'));
server.use(express.urlencoded({ extended: true }));
server.use(methodOverride('_method'));
server.use(routes);

server.set("view engine", "html");

nunjucks.configure("src/app/pages", {
    express: server,
    autoescape: false,
    noCache: true
});

server.listen(5002, function() {
    console.log("Servidor ligado.");    
});