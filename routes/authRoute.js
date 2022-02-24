import express from 'express'
import {
    login,
    register,
    resetPassword,
    forgotPassword,
    verifyEmail,
    contactUs
} from '../controllers/auth.js'

const router = express.Router()

router.post("/login", login)

router.post("/register/:role", register)

router.patch("/resetpassword/:token", resetPassword)

router.post("/forgotpassword", forgotPassword)

router.get("/verify/:token", verifyEmail)

router.post("/contactUs", contactUs)

export default router