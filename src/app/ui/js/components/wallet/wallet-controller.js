export default class walletController {
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
		this.balance = "";
		this.amount;
		this.getBalance();
	}

	getBalance() {
		const ctrl = this;
		this.taskService.getBalance(this.userId).then(
			function(response) {
				ctrl.balance = response.data.balance;
			},
			function(err) {
				console.log(err);
			}
		);
	}

	updateBalance(amount) {
		const ctrl = this;
		this.taskService.updateBalance(this.userId, amount).then(
			function(response) {
				ctrl.balance = response.data.balance;
			},
			function(err) {
				console.log(err);
			}
		);
	}
}
