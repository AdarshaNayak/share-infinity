const db = require("../_helpers/db");
const Provider = db.Provider;

async function getProviderCharge(providerId) {
    const provider = await Provider.findOne({providerId:providerId});
    console.log("provider doc ",provider);
    return { "charge": provider.providerCharge }
}

async function updateProviderCharge({userId,amount}) {
    amount = parseFloat(amount);
    const provider = await Provider.findOne({providerId:userId});
    provider.providerCharge = amount;
    await provider.save();
    console.log("provider charge updated ",provider);
    return { "charge": provider.providerCharge }
}

module.exports = {
    getProviderCharge,
    updateProviderCharge
}
