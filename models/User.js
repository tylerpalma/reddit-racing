var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
	name: { type: Types.Name },
	username: { type: String, initial: true, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	driverNumber: { type: String, initial: true, required: true },
	location: { type: Types.Location },
	steam: {
		isConfigured: { type: Boolean, label: 'Steam account has been linked', default: false },
		steamId: { type: String, label: 'Steam ID'},
		username: { type: String, label: 'Steam username'},
		avatar: { type: String, label: 'Avatar'},
	},
	live: {
		isConfigured: { type: Boolean, label: 'Live account has been linked', default: false },
	},
	reddit: {
		isConfigured: { type: Boolean, label: 'Live account has been linked', default: false },
		username: { type: String, label: 'Reddit username'},
	},
}, 'Permissions', {
	isVerified: { type: Boolean, label: 'Has verified email address'},
	isMod: { type: Boolean, label: 'Can Moderate', index: true },
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Relationships
 */

User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
