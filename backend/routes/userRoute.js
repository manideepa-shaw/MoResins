const express = require('express')
const User = require('../models/users')
const Wishlist = require('../models/wishlist')
const Order = require('../models/order')
const { check, validationResult, ExpressValidator} = require('express-validator')
const bcrypt = require('bcryptjs')
const checkAuth = require('../middleware/check-auth')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const route=express.Router()

route.post('/signup',
[
    check('name').not().isEmpty(),
    check('email').isEmail().normalizeEmail(),
    check('password').isStrongPassword({
        minLength: 8 ,
        minLowercase: 1,
        minUppercase:1,
        minNumbers:1,
        minSymbols:1
      }).withMessage('Your password should be of minimun length of 8, should contain a capital letter, a small letter, a symbol, a digit'),
    check('mobile').not().isEmpty().isLength({min:10, max:10}).withMessage('Not a valid phone number'),
    check('street').not().isEmpty(),
    check('city').not().isEmpty(),
    check('pincode').not().isEmpty().isLength({min:6, max:6}).withMessage('Not a valid pincode'),
    check('state').not().isEmpty(),
],
async(req,res,next)=>{
    // extra lines of codee when using external validator
    const error = validationResult(req)
    if(!error.isEmpty())
    {
        const err=new Error(error.errors[0].msg)
        err.code=422
        return next(err)
    }
    //
    
    const {name , email, password, mobile, alternatemobile, street, city, state, pincode, landmark}=req.body
    let existingUser;
    try{
        existingUser = await User.findOne({ email : email })
    }
    catch(error)
    {
        const err=new Error('Signing Up failed! Try again later!')
        err.code=500
        return next(err)
    }
    if(existingUser)
    {
        const err=new Error('Email already exists! Please login.')
        err.code=422
        return next(err)
    }
    let hashedPassword ;
    try
    {
        hashedPassword = await bcrypt.hash(password, 12)//12 is the number of salting round
    }
    catch(err)
    {
        const error = new Error('Could not create user!')
        error.code=500
        return next(error)
    }
    let address = {
        street,
        city,
        state,
        pincode,
        landmark
    }
    let mobileNumbers = [mobile]
    if(alternatemobile)
    {
        mobileNumbers.push(alternatemobile)
    }
    const newuser = new User({
        name,
        email,
        password : hashedPassword,
        address,
        mobile : mobileNumbers,
        orders:[],
        wishlist:[]
    })
    try{
        await newuser.save(newuser)
    }
    catch(error)
    {
        const err=new Error('Signing Up failed! Try again later!')
        err.code=500
        return next(err)
    }
    // jwt 
    let token;
    try
    {
        token=jwt.sign({userId : newuser.id, email : newuser.email},'myprivatekey') //sign returns a string in the end and this will be the generated token 
        //the first argument of this sign is the payload i.e.,  the data that we want to encode into the token
    }
    catch(error)
    {
        const err=new Error('Signing Up failed! Try again later!')
        err.code=500
        return next(err)
    }

    // res.status(200).json({message:"User Signup successfull",
    // user: newuser.toObject( { getters:true },'-password' ) })

    res.status(200).json({userId: newuser.id, email : newuser.email, token:token})
})

route.post('/login',
    [
        check('email').isEmail().not().isEmpty().normalizeEmail().withMessage('Not a valid email'),
        check('password').not().isEmpty().withMessage('Please enter password'),
    ],async(req,res,next)=>{
    // extra lines of codee when using external validator
    const error = validationResult(req)
    if(!error.isEmpty())
    {
        const err=new Error(error.errors[0].msg)
        err.code=422
        return next(err)
    }
    //
    const {email, password}=req.body
    let existingUser;
    try{
        existingUser = await User.findOne({ email : email })
    }
    catch(error)
    {
        const err=new Error('Logging In failed! Try again later!')
        err.code=500
        return next(err)
    }
    if(!existingUser)
    {
        const err = new Error("User not Found!")
        err.code=404
        next(err)
    }
    else{
        let isValidPassword;
        try
        {
            isValidPassword = await bcrypt.compare(password, existingUser.password)
        }
        catch(err)
        {
            const error = new Error("Could not log you in! Some error occured")
            error.code=500
            return next(error)
        }
        if(!isValidPassword)
        {
            const err = new Error("Incorrect password!")
            err.code=404
            return next(err)
        }

        // jwt 
        let token;
        try
        {
            token=jwt.sign({userId : existingUser.id, email : existingUser.email},'myprivatekey') //sign returns a string in the end and this will be the generated token 
            //the first argument of this sign is the payload i.e.,  the data that we want to encode into the token
        }
        catch(error)
        {
            const err=new Error('Could not log you in! Some error occured')
            err.code=500
            return next(err)
        }

        // res.status(200).json({message : "Logged In!", 
        // user: existingUser.toObject( { getters:true } )})

        res.status(200).json({userId: existingUser.id, email : existingUser.email, token:token})
    }
})

route.use(checkAuth)

route.get('/',async(req,res,next)=>{
    let userId = req.userData.userId
    let user
    try{
        user = await User.findById(userId)
    }
    catch(err)
    {
        const error = new Error('Some error occured while fetching details!')
        error.code=401
        return next(error)
    }
    if(!user)
    {
        const error = new Error('No such user exists!!!')
        error.code=404
        return next(error)
    }
    res.status(200).json({user : user})
})

route.patch('/',   
[
    check('name').not().isEmpty(),
    check('mobile').not().isEmpty().isLength({min:10, max:10}).withMessage('Not a valid phone number'),
    check('street').not().isEmpty(),
    check('city').not().isEmpty(),
    check('pincode').not().isEmpty(),
    check('state').not().isEmpty(),
],async(req,res,next)=>{
    // extra lines of codee when using external validator
    const error = validationResult(req)
    if(!error.isEmpty())
    {
        const err=new Error(error.errors[0].msg)
        err.code=422
        return next(err)
    }
    //
    const {name,password, mobile, street, city, state, pincode, landmark} = req.body
    let user;
    let id=req.userData.userId;
    try{
        user = await User.findById(id)
    }
    catch(err)
    {
        const error = new Error('Some problem occurred while editing')
        error.code=422
        return next(error)
    }
    if(!user)
    {
        const error = new Error('User not found!')
        error.code=404
        return next(error)
    }

    let updatedUser
    let updateDetails = {'address.street':street,
        'name':name,
        'mobile':mobile,
        'address.state':state,
        'address.pincode':pincode, 
        'address.landmark':landmark,
        'address.city':city,
        'password':password}
    try{
        await User.findByIdAndUpdate(id,{$set : updateDetails })
        updatedUser = await User.findById(id)
    }
    catch(err)
    {
        const error = new Error('Some problem occurred while editing')
        error.code=422
        return next(error)
    }
    res.json({message: "User Details edited Successfully",user: updatedUser})
})

route.delete('/',async(req,res,next)=>{
    let id=req.userData.userId
    let user
    try{
        user = await User.findById(id)
    }
    catch(err)
    {
        const error = new Error('Some problem occurred while editing')
        error.code=422
        return next(error)
    }
    if(!user)
    {
        const error = new Error('User not found!')
        error.code=404
        return next(error)
    }
    const session = await mongoose.startSession()
    try
    {
        session.startTransaction()      
        await User.findByIdAndDelete(id,{session : session})
        // deleting wishlist of the user
        await Wishlist.deleteMany({user : id},{session : session})
        // removing there order details
        await Order.deleteMany({user : id},{session : session})
        await session.commitTransaction()
    }
    catch(err)
    {
        await session.abortTransaction();
        const error = new Error('Some problem occurred while editing')
        error.code=422
        return next(error)
    }
    finally{
        await session.endSession()
    }
    res.status(201).json({message: "User Account deleted Successfully"})
})

module.exports=route