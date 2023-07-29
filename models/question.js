const mongoose = require('mongoose');

//creating question schema

const questionSchema = new mongoose.Schema({
    QID : {
        // question id
        type:String,
    },
    title:{
        type:String,
        required:true
    },
    options:[{
        // will contain a array of objects of OPtions
        type:mongoose.Schema.ObjectId,
        ref:'Option'
    }]
});

const Question = mongoose.model('Question',questionSchema);

module.exports = Question;

