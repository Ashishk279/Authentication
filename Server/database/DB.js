const mongoose = require('mongoose');

const connectDB = async () =>{
    await mongoose.connect("mongodb://localhost/authentication");
    console.log("Connected DB Successfully.")
}
connectDB()


module.exports = mongoose;
