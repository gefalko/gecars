
(function(){

    angular.module('gecar').service('authSer', authSer);

    authSer.$inject = ['$window', '$http', '$rootScope'];

    function authSer($window, $http, $rootScope){
        
        const saveToken = function (token) {
            console.log("save token:",token);
            $window.localStorage['mean-token'] = token;
            console.log("saved token:",$window.localStorage['mean-token']);
        };

        const getToken = function () {
            console.log("load token:",$window.localStorage['mean-token']);
            return $window.localStorage['mean-token'];
        };

        const isLoggedIn = function() {
  
            let token = getToken();
            let payload;

            if(token){
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        const register = function(user) {
            console.log("authser say: register user", user);
            return $http.post('/api/register', user).then(function(data){
                saveToken(data.data.token);
                $rootScope.$broadcast('change-user-status');
            });
        };

        const orUserExist = function(email){
            return new Promise(function(resolve){
                $http.get('/api/user/exist/'+email).then(function(data){
                    resolve(data.data);    
                });
            });
        };

        const login = function(user) {
            return $http.post('/api/login', user).then(function(data) {
                saveToken(data.data.token);
                $rootScope.$broadcast('change-user-status');
             });
        };

        const currentUser = function() {
            if(isLoggedIn()){
                var token = getToken();
                var payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return {
                    _id : payload._id,
                    email : payload.email
                };
            }
        };

        const logout = function() {
            $window.localStorage.removeItem('mean-token');
            $rootScope.$broadcast('change-user-status');
        };

        return {
            isLoggedIn:isLoggedIn,
            register:register,
            orUserExist:orUserExist,
            login:login,
            currentUser:currentUser,
            logout:logout
        };
    }

})();
