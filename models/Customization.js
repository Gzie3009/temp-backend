const mongoose = require("mongoose"); 
const customSchema = new mongoose.Schema ({
    name:{
        type:String, 
        trim:true
    },
    description:{
     type:String, 
     trim:true
    }, 
})

module.exports = mongoose.model("Customization", customSchema);