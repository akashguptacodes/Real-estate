import "./ProfileUpdatePage.scss";
import { useContext, useState } from "react";
import { CgProfile } from "react-icons/cg";
import {AuthContext} from '../context/AuthContext';
import apiRequest from '../apiRequest';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function ProfileUpdatePage() {
  const [error, setError] = useState('')
  const navigate = useNavigate();

  const {currentUser, updateUser} = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const oldpassword = formData.get('oldpassword');
    const newpassword = formData.get('newpassword');

    try{
      const res = await apiRequest.put(`/api/v1/user/updateUser/changepassword/${currentUser._id}`,{
        oldpassword,
        newpassword
      })
    //   updateUser(res.data.data);
      const res2 = await apiRequest.post('/api/v1/auth/logout');
      updateUser(null);
      toast.success('Password Updated')
      navigate('/profile');
      console.log(res.data.data);
      
    }
    catch(error){
      console.log(error);
      toast.error('Error in updating password')
      setError(error.response.data.message)
    }
  }

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Change Password</h1>
          <div className="item">
            <label htmlFor="oldpassword">Old Password</label>
            <input id="oldpassword" name="oldpassword" type="password" />
          </div>
          <div className="item">
            <label htmlFor="newpassword">New Password</label>
            <input id="newpassword" name="newpassword" type="password" />
          </div>
          <button>Update password</button>
          {error && <span>{error}</span>}
        </form>
      </div>
      <div className="sideContainer">
        <img src={currentUser.image || <CgProfile/>} alt="" className="avatar" />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
