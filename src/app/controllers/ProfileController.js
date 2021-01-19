const User = require('../models/User');

module.exports = {
    async listUsers(req, res) {
        try {
            let results = await User.allUsers();
            const users = results.rows;

            if (!users) {
                return res.send('Nenhum registro encontrado');
            }

            console.log('Ids: ', users.id);

            return res.render('admin/users/index', { users });
        } catch (error) {
            console.log(error);
        }
    },

    create(req, res) {
        try {
            return res.render('admin/users/criar');
        } catch (error) {
            console.log(error);
        }
    },

    async post(req, res) {
        try {
            const userId = await User.post(req.body);

            return res.redirect(`/admin/users/user/${userId}`);
        } catch (error) {
            console.log(error);
        }
    },

    async showUser(req, res) {
        try {
            let results = await User.showUser(req.params.id);
            const user = results.rows[0];

            console.log('REQ.PARAMS.ID: ', req.params.id);
            console.log('Nome: ', user);
            
            return res.render(`admin/users/user`, { user });
        } catch (error) {
            console.log(error);
        }
    }
}