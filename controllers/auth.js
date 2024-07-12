const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors/index')
// const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    // const { name, email,password } = req.body
    // // Here we are creating the random bytes by this code.
    // // The more number the more secure but more processing time.
    // const salt = await bycrypt.genSalt(10)
    // // Here we not only hashing the password but also using random bytes
    // const hashedPassword = await bycrypt.hash(password, salt)
    // const tempUser = { 
    //     name, 
    //     email,
    //     password : hashedPassword
    // }
    // const user = await User.create({...tempUser})

    const user = await User.create({...req.body})
    // const token = jwt.sign({ userId: user._id, userName: user.name }, "jwtSecret", { expiresIn: '10d', })
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({
        user:{
            name: user.name
        },
        token
    })
}
const login = async (req, res) => {
    const { email, password }  = req.body
    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({ email })
    if(!user){
        throw new UnauthenticatedError("Invalid Credentials")
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Invalid Credentials")
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ 
        user:{ name: user.name },
        token 
    })
}

module.exports = {
    register,
    login,
}