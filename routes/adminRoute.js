import express from 'express'
import {
    getUser,
    changePassword,
    getNotif,
} from '../controllers/user.js'
import verify from '../controllers/verify.js'

const router = express.Router()
/**
 * can be queryed with _id to get specific user
 * can be queryed with verified: pending to get non verified users
 * can be queryed with roles, to get list of users and helpers
 * not queryed at all to get all users
 * 
 */
router.post('/user', getUser)

router.post('/password', changePassword)

router.post('/verify/:id', verify)// verify a pending user profile

router.post('/notification', getNotif) // gets the list of notication

//chat

export default router