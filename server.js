var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var jwt = require('jwt-simple');
var moment = require('moment');

var mongoose = require('mongoose');

var config = require('./config');

/*
 |--------------------------------------------------------------------------
 | DB schema and configuration
 |--------------------------------------------------------------------------
 */
var userSchema = new mongoose.Schema({
	displayName: String,
	hsId: String,
	startDate: Date,
	endDate: Date,
	moods: []
});

var User = mongoose.model('User', userSchema);
mongoose.connect(config.MONGO_URI);

/*
 |--------------------------------------------------------------------------
 | App instance and configuration
 |--------------------------------------------------------------------------
 */
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

/*
 |--------------------------------------------------------------------------
 | Login required middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
	if (!req.headers.authorization) {
		return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
	}

	var token = req.headers.authorization.split(' ')[1];
	var payload = jwt.decode(token, config.TOKEN_SECRET);

	if (payload.exp <= Date.now()) {
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
				user.displayName = profile.first_name + ' ' + profile.last_name;
				user.startDate = profile.batch.start_date;
				user.endDate = profile.batch.end_date;

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

app.put('/api/me', ensureAuthenticated, function() {

});

app.put('/api/me/moods', ensureAuthenticated, function(req, res) {
	User.findById(req.userId, function(err, user) {
		if (!user) {
			return res.status(404).send({
				message: 'User not found.'
			});
		}

		var moods = user.moods,
			today = moment().format('YYYY-MM-DD');
		// check if today's mood has already been logged
		// if so, remove the record
		for (var i = 0; i < moods.length; i++) {
			if (moods[i].date.toString() === today) {
				moods.splice(i, 1);
				break;
			}
		}
		user.moods.push({
			date: today,
			mood: req.body.mood
		});

		user.save(function(err) {
			res.status(200).end();
		});
	})
});

/*
 |--------------------------------------------------------------------------
 | Helper methods
 |--------------------------------------------------------------------------
 */
 function findUser(userId) {
 	// TODO: use promise
 }

/*
 |--------------------------------------------------------------------------
 | Start the server
 |--------------------------------------------------------------------------
 */
app.listen(app.get('port'), function() {
	console.log('Go to localhost:' + app.get('port'));
});
