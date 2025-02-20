import "./SinglePage.scss";
import Slider from "../components/slider/Slider";
import Map from "../components/map/Map";
import pin from '../assets/pin.png'
import utility from '../assets/utility.png'
import petimage from '../assets/pet.png'
import fee from '../assets/fee.png'
import size from '../assets/size.png'
import bed from '../assets/bed.png'
import bath from '../assets/bath.png'
import school from '../assets/school.png'
import bus from '../assets/bus.png'
import restaurant from '../assets/restaurant.png'
import chat from '../assets/chat.png'
import save from '../assets/save.png'
import { useNavigate, useParams } from "react-router-dom";
import apiRequest from '../apiRequest'
import { useEffect, useState, useContext } from "react";
import { CgProfile } from "react-icons/cg";
import {AuthContext} from '../context/AuthContext'


function SinglePage() {

  const {unique} = useParams();
  const [post,setPost] = useState([]);
  const [postdetails, setPostdetails] = useState({});
  const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate();
  const [saved,setSaved] = useState(post[0]?.isSaved);

  const fetchPost = async () => {
    try{
      const res = await apiRequest.get(`/api/v1/posts/getpost/${unique}`);
      console.log(res);
      const showPost = await res?.data?.post?._doc;
      const showPostDetails = await res?.data?.post?._doc?.postDetails;
      setPost((prevItems) => [...prevItems,showPost]);
      setPostdetails(showPostDetails);
      setSaved(res?.data?.post?.isSaved)
    }
    catch(error){
      console.log(error);
    }
  }

  const handleSave = async () => {
    try{
      setSaved(!saved);
      if(currentUser){
        const savePost = await apiRequest.post(`/api/v1/user/savepost/${post[0]?._id}`);
        console.log(savePost);
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

  useEffect(() => {
    fetchPost();
  }, [])
  
  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          {
            post[0]?.images && 
          <Slider images={post[0]?.images} />
          }
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post[0]?.title}</h1>
                <div className="address">
                  <img src={pin} alt="" />
                  <span>{post[0]?.address}</span>
                </div>
                <div className="price">$ {post[0]?.price}</div>
              </div>
              <div className="user">
                <img src={post[0]?.user?.image || <CgProfile/>} alt="" />
                <span>{post[0]?.user?.userName}</span>
              </div>
            </div>
            <div className="bottom">{postdetails.description}</div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src={utility} alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {postdetails.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ):(
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src={petimage} alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                <p>Pets are {postdetails.pet}</p>
              </div>
            </div>
            <div className="feature">
              <img src={fee} alt="" />
              <div className="featureText">
                <span>Income policy</span>
                <p>{postdetails.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src={size} alt="" />
              <span>{postdetails.size} sq ft</span>
            </div>
            <div className="size">
              <img src={bed} alt="" />
              <span>{post[0]?.bedroom} bedroom</span>
            </div>
            <div className="size">
              <img src={bath} alt="" />
              <span>{post[0]?.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src={school} alt="" />
              <div className="featureText">
                <span>School</span>
                <p>{postdetails.school >999 ? (postdetails.school/1000 + "Km"):(postdetails.school + "m")} away</p>
              </div>
            </div>
            <div className="feature">
              <img src={bus} alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{postdetails.bus >999 ? (postdetails.bus/1000 + "Km"):(postdetails.bus + "m")} away</p>
              </div>
            </div>
            <div className="feature">
              <img src={restaurant} alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{postdetails.restaurant >999 ? (postdetails.restaurant/1000 + "Km"):(postdetails.restaurant + "m")} away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={post} />
          </div>
          <div className="buttons">
            <button>
              <img src={chat} alt="" />
              Send a Message
            </button>
            <button onClick={handleSave} style={{
              backgroundColor: saved? "yellow":"white",
            }}>
              <img src={save} alt="" />
              {saved ? ("Place Saved"):("Save the place")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
