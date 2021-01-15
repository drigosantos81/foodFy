const User = require('../models/User');

module.exports = {
    list(req, res) {
        try {
            return res.render('admin/user/index');
        } catch (error) {
            console.log(error);
        }
    },

    showUsers(req, res) {
        try {
            return res.render('admin/user/criar');
        } catch (error) {
            console.log(error);
        }
    },

    async post(req, res) {
        try {
            const userId = await User.post(req.body);

            return res.redirect('/admin/user/criar');
        } catch (error) {
            console.log(error);
        }
    }

}