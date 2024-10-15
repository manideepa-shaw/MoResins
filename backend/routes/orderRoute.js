const express = require('express')

const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/users')
const Cart = require('../models/cart')
const Order = require('../models/order')
const mongoose = require('mongoose')
const { check, validationResult, ExpressValidator} = require('express-validator')
const checkAuth = require('../middleware/check-auth')
// const Payment = require('../middleware/payment')
// const checkStatus = require('../middleware/payment-status')
// const Stripe = require('stripe');
// const stripe = Stripe(process.env.SECRET_KEY_STRIPE);

const route=express.Router()
route.use(checkAuth)

route.get('/',async(req,res,next)=>{
    let user;
    try{
        user = await User.findById(req.userData.userId).populate({
            path: 'orders',
            populate:{
                path:'products.product',
                model : 'Product'
            }
        })
    }
    catch(err)
    {
        const error = new Error('Retry Again!!')
        error.code=401
        return next(error)
    }
    if(!user)
    {
        const error = new Error('No Orders Found!!')
        error.code=201
        return next(error)
    }
    res.status(200).json({orders : user.orders.map(u=>u.toObject({getters:true}))})
})

route.get('/:oid',async(req,res,next)=>{
    let order;
    try{
        order = await Order.findById(req.params.oid).populate('products.product')
    }
    catch(err)
    {
        const error = new Error('Retry Again!!')
        error.code=401
        return next(error)
    }
    if(!order)
    {
        const error = new Error('No Orders Found!!')
        error.code=201
        return next(error)
    }
    if(order.user!=req.userData.userId)
    {
        const error = new Error('Seems Not to be your Order!!')
        error.code=201
        return next(error)
    }
    res.status(200).json({orders : order})
})
route.patch('/:oid',async(req,res,next)=>{
    let order;
    const deliveryStatus= req.body.deliveryStatus;

    try{
        order = await Order.findById(req.params.oid)
    }
    catch(err)
    {
        const error = new Error('Retry Again!!')
        error.code=401
        return next(error)
    }
    if(!order || order.deliveryStatus!=='Active')
    {
        const error = !order?new Error('No such order!!'):new Error('Order already '+order.deliveryStatus)
        error.code=404
        return next(error)
    }
    // to find if the order actually belongs to the specified user and if they are trying to cancel
    if(deliveryStatus==='Cancelled' && order.user.toString()!==req.userData.userId)
    {
        const error = new Error('Order is not yours. You cannot delete it!!!')
        error.code=401
        return next(error)
    }
    // for admin purpose when they want to update deliveryStatus as delivered we need to check if the user is admin
    if(deliveryStatus!=='Cancelled' && process.env.ADMIN_ID!==req.userData.userId)
    {
        const error = new Error('Not an Admin!!!')
        error.code=401
        return next(error)
    }

    try{
        await Order.findByIdAndUpdate(req.params.oid,{deliveryStatus : deliveryStatus})
    }
    catch(err)
    {
        const error = new Error('Retry Again!!')
        error.code=401
        return next(error)
    }
    res.status(200).json({message: `Order ${deliveryStatus} Successfully`})

})

route.post('/',async(req,res,next)=>{
    let uid = req.userData.userId
    let foundCart;
    try{
        foundCart = await Cart.find({user : uid}).populate('products')
    }
    catch(err)
    {
        const error = new Error('Retry Again!!')
        error.code=401
        return next(error)
    }
    
    if(!foundCart || foundCart.length==0)
    {
        const error = new Error('No Items in the cart!!!')
        error.code=404
        return next(error)
    }
    let finalPrice=0;
    let prodArray=foundCart.map((item)=>{
        let temp={
            product: item.products._id,
            quantity: item.quantity,
            totalPrice: item.price
        }
        finalPrice+=item.price
        return temp;
    })
    let user;
    try{
        user = await User.findById(uid)
    }
    catch(err)
    {
        const error = new Error('Could not place order. Try again!')
        error.code=500
        return next(error)
    }
    const deliveryAddress=user.address
    const newOrder = new Order({
        user : uid,
        products: prodArray,
        deliveryAddress,
        deliveryStatus: 'Active',
        finalPrice: finalPrice
    })
    const session = await mongoose.startSession()
    try{
        session.startTransaction()      
        await newOrder.save({ session : session })
        user.orders.push(newOrder) //this only adds the order ID
        await user.save( { session : session })
        await Cart.deleteMany({user : uid},{session:session})
        await session.commitTransaction()
      }
      catch(err){
        await session.abortTransaction();
        const error = new Error('Order not successful! If amount deducted will be refunded!')
        error.code=500
        return next(error)
      }
      finally{
        await session.endSession()
      }
      res.status(200).json({message:'Order Placed!',orderDetails: newOrder})
})

module.exports=route