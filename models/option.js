const mongoose = require('mongoose');

// creating a schema to store  option data

const optionSchema = new mongoose.Schema({
    // OID or option ID
    OID : {
        type:Number,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    QID:{
        // QID or Question id which reference to the question they are part of
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    },
    votes:{
        type:Number
    },
    voteLink : {
        type:String,
        required:true
    }
});

const Option = mongoose.model('Option',optionSchema);

module.exports = Option;

