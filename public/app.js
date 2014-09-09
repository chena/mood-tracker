angular.module('MoodTracker', ['ngRoute', 'satellizer', 'mgcrea.ngStrap'])
    .config(function($authProvider, $routeProvider) {
        $authProvider.hackerschool({
            // FIXME: client id shouldn't be exposed here
            clientId: 'be72cf30fe7fb456a522fd3638a4d006d93f4896cf63f34c1d42f26c3985cd81'
        });

        $routeProvider.when('/', {
            templateUrl: '../views/home.html'
        })
        // .when('/login', {
        //     controller: 'LoginController',
        // })
        // .when('/logout', {
        //     controller: 'LogoutController',
        // })
        .when('/profile', {
            templateUrl: '../views/profile.html',
            controller: 'ProfileController'
        })
        .otherwise({
            redirect: '/'
        });
    })
    .controller('HomeController', function($scope) {
        $scope.mood = 'happy';
    })
    .controller('AuthController', function($scope, $auth, $alert) {
        $scope.isAuthenticated = function() {
            return false;
        };

        $scope.login = function() {
            $auth.authenticate('hackerschool').then(function() {
                console.log('hello?');
                $alert({
                    content: 'You have successfully logged in.',
                    animation: 'fadeZoomFadeDown',
                    type: 'material',
                    duration: 3
                });
            }).catch(function(response) {
                console.log('failed?');
                $alert({
                    content: response.data,
                    animation: 'fadeZoomFadeDown',
                    type: 'material',
                    duration: 3
                });
            });
        };

        $scope.logout = function() {

        }
    });
