export default class submittedTasksController {
	static get $inject() {
		return [
			"authService",
			"taskService",
			"$location",
			"$timeout",
			"$mdDialog"
		];
	}

	constructor(authService, taskService, $location, $timeout, $mdDialog) {
		this.authService = authService;
		this.taskService = taskService;
		this.$location = $location;
		this.$timeout = $timeout;
		this.$mdDialog = $mdDialog;
		this.status = "";

		this.error = false;
		this.success = false;
		this.message = "";

		this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
		this.tasks = [];
		this.getTasks();
	}

	showAlert(transactionId, providerId) {
		const ctrl = this;
		// Appending dialog to document.body to cover sidenav in docs app
		// Modal dialogs should fully cover application
		// to prevent interaction outside of dialog
		this.$mdDialog.show(
			ctrl.$mdDialog
				.alert()
				.parent(angular.element(document.body))
				.clickOutsideToClose(true)
				.title("Results Downloaded Successfully!")
				.textContent(`Transaction ID : ${transactionId}`)
				.ariaLabel("Alert success")
				.ok("OK")
		);
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

	getResults(transactionId, providerId) {
		const ctrl = this;
		this.taskService
			.getResults(this.currentUser.userId, transactionId)
			.then(
				function(response) {
					ctrl.showAlert(transactionId, providerId);
				},

				function(err) {}
			);
	}
}
