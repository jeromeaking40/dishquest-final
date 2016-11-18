angular.module('DishQuest').controller('dishquestCtrl', dishquestController);

dishquestController.$inject = ['$http', 'dishquestFactory'];

function dishquestController($http, dishquestFactory) {
    var dishquest = this;
    console.info('controller loaded');

    //NEW USER
    dishquest.newUser = {};

    //CREATE NEW USER
    dishquest.siteRegister = function() {
        dishquestFactory.createUser(dishquest.newUser).then(function(responseData) {
            // console.log('Response is', responseData);
        }, function(err) {
            console.error('There was an err ', err);
        });
        //RESETS THE FORM
        dishquest.newUser = {};

    };

    //GET INFORMATION ONCE USER LOGS IN
    dishquest.info = function() {
        $http({method: 'GET', url: '/api/me'}).then(function(res) {
            dishquest.profile = res.data;
            if (res.data._id) {
                dishquest.signedIn = true;
            } else {
                dishquest.signedIn = false;
            }
        }, function(err) {
            // DO NOT FORGET!!!! A ERROR CALLBACK
            // when things go bad, you need this!!!!!!!!
            console.error(err);
        });
    };

    //CALL THE FUNCTION AGAIN WHEN REFRESHED
    dishquest.info();

    //SEARCH FOR FOOD
    dishquest.find = function() {
        //LOADING GIF
        dishquest.loading = true;
        $http({
            method: 'GET',
            url: '/api/search',
            params: {
                term: dishquest.search
            }
        }).then(function(res) {
            dishquest.loading = false;
            dishquest.foodInfo = res.data;
            console.log(dishquest.foodInfo);
        }, function(err) {
            // DO NOT FORGET!!!! A ERROR CALLBACK
            // when things go bad, you need this!!!!!!!!
            console.error(err);
        });
        dishquest.search = "";

    };

    //ADD FRIENDS
    dishquest.addFriend = function($index) {
        console.log(dishquest.friends[$index]);
        $http({
            method: 'POST',
            url: '/addfriends',
            data: {
                _id: dishquest.friends[$index]._id
            }
        }).then(function(res) {
            console.log(res.data);
        }, function(err) {
            // DO NOT FORGET!!!! A ERROR CALLBACK
            // when things go bad, you need this!!!!!!!!
            console.error(err);
        });

    };

    //SEARCH FOR FRIENDS
    dishquest.searchFriends = function() {
        //LOADING GIF
        dishquest.loading = true;
        console.log("Searching for friends: ", dishquest.searchUsers);
        $http.get('/api/search/users?name=' + dishquest.searchUsers).then(function(res) {
            dishquest.loading = false;
            dishquest.friends = res.data;
            if (dishquest.friends.length === 0) {
                alertify.alert("Dishquest", "Sorry we can't find any one with that name. Please choose another friend");
            }
            console.log(dishquest.friends);
        }, function(err) {
            // DO NOT FORGET!!!! A ERROR CALLBACK
            // when things go bad, you need this!!!!!!!!
            console.error(err);
        });
        dishquest.searchUsers = "";
    };

    // UPDATE THE USERS FAVPLACES DATA
    dishquest.addVenue = function(name) {
        $http({
            method: 'POST',
            url: '/profile',
            data: {
                name: name
            }
        }).then(function(res) {
            dishquest.favInfo = res.data;
            console.log(dishquest.favInfo);
        }, function(err) {
            // DO NOT FORGET!!!! A ERROR CALLBACK
            // when things go bad, you need this!!!!!!!!
            console.error(err);
        });

        console.log("Place was added");
    };

    //DELETE ITEM FROM FAV PLACES
    dishquest.deleteVenue = function($index) {
        alertify.confirm("DishQuest", "Are you sure you want to delete this place?", function() {
            alertify.success('Ok');
        }, function() {
            alertify.error('Cancel');
        });

        $http({
            method: 'PUT',
            url: '/profile',
            data: {
                favoritePlaces: dishquest.profile.favoritePlaces[$index]
            }
        }).then(function(res) {
            console.log(res.data);
        }, function(err) {
            // DO NOT FORGET!!!! A ERROR CALLBACK
            // when things go bad, you need this!!!!!!!!
            console.error(err);
        });

        console.log("Deleted favorite");
    };

    //DELETE FRIEND
    dishquest.deleteFriend = function($index) {
        $http({
            method: 'PUT',
            url: '/showfriends',
            data: {
                friends: dishquest.profile.friends[$index]
            }
        }).then(function(res) {
            console.log(res.data);
        }, function(err) {
            // DO NOT FORGET!!!! A ERROR CALLBACK
            // when things go bad, you need this!!!!!!!!
            console.error(err);
        });

        console.log("Deleted friend");
    };

}
