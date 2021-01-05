
module.exports = {
    login(req, res) {
    try {
        return res.render('user/login');
    } catch (error) {
        console.log(error);
    }    
    }
}