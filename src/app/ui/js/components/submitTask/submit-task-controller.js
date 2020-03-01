export default class submitTaskController {
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
	}
}
