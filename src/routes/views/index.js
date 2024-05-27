'use strict';

module.exports = function(app) {
	require('./user')(app);
	require('./cms')(app);
	require('./web')(app);
};
