export default class logoutController {
	static get $inject() {
		return ["authService", "$location"];
	}

	constructor(authService, $location) {
		this.authService = authService;
		this.$location = $location;
	}

	logout() {
		//console.log("in logout");
		this.authService.logout();
		//console.log("after logout");

		this.$location.path("/");
		//console.log("after path");
	}

	isLoggedIn() {
		//console.log("inside isLoggedIn");
		if (this.authService.isLoggedIn()) {
			return true;
		}
		return false;
	}
}
