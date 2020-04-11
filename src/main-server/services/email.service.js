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
		text = `<style>
		table, th, td {
		 border: solid 1px #000;
		 padding: 10px;
	   }
	   
	   table {
		   border-collapse:collapse;
		   caption-side:bottom;
	   }
	   
	   </style>
	   
	   <p> Hi ${task.consumerId}, please find below the details of your transaction: </p>
	   <table>
		 <tbody>
			 <tr>
			   <td>Transaction ID</td>
			   <td>: ${task.transactionId}</td>
			 </tr>
			 <tr>
			   <td>Provider ID</td>
			   <td>: ${task.providerId}</td>
	   
			 </tr>
			 <tr>
			   <td>Start time</td>
			   <td>: ${task.startTime}</td>
	   
			 </tr>
			 <tr>
			   <td>End time</td>
			   <td>: ${task.endTime}</td>
			 </tr>
			 <tr>
			   <td>Status</td>
			   <td style="color:green"><strong>: COMPLETED SUCCESSFULLY</strong></td>
			 </tr>
		 </tbody>
	   </table>
	   <br>
	   <p> Regards, </p>
	   <p>Team Share Infinity</p>`;
	} else {
		text = `<style>
		table, th, td {
		 border: solid 1px #000;
		 padding: 10px;
	   }
	   
	   table {
		   border-collapse:collapse;
		   caption-side:bottom;
	   }
	   
	   </style>
	   
	   <p> Hi ${task.consumerId}, please find below the details of your transaction: </p>
	   <table>
		 <tbody>
			 <tr>
			   <td>Transaction ID</td>
			   <td>: ${task.transactionId}</td>
			 </tr>
			 <tr>
			   <td>Provider ID</td>
			   <td>: ${task.providerId}</td>
			 <tr>
			   <td>Status</td>
			   <td style="color:red"><strong>: FAILED</strong></td>
			 </tr>
		 </tbody>
	   </table>
	   <br>
	   <p> Regards, </p>
	   <p>Team Share Infinity</p>`;
	}

	var transport = nodemailer.createTransport({
		host: "smtp.mailgun.org",
		port: 587,
		auth: {
			user:
				"postmaster@sandbox7aa63df50e464f08a309423d01d449f4.mailgun.org",
			pass: "500693c7c2fde23fab116c6f123b51c4-c322068c-833d46be",
		},
	});

	const message = {
		from: "Share Infinity <no-reply@share-infinity.com>", // Sender address
		to: emailId, // List of recipients
		subject: "share-infinity update", // Subject line
		html: text, // Plain text body
	};
	transport.sendMail(message, function (err, info) {
		if (err) {
			console.log(err);
		} else {
			console.log(info);
		}
	});
}

module.exports = { sendMail };
