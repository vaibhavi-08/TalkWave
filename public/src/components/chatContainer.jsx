import React, { useState ,useRef} from "react";
import styled from "styled-components";
import Logout from "./logout";
import ChatInput from "./chatInput";
import {v4 as uuidv4} from "uuid";
import axios from "axios";
import { getAllMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";
import { useEffect } from "react";
export default function ChatContainer({currentChat,currentUser,socket}){
    const [messages,setMessages]=useState([]);
    const [arrivalMessage,setArrivalMessage]=useState(null);
    const scrollRef=useRef();
    useEffect(()=>{
        if(currentChat){
        const fun=async()=>{
            const response= await axios.post(getAllMessagesRoute,{
                from:currentUser._id,
                to:currentChat._id,
            })
            setMessages(response.data);
        }
        fun();
        }
    },[currentChat])
    useEffect(()=>{
        if(socket.current){
            socket.current.on("msg-recieve",(msg)=>{
                setArrivalMessage({fromSelf:false,message:msg});
            })
        }
    },[])
    useEffect(()=>{
        arrivalMessage&&setArrivalMessage((prev)=>[...prev,arrivalMessage]);
    },[arrivalMessage])
    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behaviour:"smooth"});
    },[messages])
    const handleSendMsg=async(msg)=>{
        axios.post(sendMessageRoute,{
            from:currentUser._id,
            to:currentChat._id,
            msg:msg,
        })
        socket.current.emit("send-msg",{
            to:currentChat._id,
            from:currentUser._id,
            msg:msg,
        })
        const msgs=[...messages];
        msgs.push({fromSelf:true,message:msg});
        setMessages(msgs);

    }
    return (
        <Container>
            <div className="chat-header">
                <div className="user-details">
                    <div className="avatar">
                    <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" />
                    </div>
                    <div className="username">
                    <h3>{currentChat.username}</h3>
                    </div>
                </div>
                <Logout/>
            </div>
            <div className="chat-messages">
                {
                    messages.map((msg)=>{
                        return(
                            <div>
                                <div className={`message ${msg.fromSelf?"sent":"recieved"}`}>
                                    <div className="content">
                                        <p>
                                            {msg.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <ChatInput handleSendMsg={handleSendMsg}/>
        </Container>
    );
}
const Container=styled.div`
padding-top:1rem;
display:grid;
grid-template-rows:10% 78% 12%;
gap:0.1rem;
overflow:hidden;
@media screen and (min-width:720px) and (max-width){
    grid-auto-rows:15% 70% 15%;
}
.chat-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:0 2rem;
    .user-details{
        display:flex;
        align-items:center;
        gap:1rem;
        .avatar{
            img{
                height:3rem;
            }
        }
        .username{
            h3{
                color:white;
            }
        }
    }
}
.chat-messages{
    padding:1rem 2rem;
    display:flex;
    flex-direction:column;
    overflow:auto;
    gap:1rem;
    .message{
        display:flex;
        align-items:center;
        .content{
            max-width:40%;
            overflow-wrap:break-word;
            padding:1rem;
            font-size:1.1rem;
            border-radius:1rem;
            color:#d1d1d1;

        }
    }
    .sent{
        justify-content:flex-end;
        .content{
            background-color:#4f04ff21;
        }
    }
    .recieved{
        justify-content:flex-start;
        .content{
            background-color:#9900ff20;
        }
    }
}
`