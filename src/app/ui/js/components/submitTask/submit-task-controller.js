export default class submitTaskController {
	static get $inject() {
		return ["authService", "taskService", "$location", "$timeout"];
	}

	constructor(authService, taskService, $location, $timeout) {
		this.authService = authService;
		this.taskService = taskService;
		this.$location = $location;
		this.$timeout = $timeout;

		this.ram = "";
		this.cpuCores = "";
		this.storage = "";
	}

	getProviders() {
		const ctrl = this;
		this.taskService
			.getProviders(this.ram, this.cpuCores, this.storage)
			.then(
				function(response) {
					sessionStorage.providers = JSON.stringify(
						response.data.providers
					);
					ctrl.$location.path("/show-hosts");
				},
				function(err) {
					console.log("Some error!");
				}
			);
	}
}
