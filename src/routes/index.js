'use strict';

module.exports = function(app) {
	require('./api')(app);
	require('./views')(app);
};
