angular.module('MoodTracker')
	.controller('MoodController', function($scope, $alert, $auth, UserService, AlertService) {
		var todayMood = null,
			counts = { happy: 0, okay: 0, unhappy: 0};

		var setCountData = function() {
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

			for (var i = 0; i < moods.length; i++) {
				var m = moods[i];
				counts[m.mood]++;

				// bind today's mood if it's been logged
				if (m.date.toString() === today) {
					todayMood = m.mood;
				}
			}

			$scope.mood = todayMood;
			setCountData();
			setPieChart();

			// only draw if there are data
			$scope.ready = moods.length > 0;
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

				// refresh count and mood data
				if (todayMood) {
					$scope.countData.data[Object.keys(counts).indexOf(todayMood)].y[0]--;
				}
				$scope.countData.data[Object.keys(counts).indexOf($scope.mood)].y[0]++;
				todayMood = $scope.mood;
				$scope.ready = true;
			});
		};
	});