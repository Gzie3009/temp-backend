const Contact = require("../models/Contact"); 



exports.createContact = async( req , res)=>{
    
    try{
        const{email , mobile ,name , message} = req.body ; 


        if(!email || !message){
            return res.status(404).json({
                success: true, 
                message:"fill the details "
            })
        }
        const contactMessage = await Contact.create({email ,mobile, name, message}); 

        return res.status(200).json({
            success: true, 
            message:"Saved message", 
            contactMessage
        }); 



    }
    catch(err)
    {
        console.log(err); 
        return res.status(500).json({
            success:false, 
            message:"Error while contacting"
        })
    }
}
exports.getContact = async( req , res)=>{
    
    try{
        
       
       const contactMessage = await Contact.find({}); 


        return res.status(200).json({
            success: true, 
            message:"Saved messages", 
            contactMessage
        }); 

    }
    catch(err)
    {
        console.log(err); 
        return res.status(500).json({
            success:false, 
            message:"Error while contacting"
        })
    }
}