import "./Register.scss";
import { Link, useNavigate } from "react-router-dom";
import bg from '../assets/bg.png'
import axios from "axios";
import { useState } from "react";
import apiRequest from "../apiRequest";
import { toast } from "react-toastify";
import { fadeIn2 } from "../variants";
import { motion } from "framer-motion";


function Register() {

  const [error, setError] = useState('');
  const [IsLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('')
    const formData = new FormData(e.target);
    const userName = formData.get("username");
    const email = formData.get("email");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmpassword");
    const contactNo = formData.get("contact");

    try{
      if(password!==confirmPassword){
        toast.error('Passwords do not match');
        return
      }
      const res = await apiRequest.post("/auth/register",{
        userName,email,password,firstName,lastName,confirmPassword,contactNo
      })
      toast.success('New user created successfully')
      navigate('/login')
    }catch(error){
      console.log(error);
      toast.error('Error creating new user')
      setError(error.response.data.message);
    }
    finally{
      setIsLoading(false);
    }
  }


  return (
    <div className="register">
      <div className="formContainer">
        <motion.form
          variants={fadeIn2('up',0.2)}
          initial='hidden'
          whileInView='show'
          viewport={{
            once:false,
            amount:0
          }}
          onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <div className="name">
            <input name="firstName" type="text" placeholder="FirstName"/>
            <input name="lastName" type="text" placeholder="LastName"/>
          </div>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="text" placeholder="Email" />
          <input name="contact" type="number" placeholder="Contact No." />
          <div className="passwords">
            <input name="password" type="password" placeholder="Password" />
            <input name="confirmpassword" type="password" placeholder="ConfirmPassword" />
          </div>
          <button disabled={IsLoading} >Register</button>
          {
            error && <span>{error}</span>
          }
          <Link to="/login">Do you have an account?</Link>
        </motion.form>
      </div>
      <div className="imgContainer">
        <img src={bg} alt="" />
      </div>
    </div>
  );
}

export default Register;
