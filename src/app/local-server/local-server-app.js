// client-app which the user installs on his system
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = 3000;
const vmIp = "http://localhost:8000";
let timeoutObj = null;
const { exec } = require('child_process');

const createDockerFile = require("./createDockerFile");
const cmdHelper = require("./_helpers/cmdHelper");

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

app.post("/api/v1/local/addFile",(req,res) => {
	const { filePath} = req.body;
	cmdHelper.ipfsAdd(filePath)
		.then((response => {
			res.send({
				"fileIdentifier" : response
			});
		}))
		.catch(err => res.sendStatus(400));
});

app.get("/api/v1/local/file/:hash",(req,res) => {
	cmdHelper.ipfsGet(req.params.hash)
		.then(response => {
			res.send(response);
		})
		.catch(error => res.sendStatus(400));
});

app.get("/api/v1/local/polling/provider/:userId/:option",(req,res) => {
	const option = req.params.option;
	const userId = req.params.userId;

	if(option == "start"){
			axios.get(vmIp+"/api/v1/polling/taskRequired/"+userId)
				.then(response => {
					const transactionId = response.data.transactionId;
					console.log(transactionId);
					if(transactionId !== null){
						axios.get(vmIp+"/api/v1/task/fileIdentifier/provider/"+transactionId)
							.then(response => {

								cmdHelper.execShellCommand("mkdir "+transactionId)
									.then(() => {
										cmdHelper.execShellCommand("pwd")
											.then((path) => {
												cmdHelper.ipfsGet(response.data["dataFileIdentifier"],path.slice(0,-1)+"/"+transactionId+"/data.zip").then(() => {
													cmdHelper.ipfsGet(response.data["dockerFileIdentifier"],path.slice(0,-1)+"/"+transactionId+"/dockerfile").then(() =>{
														cmdHelper.execShellCommand("docker build -t 'test:latest' ./"+transactionId).then(response => {
															console.log(response);
														})
													});
												});
											})
									})
							})
					}
					else{
					 timeoutObj = setTimeout(function () {
							http.get("localhost:"+port+"/api/v1/local/polling/provider/"+userId+"start");
						},5000);
					}
				})
	}
	else if(option === "stop"){
		clearTimeout(timeoutObj);
	}
	res.sendStatus(200);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
