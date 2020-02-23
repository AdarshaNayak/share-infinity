var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var walletSchema = new Schema({
    userId:{
        // type: mongoose.Schema.Types.ObjectId,
        // ref:'User'
        type:String,
        required:true
    },
    balance:{
        type:Number
    }
});

module.exports = mongoose.model('Wallet',walletSchema);
