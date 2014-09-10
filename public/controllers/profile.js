angular.module('MoodTracker')
	.controller('ProfileController', function($scope, $alert, $auth, UserService) {
		UserService.getUser().success(function(data) {
			$scope.user = data;
		}).error(function() {
			$alert({
				content: 'You have been logged out.',
				animation: 'fadeZoomFadeDown',
				type: 'material',
				duration: 3
			});
		});
	});