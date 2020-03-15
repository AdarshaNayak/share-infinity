export default class signupController {
	static get $inject() {
		return ["authService", "taskService", "$location", "$timeout"];
	}

	constructor(authService, taskService, $location, $timeout) {
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
		this.taskService = taskService;
	}

	register() {
		this.error = false;
		this.success = false;
		console.log("hi");
		const ctrl = this;
		this.authService
			.register(this.userId, this.password, this.emailId)
			.then(
				function(response) {
					ctrl.success = true;
					ctrl.message = "Successfull! Redirecting to login..";

					ctrl.taskService.updateSystemInfo(ctrl.userId).then(
						function(response) {
							console.log("system info updated ... ", response);
						},
						function(error) {
							console.log(
								"system info failed to update .. " + error
							);
						}
					);

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
