angular.module('MoodTracker')
	.factory('UserService', function($http) {
		return {
			getUser: function() {
				return $http.get('/api/me');
			},

			updateProfile: function(data) {
				return $http.put('/api/me', data)
			},

			logMood: function(data) {
				return $http.put('/api/me/moods', data);
			}
		};
	});