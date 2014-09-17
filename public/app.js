angular.module('MoodTracker', ['ngRoute', 'satellizer', 'mgcrea.ngStrap', 'angularCharts', 'ngSanitize'])
    .config(function($authProvider, $routeProvider) {
        $authProvider.hackerschool({
            clientId: '670e4651d9d490c58e536d7b59ca76b7927e445a4c4d65a1d7b6e1e9cf4fb2c5'
        });

        $routeProvider.when('/', {
            templateUrl: '../views/home.html',
        })
        .when('/mood', {
            templateUrl: '../views/mood.html',
            controller: 'MoodController'
        })
        .when('/profile', {
            templateUrl: '../views/profile.html',
            controller: 'ProfileController'
        })
        .when('/message', {
            templateUrl: '../views/message.html',
            controller: 'MessageController'
        })
        .otherwise({
            redirect: '/'
        });
    });


