const db = require("../_helpers/db");
const Wallet = db.Wallet;
const Task = db.Task;

async function getBalance(userId) {
    const wallet = await Wallet.findOne({userId:userId});
        console.log(wallet);
        if(wallet !== null){
            return {"balance":wallet.balance}
        }
        else {
            return -1;
        }

}

async function addBalance({userId,amount}) {
    const wallet = await Wallet.findOne({userId:userId})
    console.log("fetched ",wallet);
    wallet.balance = wallet.balance + parseInt(amount);
    await wallet.save();
    console.log("updated ",wallet);
    return {"balance":wallet.balance}
}

async function makePayment({transactionId,amount}) {
    console.log("am ",amount);
    amount = parseInt(amount);
    const task = await Task.findOne({transactionId:transactionId});
    console.log(task);
        const providerId = task.providerId;
        const consumerId = task.consumerId;
        const consumerWallet = await Wallet.findOne({userId:consumerId});
        const providerWallet = await Wallet.findOne({userId:providerId});
        if(consumerWallet.balance < amount){
            return {
                "message":"Payment failed due to insufficient balance. Please recharge with at least"+(amount - consumerWallet.balance)+"credits to make the payment",
                error:true
            }
        }
        else{
            consumerWallet.balance -= amount;
            providerWallet.balance += amount;
            try{
                await providerWallet.save();
                await consumerWallet.save();
                const task = await Task.findOne({transactionId:transactionId});
                task.isPaymentDone = true;
                await task.save();
            }
            catch (e) {
                console.log("error occurred while updating balance ",e);
            }
            return {
                "message":"Payment made successfully",
            }
        }

}

module.exports = {
    getBalance,
    addBalance,
    makePayment
}
