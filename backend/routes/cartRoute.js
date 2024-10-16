const express = require('express')
const Product = require('../models/products')
const User = require('../models/users')
const Wishlist = require('../models/wishlist')
const Cart = require('../models/cart')
const mongoose = require('mongoose')
const { check, validationResult, ExpressValidator} = require('express-validator')
const checkAuth = require('../middleware/check-auth')

const route=express.Router()
route.use(checkAuth)

route.get('/',async(req,res,next)=>{
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
    
    if(!foundCart)
    {
        const error = new Error('No Items in the cart!!!')
        error.code=404
        return next(error)
    }
    res.status(200).json({details : foundCart})
})

route.post('/:pid',
    [
        check('quantity').isInt({min:1}).withMessage('Quantity should be positive and less than 21')
    ],
    async(req,res,next)=>{
    const error = validationResult(req)
    if(!error.isEmpty())
    {
        const err=new Error(error.errors[0].msg)
        err.code=422
        return next(err)
    }
    //
        
    let product;
    try{
        product = await Product.findById(req.params.pid)
    }
    catch(err)
    {
        const error = new Error('Retry Again!!')
        error.code=401
        return next(error)
    }
    if(!product)
    {
        const error = new Error('Product not found!!')
        error.code=404
        return next(error)
    }
    let existing;
    try{
        existing = await Cart.findOne({user : req.userData.userId, products: product._id})
    }
    catch(err)
    {
        const error = new Error('Retry Again!!')
        error.code=401
        return next(error)
    }
    if(existing)
    {
        const error = new Error('Product already added to cart!!')
        error.code=401
        return next(error)
    }
    const newCart = new Cart({
        user : req.userData.userId,
        quantity : req.body.quantity,
        products : req.params.pid,
        price : product.price*req.body.quantity
    })
    let cart;
    try{
        await newCart.save(newCart)
    }
    catch(err){
        const error = new Error('Retry Again!!')
        error.code=401
        return next(error)
    }
    res.status(200).json({message : "Item added to the cart!!!"})
})

route.patch('/:pid',
    [
        check('quantity').isInt({min:1}).withMessage('Quantity should be positive and less than 21')
    ],async(req,res,next)=>{
    //
    const error = validationResult(req)
    if(!error.isEmpty())
    {
        const err=new Error(error.errors[0].msg)
        err.code=422
        return next(err)
    }
    //
           

    let cartItem;
    try{
        cartItem = await Cart.findOne({user : req.userData.userId, products: req.params.pid}).populate('products')
    }
    catch(err)
    {
        const error = new Error('Retry Again!!')
        error.code=401
        return next(error)
    }
    if(!cartItem)
    {
        const error = new Error('No such item found!!')
        error.code=404
        return next(error)
    }
    let updated
    try{
        updated=await Cart.findByIdAndUpdate(cartItem._id,{quantity : req.body.quantity,
            price : req.body.quantity*cartItem.products.price
        },{new : true}).populate('products')
    }
    catch(err){
        const error = new Error('Retry Again!!')
        error.code=401
        return next(error)
    }
    res.json({message: updated})
})

route.delete('/:pid',async(req,res,next)=>{
    let item;
    try{
        item = await Cart.findOne({user : req.userData.userId, products : req.params.pid}).populate('products')
    }
    catch(err)
    {
        const error = new Error('Retry Again!!')
        error.code=401
        return next(error)
    }
    if(!item)
    {
        const error = new Error('No such item is in the cart!!')
        error.code=401
        return next(error)
    }
    try{
        await Cart.findByIdAndDelete(item._id)
    }
    catch(err)
    {
        const error = new Error('Retry Again!!')
        error.code=401
        return next(error)
    }
    res.status(200).json({message:"Removed from cart"})
})

module.exports=route