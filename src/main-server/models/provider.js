var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var providerSchema = new Schema({
    providerId:{
        type: String,
        unique: true,
        required: true
    },
    isOnline:{
        type: Boolean
    },
    providerInUse:{
        type:Boolean,
    },
    isAssigned:{
        type:Boolean
    },
    providerCharge:{
        type: Number
    }
});

module.exports = mongoose.model('Provider',providerSchema);

