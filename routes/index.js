/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var bodyParser = require('body-parser');
var passport = require('passport');
var RedditStrategy = require('passport-reddit').Strategy;
var SteamStrategy = require('passport-steam').Strategy;
var crypto = require('crypto');
var importRoutes = keystone.importer(__dirname);

//
//	Set passport strategies
//

passport.use(new SteamStrategy ({
		returnURL: keystone.get('base url') + 'auth/steam/return',
		realm: keystone.get('base url'),
		apiKey: keystone.get('steam api key'),
	},
	function (identifier, profile, done) {
		process.nextTick(function () {
			profile.identifier = identifier;
			return done(null, profile);
		});
	}
));

passport.use(new RedditStrategy ({
		clientID: keystone.get('reddit app id'),
		clientSecret: keystone.get('reddit app secret'),
		callbackURL: keystone.get('base url') + 'auth/reddit/return',
	},
	function (accessToken, refreshToken, profile, done) {
		return done(null, profile);
	}
));

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', passport.initialize());
keystone.pre('routes', passport.session({ secret: keystone.get('cookie secret') }));
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	auth: importRoutes('./auth'),
};

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Setup Route Bindings
exports = module.exports = function(app) {

	// Views
	app.get('/', routes.views.index);
	app.get('/profile', routes.views.profile);
	app.get('/profile/services', routes.views.services);
	app.get('/user/:user', routes.views.profile);
	app.get('/series', routes.views.series.list);
	app.all('/series/create', routes.views.series.create);

	// Session
	app.all('/join', routes.views.session.join);
	app.all('/signin', routes.views.session.signin);
	app.get('/signout', routes.views.session.signout);
	//app.all('/forgot-password', routes.views.session['forgot-password']);
	//app.all('/reset-password/:key', routes.views.session['reset-password']);

	// Authentication
	app.all('/auth/confirm', routes.auth.confirm);
	app.all('/auth/app', routes.auth.app);

	// Service Auth
	app.all('/auth/steam',
		passport.authenticate('steam', { failureRedirect: '/profile/services' }),
		function (req, res) {
			res.redirect('/profile/services');
		});
	app.all('/auth/steam/return', routes.auth.serviceSteam);
	app.all('/auth/reddit', function (req, res, next) {
		req.session.redditState = crypto.randomBytes(32).toString('hex');
		passport.authenticate('reddit', {
			state: req.session.redditState,
		})(req, res, next);
	});
	app.all('/auth/reddit/return', routes.auth.serviceReddit);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
