const Front = require('../models/Front');
const { age, date, birthDay } = require('../../lib/utils');

module.exports = {
    
    index(req, res) {
        Front.all(function(recipes) {
            return res.render('frontend/index', { recipes });
        });
    },

    sobre(req, res) {
        return res.render('frontend/sobre');
    },

    receitas(req, res) {
        Front.all(function(recipes) {
            return res.render('frontend/receitas', { recipes });
        });
    },

    prato(req, res) {
        Front.find(req.params.id ,function(recipe) {
            if (!recipe) {
                return res.send('Receita não encontrada');
            }

            return res.render('frontend/prato', { recipe });
        });
    }

}

// exports.prato = function(req, res) {
//     const receitaIndex = req.params.id;

//     const foundReceita = receitas.receitas.find(function(item) {
//         return receitaIndex == item.id;
//     });

//     if (!foundReceita) {
//         return res.render("frontend/not-found");
//     }
//     return res.render("frontend/prato", { item: foundReceita });
// };

// exports.notFound = function(req, res) {
//     res.status(404).render("/frontend/not-found");
// };