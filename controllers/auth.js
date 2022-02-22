import User from "../models/User.js"
import ErrorResponse from '../helpers/ErrorResponse.js'
import crypto from 'crypto'
import {
        resetPasswordEmail,
        welcomeEmail
} from '../helpers/sendMail.js'

//login route
export const login = async (req, res, next) =>{
    let data = {}
    let password = req.body.password
    req.body.phoneNumber != null ? data.phoneNumber = req.body.phoneNumber : false
    req.body.email != null ? data.email = req.body.email : false
    
    
    if (Object.entries(data).length == 0 || !password){
         return next(new ErrorResponse('provide a username and a password', 400))
      }
    
     try {
      const user = await User.findOne(data).select('+password')
  
          if (!user){
             return next(new ErrorResponse('Invalid Details', 401))
          }
          if (user.verificationToken != undefined){
            return next(new ErrorResponse('USER IS NOT VERIFIED! Please, check your email for verification link', 403))
          }
          
          const isMatch = await user.comparePasswords(password)
          if (!isMatch){
              return next(new ErrorResponse('Invalid Details', 401))
           }
          const token  = user.getSignedToken() 
           res.status(201).json({success: true, token })
      }
       catch (error) {
          next(error)
      }
}

//register user route
export const register = async (req, res , next)=>{
    let {firstName,
        lastName,
        password,
        email,
        phoneNumber} = req.body


    try {
        //checks if a user exists
        const user = await User.findOne({phoneNumber, email}).select("+password")

        if (user){
            return next(new ErrorResponse('User exist', 406))
        }
        const token = crypto.randomBytes(20).toString('hex')

        //creates new user
        await user.create({firstName,
            lastName,
            password,
            email,
            phoneNumber,
            verificationToken: token,
            role: req.params.role
        })

        const verificationLink = `${process.env.ENV_URL}/api/auth/verify/${token}`

        await welcomeEmail(email,verificationLink)

        res.status(201).json({success: true, message:'verify email to continue'})
        
    } catch (error) {
        next(error)
        }
}

//resend verification link//

//verify email
export const verifyEmail = async (req, res, next) => {

try {
    const user = User.findOne({verificationToken: req.params.token})

    if (!user){
    return next(new ErrorResponse('Invalid Token', 404))
    }

    user.verificationToken = undefined

    await user.save()

    res.status(201).json({success: true, message:'successfully verified'})
    
} catch (error) {
    next(error)
    }
}

//forgot password
export const forgotPassword = async (req, res , next)=>{
    const {email} = req.body.email

    if (!email){
        return next(new ErrorResponse('User not found',404))
    }
    try {
        let user = await User.findOne({email})
        
        if (!user){
            return next (new ErrorResponse('User not found.',404))
        }
        const resetToken = crypto.randomBytes(20).toString('hex')

        const resetPasswordLink = `${process.env.ENV_URL}/api/auth/resetpassword/${resetToken}`

        await resetPasswordEmail(email, resetPasswordLink)

        user.resetToken = resetToken

        await user.save()

        res.status(201).json({success: true, message:'password reset email sent'})

    } catch (error) {
        next(error)
    }
}

export const resetPassword = async (req, res , next)=>{
    let password  = req.body.password

    if (!password){
        return next(new ErrorResponse('Enter yout new password',400))
    }
    
    try {
        const user = await User.findOne({resetToken: req.params.token})
                            .select('+password')
        
        if (!user){
            return next(new ErrorResponse('User not found',404))
        }   

        user.password = password

        user.resetToken = undefined

        await user.save()

        res.status(201).json({success: true, message:'password changed'})

    } catch (error) {
        next(error)
    }


}

export const contactUs = (req, res, next) =>{
    let {
        fullName,
        email,
        message
    } = req.body
    notification.create({sender: fullName, type: 'contact us', message: {email, message}})
    .then(
        res.status(200).json({
        success: true,
        message:'we have recieved your specification, sit tight.. we will get back to you as soon as possible'
    })
    ).catch(err=>{
        return next(new errorResponse(err.message, 500))  
    })
}