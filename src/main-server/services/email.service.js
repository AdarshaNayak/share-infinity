const config = require("../config/config");
const db = require("../_helpers/db");
const cmdHelper = require("../_helpers/cmdHelpers");
const User = db.User;
const Provider = db.Provider;
const SystemInfo = db.SystemInfo;
const Task = db.Task;
const CompletedTasks = db.CompletedTasks;
const TaskFiles = db.TaskFiles;
const TaskAllocatedProviders = db.TaskAllocatedProviders;
const nodemailer = require("nodemailer");

async function sendMail(transactionId, status) {
	const task = await Task.findOne({ transactionId: transactionId });
	const user = await User.findOne({ userId: task.consumerId });

	console.log(task);
	console.log(user);
	const emailId = user.emailId;
	var text;

	if (status == 1) {
		text = `Hi ${task.consumerId}, \nPlease find below the details of the task submitted: \nTransaction ID : ${task.transactionId} \nStart time : ${task.startTime} \nEnd time: ${task.endTime} \nStatus: Completed \n\nTeam Share Infinity`;
	} else {
		text = `Hi ${task.consumerId}, \nPlease find below the details of the task submitted: \nTransaction ID : ${task.transactionId}\nStatus: Failed\n\nTeam Share Infinity`;
	}

	var transport = nodemailer.createTransport({
		host: "smtp.mailgun.org",
		port: 587,
		auth: {
			user:
				"postmaster@sandbox7aa63df50e464f08a309423d01d449f4.mailgun.org",
			pass: "500693c7c2fde23fab116c6f123b51c4-c322068c-833d46be"
		}
	});

	const message = {
		from: "Share Infinity <no-reply@share-infinity.com>", // Sender address
		to: emailId, // List of recipients
		subject: "share-infinity update", // Subject line
		text: text // Plain text body
	};
	transport.sendMail(message, function(err, info) {
		if (err) {
			console.log(err);
		} else {
			console.log(info);
		}
	});
}

module.exports = { sendMail };
