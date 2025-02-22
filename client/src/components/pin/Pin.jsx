import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import './Pin.scss'
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


const Pin = ({item}) => {
  console.log('item' , item);
  console.log('marker' , Marker);
  const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41], 
    iconAnchor: [12, 41], 
    popupAnchor: [1, -34]
  });
  
  
  return (
        <Marker position={[item.latitude, item.longitude]} icon={customIcon}>
          <Popup>
            <div className="popupContainer">
                <img src={item.img}></img>
                <div className="textContainer">
                    <Link to={`/list/${item._id}`} >{item.title}</Link>
                    <span className='bed'>{item.bedroom} bedroom</span>
                    <b>$ {item.price}</b>
                </div>
            </div>
          </Popup>
        </Marker>
  )
}

export default Pin