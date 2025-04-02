const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Name is rquired']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please give a valid email']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Enter a password'],
        minlength: 6
    },
    passwordConfirm:{
        type: String,
        required: [true, 'Re-enter the password'],
        validate: {
            // only works on save and create
            validator: function(el){
                return el === this.password
            },
            message: 'Password do not match'
        }
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User