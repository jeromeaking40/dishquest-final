var express = require('express'),
    allRoutes = require('../controllers/routeMeth'),
    saveUser = require('../controllers/saveUser');

module.exports = function(app) {

    //REGISTER USERS
    app.post('/register', saveUser.create);

    //GET USERS
    app.get('/api/users', saveUser.get);
    //LOGIN USERS
    app.post('/login', allRoutes.login);

    //LOGUT USERS
    app.get('/logout', allRoutes.logout);

    //ADD FRIENDS
    app.post('/addfriends', saveUser.addfriend);

    //DELETE FRIENDS
    app.put('/showfriends', allRoutes.deleteFriend);


    //ADD FAV PLACES
    app.post('/profile', allRoutes.addPlaces);

    //UPDATE FAV PLACES
    app.put('/profile', allRoutes.deletePlaces);

    //SEARCH INFORMATION
    app.get('/api/search', allRoutes.search);
    //SEARCH FOR USERS
    app.get('/api/search/users', allRoutes.searchUsers);

    //ANYTHING BELOW THIS LINE IS PROTECTED WITH THE MIDDLEWARE
    app.use(allRoutes.middlewares.session);


    //PROFILE PAGE ONCE AUTHENICATED
    app.get('/profile', allRoutes.profile);

    //USER INFORMATION ONCE LOGGED IN
    app.get('/api/me', allRoutes.me);

    //SERVE STATIC FILES
    app.use(express.static('public'));
};
