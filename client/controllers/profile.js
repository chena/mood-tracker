angular.module('MoodTracker')
	.controller('ProfileController', function($scope, $alert, $auth, UserService, AlertService) {
		UserService.getUser().success(function(data) {
			$scope.user = data;
			$scope.startDate = data.startDate.substring(0, 10);
			$scope.endDate = data.endDate.substring(0, 10);
		}).error(function() {
			$alert(AlertService.getAlert('You have been logged out.'));
		});

		$scope.updateProfile = function() {
			UserService.updateProfile({
				displayName: $scope.user.displayName
			}).then(function(){
				$alert(AlertService.getAlert('Profile has been updated.'));
			});
		};
	});