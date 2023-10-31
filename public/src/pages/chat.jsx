import React, { useRef } from "react";
import Styled from "styled-components";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Contacts from "../components/contacts";
import Welcome from "../components/welcome";
import ChatContainer from "../components/chatContainer";
import { allUserRoute , host} from "../utils/APIRoutes";
import Loader from "../assets/loader.gif";
import {io} from "socket.io-client";

function Chat(){
    const socket=useRef();
    const navigate=useNavigate();
    const [contacts,setContacts]=useState([]);
    const [currentUser,setCurrentUser]=useState(undefined);
    const [currentChat,setCurrentChat]=useState(undefined);
    const [isLoaded,setIsLoaded]=useState(false);
    useEffect(()=>{
        const fun=async ()=>{
            if(!localStorage.getItem('talkwave-user')){
            navigate("/login");
            }
            else{
                setCurrentUser(await JSON.parse(localStorage.getItem("talkwave-user")));
                setIsLoaded(true);
            }
        }
        fun(); 
      },[currentUser]);
    useEffect(()=>{
        const fun=async ()=>{
            if(currentUser){
                if(currentUser.isAvatarSet){
                    const data= await axios.get(`${allUserRoute}/${currentUser._id}`);
                    setContacts(data.data);
                }else{
                    navigate("/setAvatar");
                }
            }
        }
        fun();
    },[currentUser]);
    useEffect(()=>{
        if(currentUser){
        socket.current=io(host);
        socket.current.emit("add-user",currentUser._id);
        }

    },[currentUser])
    const handleChatChange= (chat)=>{
        setCurrentChat(chat);
    }
    return (
        <>
        {
            isLoaded?(<Container>
                <div className="container">
                 <Contacts contacts={contacts} currentUser={currentUser} chatChange={handleChatChange}/>
                 {
                     currentChat===undefined?(<Welcome currentUser={currentUser}/>):
                     (<ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>)
                 }
                </div>
             </Container>):<Container>
             <img src={Loader} alt="loader" className="loader"/>
         </Container>
        }
        </>
    );
}
const Container=Styled.div`
height:100vh;
width:100vw;
display:flex;
flex-direction:column;
justify-content:center;
gap:1rem;
align-items:center;
background-color:#131324;
.container{
    height:85vh;
    width:85vw;
    background-color:#00000076;
    display:grid;
    grid-template-columns:25% 75%;
    @media screen and (min-width:720px) and (max-width:1080px){
        grid-template-colomns:35% 65%;
    }
}
`;
export default Chat;