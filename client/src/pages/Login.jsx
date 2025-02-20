import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import bg from '../assets/bg.png'
import { useContext, useState } from "react";
import axios from "axios";
import apiRequest from "../apiRequest";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { fadeIn2 } from "../variants";
import { motion } from "framer-motion";

function Login() {

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {updateUser} = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('')
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try{
      const res = await apiRequest.post("/auth/login",{
        email,password
      })
      console.log(res);
      
      updateUser(res.data.user)
      toast.success('Logged in successfully')
      navigate('/');
    }catch(error){
      console.log(error);
      toast.error('Invalid email or password')
      setError(error.response.data.message);
    }
    finally{
      setIsLoading(false);
    }
  }
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <motion.h1
            variants={fadeIn2('left', 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{
                once:false,
                amount:0
            }}          
          >Welcome back</motion.h1>
          <motion.input
            variants={fadeIn2('right', 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{
                once:false,
                amount:0
            }}
            name="email" type="email" placeholder="Email" required/>
          <motion.input
            variants={fadeIn2('left', 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{
                once:false,
                amount:0
            }}
            name="password" type="password" placeholder="Password" required/>
          <motion.button
            variants={fadeIn2('right', 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{
                once:false,
                amount:0
            }}
            disabled={isLoading}>Login</motion.button>
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src={bg} alt="" />
      </div>
    </div>
  );
}

export default Login;
