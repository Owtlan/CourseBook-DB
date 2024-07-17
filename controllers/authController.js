const router = require('express').Router()


const authService = require('../service/authService')
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
    res.render('login'); // 'register' трябва да съответства на името на вашия .hbs файл без разширение
});


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
            // .then(res => console.log(res))
        // Redirect to the homepage
        res.redirect('/'); // Adjust the path as necessary
    }
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal server error');
    }

    // const userData = req.body;
    // console.log(userData);
})


module.exports = router;