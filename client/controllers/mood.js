angular.module('MoodTracker')
	.controller('MoodController', function($scope, $alert, $auth, UserService, AlertService, MessageService) {
		var todayMood = null,
			counts = {happy: 0, okay: 0, unhappy: 0};

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

		$scope.date = moment().format('MMMM Do YYYY');

		UserService.getUser().success(function(data) {
			$scope.name = data.displayName;
			$scope.days = moment().diff(moment(data.startDate), 'd') + 1;
			// FIXME: buggy??? How come using current in the view causes $scope.mood to be always null??
			$scope.current = !moment().isBefore(data.startDate) && !moment().isAfter(data.endDate);
			
			var moods = data.moods, 
				dates = Object.keys(moods);

			dates.forEach(function(d) {
				counts[moods[d]]++;
			});

			todayMood = moods[moment().format('YYYY-MM-DD')];
			$scope.mood = todayMood;

			setCountData();
			setPieChart();

			// only draw if there are data
			$scope.ready = dates.length > 0;
		}).error(function() {
			$alert(AlertService.getAlert('Unable to get user information.'));
		});

		MessageService.getMessages().success(function(data) {
			$scope.moodMessages = data;
		}).error(function() {
			$alert(AlertService.getAlert('Unable to get messages.'));
		});

		$scope.updateMood = function() {
			// get a random message
			var messages = $scope.moodMessages[$scope.mood],
				num = messages.length,
				message;

			if (num < 2) {
				message = messages[0];
			} else {
				// choose a random message from the collection
				message = messages[Math.floor(Math.random() * num)];
			}

			UserService.logMood({
				mood: $scope.mood
			}).success(function() {
				$alert(AlertService.getAlert(message));

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