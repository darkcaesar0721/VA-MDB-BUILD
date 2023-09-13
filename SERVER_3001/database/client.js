const mongoose = require('mongoose');

const url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;

// Connection URL
mongoose.Promise = global.Promise

mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${url}`)
});