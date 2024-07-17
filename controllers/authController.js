const router = require('express').Router()
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const authService = require('../service/authService')

router.get('/login', (req, res) => {
    res.render('login'); // 'register' трябва да съответства на името на вашия .hbs файл без разширение
});




//register html page
router.get('/register', (req, res) => {
    res.render('register'); // 'register' трябва да съответства на името на вашия .hbs файл без разширение
});


router.post('/register', (req, res) => {

    const userData = req.body;
    console.log(userData);
})


module.exports = router;