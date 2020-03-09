const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const taskAllocatedProvidersSchema =  new Schema({
    transactionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    providerId:{
        type: String,
        ref:'User'
    }
});

module.exports = mongoose.model('taskAllocatedProviders',taskAllocatedProvidersSchema);
