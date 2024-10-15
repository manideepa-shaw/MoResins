const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    user:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref:'User'
      },
    products:[
        {
        product:{
            type: mongoose.Types.ObjectId,
            required: true,
            ref:'Product'
        },
        quantity: {
            type : Number,
            required: true
        },
        totalPrice : {
            type: Number,
            required : true
        }
    }
    ],
    deliveryAddress:{
        type:  String,
        required: true
    },
    deliveryStatus:{
        type: String,
        required : true
    },
    finalPrice:{
        type: Number,
        required: true
    }
})

//this 'User' will be the name of the collection as well but as 'users' //implicitly
module.exports = mongoose.model('Order',orderSchema)