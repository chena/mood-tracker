angular.module('MoodTracker')
	.controller('MessageController', function($scope, $alert, $sanitize, AlertService, MessageService) {
		$scope.addMessage = function() {
			MessageService.addMessage({
				type: $scope.type,
				message: $sanitize($scope.message)
			}).success(function() {
				$alert(AlertService.getAlert('Message has been added.'));
			}).error(function(data, status) {
				if (status == 409) {
					$alert(AlertService.getAlert('Message already exists.'));
				} else {
					$alert(AlertService.getAlert('Unable to add the message.'));
				}
			});
		};
	});