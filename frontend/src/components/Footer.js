import {React,useContext,useState} from 'react'
import "../App.css"
import { NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faBarsProgress, faNewspaper, faArrowRightFromBracket, faPerson, faLongArrowLeft, faArrowCircleLeft, faArrowRightToBracket} from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../context/auth-context'
function Footer() {
  const navigate = useNavigate()

  const auth=useContext(AuthContext)
  const logout=()=>{
    auth.logout()
    navigate('/')
  }
  return (
    <>
    <footer>
        <div className="about">
            <h1>About Us</h1>
            <p>Book Yours is an online platform used for pre-booking of your hotels. We want ours customers to have a peaceful journey without worrying about their bookings. </p>
            <table>
              <tr>
                <td>
                  Address : 
                </td>
                <td>Dinath Bldg L.j. Rd, Mumbai, Maharashtra - 400016</td>
              </tr>
              <tr>
                <td>Customer Care : </td>
                <td> +91 9874563219</td>
              </tr>
              <tr>
                <td>Email : </td>
                <td>xyz@gmail.com</td>
              </tr>
            </table>
          </div><br />
          <hr /> <br />
          <div className="social">
            <h1>Social</h1>
            <a href="#" className="fa fa-facebook"></a>
            <a href="#" className="fa fa-twitter"></a>
            <a href="#" className="fa fa-instagram"></a>
            <br /> <br />
            <hr /> <br />
            <button className="btn"><a href="tel:+91 7991141512"> Call Us</a></button>
            <button className="btn"><a href="mailto:jiyamanipriya@gmail.com">
              Mail Us
            </a> </button>
          </div><br /> <hr /> <br />
          <div className="last">
            <h1>Mo's Resins</h1>
            <h3>2023 moresins All rights reserved</h3>
          </div>
        </footer>
        <br/> <br/> <br/>
      <div className="navlast">
        <ul className="listul">
          <li className="listli">
            <NavLink to="/"><FontAwesomeIcon icon={faHouse} className='displayonbig' />
            <p className="smalltext inline">Home</p></NavLink>
        </li>
          <li className="listli">
            <NavLink to="/categories">
            <FontAwesomeIcon icon={faBarsProgress} className='displayonbig'/>
            <p className="smalltext inline">Categories</p>
            </NavLink>
        </li>
        {auth.isLoggedIn && <li className="listli">
            <NavLink to="/orders">
            <FontAwesomeIcon icon={faNewspaper} className='displayonbig'/>
            <p className="smalltext inline">My Orders</p>
            </NavLink></li>}
          {auth.isLoggedIn && <li className="listli">
            <NavLink to='/userdetails'>
            <FontAwesomeIcon icon={faPerson} className='displayonbig' />
            <p className="smalltext inline" >Profile</p>
            </NavLink>
        </li>}
          {auth.isLoggedIn && <li id="logout" className="listli">
            <button className='logout smalltext' type="submit" onClick={logout}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} className='displayonbig' />
                <p className="smalltext inline" >Logout</p>
            </button>
          </li>}
          {!auth.isLoggedIn && <li id="login" className="listli">
            <NavLink to='/login' className='logout smalltext'>
            <FontAwesomeIcon icon={faArrowRightToBracket} className='displayonbig' />
            <p className="smalltext inline" >Login</p>
            </NavLink>
          </li> }
          
        </ul>
      </div>
    </>
  )
}

export default Footer