angular.module('MoodTracker')
	.factory('AlertService', function() {
		var alert = {
			animation: 'fadeZoomFadeDown',
			type: 'material',
			duration: 3
		};
		
		return {
			getAlert: function(message) {
				alert.content = message;
				return alert;
			}
		};
	});