var keystone = require('keystone');
var async = require('async');
var request = require('request');
var passport = require('passport');
var User = keystone.list('User');

exports = module.exports = function (req, res, next) {
  var locals = res.locals;
  var baseUrl = keystone.get('base url');

  if (req.query.state == req.session.redditState) {
    req.session.redditCode = req.query.code;
    passport.authenticate('reddit', {
      session: false,
      successRedirect: '/profile/services',
      failureRedirect: '/profile/services',
    }, function (err, data, info) {
      console.log('USERNAME: '+ data.name);
      User.model.findOneAndUpdate({ _id: req.session.userId }, {reddit: {
  			isConfigured: true,
  			username: data.name,
  		}}, { new: true }, function (err, data) {
        if(err) {
          console.log('Ya broke it...');
        } else {
          res.redirect('/profile/services');
        }
      });
    })(req, res, next);
  } else {
    next(new Error(403));
  }
};
