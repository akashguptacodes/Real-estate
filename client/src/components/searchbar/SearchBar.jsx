import React, { useState } from 'react'
import './SearchBar.scss'
import { FaSearchLocation } from "react-icons/fa";
import { Link } from 'react-router-dom';


const types = ["buy", "rent"]

const SearchBar = () => {

    const [query, setQuery] = useState({
        type: 'buy',
        city: '',
        minPrice:0,
        maxPrice:100000000,
    })

    const switchType = (val) => {
        setQuery((prev)=>({...prev, type:val}))
    }

    const handleChange = (e) => {
        setQuery((prev)=>({...prev, [e.target.name] : e.target.value}))
    }

  return (
    <div className='searchbar'>
        <div className="type">
            {
                types.map((type)=>{
                    return(
                        <button key={type} onClick={()=> switchType(type)} className={query.type===type ? "active":""}>{type}</button>
                    )
                })
            }
        </div>
        <form>
            <input type="text" name='city' placeholder='City (lowerCase)' required onChange={handleChange}/>
            <input type="number" name='minPrice' required min={0} max={10000000} placeholder='Min Price' onChange={handleChange}/>
            <input type="number" name='maxPrice' required min={0} max={10000000} placeholder='Max Price' onChange={handleChange}/>
            <Link to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}>
                <button className='search'>
                    <FaSearchLocation />
                </button>
            </Link>
        </form>
    </div>
  )
}

export default SearchBar