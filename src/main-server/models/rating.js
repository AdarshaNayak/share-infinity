var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var ratingSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    ratingStars:{
        type:Number
    }
});

module.exports = mongoose.model('Rating',ratingSchema);
