var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var userSchema = new Schema({
    userName:{
        type:String,
        unique:true
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    token:{
        type:String
    }
});

module.exports = mongoose.model('User',userSchema);
