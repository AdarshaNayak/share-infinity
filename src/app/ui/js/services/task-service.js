export default class taskService {
	static get $inject() {
		return ["$http"];
	}

	constructor($http, $timeout) {
		this.$http = $http;
		this.$timeout = $timeout;
		this.ip = "http://localhost:8000";
		this.localIp = "http://localhost:3000";
	}

	getProviders(ram, cpuCores, storage) {
		const request =
			this.ip +
			"/api/v1/providers/" +
			cpuCores +
			"/" +
			ram +
			"/" +
			storage;
		console.log(request);
		return this.$http.get(request);
	}

	submitTask(userId, providerId) {
		return this.$http.post(this.ip + "/api/v1/tasks", {
			userId: userId,
			providerId: providerId
		});
	}

	createDockerfile(transactionId, commandsToRun, filePath) {
		return this.$http.post(this.localIp + "/api/v1/local/dockerconfig", {
			transactionId: transactionId,
			commandsToRun: commandsToRun,
			filePath: filePath
		});
	}
}
