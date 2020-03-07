var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var completedTaskSchema = new Schema({
    userId:{
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
    },
    status:{
        type:Boolean
    }
});

module.exports = mongoose.model('CompletedTask',completedTaskSchema);
