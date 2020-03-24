const fs = require("fs");
const { exec } = require("child_process");
const homedir = require("os").homedir;
const dir = homedir + "/share-infinity-transactions/";
const compressing = require("compressing");
const axios = require("axios");
const transactionFile =
	homedir + "/share-infinity-transactions/transaction.zip";
const dockerFile = homedir + "/share-infinity-transactions/Dockerfile";
const type = "consumer";
var dockerFileIdentifier = "";
var dataFileIdentifier = "";

function createDockerFile(transactionId, commandsToRun, filePath, vmIp) {
	// const transactionId = transactionId;
	// const commandsToRun = commandsToRun;
	// const filePath = filePath;
	// const vmIp = vmIp;

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	//generate the requirements and shell script file and place it inside the data folder
	var exec_command = "pipreqs --force " + filePath.replace(/\s/g,"\\ ");
	exec(exec_command, (error, stdout, stderr) => {
		if (error) {
			// error condition
			console.log(`error: ${error.message}`);
		} else {
			// add the shell script to the folder as well
			//set the start time and then
			var bashFileArr = [
				"#!/bin/bash",
				"curl --request POST --url " +
					vmIp +
					'/api/v1/task/time --header \'content-type: application/json\'  --data \'{ "type": "startTime",  "transactionId": "' +
					transactionId +
					"\"}'",
				commandsToRun,
				"curl --request POST --url " +
					vmIp +
					'/api/v1/task/time --header \'content-type: application/json\'  --data \'{ "type": "endTime",  "transactionId": "' +
					transactionId +
					"\"}'",
				"curl --request POST --url " +
					vmIp +
					'/api/v1/task/status --header \'content-type: application/json\'  --data \'{ "status": "completed",  "transactionId": "' +
					transactionId +
					"\"}'"
			];
			var file_sh = fs.createWriteStream(filePath + "/shellScript.sh");
			file_sh.on("error", function(err) {
				/* error handling */
			});
			bashFileArr.forEach(function(v) {
				file_sh.write(v + "\n");
			});
			file_sh.end();
			//zip the entire directory
			compressing.tar
				.compressDir(filePath, dir + "transaction.zip")
				.then(res => {
					console.log("Done!!");
					//create the docker file

					var dockerFileArr = [
						"FROM python:3.8-slim-buster",
						"WORKDIR /task",
						"COPY . /task",
						"RUN apt-get update",
						"RUN apt-get install -y curl",
						"RUN pip install --no-cache-dir -r requirements.txt",
						'ENTRYPOINT ["/bin/bash"]',
						'CMD ["shellScript.sh"]'
					];

					//write content into the docker file
					var file = fs.createWriteStream(dir + "Dockerfile");
					file.on("error", function(err) {
						/* error handling */
					});
					dockerFileArr.forEach(function(v) {
						file.write(v + "\n");
					});
					file.end();

					//ipfs add
					exec("ipfs add " + transactionFile, (error, stdout) => {
						if (error) {
							console.log(error);
						} else {
							dataFileIdentifier = stdout.split(" ")[1];
							//console.log(dataFileIdentifier);

							exec("ipfs add " + dockerFile, (error, stdout) => {
								if (error) {
									console.log(err);
								} else {
									dockerFileIdentifier = stdout.split(" ")[1];
									//console.log(dockerFileIdentifier);

									console.log(
										"Going to send file details to vm..."
									);

									axios
										.post(
											vmIp +
												"/api/v1/task/fileIdentifier",
											{
												transactionId: transactionId,
												type: type,
												fileIdentifiers: {
													dataFileIdentifier: dataFileIdentifier,
													dockerFileIdentifier: dockerFileIdentifier
												},
												fileKey: {
													dataFileKey: "filekey"
												}
											}
										)
										.then(function(res) {
											console.log(
												`statusCode: ${res.statusCode}`
											);
											console.log(res);
										})
										.catch(function(err) {
											console.log(err);
										});

									console.log(
										"Sent files to send file details to vm..."
									);
								}
							});
						}
					});
				})
				.catch(err => {
					console.log(err);
				});
		}
	});
}

module.exports = createDockerFile;
