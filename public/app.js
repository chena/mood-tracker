angular.module('MoodTracker', ['ngRoute', 'satellizer', 'mgcrea.ngStrap', 'angularCharts'])
    .config(function($authProvider, $routeProvider) {
        $authProvider.hackerschool({
            clientId: '21f403d5828cac30a37e38ad3916f1b9f5a362c695db04a962700bdc53e1d761'
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
        .otherwise({
            redirect: '/'
        });
    });


