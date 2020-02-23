var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var userSchema = new Schema({
    userId:{
        type:String
    },
    userName:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    token:{
        type:String
    }
});

module.exports = mongoose.model('User',userSchema);
