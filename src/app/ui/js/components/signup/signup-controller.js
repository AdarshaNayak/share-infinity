export default class signupController {
	static get $inject() {
		return ["authService", "$location", "$timeout"];
	}

	constructor(authService, $location, $timeout) {
		this.authService = authService;
		this.$location = $location;
		this.$timeout = $timeout;
		this.error = false;
		this.success = false;
		this.username = "";
		this.password = "";
		this.message = "";
		this.repassword = "";
	}

	register() {
		this.error = false;
		this.success = false;
		console.log("hi");
		const ctrl = this;
		this.authService.register(this.username, this.password).then(
			function(response) {
				if (response.data.status == 1) {
					ctrl.success = true;
					ctrl.message = "Successfull! Redirecting to login..";
					ctrl.$timeout(function() {
						ctrl.$location.path("/");
					}, 500);
				} else {
					ctrl.error = true;
					ctrl.message = "Username already exists! Please try again!";
					ctrl.username = "";
					ctrl.password = "";
				}
			},
			function() {
				ctrl.error = true;
				ctrl.message =
					"Something went wrong on the server! Please try again!";
				ctrl.username = "";
				ctrl.password = "";
			}
		);
	}
}
