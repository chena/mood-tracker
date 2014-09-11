angular.module('MoodTracker')
    .controller('AuthController', function($scope, $auth, $alert, $location, AlertService) {
        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        $scope.login = function(e) {
            $auth.authenticate('hackerschool').then(function(response) {
                e.preventDefault(); // prevent href anchor
                $alert(AlertService.getAlert('You have successfully logged in.'));
                
                $scope.name = response.data.name;
                $location.path('/mood');

            }).catch(function(response) {
                $alert(AlertService.getAlertresponse.data);
            });
        };

        $scope.logout = function(e) {
            $auth.logout().then(function() {
                e.preventDefault(); // prevent href anchor
                $alert(AlertService.getAlert('You have been logged out.'));
            });
        }
    });