const mongoose = require("mongoose"); 
const orderItemSchema = new mongoose.Schema ({
      productId:{
       type:mongoose.Schema.Types.ObjectId, 
       ref:"Product"
      }, 
      color:{
        type:String, 
        trim:true
      }, 
      url:{
        type:String ,
        trim: true 
      }, 
      customization:{
        type:String , 
        trim:true
      }, 
      quantity:{
        type:Number, 
      }
})

module.exports = mongoose.model("OrderItem", orderItemSchema);