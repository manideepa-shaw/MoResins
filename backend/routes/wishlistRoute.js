const express = require('express')
const Product = require('../models/products')
const User = require('../models/users')
const Wishlist = require('../models/wishlist')
const mongoose = require('mongoose')
const { check, validationResult, ExpressValidator} = require('express-validator')
const checkAuth = require('../middleware/check-auth')

const route=express.Router()
route.use(checkAuth)
route.get('/',async(req,res,next)=>{
    let user
    try{
        user = await User.findById(req.userData.userId).populate({
            path: 'wishlist', // Populating the wishlist in the User schema
            populate: {
                path: 'products', // Populating the products in the Wishlist schema
                model: 'Product'  // Explicitly define the model to populate
            }
        })
    }
    catch(err)
    {

    }
    if(!user)
    {
        const err=new Error('No user found!!!')
        err.code=401
        return next(err)
    }
    res.json({wishlist : user.wishlist.map((u)=> u.products.toObject({getters:true}))})
})

route.post('/:pid',async(req,res,next)=>{
    let user
    try{
        user = await User.findById(req.userData.userId)
    }
    catch(err)
    {
        const error = new Error('Retry Again!!')
        error.code=404
        return next(error)
    }
    if(!user)
    {
        const err=new Error('User account not found!')
        err.code=404
        return next(err)
    }
    let product;
    try{
        product= await Product.findById(req.params.pid)
    }
    catch(err)
    {
        const error = new Error('Retry Again!')
        error.code=401
        return next(error)
    }
    if(!product)
    {
        const error = new Error('Product no longer available')
        error.code=401
        return next(error)
    }
    let already;
    try{
        already = await Wishlist.find({user : user._id, products : req.params.pid})
    }
    catch(err)
    {
        const error = new Error('Retry Again!!')
        error.code=401
        return next(error)
    }
    if(already.length>0)
    {
        console.log(already)
        const error = new Error('Product already Wishlisted')
        error.code=401
        return next(error)
    }
    const createdWishlist= new Wishlist({
        user: req.userData.userId,
        products: req.params.pid
    })
    const session = await mongoose.startSession()
    try{
        session.startTransaction()
        createdWishlist.save({ session : session })
        user.wishlist.push(createdWishlist) //this only adds the wishlist ID
        await user.save( { session : session })
        await session.commitTransaction()
      }
      catch(err){
        console.log(err)
        await session.abortTransaction();
        const error = new Error('Could not add item to wishlist')
        error.code=500
        return next(error)
      }
      finally{
        await session.endSession()
      }
    res.status(200).json({message : "Added to wishlist"})
})

route.delete('/:pid',async(req,res,next)=>{
    let user
    try{
        user = await User.findById(req.userData.userId)
    }
    catch(err)
    {
        const error = new Error('Retry later')
        error.code=401
        return next(error)
    }
    if(!user)
    {
        const error = new Error('Cannot find User!')
        error.code=404
        return next(error)
    }
    let wishId
    try{
        wishId = await Wishlist.findOne({user : user, products : req.params.pid})
    }
    catch(err)
    {
        const error = new Error('Retry LAter')
        error.code=404
        return next(error)
    }
    if(!wishId)
    {
        const error = new Error('No such item wishlisted!')
        error.code=401
        return next(error)
    }
    const session = await mongoose.startSession()
    try{
        // we use transaction ans session because I need all these tasks to make changes only when all of them are executed 
        session.startTransaction()
        await Wishlist.findByIdAndDelete(wishId._id,{ session : session })
        await User.findByIdAndUpdate(user._id,{$pull:{wishlist: wishId._id}}) //this remove the place ID from the creator because its already populated
        // await wishId.user.save( { session : session })
        await session.commitTransaction()
      }
      catch(err)
      {
        await session.abortTransaction();
        const error = new Error('Cannot removed from Wishlist')
        error.code = 500
        return next(error)
      }
      finally{
        await session.endSession()
      }
    res.status(201).json({message : "Removed from wishlist"})
})

module.exports=route