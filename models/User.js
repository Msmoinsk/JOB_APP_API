const mongoose = require('mongoose')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please provide name"],
        minlength: 3,
        maxlength: 50,
    },
    email:{
        type: String,
        required: [true, "Please provide email"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password:{
        type: String,
        required: [true, "Please provide password"],
        minlength: 6,
    },
})

UserSchema.pre('save', async function(next){
    // Here we are creating the random bytes by this code.
    // The more number the more secure but more processing time.
    const salt = await bycrypt.genSalt(10)
    // here this. is prefered for the document means UserSchema.password object
    this.password = await bycrypt.hash(this.password, salt)
    next()
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bycrypt.compare(candidatePassword,  this.password)
    return isMatch
}

UserSchema.methods.createJWT = function () {
    return jwt.sign({
        userID : this._id,
        userName : this.name
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
}

module.exports = mongoose.model('User', UserSchema)