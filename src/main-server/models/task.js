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
        type:Boolean
    },
    isCompleted:{
        type:Boolean
    },
    startTime:{
        type:Date
    },
    endTime:{
        type:Date
    }
});

module.exports = mongoose.model('Task',taskSchema);
