const express = require('express');
const routes = require('./routes')

const authRouter = require('./controllers/authController')

const port = 3000;
const app = express();


app.use(express.static('public'))

require('./config/mongoose')
require('./config/express')(app)

app.use(routes)

app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`server is running at ${port}`);
});