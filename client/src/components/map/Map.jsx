import React, { useEffect } from 'react';
import {MapContainer, TileLayer, useMap} from 'react-leaflet';
import './Map.scss';
import "leaflet/dist/leaflet.css";

import Pin from '../pin/Pin';


const Map = ({items}) => {
  return (
      <MapContainer center={items?.length===1?[items[0]?.latitude, items[0]?.longitude]:[23.0707, 80.0982]} zoom={5} scrollWheelZoom={true} className='map'>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          items.map((item)=>{
            return <Pin key={item.id} item={item}/>
          })
        }
      </MapContainer>
  )
}

export default Map