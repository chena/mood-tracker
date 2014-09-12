angular.module('MoodTracker')
	.factory('MessageService', function($http) {
		return {
			getMessages: function() {
				return $http.get('/api/messages');
			},

			addMessage: function(data) {
				return $http.post('/api/messages', data);
			}
		}
	});