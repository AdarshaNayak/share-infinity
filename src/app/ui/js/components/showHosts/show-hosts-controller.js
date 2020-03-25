export default class showHostsController {
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
		this.selection = [];
		this.submittedProviders = [];
		this.status = false;

		this.getHosts();
		this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
		this.userId = this.currentUser.userId;
		console.log(this.providers);
	}

	showAlert(title, text) {
		const ctrl = this;
		// Appending dialog to document.body to cover sidenav in docs app
		// Modal dialogs should fully cover application
		// to prevent interaction outside of dialog
		this.$mdDialog.show(
			ctrl.$mdDialog
				.alert()
				.clickOutsideToClose(true)
				.title(title)
				.textContent(text)
				.ariaLabel("Alert success")
				.ok("OK")
		);
	}

	toggleSelection(userId) {
		console.log(userId);
		var idx = this.selection.indexOf(userId);

		if (idx > -1) {
			this.selection.splice(idx, 1);
		} else {
			this.selection.push(userId);
		}

		console.log(this.selection);
	}

	submitTask(providerId) {
		const ctrl = this;
		const myproviderId = providerId;
		console.log(this.submittedProviders);
		this.taskService.submitTask(this.userId, providerId).then(
			function(response) {
				// console.log(ctrl);
				// console.log(ctrl.submittedProviders);
				ctrl.submittedProviders.push(myproviderId);

				const transactionId = response.data.transactionId;
				// alert(
				// 	"Task submitted successfully with transactionId : " +
				// 		transactionId
				// );

				//ctrl.showAlert(transactionId);

				const filePath = document.getElementById(
					"filepath_" + myproviderId
				).value;
				console.log(filePath);

				const commandsToRun = document.getElementById(
					"commands_" + myproviderId
				).value;

				console.log(commandsToRun);

				ctrl.taskService
					.createDockerfile(transactionId, commandsToRun, filePath)
					.then(
						function(response) {
							console.log(response.data);
							ctrl.showAlert(
								"Task Submitted Successfully!",
								`Transaction ID: ${transactionId}`
							);
						},
						function(err) {
							console.log(err);
							ctrl.showAlert(
								"Dockerfile creation failed due to error in python code",
								"Please resubmit after checking your code"
							);
						}
					);
			},
			function() {
				console.log("failed to submit task");
				ctrl.showAlert("Task submission failed!", "");
			}
		);
	}

	getHosts() {
		const ctrl = this;
		const config = JSON.parse(sessionStorage.getItem("config"));
		this.taskService
			.getProviders(config.ram, config.cpuCores, config.storage)
			.then(
				function(response) {
					ctrl.providers = response.data.providers;
				},
				function(err) {
					console.log("Some error!");
				}
			);
	}
}
