import React from 'react'
import { NavLink } from 'react-router-dom'
import "../css/Cart.css"
import "../css/Categories.css"

const Categories = () => {
  return (
    <>
        <div className='categories'>
        <NavLink to="/products/ring">
      <div className="empty-cart-details category">
        Ring</div>
        </NavLink>
        <NavLink to="/products/pendant">
      <div className="empty-cart-details category">
        Pendant</div>
        </NavLink>
        <NavLink to="/products/clock">
      <div className="empty-cart-details category">
        Clock</div>
        </NavLink>

        <NavLink to="/products/ring">
      <div className="empty-cart-details category">
        Ring</div>
        </NavLink>
        <NavLink to="/products/pendant">
      <div className="empty-cart-details category">
        Pendant</div>
        </NavLink>
        <NavLink to="/products/clock">
      <div className="empty-cart-details category">
        Clock</div>
        </NavLink>
    </div>
    </>
  )
}

export default Categories