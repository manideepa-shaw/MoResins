const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wishlistSchema = new Schema({
    user : {
        type: mongoose.Types.ObjectId,
        required: true,
        ref:'User'
    },
    products : {
        type: mongoose.Types.ObjectId,
        required: true,
        ref : 'Product'
    }
})

//this 'User' will be the name of the collection as well but as 'users' //implicitly
module.exports = mongoose.model('Wishlist',wishlistSchema)