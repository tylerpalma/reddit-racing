var keystone = require('keystone');
var async = require('async');

var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var User = keystone.list('User');

exports = module.exports = function (req, res, next) {
  var locals = res.locals;

  passport.use(new SteamStrategy ({
      returnURL: 'http://localhost:3000/auth/steam/return',
      realm: 'http://localhost:3000/',
      apiKey: locals.steam_api_key,
    },
    function (identifier, profile, done) {
      done(null, {
  			profile: profile
  		});
    }
  ));

  passport.authenticate('steam', { session: false }, function (err, data, info) {
    steamData = data.profile._json;

    User.model.findOneAndUpdate({ _id: req.user._id }, {services: {steam: {
      isConfigured: true,
			steamId: steamData.steamid,
			username: steamData.personaname,
			avatar: steamData.avatarfull,
    }}}, { new: true }, function (err, data) {
      if(err) {
        console.log('Ya broke it...');
      } else {
        req.user = data;
        return res.redirect('/profile/services');
      }
    });
  })(req, res, next);

};
