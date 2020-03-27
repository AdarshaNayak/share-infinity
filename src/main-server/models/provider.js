var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var providerSchema = new Schema({
    providerId:{
        type: String,
        unique: true,
        required: true
    },
    isOnline:{
        type: Boolean,
        default: false
    },
    providerInUse:{
        type:Boolean,
        default:false
    },
    isAssigned:{
        type:Boolean,
        default:false
    },
    providerCharge:{
        type: Number,
        default:0
    }
});

module.exports = mongoose.model('Provider',providerSchema);

