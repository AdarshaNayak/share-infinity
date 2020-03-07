export default class showHostsController {
	static get $inject() {
		return ["authService", "taskService", "$location", "$timeout"];
	}

	constructor(authService, taskService, $location, $timeout) {
		this.authService = authService;
		this.taskService = taskService;
		this.$location = $location;
		this.$timeout = $timeout;
		this.selection = [];
		this.submittedProviders = [];

		this.providers = JSON.parse(sessionStorage.getItem("providers"));
		this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
		this.uderId = this.currentUser.userId;
		console.log(this.providers);
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
		this.taskService.submitTask(ctrl.userId, providerId).then(
			function(response) {
				// console.log(ctrl);
				// console.log(ctrl.submittedProviders);
				ctrl.submittedProviders.push(myproviderId);

				const transactionId = response.data.transactionId;
				alert(
					"Task submitted successfully with transactionId : " +
						transactionId
				);

				const filePath = document.getElementById(
					"filepath_" + myproviderId
				).value;
				console.log(filePath);

				const commandsToRun = document.getElementById(
					"commands_" + myproviderId
				).value;

				console.log(commandsToRun);

				// ctrl.taskService
				// 	.createDockerfile(transactionId, commandsToRun, filePath)
				// 	.then(
				// 		function(response) {
				// 			console.log(response.data);
				// 		},
				// 		function(err) {
				// 			console.log(err);
				// 		}
				// 	);
			},
			function() {
				"failed to submit task";
			}
		);
	}
}
