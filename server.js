const express = require('express');
const routes = require('./routes')
// const registerRoute = require('./routes');
// const loginRoute = require('./routes');


const port = 3000;
const app = express();


app.use(express.static('public'))

require('./config/mongoose')
require('./config/express')(app)

app.use(routes)
// app.use('/register', registerRoute);
// app.use('/login', loginRoute);


app.listen(port, () => {
    console.log(`server is running at ${port}`);
});