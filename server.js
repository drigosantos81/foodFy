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

server.get("/receita", function(req, res) {
    const id = req.query.id;

    const receita = receitas.find(function(receita) {
        return receita.id == id;
    });

        if (!receita) {
            return res.send("Receita não encontrada")
        }
    
        return res.render("receita", { items: receitas });
    // server.get("/receita/:index", function(req, res) {
    // return res.render("receita", { items: receitas });
});

// server.get("/receita", function(req, res) {
//     return res.render("receita");
// });

server.use(function(req, res) {
    res.status(404).render("not-foundFF");
});

server.listen(5001, function() {
    console.log("Server Activeted");
});