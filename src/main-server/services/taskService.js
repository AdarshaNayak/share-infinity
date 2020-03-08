const config  = require('../config/config');
const db =  require('../_helpers/db');
const User = db.User;
const Provider = db.Provider;
const SystemInfo = db.SystemInfo;
const Task = db.Task;

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
        .then((response)=>{
        return {
            ['transactionId']:response.transactionId,
            ['providerId']:providerId
        }
    })
        .catch(err => {
            return err;
        });

}

module.exports = {
    getProviders,
    createTask
}
