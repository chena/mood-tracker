angular.module('MoodTracker')
	.controller('MoodController', function($scope, $alert, $auth, UserService) {
		UserService.getUser().success(function(data) {
			var moods = data.moods,
				today = moment().format('YYYY-MM-DD');
			
			$scope.mood = null;
			for (var i = 0; i < moods.length; i++) {
				var m = moods[i];
				if (m.date.toString() === today) {
					$scope.mood = m.mood;
					break;
				}
			}

			$scope.name = data.displayName;
			$scope.days = moment().diff(moment(data.startDate), 'd') + 1;
			$scope.moods = moods;
		}).error(function() {
			$alert({
				content: 'Unable to get user information.',
				animation: 'fadeZoomFadeDown',
				type: 'material',
				duration: 3
			});
		});

		$scope.updateMood = function() {		
			UserService.logMood({
				mood: $scope.mood
			}).then(function(response) {
				switch ($scope.mood) {
					case 'happy': 
						$alert({
							content: 'Yay! Stay happy and motivated!',
							animation: 'fadeZoomFadeDown',
							type: 'material',
							duration: 3
						});
						break;
					case 'okay':
						$alert({
							content: 'You know what you are doing! It\'t gonna get even better!',
							animation: 'fadeZoomFadeDown',
							type: 'material',
							duration: 3
						});
						break;
					default:
						$alert({
							content: 'Cheer up! Take it easy and talk to somebody!',
							animation: 'fadeZoomFadeDown',
							type: 'material',
							duration: 3
						})
				}
			});
		};
	});