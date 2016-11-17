var User = require('../models/userModel');

function create(req, res) {
    var newUser = new User(req.body);

    newUser.save(function(err, doc) {
        if (err) {
            return res.send(err);
        }
        res.send(doc);
    });
}

function get(req, res) {
    User.find({}).populate('friends').exec(function(err, users) {
        if (err) {
            console.error(err);
        } else {
            res.send(users);
        }
    });
}

function addfriend(req, res) {
    User.findOneAndUpdate({
        _id: req.session._id
    }, {
        $push: {
            "friends": req.body._id
        }
    }, function(err, users) {
        if (err) {
            console.error(err);
        } else {
            res.send(users);
        }
    });
}

module.exports = {
    create: create,
    get: get,
    addfriend: addfriend
};
