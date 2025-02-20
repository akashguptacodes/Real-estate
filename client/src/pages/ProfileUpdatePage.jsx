import "./ProfileUpdatePage.scss";
import { useContext, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { AuthContext } from '../context/AuthContext';
import apiRequest from '../apiRequest';
import { useNavigate } from "react-router-dom";


function ProfileUpdatePage() {
  const [error, setError] = useState('')
  const { currentUser, updateUser } = useContext(AuthContext);
  const [file, setFile] = useState();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store the selected file
    console.log(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", e.target.firstName.value);
    formData.append("lastName", e.target.lastName.value);
    formData.append("userName", e.target.userName.value);
  
    if (file) {
      formData.append("file", file); // Add the file only if it exists
    }
  
    try {
      // Send FormData with headers
      const res = await apiRequest.put(`/user/updateUser/${currentUser._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      updateUser(res.data.data);
      toast.success('User updated')
      navigate("/profile");
      console.log(res.data.data);

    }
    catch (error) {
      console.log(error);
      toast.error('Error while updating user')
      setError(error.response.data.message)
    }
  }

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="userName">Username</label>
            <input
              id="userName"
              name="userName"
              type="text"
              defaultValue={currentUser.userName}
            />
          </div>
          <div className="item">
            <label htmlFor="firstName">Firstname</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              defaultValue={currentUser.firstName}
            />
          </div>
          <div className="item">
            <label htmlFor="lastName">Lastname</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              defaultValue={currentUser.lastName}
            />
          </div>
          <button>Update</button>
          {error && <span>{error}</span>}
        </form>
        <button className="changepass" onClick={() => { navigate('/profile/update/changepassword') }}>Change password</button>
      </div>
      <div className="sideContainer">
        {
          file ? (
            <div className="preview">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="preview-image"
              />
            </div>
          ) : (
            <div className="preview">
              <img
                src={currentUser.image}
                alt="Preview"
                className="preview-image"
              />
            </div>
          )
          }
        <div className="item">
          <label htmlFor="profileImage">Profile Picture</label>
          <input
            id="profileImage"
            name="profileImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
