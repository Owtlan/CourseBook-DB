const express = require('express');
const routes = require('./routes')
const cookieParser = require('cookie-parser');

const authRouter = require('./controllers/authController')
const authMiddleware = require('./middleware/auth');

const port = 3000;
const app = express();
app.use(cookieParser());
app.use(authMiddleware);

app.use(express.static('public'))

require('./config/mongoose')
require('./config/express')(app)

app.use(routes)

app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`server is running at ${port}`);
});