import React, { Suspense, lazy,useState,useEffect, useCallback, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Loginpage from './components/Loginpage';
import UserDetails from './components/UserDetails';
import Orders from './components/Orders';
import Products from './components/Products';
import Eachproduct from './components/Eachproduct';
import Footer from './components/Footer';
import Wishlist from './components/Wishlist';
import EachOrder from './components/EachOrder';
import Categories from './components/Categories';
import { AuthContext } from './context/auth-context';
import { SearchContext } from './context/search-context';

const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
// const Wishlist = lazy(() => import('./components/Wishlist'));
const Cart = lazy(() => import('./components/Cart'));

function App(){
  const auth=useContext(AuthContext)
  const [email, setemail] = useState(null)
  const [userId, setuserId] = useState(null)
  const [token, settoken] = useState(null)
  const logging = useCallback((uid,email,token)=>{
    settoken(token)
    setuserId(uid)
    setemail(email)
    // setting token in the localStorage
    localStorage.setItem(
    'userData',
    JSON.stringify({userId : uid,
       email:email,
       token: token
      })
    )
  },[])

  const logout = useCallback(()=>{
    setuserId(null)
    setemail(null)
    settoken(null)
    localStorage.removeItem('userData')
  },[])

    // using localStorage data so that when the page reloads the data isn't lost
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'))
      if(storedData && storedData.token )
      {
        logging(storedData.userId,storedData.email ,storedData.token)
      }
    }, [logging])
    

  return(
    <AuthContext.Provider value={{isLoggedIn: !!token,
      token : token,
      logging : logging,
      logout : logout,
      userId : userId,
      email : email
      }} >
    <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/orders/:orderId" element={<EachOrder />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/products" element={<Products />} /> 
        <Route path="/products/:productId" element={<Eachproduct />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/userdetails" element={<UserDetails />} />
      </Routes>
      <Footer />
    </Suspense>
  </Router>
  </AuthContext.Provider>
  )

};

export default App