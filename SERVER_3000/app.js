require('dotenv').config();

/* BEGIN: Create a mongodb server and mongodb client */
require('./database/server');
require('./database/client');
/* END: Create a mongodb server and mongodb client */

const controllers = require('./controllers');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.static("public")); // we need to tell express to use the public directory for static files... this way our app will find index.html as the route of the application! We can then attach React to that file!
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json()); //use .json(), not .urlencoded()

app.use('/api', controllers);

// process port
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
