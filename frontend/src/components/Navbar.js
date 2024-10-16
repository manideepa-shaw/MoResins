import {React, useContext, useState}from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import "../App.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart,faBagShopping } from '@fortawesome/free-solid-svg-icons'
import logo from "../images/logo.jpg"
import { AuthContext } from '../context/auth-context'

const Navbar = () => {
  const [searchVal, setsearchVal] = useState("")
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const submitHandler = (e)=>{
    e.preventDefault()
    if(searchVal.trim())
    {
      navigate(`/products?query=${encodeURIComponent(searchVal)}`)
    }
  }
  return (
    <>
    <div className="navbar displayonbig" id="navbar">
    <div className="company">
        <ul>
            <li>
                <img src={logo} className="logo" alt="not fo" />
            </li>
            <li>
                <h2 className="head">Mo's Resins</h2>
            </li>
        </ul>
    </div>
    <div className="list">
        <ul className="listul list2">
            <li className="listli">
                <div className="search">
                    <form onSubmit={submitHandler}>
                        <input type="text" name="search" id="" required 
                        onChange={(e)=> setsearchVal(e.target.value)}
                        value={searchVal}
                         />
                        <button type="submit" className="search-icon" name="searchitem"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg></button>
                    </form>
                </div>
            </li>
            {auth.isLoggedIn && 
            <li className="listli">
              <NavLink to='/wishlist'>
                <FontAwesomeIcon icon={faHeart} size='xl' />
                <p className="displayonbig inline">Wishlist</p>
              </NavLink>
              </li> }
              {auth.isLoggedIn && <li className="listli">
              <NavLink to="/cart">
                <FontAwesomeIcon icon={faBagShopping} size='xl' />
                <p className="displayonbig inline">My Cart</p>
              </NavLink>
            </li>}
        </ul>

    </div>
   </div> 
   <div className="displayonsmall navbar">
      <div className="company">
        <ul>
            <li>
                <img src={logo} className="logo" alt="" />
            </li>
            <li>
                <h2 className="head">Mo's Resins</h2>
            </li>
        </ul>
      </div>
    
      <div className="list">
        <ul className="listul list1">
          {auth.isLoggedIn && <li className="listli">
          <NavLink to="/wishlist"><FontAwesomeIcon icon={faHeart} size='xl' /></NavLink>
          </li>}
          {auth.isLoggedIn && <li className="listli">
          <NavLink to="/cart">
            <FontAwesomeIcon icon={faBagShopping} size='xl'/>
          </NavLink>
          </li>}
          
        </ul>
      </div>
    </div>
    <div className="displayonsmall navbar navbar2">
      <div className="list2">
        <ul className="listul">
            <li className="listli">
                <div className="search">
                    <form onSubmit={submitHandler}>
                        <input type="text" name="search" 
                        onChange={(e)=> setsearchVal(e.target.value)}
                        value={searchVal}
                        required  />
                        <button type="submit" className="search-icon" name="searchitem"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg></button>
                    </form>
                </div>
          </li> 
        </ul>
      </div>
    </div>
    </>
  )
}

export default Navbar