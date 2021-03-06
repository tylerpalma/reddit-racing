var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'profile';
	locals.filters = {
		user: req.params.user
	};
	locals.data = {
		user: []
	};

	locals.sidebarNavLinks = [
		{ label: 'Profile',	key: 'profile',	href: '/profile', icon: 'fa-user' },
		{ label: 'Linked Services', key: 'linked-services', href: '/profile/services', icon: 'fa-link' }
	];

	// Load current user
	view.on('init', function(next) {

      if (!locals.filters.user) locals.filters.user = locals.user._id;

  		var q = keystone.list('User').model.findOne({
  			_id: locals.filters.user
  		});

  		q.exec(function(err, result) {
  			locals.data.user = result;
				console.log(locals.data.user);
  			next(err);
  		});

	});

	// Render the view
	view.render('profile');

};
