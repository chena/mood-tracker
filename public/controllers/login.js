angular.module('MoodTracker')
	.controller('LoginController', function($scope, $alert, $auth) {
		$scope.authenticate = function() {
			console.log('I\'m authenticating you');
		};
	});