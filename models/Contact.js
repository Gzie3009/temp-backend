
const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
       
    email:{
        type:String , 
        required: true , 
        trim:true
    }, 
    name:{
        type:String,
        required:false , 
        trim: true,
    }, 
    mobile:{
        type:String,
        required:false, 
        trim: true,
    }, 
    message:{
            type:String,
            required:true , 
            trim: true,
    }
})
module.exports = mongoose.model("Contact", contactSchema);