import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Card.scss'
import pin from '../../assets/pin.png'
import bed from '../../assets/bed.png'
import bath from '../../assets/bath.png'
import save from '../../assets/save.png'
import chat from '../../assets/chat.png'
import dummy from  '../../assets/dummyImg.jpg'
import { AuthContext } from '../../context/AuthContext'
import apiRequest from '../../apiRequest'
import { useNotificationStore } from '../../notificationStore'

const Card = ({post}) => {

  const [saved,setSaved] = useState(null);
  const navigate = useNavigate();
  const {currentUser} = useContext(AuthContext);
  let friend;
  const increase = useNotificationStore((state) => state.increase);
  const handleSave = async () => {
    try{
      setSaved(!saved);
      if(currentUser){
        const savePost = await apiRequest.post(`api/v1/user/savepost/${post?._id}`);
        window.location.reload()
      }
      else{
        navigate('/login')
      }
    }
    catch(error){
      console.log(error);
      setSaved(!saved);
    }
  }
  const checkChatExist = async () => {
    try {
      const receiverId = await post?.user;
      const res = await apiRequest.get(`api/v1/chats/checkchatexistance/${receiverId}`);
      console.log(res?.data?.success);
      friend = await res?.data?.success;
      addChat();
    }
    catch (err) {
      console.log(err);
    }
  }
  const addChat = async () => {
    try{
      if(currentUser){
        console.log(friend);
        if(!friend){
          const addNewChat = await apiRequest.post('/api/v1/chats/addchat',{
            receiverId: post?.user,
          });
          console.log(addNewChat);
          increase();
          navigate('/profile');
        }
        else{
        navigate('/profile');
        }
      }
      else{
        navigate('/login')
      }
    }
    catch(error){
      console.log(error);
    }
  }


  useEffect(()=>{
    const fetchPost = async () => {
      try{
        const res = await apiRequest.get(`/api/v1/posts/getpost/${post?._id}`);
        setSaved(res?.data?.post?.isSaved)
      }
      catch(error){
        console.log(error);
      }
    }
    fetchPost();
  },[]);
  return (
    <div className='card'>
      <Link to={`/list/${post._id}`} className='imageContainer'>
        <img src={post.img ||dummy}></img>
      </Link>
      <div className="textContainer">
        <h2 className='title'>
          <Link to={`/list/${post._id}`}>{post.title}</Link>
        </h2>
        <p className='address'>
          <img src={pin}></img>
          <span>{post.address}</span>
        </p>
        <p className='price'>${post.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src={bed}></img>
              <span>{post.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src={bath}></img>
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
            <div
              onClick={handleSave}
              style={{
                backgroundColor: saved? "#4fed5c":"white",
              }}
              className="icon">
              <img src={save} ></img>
            </div>
            <div
              onClick={checkChatExist}
              className="icon">
              <img src={chat} ></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card