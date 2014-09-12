angular.module('MoodTracker')
	.controller('MessageController', function($scope, $alert, AlertService, MessageService) {
		$scope.addMessage = function() {
			MessageService.addMessage({
				type: $scope.type,
				message: $scope.message
			}).then(function() {
				$alert(AlertService.getAlert('Message has been added.'));
			});
		};
	});