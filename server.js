var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var Message = require('./server/models/message');
var defaultMessages = require('./util/data/messages.json');

/*
 |--------------------------------------------------------------------------
 | Database Connection and Setup
 |--------------------------------------------------------------------------
 */
mongoose.connect(config.MONGO_URI);

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
app.use(express.static(__dirname + '/client'));

/*
 |--------------------------------------------------------------------------
 | SSL middleware
 |--------------------------------------------------------------------------
 */
function requireSSL(req, res, next) {
	if (app.get('env') === 'production' && req.get('x-forwarded-proto') !== 'https') {
		res.redirect('https://' + req.hostname + req.url);
	} else {
		next();
	}
}

/*
 |--------------------------------------------------------------------------
 | Routes Configuration
 |--------------------------------------------------------------------------
 */
require('./server/routes/auth')(app);
require('./server/routes/api')(app);

/*
 |--------------------------------------------------------------------------
 | Start the server
 |--------------------------------------------------------------------------
 */
app.listen(app.get('port'), function() {
	console.log('Go to localhost:' + app.get('port'));
});
