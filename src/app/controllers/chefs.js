const Chefs = require('../models/Chefs');
const Files = require('../models/Files');
const { age, date, birthDay } = require('../../lib/utils');

const Intl = require('intl');

module.exports = {
    indexChefs(req, res) {
        Chefs.all(function(chefs) {
            return res.render("admin/chefs/index", { chefs });
        });
    },

    createChef(req, res) {
        return res.render("admin/chefs/criar");
    },

    postChefs(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos.");
            }
        }

        Chefs.post(req.body, function(chef) {
            return res.redirect(`/admin/chefs/chef/${chef.id}`);
        });
    },

    exibeChef(req, res) {
        Chefs.find(req.params.id, function(chef) {
            if (!chef) {
                return res.send('Chef não encontrado');
            }

            chef.created_at = date(chef.created_at).format;

            Chefs.recipesFromChefs(req.params.id, function(recipes) {
                return res.render('admin/chefs/chef', { chef, recipes });
            });

            
        });
    },

    editaChef(req, res) {
        Chefs.find(req.params.id, function(chef) {
            if (!chef) {
                return res.send('Chef não cadastrado ou não encontrado.');
            }

            chef.created_at = date(chef.created_at).format;

            return res.render('admin/chefs/editar', { chef });
        });
    },

    putChef(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Preencha todos os campos.');
            }
        }

        Chefs.update(req.body, function() {
            return res.redirect(`/admin/chefs/chef/${req.body.id}`);
        });
    },

    deletaChef(req, res) {
        Chefs.delete(req.body.id, function() {
            return res.redirect('/admin/chefs');
        });
    }
}

// exports.notFound = function(req, res) {
//     res.status(404).render("/frontend/not-found");
// };