const config  = require('../config/config');
const db =  require('../_helpers/db');
const User = db.User;
const Provider = db.Provider;
const SystemInfo = db.SystemInfo;

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

module.exports = {
    getProviders,
}
