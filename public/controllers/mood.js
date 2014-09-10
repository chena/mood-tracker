angular.module('MoodTracker')
	.controller('MoodController', function($scope, $alert, $auth, UserService) {
		var alert = {
			animation: 'fadeZoomFadeDown',
			type: 'material',
			duration: 3
		};

		var genStatData = function(stat) {
			var data = [];
			for (var key in stat) {
				data.push({
					x: key, 
					y: [stat[key]]
				});
			}
			return data;
		}

		UserService.getUser().success(function(data) {
			$scope.name = data.displayName;
			$scope.days = moment().diff(moment(data.startDate), 'd') + 1;
			
			// deal with moods data
			var moods = data.moods,
				today = moment().format('YYYY-MM-DD'),
				counts = {
					happy: 0,
					okay: 0,
					unhappy: 0
				};

			$scope.mood = null;
			for (var i = 0; i < moods.length; i++) {
				var m = moods[i];
				counts[m.mood]++;
				// bind today's mood if it's been logged
				if (m.date.toString() === today) {
					$scope.mood = m.mood;
					break;
				}
			}

			$scope.chartType = 'pie';
			$scope.statData = {
				data : genStatData(counts)
			};
			$scope.config = {
				labels: false,
				title: 'Daily Moods',
				legend: {
					display: true,
					position: 'right'
				},
				innerRadius: 0,
				tooltips: true
			};
			$scope.loaded = true;
			$scope.counts = genStatData(counts);
		}).error(function() {
			alert.content = 'Unable to get user information.';
			$alert(alert);
		});

		$scope.updateMood = function() {		
			UserService.logMood({
				mood: $scope.mood
			}).then(function(response) {
				switch ($scope.mood) {
					case 'happy': 
						alert.content = 'Yay! Stay happy and motivated!';
						$alert(alert);
						break;
					case 'okay':
						alert.content = 'You know what you are doing! It\'t gonna get even better!';
						$alert(alert);
						break;
					default:
						alert.content = 'Cheer up! Take it easy and talk to somebody!';
						$alert(alert);
				}
			});
		};
	});