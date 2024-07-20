const router = require('express').Router()
const { User, Course } = require('../models/User');
const { auth, checkNotAuthenticated } = require('../middleware/auth');

// da proverim authenticiran li e



router.get('/course', auth, (req, res) => {
    res.render('course', { user: res.locals.user });
});


// Handle course creation

router.post('/create', auth, async (req, res) => {
    const { title, type, certificate, image, description, price } = req.body;
    const owner = res.locals.user._id

    if (!title || !type || !certificate || !image || !description || !price) {
        return res.render('course', { errorMessage: 'All fields are required', data: req.body })
    }

    try {
        const course = new Course({ title, type, certificate, image, description, price, owner })
        await course.save()
        res.redirect('/')
    } catch (error) {
        res.render('course', { errorMessage: 'Error creating course', data: req.body });
    }
});

// List courses
// Render the course creation page
router.get('/create', auth, (req, res) => {
    res.render('course', { user: res.locals.user });
});

router.get('/', async (req, res) => {

    try {
        const courses = await Courses.find().sort({ createdAt: -1 })
        res.render('courses', { courses })
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
});
module.exports = router;