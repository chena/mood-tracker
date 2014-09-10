angular.module('MoodTracker', ['ngRoute', 'satellizer', 'mgcrea.ngStrap', 'angularCharts'])
    .config(function($authProvider, $routeProvider) {
        $authProvider.hackerschool({
            clientId: 'be72cf30fe7fb456a522fd3638a4d006d93f4896cf63f34c1d42f26c3985cd81'
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


