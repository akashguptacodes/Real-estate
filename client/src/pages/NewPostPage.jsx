import { useState } from "react";
import "./NewPostPage.scss";
import apiRequest from "../apiRequest";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate()

  const handleFileChange = (e) => {
    if(images.length>=4){
      setError("You can only upload 4 images");
    }
    else{
      setImages([...images, e.target.files[0]])
      setError('')
    }
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target);
  //   const inputs = Object.fromEntries(formData);
  //   const postId = Date.now();

  //   try {
  //     const res = await apiRequest.post("/posts/addpost", 
  //       {
  //         postId:postId,
  //         title: inputs.title,
  //         price: parseInt(inputs.price),
  //         address: inputs.address,
  //         city: inputs.city,
  //         bedroom: parseInt(inputs.bedroom),
  //         bathroom: parseInt(inputs.bathroom),
  //         Type: inputs.type,
  //         Property: inputs.property,
  //         latitude: inputs.latitude,
  //         longitude: inputs.longitude,
  //         images: images,
  //         postDetails: {
  //           description: value,
  //           utilities: inputs.utilities,
  //           pet: inputs.pet,
  //           income: inputs.income,
  //           size: parseInt(inputs.size),
  //           school: parseInt(inputs.school),
  //           bus: parseInt(inputs.bus),
  //           restaurant: parseInt(inputs.restaurant),
  //       },
  //     },
  //     {headers: {
  //       "Content-Type": "multipart/form-data", // Make sure you're sending the correct content type
  //     },}
  //   );
  //     console.log(res);
  //     const unique = await res?.data?.data?._id;
  //     navigate("/list/"+unique)
  //   } catch (err) {
  //     console.log(err);
  //     setError(error);
  //   }
  // };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const inputs = Object.fromEntries(new FormData(e.target));
    const postId = Date.now();
  
    // Append all input fields to formData
    formData.append("postId", postId);
    formData.append("title", inputs.title);
    formData.append("price", parseInt(inputs.price));
    formData.append("address", inputs.address);
    formData.append("city", inputs.city);
    formData.append("bedroom", parseInt(inputs.bedroom));
    formData.append("bathroom", parseInt(inputs.bathroom));
    formData.append("Type", inputs.type);
    formData.append("Property", inputs.property);
    formData.append("latitude", inputs.latitude);
    formData.append("longitude", inputs.longitude);
  
    formData.append("postDetails[description]", value);
    formData.append("postDetails[utilities]", inputs.utilities);
    formData.append("postDetails[pet]", inputs.pet);
    formData.append("postDetails[income]", inputs.income);
    formData.append("postDetails[size]", parseInt(inputs.size));
    formData.append("postDetails[school]", parseInt(inputs.school));
    formData.append("postDetails[bus]", parseInt(inputs.bus));
    formData.append("postDetails[restaurant]", parseInt(inputs.restaurant));
  
    // Append images
    images.forEach((image) => {
      formData.append("images", image);
    });
  
    try {
      const res = await apiRequest.post("/posts/addpost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
      const unique = res?.data?.data?._id;
      toast.success('Post Created successfully')
      navigate("/list/" + unique);
    } catch (err) {
      console.log(err);
      toast.error('Error creating post')
      setError(err.message || "Something went wrong");
    }
  };
  

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" />
            </div>
            <div className="item description">
              <label htmlFor="description">Description</label>
              <textarea name="description" id="description" onChange={(e)=>setValue(e.target.value)} value={value}></textarea>
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Property</label>
              <select name="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School (distance in m)</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">bus (distance in m)</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant (distance in m)</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className="sendButton">Add</button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        <div className="images">
        {images?.map((image, index) => (
          <img src={URL.createObjectURL(image)} key={index} alt="" />
        ))}
        </div>
          <input
            id="image1"
            name="image1"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <input
            id="image2"
            name="image2"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <input
            id="image3"
            name="image3"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <input
            id="image4"
            name="image4"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
      </div>
    </div>
  );
}

export default NewPostPage;