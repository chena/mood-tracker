angular.module('MoodTracker')
	.controller('MoodController', function($scope, $alert, $auth, UserService, AlertService) {
		var counts = {
			happy: 0,
			okay: 0,
			unhappy: 0
		};

		var updateCountData = function() {
			var data = [];
			for (var key in counts) {
				data.push({
					x: key, 
					y: [counts[key]]
				});
			}
			$scope.countData = {
				data: data
			};
		};

		var setPieChart = function() {
			$scope.chartType = 'pie';
			$scope.config = {
				labels: false,
				title: 'Daily Mood Counts',
				legend: {
					display: true,
					position: 'right'
				},
				innerRadius: 0,
				tooltips: true
			};
		};

		UserService.getUser().success(function(data) {
			$scope.name = data.displayName;
			$scope.days = moment().diff(moment(data.startDate), 'd') + 1;
			// FIXME: buggy??? How come using current in the view causes $scope.mood to be always null??
			$scope.current = !moment().isBefore(data.startDate) && !moment().isAfter(data.endDate);
			
			// deal with moods data
			var moods = data.moods;
			var today = moment().format('YYYY-MM-DD');
			
			/*var days = [];
			var scores = {
				happy: 10,
				okay: 5,
				unhappy: 0
			}*/

			$scope.mood = null;
			for (var i = 0; i < moods.length; i++) {
				var m = moods[i];
				counts[m.mood]++;
				/*days.push({
					x: i + 1,
					y: [scores[m.mood]]
				});*/

				// bind today's mood if it's been logged
				if (m.date.toString() === today) {
					$scope.mood = m.mood;
				}
			}
			updateCountData();


			// area graph
			/*
			$scope.chartType2 = 'area';
			$scope.daysData = {
				data: days
			};*/
			setPieChart();
			$scope.loaded = true;
		}).error(function() {
			$alert(AlertService.getAlert('Unable to get user information.'));
		});

		$scope.updateMood = function() {
			UserService.logMood({
				mood: $scope.mood
			}).then(function(response) {
				switch ($scope.mood) {
					case 'happy': 
						$alert(AlertService.getAlert('Yay! Stay happy and motivated!'));
						break;
					case 'okay':
						$alert(AlertService.getAlert('You know what you are doing! It\'t gonna get even better!'));
						break;
					default:
						$alert(AlertService.getAlert('Cheer up! Take it easy and talk to somebody!'));
				}
				counts[$scope.mood]++;
				updateCountData();
			}).error(function() {
				$alert(AlertService.getAlert('Unable to log mood.'));
			});
		};
	});