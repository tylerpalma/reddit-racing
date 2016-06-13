var keystone = require('keystone');
var Series = keystone.list('Series');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'series';
  locals.subsection = 'series-create';
	locals.seriesGames = Series.fields.game.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.seriesSubmitted = false;

	// On POST requests, create new series
	view.on('post', { action: 'createSeries' }, function (next) {
		req.body.owner = locals.user._id;

		var newSeries = new Series.model(),
			updater = newSeries.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'title, game, content, owner',
			errorMessage: 'There was a problem creating your series:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.seriesSubmitted = true;
			}
			next();
		});

	});

	view.render('series/create');

};
