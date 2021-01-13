
module.exports = {
    list(req, res) {
        try {
            return res.render('admin/user/index');
        } catch (error) {
            console.log(error);
        }
    }
}