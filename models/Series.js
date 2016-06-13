var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Series = new keystone.List('Series', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Series.add({
	title: { type: String, required: true },
	owner: { type: Types.Relationship, ref: 'User', index: true },
	game: { type: Types.Select, options: [
      { label: 'Assetto Corsa', value: 'assetto-corsa' },
      { label: 'Forza 6', value: 'forza-6' },
    ]
  },
	content: { type: Types.Html, wysiwyg: true, height: 400 },
  //drivers: { type: Types.Realtionship, ref: 'User', many: true },
	//races: { type: Types.Relationship, ref: 'Race', many: true },
});

Series.defaultColumns = 'title, owner|20%, game|20%';
Series.register();
