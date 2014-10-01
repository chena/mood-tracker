var jwt = require('jwt-simple');
var moment = require('moment');
var request = require('request');
var config = require('./../../config');
var User = require('./../models/user');
var Message = require('./../models/message');

function ensureAuthenticated(req, res, next) {
	if (!req.headers.authorization) {
		return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
	}

	var token = req.headers.authorization.split(' ')[1];
	var payload = jwt.decode(token, config.TOKEN_SECRET);

	if (moment(payload.exp).isBefore(moment())) {
		return res.status(401).send({ message: 'Token has expired' });
	}

	req.userId = payload.sub;
	next();
}

/*
 |--------------------------------------------------------------------------
 |  API Endpoints for Users/Moods and Messages
 |--------------------------------------------------------------------------
 */
module.exports = function(app) {
	// this is a public endpoint
	app.get('/api/messages', function(req, res) {
		var moodMessages = {
			happy: [],
			okay: [],
			unhappy: []
		};
		Message.find({}, function(err, messages) {
			messages.forEach(function(m) {
				moodMessages[m.get('type')].push(m.get('message'));
			});
			res.send(moodMessages);
		});
	});

	app.post('/api/messages', ensureAuthenticated, function(req, res) {
		var msg = new Message();
		msg.type = req.body.type;
		msg.message = req.body.message;

		msg.save(function(err) {
			if (err) {
				if (err.err.indexOf('duplicate key') > -1) {
					res.status(409).send();
				}
				res.status(500).send();
			}
			res.status(201).end();
		});
	});

	app.get('/api/me', ensureAuthenticated, function(req, res) {
		User.findById(req.userId, function(err, user) {
			if (!user) {
				return res.status(404).send({
					message: 'User not found.'
				});
			}
			return res.send(user);
		})
	});

	app.put('/api/me', ensureAuthenticated, function(req, res) {
		User.findById(req.userId, function(err, user) {
			if (!user) {
				return res.status(404).send();
			}

			user.displayName = req.body.displayName;
			user.save(function(err) {
				res.status(200).end();
			});
		});
	});

	app.put('/api/me/moods', ensureAuthenticated, function(req, res) {
		User.findById(req.userId, function(err, user) {
			if (!user) {
				return res.status(404).send();
			}

			user.moods[moment().format('YYYY-MM-DD')] = req.body.mood;
			user.markModified('moods');

			user.save(function() {
				res.status(200).end();
			});
		})
	});
};