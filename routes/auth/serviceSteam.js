var keystone = require('keystone');
var async = require('async');

var passport = require('passport');
var User = keystone.list('User');

exports = module.exports = function (req, res, next) {
  var locals = res.locals;
  var baseUrl = keystone.get('base url');

  passport.authenticate('steam', { failureRedirect: '/profile/services', session: false }, function (err, data, info) {
    steamData = data._json;

    User.model.findOneAndUpdate({ _id: req.session.userId }, {steam: {
      isConfigured: true,
			steamId: steamData.steamid,
			username: steamData.personaname,
			avatar: steamData.avatarfull,
    }}, { new: true }, function (err, data) {
      if(err) {
        console.log('Ya broke it...');
      } else {
        req.user = data;
        return res.redirect('/profile/services');
      }
    });
  })(req, res, next);

};
