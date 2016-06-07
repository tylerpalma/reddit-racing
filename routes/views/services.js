var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'linked-services';
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

	// Load the current post
	view.on('init', function(next) {

      if (!locals.filters.user) locals.filters.user = locals.user._id;

  		var q = keystone.list('User').model.findOne({
  			_id: locals.filters.user
  		});

  		q.exec(function(err, result) {
  			locals.data.user = result;
  			next(err);
  		});

	});

	// Load other posts
	/*view.on('init', function(next) {

		var q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');

		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});

	});*/

	// Render the view
	view.render('services');

};
