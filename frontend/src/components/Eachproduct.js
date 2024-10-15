import {React, useContext, useState,useEffect} from 'react'
import Carousel from './Carousel'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../context/auth-context'
import LoadingSpinner from './LoadingSpinner'

const Eachproduct = () => {
    const productId = useParams().productId
    const [isLoading, setisLoading] = useState(true)
    const [showAddedToCart, setshowAddedToCart] = useState(false)
    const [quantity, setquantity] = useState(1)
    const [isWishlisted, setisWishlisted] = useState(false)
    const [eachItemDetails, seteachItemDetails] = useState({})
    const auth = useContext(AuthContext)

    useEffect(() => {
      return async() => {
        try{
          setisLoading(true)
          // for finding product details
          const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}product/${productId}`)
          const responseData = await res.json()
    
          if(!res.ok)
          {
            throw new Error(responseData.message)
          }
          seteachItemDetails(responseData.product) //because we have set product as key in backend while sending request
          setisLoading(false)
          // for finding if the product is wishlisted

       }
       catch(err)
       {
          setisLoading(false)
          // seterror(err.message || 'Couldnot get Places of the user!!!')
       }
      }
    }, [productId])
    const showAddedToCartfunc=()=>{
      setshowAddedToCart(true)
      setTimeout(() => {
        setshowAddedToCart(false)
      }, 2000);
    }
    const addToCart = async(e)=>{
      e.preventDefault()
      try{
        // seterror(null)
        const res=await fetch(`${process.env.REACT_APP_BACKEND_URL}cart/`+productId, { 
            method : 'POST',
            headers : {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+auth.token
            },
            body :JSON.stringify({
              quantity: quantity
          })
        })
        const responseData=await res.json()
        if(!res.ok)
        {
          throw Error(responseData.message)
        }
        showAddedToCartfunc();
        // history.push('/' + auth.userId + '/places')//to redirect to the this page
    }
    catch(err)
    {
        setisLoading(false)
        alert(err.message || 'Something went wrong. Please try later')
    }
    }
    const decrement =()=>{
      setquantity(quantity===1?quantity:quantity-1)
    }
    const increment =()=>{
      setquantity(quantity===20?quantity:quantity+1)
    }
    const addToWishlist=async(e)=>{
      e.preventDefault()
      try{
        setisLoading(true)
        // seterror(null)
        const res=await fetch(`${process.env.REACT_APP_BACKEND_URL}wishlist/`+productId, { 
            method : 'POST',
            headers : {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+auth.token
            }
        })
        const responseData=await res.json()
        if(!res.ok)
        {
            throw Error(responseData.message)
        }
        setisLoading(false)
        alert("Added to wishlist")
        // history.push('/' + auth.userId + '/places')//to redirect to the this page
    }
    catch(err)
    {
        setisLoading(false)
        alert(err.message || 'Something went wrong. Please try later')
    }
    }
  if(isLoading){
    return(
      <LoadingSpinner asOverlay/>
    )
  }
  return (
    <>
    
    {eachItemDetails.image && <Carousel images={eachItemDetails.image}/>}
     
     <div className="product-details">
        <div className="product-name">
            <div className="left">{eachItemDetails.name}</div>
            <div className="right">Price : {eachItemDetails.price}</div>
        </div>
        <div className="product-desc">
            {eachItemDetails.desc}
        </div>
        <br />
        {auth.isLoggedIn && 
        <button type="submit" className='btn' onClick={addToWishlist} >
        {isWishlisted?"Remove from Wishlist":"Move to Wishlist"}
      </button>
      }
        
      {auth.isLoggedIn && 
      <form onSubmit={addToCart} className='addtocart'>
      <label htmlFor="quantity">Quantity : </label>
      <FontAwesomeIcon icon={faMinusCircle} onClick={decrement} className="plusminus" />
      <input type="number" name="quantity" className='addtocart-input'
      value={quantity}
      min={1} max={20}
      onChange={(e)=> setquantity(e.target.value)}
      />
      <FontAwesomeIcon icon={faPlusCircle} onClick={increment} className="plusminus"/>
      <button type="submit" className='btn'>Add to Cart</button>
      
    </form>}
     </div>
      {showAddedToCart && <div className="fullpage">
     <div className="added-to-cart">Added to cart Successfully!!!</div>
     </div>}
    </>
  )
}

export default Eachproduct