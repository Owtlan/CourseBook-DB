const router = require('express').Router()

const homeController = require('./controllers/homeController')
const authController = require('./controllers/authController')

const { Course } = require('./models/User');
// const auth = require('./middleware/auth')


// router.use(auth)
router.get('/', async (req, res) => {
    try {

        const courses = await Course.find()
            .sort({ createdAt: -1 })
            .limit(3)

        res.render('home', {
            title: 'Your Title Here',
            courses: courses,
            token: req.token,
        })
    } catch (err) {
        console.error(err);
        // Handle error rendering or fetching courses
        res.status(500).send('Internal Server Error');
    }


})


router.use('/', homeController)
router.use('/', authController)
module.exports = router