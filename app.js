// require path package built in to node.js no need to install. to recognize in all operating system
const path = require('path');

// require express package (import express package)
const express = require('express');

// require CSURF to protect from CSRF 
const csrf = require('csurf');

// require express-session for session handling
const expressSession = require('express-session');

// import session handler 
const createrSessionConfig = require('./config/session');
// require import database object 
const db = require('./data/database');

// import add csrftoken 
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');

// import error handler 
const errorHandlerMiddleware = require('./middlewares/error-handler');
// require import auth.routes (custom files) 
const authRoutes = require('./routes/auth.routes');

// derive app object as function
const app = express();

// option for express to set ejs to render views
app.set('view engine', 'ejs');

// define the path on view, using __dirname global variable is path to current project folder
app.set('views',path.join(__dirname, 'views'));

// define name of the static folder to be accessible to public
app.use(express.static('public'));

// handing data attached to request
app.use(express.urlencoded({ extended: false}));

// activate express
const sessionConfig = createrSessionConfig();

app.use(expressSession(sessionConfig));

// activate csrf as middleware - should be before a request reach the route
app.use(csrf());

// activate middileware
app.use(addCsrfTokenMiddleware);

// use app.use to add middleware for every incoming request
app.use(authRoutes);

// add error handling middleware
app.use(errorHandlerMiddleware);

db.connecToDatabse()
    .then(function() {
        // listening to port
        app.listen(3000);
    }).catch(function(error) {
        console.log('Failed to connect to the database!')    
        console.log(error);
    }); // then if succeed, catch if error

