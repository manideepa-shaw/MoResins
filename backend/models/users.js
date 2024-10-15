const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
      email:{
        type: String,
        required: true,
        unique:true
      },
      password:{
        type: String,
        required: true,
        minlength : 8
      },
      mobile:[{
        type: Number,
        required: true,
      }],
      wishlist:[
        {
          type: mongoose.Types.ObjectId,
          ref : 'Wishlist'
        }
      ],
      address:{
            street : {
                type : String,
                required : true
            },
            city:{
                type : String,
                required : true
            },
            state:{
                type : String,
                required : true
            },
            pincode:{
                type : Number,
                minlength : 6,
                maxlength : 6,
                required : true
            },
            landmark:{
                type : String
            }
      },
    orders:[{
      type: mongoose.Types.ObjectId,
      required: true,
      ref:'Order'
    }]
})

userSchema.plugin(uniqueValidator) //this will make sure that the emails entered are unique and have not been entered before. We need to install this explicitly

//this 'User' will be the name of the collection as well but as 'users' //implicitly
module.exports = mongoose.model('User',userSchema)