import React, { useContext } from 'react'
import './Home.scss'
import BgImg from '../assets/bg.png'
import SearchBar from '../components/searchbar/SearchBar'
import { AuthContext } from '../context/AuthContext'
import {fadeIn} from '../variants'
import { motion } from 'framer-motion'


const Home = () => {

  const {currentUser} = useContext(AuthContext);
  

  return (
    <div className='homePage'>
      <div className="textContainer">
        <motion.div
          className="wrapper"
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{
              once:false,
              amount:0
          }}
          >
          <h1 className='title'>
          Find Your Dream Home & <span className='getLine'>Unlock the Perfect Real Estate!</span>
          </h1>
          <p>
          Your journey to the perfect property starts now!
          Explore homes, apartments, and commercial spaces tailored to your lifestyle and budget.
          </p>
          <SearchBar/>
          <div className="boxes">

          </div>
        </motion.div>
      </div>
      <div className="imgContainer">
        <img src={BgImg}></img>
      </div>
    </div>
  )
}

export default Home