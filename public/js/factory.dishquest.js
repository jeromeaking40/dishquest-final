angular.module('DishQuest').factory('dishquestFactory', dishquestFactory);

dishquestFactory.$inject = ['$http'];

function dishquestFactory($http) {
    return {
        //CREATE NEW USERS
        createUser: function(newUser) {
            console.log(newUser);
            return $http.post('/register', newUser);
        },

        //GET USERS
        addFriends: function(userID) {
            return $http.get('/api/users');
        }
    };

}
