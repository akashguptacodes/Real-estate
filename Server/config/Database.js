const mongoose = require('mongoose');
require('dotenv').config();

exports.DbConnect = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL,{ serverSelectionTimeoutMS: 30000,});
        console.log("DB connected successfully");
    }
    catch(error){
        console.log('Error while connecting Database');
        console.error(error);
        process.exit(1);
    }
}