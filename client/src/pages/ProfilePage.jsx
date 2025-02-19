import { useNavigate, Link } from "react-router-dom";
import apiRequest from "../apiRequest";
import Chat from "../components/chat/Chat";
import List from "../components/list/List";
import "./profilePage.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CgProfile } from "react-icons/cg";
import { motion } from "framer-motion";
import {fadeIn} from '../variants'
import { toast } from "react-toastify";

function ProfilePage() {

  const {currentUser, updateUser} = useContext(AuthContext);
  const  [myposts,setMyPosts] = useState([]);
  const  [mysavedposts,setMysavedposts] = useState([]);
  const  [chats,setChats] = useState([]);
  const navigate = useNavigate();  

  const logoutHandler = async () => {
    try{
      const res = await apiRequest.post('/auth/logout');
      updateUser(null);
      toast.success('Logged out successfully')
      navigate('/')
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchMyPosts = async () => {
      try{
        const user = await JSON.parse(localStorage.getItem("user"));
        const id = await user?._id;
        
        const res = await apiRequest.get(`/posts/getprofileposts/${id}`);
        setMyPosts(res?.data?.posts);
      }
      catch{
        console.log('error fetching posts');
      }
    }
    fetchMyPosts();

    const fetchSavedPosts = async () => {
      try{
        const savedPosts = await apiRequest.get('/posts/getsavedposts');
        setMysavedposts(savedPosts?.data?.savedPosts);
      }
      catch(error){
        console.log(error);
      }
    }
    fetchSavedPosts();

    const fetchMyChats = async () => {
      try{
        const res = await apiRequest.get('/chats/getChats');
        console.log(res);
        setChats(res?.data?.chats);
      }
      catch{
        console.log('error fetching chats');
      }
    }
    fetchMyChats();
  }, [])
  

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to='/profile/update' >
              <button>Update Profile</button>
            </Link>
          </div>
          <motion.div
            className="info"
            variants={fadeIn('left', 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{
                once:false,
                amount:0
            }}
            >
            <span>
              Avatar:
            {
              currentUser.image ? (              
              <img
                src={currentUser.image}
                alt=""
              />):(<CgProfile/>)
            }
            </span>
            <span>
              Username: <b>{currentUser.userName}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={logoutHandler}>Logout</button>
          </motion.div>
          <div className="title">
            <h1>My List</h1>
            <Link to='/addnewpost'>
              <button>Create New Post</button>
            </Link>
          </div>
          <List myposts = {myposts} />
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <List mysavedposts={mysavedposts} />
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Chat chats={chats}/>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
