var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var walletSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    balance:{
        type:Number
    }
});

module.exports = mongoose.model('Wallet',walletSchema);
