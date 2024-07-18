const { SECRET, COOKIE_NAME } = require('../config/config');
const authService = require('../service/authService');

const auth = (req, res, next) => {

    const token = req.cookies[COOKIE_NAME]
    if (token) {
        const userData = authService.authenticate(token)
        if (userData) {
            req.user = userData;
            res.locals.token = token; // Pass token to Handlebars
            res.locals.user = userData; // Pass user data to Handlebars
        }
    }
    next()
}

module.exports = auth