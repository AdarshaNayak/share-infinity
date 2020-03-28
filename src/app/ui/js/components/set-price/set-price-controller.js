export default class setPriceController {
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
		if (sessionStorage.getItem("currentUser")) {
			this.userId = JSON.parse(
				sessionStorage.getItem("currentUser")
			).userId;
			console.log(this.userId);
		}
		this.charge = "";
		this.amount;
		this.getCharge();
	}

	getCharge() {
		const ctrl = this;
		this.taskService.getCharge(this.userId).then(
			function(response) {
				ctrl.charge = response.data.charge;
			},
			function(err) {
				console.log(err);
			}
		);
	}

	updateCharge(amount) {
		const ctrl = this;
		this.taskService.updateCharge(this.userId, amount).then(
			function(response) {
				ctrl.charge = response.data.charge;
			},
			function(err) {
				console.log(err);
			}
		);
	}
}
