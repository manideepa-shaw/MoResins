import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import "../css/Products.css"
import LoadingSpinner from './LoadingSpinner'

const Products = () => {
    const [items, setitems] = useState([])
    const location= useLocation() //to get the queried detailsfrom the URL
    const [isLoading, setisLoading] = useState(true)
    // Extract the query parameter directly from the location object
    const searchParams = new URLSearchParams(location.search);
    let query = searchParams.get('query');
    useEffect(() => {
       const fetchProducts = async() => {

        try{
            setisLoading(true)
            setitems([])
            // for finding product details
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}product?search=${query}`)
            const responseData = await res.json()
      
            if(!res.ok)
            {
              throw new Error(responseData.message)
            }
            setitems(responseData.products) //because we have set products as key in backend while sending request
            console.log(responseData.products)
            setisLoading(false)
  
         }
         catch(err)
         {
            setisLoading(false)
            alert(err.message || 'Some problem occured!!!')
         }
      }
    // Check if there is a query
    if (query) {
        fetchProducts(); // Invoke the async function to fetch data
        } else {
        setitems([]); // Clear items if no query is present
        }
    }, [query]); 

    if(isLoading)
    {
        return(
            <LoadingSpinner asOverlay/>
        )
    }
  return (
    <div className="container1">
    {items && items.map((each)=>{
        return(
            <NavLink to={`/products/${each._id}`}  className="items">
            <div>
                <img src={`${process.env.REACT_APP_BACKEND_URL_IMG}${each.image[0]}`} alt="" srcset="" />
                <hr />
                <div className="desc">
                    <p className="name">{each.name}</p>
                    <p className="sp">&#8377;{each.price}</p>
                </div>
            </div>
            </NavLink>
        )
    })}
    </div>
  )
}

export default Products