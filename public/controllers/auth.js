angular.module('MoodTracker')
    .controller('AuthController', function($scope, $auth, $alert, $location) {
        var fade = 'fadeZoomFadeDown',
            type = 'material'
            duration = 3;

        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        $scope.login = function(e) {
            $auth.authenticate('hackerschool').then(function(response) {
                e.preventDefault(); // prevent href anchor
                
                $scope.name = response.data.name;
                $location.path('/mood');
                
                $alert({
                    content: 'You have successfully logged in.',
                    animation: fade,
                    type: type,
                    duration: duration
                });

                
            }).catch(function(response) {
                $alert({
                    content: response.data,
                    animation: fade,
                    type: type,
                    duration: duration
                });
            });
        };

        $scope.logout = function(e) {
            $auth.logout().then(function() {
                e.preventDefault(); // prevent href anchor
                
                $alert({
                    content: 'You have been logged out.',
                    animation: fade,
                    type: type,
                    duration: duration
                });
            });
        }
    });