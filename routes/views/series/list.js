var keystone = require('keystone');
var Series = keystone.list('Series');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'series';
	locals.subsection = 'series-create';
	locals.data = {
		series: [],
	};

	view.on('init', function (next) {
		Series.model.find().populate('owner').exec(function (err, results) {
			if (err || !results.length) {
				return next(err);
			}

			locals.data.series = results;
			console.log(results);
			next();
		});
	});

	view.render('series/list');

};
