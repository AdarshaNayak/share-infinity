// client-app which the user installs on his system
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;
const vmIp = "http://localhost:8000";

const createDockerFile = require("./createDockerFile");

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
