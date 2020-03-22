// client-app which the user installs on his system
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const compressing = require("compressing");
const app = express();
const port = 3000;
const vmIp = "http://127.0.0.1:8000";
let timeoutObj = null;
const { exec } = require("child_process");
const physicalCpuCount = require("physical-cpu-count");
const os = require("os");
const process = require("process");
const createDockerFile = require("./createDockerFile");
const cmdHelper = require("./_helpers/cmdHelper");
const homedir = require("os").homedir;
const dir = homedir + "/share-infinity-transactions/";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post("/api/v1/local/dockerconfig", async (req, res) => {
	console.log("I am here!!");
	const commandsToRun = req.body.commandsToRun;
	const filePath = req.body.filePath;
	const transactionId = req.body.transactionId;

	createDockerFile(transactionId, commandsToRun, filePath, vmIp);

	res.send({
		message: "Task submitted successfully"
	});
});

app.post("/api/v1/local/addFile", (req, res) => {
	const { filePath } = req.body;
	cmdHelper
		.ipfsAdd(filePath)
		.then(response => {
			res.send({
				fileIdentifier: response
			});
		})
		.catch(err => res.sendStatus(400));
});

app.get("/api/v1/local/file/:hash", (req, res) => {
	cmdHelper
		.ipfsGet(req.params.hash)
		.then(response => {
			res.send(response);
		})
		.catch(error => res.sendStatus(400));
});

app.get("/api/v1/local/polling/provider/:userId/:option", (req, res) => {
	const option = req.params.option;
	const userId = req.params.userId;
	console.log(option, userId);

	if (option == "start") {
		console.log(vmIp + "/api/v1/providers/" + userId + "/online");
		axios
			.get(vmIp + "/api/v1/providers/" + userId + "/online")
			.then(res => console.log(res.data))
			.catch(err => console.log("hey"));
		console.log("polling started");
		axios.get(vmIp + "/api/v1/polling/taskRequired/" + userId).then(response => {
				const transactionId = response.data.transactionId;
				console.log(transactionId);
				if (transactionId !== null) {
					axios.get(vmIp + "/api/v1/task/fileIdentifier/provider/" + transactionId)
						.then(response => {
							cmdHelper.execShellCommand("mkdir " + transactionId)
								.then(() => {
									cmdHelper.execShellCommand("pwd")
										.then(path => {
											cmdHelper.ipfsGet(response.data["dataFileIdentifier"], path.slice(0, -1) + "/" + transactionId + "/data.zip")
												.then(() => {
													const dockerFileIdentifier = response.data["dockerFileIdentifier"];
													compressing.tar.uncompress(path.slice(0, -1) + "/" + transactionId + "/data.zip", path.slice(0, -1) + "/" + transactionId)
														.then(() => {
															cmdHelper.ipfsGet(dockerFileIdentifier, path.slice(0, -1) + "/" + transactionId + "/python-project/dockerfile")
																.then(() => {
																	cmdHelper.execShellCommand("docker build -t 'task:latest' ./" + transactionId + "/python-project")
																		.then(response => {
																				console.log(response);
																				cmdHelper.execShellCommand("docker run task:latest")
																					.then(response => {
																							console.log(response);
																						}
																					);
																			}
																		);
																});
														});
												});
										});
								});
						})
						.catch(err => console.log(err));
				} else {
					console.log("calling");
					timeoutObj = setTimeout(function() {
						axios
							.get(
								"http://127.0.0.1:" +
									port +
									"/api/v1/local/polling/provider/" +
									userId +
									"/start"
							)
							.then()
							.catch();
					}, 5000);
				}
			})
			.catch(err => console.log(err));
	} else if (option === "stop") {
		console.log("polling stopped");
		axios
			.get(vmIp + "/api/v1/providers/" + userId + "/offline")
			.then()
			.catch(err => console.log("error while setting offline"));
		clearTimeout(timeoutObj);
	}
	res.sendStatus(200);
});

app.post("/api/v1/local/sysinfo", (req, res) => {
	exec("df -h /", (error, stdout) => {
		if (error) {
			console.log(error);
			return error;
		} else {
			if (process.platform == "darwin") {
				storage = stdout
					.split("\n")[1]
					.split(" ")[7]
					.split("Gi")[0];
			} else {
				storage = stdout
					.split("\n")[1]
					.split(" ")[12]
					.split("G")[0];
			}

			console.log(storage);

			const systemInfo = {
				userId: req.body.userId,
				cpuCores: parseInt(os.cpus().length),
				ram: Math.round(os.totalmem() / (1024 * 1024 * 1024)),
				storage: parseInt(storage)
			};

			console.log("Before sending ...");
			console.log(systemInfo);

			axios
				.post(vmIp + "/api/v1/sysinfo", systemInfo)
				.then(function(response) {
					console.log(response);
					res.send(response);
				})
				.catch(function(err) {
					console.log(err);
					res.sendStatus(500);
				});
		}
	});
});

app.get("/api/v1//local/results/:userId/:transactionId", (req, res) => {
	const transactionId = req.params.transactionId;
	axios
		.get(vmIp + "/api/v1/task/fileIdentifier/consumer/" + transactionId)
		.then(response =>
			cmdHelper
				.ipfsGet(
					response.data["resultFileIdentifier"],
					dir + `${transactionId}.zip`
				)
				.then(res.sendStatus(200))
				.catch(err => console.log(err))
		)
		.catch(err => console.log(err));
});

app.listen(port, () =>
	console.log(`Local server app listening on port ${port}!`)
);
