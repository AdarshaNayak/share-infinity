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
		this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
		this.userId = this.currentUser.userId;
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
		if(mode === undefined || mode === false){
			this.$http.post(this.ip + "/api/v1/tasks", {
				userId: userId,
				providerId: providerId
			});
			this.$http.get(
				this.localIp+"/api/v1/local/polling/provider/"+this.userId+"/start"
			);
		}
		else{
			this.$http.get(
				this.localIp+"/api/v1/local/polling/provider/"+this.userId+"/stop"
			);
		}

	}
}
