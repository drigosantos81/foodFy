
module.exports = {
    login(req, res) {
        try {
            return res.render('user/login');
        } catch (error) {
            console.log(error);
        }    
    },

    forgot(req, res) {
        try {
            return res.render('user/forgot');
        } catch (error) {
            console.log(error);
        }
    },

    newPassword(req, res) {
        try {
            return res.render('user/new-password');
        } catch (error)  {
            console.log(error);
        }
    },

    list(req, res) {
        try {
            return res.render('admin/user/index');
        } catch (error) {
            console.log(error);
        }
    }
}