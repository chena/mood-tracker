var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
	message: {
		type: String,
		index: {unique: true}
	},
	type: String
});

module.exports = mongoose.model('Message', messageSchema);
