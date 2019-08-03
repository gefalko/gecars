console.log("hi!");

const app = angular.module('gecar', ['ngMaterial', 'ngRoute', 'ngMessages', 'angular-md5']);

function config ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/index.view.html',
            controller: 'orderCtrl',
            controllerAs: 'oc'
        })
        .when('/p/sucess', {
            templateUrl: '/views/payments/sucess.view.html',
            controller: 'infoCtrl',
            controllerAs: 'ic'
        })
        .when('/orders', {
            templateUrl: '/views/account.view.html',
            controller: 'accountCtrl',
            controllerAs: 'account'
        })
        .when('/settings', {
            templateUrl: '/views/settings.view.html',
            controller: 'settingsCtrl',
            controllerAs: 'settings'
        })
        .otherwise({redirectTo: '/'});

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
}

app.config(['$routeProvider', '$locationProvider', config]);


