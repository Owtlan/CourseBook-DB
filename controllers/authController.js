const router = require('express').Router()
const { User } = require('../models/User');


const bcrypt = require('bcrypt')
const authService = require('../service/authService')
const { COOKIE_NAME } = require('../config/config')
// const bcrypt = require('bcrypt');



router.get('/login', (req, res) => {
    res.render('login'); // 'register' трябва да съответства на името на вашия .hbs файл без разширение
});


router.post('/login', (req, res, next) => {
    const { username, password } = req.body

    authService.login(username, password)
        .then(token => {
            console.log(token);
            res.cookie(COOKIE_NAME, token, { httpOnly: true })
            res.redirect('/')

            return token
        })
        .catch(err => {
            console.log(err);
            next(err)
        })
})


//register html page
router.get('/register', (req, res) => {
    res.render('register'); // 'register' трябва да съответства на името на вашия .hbs файл без разширение
});


router.post('/register', async (req, res) => {
    console.log(req.body);
    try {
        const { username, email, password } = req.body


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists')
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save()

        res.redirect('/'); // Adjust the path as necessary
    }
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal server error');
    }

})


router.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect('/')
})

module.exports = router;