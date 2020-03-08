// nodejs server running on aws

// var wallet = require('./models/wallet');
// var rating = require('./models/rating');
// var completedTask = require('./models/completedTask');
// var task = require('./models/task');
// var systemInfo = require('./models/systemInfo');
// var PlatformProfit =  require('./models/platformProfit');

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("./_helpers/jwt");
const errorHandler = require("./_helpers/error-handler");

//Importing services
const userService = require("./services/user.service");
const taskService = require("./services/taskService");

//helpers
//const loadDatabase =  require('./_helpers/loadDatabase');
//loadDatabase.loadDatabase(); //do it only first time!

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api (disabled temporarily so that we need not send bearer token everytime )
//app.use(jwt());

//API routes

app.post("/api/v1/users/register", (req, res, next) => {
	userService
		.create(req.body)
		.then(() => res.json({ message: "success" }))
		.catch(err => next(err));
});

app.post("/api/v1/users/login", (req, res, next) => {
	userService
		.authenticate(req.body)
		.then(user =>
			user
				? res.json(user)
				: res
						.status(400)
						.json({ message: "userId or password is incorrect" })
		)
		.catch(err => next(err));
});

app.delete("/api/v1/users/:id", (req, res, next) => {
	userService
		.delete(req.params.id)
		.then(() => res.json({}))
		.catch(err => next(err));
});

//just for testing
app.get("/api/v1/users/:id", (req, res, next) => {
	userService
		.getById(req.params.id)
		.then(user => (user ? res.json(user) : res.sendStatus(404)))
		.catch(err => next(err));
});


app.get("/api/v1/providers/:cpu/:ram/:storage",(req,res,next) => {
	taskService
		.getProviders(parseInt(req.params.cpu),parseInt(req.params.ram),parseInt(req.params.storage))
		.then(response => {
			response ? res.send(response) : res.sendStatus(400);
		})
		.catch(err => next(err));
});

app.post("/api/v1/tasks",(req,res,next) => {
	taskService.createTask(req.body)
		.then(response => {
			console.log(response);
			res.send(response);
		})
		.catch(err => {
			next(err);
		});
});

app.get("/api/v1/tasks/:userId/:type",(req,res,next) => {
	taskService.getTasks(req.params.userId,req.params.type)
		.then(response => {
			res.send(response);
		})
		.catch(err => next(err));
});

app.post("/api/v1/task/status",(req,res,next) => {
	taskService.updateTaskStatus(req.body)
		.then((response) => {
			response ? res.send(response) : res.sendStatus(400);
		})
		.catch(err => next(err));
});

app.get("/api/v1/task/status/:transactionId",(req,res,next) => {
	taskService.getTaskStatus(req.params.transactionId)
		.then(response => {
			response ? res.send(response) : res.sendStatus(400)
		})
		.catch(error => next(error));
});

// NOTE: the below middleware has to be applied after calling the api so do not move it
// global error handler
app.use(errorHandler);

// start server
const port = 8000;
app.listen(port, function() {
	console.log("Server listening on port " + port);
});
