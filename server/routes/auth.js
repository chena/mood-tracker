var jwt = require('jwt-simple');
var moment = require('moment');
var request = require('request');
var config = require('./../../config');
var User = require('./../models/user');

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
 |  Auth Endpoint that Satellizer will hit
 |--------------------------------------------------------------------------
 */
module.exports = function(app) {
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
};
