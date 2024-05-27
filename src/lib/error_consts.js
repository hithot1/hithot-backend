'use strict';

const { definer } = require("node-constants");

var define = require("node-constants")(exports);

define("LOGIN_FAILURE", 901);
define('EMPTY_USER_PASS', 902);
define("UNAUTHORIZED_ACCESS", 903);
define("DB_ERROR", 904);
define("UNKNOWN_ERROR", 905);
define("INETRNAL_ERROR", 906);
define("FILE_UPLOAD_ERROR", 907);
define("INVALID_FILE", 908);
define("INVALID_PARAM", 909);
define("INVALID_DATA", 910);
define("UNDEFINED_DATA", 911);
define("NOT_FOUND", 912);
define("USER_EXISTS", 913);
define("WRONG_OTP", 914);
definer("WRONG_NUMBER",916);
define("API_ERROR", 915);
define("USER_NOT_PREMIUM", 917);

var appError = function(obj) {
	if (obj) {
		var err_msg = obj.message || 'Internal Error';
		var err = new Error(err_msg);
		err.status = obj.status;
		return err;
	}
};

var checkError = function(err) {
	if (err) {
		console.log('DB Error:', err);
	}
};

define("appError", appError);
define("checkError", checkError);