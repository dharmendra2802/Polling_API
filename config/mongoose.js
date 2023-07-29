const mongoose = require('mongoose');

main().catch((err)=>{
    console.log("Error in mongo ",err);
})

async function main()
{
    await mongoose.connect('mongodb://127.0.0.1:27017/pollingDB');
    console.log("Connected to mongoDB");
    module.exports = mongoose.connection;
}