angular.module('MoodTracker')
    .controller('AuthController', function($scope, $auth, $alert, $location) {
        var alert = {
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
        };

        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        $scope.login = function(e) {
            $auth.authenticate('hackerschool').then(function(response) {
                e.preventDefault(); // prevent href anchor
                alert.content = 'You have successfully logged in.';
                $alert(alert);
                
                $scope.name = response.data.name;
                $location.path('/mood');

            }).catch(function(response) {
                alert.content = response.data;
                $alert(alert);
            });
        };

        $scope.logout = function(e) {
            $auth.logout().then(function() {
                e.preventDefault(); // prevent href anchor
                alert.conetent = 'You have been logged out.';
                $alert(alert);
            });
        }
    });