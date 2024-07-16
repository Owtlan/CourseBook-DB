const express = require('express');

const { engine } = require('express-handlebars')



module.exports = function (app) {

    app.engine('hbs', engine({
        extname: 'hbs',
    }))

    app.set('view engine', 'hbs')

    app.use('/static', express.static('public'))

    app.use(express.urlencoded({ extended: true }))

}