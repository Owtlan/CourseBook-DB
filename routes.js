const router = require('express').Router()

const homeController = require('./controllers/homeController')
const authController = require('./controllers/authController')
// const auth = require('./middleware/auth')


// router.use(auth)
router.use('/', homeController)
router.use('/', authController)
module.exports = router