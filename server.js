const express = require('express');
const nunjucks = require('nunjucks');

const server = express();

server.use(express.static('public'));
server.use(express.static('img'));

server.set("view engine", "njk");

nunjucks.configure("pages", {
    express: server
});

server.get("/", function(req, res) {
    return res.render("index");
});

server.get("/sobre", function(req, res) {
    return res.render("sobre");
});

server.get("/lasanha", function(req, res) {
    return res.render("lasanha");
});

server.use(function(req, res) {
    res.status(404).render("not-foundFF");
});

server.listen(5001, function() {
    console.log("Server Activeted");
});