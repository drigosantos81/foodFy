
module.exports = {
    login(req, res) {
        try {
            return res.render('login/login');
        } catch (error) {
            console.log(error);
        }    
    },

    postLogin(req, res) {
        try {
            req.session.userId = req.user.id;

            return res.redirect(`/admin/users/profile/${req.user.id}`);
        } catch (error) {
            console.log(error);
        }    
    },

    forgot(req, res) {
        try {
            return res.render('login/forgot');
        } catch (error) {
            console.log(error);
        }
    },

    newPassword(req, res) {
        try {
            return res.render('login/new-password');
        } catch (error)  {
            console.log(error);
        }
    },

    logout(req, res) {
        req.session.destroy();
        return res.redirect('/');
    }

}