const expressJwt = require("express-jwt");
const config = require("../config/config.json");
const userService = require("../services/user.service");

module.exports = jwt;

function jwt() {
	const secret = config.secret;
	return expressJwt({ secret, isRevoked }).unless({
		path: [
			// public routes that don't require authentication
			"/api/v1/users/login",
			"/api/v1/users/register"
		]
	});
}
