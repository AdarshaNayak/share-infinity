const db = require('../_helpers/db');
const User = db.User;
const Provider = db.Provider;
const SystemInfo = db.SystemInfo;
const Task = db.Task;
const TaskFiles = db.TaskFiles;
const CompletedTasks = db.CompletedTasks;

 function loadDatabase(){
    for(let i=1;i<=40;i++){
         User.create({userId:`CORONA${i}`,hash:`COVID!!${i}`,emailId: `COVID${i}@WUHAN.com`}).catch(err => {
            console.log("error is ",err);
        })
        SystemInfo.create({userId:`CORONA${i}`,ram:parseInt(Math.random()*32) ,cpuCores:parseInt(Math.random()*32),storage:parseInt(Math.random()*10)});
    }

    for(let i=1;i<=20;i++){
        Provider.create({providerId:`CORONA${i}`,isOnline: i<=10 ? true:false,providerInUse: i<=5 ? true:false,isAssigned: i<=5 ? true: false, providerCharge:Math.random()*100,ratings: Math.random()*5});
    }
}

module.exports= {
    loadDatabase
};


