const mongoose = require('mongoose');


const optionSchema = new mongoose.Schema({
    OID : {
        type:Number,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    QID:{
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

