// client-app which the user installs on his system
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post("/api/v1/local/dockerconfig", (req, res) => {
	console.log("I am here!!");
	console.log(req.body.commandsToRun);

	res.send({
		message: "Dockerfile create successfully"
	});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
