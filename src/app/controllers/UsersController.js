
module.exports = {
    login(req, res) {
        try {
            return res.render('admin/login/index');
        } catch (error) {
            console.log(error);
        }    
    },

    forgot(req, res) {
        try {
            return res.render('admin/login/forgot');
        } catch (error) {
            console.log(error);
        }
    },

    newPassword(req, res) {
        try {
            return res.render('admin/login/new-password');
        } catch (error)  {
            console.log(error);
        }
    },

}