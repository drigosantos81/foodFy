const express = require('express');
const nunjucks = require('nunjucks');
const receitas = require('./dados');

const server = express();

server.use(express.static('public'));
server.use(express.static('img'));

server.set("view engine", "njk");

nunjucks.configure("pages", {
    express: server,
    autoescape: false,
    noCache: true
});

server.get("/", function(req, res) {
    return res.render("index", {items: receitas});
});

server.get("/sobre", function(req, res) {
    return res.render("sobre", {items: receitas});
});

server.get("/receitas", function(req, res) {
    return res.render("receitas", { items: receitas });
});

server.get("/receita/:id", function(req, res) {
    const receitaIndex = req.params.id;

    const receita = receitas.find(function(receita) {
        return receitaIndex == receita.id;
    });

    // console.log(receitas[receitaIndex]);
    
    // const receita = receitas.find(function(receita) {
    //     return receita.id == id;
    // });

        if (!receita) {
            return res.render("not-foundFF")
        }
    
    return res.render("receita", { item: receita });
});

server.use(function(req, res) {
    res.status(404).render("not-foundFF");
});

server.listen(5001, function() {
    console.log("Server Activeted");
});