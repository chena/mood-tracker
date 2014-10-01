var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	displayName: String,
	hsId: String,
	email: String,
	startDate: Date,
	endDate: Date,
	moods: {}
}, {
	minimize: false // we need to set this so empty object can be persisted
});

module.exports = mongoose.model('User', userSchema);