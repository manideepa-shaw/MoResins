import React, { useContext,useEffect, useState } from 'react'
import "../css/Cart.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../context/auth-context'
import { NavLink, useNavigate } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'
import ErrorHandler from './ErrorHandler'
import StripeCheckout from "react-stripe-checkout"

const Cart = () => {
  const auth = useContext(AuthContext)
  const [isLoading, setisLoading] = useState(true)
  const [error, seterror] = useState(null)
  const navigate = useNavigate()
  const [cartItems, setcartItems] = useState([])
  const removeFromCart=async(e,pid)=>{
    e.preventDefault()
      try{
        setisLoading(true)
        seterror(null)
        await fetch(`${process.env.REACT_APP_BACKEND_URL}cart/${pid}` , { 
            method : 'DELETE',
            headers : { 'Authorization': 'Bearer '+auth.token }
        })
        setcartItems((prevItems) => prevItems.filter((item) => item.products._id !== pid));
        setisLoading(false)
      }
        catch(err)
        {
          setisLoading(false)
          seterror(err.message || 'Some error occured')
        }
      // setshowConfirm(false)
  }
  useEffect(() => {
    return async() => {
      try{
        setisLoading(true)
        // for finding product details
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}cart`,{ 
          method : 'GET',
          headers : {
              'Content-type': 'application/json',
              'Authorization': 'Bearer '+auth.token
          }}
        )
  
        const responseData = await res.json()
  
        if(!res.ok)
        {
          throw new Error(responseData.message)
        }
        setcartItems(responseData.details) //because we have set product as key in backend while sending request
        setisLoading(false)

     }
     catch(err)
     {
        setisLoading(false)
        seterror(err.message || 'Some error occured')
     }
    }
  }, [auth.token])
  const updateQuantity=async(product,productId,val)=>{
    let updatedQt=product.quantity;
    if((val===1 && product.quantity!==20) || (val===-1 && product.quantity!==0))
    {
      updatedQt+=val
    }
    try{
      const res=await fetch(`${process.env.REACT_APP_BACKEND_URL}cart/`+productId, { 
        method : 'PATCH',
        headers : {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+auth.token
        },
        body :JSON.stringify({
          quantity : updatedQt
      })
      })
      const responseData=await res.json()
      if(!res.ok)
      {
          throw Error(responseData.message)
      }
      setcartItems((prevItems) =>
        prevItems.map((item) =>
          item.products._id === productId ? { ...item, quantity: updatedQt, price: updatedQt*item.products.price } : item
        )
      );
    }
    catch(err)
    {
      seterror(err.message||'Some problem occured')
    }

  }
  const moveToWishlist =async(e,pid)=>{
    e.preventDefault()
    try{
      setisLoading(true)
      const res=await fetch(`${process.env.REACT_APP_BACKEND_URL}wishlist/`+pid, { 
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
      removeFromCart(e,pid);
      setcartItems((prevItems) => prevItems.filter((item) => item.products._id !== pid));
      setisLoading(false)
    }
    catch(err)
    {
      setisLoading(false)
      seterror(err.message || 'Some error occurred')
    }
  }
  const placeOrder=async(token)=>{
    // e.preventDefault()
    setisLoading(true)
    try{
      const res=await fetch(`${process.env.REACT_APP_BACKEND_URL}order`, { 
        method : 'POST',
        headers : {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+auth.token,
        },
        body: JSON.stringify({
          stripeToken: token.id // Passing the Stripe token for backend processing
        })
      })
      const responseData=await res.json()
      if(!res.ok)
      {
          throw Error(responseData.message)
      }
      setcartItems([]);
      setisLoading(false)
      navigate('../orders')

    }
    catch(err)
    {
      setisLoading(false)
      seterror(err.message || 'Some error occurred')
    }
  }
  const closeError=(e)=>{
    e.preventDefault()
    seterror(null)
  }

  let totalCost=0
  for(let i=0;i<cartItems.length;i++)
    totalCost+=cartItems[i].price

  if(cartItems.length===0)
  {
    return(<>
    {isLoading && <LoadingSpinner asOverlay />}
    {error && <ErrorHandler error={error} closeError={closeError} />}
    <div className="empty-cart">
      <div className="empty-cart-details">
      Oops!!! No items in the cart.
      </div>
    </div>
    </>)
  }
  return (
    <>
    <div className="cart">
    {isLoading && <LoadingSpinner asOverlay />}
    {error && <ErrorHandler error={error} closeError={closeError} />}
      {cartItems.map((each)=>{
        return (
          <div className="itemlist" key={each.products._id}>
        <ul className='product-img-name'>
           <NavLink to={`../products/${each.products._id}`}>
                <li><img src={`${process.env.REACT_APP_BACKEND_URL_IMG}${each.products.image[0]}`} alt="" className='cart-img' /></li>
                <li><p className="name inline">{each.products.name}<br/>&#8377;{each.price} </p></li>
            </NavLink>
        </ul>
        <ul className="left">
            <li>
                <ul>
                    <li><FontAwesomeIcon className='cursor' icon={faMinusCircle} onClick={()=>updateQuantity(each,each.products._id,-1)} /> </li>
                    {each.quantity}
                    <li><FontAwesomeIcon icon={faPlusCircle} className='cursor' onClick={()=>updateQuantity(each,each.products._id,1)} /> </li>
                </ul>
            </li>
            <li><form onSubmit={(e)=>moveToWishlist(e,each.products._id)}>
                <button className="btn" type="submit">Move to Wishlist</button>
            </form></li>
            <li>
                <form onSubmit={(e)=>removeFromCart(e,each.products._id)}>
                    <button type="submit" className="btn btn-danger">Remove</button>
                </form>
            </li>
        </ul>
        </div>
        )
      })}
        
        
        <div className="pricelist">
           <h2 className="form-text bold">Price Details</h2>
           <hr />
           <div className="pricedetails">
            <div id="price">Price({cartItems.length} items)</div>
            <div id="finalcost">&#8377;{totalCost}</div>
            {/* <div id="dcharge">Delivery Charge</div>
            <div id="dcost">&#8377;60</div> */}
            <div id="totalprice" className="bold">Total Amount</div>
            <div id="totalcost" className="bold">&#8377;{totalCost}</div>
           </div>
           <div id="placeorder">
            {console.log(process.env.REACT_APP_PUBLISHABLE_KEY_STRIPE)}
            <StripeCheckout stripeKey={process.env.REACT_APP_PUBLISHABLE_KEY_STRIPE} 
            className="btn"
            name="Place your order"
            token={placeOrder}
            disabled={isLoading} />
              {/* <button className="btn" name="placeorder">Proceed to payment</button>
            </StripeCheckout> */}
           </div>
        </div>
    </div>
    </>
  )
}

export default Cart