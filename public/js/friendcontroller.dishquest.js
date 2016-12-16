angular.module('DishQuest').controller('friendCtrl', friendController);

friendController.$inject = ['$routeParams'];

function friendController($routeParams) {
    var friend = this;

    //CALL THE FRIEND
    friend.get = function() {
        return $http({
            method: "GET",
            url: '/friendpage',
            params: {
                name: 
            }
        });
    };

    //END OF CONTROLLER
}
