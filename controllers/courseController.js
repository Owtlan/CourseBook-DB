const express = require('express');
const router = require('express').Router()
const { User, Course } = require('../models/User');
const { auth, checkNotAuthenticated } = require('../middleware/auth');



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
        // Find the course by ID and populate related fields
        const course = await Course.findById(req.params.id).populate('owner signUpList').lean();
        
        if (!course) {
            return res.status(404).send('Course not found');
        }
        // Render the details view with the course data
        res.render('details', { course, user: res.locals.user });
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