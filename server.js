var express = require('express'),
    dotenv = require('dotenv').config(),
    morgan = require('morgan'),
    request = require('request'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Yelp = require('yelp'),
    Routes = require('./routes/routes'),
    sessions = require('client-sessions')({
        cookieName: 'dishquest-session', // front-end cookie name, currently pulled from package.json, feel free to change
        secret: 'F1ND@0N3', // the encryption password : keep this safe
        requestKey: 'session', // req.session,
        duration: (86400 * 1000) * 7, // one week in milliseconds
        cookie: {
            ephemeral: false, // when true, cookie expires when browser is closed
            httpOnly: true, // when true, the cookie is not accesbile via front-end JavaScript
            secure: false // when true, cookie will only be read when sent over HTTPS
        }
    });
// encrypted cookies!

var app = express();

//MIDDLEWARE
app.use(morgan('dev'));
app.use(sessions);
app.use(bodyParser.urlencoded({extended: true}), bodyParser.json());

//SET MONGOOSE CONNECTION
mongoose.connect('mongodb://localhost/dishquest');

//BRING IN ROUTES
Routes(app);

//SERVER
app.listen(8000, function(err, req, res) {
    if (err) {
        console.error('There was an error: ', err);
        process.exit(1);
    }
    console.log('Server is running on port 8000');
});
