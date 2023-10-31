import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Styled from "styled-components";
import Logo from "../assets/logo.svg";
import { useEffect, useState } from "react";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {loginRoute} from "../utils/APIRoutes";

function Login() {
  const navigate=useNavigate();
  const toastOptions={
    position:"bottom-right",
    autoClose:8000,
    pauseOnHover:true,
    draggable:true,
    theme:"dark",
  };
  const [values,setValues]=useState({
    userID:"",
    password:"",
  })
  useEffect(()=>{
    if(localStorage.getItem('talkwave-user')){
      navigate("/");
    }
  },[]);
  const handleSubmit=async(event)=>{
      event.preventDefault();
      if(handleValidation()){
        const {password,userID}=values;
        const {data}= await axios.post(loginRoute,{
          userID,
          password
        });
        if(data.status===false){
          toast.error(data.msg,toastOptions);
        }
        if(data.status===true){
          localStorage.setItem("talkwave-user",JSON.stringify(data.user));
          navigate("/");
        }
        
      }
  }
  const handleValidation=()=>{
    const {password,userID}=values;
    if(password===""||userID===""){
        toast.error("Username and Password are required!",toastOptions);
        return false;
    }
    return true;
  }
  const handleChange=(event)=>{
    setValues({...values,[event.target.name]:event.target.value})
  }
  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
            <div className="brand">
                <img src={Logo} alt="logo"/>
                <h1>TalkWave</h1>
            </div>
            <input
            name="userID"
            type="text"
            placeholder="Username/Email"
            min="3"
            onChange={(e)=>handleChange(e)}
            />
            <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={(e)=>handleChange(e)}
            />
            
            <button type="submit">Login</button>
            <span>New User? <Link to="/register">Register</Link></span>
        </form>
      </FormContainer>
      <ToastContainer/>
    </>
  );
}
const FormContainer = Styled.div`
height:100vh;
width:100vw;
display:flex;
flex-direction:column;
justify-content:center;
background-color:#131324;
gap:1rem;
align-items:center;
.brand{
    display:flex;
    align-items:center;
    gap:1rem;
    justify-content:center;
    img{
        height:5rem;
    }
    h1{
      color:white;
      text-transform:Uppercase;
    }
}
form{
  display:flex;
  flex-direction:column;
  gap:2rem;
  background-color:#00000076;
  border-radius:2rem;
  padding:3rem 5rem;
  input{
    background-color:transparent;
    padding:1rem;
    border:0.1rem solid #4e0eff;
    border-radius:0.4rem;
    color:white;
    width:100%;
    font-size:1rem;
    &:focus{
      border:0.1rem solid #997af0;
      outline:none;
    }
  }
  button{
    background-color:#997af0;
    color:white;
    padding:1rem 2rem;
    border:none;
    font-weight:bold;
    cursor:pointer;
    border-radius:0.4rem;
    font-size:1rem;
    text-transform:uppercase;
    transition:0.5s ease-in-out;
    &:hover{
      background-color:#4e0eff;
    }
  }
  span{
    color:white;
    text-transform:uppercase;
    a{
      color:#4e0eff;
      text-decoration:none;
      font-weight:bold;
    }
  }
}
`
export default Login;