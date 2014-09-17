var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var config = require('./config');
var defaultMessages = require('./util/data/messages.json')

/*
 |--------------------------------------------------------------------------
 | DB schema and configuration
 |--------------------------------------------------------------------------
 */
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

var messageSchema = new mongoose.Schema({
	message: {
		type: String,
		index: {unique: true}
	},
	type: String
});

var User = mongoose.model('User', userSchema);
var Message = mongoose.model('Message', messageSchema);
mongoose.connect(config.MONGO_URI);

// seed data
Message.find({}, function(err, messages) {
	if (messages.length == 0) {
		Message.create(defaultMessages);
	}
});

/*
 |--------------------------------------------------------------------------
 | App instance and configuration
 |--------------------------------------------------------------------------
 */
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(requireSSL);
app.use(express.static(__dirname + '/public'));

/*
 |--------------------------------------------------------------------------
 | Security middleware
 |--------------------------------------------------------------------------
 */
function requireSSL(req, res, next) {
	console.log(app.get('env'));
	console.log(req.get('x-forwarded-proto'));
	if (app.get('env') === 'production' && req.get('x-forwarded-proto') !== 'https') {
		console.log('should redirect?');
		res.redirect('https://' + req.hostname + req.url);
	} else {
		next();
	}
}

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
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createToken(req, user) {
  var payload = {
    iss: req.hostname,
    sub: user._id,
    iat: moment().valueOf(),
    exp: moment().add(14, 'days').valueOf()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 |  Endpoints
 |--------------------------------------------------------------------------
 */
app.post('/auth/hackerschool', function(req, res) {
    var accessTokenUrl = 'https://www.hackerschool.com/oauth/token';
    var peopleApiUrl = 'https://www.hackerschool.com/api/v1/people/me';

    var params = {
    	client_id: req.body.clientId,
    	redirect_uri: req.body.redirectUri,
    	client_secret: config.HS_SECRET,
    	code: req.body.code,
    	grant_type: 'authorization_code'
    };

    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, {json: true, form: params}, function(err, response, token) {
    	var accessToken = token.access_token;
    	var headers = { Authorization: 'Bearer ' + accessToken };
	
		// Step 2. Retrieve profile information about the current user.
		request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
			User.findOne({hsId: profile.id}, function(err, existingUser) {
				// Step 3b. Create a new user account or return an existing one.
				if (existingUser) {
					return res.send({
						token: createToken(req, existingUser)
					});
				}
				var user = new User();
				user.hsId = profile.id;
				user.email = profile.email;
				user.displayName = profile.first_name + ' ' + profile.last_name;
				user.startDate = profile.batch.start_date;
				user.endDate = profile.batch.end_date;
				user.moods = {};
				user.markModified('moods');

				user.save(function(err) {
					res.send({
						token: createToken(req, user),
					});
				});
			});
		});
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

/*
 |--------------------------------------------------------------------------
 | Start the server
 |--------------------------------------------------------------------------
 */
app.listen(app.get('port'), function() {
	console.log('Go to localhost:' + app.get('port'));
});
