const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = (req, res, next) => {
    const authToken = req.headers.authorization
    // You Did 2 mistakes idiot .....
    // 1. its { req.[headers.authentication] } not { req.[header.Authentication] }
    // 2. in if Statement its { authToken.starts[W]ith } not { authToken.starts[w]ith }
    if(!authToken || !authToken.startsWith("Bearer ")){
        throw new UnauthenticatedError("Token Isn't Correct")
    }
    const token = authToken.split(" ")[1]
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: decoded.userID, name: decoded.userName }
        next()
    }catch(err){
        throw new UnauthenticatedError('Their is issue in authenticating')
    }
}

module.exports = auth