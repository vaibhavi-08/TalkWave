const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const userRoutes=require("./routes/userroutes");
const messagesRoutes=require("./routes/messagesRoute");
const socket=require("socket.io");

const app=express();
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use("/api/auth",userRoutes)
app.use("/api/messages",messagesRoutes)

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("DB connected successfully");
}).catch((err)=>{
    console.log(err.message);
})

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server started on port ${process.env.PORT}`);
});

const io=socket(server,{
    cors:{
        origin:"http://localhost:3000",
        credentials:true,
    }
})

global.onlineUsers=new Map();

io.on("connection",(socket)=>{
    global.chatSocket=socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    });
    socket.on("send-msg",(data)=>{
        const sendUserSocket=onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",data.msg);
        }
    })
})