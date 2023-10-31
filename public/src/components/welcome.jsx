import React from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
export default function Welcome({currentUser}){
    try{
    return (
        <>
        <Container>
            <img src={Robot} alt="robot"/>
            <h1>Welcome,<span>{currentUser.username}</span>!</h1>
            <h3>Select a contact to start messaging...</h3>
        </Container>
        </>
    )
    }
    catch(e){
        console.log(e.message);
    }
}
const Container=styled.div`
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
color:white;
img{
    height:20rem;
}
span{
    color:#4e00ff;
}
`