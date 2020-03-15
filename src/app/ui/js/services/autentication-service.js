export default class authService {
	static get $inject() {
		return ["$http"];
	}

	constructor($http, $timeout) {
		this.$http = $http;
		this.$timeout = $timeout;
		this.ip = "http://localhost:8000";
	}

	register(userId, password, emailId) {
		return this.$http.post(this.ip + "/api/v1/users/register", {
			userId: userId,
			password: password,
			emailId: emailId
		});
	}

	isLoggedIn() {
		if (sessionStorage.getItem("currentUser")) {
			return true;
		} else {
			return false;
		}
	}

	login(userId, password) {
		return this.$http.post(this.ip + "/api/v1/users/login", {
			userId: userId,
			password: password
		});
	}

	logout() {
		sessionStorage.clear();
	}
}
