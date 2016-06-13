var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'account';
	locals.subsection = 'linked-services';
	locals.filters = {
		user: req.params.user
	};
	locals.data = {
		user: []
	};

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

	// Render the view
	console.log(req.user);
	view.render('services');

};
