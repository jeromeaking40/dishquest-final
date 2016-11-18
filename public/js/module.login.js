angular.module('module.login', []).controller('controller.login', [
    '$http',
    function($http) {
        var login = this;



        //SEND USER PROFILE IF AUTHENICATED
        login.submit = function() {
            $http({
                method: 'POST',
                url: '/login',
                data: {
                    email: login.email,
                    password: login.password
                }
            }).then(function(res) {
                console.info(res.data);
                location.href = '/#/profile';
            }, function(err) {
                // DO NOT FORGET!!!! an error callback
                // when things go bad, you need this!!!!!!!!
                console.error(err);
            });
        };
    }
]);
