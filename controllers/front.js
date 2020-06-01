const receitas = require('../dados.json');

exports.index = function(req, res) {
    return res.render("frontend/index", { items: receitas.receitas });
};

exports.sobre = function(req, res) {
    return res.render("frontend/sobre");
};

exports.receitas = function(req, res) {
    return res.render("frontend/receitas", { items: receitas.receitas });
};

exports.prato = function(req, res) {
    const receitaIndex = req.params.id;

    const foundReceita = receitas.receitas.find(function(item) {
        return receitaIndex == item.id;
    });

    if (!foundReceita) {
        return res.render("frontend/not-found");
    }
    return res.render("frontend/prato", { item: foundReceita });
};

exports.notFound = function(req, res) {
    res.status(404).render("/frontend/not-found");
};