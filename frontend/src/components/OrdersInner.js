import React from 'react'

const OrdersInner = (props) => {
  return (
    <>
    <div id="myorders">
        <div className="orderedItems desc padd">
        <h2 className="accordion-header">
            <button className="accordion-button">
                Order ID {props.orderId}
            </button>
            <div className="container-fluid accordion-body" style={{display : "grid"}}>
              <div className="left inline">Total Amount : &#8377;{props.totalAmt}</div>
              <div className={`right ${props.deliveryStatus==='Cancelled'?'red':props.deliveryStatus==='Active'?'green':''}`}>{props.deliveryStatus}</div>
            </div>
            </h2>
        </div>
    </div>
</>
  )
}

export default OrdersInner