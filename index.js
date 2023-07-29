const express = require('express');
const db = require('./config/mongoose');
const bodyParser = require('body-parser');


const PORT = 8000;
const app = express();

// request conversion
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/',require('./routes/question'));

app.listen(PORT,function(err){
    if(err)    
    {
        console.log("Error in starting Server ",err)
        return;
    }   
    console.log("Server Started");

})