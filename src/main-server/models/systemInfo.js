var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var systemInfoSchema = new Schema({
    userId:{
        type:String,
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
    }
});

module.exports = mongoose.model('SystemInfo',systemInfoSchema);
