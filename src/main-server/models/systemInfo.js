var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var systemInfoSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    ram:{
        type:Number
    },
    cpuCores:{
        type:Number
    },
    storage:{
        type:Number
    },
    isOnline:{
        type:Boolean
    },
    providerInUse:{
        type:Boolean
    },
    containerRunning:{
        type:Boolean
    },
    providerCharge:{
        type:Number
    }
});

module.exports = mongoose.model('SystemInfo',systemInfoSchema);
