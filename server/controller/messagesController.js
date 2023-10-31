const messageModel = require("../models/messageModel");

module.exports.addMessage=async(req,res,next)=>{
    try{
        const {from,to,msg}=req.body;
        const data=await messageModel.create({
            message:{text:msg},
            users:[from,to],
            sender:from,
        })
        if(data){
            return res.json({msg:"data added successfully."});
        }
        else{
            return res.json({msg:"failed to add message to the database"});
        }
    }
    catch(ex){
        next(ex);
    }
}
module.exports.getAllMessages=async(req,res,next)=>{
    try{
        const {from,to}=req.body;
        const messages= await messageModel.find({
            users:{$all:[from,to]}
        }).sort({updatedAt:1});
        const projectedMessages=messages.map((msg)=>{
            return {
                fromSelf:msg.sender.toString()===from,
                message: msg.message.text,
            }
        });
        return res.json(projectedMessages);
    }
    catch(e){
        next(e);
    }
}
