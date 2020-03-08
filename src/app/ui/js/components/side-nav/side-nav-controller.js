export default class sideNavController {
	static get $inject() {
		return ["$timeout", "$mdSidenav", "$log", "$location"];
	}

	constructor($timeout, $mdSidenav, $log, $location) {
		this.$mdSidenav = $mdSidenav;
		this.$log = $log;
		this.$location = $location;
		this.toggleLeft = this.buildToggler("left");
	}

	buildToggler(componentId) {
		const ctrl = this;
		return function() {
			ctrl.$mdSidenav(componentId).toggle();
		};
	}

	goToSubmitTask() {
		this.$location.path("/submit-task");
		this.toggleLeft();
	}

	goToSubmittedTasks() {
		this.$location.path("/submitted-tasks");
		this.toggleLeft();
	}
}
