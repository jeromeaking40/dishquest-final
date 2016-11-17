
module.exports = {
    create: function(req, res) {
        var newFriend = new Friend(req.body);

        newFriend.save(function(err, friend) {
            if (err) {
                return res.send(err);
            }
            res.send(friend);
        });
    },
    get: function(req, res) {
        Friend.find({}, function(err, docs) {
            if (err) {
                return res.send(err);
            }
            res.json(docs);
        });

    }
};
