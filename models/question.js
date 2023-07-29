const mongoose = require('mongoose');


const questionSchema = new mongoose.Schema({
    QID : {
        type:String,
    },
    title:{
        type:String,
        required:true
    },
    options:[{
        type:mongoose.Schema.ObjectId,
        ref:'Option'
    }]
});

const Question = mongoose.model('Question',questionSchema);

module.exports = Question;

