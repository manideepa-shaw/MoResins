import {React ,useState,useEffect, useSyncExternalStore, useContext}from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import "../css/Userdetails.css"
import { AuthContext } from '../context/auth-context'
import LoadingSpinner from './LoadingSpinner'
import ConfirmDelete from './ConfirmDelete'
const UserDetails = () => {
    const [firstFunc, setfirstFunc] = useState("show")
    const [secondFunc, setsecondFunc] = useState("hide")
    const [isLoading, setisLoading] = useState(true)
    const [confirmDeleteHandler, setconfirmDeleteHandler] = useState(false)
    const [details, setdetails] = useState({})
    const auth=useContext(AuthContext)
    const navigate = useNavigate()
    const showUpdate=()=>{
        setfirstFunc("hide")
        setsecondFunc("show")
    }

    const deleteAccount=async(e)=>{
        e.preventDefault()
        try{
          setisLoading(true)
          const res=await fetch(`${process.env.REACT_APP_BACKEND_URL}user`, { 
              method : 'DELETE',
              headers : { 'Authorization': 'Bearer '+auth.token }
          })
          setisLoading(false)
          auth.logout()
          navigate('../')
        }
        catch(err)
        {
          setisLoading(false)
          alert(err || 'Some error occured')
        }
        setconfirmDeleteHandler(!confirmDeleteHandler)
    }
    const changeDeleteHandlerState=()=>{
      setconfirmDeleteHandler(!confirmDeleteHandler)
    }
  const [address, setaddress] = useState({})
  const inputHandler = (event)=>{
    const { name, value } = event.target;
    setdetails({
      ...details,
      [name]: value
    });
  }
  const inputHandler1 = (event)=>{
      const { name, value } = event.target;
      setaddress({
        ...address,
        [name]: value
      });
  }
  
  const updateDetails=async(e)=>{
    e.preventDefault()
    // update logic
    setisLoading(true)
    try{
      const res=await fetch(`${process.env.REACT_APP_BACKEND_URL}user/`, { 
        method : 'PATCH',
        headers : {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+auth.token
        },
        body :JSON.stringify({
          name: details.name,
          password: details.password,
          street: address.street,
          city: address.city,
          state: address.state,
          mobile: details.mobile,
          pincode:  address.pincode,
          landmark: address.landmark
      })
      })
      const responseData=await res.json()
      if(!res.ok)
      {
          throw Error(responseData.message)
      }
      setisLoading(false);
    }
    catch(err)
    {
      setisLoading(false);
      alert(err||'Some problem occured')
    }
    
    setsecondFunc("hide")
    setfirstFunc("show")
  }

    useEffect(() => {
      return async() => {
        try{
          setisLoading(true)
          // for finding product details
          const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}user`,{ 
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
        setdetails(responseData.user)
        setaddress(responseData.user.address)
        setisLoading(false)
      }
      catch(err)
      {
        setisLoading(false)
        alert(err.message || 'Couldnot get Places of the user!!!')
      }
      }
    }, [auth.token])

    if(isLoading || !details || !address)
    {
      return(<LoadingSpinner />)
    }
  return (
    <>
    {confirmDeleteHandler && <ConfirmDelete 
    changeDeleteHandlerState={changeDeleteHandlerState}
    deleteAccount={deleteAccount} />}
    <div className='userDetails'>
        <div className={`items desc ${firstFunc}`} style={{width : "40rem",height:"fit-content"}} >
            <label htmlFor="name">Name : </label>{details.name} <br />
            <label htmlFor="email">Email : </label>{details.email} <br />
            <label htmlFor="mobile">Mobile No. : </label>{details.mobile} <br />
            {/* {details.alternate && <><label htmlFor="alternate">Alternate No. : </label>{details.alternate}<br/> </>}  */}
            <label htmlFor="address">Address : </label>{address.street+" "+address.city+" "+address.state+" "+address.pincode} <br />
            {address.landmark && <><label htmlFor="landmark">Landmark : </label>{address.landmark}<br/> </>} 
            <button className='btn' onClick={showUpdate}>Edit Details</button>
            <button className='btn btn-danger' type="submit" onClick={()=>setconfirmDeleteHandler(true)}>Delete Account</button>
        </div>

        <div className={`items desc ${secondFunc} `} style={{width : "50rem",height:"fit-content"}}>
            <form action="" onSubmit={updateDetails}>
            <label htmlFor="name">Name : </label>
            <input type="text" name='name' value={details.name} onChange={inputHandler} />
             <br />
             {/* <label>Password : </label>
             <input type="password" name="password" value={details.password} onChange={inputHandler} /> <br /> */}
            <label htmlFor="mobile">Mobile No. : </label>
            <input type="number" name="mobile" value={details.mobile} onChange={inputHandler} />
            <br />
            {/* <label htmlFor="alternate">Alternate No. : </label>
            <input type="number" value={details.alternate}  name='alternate' onChange={inputHandler}/>
            <br/> */}
            <label htmlFor="street">Street : </label>
            <input type="text" name="street" value={address.street} onChange={inputHandler1} />
             <br />
             <label htmlFor="city">City : </label>
            <input type="text" name="city" value={address.city} onChange={inputHandler1} />
             <br />
            <label htmlFor="state">State : </label>
            <input type="text" name="state" value={address.state} onChange={inputHandler1} />
             <br />
            <label htmlFor="pincode">Pin Code : </label>
            <input type="number" name="pincode" value={address.pincode} onChange={inputHandler1} />
             <br />
            <label htmlFor="landmark">Landmark : </label>
            <input type="text" name="landmark" value={address.landmark} onChange={inputHandler1} />
            <br/>
            <button className='btn'>Update Details</button>
            </form>
        </div>
    </div>
    </>
)
}
export default UserDetails