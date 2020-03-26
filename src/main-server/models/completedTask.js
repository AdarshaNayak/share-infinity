var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var completedTaskSchema = new Schema({
    transactionId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique:true
    },
    consumerId:{
        type: String,
        ref:'User',
        required:true
    },
    providerId:{
        type: String,
        ref:'User',
        required: true
    },
    rating:{
        type:Number
    },
    cost:{
        type:Number
    }
});

module.exports = mongoose.model('CompletedTask',completedTaskSchema);
