const User=require("../models/usermodel");
const bcrypt=require("bcrypt");
const { model } = require("mongoose");
module.exports.register=async(req,res,next)=>{
    try{
        const {username,email,password}=req.body;
        const usernameCheck=await User.findOne({username});
        if(usernameCheck){
            return res.json({msg:"Username already used!",status:false});
        }
        const emailCheck=await User.findOne({email});
        if(emailCheck){
            return res.json({msg:"Email already used!",status:false});
        }
        const hashedPassword= await bcrypt.hash(password,10);
        const user=await User.create({
            email,
            username,
            password:hashedPassword,
        });
        return res.json({status:true,user:user});
    }
    catch(ex){
        next(ex);
    }
}
module.exports.login=async(req,res,next)=>{
    try{
        const {userID,password}=req.body;
        const useru=await User.findOne({username:userID});
        const usere=await User.findOne({email:userID});
        if(!useru&&!usere){
            return res.json({msg:"Invalid Username or Password",status:false});
        }
        else if(useru){
            const ispasswordtrue=await bcrypt.compare(password,useru.password);
            if(!ispasswordtrue){
                return res.json({msg:"Invalid Username or Password",status:false});
            }
            else{
                return res.json({status:true,user:useru});
            }
        }
        else if(usere){
            const ispasswordtrue=await bcrypt.compare(password,usere.password);
            if(!ispasswordtrue){
                return res.json({msg:"Invalid Username or Password",status:false});
            }
            else{
                return res.json({status:true,user:usere});
            }
        }
       
    }
    catch(ex){
        next(ex);
    }
}
module.exports.setAvatar=async(req,res,next)=>{
    try{
        const userID=req.params.id;
        const avatarImage=req.body.image;
        const userData= await User.findByIdAndUpdate(userID,{
            isAvatarSet:true,
            avatarImage:avatarImage,
        });
        return res.json({isSet:userData.isAvatarSet,image:userData.avatarImage});
    }
    catch(ex){
        next(ex);
    }
}
module.exports.getAllUsers=async(req,res,next)=>{
    try{
        const users= await User.find({_id:{$ne:req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    }
    catch(ex){
        next(ex);
    }
}
