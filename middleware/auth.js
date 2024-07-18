const { SECRET, COOKIE_NAME } = require('../config/config');
const jwt = require('jsonwebtoken');
const authService = require('../service/authService');



const auth = (req, res, next) => {

    console.log('COOKIE_NAME:', COOKIE_NAME); // Debugging
    
    next()
}

module.exports = auth