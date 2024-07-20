const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('./config/mongoose');
const routes = require('./routes')
const authRouter = require('./controllers/authController')
// const { authMiddleware } = require('./middleware/auth');
const { auth, checkNotAuthenticated } = require('./middleware/auth');

const app = express();
const port = 3000;



app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(auth);
app.use(routes)

require('./config/mongoose')
require('./config/express')(app)


// app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`server is running at ${port}`);
});