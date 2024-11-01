import React, { useContext, useEffect, useState } from 'react'
import "../css/Myorders.css"
import OrdersInner from './OrdersInner'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/auth-context'
import LoadingSpinner from './LoadingSpinner'
import ErrorHandler from './ErrorHandler'
const Orders = () => {
  const auth=useContext(AuthContext)
  const [isLoading, setisLoading] = useState(true)
  const [error, seterror] = useState(null)
  const [orders, setorders] = useState([])
  useEffect(() => {
    return async() => {
      try{
        setisLoading(true)
        seterror(null)
        // for finding product details
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}order`,{ 
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
        setorders(responseData.orders) 
        setisLoading(false)
     }
     catch(err)
     {
        setisLoading(false)
        seterror(err.message || 'Some error occured!!!')
     }
    }
  }, [auth.token])
  const closeError = (e)=>{
    e.preventDefault()
    seterror(null)
  }
  
  return (
    <>
    {isLoading && <LoadingSpinner asOverlay />}
    {error && <ErrorHandler error={error} closeError={closeError} />}
    {/* if noorder is present */}
    {orders && orders.length===0 && 
    <div className="empty-cart">
    <div className="empty-cart-details">
      No orders to show!!!
    </div>
    </div>}
    {/* if orderlist is there */}
    {orders && orders.length!==0 && orders.map((item)=>{
        return (<NavLink to={`/orders/${item._id}`} className="removeunderline">
        <OrdersInner orderId={item._id} totalAmt={item.finalPrice} deliveryStatus={item.deliveryStatus} />
        </NavLink>)

    })}
    </>
  )
}

export default Orders