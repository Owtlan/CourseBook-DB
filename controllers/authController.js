const router = require('express').Router()
const { User } = require('../models/User');


const bcrypt = require('bcrypt')
const authService = require('../service/authService')
const { COOKIE_NAME } = require('../config/config')

// da proverim authenticiran li e

const { auth, checkNotAuthenticated } = require('../middleware/auth');



router.get('/login', (req, res) => {
    res.render('login'); // 'register' трябва да съответства на името на вашия .hbs файл без разширение
});


router.post('/login', async (req, res, next) => {
    const { username, password } = req.body


    try {
        const token = await authService.login(username, password);
        console.log(token);
        res.cookie(COOKIE_NAME, token, { httpOnly: true });
        res.redirect('/');
        return token
    } catch (error) {
        console.log('Login failed for:', username);

        // Assuming the error message is passed from authService if login fails
        res.status(401).render('login', {
            errorMessage: 'Incorrect username or password.',
            username
        });
    }


})


//register html page
router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register', { errorMessage: null, username: '', email: '' }); // 'register' трябва да съответства на името на вашия .hbs файл без разширение
});


router.post('/register', checkNotAuthenticated, async (req, res) => {

    const { username, email, password, 'confirm-password': confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).render('register', {
            errorMessage: 'Passwords do not match.',
            username,
            email
        });
    }

    try {
        const { username, email, password } = req.body

        // const existingUser = await User.findOne({ email });

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            // Log the error or handle it as needed
            console.log('User already exists:', username, email);

            // Send the status code and redirect to the register page
            res.status(400);
            return res.redirect('/register');
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
        res.status(500).render('register', {
            errorMessage: 'Internal server error.',
            username,
            email
        });
    }

})


router.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect('/')
})

module.exports = router;