const config = require("../config/config.json");
const mongoose = require("mongoose");
mongoose.connect(config.connectionString, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

module.exports = {
	User: require("../models/user"),
	Provider:require("../models/provider"),
	SystemInfo:require("../models/systemInfo"),
	Task: require("../models/task"),
	TaskFiles: require("../models/taskFiles"),
	CompletedTasks: require("../models/completedTask"),
	TaskAllocatedProviders: require("../models/taskAllocatedProviders"),
	Wallet: require("../models/wallet")
};
