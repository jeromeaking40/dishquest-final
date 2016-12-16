angular.module('DishQuest').controller('dishquestCtrl', dishquestController);

dishquestController.$inject = ['$http', 'dishquestFactory'];

function dishquestController($http, dishquestFactory) {
    var dishquest = this;
    console.info('controller loaded');

    //PAGINATION
    dishquest.foodInfo = [];

    //NEW USER
    dishquest.newUser = {};

    //CREATE NEW USER
    dishquest.siteRegister = function() {
        dishquestFactory.createUser(dishquest.newUser).then(function(responseData) {
            alertify.alert("Dishquest", "Successfully created account!");
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
            console.error(err);
        });
    };

    //CALL THE FUNCTION AGAIN WHEN REFRESHED
    dishquest.info();

    // UPDATE THE USERS PROFILE INFO
    dishquest.updateUser = function() {
        $http.put('/profile/' + dishquest.profile._id, dishquest.profile).then(function(res) {
            console.log(res.data);
            alertify.alert("DishQuest", "Successfully updated your profile!");
        }, function(err) {
            // DO NOT FORGET!!!! A ERROR CALLBACK
            console.error(err);
        });
        console.log("Profile was updated");
    };



    //SEARCH FOR FOOD
    dishquest.find = function(pageNumber) {
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
            // console.log(dishquest.foodInfo);
        }, function(err) {
            // DO NOT FORGET!!!! A ERROR CALLBACK
            console.error(err);
        });
        dishquest.search = '';
    };

    //ADD FRIENDS
    dishquest.addFriend = function($index) {
        $http({
            method: 'POST',
            url: '/addfriends',
            data: {
                _id: dishquest.friends[$index]._id
            }
        }).then(function(res) {
            console.log(res.data);
            alertify.alert("DishQuest", "Successfully added friend!");
        }, function(err) {
            // DO NOT FORGET!!!! A ERROR CALLBACK
            console.error(err);
        });
    };

    //SEARCH FOR FRIENDS
    dishquest.searchFriends = function() {
        //LOADING GIF
        dishquest.loading = true;
        console.log('Searching for friends: ', dishquest.searchUsers);
        $http.get('/api/search/users?name=' + dishquest.searchUsers).then(function(res) {
            dishquest.loading = false;
            dishquest.friends = res.data;
            if (dishquest.friends.length === 0) {
                alertify.alert("DishQuest", "Sorry we can't find any one with that name. Please choose another friend");
            }
            console.log(dishquest.friends);
        }, function(err) {
            // DO NOT FORGET!!!! A ERROR CALLBACK
            console.error(err);
        });
        dishquest.searchUsers = '';
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
            dishquest.profile.favoritePlaces.push(dishquest.favInfo.name);
            alertify.alert("DishQuest", "Successfully added to your favorites!");
        }, function(err) {
            // DO NOT FORGET!!!! A ERROR CALLBACK
            console.error(err);
        });

        console.log("Place was added");

    };

    //DELETE ITEM FROM FAV PLACES
    dishquest.deleteVenue = function($index) {
        var deletePlace = alertify.confirm("DishQuest", "Are you sure you want to delete this place?", function() {
            $http({
                method: 'PUT',
                url: '/profile',
                data: {
                    favoritePlaces: dishquest.profile.favoritePlaces[$index]
                }
            }).then(function(res) {
                console.log(res.data);
                dishquest.profile.favoritePlaces.splice($index, 1);
            }, function(err) {
                // DO NOT FORGET!!!! A ERROR CALLBACK
                console.error(err);
            });
            console.log("Deleted favorite");
            alertify.success('Favorite was deleted.');
        }, function() {
            alertify.error('Cancel');
        });
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
            console.error(err);
        });
        console.log("Deleted friend");
    };

    //END OF CONTROLLER
 }
