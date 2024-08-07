const { SECRET, COOKIE_NAME } = require('../config/config');
const authService = require('../service/authService');

const auth = (req, res, next) => {

    const token = req.cookies[COOKIE_NAME]
    if (token) {
        const userData = authService.authenticate(token)
        if (userData) {
            res.locals.isAuthenticated = true;
            res.locals.user = userData;
        } else {
            res.locals.isAuthenticated = false;
        }
    } else {
        res.locals.isAuthenticated = false;
    }

    next()
}


function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}
module.exports = {
    auth,
    checkNotAuthenticated,
};