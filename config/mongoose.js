const mongoose = require('mongoose');


main().catch((err)=>{
    console.log("Error in mongo ",err);
})
// main fucntion
async function main()
{
    // setting a connection 
    await mongoose.connect('mongodb://127.0.0.1:27017/pollingDB');
    console.log("Connected to mongoDB");
    // exporting the connection object
    module.exports = mongoose.connection;
}