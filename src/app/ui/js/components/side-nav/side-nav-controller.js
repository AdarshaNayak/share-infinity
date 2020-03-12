export default class sideNavController {
	static get $inject() {
		return ["$timeout", "$mdSidenav", "$log", "$location","$http"];
	}

	constructor($timeout, $mdSidenav, $log, $location,$http) {
		this.$mdSidenav = $mdSidenav;
		this.$log = $log;
		this.$location = $location;
		this.toggleLeft = this.buildToggler("left");
		this.$http = $http;
		this.localIp = "http://localhost:3000";
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
	goToRunningTasks() {
		this.$location.path("/running-tasks");
		this.toggleLeft();
	}

	poll(mode) {
		console.log(mode);
		var userId = JSON.parse(sessionStorage.getItem("currentUser")).userId;
		if(mode === undefined || mode === false){
			this.$http.get(
				this.localIp+"/api/v1/local/polling/provider/"+userId+"/start"
			);
		}
		else{
			this.$http.get(
				this.localIp+"/api/v1/local/polling/provider/"+userId+"/stop"
			);
		}

	}
}
