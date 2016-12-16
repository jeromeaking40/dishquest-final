var saveUser = require('../controllers/saveUser'),
    User = require('../models/userModel'),
    bcrypt = require('bcryptjs'),
    Yelp = require('yelp'),
    yelp = new Yelp({consumer_key: process.env.consumer_key, consumer_secret: process.env.consumer_secret, token: process.env.token, token_secret: process.env.token_secret}),
    sessions = require('client-sessions');

//ROUTE METHODS
module.exports = {
    //REGISTER USERS
    register: function(req, res) {
        // console.log(req.body);
        var newUser = new User(req.body);
        // when this function fires, it is going to hit the pre save middleware
        newUser.save(function(err, user) {
            if (err) {
                return res.send(err);
            }
            res.send(user);
        });
    },
    //LOGIN USERS
    login: function(req, res) {
        // POST login
        console.info('LOGIN::POST::PAYLOAD::', req.body);
        User.findOne({
            email: req.body.email
        }, function(err, user) {
            if (err) {
                // this will trigger the error .then callback on the frontend
                console.error('MongoDB error:', err);
                res.status(500).json(err);
            }
            if (!user) {
                console.warn('No user found!');
                res.status(403).json({message: 'Invalid username or password'});
            } else {
                console.info('auth.login', user);
                bcrypt.compare(req.body.password, user.password, function(compareErr, matched) {
                    if (compareErr) { // this will trigger the error .then callback on the frontend
                        console.error('compareErr error:', compareErr);
                        res.status(500).json(err);
                    } else if (!matched) {
                        console.warn('Password mismatch!');
                        res.status(403).json({message: 'Invalid username or password'});
                    } else {
                        req.session = user;
                        res.send({message: 'Login success!'});

                    }
                });
            }

        });
    },
    //PROFILE PAGE ONCE CONFIRMED
    profile: function(req, res) {
        res.sendFile('/profile.html', {root: "./public/views"});
    },
    //LOGOUT USERS
    logout: function(req, res) {
        req.session.reset();
        res.redirect('/views/login.html');
    },
    //GET USER INFORMATION FOR PROFILE
    me: function(req, res) {
        User.findOne({_id: req.session._id}).populate('friends').exec(function(err, user) {
            if (err) {
                res.send(err);
            } else {
                res.send(user);
            }
        });
    },
    //SEARCH FOR USERS
    searchUsers: function(req, res) {
        console.log("Searching db for: ", req.query.name);
        User.find({
            "name": {
                $regex: ".*" + req.query.name + ".*",
                $options: 'i'
            }
        }, function(err, users) {
            if (err) {
                res.send(err);
            } else {
                res.send(users);
            }
        });
    },
    //UPDATE USER INFORMATION
    updateUser: function(req, res) {
        var id = req.params.id;
        var user = req.body;
        if (user && user._id !== id) {
            return res.status(500).json({err: "Ids do not match"});
        }
        User.findByIdAndUpdate(id, user, {
            new: true
        }, function(err, user) {
            if (err) {
                return res.status(500).json({err: err.message});
            }
            res.json({'user': user, message: 'User Updated'});
        });
    },
    //SEARCH FOR INFORMATION
    search: function(req, res) {
        yelp.search({
            term: req.query.term,
            location: 'Denver',
            categories: 'food',
            radius: 40000,
            open_now: true,
            sort_by: "rating",
            limit: 40
        }).then(function(data) {
            console.log("There are", data.length + " results");
            res.send(data);
        }).catch(function(err) {
            console.error(err);
            res.send(err);
        });
    },
    //ADD PLACE TO YOUR FAVORITE PLACES
    addPlaces: function(req, res) {
        User.update({
            email: req.session.email
        }, {
            $push: {
                "favoritePlaces": req.body.name
            }
        }, function(err, user) {
            if (err) {
                console.error(err);
            } else {
                console.log(user);
            }
        });
        res.send(req.body);

    },
    //DELETE PLACE TO YOUR FAVORITE PLACES
    deletePlaces: function(req, res) {
        console.log(req.body.favoritePlaces);

        User.update({
            email: req.session.email
        }, {
            $pull: {
                "favoritePlaces": req.body.favoritePlaces
            }
        }, function(err, user) {
            if (err) {
                console.error(err);
            } else {
                console.log(user);
            }
        });
        res.send('Profile updated');

    },
    //DELETE FRIEND
    deleteFriend: function(req, res) {
        console.log(req.body.friends);

        User.update({
            email: req.session.email
        }, {
            $pull: {
                "friends": req.body.friends
            }
        }, function(err, user) {
            if (err) {
                console.error(err);
            } else {
                console.log(user);
            }
        });
        res.send('Profile updated');

    },
    //SET SESSION FOR LOGGED IN USERS
    middlewares: {
        session: function(req, res, next) {
            // MIDDLEWARE TO CHECK IF USER LOGGED IN
            if (req.session) {
                next();
            } else {
                res.redirect('/login.html');
            }
        }
    }
};
