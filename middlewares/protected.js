import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import ErrorResponse from '../helpers/ErrorResponse.js'

export default (role) => {
    return async (req, res, next) => {
    let token =
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' ?
        req.headers.authorization.split(' ')[1]
        : null

    if (!token){
        return next (new ErrorResponse('Not Authorized' , 401))
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if (!user){
            return next (new ErrorResponse('User not found' , 404))

    }
    req.user = user;

    (role === user.role) ?
    next() 
    : next (new ErrorResponse('Unauthorized' , 403))

    } catch (error) {
        next(error)
        }

    }
}
