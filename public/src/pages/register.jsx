import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Styled from "styled-components";
import Logo from "../assets/logo.svg";
import { useEffect, useState } from "react";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";

function Register() {
  const navigate=useNavigate();
  const toastOptions={
    position:"bottom-right",
    autoClose:8000,
    pauseOnHover:true,
    draggable:true,
    theme:"dark",
  };
  const [values,setValues]=useState({
    username:"",
    email:"",
    password:"",
    confirmpassword:"",
  })
  useEffect(()=>{
    if(localStorage.getItem('talkwave-user')){
      navigate("/");
    }
  },[]);
  const handleSubmit=async(event)=>{
      event.preventDefault();
      if(handleValidation()){
        const {password,username,email}=values;
        const {data}= await axios.post(registerRoute,{
          username,
          email,
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
    var cnt=0;
    const {password,confirmpassword,username,email}=values;
    if(password!==confirmpassword){
      toast.error("password and confirm password should be same.",toastOptions);
      cnt++;
    }
    if(password.length<8){
      toast.error("password should contain atleast 8 characters",toastOptions);
      cnt++;
    } 
    if(username.length<3){
      toast.error("username should have atleast 3 characters",toastOptions);
      cnt++;
    }
    if(email===""){
      toast.error("email is required",toastOptions);
      cnt++;
    }
    if(cnt>0){
      return false;
    }
    else{
      return true;
    }
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
            name="username"
            type="text"
            placeholder="Username"
            onChange={(e)=>handleChange(e)}
            />
            <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={(e)=>handleChange(e)}
            />
            <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={(e)=>handleChange(e)}
            />
            <input
            name="confirmpassword"
            type="password"
            placeholder="Confirm Password"
            onChange={(e)=>handleChange(e)}
            />
            <button type="submit">Create User</button>
            <span>Already registered? <Link to="/login">Login</Link></span>
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
export default Register;