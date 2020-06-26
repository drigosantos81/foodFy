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
    },

    notFound(req, res) {
        res.status(404).render("/frontend/not-found");
    }

}
