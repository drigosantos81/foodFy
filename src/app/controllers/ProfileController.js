
module.exports = {
    list(req, res) {
        try {
            return res.render('admin/user/index');
        } catch (error) {
            console.log(error);
        }
    },

    showUser(req, res) {
        try {
            return res.render('admin/user/criar');
        } catch (error) {
            console.log(error);
        }
    }
}