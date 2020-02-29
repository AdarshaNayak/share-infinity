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
		this.userId = "";
		this.password = "";
		this.message = "";
		this.repassword = "";
		this.emailId = "";
	}

	register() {
		this.error = false;
		this.success = false;
		console.log("hi");
		const ctrl = this;
		this.authService.register(this.userId, this.password).then(
			function(response) {
				ctrl.success = true;
				ctrl.message = "Successfull! Redirecting to login..";
				ctrl.$timeout(function() {
					ctrl.$location.path("/");
				}, 500);
			},
			function(error) {
				ctrl.error = true;
				ctrl.message = error.data.message;
				ctrl.userId = "";
				ctrl.password = "";
				ctrl.emailId = "";
			}
		);
	}
}
