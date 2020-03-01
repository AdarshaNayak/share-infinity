export default class sideNavController {
	static get $inject() {
		return ["$timeout", "$mdSidenav", "$log", "$location"];
	}

	constructor($timeout, $mdSidenav, $log, $location) {
		this.$mdSidenav = $mdSidenav;
		this.$log = $log;
		this.$location = $location;
		this.toggleLeft = this.buildToggler("left");

		this.consumer = ["Submit Task", "Submitted Tasks"];
		this.provider = ["Running Tasks", "Set Usage Price"];
		this.common = ["Wallet"];
	}

	buildToggler(componentId) {
		const ctrl = this;
		return function() {
			ctrl.$mdSidenav(componentId).toggle();
		};
	}

	page() {
		this.$location.path("/submit-task");
		this.toggleLeft();
	}
}
