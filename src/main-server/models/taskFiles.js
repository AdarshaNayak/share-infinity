var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var taskFilesSchema = new Schema({
    transactionId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique:true,
        ref:'Task'
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
});

module.exports = mongoose.model('taskFiles',taskFilesSchema);
