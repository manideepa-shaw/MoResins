import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/auth-context'
import LoadingSpinner from './LoadingSpinner'

const EachOrder = () => {
  const [orderDetails, setorderDetails] = useState(null)
  const [isLoading, setisLoading] = useState(true)
  const auth = useContext(AuthContext)

  let orderId = useParams().orderId
  const cancelOrder=async(e)=>{
      e.preventDefault()
      setisLoading(true)
      try{
        const res=await fetch(`${process.env.REACT_APP_BACKEND_URL}order/`+orderId, { 
          method : 'PATCH',
          headers : {
              'Content-type': 'application/json',
              'Authorization': 'Bearer '+auth.token
          },
          body :JSON.stringify({
            deliveryStatus : 'Cancelled'
        })
        })
        const responseData=await res.json()
        if(!res.ok)
        {
            throw Error(responseData.message)
        }
        setorderDetails({
            ...orderDetails,
            deliveryStatus: 'Cancelled'
        })
        setisLoading(false);
      }
      catch(err)
      {
        setisLoading(false);
        alert(err||'Some problem occured')
      }
  
  }

  useEffect(() => {
    return async() => {
      try{
        setisLoading(true)
        // for finding product details
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}order/${orderId}`,{ 
          method : 'GET',
          headers : {
              'Authorization': 'Bearer '+auth.token
          }}
        )
  
        const responseData = await res.json()
  
        if(!res.ok)
        {
          throw new Error(responseData.message)
        }
        setorderDetails(responseData.orders)
        setisLoading(false)
     }
     catch(err)
     {
        setisLoading(false)
        alert(err.message || 'Couldnot get Places of the user!!!')
     }
    }
  }, [])

  return (
    <>
    {isLoading && <LoadingSpinner asOverlay />}
    <div class="cart">
      {orderDetails!==null && orderDetails.products && orderDetails.products.map((each)=>{
        return (
          <div class="itemlist">
        <ul>
           <a href="">
                <li><img src={`${process.env.REACT_APP_BACKEND_URL_IMG}${each.product.image[0]}`} alt="" /></li>
                <li><p class="name inline">{each.product.name}<br/>
                &#8377;{each.product.price} </p></li>
            </a>
        </ul>
        <ul class="left">
            <li>Quantity : </li>
            <li>
                {each.quantity}
            </li>
            <li>Total : </li> <li>&#8377;{each.totalPrice}</li>
        </ul>
        </div>
        )
      })}
        
        
        <div class="pricelist">
           <h2 class="form-text bold">Price Details</h2>
           <hr />
           <div class="pricedetails">
            <div id="price">Price({orderDetails && orderDetails.products && orderDetails.products.length} items)</div>
            <div id="finalcost">&#8377;{orderDetails && orderDetails.finalPrice}</div>
            {/* <div id="dcharge">Delivery Charge</div>
            <div id="dcost">&#8377;60</div> */}
            <div id="totalprice" class="bold">Total Amount</div>
            <div id="totalcost" class="bold">&#8377;{orderDetails && orderDetails.finalPrice}</div>
           </div>
           <div id="placeorder">
           {orderDetails && orderDetails.deliveryStatus && orderDetails.deliveryStatus==='Active' && 
                <form onSubmit={cancelOrder}>
                    <button type="submit" class="btn btn-danger">Cancel Order</button>
                </form>
            }
            {orderDetails && orderDetails.deliveryStatus && orderDetails.deliveryStatus!=='Active' && 
                <div className="delivery-status">
                  Order Status : {orderDetails.deliveryStatus}
                </div>
            }
           </div>
        </div>
    </div>
    </>
  )
}

export default EachOrder