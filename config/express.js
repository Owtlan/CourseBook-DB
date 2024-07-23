const express = require('express');
const cookieParser = require('cookie-parser');
const { engine } = require('express-handlebars')

const { auth, checkNotAuthenticated } = require('../middleware/auth');



module.exports = function (app) {

    app.engine('hbs', engine({
        extname: 'hbs',
        helpers: {
            ifEquals: function (arg1, arg2, options) {
                return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
            },
            unless: function (val, list, options) {
                if (!list.includes(val)) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },
        
        }

    }))

    app.set('view engine', 'hbs')

    app.use('/static', express.static('public'))

    app.use(express.urlencoded({ extended: true }))

    // 1. Parse the Cookie in Your Express App
    app.use(cookieParser())
    app.use(auth)



}