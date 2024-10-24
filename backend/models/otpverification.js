const mongoose = require('mongoose')
const Schema = mongoose.Schema

const otpSchema = new Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    otp : {
        type: Number,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now
    },
    expiresAt:{
        type: Date, 
        default: () => Date.now() + 10 * 60 * 1000 //10 mins expiration time
    },
    verifiedStatus:{
        type : Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model('Otp',otpSchema)