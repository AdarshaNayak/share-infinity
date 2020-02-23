var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var completedTaskSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    providerId:{
        type: Schema.Types.ObjectId,
        ref:'User'
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
