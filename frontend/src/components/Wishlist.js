import {React, useState,useEffect, useContext} from 'react'
import { NavLink } from 'react-router-dom'

import "../css/Wishlist.css"
import { AuthContext } from '../context/auth-context'
import LoadingSpinner from './LoadingSpinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCross, faRemove, faRemoveFormat } from '@fortawesome/free-solid-svg-icons'

const Wishlist = () => {
  const auth = useContext(AuthContext)
  const [isLoading, setisLoading] = useState(true)
  const [items, setitems] = useState([])
  const [isCrossHovered, setisCrossHovered] = useState(null)
  useEffect(() => {
    return async() => {
      try{
        console.log(process.env.REACT_APP_BACKEND_URL_IMG)
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}wishlist`, { 
          method : 'GET',
          headers : {
              'Content-type': 'application/json',
              'Authorization': 'Bearer '+auth.token
          }})
  
        const responseData = await res.json()
  
        if(!res.ok)
        {
          throw new Error(responseData.message)
        }
        setitems(responseData.wishlist) //because we have set places as key in backend while sending request
        setisLoading(false)
     }
     catch(err)
     {
        setisLoading(false)
        alert(err.message || 'Some error occured!!!')
     }
    }
  }, [auth.userId, auth.token])

  const removeFromWishlist =async(event,productId)=>{
    event.stopPropagation() //to prevent from navigating to different page since cross button is within the navlink
    event.preventDefault();
    try{
      setisLoading(true)
      const res=await fetch(`${process.env.REACT_APP_BACKEND_URL}wishlist/${productId}`, { 
          method : 'DELETE',
          headers : { 'Authorization': 'Bearer '+auth.token }
      })
      setisLoading(false)
    }
    catch(err)
    {
      setisLoading(false)
      alert(err || 'Some error occured')
    }
    setitems((prevItems) => prevItems.filter((item) => item._id !== productId));
  }

  if(items.length===0)
  {
    return(
      <>
      {isLoading && <LoadingSpinner asOverlay/>}
      <div className="empty-cart">
      <div className="empty-cart-details">
        No items Wishlisted.
      </div>
    </div>
    </>
    )
  }

  return (
      <div className="container1">
        {isLoading && <LoadingSpinner asOverlay/>}
    {items.map((each,idx)=>{
        return(
          <>
            <NavLink to={`/products/${each.id}`} className="items"  key={each.id}>
              <FontAwesomeIcon icon={faRemove} size='2xl' 
              className='remove-from-wishlist' 
              onMouseEnter={()=>setisCrossHovered(idx)} 
              onMouseLeave={()=>setisCrossHovered(null)}
              onClick={(e)=>removeFromWishlist(e,each.id)}
               />
                {isCrossHovered===idx && <div className="tooltip">
                  Remove from Wishlist
                </div>}
                <img src={`${process.env.REACT_APP_BACKEND_URL_IMG}${each.image[0]}`} alt={`${process.env.REACT_APP_BACKEND_URL_IMG}${each.image[0]}`} srcSet="" />
                <hr />
            
                <div className="desc">
                    <p className="name">{each.name}</p>
                    <p className="sp">&#8377;{each.price}</p>
                </div>
            </NavLink>
                
          </>
        )
    })}
    </div>
    // <>
    // hi</>
  )
}

export default Wishlist