const mongoose = require("mongoose"); 
const orderSchema = new mongoose.Schema ({
      user:{
       type:mongoose.Schema.Types.ObjectId, 
       ref:"User", 
      },  
      products:[{
       type:mongoose.Schema.Types.ObjectId, 
       ref:"OrderItem", 
      }],
      address:{
       type:mongoose.Schema.Types.ObjectId, 
       ref:"Address", 
      },
      amount:{
         type:Number, 
         default:0
      }
      
},  {timestamps : true})

module.exports = mongoose.model("Order", orderSchema);