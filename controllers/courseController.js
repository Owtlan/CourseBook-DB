const express = require('express');
const router = require('express').Router()
const { User, Course } = require('../models/User');
const { auth, checkNotAuthenticated } = require('../middleware/auth');




router.get('/course/edit/:id', auth, async (req, res) => {

    try {
        const courseId = req.params.id
        const userId = res.locals.user._id

        const course = await Course.findById(courseId).lean()


        if (!course) {
            return res.status(404).send('Course not found')
        }

        if (course.owner.toString() !== userId.toString()) {
            return res.status(403).send('Unauthorized: You are not the owner of this course');
        }

        res.render('edit', { course, user: res.locals.user })

    } catch (error) {
        console.error('Error displaying edit form:', error);
        res.status(500).send('Internal Server Error');
    }

})

// here i have mistakes
router.post('/course/edit/:id', auth, async (req, res) => {

    try {
        const courseId = req.params.id;
        const userId = res.locals.user._id;

        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).send('Course not found');
        }

        // Check if the logged-in user is the owner of the course
        if (course.owner.toString() !== userId.toString()) {
            return res.status(403).send('Unauthorized: You are not the owner of this course');
        }


        // Update the course with new data
        const { title, type, certificate, image, description, price } = req.body;


        // Simple validation
        if (!title || !type || !certificate || !image || !description || !price) {
            return res.render('edit', { errorMessage: 'All fields are required', course: req.body });
        }

        course.title = title;
        course.type = type;
        course.certificate = certificate;
        course.image = image;
        course.description = description;
        course.price = price;

        await course.save();

        res.redirect(`/course/details/${courseId}`);
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).send('Internal Server Error');
    }

})


router.post('/course/delete/:id', auth, async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = res.locals.user._id;

        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).send('Course not found');
        }

        // Check if the logged-in user is the owner of the course
        if (course.owner.toString() !== userId.toString()) {
            return res.status(403).send('Unauthorized: You are not the owner of this course');
        }

        // Delete the course
        await course.deleteOne();

        // Redirect to the "All Courses" page after deletion
        res.redirect('/courses');
    } catch (error) {
        console.error('Error during course deletion:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find().lean();
        res.render('course', { title: 'All Courses', courses });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/course/details/:id', auth, async (req, res) => {
    try {
        // Намерете курса по ID и попълнете свързаните полета
        const course = await Course.findById(req.params.id).populate('owner signUpList').lean();

        if (!course) {
            return res.status(404).send('Course not found');
        }

        const userIdStr = res.locals.user._id.toString();
        console.log('User ID from session:', userIdStr);

        // Логване на signUpList
        const signUpListIds = course.signUpList.map(id => id._id ? id._id.toString() : id.toString());
        console.log('SignUpList IDs:', signUpListIds);


        // Проверете дали потребителят е записан
        const isEnrolled = signUpListIds.includes(userIdStr);
        console.log('Is enrolled:', isEnrolled);


        res.render('details', { course, user: res.locals.user, isEnrolled });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// add the singup route

router.post('/course/signup/:id', auth, async (req, res) => {

    try {
        const courseId = req.params.id
        const userId = res.locals.user._id

        //find the course by ID
        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(404).send('Course not found')
        }

        // Check if the user is already signed up for the course
        if (course.signUpList.includes(userId)) {
            return res.status(400).send('You are already signed up for this course');
        }

        // Add the user to the sign-up list
        course.signUpList.push(userId);
        await course.save();

        res.redirect(`/course/details/${courseId}`)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

})

// Handle course creation

router.post('/course/create', auth, async (req, res) => {
    const { title, type, certificate, image, description, price } = req.body;
    const owner = res.locals.user._id

    if (!title || !type || !certificate || !image || !description || !price) {
        console.log(type);
        return res.render('createCourse', { errorMessage: 'All fields are required', data: req.body })
    }

    try {
        const course = new Course({ title, type, certificate, image, description, price, owner })
        await course.save()
        res.redirect('/')
    } catch (error) {
        res.render('createCourse', { errorMessage: 'Error creating course', data: req.body });
    }
});

router.get('/course/create', auth, (req, res) => {
    res.render('createCourse', { user: res.locals.user });
});


module.exports = router;