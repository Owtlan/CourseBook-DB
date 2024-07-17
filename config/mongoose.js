const mongoose = require('mongoose');

const { DB_URI } = require('./config');

mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Database connected successfully');
}).catch((error) => {
    console.error('Database connection error:', error);
});

module.exports = mongoose.connection;
