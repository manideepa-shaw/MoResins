import {React,useContext,useState} from 'react'
import i3 from "../images/i3.avif"
import { AuthContext } from '../context/auth-context'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'
import ErrorHandler from './ErrorHandler'
const Loginpage = () => {
    const auth= useContext(AuthContext)
    const navigate = useNavigate()
    const [error, seterror] = useState(null)
    const [isOtpSent, setisOtpSent] = useState(false)
    const [isOtpVerified, setisOtpVerified] = useState(false)
    const [firstFunc, setfirstFunc] = useState("show")
    const [secondFunc, setsecondFunc] = useState("hide")
    const [isLoading, setisLoading] = useState(false)
    const [disabled, setdisabled] = useState(true)
    const [display, setdisplay] = useState(null)
    const [signUpDetails, setsignUpDetails] = useState({
        email:"",
        otp:null,
        password:"",
        name:"",
        mobile:"",
        street:"",
        city:"",
        state:"",
        pincode:null,
        landmark:"",
        confirmPassword:""
    })
    const [loginDetails, setloginDetails] = useState({email:'',password:''})
    const showhide=()=>{
        setfirstFunc("hide")
        setsecondFunc("show")
        setdisplay("none")
    }
    const showhide1=()=>{
        setsecondFunc("hide")
        setfirstFunc("show")
        setdisplay("block")
    }
    const sendOtp = async(e)=>{
        e.preventDefault()
        try
        {
            setisLoading(true)
            seterror(null)
            const res = await fetch(`http://localhost:8000/api/user/sendotp`, { 
            method : 'POST',
            headers : {
                'Content-type': 'application/json'
            },
            body :JSON.stringify({
                email : signUpDetails.email
            })})
            const responsedata = await res.json()
            if(!res.ok)
            {
                throw new Error(responsedata.message)
            }
            setisLoading(false)
            setisOtpSent(true)
        }
        catch(err)
        {
            setisLoading(false)
            seterror(err.message || 'Some unknown error occured!!!')
        }
    }
    const verifyOtp = async(e)=>{
        e.preventDefault()
        try
        {
            setisLoading(true)
            seterror(null)
            const res = await fetch(`http://localhost:8000/api/user/verifyotp`, { 
            method : 'POST',
            headers : {
                'Content-type': 'application/json'
            },
            body :JSON.stringify({
                email : signUpDetails.email,
                otp : signUpDetails.otp
            })})
            const responsedata = await res.json()
            if(!res.ok)
            {
                throw new Error(responsedata.message)
            }
            setisLoading(false)
            setisOtpVerified(true)
            setdisabled(false)
        }
        catch(err)
        {
            setisLoading(false)
            seterror(err.message || 'Some unknown error occured!!!')
        }
    }
    const signup =async (e)=>{
        e.preventDefault()
        try
            {
                setisLoading(true)
                seterror(null)
                const res = await fetch(`http://localhost:8000/api/user/signup`, { 
                method : 'POST',
                headers : {
                    'Content-type': 'application/json'
                },
                body :JSON.stringify({
                    name : signUpDetails.name,
                    email : signUpDetails.email,
                    password : signUpDetails.password,
                    mobile : signUpDetails.mobile,
                    street: signUpDetails.street,
                    city: signUpDetails.city,
                    pincode:signUpDetails.pincode,
                    state: signUpDetails.state,
                    landmark: signUpDetails.landmark,
                })
        })
        const responsedata = await res.json()
            if(!res.ok)
            {
                throw new Error(responsedata.message)
            }
            auth.logging(responsedata.userId,responsedata.email,responsedata.token);
        setisLoading(false)
        if(res.ok)
        {
            navigate(`../`)
        }
    }
        catch(err)
        {
            setisLoading(false)
            seterror(err.message || 'Some unknown error occured!!!')
        }
    }
    const login = async(e)=>{
        e.preventDefault()
        try
            {
                setisLoading(true)
                seterror(null)
                const res = await fetch(`http://localhost:8000/api/user/login`, { 
                method : 'POST',
                headers : {
                    'Content-type': 'application/json'
                },
                body :JSON.stringify({
                    email:loginDetails.email,
                    password : loginDetails.password
                })
        })
        const responsedata = await res.json()
            if(!res.ok)
            {
                throw new Error(responsedata.message)
            }
            auth.logging(responsedata.userId,responsedata.email,responsedata.token);
        setisLoading(false)
        if(res.ok)
        {
            navigate(`../`)
        }
    }
        catch(err)
        {
            setisLoading(false)
            seterror(err.message || 'Some error occurred!!!')
        }
    }
    const inputHandlerForSignup=(e)=>{
        const { name, value } = e.target;
        setsignUpDetails({
          ...signUpDetails,
          [name]: value
        });
    }
    const inputHandlerForLogin =(e)=>{
        e.preventDefault()
        const {name,value} = e.target
        setloginDetails({
            ...loginDetails,
            [name]:value
        })
    }
    const closeError = (e)=>{
        e.preventDefault()
        seterror(null)
    }
  return (
    <>
    {isLoading && <LoadingSpinner asOverlay/>}
    {error && <ErrorHandler error={error} closeError={closeError} />}
    <section className="loginpage">
        <div className="card card1">
        <div className="onehalf displayonbig" >
            <img className="loginimg" style={{display: `${display}`}} src={i3} alt="" />
        </div>
        <div className="secondhalf">
            <form className={firstFunc} onSubmit={login}>
                <label for="email"><div className="red">*</div>Email</label><br/>
                <input type="email" name="email" id="" value={loginDetails.email} onChange={inputHandlerForLogin} required /><br/><br/>
                <label for="password"><div className="red">*</div>Enter Password</label><br/>
                <input type="password" name="password" value={loginDetails.password} onChange={inputHandlerForLogin} required id="" /> <br/> <br/>
                <button className="btn" type="submit" name="login">Login</button> <br/>
                <div className="form-text inline">Don't have an account?</div> 
                <div className="signuptoggle" onClick={showhide}>Sign Up</div>
            </form>

            <form className={secondFunc} method="post" onSubmit={sendOtp}>
                <label for="email"><div className="red">*</div>Email</label>
                <input type="email" name="email" required 
                value={signUpDetails.email} 
                onChange={inputHandlerForSignup}
                disabled={isOtpVerified} /><br/><br/>
                <button type="submit" className={`btn ${isOtpSent ? 'hide' : ''}`}
                disabled={isOtpSent} name="sendotp" >Send OTP</button>
            </form>
                <br/>
            <form className={secondFunc} method="post" onSubmit={verifyOtp}>
            <label for="otp"><div className="red">*</div>OTP </label>
            <input type="number" name="otp" required value={signUpDetails.otp} onChange={inputHandlerForSignup} disabled={!isOtpSent} /><br/><br/>
            <button type="submit" className={`btn ${isOtpVerified || !isOtpSent ? 'hide' : ''}`}
            disabled={isOtpVerified || !isOtpSent} name="sendotp" >Verify OTP</button>
            </form>
                <br/>
            <form className={secondFunc} onSubmit={signup} > <br/>
                <label for="name"><div className="red">*</div>Name</label>
                <input type="text" className="signupinput" name="name" required disabled={disabled} onChange={inputHandlerForSignup} value={signUpDetails.name} /> <br/> <br/>
                <label for="mobile"><div className="red">*</div>Mobile No.</label>
                <input type="number" className="signupinput" name="mobile" required disabled={disabled} onChange={inputHandlerForSignup} value={signUpDetails.mobile} /> <br/> <br/>
                <label for="street"><div className="red">*</div>Street</label>
                <input type="text" className="signupinput" name="street" required disabled={disabled} value={signUpDetails.street} onChange={inputHandlerForSignup} /> <br/> <br/>
                <label for="city"><div className="red">*</div>City</label>
                <input type="text" className="signupinput" name="city" required disabled={disabled} value={signUpDetails.city} onChange={inputHandlerForSignup} /> <br/> <br/>
                <label for="state"><div className="red">*</div>State</label>
                <input type="text" className="signupinput" name="state" required disabled={disabled} value={signUpDetails.state} onChange={inputHandlerForSignup} /> <br/> <br/>
                
                <label for="pincode"><div className="red">*</div>PinCode</label>
                <input type="number" className="signupinput" name="pincode" required disabled={disabled} value={signUpDetails.pincode} onChange={inputHandlerForSignup} /> <br/> <br/>

                <label for="landmark">Landmark</label>
                <input type="text" className="signupinput" name="landmark" disabled={disabled} value={signUpDetails.landmark} onChange={inputHandlerForSignup} /> <br/> <br/>
                <label for="password"><div className="red">*</div>Enter Password</label>
                <input type="password" className="signupinput" name="password" required disabled={disabled} value={signUpDetails.password} onChange={inputHandlerForSignup} /> <br/> <br/>
                <label for="confirmPassword"><div className="red">*</div>Confirm Password</label>
                <input type="password" name="confirmPassword" className="signupinput" required disabled={disabled} value={signUpDetails.confirmPassword} onChange={inputHandlerForSignup} /> <br />
                {signUpDetails.password!==signUpDetails.confirmPassword && <div className="red">Passwords not same</div> }
                <br/> <br/>
                
                <button className="btn" type="submit" name="login" disabled={signUpDetails.password!==signUpDetails.confirmPassword} >Signup</button> <br/>
                <div className="form-text inline">Already have an account?</div> <div className="signuptoggle" onClick={showhide1}>Login</div>
            </form>
        </div>
    </div>
    </section>
    </>
  )
}

export default Loginpage