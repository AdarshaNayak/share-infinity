var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var taskSchema = new Schema({
    transactionId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
        unique:true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    providerId:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    dataFileIdentifier:{
        type:String
    },
    dockerFileIdentifier:{
        type:String
    },
    dataFileKey:{
        type:String
    },
    resultFileIdentifier:{
        type:String
    },
    resultFileKey:{
        type:String
    },
    isCompleted:{
        type:String
    },
    startTime:{
        type:Date
    },
    endTime:{
        type:Date
    },
    cost:{
        type:Number
    }
});

module.exports = mongoose.model('Task',taskSchema);
