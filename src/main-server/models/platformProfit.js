var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var platformProfitSchema = new Schema({
    transactionId:{
        type: Schema.Types.ObjectId,
        ref:'Task',
        required:true
    },
    profit:{
        type:Number
    }
});

module.exports = mongoose.model('PlatformProfit',platformProfitSchema);
