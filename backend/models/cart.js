const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema({
    user:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref:'User'
      },
    products:{
            type: mongoose.Types.ObjectId,
            required: true,
            ref:'Product'
        },
    quantity: {
        type : Number,
        default:1,
    },
    price : {
        type: Number,
        required : true
    }
})

//this 'User' will be the name of the collection as well but as 'users' //implicitly
module.exports = mongoose.model('Cart',cartSchema)