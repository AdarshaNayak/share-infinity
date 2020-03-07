var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var walletSchema = new Schema({
    userId:{
        type: String,
        ref:'User',
        required: true,
        unique:true
    },
    balance:{
        type:Number
    }
});

module.exports = mongoose.model('Wallet',walletSchema);
