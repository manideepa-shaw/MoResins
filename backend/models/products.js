const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type : Number,
        required: true
    },
    desc:{
        type: String,
    },
    image:[{
        type: String,
        required: true
    }]
})

//this 'User' will be the name of the collection as well but as 'users' //implicitly
module.exports = mongoose.model('Product',productSchema)