const express = require('express');
const router = express.Router();

const homeController = require('./controllers/homeController')
const authController = require('./controllers/authController')
const courseController = require('./controllers/courseController'); // Add courseController

const { Course } = require('./models/User');

router.get('/', async (req, res) => {
    try {

        const courses = await Course.find().populate('owner signUpList').lean().limit(3);
        res.render('home', { courses });
    } catch (err) {
        console.error(err);
        // Handle error rendering or fetching courses
        res.status(500).send('Internal Server Error');
    }

})



router.use('/', courseController);
router.use('/', homeController)
router.use('/', authController)
module.exports = router