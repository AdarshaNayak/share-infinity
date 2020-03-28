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
		const LIMIT = 100;
		this.authService = authService;
		this.taskService = taskService;
		this.$location = $location;
		this.$timeout = $timeout;
		this.$mdDialog = $mdDialog;
		this.rating = new Array(LIMIT).fill(0);
		this.downloading = new Array(LIMIT).fill(false);

		this.error = false;
		this.success = false;
		this.message = "";

		this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
		this.tasks = [];
		this.getTasks();
	}

	showAlert(msg, text) {
		const ctrl = this;
		// Appending dialog to document.body to cover sidenav in docs app
		// Modal dialogs should fully cover application
		// to prevent interaction outside of dialog
		this.$mdDialog.show(
			ctrl.$mdDialog
				.alert()
				.parent(angular.element(document.body))
				.clickOutsideToClose(true)
				.title(msg)
				.textContent(text)
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

	getResults(transactionId, index) {
		this.downloading[index] = true;
		const ctrl = this;
		this.taskService
			.getResults(this.currentUser.userId, transactionId)
			.then(
				function(response) {
					ctrl.showAlert(
						"Results Downloaded Successfully!",
						`Please find the file ${transactionId}.zip in the folder share-infinity-transactions in your home directory`
					);
					ctrl.downloading[index] = false;
				},

				function(err) {
					console.log(err);
				}
			);
	}

	submitRating(transactionId, index) {
		const ctrl = this;

		this.taskService.submitRating(transactionId, this.rating[index]).then(
			function(response) {
				ctrl.showAlert("Ratings submitted successfully", "");
				ctrl.getTasks();
			},
			function(err) {
				console.log(err);
			}
		);
	}

	makePayment(transactionId, amount) {
		const ctrl = this;

		this.taskService.makePayment(transactionId, amount).then(
			function(response) {
				ctrl.showAlert(response.data.message, "");
				ctrl.getTasks();
			},
			function(err) {
				ctrl.showAlert(err.data.message, "");
			}
		);
	}
}
