const express = require('express');
const db = require('./config/mongoose');
const bodyParser = require('body-parser'); // body-parser to deal with req 
 
// since we are going to host on render it will assign a port and if not
// then 8000 will be assigned

const PORT = process.env.PORT || 8000;

//initializing express
const app = express();

// request conversion
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// redirecting to other route
app.use('/',require('./routes/api/question'));

app.listen(PORT,function(err){
    if(err)    
    {
        console.log("Error in starting Server ",err)
        return;
    }   
    console.log("Server Started");

})