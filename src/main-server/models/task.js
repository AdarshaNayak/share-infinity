var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var taskSchema = new Schema({
    transactionId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
        unique:true
    },
    consumerId:{
        type: String,
        ref:'User'
    },
    providerId:{
        type:String,
        ref:'User'
    },
    isContainerRunning:{
        type:Boolean,
        default:false
    },
    isCompleted:{
        type:Boolean,
        default: false,
    },
    status:{
        type: String
    },
    startTime:{
        type:Date
    },
    endTime:{
        type:Date
    },
    isRated:{
        type:Boolean,
        default:false
    },
    isPaymentDone:{
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model('Task',taskSchema);
