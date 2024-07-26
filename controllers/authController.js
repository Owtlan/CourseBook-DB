const router = require('express').Router()
const { User, Course } = require('../models/User');

const bcrypt = require('bcrypt')
const authService = require('../service/authService')
const { COOKIE_NAME } = require('../config/config')

const { auth, checkNotAuthenticated } = require('../middleware/auth');


router.get('/login', (req, res) => {
    res.render('login', { errorMessage: null });
});


router.post('/login', async (req, res, next) => {
    const { username, password } = req.body

    // Simple validation
    if (username.length < 2 || password.length < 4) {
        return res.render('login', {
            errorMessage: 'Invalid email or password',
            username
        });
    }

    try {
        const token = await authService.login(username, password);

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


    if (username.length < 2 || email.length < 10 || password.length < 4) {
        return res.status(400).render('register', {
            errorMessage: 'Username must be at least 2 characters, email must be at least 10 characters, and password must be at least 4 characters long.',
            username,
            email
        })
    }

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
            return res.status(400).render('register', {
                errorMessage: 'User already exists.',
                username,
                email
            });;
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