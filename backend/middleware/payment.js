const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/users')
const Cart = require('../models/cart')
const Order = require('../models/order')
const Stripe = require('stripe');
const stripe = Stripe(process.env.SECRET_KEY_STRIPE);

module.exports = async(req,res,next)=>{
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

    try{
        //payment
        payment = await stripe.checkout.sessions.create({
            success_url: 'http://localhost:8000/api/order/success',
            line_items: [
              {
                price_data:{
                    currency :'inr',
                    product_data:{
                        name :'Total Amount'
                    },
                    unit_amount : finalPrice*100
                },
                quantity : 1
              }
            ],
            mode: 'payment',
          });
        ///
      }
      catch(err){
        const error = new Error('Could not place order. Try again!')
        error.code=500
        return next(error)
      }
      req.payment={id : payment.id,
         newOrder : newOrder,
         user : user,
    }
    console.log(payment)
    // res.redirect(payment.url)
    next()
}