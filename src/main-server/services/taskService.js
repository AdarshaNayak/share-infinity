const config  = require('../config/config');
const db =  require('../_helpers/db');
const cmdHelper = require('../_helpers/cmdHelpers');
const User = db.User;
const Provider = db.Provider;
const SystemInfo = db.SystemInfo;
const Task = db.Task;
const CompletedTasks = db.CompletedTasks
const TaskFiles = db.TaskFiles;
const TaskAllocatedProviders = db.TaskAllocatedProviders;

async function getProviders(minCpu,minRam,minStorage){

    return Provider.find({$and: [
            {isOnline : { $eq: true}},
            {isAssigned: {$eq:false}}
        ]}).then( (docs) => {
            const providerIds = [];
            docs.forEach((provider) => providerIds.push(provider.providerId));
              return SystemInfo.find({userId: { $in : providerIds} })
                  .then((systemsInfos) => {
                      const result = {"providers":[]};
                      const matchedSystems = systemsInfos.filter((systemInfo) =>{
                          return systemInfo.ram>=minRam && systemInfo.cpuCores>= minCpu && systemInfo.storage >= minStorage});
                      matchedSystems.forEach((system) => {
                          result["providers"].push({
                              ["providerId"]: system.userId,
                              ["ram"]:system.ram,
                              ["cpu"]:system.cpuCores,
                              ["storage"]:system.storage
                          })
                      })
                      return result;
                  })

        })
}

async function createTask({userId,providerId}){
   return Task.create({consumerId: userId,providerId:providerId,isContainerRunning:false,isCompleted:false,startTime:null,endTime:null,cost:null})
        .then(async (response)=>{
           await TaskAllocatedProviders.create({
                "transactionId":response.transactionId,
               "providerId":providerId
            });
           await TaskFiles.create({
               "transactionId":response.transactionId,
           });
        return {
            ['transactionId']:response.transactionId,
            ['providerId']:providerId
        }
    })
        .catch(err => {
            return err;
        });

}

async function getTasks(userId,type){
    const key = type === "consumer" ? "consumerId" : "providerId";
    return Task.find({[key]: {$eq : userId} })
        .then(async (tasks) => {
            const result = []
            for (const task of tasks) {
               let taskItem = {};
                taskItem = {
                    ['userId']: type==="consumer" ? task.providerId : task.consumerId,
                    ['transactionId']: task.transactionId,
                    ['status'] : "running"
                }
               if(task.isCompleted){
                   await db.CompletedTasks.findOne({transactionId: task.transactionId})
                       .then((completedTask) => {
                           if(!completedTask) throw new Error("task not found");
                           taskItem['status'] = completedTask.status;
                           taskItem['rating'] = completedTask.rating;
                           taskItem['cost'] = completedTask.cost;
                       }).catch(err => {
                           console.log("error ",err);
                       });
               }
               result.push(taskItem);
            }
            return {"results":result};
        })
        .catch(err => err);
}

async function updateTaskStatus({transactionId, status}){
     const task = await Task.findOne({transactionId:transactionId});
     //console.log(task);
      task.isCompleted = true;
      task.save().then((task) => {
            CompletedTasks.create({
                transactionId:task.transactionId,
                consumerId:task.consumerId,
                providerId:task.providerId,
                status:status
            })
                .then(response => {
                    return;
                })
      })
          .catch(err => err);
     return {"message" : "updated Successfully"};
}

async function getTaskStatus(transactionId) {
    const task = await Task.findOne({transactionId:transactionId});
    if(task.isCompleted === true){
       return  CompletedTasks.findOne({transactionId:transactionId})
            .then(completedTask => {
                return {
                    "status":completedTask.status
                };
            })
            .catch(err => err);
    }
    else{
        return {
            "status":"running"
        };
    }
}

async function setTaskTime({transactionId,type}){
    const task = await Task.findOne({transactionId: transactionId});
    task[type] = new Date();
    return task.save().then((res) =>{
            return {
                "message":"updated successfully"
            }
        })
        .catch(err => err);
}

async function getTaskTime(transactionId){
    return Task.findOne({transactionId:transactionId})
        .then((task)=>{
            return {
                "providerId":task.providerId,
                "startTime":task.startTime,
                "endTime":task.endTime
            };
        })
        .catch(err => err);
}

async function setTaskCost({transactionId,cost}){
    const completedTask = await  CompletedTasks.findOne({transactionId:transactionId});
    completedTask.cost = cost;
    console.log(completedTask);
    return completedTask.save()
        .then(response => {
            return {"message":"cost set successfully"};
        })
        .catch(err => err);
}

async function setFileIdentifier({transactionId,type,fileIdentifiers,fileKey}){
    let task = await TaskFiles.findOne({transactionId:transactionId});
    if(task === null){
        //not necessary but added for smooth operation
        task = await TaskFiles.create({
            "transactionId":transactionId
        });
    }
    if(type==="consumer"){
        task.dataFileIdentifier = fileIdentifiers.dataFileIdentifier;
        task.dockerFileIdentifier = fileIdentifiers.dockerFileIdentifier;
        task.dataFileKey = fileKey.dataFileKey;
        cmdHelper.execShellCommand("ipfs get "+fileIdentifiers.dataFileIdentifier).then( (output) => {
            console.log(output);
            cmdHelper.execShellCommand("ipfs get " + fileIdentifiers.dockerFileIdentifier).then(output => {
                console.log(output);
            });
        })
    }
    else{
        task.resultFileIdentifier = fileIdentifiers.resultFileIdentifier;
        task.resultFileKey = fileKey.resultFileKey;
        cmdHelper.execShellCommand("ipfs get "+fileIdentifiers.resultFileIdentifier).then( (output) => {
            console.log(output);
            cmdHelper.execShellCommand("ipfs get " + fileKey.resultFileKey).then(output => {
                console.log(output);
            });
        })
    }
    return task.save()
        .then(response => {
            return {"message":"files data set"};
        })
        .catch(err => {
           console.log("err ",err);
           return err;
        });
}

async function getFileIdentifier(transactionId,type){
    const taskFile = await TaskFiles.findOne({transactionId:transactionId});
    if(taskFile === null){
         throw new Error("files not found");
    }
    if(type === "consumer"){
        return {
            "resultFileIdentifier":taskFile.resultFileIdentifier,
            "resultFileKey":taskFile.resultFileKey
        }
    }
    else{
        return {
            "dataFileIdentifier":taskFile.dataFileIdentifier,
            "dockerFileIdentifier":taskFile.dockerFileIdentifier,
            "dataFileKey":taskFile.dataFileKey
        }
    }
}

async function getTaskAllocatedStatus(userId){
    const status = await TaskAllocatedProviders.findOne({providerId:userId});
    if(status === null){
        return {
            "transactionId" : null
        }
    }
    else {
        return {
            "transactionId" : status.transactionId
        }
    }
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
    getTaskAllocatedStatus
}
