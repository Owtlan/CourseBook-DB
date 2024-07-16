const express = require('express');
const routes = require('./routes')
const path = require('path');
const port = 3000;


const app = express();

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });
app.use(express.static('public'))

require('./config/express')(app)
app.use(routes)


app.listen(port, () => {
    console.log(`server is running at ${port}`);
});