export default class authService {
	static get $inject() {
		return ["$http"];
	}

	constructor($http, $timeout) {
		this.$http = $http;
		this.$timeout = $timeout;
		this.ip = "http://localhost:5000";
	}

	register(username, password) {
		return this.$http.post(this.ip + "/api/v1/register", {
			username: username,
			password: password
		});
	}

	isLoggedIn() {
		if (sessionStorage.user == "true") {
			return true;
		} else {
			return false;
		}
	}

	login(username, password) {
		return this.$http.post(this.ip + "/api/v1/login", {
			username: username,
			password: password
		});
	}

	logout() {
		sessionStorage.clear();
	}
}
