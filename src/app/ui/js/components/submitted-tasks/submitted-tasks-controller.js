export default class submittedTasksController {
	static get $inject() {
		return ["authService", "taskService", "$location", "$timeout"];
	}

	constructor(authService, taskService, $location, $timeout) {
		this.authService = authService;
		this.taskService = taskService;
		this.$location = $location;
		this.$timeout = $timeout;

		this.error = false;
		this.success = false;
		this.message = "";

		this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
		this.tasks = [];
		this.getTasks();
	}

	getTasks() {
		const ctrl = this;
		this.taskService.getSubmittedTasks(this.currentUser.userId).then(
			function(response) {
				ctrl.tasks = response.data.results;
				console.log(ctrl.tasks);
			},
			function(err) {
				console.log(err);
			}
		);
	}

	getResults(transactionId) {
		const ctrl = this;
		this.taskService
			.getResults(this.currentUser.userId, transactionId)
			.then(
				function(response) {
					ctrl.success = true;
					ctrl.message = response.data.message;
					ctrl.$timeout(function() {
						ctrl.success = false;
					}, 3000);
				},

				function(err) {
					ctrl.error = true;
					ctrl.message = err.data;
					ctrl.$timeout(function() {
						ctrl.error = false;
					}, 3000);
				}
			);
	}
}
