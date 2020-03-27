const config = require("../config/config");
const db = require("../_helpers/db");
const cmdHelper = require("../_helpers/cmdHelpers");
const emailService = require("../services/email.service");
const User = db.User;
const Provider = db.Provider;
const SystemInfo = db.SystemInfo;
const Task = db.Task;
const CompletedTasks = db.CompletedTasks;
const TaskFiles = db.TaskFiles;
const TaskAllocatedProviders = db.TaskAllocatedProviders;

async function getProviderRating(providerId) {
	CompletedTasks.find({ providerId: providerId })
		.then(tasks => {
			if (tasks) {
				const count = tasks.length;
				let totalRating = 0;
				for (const task of tasks) {
					totalRating += task.rating;
				}
				return totalRating / count;
			}
			return 0;
		})
		.catch(error =>
			console.log("error while finding average rating ", error)
		);
}

async function getProviders(minCpu, minRam, minStorage) {
	return Provider.find({
		$and: [{ isOnline: { $eq: true } }, { isAssigned: { $eq: false } }]
	}).then(docs => {
		const providerIds = {};
		docs.forEach(
			provider =>
				(providerIds[provider.providerId] = {
					charge: provider.providerCharge
				})
		);

		return SystemInfo.find({
			userId: { $in: Object.keys(providerIds) }
		}).then(async systemsInfos => {
			const result = { providers: [] };
			const matchedSystems = systemsInfos.filter(systemInfo => {
				return (
					systemInfo.ram >= minRam &&
					systemInfo.cpuCores >= minCpu &&
					systemInfo.storage >= minStorage
				);
			});
			for (const system of matchedSystems) {
				const providerRating = await getProviderRating(system.userId);
				result["providers"].push({
					["providerId"]: system.userId,
					["ram"]: system.ram,
					["cpu"]: system.cpuCores,
					["storage"]: system.storage,
					["rating"]: providerRating,
					["charge"]: providerIds[system.userId]["charge"]
				});
			}
			return result;
		});
	});
}

async function createTask({ userId, providerId }) {
	return Task.create({
		consumerId: userId,
		providerId: providerId,
		isContainerRunning: false,
		isCompleted: false,
		status: "submitted",
		isRated: false,
		isPaymentDone: false,
		startTime: null,
		endTime: null,
		cost: null
	})
		.then(async response => {
			await TaskAllocatedProviders.create({
				transactionId: response.transactionId,
				providerId: providerId
			});
			await db.Provider.findOne({ providerId: providerId }).then(
				provider => {
					if (provider === null) {
						return {
							message: "no provider with given provider id"
						};
					}
					provider.isAssigned = true;
					provider.save();
				}
			);
			await TaskFiles.create({
				transactionId: response.transactionId
			});
			return {
				["transactionId"]: response.transactionId,
				["providerId"]: providerId
			};
		})
		.catch(err => {
			return err;
		});
}

async function getTasks(userId, type) {
	const key = type === "consumer" ? "consumerId" : "providerId";
	return Task.find({ [key]: { $eq: userId } })
		.then(async tasks => {
			const result = [];
			for (const task of tasks) {
				let taskItem = {};
				taskItem = {
					["userId"]:
						type === "consumer" ? task.providerId : task.consumerId,
					["transactionId"]: task.transactionId,
					["status"]: task.status
				};
				if (task.isCompleted) {
					await db.CompletedTasks.findOne({
						transactionId: task.transactionId
					})
						.then(completedTask => {
							if (!completedTask)
								throw new Error("task not found");
							taskItem["rating"] = completedTask.rating;
							taskItem["cost"] = completedTask.cost;
						})
						.catch(err => {
							console.log("error ", err);
						});
				}
				result.push(taskItem);
			}
			return { results: result };
		})
		.catch(err => err);
}

async function updateTaskStatus({ transactionId, status }) {
	const task = await Task.findOne({ transactionId: transactionId });
	console.log(task);
	if (task === null) {
		return { message: "task not found" };
	}
	task.isCompleted = true;
	task.status = status;
	task.save()
		.then(task => {
			CompletedTasks.create({
				transactionId: task.transactionId,
				consumerId: task.consumerId,
				providerId: task.providerId
			})
				.then(response => {
					emailService.sendMail(response.transactionId);
					return response;
				})
				.then(response => {
					getTaskTime(response.transactionId).then(async time => {
						if (time.providerId) {
							const providerInfo = await Provider.findOne({
								providerId: time.providerId
							});
							const cost =
								(providerInfo.endTime -
									providerInfo.startTime) /
								(1000 * 60);
							const res = await setTaskCost({
								transactionId: response.providerId,
								cost: cost
							});
							console.log("set task status ", res);
						}
					});
				});
		})
		.catch(err => err);
	return { message: "updated Successfully" };
}

async function getTaskStatus(transactionId) {
	const task = await Task.findOne({ transactionId: transactionId });
	if (task === null) {
		return { message: "task not found" };
	}
	return {
		status: task.status
	};
}

async function setTaskTime({ transactionId, type }) {
	console.log(transactionId, type);
	const task = await Task.findOne({ transactionId: transactionId });
	if (task === null) {
		return { message: "task not found" };
	}
	task[type] = new Date();
	return task
		.save()
		.then(res => {
			return {
				message: "updated successfully"
			};
		})
		.catch(err => err);
}

async function getTaskTime(transactionId) {
	return Task.findOne({ transactionId: transactionId })
		.then(task => {
			if (task === null) {
				return { message: "task not found" };
			}
			return {
				providerId: task.providerId,
				startTime: task.startTime,
				endTime: task.endTime
			};
		})
		.catch(err => err);
}

async function setTaskCost({ transactionId, cost }) {
	const completedTask = await CompletedTasks.findOne({
		transactionId: transactionId
	});
	if (completedTask === null) {
		return { message: "task not found" };
	}
	completedTask.cost = cost;
	console.log(completedTask);
	return completedTask
		.save()
		.then(response => {
			return { message: "cost set successfully" };
		})
		.catch(err => err);
}

async function setFileIdentifier({
	transactionId,
	type,
	fileIdentifiers,
	fileKey
}) {
	let task = await TaskFiles.findOne({ transactionId: transactionId });
	if (task === null) {
		//not necessary but added for smooth operation
		task = await TaskFiles.create({
			transactionId: transactionId
		});
	}
	if (type === "consumer") {
		task.dataFileIdentifier = fileIdentifiers.dataFileIdentifier;
		task.dockerFileIdentifier = fileIdentifiers.dockerFileIdentifier;
		task.dataFileKey = fileKey.dataFileKey;
		cmdHelper
			.execShellCommand("ipfs get " + fileIdentifiers.dataFileIdentifier)
			.then(output => {
				console.log(output);
				cmdHelper
					.execShellCommand(
						"ipfs get " + fileIdentifiers.dockerFileIdentifier
					)
					.then(output => {
						console.log(output);
					});
			});
	} else {
		task.resultFileIdentifier = fileIdentifiers.resultFileIdentifier;
		task.resultFileKey = fileKey.resultFileKey;
		cmdHelper
			.execShellCommand(
				"ipfs get " + fileIdentifiers.resultFileIdentifier
			)
			.then(output => {
				console.log(output);
				cmdHelper
					.execShellCommand("ipfs get " + fileKey.resultFileKey)
					.then(output => {
						console.log(output);
					});
			});
	}
	return task
		.save()
		.then(response => {
			return { message: "files data set" };
		})
		.catch(err => {
			console.log("err ", err);
			return err;
		});
}

async function getFileIdentifier(transactionId, type) {
	const taskFile = await TaskFiles.findOne({ transactionId: transactionId });
	if (taskFile === null) {
		return { message: "task file not found" };
	}
	if (type === "consumer") {
		return {
			resultFileIdentifier: taskFile.resultFileIdentifier,
			resultFileKey: taskFile.resultFileKey
		};
	} else {
		return {
			dataFileIdentifier: taskFile.dataFileIdentifier,
			dockerFileIdentifier: taskFile.dockerFileIdentifier,
			dataFileKey: taskFile.dataFileKey
		};
	}
}

async function getTaskAllocatedStatus(userId) {
	const status = await TaskAllocatedProviders.findOne({ providerId: userId });
	if (status === null) {
		return {
			transactionId: null
		};
	} else {
		const result = {
			transactionId: status.transactionId
		};
		await TaskAllocatedProviders.deleteOne({ providerId: userId });
		return result;
	}
}

async function updateSystemInfo(sysInfoParam) {
	const sysInfo = new SystemInfo(sysInfoParam);
	await sysInfo.save();
}

async function updateRatings(ratingsParam) {
	const completedTask = await CompletedTasks.findOne({
		transactionId: ratingsParam.transactionId
	});

	completedTask.rating = ratingsParam.rating;
	await completedTask
		.save()
		.then(res => console.log("rating set successfully"))
		.catch(err => console.log(err));

	const task = await Task.findOne({
		transactionId: ratingsParam.transactionId
	});
	task.isRated = true;

	await task
		.save()
		.then(res => console.log("isRated set successfully"))
		.catch(err => console.log(err));
}

async function setContainerStatus(transactionId, status) {
	await Task.findOne({ transactionId: transactionId }).then(async task => {
		task.isContainerRunning = status === "running";
		await task.save();
	});
}

module.exports = {
	getProviders,
	createTask,
	getTasks,
	updateTaskStatus,
	getTaskStatus,
	setTaskTime,
	getTaskTime,
	setTaskCost,
	setFileIdentifier,
	getFileIdentifier,
	getTaskAllocatedStatus,
	updateSystemInfo,
	updateRatings,
	setContainerStatus
};
