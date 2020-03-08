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
		const config = {
			ram: this.ram,
			cpuCores: this.cpuCores,
			storage: this.storage
		};
		console.log(config);
		sessionStorage.config = JSON.stringify(config);
		this.$location.path("/show-hosts");
	}
}
