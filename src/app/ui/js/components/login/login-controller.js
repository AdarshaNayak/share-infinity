export default class loginController {
	static get $inject() {
		return ["authService", "$location", "$timeout", "taskService"];
	}

	constructor(authService, $location, $timeout, taskService) {
		this.authService = authService;
		this.$location = $location;
		this.$timeout = $timeout;
		this.taskService = taskService;
		this.error = false;
		this.success = false;
		this.userId = "";
		this.password = "";
		this.message = "";
	}

	login() {
		this.error = false;
		this.success = false;
		console.log("in login !!");
		const ctrl = this;
		this.authService.login(this.userId, this.password).then(
			function (response) {
				console.log(response.data);
				if (response.data && response.data.token) {
					sessionStorage.setItem(
						"currentUser",
						JSON.stringify(response.data)
					);
					ctrl.success = true;
					ctrl.message = "Login Successful!";

					ctrl.taskService.updateSystemInfo(ctrl.userId).then(
						function (response) {
							console.log("system info updated ... ", response);
						},
						function (error) {
							console.log(
								"system info failed to update .. " + error
							);
						}
					);

					ctrl.$timeout(function () {
						ctrl.$location.path("/submit-task");
					}, 500);
				}
			},
			function (error) {
				ctrl.error = true;
				ctrl.message = error.data.message;
				ctrl.userId = "";
				ctrl.password = "";
			}
		);
	}
}
